// =============================================================================
// Skill Detective — Transparent Scoring & Calibration Engine
// Evaluates performance, calibrates confidence, tracks trends, and detects weaknesses
// =============================================================================

import { SkillCategory, ConfidenceLevel, SkillScore, ChallengeDifficulty } from '../types';

export interface ScoreCalculationParams {
  isCorrect: boolean;
  difficulty: ChallengeDifficulty;
  timeTakenSeconds: number;
  timeLimitSeconds: number;
  partialAccuracy?: number; // 0.0 - 1.0 for rubrics or multi-test challenges
}

export class ScoringEngine {
  // Difficulty multiplier
  private static DIFFICULTY_MULTIPLIERS: Record<ChallengeDifficulty, number> = {
    Easy: 1.0,
    Medium: 1.15,
    Hard: 1.3
  };

  /**
   * Calculates a normalized attempt performance score (0 - 100)
   */
  public static calculateAttemptScore(params: ScoreCalculationParams): number {
    const { isCorrect, difficulty, timeTakenSeconds, timeLimitSeconds, partialAccuracy } = params;

    // 1. Accuracy factor
    const accuracy = partialAccuracy !== undefined 
      ? Math.max(0, Math.min(1, partialAccuracy))
      : (isCorrect ? 1.0 : 0.25);

    // 2. Base score: 70 for correct, scaled by accuracy
    const baseScore = 70 * accuracy;

    // 3. Difficulty bonus (up to +20 points)
    const diffMultiplier = this.DIFFICULTY_MULTIPLIERS[difficulty] || 1.0;
    const difficultyBonus = 15 * (diffMultiplier - 1.0);

    // 4. Time efficiency factor (+/- 10 points)
    let timeEfficiency = 0;
    if (timeLimitSeconds > 0 && timeTakenSeconds > 0) {
      const timeRatio = timeTakenSeconds / timeLimitSeconds;
      if (timeRatio <= 0.4) {
        timeEfficiency = 10; // Rapid and precise
      } else if (timeRatio <= 0.7) {
        timeEfficiency = 5;
      } else if (timeRatio <= 0.9) {
        timeEfficiency = 0;
      } else {
        timeEfficiency = -5; // Time pressure drag
      }
    }

    const rawScore = Math.round(baseScore + difficultyBonus + timeEfficiency);
    return Math.max(10, Math.min(100, rawScore));
  }

  /**
   * Calibrates a student's overall competency score given a new attempt score
   */
  public static calibrateCompetencyScore(
    currentScoreObj: SkillScore,
    attemptScore: number
  ): {
    newScore: number;
    confidence: ConfidenceLevel;
    attemptsCount: number;
    scoreDelta: number;
    previousScore: number | null;
  } {
    const currentScore = currentScoreObj.score;
    const newAttemptsCount = currentScoreObj.attemptsCount + 1;

    let newScore: number;
    let scoreDelta: number;

    if (currentScore === null) {
      // First baseline assessment
      newScore = attemptScore;
      scoreDelta = 0;
    } else {
      // Calibrated moving average: 65% weight on established baseline, 35% on new attempt
      newScore = Math.round((currentScore * 0.65) + (attemptScore * 0.35));
      scoreDelta = newScore - currentScore;
    }

    // Determine confidence level
    let confidence: ConfidenceLevel = 'none';
    if (newAttemptsCount >= 6) {
      confidence = 'high';
    } else if (newAttemptsCount >= 3) {
      confidence = 'medium';
    } else if (newAttemptsCount >= 1) {
      confidence = 'low';
    }

    return {
      newScore,
      confidence,
      attemptsCount: newAttemptsCount,
      scoreDelta,
      previousScore: currentScore
    };
  }

  /**
   * Categorizes score into qualitative mastery status
   */
  public static getMasteryStatus(score: number | null): 'strong' | 'developing' | 'needs-practice' | 'unassessed' {
    if (score === null) return 'unassessed';
    if (score >= 80) return 'strong';
    if (score >= 65) return 'developing';
    return 'needs-practice';
  }

  /**
   * Generates tailored feedback string based on score and competency
   */
  public static generateFeedback(skillId: SkillCategory, score: number): { strength: string; practice: string } {
    if (score >= 80) {
      return {
        strength: `Exceptional mastery in ${skillId.replace(/-/g, ' ')}. Consistently produces optimal solutions and spots subtle anomalies.`,
        practice: 'Maintain vigilance with high-concurrency stress tests and architectural system boundary reviews.'
      };
    }
    if (score >= 65) {
      return {
        strength: `Solid developing grasp in ${skillId.replace(/-/g, ' ')}. Handles standard problems reliably.`,
        practice: 'Focus on boundary edge cases, time complexity optimizations, and multi-factor scenarios.'
      };
    }
    return {
      strength: `Foundational exposure in ${skillId.replace(/-/g, ' ')}. Grasps basic logic under guidance.`,
      practice: 'Drill foundational tutorials, practice sequence decomposition, and review step-by-step diagnostic post-mortems.'
    };
  }

  /**
   * Identifies unassessed or weakest competencies to intelligently recommend the next challenge
   */
  public static recommendNextFocus(skills: SkillScore[]): {
    targetSkillId: SkillCategory;
    reason: string;
  } {
    // 1. Look for unassessed skills first
    const unassessed = skills.find((s) => s.score === null);
    if (unassessed) {
      return {
        targetSkillId: unassessed.skillId,
        reason: 'Unassessed Competency: Complete your first diagnostic to calibrate your baseline.'
      };
    }

    // 2. Look for low confidence skills
    const lowConfidence = skills.find((s) => s.confidence === 'low');
    if (lowConfidence) {
      return {
        targetSkillId: lowConfidence.skillId,
        reason: 'Low Calibration Confidence: Complete another challenge to reinforce score stability.'
      };
    }

    // 3. Otherwise find lowest score competency
    const sorted = [...skills].sort((a, b) => (a.score ?? 0) - (b.score ?? 0));
    const lowest = sorted[0];

    return {
      targetSkillId: lowest?.skillId || 'logical',
      reason: `Skill Gap Focus: Your ${lowest?.skillId.replace(/-/g, ' ')} score has the highest room for upward calibration.`
    };
  }
}
