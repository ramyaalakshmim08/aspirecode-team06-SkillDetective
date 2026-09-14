import { 
  SkillDefinition, 
  InteractiveChallenge, 
  CareerMatch, 
  CareerRequirement, 
  Achievement, 
  LearningPath 
} from '../types';

export const systemSkills: SkillDefinition[] = [
  {
    id: 'attention-to-detail',
    name: 'Attention to Detail',
    category: 'analytical',
    description: 'Identifies subtle structural anomalies, syntax deviations, and edge boundary conditions under tight constraints.',
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
    category: 'reasoning',
    description: 'Recognizes non-linear mathematical patterns, deductive relationships, and sequence extrapolation rules.',
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
    category: 'engineering',
    description: 'Breaks down complex multi-step bottlenecks into modular, solvable algorithmic components.',
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
    category: 'strategy',
    description: 'Evaluates risk-benefit trade-offs and prioritizes resources pragmatically in ambiguous scenarios.',
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
    category: 'quantitative',
    description: 'Interprets tabular growth metrics, variance analysis, and statistical distributions with rigor.',
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
    category: 'design',
    description: 'Proposes divergent alternatives and innovative lateral paths when conventional linear paths fail.',
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
    category: 'interpersonal',
    description: 'Translates dense technical systems into structured, accessible audience mental models.',
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
    category: 'technical',
    description: 'Translates logical rules into clean, resilient, edge-case-safe software implementations.',
    whatIsMeasured: [
      'Syntactic correctness',
      'Edge case resilience (duplicates/empty)',
      'Algorithmic time/space complexity',
      'Code cleanliness & formatting'
    ]
  }
];

