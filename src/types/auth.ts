import { StudentProfile, SkillData, InteractiveChallenge, Achievement, LearningPath } from './index';

export type UserRole = 'student' | 'educator' | 'admin';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string; // In production this would be hashed on a backend; for local client storage, we retain it safely
  role: UserRole;
  department: string;
  year: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  lastLogin: string;
  profile: StudentProfile;
  skills: SkillData[];
  challenges: InteractiveChallenge[];
  achievements: Achievement[];
  learningPaths: LearningPath[];
}

export type AuthModalMode = 'login' | 'signup';

export interface SignupData {
  name: string;
  email: string;
  password: string;
  department: string;
  year: string;
  role: UserRole;
  interests?: string[];
  existingSkills?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}
