# Skill Detective

### ASPIRE CODE AI - TEAM 06

| Name | Role |
|---|---|
| Vishnu Maya | Team Lead |
| Ramyaa Lakshmi M | Git & Documentation Owner |
| Monika | Developer |
| Dhanya | Developer |
| Moushme | Presenter/Demo Owner |
| Saif Modan | R&D/Research Owner |

---

> Discover what you are good at. Find where you can go next.

Skill Detective is an academic skill-discovery platform designed to help students identify their cognitive strengths, diagnose improvement areas, evaluate career compatibility, and follow personalized learning roadmaps through interactive challenges.

Rather than relying on speculative personality surveys, Skill Detective evaluates students through empirical problem-solving diagnostics, deduction exercises, algorithmic coding tests, and communication evaluations.

---

## Key Features

- **Empirical Diagnostics**: Interactive challenge runners assess eight core competencies without vague personality tests.
- **Five Diagnostic Modes**:
  - **Logic & Sequence Deduction**: Mathematical progression and reasoning puzzles.
  - **Live Code Execution**: Split-screen code editor with multi-language support (JavaScript, Python, Java), starter templates, and test case assertion runners.
  - **Verbal Communication Simulation**: 30-second prompt timer, simulated audio metering, transcription input, and multi-criteria rubric evaluation (Clarity, Structure, Vocabulary, Conciseness).
  - **Data Analysis Diagnostic**: Tabular data evaluation testing trend detection and quarterly growth comparisons.
  - **Attention to Detail**: Infrastructure security audit and configuration diff inspection.
- **Competency Profile & Calibration**:
  - Eight assessed skills: Attention to Detail, Logical Thinking, Problem Solving, Decision Making, Data Analysis, Communication, Creativity, and Coding.
  - Transparent measurement standards with demonstrated strengths, practice recommendations, and baseline versus current scores.
  - Switchable visualization modes: horizontal competency bars and SVG radar chart.
- **Data-Driven Career Matching**:
  - Algorithmic match percentage calculation based on actual challenge performance.
  - Detailed career profiles with market compensation benchmarks, industry demand trajectory, matching reasons, and target skills to build.
  - Four-step actionable career development roadmap for each matching role.
- **Personalized 4-Week Learning Paths**:
  - Targeted curricula designed to close identified skill gaps.
  - Step-by-step masterclasses with modular lessons, rapid drills, and milestone challenges.
- **Longitudinal Progress Analytics**:
  - Score progression trajectory chart across formal assessment checkpoints.
  - 28-day practice calendar and habit streak tracker.
- **Gamification without Childish Aesthetics**:
  - Clean academic design with level progression, experience points (XP), streaks, and geometric milestone badges.
  - Restrained, professional styling: zero neon effects, zero cartoon mascots, zero floating 3D graphics, and zero excessive glassmorphism.
- **Full Responsive Design**:
  - Desktop multi-column dashboard with fixed sidebar.
  - Mobile bottom navigation bar and slide-out navigation drawer.
  - Touch momentum inertia and smooth scrolling throughout.
  - Native safe-area inset support for modern handheld devices.

---

## Technology Stack

- **Framework**: React 19 with TypeScript
- **Bundler & Tooling**: Vite
- **Styling Architecture**: Vanilla CSS design system with custom CSS variables and utility classes
- **Audio Synthesis**: Native Web Audio API sound generator (zero external audio asset dependencies)
- **Icons**: Lucide React vector line icons

---

## Project Structure

```text
aspire_code_ai/
├── public/                  # Static assets and icons
├── src/
│   ├── components/          # Reusable UI modules
│   │   ├── BottomNav.tsx          # Mobile bottom navigation bar
│   │   ├── CareerDetailModal.tsx  # Career deep-dive modal
│   │   ├── ChallengeRunner.tsx    # Diagnostic runner for all 5 challenge types
│   │   ├── Header.tsx             # Top navigation with streak, XP, and lives
│   │   ├── OnboardingModal.tsx    # Four-step onboarding wizard
│   │   ├── RadarChart.tsx         # Eight-axis SVG radar visualization
│   │   ├── Sidebar.tsx            # Desktop sidebar and mobile slide-out drawer
│   │   └── SkillBar.tsx           # Competency progress bar component
│   ├── data/                # Mock databases and assessment items
│   │   ├── achievementsData.ts    # Geometric badges and criteria
│   │   ├── careersData.ts         # Career matches, roadmaps, and requirements
│   │   ├── challengesData.ts     # Diagnostic questions, tests, and code problems
│   │   ├── learningPathsData.ts   # 4-week weekly curriculum tasks
│   │   ├── skillsData.ts          # Competency definitions and rubrics
│   │   └── studentProfileData.ts  # Default student profile and assessment history
│   ├── services/
│   │   └── audioService.ts        # Synthesized audio effects via Web Audio API
│   ├── types/
│   │   └── index.ts               # Core TypeScript data contracts
│   ├── views/               # Primary platform views
│   │   ├── AchievementsView.tsx   # Milestone badges gallery
│   │   ├── CareerMatchesView.tsx  # Role compatibility directory
│   │   ├── ChallengesView.tsx     # Diagnostic testing catalog
│   │   ├── DashboardView.tsx      # Central student overview
│   │   ├── LandingPageView.tsx    # Product preview page
│   │   ├── LearningPathView.tsx   # 4-week structured curriculum
│   │   ├── ProfileView.tsx        # Academic identity and diagnostic history
│   │   ├── ProgressView.tsx       # Longitudinal charts and habit calendar
│   │   ├── SettingsView.tsx       # Audio, timer, and accessibility preferences
│   │   └── SkillProfileView.tsx   # Detailed 8-competency diagnostic breakdown
│   ├── App.tsx              # Main application coordinator and state management
│   ├── index.css            # Design token system, typography, and responsive media queries
│   └── main.tsx             # Application bootstrap entry
├── index.html               # Main HTML template with SEO metadata
├── package.json             # Project dependencies and script declarations
├── tsconfig.json            # TypeScript compiler configuration
└── vite.config.ts           # Vite configuration
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/saifmodan2006/Skill_Detective.git
   cd Skill_Detective
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

### Production Build

To build the static production bundle:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Design System Principles

- **Professional Palette**: Grounded in slate navy (`#0F172A`), light surface backgrounds (`#F8FAFC`), focused indigo (`#4F46E5`), and warm amber (`#D97706`).
- **Restrained Elevation**: Subtle 1px borders and minimal drop shadows instead of heavy glowing effects.
- **Readable Typography**: System font stack with Inter fallbacks, clear weight hierarchy, and JetBrains Mono for numeric values and code blocks.
- **Accessibility**: Explicit `:focus-visible` styling, high-contrast semantic indicators, and responsive scaling across mobile, tablet, and desktop viewports.

---

## License

This project is licensed under the MIT License.

