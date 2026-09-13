import { LearningPath } from '../types';

export const learningPathsData: LearningPath[] = [
  {
    id: 'improve-communication',
    title: 'Executive & Technical Communication',
    skillTarget: 'Communication',
    currentScore: 61,
    targetScore: 75,
    estimatedWeeks: 4,
    weeks: [
      {
        week: 1,
        title: 'Speaking & Analogy Fundamentals',
        focus: 'Eliminating jargon and constructing intuitive physical analogies for abstract technical systems.',
        lessons: [
          { id: 'l-101', title: 'The "Explain to a 10-Year-Old" Mental Model', type: 'Lesson', duration: '12 min', completed: true },
          { id: 'l-102', title: 'Interactive Challenge: Cloud & Server Analogies', type: 'Challenge', duration: '5 min', completed: true },
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
    skillTarget: 'Coding',
    currentScore: 58,
    targetScore: 75,
    estimatedWeeks: 4,
    weeks: [
      {
        week: 1,
        title: 'Array Manipulations & Hash Map Frequency',
        focus: 'Optimizing O(n^2) nested lookups down to O(n) hash map counts.',
        lessons: [
          { id: 'c-101', title: 'Hash Map Lookup Tables in Python & JS', type: 'Lesson', duration: '15 min', completed: true },
          { id: 'c-102', title: 'Challenge: Debug the Function (Duplicate Elements)', type: 'Challenge', duration: '8 min', completed: false },
          { id: 'c-103', title: 'Practice: 3 Rapid Frequency Drills', type: 'Practice', duration: '12 min', completed: false }
        ]
      },
      {
        week: 2,
        title: 'Defensive Coding & Boundary Conditions',
        focus: 'Anticipating nulls, undefined keys, negative indices, and empty array inputs.',
        lessons: [
          { id: 'c-201', title: 'Boundary Value Testing in Code', type: 'Lesson', duration: '14 min', completed: false },
          { id: 'c-202', title: 'Challenge: Defend the Payment Gateway Validator', type: 'Challenge', duration: '10 min', completed: false },
          { id: 'c-203', title: 'Practice: Edge Case Stress Test Run', type: 'Practice', duration: '15 min', completed: false }
        ]
      },
      {
        week: 3,
        title: 'Two Pointers & Sliding Window Mechanics',
        focus: 'Subarray problems and in-place array re-indexing without memory bloat.',
        lessons: [
          { id: 'c-301', title: 'The Two-Pointer In-Place Reversal Pattern', type: 'Lesson', duration: '16 min', completed: false },
          { id: 'c-302', title: 'Challenge: Longest Substring Without Repeating Items', type: 'Challenge', duration: '12 min', completed: false },
          { id: 'c-303', title: 'Practice: Sliding Window Maxima', type: 'Practice', duration: '15 min', completed: false }
        ]
      },
      {
        week: 4,
        title: 'Clean Code & Readable Architecture',
        focus: 'Meaningful naming, modular decomposition, and single-responsibility functions.',
        lessons: [
          { id: 'c-401', title: 'Refactoring Spaghetti Code into Pure Functions', type: 'Lesson', duration: '20 min', completed: false },
          { id: 'c-402', title: 'Challenge: Modularize a Monolithic Script', type: 'Challenge', duration: '15 min', completed: false },
          { id: 'c-403', title: 'Practice: Final Timed Coding Benchmark', type: 'Practice', duration: '20 min', completed: false }
        ]
      }
    ]
  }
];
