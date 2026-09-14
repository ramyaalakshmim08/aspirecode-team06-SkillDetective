import { SkillData } from '../types';

export const initialSkillsData: SkillData[] = [
  {
    id: 'attention-to-detail',
    name: 'Attention to Detail',
    score: 91,
    initialScore: 84,
    level: 9,
    status: 'strong',
    strength: 'Consistently spots subtle structural anomalies, syntax deviations, and edge boundary conditions under tight constraints.',
    practice: 'Challenge yourself with multi-file architectural consistency reviews and high-concurrency log audits.',
    completedChallenges: 18,
    whatIsMeasured: [
      'Visual discrepancy detection',
      'Structural syntax audit',
      'Edge condition awareness',
      'Data verification precision'
    ]
  },
  {
    id: 'logical',
    name: 'Logical Thinking',
    score: 86,
    initialScore: 72,
    level: 8,
    status: 'strong',
    strength: 'You identify non-linear mathematical patterns and inductive reasoning structures exceptionally fast.',
    practice: 'Try advanced sequence and deduction challenges with dynamic branching and algorithmic state transitions.',
    completedChallenges: 14,
    whatIsMeasured: [
      'Pattern recognition & synthesis',
      'Deductive & inductive reasoning',
      'Sequence extrapolation',
      'Premise-to-conclusion integrity'
    ]
  },
  {
    id: 'problem-solving',
    name: 'Problem Solving',
    score: 82,
    initialScore: 74,
    level: 8,
    status: 'strong',
    strength: 'High resilience in breaking down complex multi-step bottlenecks into modular, solvable components.',
    practice: 'Practice time-boxed optimization trade-offs between memory, complexity, and algorithmic clarity.',
    completedChallenges: 12,
    whatIsMeasured: [
      'Modular decomposition',
      'Algorithmic approach validity',
      'Execution accuracy under constraints',
      'Solution efficiency'
    ]
  },
  {
    id: 'decision-making',
    name: 'Decision Making',
    score: 77,
    initialScore: 71,
    level: 7,
    status: 'developing',
    strength: 'Demonstrates balanced risk evaluation and pragmatic resource prioritization in ambiguous scenarios.',
    practice: 'Explore scenario simulations with asymmetric information, incomplete constraints, and high cost of failure.',
    completedChallenges: 9,
    whatIsMeasured: [
      'Risk-benefit calculus',
      'Decision latency under pressure',
      'Resource allocation efficiency',
      'Contingency anticipation'
    ]
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    score: 74,
    initialScore: 68,
    level: 7,
    status: 'developing',
    strength: 'Accurate reading of tabular growth metrics, variance analysis, and statistical summary interpretations.',
    practice: 'Deepen exploratory querying, cross-tabulation of disparate datasets, and statistical outlier identification.',
    completedChallenges: 8,
    whatIsMeasured: [
      'Metric interpretation precision',
      'Variance & growth calculation',
      'Statistical reasoning',
      'Visual chart extraction'
    ]
  },
  {
    id: 'creativity',
    name: 'Creativity',
    score: 69,
    initialScore: 65,
    level: 6,
    status: 'developing',
    strength: 'Proposes divergent alternatives when conventional direct paths are constrained or blocked.',
    practice: 'Engage with open-ended UX flow re-architecting and lateral problem reframing challenges.',
    completedChallenges: 7,
    whatIsMeasured: [
      'Divergent conceptualization',
      'Lateral solution design',
      'Alternative path discovery',
      'Reframing rigidity avoidance'
    ]
  },
  {
    id: 'communication',
    name: 'Communication',
    score: 61,
    initialScore: 54,
    level: 5,
    status: 'needs-practice',
    strength: 'Solid technical vocabulary and structured thought progression in written responses.',
    practice: 'Focus on elevator-pitch synthesis, translating dense technical jargon into accessible, non-technical mental models.',
    completedChallenges: 6,
    whatIsMeasured: [
      'Audience-appropriate clarity',
      'Syntactic structure & flow',
      'Jargon minimization & analogy',
      'Information conciseness'
    ]
  },
  {
    id: 'coding',
    name: 'Coding',
    score: 58,
    initialScore: 50,
    level: 5,
    status: 'needs-practice',
    strength: 'Understands fundamental conditional logic, loops, and basic array transformations.',
    practice: 'Focus on handling duplicate items, boundary edge cases, and algorithmic time complexity.',
    completedChallenges: 5,
    whatIsMeasured: [
      'Syntactic correctness',
      'Edge case resilience (duplicates/empty)',
      'Algorithmic time/space complexity',
      'Code cleanliness & formatting'
    ]
  }
];