export const systemChallenges: InteractiveChallenge[] = [
  {
    id: 'logic-pattern-detective',
    title: 'Arithmetic & Geometric Sequence Extrapolation',
    category: 'logical',
    categoryLabel: 'Logical Deduction',
    difficulty: 'Medium',
    estimatedMinutes: 4,
    xpReward: 60,
    status: 'Available',
    type: 'logic',
    instructions: 'Examine the integer progression. Determine the missing term based on the recurrence relation.',
    isPublished: true,
    logicQuestion: {
      question: 'Analyze the progression matrix. Determine the next numerical integer following this dual-rule sequence:',
      sequenceVisual: ['3', '7', '16', '35', '74', '?'],
      options: [
        { id: 'opt-1', text: '149', subtext: 'Rule: (n * 2) + step_index' },
        { id: 'opt-2', text: '153', subtext: 'Rule: (n * 2) + (step_index + 1)' },
        { id: 'opt-3', text: '148', subtext: 'Rule: Exponential progression' },
        { id: 'opt-4', text: '155', subtext: 'Rule: Multiplicative summation' }
      ],
      correctId: 'opt-2',
      hintMessage: 'Observe the differences: +4, +9, +19, +39. Notice each step delta is twice the previous delta plus one.'
    },
    explanation: 'Step deltas are: 7-3=4, 16-7=9 (4*2+1), 35-16=19 (9*2+1), 74-35=39 (19*2+1). The next delta is (39*2+1) = 79. Therefore, 74 + 79 = 153.'
  },
  {
    id: 'coding-deduplicate-array',
    title: 'Array Deduplication with In-Place Order Preservation',
    category: 'coding',
    categoryLabel: 'Algorithmic Implementation',
    difficulty: 'Medium',
    estimatedMinutes: 7,
    xpReward: 80,
    status: 'Available',
    type: 'coding',
    instructions: 'Implement deduplicateArray to remove duplicate values while maintaining first-occurrence relative order.',
    isPublished: true,
    codingProblem: {
      prompt: 'Implement deduplicateArray(arr): Return an array containing only the first occurrence of each element while strictly preserving original relative ordering. Must run in O(N) time.',
      constraints: [
        'Input array length: 0 <= N <= 100,000',
        'Elements may include numbers, strings, or booleans',
        'Must achieve linear time O(N) using a Hash Set lookup'
      ],
      starterCode: {
        javascript: 'function deduplicateArray(arr) {\n  // Write your O(N) solution here\n  const seen = new Set();\n  const result = [];\n  for (const item of arr) {\n    if (!seen.has(item)) {\n      seen.add(item);\n      result.push(item);\n    }\n  }\n  return result;\n}',
        python: 'def deduplicate_array(arr):\n    # Write your O(N) solution here\n    seen = set()\n    result = []\n    for item in arr:\n        if item not in seen:\n            seen.add(item)\n            result.append(item)\n    return result',
        java: 'import java.util.*;\n\npublic class Solution {\n    public static List<Object> deduplicate(List<Object> arr) {\n        Set<Object> seen = new LinkedHashSet<>(arr);\n        return new ArrayList<>(seen);\n    }\n}'
      },
      testCases: [
        { id: 1, input: '[4, 5, 4, 1, 2, 5, 3]', expected: '[4, 5, 1, 2, 3]', description: 'Standard integer duplicates' },
        { id: 2, input: '["apple", "banana", "apple", "orange"]', expected: '["apple", "banana", "orange"]', description: 'String array duplicates' },
        { id: 3, input: '[]', expected: '[]', description: 'Empty edge condition' },
        { id: 4, input: '[7, 7, 7, 7]', expected: '[7]', description: 'Uniform identical items' }
      ]
    },
    explanation: 'Using an auxiliary Set tracks seen items in O(1) average lookup time, resulting in an optimal O(N) total execution runtime.'
  },
  {
    id: 'comm-executive-pitch',
    title: '30-Second Elevator Pitch: Distributed Database Migration',
    category: 'communication',
    categoryLabel: 'Verbal Synthesis & Pitching',
    difficulty: 'Hard',
    estimatedMinutes: 3,
    xpReward: 70,
    status: 'Available',
    type: 'communication',
    instructions: 'Synthesize the business case for a database migration within 30 seconds for an executive sponsor.',
    isPublished: true,
    communicationProblem: {
      topic: 'Explaining Distributed Database Migration to a Non-Technical CFO',
      scenario: 'Your engineering team needs budget approval to migrate from a monolithic database to a globally distributed cloud architecture. You have 30 seconds with the CFO.',
      prompt: 'Deliver a concise pitch explaining WHY this migration matters, using a physical analogy and quantifiable business risk reduction.',
      timeLimitSeconds: 30,
      rubricCriteria: [
        { name: 'Clarity & Jargon Free', weight: '30%', description: 'Replaces technical terms with intuitive mental models' },
        { name: 'Structural Cohesion', weight: '30%', description: 'Follows Hook -> Business Risk -> ROI Resolution' },
        { name: 'Vocabulary Precision', weight: '20%', description: 'Appropriate commercial and operational vocabulary' },
        { name: 'Time Conciseness', weight: '20%', description: 'Completes message cleanly within the 30-second window' }
      ]
    },
    explanation: 'Strong responses immediately open with revenue protection (e.g. eliminating checkout downtime during peak sales), frame the monolith as a single-lane highway, and present distributed cloud as multiple synchronized express lanes.'
  },
  {
    id: 'data-quarterly-analysis',
    title: 'SaaS Churn & Revenue Variance Diagnostic',
    category: 'data-analysis',
    categoryLabel: 'Quantitative Reasoning',
    difficulty: 'Medium',
    estimatedMinutes: 5,
    xpReward: 65,
    status: 'Available',
    type: 'data',
    instructions: 'Analyze quarterly customer metrics and calculate the divergence between acquisition and churn.',
    isPublished: true,
    dataProblem: {
      context: 'Review the quarterly customer acquisition, churn, and net recurring revenue for Enterprise Tier accounts:',
      table: {
        columns: ['Quarter', 'New Signups', 'Churned Accounts', 'Gross Churn %', 'Net New ARR ($k)'],
        rows: [
          ['Q1', 120, 18, '15.0%', '+$240k'],
          ['Q2', 145, 22, '15.1%', '+$290k'],
          ['Q3', 210, 48, '22.8%', '+$280k'],
          ['Q4', 180, 27, '15.0%', '+$315k']
        ]
      },
      question: 'Which quarter experienced an anomalous spike in churn rate, and what was the net impact on ARR relative to customer acquisition growth?',
      options: [
        { id: 'q-1', text: 'Q3 churn spiked to 22.8% (+7.8% points), causing ARR growth to stagnate despite a 44% surge in new signups.', isCorrect: true },
        { id: 'q-2', text: 'Q4 had the lowest performance because total signups decreased from 210 down to 180.', isCorrect: false },
        { id: 'q-3', text: 'Q2 was anomalous due to highest acquisition cost.', isCorrect: false },
        { id: 'q-4', text: 'Gross churn remained statistically flat throughout all four quarters.', isCorrect: false }
      ],
      explanation: 'In Q3, new signups surged by 44.8% (145 -> 210), but churn escalated from 15.1% to 22.8% (48 churned accounts). Consequently, Net New ARR was lower ($280k) than Q2 ($290k).'
    },
    explanation: 'In Q3, gross churn jumped from 15.1% to 22.8%, offsetting the 44.8% increase in acquisition and flattening net ARR.'
  },
  {
    id: 'attention-security-diff',
    title: 'Infrastructure-as-Code Configuration Security Audit',
    category: 'attention-to-detail',
    categoryLabel: 'Security & Precision Audit',
    difficulty: 'Medium',
    estimatedMinutes: 4,
    xpReward: 65,
    status: 'Available',
    type: 'attention',
    instructions: 'Audit the Terraform infrastructure configuration diff and flag the high-risk perimeter exposure.',
    isPublished: true,
    attentionProblem: {
      context: 'Inspect this Terraform / CloudFormation security policy snippet submitted for a production Kubernetes database cluster:',
      codeSnippet: 'resource "aws_security_group_rule" "db_ingress" {\n  type              = "ingress"\n  from_port         = 5432\n  to_port           = 5432\n  protocol          = "tcp"\n  cidr_blocks       = ["0.0.0.0/0"] # TODO: restrict before launch\n  security_group_id = aws_security_group.db.id\n}',
      question: 'Identify the critical security discrepancy and operational violation in this pull request:',
      options: [
        { id: 'att-1', text: 'Port 5432 PostgreSQL is publicly exposed to the entire internet via 0.0.0.0/0 CIDR block.', isCorrect: true },
        { id: 'att-2', text: 'Protocol is TCP instead of UDP.', isCorrect: false },
        { id: 'att-3', text: 'from_port and to_port must have different integer values.', isCorrect: false },
        { id: 'att-4', text: 'Missing TLS certificate thumbprint declaration.', isCorrect: false }
      ],
      explanation: 'Opening database port 5432 to 0.0.0.0/0 allows unauthenticated ingress probes from any IP on the public internet, completely bypassing VPC network perimeter security.'
    },
    explanation: 'The CIDR block 0.0.0.0/0 exposes PostgreSQL port 5432 to the entire public web, violating defense-in-depth isolation.'
  }
];

