import { Achievement } from '../types';

export const achievementsData: Achievement[] = [
  {
    id: 'first-investigation',
    title: 'First Investigation',
    description: 'Complete your first interactive skill challenge.',
    category: 'Milestone',
    xpReward: 50,
    progressCurrent: 1,
    progressTotal: 1,
    unlocked: true,
    unlockedDate: 'Sep 02, 2026',
    iconName: 'Compass'
  },
  {
    id: 'detail-focus',
    title: 'Detail Focus',
    description: 'Achieve a score of 90+ in the Attention to Detail domain.',
    category: 'Skill Mastery',
    xpReward: 150,
    progressCurrent: 91,
    progressTotal: 90,
    unlocked: true,
    unlockedDate: 'Sep 09, 2026',
    iconName: 'Eye'
  },
  {
    id: 'streak-champion',
    title: '7-Day Consistency',
    description: 'Maintain a 7-day challenge streak without breaking the cadence.',
    category: 'Consistency',
    xpReward: 100,
    progressCurrent: 7,
    progressTotal: 7,
    unlocked: true,
    unlockedDate: 'Today',
    iconName: 'Flame'
  },
  {
    id: 'logic-master',
    title: 'Logic Master',
    description: 'Complete 10 logic challenges with positive validation.',
    category: 'Skill Mastery',
    xpReward: 120,
    progressCurrent: 7,
    progressTotal: 10,
    unlocked: false,
    iconName: 'Cpu'
  },
  {
    id: 'data-detective',
    title: 'Data Detective',
    description: 'Complete 10 data and quantitative analysis challenges.',
    category: 'Skill Mastery',
    xpReward: 120,
    progressCurrent: 6,
    progressTotal: 10,
    unlocked: false,
    iconName: 'BarChart2'
  },
  {
    id: 'communication-pro',
    title: 'Communication Pro',
    description: 'Complete the structured verbal & written communication assessment.',
    category: 'Assessment',
    xpReward: 80,
    progressCurrent: 1,
    progressTotal: 1,
    unlocked: true,
    unlockedDate: 'Sep 05, 2026',
    iconName: 'MessageSquare'
  },
  {
    id: 'coding-ninja',
    title: 'Coding Ninja',
    description: 'Score 90+ across all assessed coding and algorithmic challenges.',
    category: 'Skill Mastery',
    xpReward: 200,
    progressCurrent: 58,
    progressTotal: 90,
    unlocked: false,
    iconName: 'Code2'
  },
  {
    id: 'speed-solver',
    title: 'Speed Solver',
    description: 'Solve any medium or hard challenge under 60 seconds with perfect accuracy.',
    category: 'Performance',
    xpReward: 100,
    progressCurrent: 0,
    progressTotal: 1,
    unlocked: false,
    iconName: 'Zap'
  },
  {
    id: 'holistic-thinker',
    title: 'Holistic Thinker',
    description: 'Complete at least one challenge across all 8 fundamental skill areas.',
    category: 'Milestone',
    xpReward: 250,
    progressCurrent: 6,
    progressTotal: 8,
    unlocked: false,
    iconName: 'Layers'
  }
];
