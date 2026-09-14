-- =============================================================================
-- Migration 002: Seed System Reference Data
-- Contains ONLY system catalogs (skills, challenges, careers, achievements, curricula)
-- STRICTLY NO DUMMY USERS OR FAKE TEST RESULTS
-- =============================================================================

-- 1. Seed Core Competency Skills
INSERT INTO public.skills (id, name, category, description, what_is_measured) VALUES
('attention-to-detail', 'Attention to Detail', 'analytical', 'Identifies subtle structural anomalies, syntax deviations, and edge boundary conditions.', ARRAY['Visual discrepancy detection', 'Structural syntax audit', 'Edge condition awareness', 'Data verification precision']),
('logical', 'Logical Thinking', 'reasoning', 'Recognizes non-linear mathematical patterns, deductive relationships, and sequence rules.', ARRAY['Pattern recognition & synthesis', 'Deductive & inductive reasoning', 'Sequence extrapolation', 'Premise-to-conclusion integrity']),
('problem-solving', 'Problem Solving', 'engineering', 'Breaks complex multi-step bottlenecks into modular, solvable components.', ARRAY['Modular decomposition', 'Algorithmic approach validity', 'Execution accuracy under constraints', 'Solution efficiency']),
('decision-making', 'Decision Making', 'strategy', 'Evaluates risk-benefit trade-offs and prioritizes resources in ambiguous scenarios.', ARRAY['Risk-benefit calculus', 'Decision latency under pressure', 'Resource allocation efficiency', 'Contingency anticipation']),
('data-analysis', 'Data Analysis', 'quantitative', 'Interprets tabular growth metrics, variance analysis, and statistical distributions.', ARRAY['Metric interpretation precision', 'Variance & growth calculation', 'Statistical reasoning', 'Visual chart extraction']),
('creativity', 'Creativity', 'design', 'Proposes divergent alternatives and innovative lateral paths when conventional paths fail.', ARRAY['Divergent conceptualization', 'Lateral solution design', 'Alternative path discovery', 'Reframing rigidity avoidance']),
('communication', 'Communication', 'interpersonal', 'Translates dense technical systems into structured, accessible audience mental models.', ARRAY['Audience-appropriate clarity', 'Syntactic structure & flow', 'Jargon minimization & analogy', 'Information conciseness']),
('coding', 'Coding', 'technical', 'Translates logical rules into clean, resilient, edge-case-safe software implementations.', ARRAY['Syntactic correctness', 'Edge case resilience', 'Algorithmic time/space complexity', 'Code cleanliness & formatting'])
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Default Challenge Templates
INSERT INTO public.challenges (id, title, category, category_label, difficulty, estimated_minutes, xp_reward, type, question_data, solution_data, explanation, is_published) VALUES
(
    'logic-pattern-detective',
    'Arithmetic & Geometric Sequence Extrapolation',
    'logical',
    'Logical Deduction',
    'Medium',
    4,
    60,
    'logic',
    '{
        "question": "Analyze the progression matrix. Determine the next numerical integer following this dual-rule sequence:",
        "sequenceVisual": ["3", "7", "16", "35", "74", "?"],
        "options": [
            {"id": "opt-1", "text": "149", "subtext": "Rule: (n * 2) + step_index"},
            {"id": "opt-2", "text": "153", "subtext": "Rule: (n * 2) + (step_index + 1)"},
            {"id": "opt-3", "text": "148", "subtext": "Rule: Exponential progression"},
            {"id": "opt-4", "text": "155", "subtext": "Rule: Multiplicative summation"}
        ],
        "correctId": "opt-2",
        "hintMessage": "Observe the differences: +4, +9, +19, +39. Notice each step delta is twice the previous delta plus one."
    }'::jsonb,
    '{"correctId": "opt-2"}'::jsonb,
    'Step deltas are: 7-3=4, 16-7=9 (4*2+1), 35-16=19 (9*2+1), 74-35=39 (19*2+1). The next delta is (39*2+1) = 79. Therefore, 74 + 79 = 153.',
    TRUE
),
(
    'coding-deduplicate-array',
    'Array Deduplication with In-Place Order Preservation',
    'coding',
    'Algorithmic Implementation',
    'Medium',
    7,
    80,
    'coding',
    '{
        "prompt": "Implement deduplicateArray(arr): Return an array containing only the first occurrence of each element while strictly preserving original relative ordering. Must run in O(N) time.",
        "constraints": [
            "Input array length: 0 <= N <= 100,000",
            "Elements may include numbers, strings, or booleans",
            "Must achieve linear time O(N) using a Hash Set lookup"
        ],
        "starterCode": {
            "javascript": "function deduplicateArray(arr) {\n  // Write your O(N) solution here\n  const seen = new Set();\n  const result = [];\n  for (const item of arr) {\n    if (!seen.has(item)) {\n      seen.add(item);\n      result.push(item);\n    }\n  }\n  return result;\n}",
            "python": "def deduplicate_array(arr):\n    # Write your O(N) solution here\n    seen = set()\n    result = []\n    for item in arr:\n        if item not in seen:\n            seen.add(item)\n            result.append(item)\n    return result",
            "java": "import java.util.*;\n\npublic class Solution {\n    public static List<Object> deduplicate(List<Object> arr) {\n        Set<Object> seen = new LinkedHashSet<>(arr);\n        return new ArrayList<>(seen);\n    }\n}"
        },
        "testCases": [
            {"id": 1, "input": "[4, 5, 4, 1, 2, 5, 3]", "expected": "[4, 5, 1, 2, 3]", "description": "Standard integer duplicates"},
            {"id": 2, "input": "[\"apple\", \"banana\", \"apple\", \"orange\"]", "expected": "[\"apple\", \"banana\", \"orange\"]", "description": "String array duplicates"},
            {"id": 3, "input": "[]", "expected": "[]", "description": "Empty edge condition"},
            {"id": 4, "input": "[7, 7, 7, 7]", "expected": "[7]", "description": "Uniform identical items"}
        ]
    }'::jsonb,
    '{"validationType": "unit_tests"}'::jsonb,
    'Using an auxiliary Set tracks seen items in O(1) average lookup time, resulting in an optimal O(N) total execution runtime.',
    TRUE
),
(
    'comm-executive-pitch',
    '30-Second Elevator Pitch: Distributed Database Migration',
    'communication',
    'Verbal Synthesis & Pitching',
    'Hard',
    3,
    70,
    'communication',
    '{
        "topic": "Explaining Distributed Database Migration to a Non-Technical CFO",
        "scenario": "Your engineering team needs budget approval to migrate from a monolithic database to a globally distributed cloud architecture. You have 30 seconds with the CFO.",
        "prompt": "Deliver a concise pitch explaining WHY this migration matters, using a physical analogy and quantifiable business risk reduction.",
        "timeLimitSeconds": 30,
        "rubricCriteria": [
            {"name": "Clarity & Jargon Free", "weight": "30%", "description": "Replaces technical terms with intuitive mental models"},
            {"name": "Structural Cohesion", "weight": "30%", "description": "Follows Hook -> Business Risk -> ROI Resolution"},
            {"name": "Vocabulary Precision", "weight": "20%", "description": "Appropriate commercial and operational vocabulary"},
            {"name": "Time Conciseness", "weight": "20%", "description": "Completes message cleanly within the 30-second window"}
        ]
    }'::jsonb,
    '{"rubricEvaluation": true}'::jsonb,
    'Strong responses immediately open with revenue protection (e.g. eliminating checkout downtime during peak sales), frame the monolith as a single-lane highway, and present distributed cloud as multiple synchronized express lanes.',
    TRUE
),
(
    'data-quarterly-analysis',
    'SaaS Churn & Revenue Variance Diagnostic',
    'data-analysis',
    'Quantitative Reasoning',
    'Medium',
    5,
    65,
    'data',
    '{
        "context": "Review the quarterly customer acquisition, churn, and net recurring revenue for Enterprise Tier accounts:",
        "table": {
            "columns": ["Quarter", "New Signups", "Churned Accounts", "Gross Churn %", "Net New ARR ($k)"],
            "rows": [
                ["Q1", 120, 18, "15.0%", "+$240k"],
                ["Q2", 145, 22, "15.1%", "+$290k"],
                ["Q3", 210, 48, "22.8%", "+$280k"],
                ["Q4", 180, 27, "15.0%", "+$315k"]
            ]
        },
        "question": "Which quarter experienced an anomalous spike in churn rate, and what was the net impact on ARR relative to customer acquisition growth?",
        "options": [
            {"id": "q-1", "text": "Q3 churn spiked to 22.8% (+7.8% points), causing ARR growth to stagnate despite a 44% surge in new signups.", "isCorrect": true},
            {"id": "q-2", "text": "Q4 had the lowest performance because total signups decreased from 210 down to 180.", "isCorrect": false},
            {"id": "q-3", "text": "Q2 was anomalous due to highest acquisition cost.", "isCorrect": false},
            {"id": "q-4", "text": "Gross churn remained statistically flat throughout all four quarters.", "isCorrect": false}
        ],
        "explanation": "In Q3, new signups surged by 44.8% (145 -> 210), but churn escalated from 15.1% to 22.8% (48 churned accounts). Consequently, Net New ARR was lower ($280k) than Q2 ($290k)."
    }'::jsonb,
    '{"correctId": "q-1"}'::jsonb,
    'In Q3, gross churn jumped from 15.1% to 22.8%, offsetting the 44.8% increase in acquisition and flattening net ARR.',
    TRUE
),
(
    'attention-security-diff',
    'Infrastructure-as-Code Configuration Security Audit',
    'attention-to-detail',
    'Security & Precision Audit',
    'Medium',
    4,
    65,
    'attention',
    '{
        "context": "Inspect this Terraform / CloudFormation security policy snippet submitted for a production Kubernetes database cluster:",
        "codeSnippet": "resource \"aws_security_group_rule\" \"db_ingress\" {\n  type              = \"ingress\"\n  from_port         = 5432\n  to_port           = 5432\n  protocol          = \"tcp\"\n  cidr_blocks       = [\"0.0.0.0/0\"] # TODO: restrict before launch\n  security_group_id = aws_security_group.db.id\n}",
        "question": "Identify the critical security discrepancy and operational violation in this pull request:",
        "options": [
            {"id": "att-1", "text": "Port 5432 PostgreSQL is publicly exposed to the entire internet via 0.0.0.0/0 CIDR block.", "isCorrect": true},
            {"id": "att-2", "text": "Protocol is TCP instead of UDP.", "isCorrect": false},
            {"id": "att-3", "text": "from_port and to_port must have different integer values.", "isCorrect": false},
            {"id": "att-4", "text": "Missing TLS certificate thumbprint declaration.", "isCorrect": false}
        ],
        "explanation": "Opening database port 5432 to 0.0.0.0/0 allows unauthenticated ingress probes from any IP on the public internet, completely bypassing VPC network perimeter security."
    }'::jsonb,
    '{"correctId": "att-1"}'::jsonb,
    'The CIDR block 0.0.0.0/0 exposes PostgreSQL port 5432 to the entire public web, violating defense-in-depth isolation.',
    TRUE
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    question_data = EXCLUDED.question_data,
    explanation = EXCLUDED.explanation;