export const systemCareerRequirements: Record<string, CareerRequirement[]> = {
  'qa-engineer': [
    { skillId: 'attention-to-detail', benchmarkScore: 85, weight: 1.4 },
    { skillId: 'problem-solving', benchmarkScore: 75, weight: 1.1 },
    { skillId: 'logical', benchmarkScore: 75, weight: 1.0 },
    { skillId: 'coding', benchmarkScore: 60, weight: 0.8 }
  ],
  'software-developer': [
    { skillId: 'logical', benchmarkScore: 80, weight: 1.3 },
    { skillId: 'coding', benchmarkScore: 75, weight: 1.4 },
    { skillId: 'problem-solving', benchmarkScore: 80, weight: 1.2 },
    { skillId: 'attention-to-detail', benchmarkScore: 70, weight: 0.9 }
  ],
  'product-analyst': [
    { skillId: 'data-analysis', benchmarkScore: 80, weight: 1.4 },
    { skillId: 'decision-making', benchmarkScore: 75, weight: 1.2 },
    { skillId: 'problem-solving', benchmarkScore: 70, weight: 1.0 },
    { skillId: 'communication', benchmarkScore: 70, weight: 1.0 }
  ],
  'data-analyst': [
    { skillId: 'data-analysis', benchmarkScore: 85, weight: 1.5 },
    { skillId: 'logical', benchmarkScore: 75, weight: 1.1 },
    { skillId: 'attention-to-detail', benchmarkScore: 80, weight: 1.2 },
    { skillId: 'communication', benchmarkScore: 65, weight: 0.8 }
  ],
  'cybersecurity-analyst': [
    { skillId: 'attention-to-detail', benchmarkScore: 90, weight: 1.5 },
    { skillId: 'logical', benchmarkScore: 80, weight: 1.2 },
    { skillId: 'problem-solving', benchmarkScore: 75, weight: 1.1 },
    { skillId: 'coding', benchmarkScore: 65, weight: 0.8 }
  ],
  'ui-ux-designer': [
    { skillId: 'creativity', benchmarkScore: 85, weight: 1.4 },
    { skillId: 'attention-to-detail', benchmarkScore: 80, weight: 1.2 },
    { skillId: 'problem-solving', benchmarkScore: 70, weight: 1.0 },
    { skillId: 'communication', benchmarkScore: 75, weight: 1.1 }
  ],
  'business-analyst': [
    { skillId: 'decision-making', benchmarkScore: 80, weight: 1.3 },
    { skillId: 'communication', benchmarkScore: 80, weight: 1.3 },
    { skillId: 'problem-solving', benchmarkScore: 75, weight: 1.1 },
    { skillId: 'data-analysis', benchmarkScore: 70, weight: 1.0 }
  ],
  'digital-product-manager': [
    { skillId: 'decision-making', benchmarkScore: 85, weight: 1.4 },
    { skillId: 'communication', benchmarkScore: 85, weight: 1.4 },
    { skillId: 'problem-solving', benchmarkScore: 80, weight: 1.2 },
    { skillId: 'creativity', benchmarkScore: 70, weight: 0.9 }
  ]
};

