import { StudentProfile } from '../types';

export const initialStudentProfile: StudentProfile = {
  id: '',
  name: '',
  email: '',
  department: '',
  year: '',
  institution: '',
  bio: '',
  interests: [],
  existingSkills: [],
  careerGoals: [],
  level: 1,
  xp: 0,
  nextLevelXp: 200,
  streakDays: 0,
  lives: 4,
  maxLives: 4,
  overallScore: null,
  scoreDelta: 0,
  assessmentHistory: [],
  onboardingCompleted: false,
  role: 'student'
};

export default initialStudentProfile;