-- 3. Seed Career Guidance Catalog
INSERT INTO public.careers (id, title, description, salary_range, demand_growth, skills_required, skills_to_build, learning_path_steps, is_published) VALUES
('qa-engineer', 'QA / Test Automation Engineer', 'Designs automated test suites, detects subtle software regressions, and verifies edge-case resilience across web, mobile, and API layers.', '$75k - $115k', '+18% YoY', ARRAY['Attention to Detail', 'Problem Solving', 'Logical Thinking'], ARRAY['Cypress / Playwright E2E', 'API Testing (Postman)', 'CI/CD Pipelines', 'Python Scripting'], '[{"step": 1, "title": "Manual Testing Methodologies", "duration": "2 weeks"}, {"step": 2, "title": "API & Postman Automation", "duration": "3 weeks"}, {"step": 3, "title": "E2E Testing with Playwright", "duration": "4 weeks"}, {"step": 4, "title": "Portfolio Test Harness", "duration": "3 weeks"}]'::jsonb, TRUE),
('software-developer', 'Software Developer', 'Architects and writes robust, scalable services, UI features, and algorithms powering modern digital platforms.', '$90k - $145k', '+22% YoY', ARRAY['Logical Thinking', 'Problem Solving', 'Coding', 'Attention to Detail'], ARRAY['Data Structures & Algorithms', 'TypeScript & React', 'REST & GraphQL APIs', 'Git Workflow'], '[{"step": 1, "title": "Algorithmic Foundations", "duration": "3 weeks"}, {"step": 2, "title": "Fullstack Web Architecture", "duration": "4 weeks"}, {"step": 3, "title": "State Management & Performance", "duration": "3 weeks"}, {"step": 4, "title": "Production Capstone", "duration": "4 weeks"}]'::jsonb, TRUE),
('product-analyst', 'Product Analyst', 'Partners with engineering and design to interpret behavioral metrics, run A/B experiments, and steer product strategy.', '$85k - $130k', '+19% YoY', ARRAY['Data Analysis', 'Decision Making', 'Problem Solving', 'Communication'], ARRAY['SQL & Funnel Analytics', 'A/B Experimentation', 'Mixpanel / Amplitude', 'Product Strategy'], '[{"step": 1, "title": "Product Funnels & Cohort SQL", "duration": "2 weeks"}, {"step": 2, "title": "Experimentation Design", "duration": "3 weeks"}, {"step": 3, "title": "Dashboard Storytelling", "duration": "2 weeks"}, {"step": 4, "title": "Launch Teardown Case Study", "duration": "3 weeks"}]'::jsonb, TRUE),
('data-analyst', 'Data Analyst', 'Transforms raw relational data into clean actionable business intelligence, interactive dashboards, and strategic forecasts.', '$78k - $120k', '+25% YoY', ARRAY['Data Analysis', 'Logical Thinking', 'Attention to Detail'], ARRAY['Advanced SQL', 'Python / Pandas', 'Power BI / Tableau', 'Statistical Inference'], '[{"step": 1, "title": "SQL Fundamentals & Joins", "duration": "3 weeks"}, {"step": 2, "title": "Data Cleaning with Python", "duration": "3 weeks"}, {"step": 3, "title": "Visual Analytics", "duration": "3 weeks"}, {"step": 4, "title": "Business Case Capstone", "duration": "3 weeks"}]'::jsonb, TRUE),
('cybersecurity-analyst', 'Cybersecurity Analyst', 'Monitors threat perimeters, audits network configurations, dissects packet logs, and safeguards enterprise systems.', '$88k - $135k', '+31% YoY', ARRAY['Attention to Detail', 'Problem Solving', 'Logical Thinking'], ARRAY['Network Security & Wireshark', 'Linux Shell Scripting', 'SIEM Tools (Splunk)', 'OWASP Top 10'], '[{"step": 1, "title": "Networking & TCP/IP", "duration": "3 weeks"}, {"step": 2, "title": "Vulnerability Analysis", "duration": "3 weeks"}, {"step": 3, "title": "SIEM Threat Detection", "duration": "3 weeks"}, {"step": 4, "title": "Security Audit Capstone", "duration": "3 weeks"}]'::jsonb, TRUE),
('ui-ux-designer', 'UI/UX Designer', 'Crafts accessible, intuitive, and visually harmonious digital product experiences grounded in user research.', '$80k - $125k', '+15% YoY', ARRAY['Creativity', 'Attention to Detail', 'Problem Solving'], ARRAY['Figma Auto-layout', 'Design Systems', 'Usability Testing', 'Micro-interactions'], '[{"step": 1, "title": "Design Systems & Figma", "duration": "2 weeks"}, {"step": 2, "title": "Information Architecture", "duration": "3 weeks"}, {"step": 3, "title": "High-Fidelity Prototyping", "duration": "3 weeks"}, {"step": 4, "title": "Usability Case Study", "duration": "3 weeks"}]'::jsonb, TRUE),
('business-analyst', 'Business Analyst', 'Bridges executive leadership and engineering by translating strategic goals into detailed functional specifications.', '$75k - $115k', '+14% YoY', ARRAY['Decision Making', 'Problem Solving', 'Communication'], ARRAY['BPMN Workflow Modeling', 'Agile User Stories', 'Financial Modeling', 'Jira / Confluence'], '[{"step": 1, "title": "Requirements Elicitation", "duration": "2 weeks"}, {"step": 2, "title": "BPMN Process Mapping", "duration": "3 weeks"}, {"step": 3, "title": "Agile Specifications", "duration": "3 weeks"}, {"step": 4, "title": "Business Case Capstone", "duration": "3 weeks"}]'::jsonb, TRUE),
('digital-product-manager', 'Digital Product Manager', 'Owns product vision, roadmap prioritization, cross-functional orchestration, and business outcome delivery.', '$95k - $155k', '+20% YoY', ARRAY['Decision Making', 'Communication', 'Problem Solving'], ARRAY['RICE Prioritization', 'Opportunity Trees', 'User Interview Mastery', 'Architecture Fluency'], '[{"step": 1, "title": "Customer Discovery", "duration": "3 weeks"}, {"step": 2, "title": "Prioritization Models", "duration": "3 weeks"}, {"step": 3, "title": "Cross-Functional Execution", "duration": "3 weeks"}, {"step": 4, "title": "Product Launch Capstone", "duration": "3 weeks"}]'::jsonb, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Career Requirements (Benchmark Scores & Weights)
INSERT INTO public.career_requirements (career_id, skill_id, benchmark_score, weight) VALUES
('qa-engineer', 'attention-to-detail', 85, 1.4),
('qa-engineer', 'problem-solving', 75, 1.1),
('qa-engineer', 'logical', 75, 1.0),
('qa-engineer', 'coding', 60, 0.8),

('software-developer', 'logical', 80, 1.3),
('software-developer', 'coding', 75, 1.4),
('software-developer', 'problem-solving', 80, 1.2),
('software-developer', 'attention-to-detail', 70, 0.9),

('product-analyst', 'data-analysis', 80, 1.4),
('product-analyst', 'decision-making', 75, 1.2),
('product-analyst', 'problem-solving', 70, 1.0),
('product-analyst', 'communication', 70, 1.0),

('data-analyst', 'data-analysis', 85, 1.5),
('data-analyst', 'logical', 75, 1.1),
('data-analyst', 'attention-to-detail', 80, 1.2),
('data-analyst', 'communication', 65, 0.8),

('cybersecurity-analyst', 'attention-to-detail', 90, 1.5),
('cybersecurity-analyst', 'logical', 80, 1.2),
('cybersecurity-analyst', 'problem-solving', 75, 1.1),
('cybersecurity-analyst', 'coding', 65, 0.8),

('ui-ux-designer', 'creativity', 85, 1.4),
('ui-ux-designer', 'attention-to-detail', 80, 1.2),
('ui-ux-designer', 'problem-solving', 70, 1.0),
('ui-ux-designer', 'communication', 75, 1.1),

('business-analyst', 'decision-making', 80, 1.3),
('business-analyst', 'communication', 80, 1.3),
('business-analyst', 'problem-solving', 75, 1.1),
('business-analyst', 'data-analysis', 70, 1.0),

('digital-product-manager', 'decision-making', 85, 1.4),
('digital-product-manager', 'communication', 85, 1.4),
('digital-product-manager', 'problem-solving', 80, 1.2),
('digital-product-manager', 'creativity', 70, 0.9)
ON CONFLICT (career_id, skill_id) DO NOTHING;

-- 5. Seed System Achievements Catalog
INSERT INTO public.achievements (id, title, description, category, xp_reward, progress_total, icon_name, criteria_type, criteria_threshold) VALUES
('first-investigation', 'First Investigation', 'Complete your first interactive skill challenge.', 'Milestone', 50, 1, 'Compass', 'completed_challenges', 1),
('logic-master', 'Logic Master', 'Complete 5 logic deduction challenges.', 'Skill Mastery', 120, 5, 'Cpu', 'category_challenges_logical', 5),
('data-detective', 'Data Detective', 'Complete 5 data analysis challenges.', 'Skill Mastery', 120, 5, 'BarChart2', 'category_challenges_data-analysis', 5),
('streak-champion', '7-Day Consistency', 'Maintain a 7-day challenge activity streak.', 'Consistency', 150, 7, 'Flame', 'streak_days', 7),
('detail-focus', 'Detail Vigilance', 'Reach a score of 85+ in Attention to Detail.', 'Skill Mastery', 150, 85, 'Eye', 'skill_score_attention-to-detail', 85),
('career-explorer', 'Career Strategist', 'Save or bookmark at least 3 career target goals.', 'Exploration', 75, 3, 'Briefcase', 'saved_careers', 3),
('polymath', 'Well Rounded', 'Assess all 8 core competencies with verified scores.', 'Milestone', 250, 8, 'Award', 'assessed_skills_count', 8)
ON CONFLICT (id) DO NOTHING;
