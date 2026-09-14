// =============================================================================
// Skill Detective — Learning Path Service
// Manages weekly curricula, lesson progress persistence, and skill-gap recommendations
// =============================================================================

import { LearningPath, SkillCategory } from '../types';
import { StorageAdapter } from './storageAdapter';
import { ScoringEngine } from './scoringEngine';

export class LearningService {
  /**
   * Retrieves all learning paths with current user lesson progress and calibrated scores
   */
  public static getLearningPaths(userId: string): LearningPath[] {
    const paths = StorageAdapter.getLearningPaths(userId);
    const userScores = StorageAdapter.getSkillScores(userId);

    return paths.map((path) => {
      const scoreObj = userScores.find((s) => s.skillId === path.skillTarget);
      return {
        ...path,
        currentScore: scoreObj?.score ?? null
      };
    });
  }

  /**
   * Toggles completion status of a lesson, awards XP on completion, and logs activity
   */
  public static toggleLesson(userId: string, lessonId: string, completed: boolean): void {
    StorageAdapter.toggleLessonProgress(userId, lessonId, completed);

    if (completed) {
      const xpKey = `xp_${userId}_lesson_${lessonId}`;
      StorageAdapter.awardXp(userId, 25, xpKey);

      StorageAdapter.recordActivityLog(
        userId,
        'lesson_completed',
        `Completed learning module task: ${lessonId} (+25 XP).`,
        { lessonId }
      );

      // Check daily streak activity
      StorageAdapter.recordUserActivityStreak(userId);
    }
  }

  /**
   * Intelligently selects the most relevant learning path based on the student's weakest skill
   */
  public static recommendPath(userId: string): LearningPath | null {
    const paths = this.getLearningPaths(userId);
    const userScores = StorageAdapter.getSkillScores(userId);

    const recommendation = ScoringEngine.recommendNextFocus(userScores);
    const matchedPath = paths.find((p) => p.skillTarget === recommendation.targetSkillId);

    return matchedPath || paths[0] || null;
  }
}
