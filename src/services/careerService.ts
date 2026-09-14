// =============================================================================
// Skill Detective — Dynamic Career Matching & Compatibility Engine
// Calculates real compatibility from verified skill scores, skill gaps & goal tracking
// =============================================================================

import { CareerMatch, CareerRequirement, SkillScore } from '../types';
import { StorageAdapter } from './storageAdapter';
import { systemCareerRequirements, systemSkills } from '../data/systemSeedData';

export class CareerService {
  /**
   * Retrieves dynamically matched careers based on real user verified scores
   */
  public static getCareerMatches(userId: string): CareerMatch[] {
    const catalog = StorageAdapter.getCareersCatalog();
    const userScores = StorageAdapter.getSkillScores(userId);
    const savedGoals = StorageAdapter.getSavedCareers(userId);

    // Map user scores for quick lookup
    const scoreMap = new Map<string, number | null>();
    userScores.forEach((s) => scoreMap.set(s.skillId, s.score));

    // Check how many skills have been assessed
    const assessedCount = userScores.filter((s) => s.score !== null).length;

    return catalog.map((career) => {
      const requirements = systemCareerRequirements[career.id] || [];

      // If user has zero assessments, return unassessed state
      if (assessedCount === 0) {
        return {
          ...career,
          matchPercentage: 0,
          whyItMatches: ['Complete initial diagnostic assessments to generate compatibility evidence.'],
          skillsToImprove: career.skillsRequired,
          compatibilityBreakdown: requirements.map((req) => ({
            skill: systemSkills.find((s) => s.id === req.skillId)?.name || req.skillId,
            percentage: 0,
            benchmark: req.benchmarkScore
          })),
          isSaved: Boolean(savedGoals[career.id]),
          goalStatus: savedGoals[career.id],
          skillGapScore: 100
        };
      }

      // Calculate weighted compatibility
      let totalWeightedScore = 0;
      let totalWeight = 0;
      let maxGap = 0;

      const breakdown: { skill: string; percentage: number; benchmark: number }[] = [];
      const whyItMatches: string[] = [];
      const skillsToImprove: string[] = [];

      requirements.forEach((req) => {
        const userScore = scoreMap.get(req.skillId);
        const skillName = systemSkills.find((s) => s.id === req.skillId)?.name || req.skillId;
        const effectiveScore = userScore ?? 0;

        // Ratio of user score to benchmark (capped at 1.1x)
        const ratio = Math.min(1.1, effectiveScore / req.benchmarkScore);
        totalWeightedScore += ratio * req.weight;
        totalWeight += req.weight;

        const gap = Math.max(0, req.benchmarkScore - effectiveScore);
        if (gap > maxGap) maxGap = gap;

        breakdown.push({
          skill: skillName,
          percentage: Math.min(100, Math.round(ratio * 100)),
          benchmark: req.benchmarkScore
        });

        if (effectiveScore >= req.benchmarkScore - 5 && userScore !== null) {
          whyItMatches.push(`Strong ${skillName} (${effectiveScore} / ${req.benchmarkScore} benchmark)`);
        } else if (gap > 0) {
          skillsToImprove.push(`${skillName} (Gap: ${gap} pts)`);
        }
      });

      const rawPercentage = totalWeight > 0 
        ? Math.round((totalWeightedScore / totalWeight) * 88) 
        : 50;

      // Penalize slightly if key competencies have not been assessed yet
      const confidencePenalty = Math.max(0, (requirements.length - assessedCount) * 5);
      const matchPercentage = Math.max(15, Math.min(96, rawPercentage - confidencePenalty));

      return {
        ...career,
        matchPercentage,
        whyItMatches: whyItMatches.length > 0 ? whyItMatches : ['Baseline aptitude developing through active challenges.'],
        skillsToImprove: skillsToImprove.length > 0 ? skillsToImprove : ['Maintain continuous practice to solidify mastery.'],
        compatibilityBreakdown: breakdown,
        isSaved: Boolean(savedGoals[career.id]),
        goalStatus: savedGoals[career.id],
        skillGapScore: maxGap
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
  }

  /**
   * Sets the user's career goal or bookmark status
   */
  public static setGoalStatus(
    userId: string,
    careerId: string,
    status: 'primary_goal' | 'secondary_goal' | 'exploring' | 'saved' | null
  ): void {
    StorageAdapter.setSavedCareerStatus(userId, careerId, status);
    if (status) {
      StorageAdapter.recordActivityLog(
        userId,
        'career_saved',
        `Marked career as ${status.replace('_', ' ')}.`,
        { careerId, status }
      );
      // Trigger achievement check
      import('./achievementService').then(({ AchievementService }) => {
        AchievementService.checkAndUnlockAchievements(userId);
      });
    }
  }

  /**
   * Compares 2 or 3 careers side by side
   */
  public static compareCareers(userId: string, careerIds: string[]): CareerMatch[] {
    const matches = this.getCareerMatches(userId);
    return matches.filter((m) => careerIds.includes(m.id));
  }
}
