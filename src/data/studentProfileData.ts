import { StudentProfile } from '../types';

export const initialStudentProfile: StudentProfile = {
  name: 'Saif',
  department: 'Computer Engineering',
  year: '2nd Year',
  interests: ['Technology', 'Data', 'Cybersecurity', 'Problem Solving'],
  existingSkills: ['Python', 'SQL', 'Problem Solving', 'Data Analysis'],
  level: 7,
  xp: 1240,
  nextLevelXp: 1500,
  streakDays: 7,
  lives: 4,
  maxLives: 4,
  overallScore: 78,
  scoreDelta: 8,
  assessmentHistory: [
    { assessmentNumber: 1, date: 'Jul 14, 2026', score: 64, label: 'Diagnostic Assessment' },
    { assessmentNumber: 2, date: 'Aug 18, 2026', score: 71, label: 'Mid-Term Calibration' },
    { assessmentNumber: 3, date: 'Sep 10, 2026', score: 78, label: 'Comprehensive Evaluation' }
  ]
};
