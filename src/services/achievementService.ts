// =============================================================================
// Skill Detective — Achievement Service
// Evaluates real user milestones and unlocks persistent badges
// =============================================================================

import { Achievement } from '../types';
import { StorageAdapter } from './storageAdapter';

export class AchievementService {
  /**
   * Retrieves user achievements with real progress
   */
  public static getAchievements(userId: string): Achievement[] {
    return StorageAdapter.getUserAchievements(userId);
  }

  /**
   * Evaluates all achievement criteria against real user stats and unlocks new badges
   */
  public static checkAndUnlockAchievements(userId: string): string[] {
    const achievements = StorageAdapter.getUserAchievements(userId);
    const attempts = StorageAdapter.getChallengeAttempts(userId).filter((a) => a.isCorrect);
    const streak = StorageAdapter.getUserStreak(userId);
    const skillScores = StorageAdapter.getSkillScores(userId);
    const savedCareers = StorageAdapter.getSavedCareers(userId);

    const unlockedTitles: string[] = [];

    achievements.forEach((ach) => {
      if (ach.unlocked) return; // Already unlocked

      let currentProgress = 0;

      switch (ach.criteriaType) {
        case 'completed_challenges':
          currentProgress = attempts.length;
          break;

        case 'category_challenges_logical':
          currentProgress = attempts.filter((a) => a.challengeId.includes('logic')).length;
          break;

        case 'category_challenges_data-analysis':
          currentProgress = attempts.filter((a) => a.challengeId.includes('data')).length;
          break;

        case 'streak_days':
          currentProgress = streak.currentStreak;
          break;

        case 'skill_score_attention-to-detail': {
          const scoreObj = skillScores.find((s) => s.skillId === 'attention-to-detail');
          currentProgress = scoreObj?.score || 0;
          break;
        }

        case 'saved_careers':
          currentProgress = Object.keys(savedCareers).length;
          break;

        case 'assessed_skills_count':
          currentProgress = skillScores.filter((s) => s.score !== null).length;
          break;

        default:
          currentProgress = 0;
      }

      const shouldUnlock = currentProgress >= ach.progressTotal;

      StorageAdapter.updateAchievementProgress(userId, ach.id, currentProgress, shouldUnlock);

      if (shouldUnlock) {
        unlockedTitles.push(ach.title);

        // Award achievement XP
        const xpKey = `xp_${userId}_ach_${ach.id}`;
        StorageAdapter.awardXp(userId, ach.xpReward, xpKey);

        // Log notification
        StorageAdapter.addNotification(userId, {
          userId,
          title: `🏆 Badge Unlocked: ${ach.title}`,
          description: `You earned the "${ach.title}" badge and +${ach.xpReward} XP!`,
          type: 'milestone',
          isRead: false
        });

        // Log Activity
        StorageAdapter.recordActivityLog(
          userId,
          'achievement_unlocked',
          `Unlocked the "${ach.title}" milestone badge.`,
          { achievementId: ach.id, xpReward: ach.xpReward }
        );
      }
    });

    return unlockedTitles;
  }
}