export const systemCareers: CareerMatch[] = [
  {
    id: 'qa-engineer',
    title: 'QA / Test Automation Engineer',
    matchPercentage: 0,
    salaryRange: '$75k - $115k',
    demandGrowth: '+18% YoY',
    description: 'Designs automated test suites, detects subtle software regressions, and verifies edge-case resilience across web, mobile, and API layers.',
    whyItMatches: [],
    skillsRequired: ['Attention to Detail', 'Problem Solving', 'Logical Thinking', 'Automated Testing'],
    skillsToImprove: ['Coding', 'Communication'],
    compatibilityBreakdown: [],
    whyThisFitsYou: [
      'Identifies subtle syntax and configuration inconsistencies with high precision.',
      'Methodically isolates edge conditions that casual observers overlook.',
      'Translates logical sequence reasoning into reproducible bug reports and integration tests.'
    ],
    skillsToBuild: ['Cypress / Playwright E2E', 'API Testing (Postman)', 'CI/CD Pipeline Integration', 'Python Scripting'],
    learningPathSteps: [
      { step: 1, title: 'Manual Testing Methodologies', description: 'Master boundary value analysis, equivalence partitioning, and exploratory test plans.', duration: '2 weeks' },
      { step: 2, title: 'API & Postman Automation', description: 'Validate REST endpoints, JSON schema assertion scripts, and HTTP status handling.', duration: '3 weeks' },
      { step: 3, title: 'E2E Testing with Playwright', description: 'Write resilient UI automation tests with modern locator assertions and parallel execution.', duration: '4 weeks' },
      { step: 4, title: 'Portfolio Test Harness Project', description: 'Build a comprehensive automated test framework for an open-source web application.', duration: '3 weeks' }
    ]
  },
  {
    id: 'software-developer',
    title: 'Software Developer',
    matchPercentage: 0,
    salaryRange: '$90k - $145k',
    demandGrowth: '+22% YoY',
    description: 'Architects and writes robust, scalable services, UI features, and algorithms powering modern digital platforms.',
    whyItMatches: [],
    skillsRequired: ['Logical Thinking', 'Problem Solving', 'Coding', 'Attention to Detail'],
    skillsToImprove: ['Coding Fundamentals', 'Technical Communication'],
    compatibilityBreakdown: [],
    whyThisFitsYou: [
      'Deductive reasoning enables rapid mental modeling of algorithmic data flows.',
      'High attention to detail minimizes regressions during refactoring and debugging.',
      'Modular problem solving breaks complex requirements into clean functions.'
    ],
    skillsToBuild: ['Data Structures & Algorithms', 'TypeScript & React', 'REST & GraphQL APIs', 'Git Version Control'],
    learningPathSteps: [
      { step: 1, title: 'Algorithmic Foundations', description: 'Deep dive into array manipulation, hash map lookups, and time/space complexity analysis.', duration: '3 weeks' },
      { step: 2, title: 'Fullstack Web Architecture', description: 'Build typed client applications connecting to secure REST and database backends.', duration: '4 weeks' },
      { step: 3, title: 'State Management & Performance', description: 'Optimize render cycles, caching strategies, and asynchronous state trees.', duration: '3 weeks' },
      { step: 4, title: 'Production Capstone Application', description: 'Deploy an end-to-end full-stack web application with authentication and CI/CD.', duration: '4 weeks' }
    ]
  },
  {
    id: 'product-analyst',
    title: 'Product Analyst',
    matchPercentage: 0,
    salaryRange: '$85k - $130k',
    demandGrowth: '+19% YoY',
    description: 'Partners with engineering and design to interpret user behavioral metrics, run A/B experiments, and shape product strategy.',
    whyItMatches: [],
    skillsRequired: ['Data Analysis', 'Decision Making', 'Problem Solving', 'Communication'],
    skillsToImprove: ['Executive Communication', 'SQL Querying'],
    compatibilityBreakdown: [],
    whyThisFitsYou: [
      'Instinctively evaluates trade-offs between speed, user friction, and product value.',
      'Correlates customer acquisition volume with revenue inflection points.',
      'Maintains pragmatic skepticism towards vanity metrics.'
    ],
    skillsToBuild: ['SQL & Funnel Analytics', 'A/B Experimentation Design', 'Mixpanel / Amplitude', 'Product Strategy Frameworks'],
    learningPathSteps: [
      { step: 1, title: 'Product Funnel & Cohort SQL', description: 'Query retention matrices, conversion drops, and user lifecycle events.', duration: '2 weeks' },
      { step: 2, title: 'Hypothesis & Experimentation Design', description: 'Formulate testable product hypotheses and calculate sample sizes and p-values.', duration: '3 weeks' },
      { step: 3, title: 'Dashboard Storytelling', description: 'Build executive-facing dashboards highlighting leading indicators over trailing data.', duration: '2 weeks' },
      { step: 4, title: 'Feature Launch Tear-Down Case Study', description: 'Conduct a comprehensive analytical post-mortem on a recent product release.', duration: '3 weeks' }
    ]
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    matchPercentage: 0,
    salaryRange: '$78k - $120k',
    demandGrowth: '+25% YoY',
    description: 'Transforms raw relational data into clean actionable business intelligence, interactive dashboards, and strategic forecasts.',
    whyItMatches: [],
    skillsRequired: ['Data Analysis', 'Logical Thinking', 'Attention to Detail', 'Communication'],
    skillsToImprove: ['Communication (Visual Storytelling)', 'Coding (Python/Pandas)'],
    compatibilityBreakdown: [],
    whyThisFitsYou: [
      'High attention to detail guarantees data integrity during ETL and schema reconciliation.',
      'Logical sequence skills directly translate into multi-table SQL joins and window calculations.',
      'Spots data outliers quickly and investigates root-cause variances.'
    ],
    skillsToBuild: ['Advanced SQL & Window Functions', 'Python / Pandas', 'Power BI / Tableau', 'Statistical Inference'],
    learningPathSteps: [
      { step: 1, title: 'SQL Fundamentals & Joins', description: 'Aggregate queries, subqueries, Common Table Expressions (CTEs), and indexing.', duration: '3 weeks' },
      { step: 2, title: 'Data Cleaning with Python', description: 'Filter missing values, parse date-times, and transform messy JSON records into Pandas dataframes.', duration: '3 weeks' },
      { step: 3, title: 'Visual Analytics & Dashboards', description: 'Create intuitive Power BI / Tableau dashboards following best visualization practices.', duration: '3 weeks' },
      { step: 4, title: 'End-to-End Business Case Project', description: 'Analyze an open transactional dataset, find retention bottlenecks, and present recommendations.', duration: '3 weeks' }
    ]
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    matchPercentage: 0,
    salaryRange: '$88k - $135k',
    demandGrowth: '+31% YoY',
    description: 'Monitors threat perimeters, audits network configurations, dissects packet logs, and safeguards enterprise data.',
    whyItMatches: [],
    skillsRequired: ['Attention to Detail', 'Problem Solving', 'Logical Thinking', 'Network Protocols'],
    skillsToImprove: ['Scripting / Automation', 'Security Incident Reporting'],
    compatibilityBreakdown: [],
    whyThisFitsYou: [
      'Cybersecurity rewards extreme vigilance and configuration precision.',
      'Spots anomalies in configuration states and authentication headers.',
      'Structured thinking resists social engineering and procedural oversights.'
    ],
    skillsToBuild: ['Network Security & Wireshark', 'Linux Shell Scripting', 'SIEM Tools (Splunk)', 'OWASP Top 10 Vulnerabilities'],
    learningPathSteps: [
      { step: 1, title: 'Networking & TCP/IP Architecture', description: 'Understand OSI layers, packet headers, DNS, and TLS handshake security.', duration: '3 weeks' },
      { step: 2, title: 'Vulnerability Analysis & Linux Defense', description: 'Audit file permissions, inspect system daemon logs, and map open ports.', duration: '3 weeks' },
      { step: 3, title: 'SIEM & Threat Detection', description: 'Construct detection rules in Splunk to flag brute-force and token tampering attempts.', duration: '3 weeks' },
      { step: 4, title: 'Security Audit Portfolio Report', description: 'Conduct a simulated threat assessment and write a remediation roadmap.', duration: '3 weeks' }
    ]
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    matchPercentage: 0,
    salaryRange: '$80k - $125k',
    demandGrowth: '+15% YoY',
    description: 'Crafts accessible, intuitive, and visually harmonious digital product experiences grounded in user research and design systems.',
    whyItMatches: [],
    skillsRequired: ['Creativity', 'Attention to Detail', 'Problem Solving', 'User Research'],
    skillsToImprove: ['Design Communication', 'Prototyping Tools'],
    compatibilityBreakdown: [],
    whyThisFitsYou: [
      'Strong empathy for user cognitive load and friction points.',
      'Visual attention to detail ensures consistent typography scales and spacing grids.',
      'Values clean usability over superficial decorative trends.'
    ],
    skillsToBuild: ['Figma Components & Auto-layout', 'Design Systems Architecture', 'Usability Testing', 'Micro-interactions'],
    learningPathSteps: [
      { step: 1, title: 'Design Systems & Figma Mastery', description: 'Build modular design token systems with accessible color contrast and typography scales.', duration: '2 weeks' },
      { step: 2, title: 'Information Architecture & Wireframing', description: 'Map user mental models, task flows, and low-fidelity prototypes.', duration: '3 weeks' },
      { step: 3, title: 'Interactive High-Fidelity Prototyping', description: 'Create responsive prototypes complete with keyboard focus and realistic state machines.', duration: '3 weeks' },
      { step: 4, title: 'Case Study & Usability Testing', description: 'Test an interactive prototype with 5 users and document iterative refinements.', duration: '3 weeks' }
    ]
  },
  {
    id: 'business-analyst',
    title: 'Business Analyst',
    matchPercentage: 0,
    salaryRange: '$75k - $115k',
    demandGrowth: '+14% YoY',
    description: 'Bridges executive leadership and engineering teams by translating strategic goals into detailed functional specifications.',
    whyItMatches: [],
    skillsRequired: ['Decision Making', 'Problem Solving', 'Communication', 'Business Process Modeling'],
    skillsToImprove: ['Executive Communication', 'Technical Documentation'],
    compatibilityBreakdown: [],
    whyThisFitsYou: [
      'Weighs trade-offs cleanly and prioritizes high-value impact over vanity projects.',
      'Logical sequence abilities help define unambiguous acceptance criteria.',
      'Understands both operational constraints and user needs.'
    ],
    skillsToBuild: ['BPMN Workflow Modeling', 'Agile User Stories & Acceptance Criteria', 'Cost-Benefit Financial Modeling', 'Jira / Confluence'],
    learningPathSteps: [
      { step: 1, title: 'Requirements Elicitation', description: 'Conduct stakeholder discovery sessions and uncover hidden workflow constraints.', duration: '2 weeks' },
      { step: 2, title: 'BPMN & Process Mapping', description: 'Diagram current-state vs future-state operational business architectures.', duration: '3 weeks' },
      { step: 3, title: 'Agile Epics & Technical Specifications', description: 'Author detailed functional specifications with unambiguous Given/When/Then acceptance criteria.', duration: '3 weeks' },
      { step: 4, title: 'Business Case Proposal Capstone', description: 'Formulate a comprehensive ROI projection and rollout strategy for an executive sponsor.', duration: '3 weeks' }
    ]
  },
  {
    id: 'digital-product-manager',
    title: 'Digital Product Manager',
    matchPercentage: 0,
    salaryRange: '$95k - $155k',
    demandGrowth: '+20% YoY',
    description: 'Owns product vision, roadmap prioritization, cross-functional orchestration, and business outcome delivery.',
    whyItMatches: [],
    skillsRequired: ['Decision Making', 'Communication', 'Problem Solving', 'Product Strategy'],
    skillsToImprove: ['Verbal Pitching & Communication', 'Technical Coding Literacy'],
    compatibilityBreakdown: [],
    whyThisFitsYou: [
      'Navigates ambiguous trade-offs between speed, stability, and customer delight.',
      'Attention to detail prevents edge-case requirements from slipping through sprint planning.',
      'Possesses technical empathy needed to collaborate with engineers.'
    ],
    skillsToBuild: ['Roadmap Prioritization Frameworks (RICE)', 'Opportunity Solution Trees', 'User Interview Mastery', 'Technical Architecture Fluency'],
    learningPathSteps: [
      { step: 1, title: 'Customer Discovery & Opportunity Trees', description: 'Learn continuous discovery habits to uncover validated unmet customer pains.', duration: '3 weeks' },
      { step: 2, title: 'Prioritization & Economic Trade-offs', description: 'Apply RICE and Kano models to ruthlessly focus team energy on high-leverage outcomes.', duration: '3 weeks' },
      { step: 3, title: 'Cross-Functional Execution', description: 'Lead sprint rituals, remove engineering blockers, and align marketing with release milestones.', duration: '3 weeks' },
      { step: 4, title: 'Product Launch & Roadmap Pitch', description: 'Deliver a complete product teardown, pitch deck, and measurable launch KPIs.', duration: '3 weeks' }
    ]
  }
];

