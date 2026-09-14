import { UserAccount, SignupData, LoginCredentials } from '../types/auth';
import { StudentProfile, SkillData, InteractiveChallenge, Achievement } from '../types';
import { createDefaultProfile } from '../data/studentProfileData';
import { initialSkillsData } from '../data/skillsData';
import { challengesData } from '../data/challengesData';
import { achievementsData } from '../data/achievementsData';
import { learningPathsData } from '../data/learningPathsData';

const USERS_STORAGE_KEY = 'skill_detective_users_v2';
const CURRENT_USER_ID_KEY = 'skill_detective_current_user_id_v2';

// Helper to deeply clone template data so each user gets independent instances
const cloneData = <T>(data: T): T => JSON.parse(JSON.stringify(data));

// Seed initial default accounts if none exist
const seedDefaultUsers = (): UserAccount[] => {
  const user1: UserAccount = {
    id: 'user-demo-alex',
    name: 'Alex Chen',
    email: 'alex.chen@university.edu',
    password: 'password123',
    role: 'student',
    department: 'Data Science & AI',
    year: '2nd Year',
    bio: 'Aspiring machine learning researcher and full-stack data engineer passionate about algorithms and problem solving.',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    lastLogin: new Date().toISOString(),
    profile: {
      name: 'Alex Chen',
      department: 'Data Science & AI',
      year: '2nd Year',
      interests: ['Data', 'Technology', 'Problem Solving', 'Cybersecurity'],
      existingSkills: ['Python', 'SQL', 'Data Analysis', 'Problem Solving'],
      level: 4,
      xp: 680,
      nextLevelXp: 1000,
      streakDays: 4,
      lives: 4,
      maxLives: 4,
      overallScore: 74,
      scoreDelta: 6,
      assessmentHistory: [
        {
          assessmentNumber: 1,
          date: new Date(Date.now() - 25 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          score: 68,
          label: 'Diagnostic Assessment'
        },
        {
          assessmentNumber: 2,
          date: new Date(Date.now() - 5 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          score: 74,
          label: 'Logic & Attention Calibration'
        }
      ]
    },
    skills: cloneData(initialSkillsData),
    challenges: cloneData(challengesData),
    achievements: cloneData(achievementsData),
    learningPaths: cloneData(learningPathsData)
  };

  const user2: UserAccount = {
    id: 'user-demo-jordan',
    name: 'Jordan Taylor',
    email: 'jordan.taylor@university.edu',
    password: 'password123',
    role: 'student',
    department: 'Software Engineering',
    year: '1st Year',
    bio: 'First-year explorer enthusiastic about clean code, web development, and logic games.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    lastLogin: new Date().toISOString(),
    profile: createDefaultProfile('Jordan Taylor', 'Software Engineering', '1st Year', ['Technology', 'Problem Solving'], ['Logical Thinking']),
    skills: cloneData(initialSkillsData),
    challenges: cloneData(challengesData),
    achievements: cloneData(achievementsData),
    learningPaths: cloneData(learningPathsData)
  };

  return [user1, user2];
};

class AuthService {
  private users: UserAccount[] = [];
  private currentUserId: string | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      } else {
        this.users = seedDefaultUsers();
        this.saveUsersToStorage();
      }

      const storedCurrentId = localStorage.getItem(CURRENT_USER_ID_KEY);
      if (storedCurrentId && this.users.some(u => u.id === storedCurrentId)) {
        this.currentUserId = storedCurrentId;
      } else if (this.users.length > 0) {
        // Default to first user on initial load if no guest selection
        this.currentUserId = this.users[0].id;
        localStorage.setItem(CURRENT_USER_ID_KEY, this.users[0].id);
      } else {
        this.currentUserId = null;
      }
    } catch {
      this.users = seedDefaultUsers();
      this.currentUserId = this.users[0]?.id ?? null;
    }
  }

  private saveUsersToStorage(): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
    } catch (err) {
      console.error('Failed to save users to localStorage:', err);
    }
  }

  public getUsers(): UserAccount[] {
    return [...this.users];
  }

  public getUserById(id: string): UserAccount | null {
    return this.users.find(u => u.id === id) || null;
  }

  public getCurrentUser(): UserAccount | null {
    if (!this.currentUserId) return null;
    return this.getUserById(this.currentUserId);
  }

  public signup(data: SignupData): { success: boolean; user?: UserAccount; error?: string } {
    const trimmedEmail = data.email.trim().toLowerCase();
    
    // Check if email already registered
    if (this.users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    if (data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const newProfile = createDefaultProfile(
      data.name.trim(),
      data.department,
      data.year,
      data.interests || ['Technology', 'Problem Solving'],
      data.existingSkills || ['Logical Thinking']
    );

    const newUser: UserAccount = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: data.name.trim(),
      email: trimmedEmail,
      password: data.password,
      role: data.role || 'student',
      department: data.department,
      year: data.year,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      profile: newProfile,
      skills: cloneData(initialSkillsData),
      challenges: cloneData(challengesData),
      achievements: cloneData(achievementsData),
      learningPaths: cloneData(learningPathsData)
    };

    this.users.push(newUser);
    this.saveUsersToStorage();

    // Automatically set as active logged-in user
    this.currentUserId = newUser.id;
    localStorage.setItem(CURRENT_USER_ID_KEY, newUser.id);

    return { success: true, user: newUser };
  }

  public login(credentials: LoginCredentials): { success: boolean; user?: UserAccount; error?: string } {
    const trimmedEmail = credentials.email.trim().toLowerCase();
    const user = this.users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (!user) {
      return { success: false, error: 'Invalid email address or account not found.' };
    }

    if (user.password && user.password !== credentials.password) {
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    user.lastLogin = new Date().toISOString();
    this.saveUsersToStorage();

    this.currentUserId = user.id;
    localStorage.setItem(CURRENT_USER_ID_KEY, user.id);

    return { success: true, user };
  }

  public logout(): void {
    this.currentUserId = null;
    localStorage.removeItem(CURRENT_USER_ID_KEY);
  }

  public switchUser(userId: string): UserAccount | null {
    const target = this.users.find(u => u.id === userId);
    if (!target) return null;

    this.currentUserId = target.id;
    target.lastLogin = new Date().toISOString();
    this.saveUsersToStorage();
    localStorage.setItem(CURRENT_USER_ID_KEY, target.id);
    return target;
  }

  public updateUserProfile(userId: string, updates: Partial<StudentProfile>): UserAccount | null {
    const user = this.users.find(u => u.id === userId);
    if (!user) return null;

    user.profile = {
      ...user.profile,
      ...updates
    };

    if (updates.name) user.name = updates.name;
    if (updates.department) user.department = updates.department;
    if (updates.year) user.year = updates.year;

    this.saveUsersToStorage();
    return user;
  }

  public updateUserAccount(userId: string, updates: Partial<UserAccount>): UserAccount | null {
    const user = this.users.find(u => u.id === userId);
    if (!user) return null;

    Object.assign(user, updates);
    this.saveUsersToStorage();
    return user;
  }

  public changePassword(userId: string, oldPass: string, newPass: string): { success: boolean; error?: string } {
    const user = this.users.find(u => u.id === userId);
    if (!user) return { success: false, error: 'User not found' };

    if (user.password && user.password !== oldPass) {
      return { success: false, error: 'Current password does not match.' };
    }

    if (newPass.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    user.password = newPass;
    this.saveUsersToStorage();
    return { success: true };
  }

  public saveUserProgress(
    userId: string,
    profile: StudentProfile,
    skills: SkillData[],
    challenges: InteractiveChallenge[],
    achievements: Achievement[]
  ): void {
    const user = this.users.find(u => u.id === userId);
    if (!user) return;

    user.profile = profile;
    user.skills = skills;
    user.challenges = challenges;
    user.achievements = achievements;
    this.saveUsersToStorage();
  }

  public resetUserProgress(userId: string): UserAccount | null {
    const user = this.users.find(u => u.id === userId);
    if (!user) return null;

    user.profile = createDefaultProfile(user.name, user.department, user.year);
    user.skills = cloneData(initialSkillsData);
    user.challenges = cloneData(challengesData);
    user.achievements = cloneData(achievementsData);

    this.saveUsersToStorage();
    return user;
  }

  public deleteUser(userId: string): boolean {
    const index = this.users.findIndex(u => u.id === userId);
    if (index === -1) return false;

    this.users.splice(index, 1);
    this.saveUsersToStorage();

    if (this.currentUserId === userId) {
      this.currentUserId = this.users[0]?.id || null;
      if (this.currentUserId) {
        localStorage.setItem(CURRENT_USER_ID_KEY, this.currentUserId);
      } else {
        localStorage.removeItem(CURRENT_USER_ID_KEY);
      }
    }

    return true;
  }

  public exportUserData(userId: string): string {
    const user = this.getUserById(userId);
    if (!user) return '{}';

    const cleanExport = {
      account: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
        memberSince: user.createdAt,
        lastLogin: user.lastLogin
      },
      profile: user.profile,
      skillScores: user.skills.map(s => ({
        skill: s.name,
        score: s.score,
        status: s.status,
        completedChallenges: s.completedChallenges
      })),
      achievementsUnlocked: user.achievements.filter(a => a.unlocked).map(a => ({
        title: a.title,
        xpReward: a.xpReward
      }))
    };

    return JSON.stringify(cleanExport, null, 2);
  }
}

export const authService = new AuthService();
