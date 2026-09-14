import { CareerMatch } from '../types';

export const careersData: CareerMatch[] = [
  {
    id: 'qa-engineer',
    title: 'QA Engineer',
    matchPercentage: 88,
    salaryRange: '$75k - $115k',
    demandGrowth: '+18% YoY',
    description: 'Designs structured test suites, detects subtle software regressions, and verifies edge-case resilience across web, mobile, and API layers.',
    whyItMatches: [
      'Exceptional Attention to Detail (91)',
      'Disciplined boundary test verification',
      'Strong structured Problem Solving (82)'
    ],
    skillsRequired: ['Attention to Detail', 'Problem Solving', 'Logical Thinking', 'Automated Testing'],
    skillsToImprove: ['Coding', 'Communication'],
    compatibilityBreakdown: [
      { skill: 'Attention to Detail', percentage: 94 },
      { skill: 'Logical Thinking', percentage: 88 },
      { skill: 'Problem Solving', percentage: 84 },
      { skill: 'Coding Fundamentals', percentage: 65 }
    ],
    whyThisFitsYou: [
      'Your assessment highlights a top 5% score in identifying subtle syntax and configuration inconsistencies.',
      'You methodically isolate edge conditions that casual observers overlook.',
      'Your logical sequence reasoning maps cleanly to writing reproducible bug reports and integration tests.'
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
    matchPercentage: 87,
    salaryRange: '$90k - $145k',
    demandGrowth: '+22% YoY',
    description: 'Architects and writes robust, scalable services, UI features, and algorithms powering modern digital products.',
    whyItMatches: [
      'High Logical Thinking capacity (86)',
      'Strong structured Problem Solving (82)',
      'Sharp Attention to Detail (91)'
    ],
    skillsRequired: ['Logical Thinking', 'Problem Solving', 'Coding', 'Attention to Detail'],
    skillsToImprove: ['Coding Fundamentals', 'Technical Communication'],
    compatibilityBreakdown: [
      { skill: 'Logical Thinking', percentage: 89 },
      { skill: 'Problem Solving', percentage: 85 },
      { skill: 'Attention to Detail', percentage: 92 },
      { skill: 'Coding Implementation', percentage: 60 }
    ],
    whyThisFitsYou: [
      'Your deductive reasoning and pattern recognition enable rapid mental modeling of algorithmic data flows.',
      'Your high attention to detail minimizes regressions during refactoring and debugging.',
      'Your problem-solving score indicates strong stamina when breaking complex requirements into small functions.'
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
    matchPercentage: 85,
    salaryRange: '$85k - $130k',
    demandGrowth: '+19% YoY',
    description: 'Partners with engineering and design to interpret user behavioral metrics, run A/B experiments, and shape product strategy.',
    whyItMatches: [
      'Balanced Data Analysis (74) & Decision Making (77)',
      'Solid user journey problem solving',
      'High rigor in tracking metric discrepancies'
    ],
    skillsRequired: ['Data Analysis', 'Decision Making', 'Problem Solving', 'Communication'],
    skillsToImprove: ['Executive Communication', 'SQL Querying'],
    compatibilityBreakdown: [
      { skill: 'Decision Making', percentage: 82 },
      { skill: 'Attention to Detail', percentage: 90 },
      { skill: 'Data Analysis', percentage: 78 },
      { skill: 'Stakeholder Communication', percentage: 64 }
    ],
    whyThisFitsYou: [
      'You instinctively evaluate trade-offs between speed, user friction, and product value.',
      'Your data assessment showed strong ability to correlate signup volume with revenue inflection points.',
      'You maintain pragmatic skepticism towards vanity metrics.'
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
    matchPercentage: 82,
    salaryRange: '$78k - $120k',
    demandGrowth: '+25% YoY',
    description: 'Transforms raw relational data into clean actionable business intelligence, interactive dashboards, and strategic forecasts.',
    whyItMatches: [
      'Rigorous quantitative precision',
      'Reliable pattern detection in numbers',
      'Solid Data Analysis baseline (74)'
    ],
    skillsRequired: ['Data Analysis', 'Logical Thinking', 'Attention to Detail', 'Communication'],
    skillsToImprove: ['Communication (Visual Storytelling)', 'Coding (Python/Pandas)'],
    compatibilityBreakdown: [
      { skill: 'Attention to Detail', percentage: 92 },
      { skill: 'Data Analysis', percentage: 86 },
      { skill: 'Logical Thinking', percentage: 84 },
      { skill: 'Communication', percentage: 62 }
    ],
    whyThisFitsYou: [
      'Your high attention to detail guarantees data integrity during ETL and schema reconciliation.',
      'Your logical sequence skills directly translate into multi-table SQL joins and window calculations.',
      'You spot data outliers quickly and investigate root-cause variances.'
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
    matchPercentage: 81,
    salaryRange: '$88k - $135k',
    demandGrowth: '+31% YoY',
    description: 'Monitors threat perimeters, audits network configurations, dissects packet logs, and safeguards enterprise data.',
    whyItMatches: [
      'Top-tier Attention to Detail (91)',
      'High deductive reasoning in threat trees',
      'Methodical security policy auditing'
    ],
    skillsRequired: ['Attention to Detail', 'Problem Solving', 'Logical Thinking', 'Network Protocols'],
    skillsToImprove: ['Scripting / Automation', 'Security Incident Reporting'],
    compatibilityBreakdown: [
      { skill: 'Attention to Detail', percentage: 95 },
      { skill: 'Decision Under Pressure', percentage: 80 },
      { skill: 'Logical Deduction', percentage: 84 },
      { skill: 'Coding', percentage: 58 }
    ],
    whyThisFitsYou: [
      'Cybersecurity rewards extreme vigilance; your 91 score in Attention to Detail is an outstanding asset.',
      'You intuitively spot anomalies in configuration states and authentication headers.',
      'Your structured thinking resists social engineering and procedural oversights.'
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
    matchPercentage: 79,
    salaryRange: '$80k - $125k',
    demandGrowth: '+15% YoY',
    description: 'Crafts accessible, intuitive, and visually harmonious digital product experiences grounded in user research and design systems.',
    whyItMatches: [
      'Emerging Creativity (69) & Empathy',
      'Strong Attention to Detail for visual hierarchy',
      'Solid understanding of user flow bottlenecks'
    ],
    skillsRequired: ['Creativity', 'Attention to Detail', 'Problem Solving', 'User Research'],
    skillsToImprove: ['Design Communication', 'Prototyping Tools'],
    compatibilityBreakdown: [
      { skill: 'Attention to Detail', percentage: 88 },
      { skill: 'Creativity & Flow', percentage: 76 },
      { skill: 'Problem Decomposition', percentage: 80 },
      { skill: 'Design Presentation', percentage: 62 }
    ],
    whyThisFitsYou: [
      'You solved the onboarding flow friction challenge with strong empathy for user cognitive load.',
      'Your visual attention to detail ensures consistent typography scales and spacing grids.',
      'You value clean usability over superficial decorative trends.'
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
    matchPercentage: 76,
    salaryRange: '$75k - $115k',
    demandGrowth: '+14% YoY',
    description: 'Bridges executive leadership and engineering teams by translating strategic goals into detailed functional specifications.',
    whyItMatches: [
      'Pragmatic Decision Making (77)',
      'Solid analytical reasoning',
      'Interest in business systems'
    ],
    skillsRequired: ['Decision Making', 'Problem Solving', 'Communication', 'Business Process Modeling'],
    skillsToImprove: ['Executive Communication', 'Technical Documentation'],
    compatibilityBreakdown: [
      { skill: 'Decision Making', percentage: 80 },
      { skill: 'Problem Solving', percentage: 79 },
      { skill: 'Data Reading', percentage: 75 },
      { skill: 'Stakeholder Communication', percentage: 65 }
    ],
    whyThisFitsYou: [
      'You weigh trade-offs cleanly and prioritize high-value impact over vanity projects.',
      'Your logical sequence abilities help define unambiguous acceptance criteria.',
      'You understand both operational constraints and user needs.'
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
    matchPercentage: 74,
    salaryRange: '$95k - $155k',
    demandGrowth: '+20% YoY',
    description: 'Owns product vision, roadmap prioritization, cross-functional orchestration, and business outcome delivery.',
    whyItMatches: [
      'Strong cross-domain curiosity',
      'Solid Decision Making under pressure (77)',
      'Holistic problem solving stamina'
    ],
    skillsRequired: ['Decision Making', 'Communication', 'Problem Solving', 'Product Strategy'],
    skillsToImprove: ['Verbal Pitching & Communication', 'Technical Coding Literacy'],
    compatibilityBreakdown: [
      { skill: 'Decision Making', percentage: 82 },
      { skill: 'Problem Decomposition', percentage: 80 },
      { skill: 'Data-Driven Strategy', percentage: 74 },
      { skill: 'Cross-Functional Pitching', percentage: 61 }
    ],
    whyThisFitsYou: [
      'You excel at navigating ambiguous trade-offs between speed, stability, and customer delight.',
      'Your attention to detail prevents edge-case requirements from slipping through sprint planning.',
      'You possess the technical empathy needed to collaborate with engineers.'
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
