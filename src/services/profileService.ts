// =============================================================================
// Skill Detective — Profile Service
// Manages student profile persistence and onboarding flow
// =============================================================================

import { Profile, StudentProfile, SkillData } from '../types';
import { StorageAdapter } from './storageAdapter';
import { ScoringEngine } from './scoringEngine';
import { systemSkills } from '../data/systemSeedData';

export class ProfileService {
  /**
   * Fetches the user profile and converts it into the UI view model
   */
  public static getStudentProfile(userId: string): StudentProfile | null {
    const profile = StorageAdapter.getProfile(userId);
    if (!profile) return null;

    const streak = StorageAdapter.getUserStreak(userId);
    const skills = StorageAdapter.getSkillScores(userId);
    const attempts = StorageAdapter.getChallengeAttempts(userId);

    // Calculate overall verified score
    const assessedScores = skills.filter((s) => s.score !== null).map((s) => s.score as number);
    const overallScore = assessedScores.length > 0 
      ? Math.round(assessedScores.reduce((a, b) => a + b, 0) / assessedScores.length)
      : null;

    // Build real assessment history from actual challenge attempts
    const assessmentHistory = attempts.slice(-5).map((att, idx) => ({
      assessmentNumber: idx + 1,
      date: new Date(att.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: att.scoreEarned,
      label: `Diagnostic #${idx + 1}`
    }));

    return {
      id: profile.id,
      name: profile.fullName || 'Student',
      email: profile.email,
      department: profile.course || profile.institution || 'Undeclared',
      year: profile.year || '1st Year',
      institution: profile.institution || '',
      bio: profile.bio || '',
      interests: profile.interests || [],
      existingSkills: profile.interests || [],
      careerGoals: profile.careerGoals || [],
      level: profile.level || 1,
      xp: profile.xp || 0,
      nextLevelXp: profile.nextLevelXp || 200,
      streakDays: streak.currentStreak || 0,
      lives: profile.lives ?? 4,
      maxLives: profile.maxLives ?? 4,
      overallScore,
      scoreDelta: attempts.length > 0 ? (attempts[attempts.length - 1]?.scoreEarned || 0) - (overallScore || 0) : 0,
      assessmentHistory,
      onboardingCompleted: profile.onboardingCompleted,
      role: profile.role
    };
  }

  /**
   * Updates user profile fields
   */
  public static updateProfile(userId: string, updates: Partial<Profile>): Profile | null {
    const profile = StorageAdapter.getProfile(userId);
    if (!profile) return null;

    const updated = {
      ...profile,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    StorageAdapter.saveProfile(updated);
    StorageAdapter.recordActivityLog(userId, 'profile_updated', 'Updated student academic profile details.');
    return updated;
  }

  /**
   * Completes the onboarding wizard with real user answers
   */
  public static completeOnboarding(
    userId: string, 
    data: {
      name?: string;
      institution?: string;
      course?: string;
      year?: string;
      interests?: string[];
      careerGoals?: string[];
    }
  ): Profile | null {
    const profile = StorageAdapter.getProfile(userId);
    if (!profile) return null;

    const updated: Profile = {
      ...profile,
      fullName: data.name?.trim() || profile.fullName,
      institution: data.institution?.trim() || profile.institution,
      course: data.course?.trim() || profile.course,
      year: data.year || profile.year,
      interests: data.interests || profile.interests,
      careerGoals: data.careerGoals || profile.careerGoals,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString()
    };

    StorageAdapter.saveProfile(updated);
    StorageAdapter.recordActivityLog(userId, 'onboarding_completed', 'Completed initial onboarding setup.');
    return updated;
  }

  /**
   * Transforms raw SkillScores into UI SkillData[] with rubrics
   */
  public static getSkillDataList(userId: string): SkillData[] {
    const rawScores = StorageAdapter.getSkillScores(userId);

    return systemSkills.map((def) => {
      const userScore = rawScores.find((s) => s.skillId === def.id);
      const score = userScore?.score ?? null;
      const feedback = score !== null 
        ? ScoringEngine.generateFeedback(def.id, score)
        : {
            strength: 'Not yet assessed. Complete your first diagnostic to calibrate your baseline score.',
            practice: 'Practice with standard sequence and logic puzzles to establish your benchmark.'
          };

      return {
        id: def.id,
        name: def.name,
        score,
        initialScore: userScore?.initialScore ?? null,
        level: userScore?.level ?? 1,
        status: ScoringEngine.getMasteryStatus(score),
        confidence: userScore?.confidence ?? 'none',
        strength: feedback.strength,
        practice: feedback.practice,
        completedChallenges: userScore?.attemptsCount ?? 0,
        whatIsMeasured: def.whatIsMeasured,
        scoreDelta: userScore?.scoreDelta ?? 0
      };
    });
  }
}
