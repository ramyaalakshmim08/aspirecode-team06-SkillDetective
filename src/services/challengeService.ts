// =============================================================================
// Skill Detective — Challenge Execution Service
// Manages challenge retrieval, attempt submissions, scoring, and gamification hooks
// =============================================================================

import { InteractiveChallenge, ChallengeAttempt, SkillCategory } from '../types';
import { StorageAdapter } from './storageAdapter';
import { ScoringEngine, ScoreCalculationParams } from './scoringEngine';
import { AchievementService } from './achievementService';

export interface SubmitChallengeResult {
  attempt: ChallengeAttempt;
  isDuplicate: boolean;
  scoreEarned: number;
  xpEarned: number;
  newSkillScore: number;
  newLevel: number;
  unlockedBadges: string[];
}

export class ChallengeService {
  /**
   * Retrieves all challenges with user-specific status (Completed, Available, etc.)
   */
  public static getChallenges(userId: string): InteractiveChallenge[] {
    const catalog = StorageAdapter.getChallengesCatalog();
    const attempts = StorageAdapter.getChallengeAttempts(userId);
    const completedIds = new Set(
      attempts.filter((a) => a.isCorrect).map((a) => a.challengeId)
    );

    return catalog.map((ch) => ({
      ...ch,
      status: completedIds.has(ch.id) ? 'Completed' : 'Available'
    }));
  }

  /**
   * Retrieves a single challenge by ID
   */
  public static getChallengeById(challengeId: string): InteractiveChallenge | null {
    const catalog = StorageAdapter.getChallengesCatalog();
    return catalog.find((c) => c.id === challengeId) || null;
  }

  /**
   * Submits a challenge attempt, calculates real score, awards XP, updates streak,
   * and triggers achievement checks with idempotency protection.
   */
  public static submitAttempt(
    userId: string,
    challengeId: string,
    params: {
      isCorrect: boolean;
      timeTakenSeconds: number;
      userAnswer?: unknown;
      feedback?: string;
      partialAccuracy?: number;
    }
  ): SubmitChallengeResult {
    const challenge = this.getChallengeById(challengeId);
    if (!challenge) {
      throw new Error(`Challenge not found: ${challengeId}`);
    }

    // 1. Idempotency Key
    const idempotencyKey = `ch_${userId}_${challengeId}_${Date.now()}`;

    // 2. Score Calculation via ScoringEngine
    const scoreParams: ScoreCalculationParams = {
      isCorrect: params.isCorrect,
      difficulty: challenge.difficulty,
      timeTakenSeconds: params.timeTakenSeconds,
      timeLimitSeconds: challenge.estimatedMinutes * 60,
      partialAccuracy: params.partialAccuracy
    };
    const scoreEarned = ScoringEngine.calculateAttemptScore(scoreParams);

    // 3. XP earned (awarded on correct attempts)
    const xpEarned = params.isCorrect ? challenge.xpReward : 10;

    // 4. Record Attempt
    const attempts = StorageAdapter.getChallengeAttempts(userId);
    const attemptCount = attempts.filter((a) => a.challengeId === challengeId).length + 1;

    const attempt: ChallengeAttempt = {
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      challengeId,
      isCorrect: params.isCorrect,
      scoreEarned,
      xpEarned,
      timeTakenSeconds: params.timeTakenSeconds,
      userAnswer: params.userAnswer,
      feedback: params.feedback || challenge.explanation,
      attemptNumber: attemptCount,
      completedAt: new Date().toISOString()
    };

    const { isDuplicate } = StorageAdapter.recordChallengeAttempt(userId, {
      ...attempt,
      idempotencyKey
    });

    if (isDuplicate) {
      return {
        attempt,
        isDuplicate: true,
        scoreEarned: 0,
        xpEarned: 0,
        newSkillScore: 0,
        newLevel: 1,
        unlockedBadges: []
      };
    }

    // 5. Calibrate Competency Score in Database
    const userScores = StorageAdapter.getSkillScores(userId);
    let targetScoreObj = userScores.find((s) => s.skillId === challenge.category);

    if (!targetScoreObj) {
      targetScoreObj = {
        id: `${userId}_${challenge.category}`,
        userId,
        skillId: challenge.category,
        score: null,
        initialScore: null,
        level: 1,
        confidence: 'none',
        attemptsCount: 0,
        previousScore: null,
        scoreDelta: 0
      };
    }

    const calibration = ScoringEngine.calibrateCompetencyScore(targetScoreObj, scoreEarned);
    const updatedScoreObj = {
      ...targetScoreObj,
      score: calibration.newScore,
      initialScore: targetScoreObj.initialScore ?? calibration.newScore,
      confidence: calibration.confidence,
      attemptsCount: calibration.attemptsCount,
      previousScore: calibration.previousScore,
      scoreDelta: calibration.scoreDelta,
      level: Math.floor(calibration.newScore / 10),
      lastAssessedAt: new Date().toISOString()
    };
    StorageAdapter.saveSkillScore(userId, updatedScoreObj);

    // 6. Award XP Idempotently
    const xpKey = `xp_${userId}_attempt_${attempt.id}`;
    const xpResult = StorageAdapter.awardXp(userId, xpEarned, xpKey);

    // 7. Update Daily Streak
    const streakResult = StorageAdapter.recordUserActivityStreak(userId);

    // 8. Log Activity Feed
    StorageAdapter.recordActivityLog(
      userId,
      'challenge_completed',
      `Completed ${challenge.title} with score ${scoreEarned} (+${xpEarned} XP).`,
      { challengeId, scoreEarned, xpEarned }
    );

    // 9. Evaluate Achievements
    const unlockedBadges = AchievementService.checkAndUnlockAchievements(userId);

    // 10. Notifications
    if (streakResult.streakIncreased && streakResult.newStreak > 1) {
      StorageAdapter.addNotification(userId, {
        userId,
        title: `${streakResult.newStreak}-Day Activity Streak!`,
        description: `You have practiced for ${streakResult.newStreak} consecutive days. Keep it up!`,
        type: 'streak',
        isRead: false
      });
    }

    const profile = StorageAdapter.getProfile(userId);
    return {
      attempt,
      isDuplicate: false,
      scoreEarned,
      xpEarned,
      newSkillScore: calibration.newScore,
      newLevel: profile?.level || 1,
      unlockedBadges
    };
  }

  /**
   * Decrements a student's lives count upon diagnostic failure
   */
  public static loseLife(userId: string): number {
    const profile = StorageAdapter.getProfile(userId);
    if (!profile) return 0;

    const remaining = Math.max(0, (profile.lives ?? 4) - 1);
    profile.lives = remaining;
    StorageAdapter.saveProfile(profile);

    return remaining;
  }
}