export const systemAchievements: Achievement[] = [
  {
    id: 'first-investigation',
    title: 'First Investigation',
    description: 'Complete your first interactive skill challenge.',
    category: 'Milestone',
    xpReward: 50,
    progressCurrent: 0,
    progressTotal: 1,
    unlocked: false,
    iconName: 'Compass',
    criteriaType: 'completed_challenges'
  },
  {
    id: 'logic-master',
    title: 'Logic Master',
    description: 'Complete 5 logic deduction challenges.',
    category: 'Skill Mastery',
    xpReward: 120,
    progressCurrent: 0,
    progressTotal: 5,
    unlocked: false,
    iconName: 'Cpu',
    criteriaType: 'category_challenges_logical'
  },
  {
    id: 'data-detective',
    title: 'Data Detective',
    description: 'Complete 5 data analysis challenges.',
    category: 'Skill Mastery',
    xpReward: 120,
    progressCurrent: 0,
    progressTotal: 5,
    unlocked: false,
    iconName: 'BarChart2',
    criteriaType: 'category_challenges_data-analysis'
  },
  {
    id: 'streak-champion',
    title: '7-Day Consistency',
    description: 'Maintain a 7-day challenge activity streak.',
    category: 'Consistency',
    xpReward: 150,
    progressCurrent: 0,
    progressTotal: 7,
    unlocked: false,
    iconName: 'Flame',
    criteriaType: 'streak_days'
  },
  {
    id: 'detail-focus',
    title: 'Detail Vigilance',
    description: 'Reach a calibrated score of 85+ in Attention to Detail.',
    category: 'Skill Mastery',
    xpReward: 150,
    progressCurrent: 0,
    progressTotal: 85,
    unlocked: false,
    iconName: 'Eye',
    criteriaType: 'skill_score_attention-to-detail'
  },
  {
    id: 'career-explorer',
    title: 'Career Strategist',
    description: 'Save or bookmark at least 3 career target goals.',
    category: 'Exploration',
    xpReward: 75,
    progressCurrent: 0,
    progressTotal: 3,
    unlocked: false,
    iconName: 'Briefcase',
    criteriaType: 'saved_careers'
  },
  {
    id: 'polymath',
    title: 'Well Rounded',
    description: 'Assess all 8 core competencies with verified scores.',
    category: 'Milestone',
    xpReward: 250,
    progressCurrent: 0,
    progressTotal: 8,
    unlocked: false,
    iconName: 'Award',
    criteriaType: 'assessed_skills_count'
  }
];

