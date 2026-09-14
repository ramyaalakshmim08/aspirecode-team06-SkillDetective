// =============================================================================
// Skill Detective — Admin Management Service
// User administration, challenge curation, career benchmark updates, and system metrics
// =============================================================================

import { AdminStats, InteractiveChallenge, CareerMatch, Profile, UserRole } from '../types';
import { StorageAdapter, StoredUserAccount } from './storageAdapter';

export interface AdminUserView {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  institution: string;
  course: string;
  level: number;
  xp: number;
  onboardingCompleted: boolean;
  challengesCompletedCount: number;
  streakDays: number;
  createdAt: string;
}

export class AdminService {
  /**
   * Aggregates platform-wide metrics and KPIs for the administrative dashboard
   */
  public static getStats(): AdminStats {
    return StorageAdapter.getAdminStats();
  }

  /**
   * Lists all registered user accounts with their academic activity metrics
   */
  public static getUsers(): AdminUserView[] {
    const rawUsers = StorageAdapter.getAllUsers();

    return rawUsers.map((u) => {
      const profile = StorageAdapter.getProfile(u.id);
      const attempts = StorageAdapter.getChallengeAttempts(u.id);
      const streak = StorageAdapter.getUserStreak(u.id);

      return {
        id: u.id,
        email: u.email,
        fullName: profile?.fullName || u.fullName,
        role: profile?.role || u.role,
        institution: profile?.institution || 'N/A',
        course: profile?.course || 'N/A',
        level: profile?.level || 1,
        xp: profile?.xp || 0,
        onboardingCompleted: profile?.onboardingCompleted || false,
        challengesCompletedCount: attempts.length,
        streakDays: streak.currentStreak || 0,
        createdAt: u.createdAt
      };
    });
  }

  /**
   * Promotes or demotes user between 'student' and 'admin'
   */
  public static updateUserRole(userId: string, newRole: 'student' | 'admin'): boolean {
    const users = StorageAdapter.getAllUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return false;

    user.role = newRole;
    StorageAdapter.saveUser(user);

    const profile = StorageAdapter.getProfile(userId);
    if (profile) {
      profile.role = newRole;
      StorageAdapter.saveProfile(profile);
    }

    return true;
  }

  /**
   * Creates or edits an assessment challenge in the catalog
   */
  public static saveChallenge(challenge: InteractiveChallenge): void {
    StorageAdapter.saveChallengeToCatalog(challenge);
  }

  /**
   * Deletes or archives a challenge from the catalog
   */
  public static deleteChallenge(challengeId: string): void {
    StorageAdapter.deleteChallengeFromCatalog(challengeId);
  }

  /**
   * Updates or creates a career profile in the catalog
   */
  public static saveCareer(career: CareerMatch): void {
    StorageAdapter.saveCareerToCatalog(career);
  }
}
