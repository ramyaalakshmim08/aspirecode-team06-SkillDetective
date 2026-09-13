import { InteractiveChallenge } from '../types';

export const challengesData: InteractiveChallenge[] = [
  {
    id: 'logic-pattern-detective',
    title: 'Pattern Detective',
    category: 'logical',
    categoryLabel: 'Logical Thinking',
    difficulty: 'Medium',
    estimatedMinutes: 3,
    xpReward: 80,
    status: 'Available',
    type: 'logic',
    questionCount: 5,
    completedCount: 3,
    logicQuestion: {
      question: 'Examine the sequence below. Determine the mathematical rule governing the progression and identify which number must replace the question mark.',
      sequenceVisual: ['3', '7', '15', '31', '63', '?'],
      options: [
        { id: 'opt-a', text: '127', subtext: 'Difference doubles each step (+4, +8, +16, +32, +64)' },
        { id: 'opt-b', text: '126', subtext: 'Additive progression offset' },
        { id: 'opt-c', text: '135', subtext: 'Multiplication by 2.2 factor' },
        { id: 'opt-d', text: '95', subtext: 'Linear step progression' }
      ],
      correctId: 'opt-a',
      successMessage: 'Great pattern recognition! You spotted that each step is calculated as (n × 2) + 1, or adding successive powers of 2 (4, 8, 16, 32, 64). 63 + 64 = 127.',
      hintMessage: 'Not quite. Look at how the difference changes between consecutive numbers: (7 - 3 = 4), (15 - 7 = 8), (31 - 15 = 16)... Notice how the gap doubles.'
    }
  },
  {
    id: 'coding-debug-function',
    title: 'Debug the Function',
    category: 'coding',
    categoryLabel: 'Coding',
    difficulty: 'Hard',
    estimatedMinutes: 5,
    xpReward: 120,
    status: 'Available',
    type: 'coding',
    codingProblem: {
      prompt: 'Write or fix a function findUniqueElements(arr) that accepts an array of numbers and returns an array containing only the elements that appear exactly once, preserving their original order.',
      constraints: [
        '1 <= arr.length <= 10^5',
        'Input may contain positive, negative integers or zero',
        'Return array in the order of their original occurrence'
      ],
      starterCode: {
        javascript: `function findUniqueElements(arr) {
  // Bug: Currently returns all distinct elements instead of elements that appear EXACTLY once!
  // Fix this function so it passes all test cases including duplicate edge cases.
  const counts = {};
  for (const num of arr) {
    counts[num] = (counts[num] || 0) + 1;
  }
  
  return arr.filter(num => counts[num] === 1);
}`,
        python: `def find_unique_elements(arr):
    # Counts occurrences and filters for frequency == 1
    counts = {}
    for num in arr:
        counts[num] = counts.get(num, 0) + 1
        
    return [num for num in arr if counts[num] == 1]`,
        java: `public class Solution {
    public static List<Integer> findUniqueElements(List<Integer> arr) {
        Map<Integer, Integer> counts = new LinkedHashMap<>();
        for (int num : arr) {
            counts.put(num, counts.getOrDefault(num, 0) + 1);
        }
        List<Integer> result = new ArrayList<>();
        for (int num : arr) {
            if (counts.get(num) == 1) result.add(num);
        }
        return result;
    }
}`
      },
      testCases: [
        { id: 1, input: '[1, 2, 2, 3, 4, 4, 5]', expected: '[1, 3, 5]', description: 'Standard array with interleaved duplicate pairs' },
        { id: 2, input: '[7, 7, 7, 7]', expected: '[]', description: 'Array where all values repeat (none unique)' },
        { id: 3, input: '[10, 20, 30]', expected: '[10, 20, 30]', description: 'All elements are already distinct' },
        { id: 4, input: '[-5, 0, -5, 12, 0, 4]', expected: '[12, 4]', description: 'Negative numbers and zeroes handling' },
        { id: 5, input: '[42]', expected: '[42]', description: 'Single element boundary condition' }
      ],
      duplicateEdgeCaseWarning: 'Your approach works for standard lists, but verify how you handle arrays where multiple distinct items share frequencies.'
    }
  },
  {
    id: 'comm-explain-cloud',
    title: 'Explain It Simply',
    category: 'communication',
    categoryLabel: 'Communication',
    difficulty: 'Medium',
    estimatedMinutes: 3,
    xpReward: 60,
    status: 'Available',
    type: 'communication',
    communicationProblem: {
      topic: 'Explain Cloud Computing to a Non-Technical Person',
      prompt: 'Imagine you are explaining cloud computing to a grandparent or non-tech business owner who has never heard of servers. You have 30 seconds to provide a crisp, jargon-free analogy.',
      scenario: 'Assessment focuses on structured analogies (e.g. municipal electricity vs owning your own generator, or public library vs personal bookshelf) without buzzwords.',
      timeLimitSeconds: 30,
      rubricCriteria: [
        { name: 'Clarity', weight: '30%', description: 'Avoidance of dense terminology (virtualization, hypervisor, EC2) in favor of clear real-world analogies.' },
        { name: 'Structure', weight: '25%', description: 'Logical narrative: starts with everyday comparison, explains the benefit, and summarizes.' },
        { name: 'Vocabulary', weight: '20%', description: 'Accessible phrasing tuned for someone without a computing background.' },
        { name: 'Conciseness', weight: '25%', description: 'Delivers high signal-to-noise ratio within the 30-second window.' }
      ]
    }
  },
  {
    id: 'data-read-growth',
    title: 'Read the Data',
    category: 'data-analysis',
    categoryLabel: 'Data Analysis',
    difficulty: 'Medium',
    estimatedMinutes: 4,
    xpReward: 75,
    status: 'Available',
    type: 'data',
    dataProblem: {
      context: 'Below is a quarterly SaaS performance report tracking Monthly Active Users (MAU) and Revenue ($ in thousands). Analyze the trajectory to identify performance inflection points.',
      table: {
        columns: ['Month', 'Monthly Active Users', 'New Signups', 'Revenue ($k)', 'MoM Rev Growth'],
        rows: [
          ['January', '12,400', '1,850', '$48.5k', '—'],
          ['February', '13,100', '1,920', '$52.0k', '+7.2%'],
          ['March', '14,800', '2,640', '$63.8k', '+22.7%'],
          ['April', '15,600', '2,100', '$67.2k', '+5.3%'],
          ['May', '16,200', '1,780', '$71.4k', '+6.2%']
        ]
      },
      question: 'Which month experienced the highest month-over-month revenue growth rate, and what metric most strongly correlated with this surge?',
      options: [
        { id: 'opt-1', text: 'March (+22.7%), correlated with a sharp spike in New Signups (2,640).', isCorrect: true },
        { id: 'opt-2', text: 'May (+6.2%), because total revenue reached its all-time high of $71.4k.', isCorrect: false },
        { id: 'opt-3', text: 'February (+7.2%), which had the lowest churn rate.', isCorrect: false },
        { id: 'opt-4', text: 'January, because initial baseline had zero previous month comparison.', isCorrect: false }
      ],
      explanation: 'March demonstrated a +22.7% month-over-month revenue leap ($52.0k to $63.8k), directly coinciding with New Signups jumping from 1,920 to 2,640 (+37.5%). While May had higher absolute revenue, March held the decisive inflection in growth velocity.'
    }
  },
  {
    id: 'attention-spot-error',
    title: 'Spot the Difference',
    category: 'attention-to-detail',
    categoryLabel: 'Attention to Detail',
    difficulty: 'Easy',
    estimatedMinutes: 2,
    xpReward: 50,
    status: 'Completed',
    type: 'attention',
    attentionProblem: {
      context: 'Review the two authentication configuration blocks below. A subtle vulnerability was introduced in the revised update.',
      codeSnippet: `// Production Auth Config Block
const tokenPolicy = {
  issuer: "https://auth.skilldetective.edu",
  audience: "api.v1.prod",
  expiresIn: "1h",
  requireSignedTokens: true,
  algorithm: "RS256"
};

// Proposed Config Update
const tokenPolicy = {
  issuer: "https://auth.skilldetective.edu",
  audience: "api.v1.prod",
  expiresIn: "1h",
  requireSignedTokens: false, // <-- Flag altered
  algorithm: "RS256"
};`,
      question: 'Which critical parameter was unintentionally toggled in the proposed configuration, posing a direct security bypass?',
      options: [
        { id: 'opt-1', text: 'requireSignedTokens was flipped from true to false', isCorrect: true },
        { id: 'opt-2', text: 'algorithm was changed from HS256 to RS256', isCorrect: false },
        { id: 'opt-3', text: 'issuer URL missing trailing slash', isCorrect: false },
        { id: 'opt-4', text: 'expiresIn extended from 15m to 1h', isCorrect: false }
      ],
      explanation: 'The parameter requireSignedTokens was flipped to false, which would instruct the gateway to accept unsigned, forged tokens.'
    }
  },
  {
    id: 'decision-pressure-outage',
    title: 'Decision Under Pressure',
    category: 'decision-making',
    categoryLabel: 'Decision Making',
    difficulty: 'Medium',
    estimatedMinutes: 4,
    xpReward: 70,
    status: 'Available',
    type: 'logic',
    logicQuestion: {
      question: 'Your application server experiences a sudden 400% latency spike during peak final exam submissions. Database CPU is at 98%, while 40 students are midway through submitting answers. What is the most balanced immediate containment step?',
      sequenceVisual: ['CPU: 98%', 'Queue: 420 req/s', 'Active Users: 1,400', 'Failure Rate: 14%'],
      options: [
        { id: 'opt-a', text: 'Enable a read-replica fallback & gracefully rate-limit non-essential analytics queries to preserve write capacity.', subtext: 'Prioritizes submission integrity while shedding secondary load' },
        { id: 'opt-b', text: 'Restart all application instances simultaneously.', subtext: 'Risks dropping 40 active exam submissions' },
        { id: 'opt-c', text: 'Disable all exam submissions until the database cools down.', subtext: 'Causes direct user data loss and panic' },
        { id: 'opt-d', text: 'Wait 15 minutes to observe if traffic subsides naturally.', subtext: 'Likely leads to database cascade crash' }
      ],
      correctId: 'opt-a',
      successMessage: 'Sound decision making! Graceful load shedding of non-critical read queries preserves transactional integrity for live student exam submissions without catastrophic service restart.',
      hintMessage: 'Consider the cost of downtime and data loss. Restarting destroys in-flight transactions, whereas shedding non-essential reads preserves core submissions.'
    }
  },
  {
    id: 'creativity-design-flow',
    title: 'Design the Better Flow',
    category: 'creativity',
    categoryLabel: 'Creativity',
    difficulty: 'Medium',
    estimatedMinutes: 4,
    xpReward: 65,
    status: 'Available',
    type: 'logic',
    logicQuestion: {
      question: 'Students are dropping off at Step 2 of an onboarding flow where they are asked to upload a resume PDF before viewing any skill exercises. How would you creatively solve this friction?',
      sequenceVisual: ['Step 1: Sign Up (98%)', 'Step 2: Upload Resume (24%)', 'Step 3: First Quiz (19%)'],
      options: [
        { id: 'opt-a', text: 'Make resume upload optional & let students immediately try 1 fun mini-challenge first to establish momentum.', subtext: 'Reduces barrier to entry and builds investment before asking for documentation' },
        { id: 'opt-b', text: 'Add a prominent red warning explaining why resumes are mandatory.', subtext: 'Increases pressure and hostility' },
        { id: 'opt-c', text: 'Increase the file size limit to 50MB.', subtext: 'Fails to address the core motivational hesitation' },
        { id: 'opt-d', text: 'Require phone number verification before resume upload.', subtext: 'Adds yet another friction layer' }
      ],
      correctId: 'opt-a',
      successMessage: 'Great UX intuition! Progressive disclosure and delivering early value before asking for high-friction inputs drastically increases completion rates.',
      hintMessage: 'Think about user psychology: asking for an updated resume before they understand what they gain creates massive cognitive friction.'
    }
  },
  {
    id: 'logic-deductive-matrix',
    title: 'Deductive Matrix',
    category: 'logical',
    categoryLabel: 'Logical Thinking',
    difficulty: 'Hard',
    estimatedMinutes: 6,
    xpReward: 100,
    status: 'Locked',
    lockReason: 'Reach Level 8 to unlock this advanced deduction matrix.',
    type: 'logic'
  },
  {
    id: 'attention-concurrency-audit',
    title: 'Concurrency Audit',
    category: 'attention-to-detail',
    categoryLabel: 'Attention to Detail',
    difficulty: 'Hard',
    estimatedMinutes: 7,
    xpReward: 130,
    status: 'Locked',
    lockReason: 'Complete "Debug the Function" and reach 90+ score to unlock.',
    type: 'attention'
  }
];
