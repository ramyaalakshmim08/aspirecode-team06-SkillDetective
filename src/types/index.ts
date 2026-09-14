// =============================================================================
// Skill Detective — Core TypeScript Interfaces & Domain Models
// =============================================================================

export type UserRole = 'student' | 'admin' | 'mentor';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  institution: string;
  course: string;
  year: string;
  bio: string;
  interests: string[];
  careerGoals: string[];
  level: number;
  xp: number;
  nextLevelXp: number;
  lives: number;
  maxLives: number;
  onboardingCompleted: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 8 Core Competencies
export type SkillCategory = 
  | 'attention-to-detail'
  | 'logical' 
  | 'problem-solving' 
  | 'decision-making'
  | 'data-analysis'
  | 'creativity' 
  | 'communication' 
  | 'coding';

export type SkillStatus = 'strong' | 'developing' | 'needs-practice' | 'unassessed';
export type ConfidenceLevel = 'none' | 'low' | 'medium' | 'high';

export interface SkillDefinition {
  id: SkillCategory;
  name: string;
  category: string;
  description: string;
  whatIsMeasured: string[];
}

export interface SkillScore {
  id: string;
  userId: string;
  skillId: SkillCategory;
  score: number | null; // null represents "Not Assessed"
  initialScore: number | null;
  level: number;
  confidence: ConfidenceLevel;
  attemptsCount: number;
  previousScore: number | null;
  scoreDelta: number;
  strength?: string;
  practice?: string;
  lastAssessedAt?: string;
}

// Full view model for UI components
export interface SkillData {
  id: SkillCategory;
  name: string;
  score: number | null; // null = Not Assessed
  initialScore: number | null;
  level: number;
  status: SkillStatus;
  confidence: ConfidenceLevel;
  strength: string;
  practice: string;
  completedChallenges: number;
  whatIsMeasured: string[];
  scoreDelta: number;
}

export type ChallengeDifficulty = 'Easy' | 'Medium' | 'Hard';
export type ChallengeStatus = 'Completed' | 'In Progress' | 'Available' | 'Locked';
export type ChallengeType = 'logic' | 'coding' | 'communication' | 'data' | 'attention';

export interface TestCase {
  id: number;
  input: string;
  expected: string;
  description: string;
}

export interface InteractiveChallenge {
  id: string;
  title: string;
  category: SkillCategory;
  categoryLabel: string;
  difficulty: ChallengeDifficulty;
  estimatedMinutes: number;
  xpReward: number;
  status: ChallengeStatus;
  lockReason?: string;
  type: ChallengeType;
  instructions?: string;
  explanation?: string;
  isPublished?: boolean;
  
  // Logic challenge specific
  logicQuestion?: {
    question: string;
    sequenceVisual: string[];
    options: { id: string; text: string; subtext?: string }[];
    correctId: string;
    successMessage?: string;
    hintMessage?: string;
  };

  // Coding challenge specific
  codingProblem?: {
    prompt: string;
    constraints: string[];
    starterCode: {
      python: string;
      javascript: string;
      java: string;
    };
    testCases: TestCase[];
    duplicateEdgeCaseWarning?: string;
  };

  // Communication challenge specific
  communicationProblem?: {
    topic: string;
    prompt: string;
    scenario: string;
    timeLimitSeconds: number;
    rubricCriteria: { name: string; weight: string; description: string }[];
  };

  // Data Analysis challenge specific
  dataProblem?: {
    context: string;
    table: {
      columns: string[];
      rows: (string | number)[][];
    };
    question: string;
    options: { id: string; text: string; isCorrect: boolean }[];
    explanation: string;
  };

  // Attention to detail challenge specific
  attentionProblem?: {
    context: string;
    codeSnippet: string;
    question: string;
    options: { id: string; text: string; isCorrect: boolean }[];
    explanation: string;
  };
}

export interface ChallengeAttempt {
  id: string;
  userId: string;
  challengeId: string;
  isCorrect: boolean;
  scoreEarned: number;
  xpEarned: number;
  timeTakenSeconds: number;
  userAnswer?: unknown;
  feedback?: string;
  attemptNumber: number;
  completedAt: string;
}

export interface CareerRequirement {
  skillId: SkillCategory;
  benchmarkScore: number;
  weight: number;
}

export interface CareerMatch {
  id: string;
  title: string;
  matchPercentage: number;
  salaryRange: string;
  demandGrowth: string;
  description: string;
  whyItMatches: string[];
  skillsRequired: string[];
  skillsToImprove: string[];
  compatibilityBreakdown: { skill: string; percentage: number; benchmark: number }[];
  whyThisFitsYou: string[];
  skillsToBuild: string[];
  learningPathSteps: {
    step: number;
    title: string;
    description: string;
    duration: string;
  }[];
  isSaved?: boolean;
  goalStatus?: 'primary_goal' | 'secondary_goal' | 'exploring' | 'saved';
  skillGapScore?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  xpReward: number;
  progressCurrent: number;
  progressTotal: number;
  unlocked: boolean;
  unlockedDate?: string;
  iconName: string;
  criteriaType?: string;
}

export interface LearningLesson {
  id: string;
  title: string;
  type: 'Lesson' | 'Challenge' | 'Practice';
  duration: string;
  completed: boolean;
}

export interface LearningWeek {
  week: number;
  title: string;
  focus: string;
  lessons: LearningLesson[];
}

export interface LearningPath {
  id: string;
  title: string;
  skillTarget: SkillCategory | string;
  currentScore: number | null;
  targetScore: number;
  estimatedWeeks: number;
  weeks: LearningWeek[];
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'milestone' | 'recommendation' | 'streak' | 'skill' | 'info';
  isRead: boolean;
  createdAt: string;
}

export interface UserSettings {
  soundEnabled: boolean;
  timerEnabled: boolean;
  reducedMotion: boolean;
  dailyReminders: boolean;
  themeMode: 'light' | 'dark' | 'system';
  publicProfile: boolean;
  showAchievements: boolean;
  showSkills: boolean;
  showCareers: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  eventType: string;
  eventDescription: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  challengesCompleted: number;
  averageScore: number;
  topSkills: { skill: string; avgScore: number }[];
  popularCareers: { career: string; saveCount: number }[];
  completionRate: number;
}

// Student profile view model
export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  institution: string;
  bio: string;
  interests: string[];
  existingSkills: string[];
  careerGoals: string[];
  level: number;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  lives: number;
  maxLives: number;
  overallScore: number | null; // null = Not Assessed
  scoreDelta: number;
  assessmentHistory: {
    assessmentNumber: number;
    date: string;
    score: number;
    label: string;
  }[];
  onboardingCompleted: boolean;
  role: UserRole;
}

export type NavigationTab = 
  | 'dashboard' 
  | 'challenges' 
  | 'skills' 
  | 'careers' 
  | 'learning-path' 
  | 'achievements' 
  | 'progress' 
  | 'profile' 
  | 'settings'
  | 'landing'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'admin'
  | 'report';