export const systemLearningPaths: LearningPath[] = [
  {
    id: 'improve-communication',
    title: 'Executive & Technical Communication',
    skillTarget: 'communication',
    currentScore: null,
    targetScore: 75,
    estimatedWeeks: 4,
    weeks: [
      {
        week: 1,
        title: 'Speaking & Analogy Fundamentals',
        focus: 'Eliminating jargon and constructing intuitive physical analogies for abstract technical systems.',
        lessons: [
          { id: 'l-101', title: 'The "Explain to a 10-Year-Old" Mental Model', type: 'Lesson', duration: '12 min', completed: false },
          { id: 'l-102', title: 'Interactive Challenge: Cloud & Server Analogies', type: 'Challenge', duration: '5 min', completed: false },
          { id: 'l-103', title: 'Practice: 30-Second Elevator Pitch Voice Record', type: 'Practice', duration: '10 min', completed: false }
        ]
      },
      {
        week: 2,
        title: 'Structured Explanations & Pyramid Principle',
        focus: 'Starting with the conclusion (BLUF: Bottom Line Up Front), followed by supporting pillars.',
        lessons: [
          { id: 'l-201', title: 'The Minto Pyramid Principle in Technical Briefs', type: 'Lesson', duration: '15 min', completed: false },
          { id: 'l-202', title: 'Challenge: Deconstruct an Architecture Post-Mortem', type: 'Challenge', duration: '8 min', completed: false },
          { id: 'l-203', title: 'Practice: Refactor a Rambling Status Update', type: 'Practice', duration: '10 min', completed: false }
        ]
      },
      {
        week: 3,
        title: 'Presentation & Visual Storytelling',
        focus: 'Pairing narrative structure with clean diagramming and audience pacing.',
        lessons: [
          { id: 'l-301', title: 'Slide Simplicity: 1 Idea Per Slide', type: 'Lesson', duration: '14 min', completed: false },
          { id: 'l-302', title: 'Challenge: Spot Cognitive Overload in Product Decks', type: 'Challenge', duration: '7 min', completed: false },
          { id: 'l-303', title: 'Practice: 2-Minute Demo Presentation Simulation', type: 'Practice', duration: '12 min', completed: false }
        ]
      },
      {
        week: 4,
        title: 'Interview & Stakeholder Communication',
        focus: 'Behavioral STAR frameworks and handling tough counter-questions gracefully.',
        lessons: [
          { id: 'l-401', title: 'Mastering the STAR Framework (Situation, Task, Action, Result)', type: 'Lesson', duration: '18 min', completed: false },
          { id: 'l-402', title: 'Challenge: Live Mock Behavioral Question Response', type: 'Challenge', duration: '10 min', completed: false },
          { id: 'l-403', title: 'Practice: Final Communication Milestone Assessment', type: 'Practice', duration: '15 min', completed: false }
        ]
      }
    ]
  },
  {
    id: 'accelerate-coding',
    title: 'Production Coding & Edge Case Handling',
    skillTarget: 'coding',
    currentScore: null,
    targetScore: 75,
    estimatedWeeks: 4,
    weeks: [
      {
        week: 1,
        title: 'Linear Time Complexity & Set Lookups',
        focus: 'Refactoring nested loops O(N^2) into optimal O(N) hashtable iterations.',
        lessons: [
          { id: 'l-501', title: 'Time vs Space Complexity Trade-offs', type: 'Lesson', duration: '14 min', completed: false },
          { id: 'l-502', title: 'Challenge: Array Deduplication Benchmarks', type: 'Challenge', duration: '8 min', completed: false },
          { id: 'l-503', title: 'Practice: Two-Sum Hash Map Implementation', type: 'Practice', duration: '12 min', completed: false }
        ]
      },
      {
        week: 2,
        title: 'Defensive Programming & Boundary Safeguards',
        focus: 'Guarding against null pointer exceptions, negative indices, and memory leaks.',
        lessons: [
          { id: 'l-601', title: 'The Top 5 Edge Case Pitfalls in Technical Interviews', type: 'Lesson', duration: '15 min', completed: false },
          { id: 'l-602', title: 'Challenge: Resilient String Tokenizer', type: 'Challenge', duration: '10 min', completed: false },
          { id: 'l-603', title: 'Practice: Boundary Testing Assertion Harness', type: 'Practice', duration: '15 min', completed: false }
        ]
      },
      {
        week: 3,
        title: 'Recursive Tree & Graph Traversal',
        focus: 'Depth-first search (DFS) and breadth-first search (BFS) state patterns.',
        lessons: [
          { id: 'l-701', title: 'Visualizing Call Stacks and In-Memory Recursion', type: 'Lesson', duration: '16 min', completed: false },
          { id: 'l-702', title: 'Challenge: Binary Search Tree In-Order Traversal', type: 'Challenge', duration: '12 min', completed: false },
          { id: 'l-703', title: 'Practice: Shortest Path in Maze Grid', type: 'Practice', duration: '15 min', completed: false }
        ]
      },
      {
        week: 4,
        title: 'Clean Architecture & Code Modularity',
        focus: 'Single responsibility principles, typed contracts, and unit testing.',
        lessons: [
          { id: 'l-801', title: 'Refactoring Sprawling Functions into Pure Utilities', type: 'Lesson', duration: '15 min', completed: false },
          { id: 'l-802', title: 'Challenge: Production Unit Test Suite Authoring', type: 'Challenge', duration: '12 min', completed: false },
          { id: 'l-803', title: 'Practice: Final Algorithmic Capstone Challenge', type: 'Practice', duration: '20 min', completed: false }
        ]
      }
    ]
  },
  {
    id: 'master-data-analysis',
    title: 'Business Data & Variance Analytics',
    skillTarget: 'data-analysis',
    currentScore: null,
    targetScore: 80,
    estimatedWeeks: 4,
    weeks: [
      {
        week: 1,
        title: 'Tabular Metric Interpretation',
        focus: 'Reading multi-column growth metrics and distinguishing correlation from causation.',
        lessons: [
          { id: 'l-901', title: 'Calculating Quarter-over-Quarter Variance', type: 'Lesson', duration: '10 min', completed: false },
          { id: 'l-902', title: 'Challenge: Spotting Churn Anomalies', type: 'Challenge', duration: '6 min', completed: false }
        ]
      }
    ]
  }
];
