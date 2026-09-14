export type SkillCategory = 
  | 'logical' 
  | 'problem-solving' 
  | 'coding' 
  | 'communication' 
  | 'creativity' 
  | 'data-analysis' 
  | 'decision-making' 
  | 'attention-to-detail';

export type SkillStatus = 'strong' | 'developing' | 'needs-practice';

export interface SkillData {
  id: SkillCategory;
  name: string;
  score: number; // 0 - 100
  initialScore: number;
  level: number;
  status: SkillStatus;
  strength: string;
  practice: string;
  completedChallenges: number;
  whatIsMeasured: string[];
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
  questionCount?: number;
  completedCount?: number;
  
  // Logic challenge specific
  logicQuestion?: {
    question: string;
    sequenceVisual: string[];
    options: { id: string; text: string; subtext?: string }[];
    correctId: string;
    successMessage: string;
    hintMessage: string;
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

export interface CareerMatch {
  id: string;
  title: string;
  matchPercentage: number;
  whyItMatches: string[];
  skillsRequired: string[];
  skillsToImprove: string[];
  description: string;
  salaryRange: string;
  demandGrowth: string;
  compatibilityBreakdown: { skill: string; percentage: number }[];
  whyThisFitsYou: string[];
  skillsToBuild: string[];
  learningPathSteps: {
    step: number;
    title: string;
    description: string;
    duration: string;
  }[];
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
  skillTarget: string;
  currentScore: number;
  targetScore: number;
  estimatedWeeks: number;
  weeks: LearningWeek[];
}

export interface StudentProfile {
  name: string;
  department: string;
  year: string;
  interests: string[];
  existingSkills: string[];
  level: number;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  lives: number;
  maxLives: number;
  overallScore: number;
  scoreDelta: number;
  assessmentHistory: {
    assessmentNumber: number;
    date: string;
    score: number;
    label: string;
  }[];
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
  | 'landing';
