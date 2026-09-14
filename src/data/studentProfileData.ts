import { StudentProfile } from '../types';

export const createDefaultProfile = (
  name: string = 'New Student',
  department: string = 'Computer Engineering',
  year: string = '1st Year',
  interests: string[] = ['Technology', 'Problem Solving'],
  existingSkills: string[] = ['Logical Thinking', 'Curiosity']
): StudentProfile => ({
  name,
  department,
  year,
  interests,
  existingSkills,
  level: 1,
  xp: 0,
  nextLevelXp: 500,
  streakDays: 1,
  lives: 4,
  maxLives: 4,
  overallScore: 65,
  scoreDelta: 0,
  assessmentHistory: [
    {
      assessmentNumber: 1,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      score: 65,
      label: 'Initial Diagnostic Baseline'
    }
  ]
});

export const guestProfile: StudentProfile = {
  name: 'Guest Explorer',
  department: 'General Studies',
  year: '1st Year',
  interests: ['Technology', 'Data', 'Problem Solving'],
  existingSkills: ['Logical Thinking', 'Curiosity'],
  level: 1,
  xp: 0,
  nextLevelXp: 500,
  streakDays: 1,
  lives: 4,
  maxLives: 4,
  overallScore: 60,
  scoreDelta: 0,
  assessmentHistory: []
};

// Default starter profile for initial app bootstrap
export const initialStudentProfile: StudentProfile = createDefaultProfile(
  'Cadet Explorer',
  'Engineering & Technology',
  '1st Year'
);
