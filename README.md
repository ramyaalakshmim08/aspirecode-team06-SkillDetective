# Skill Detective — Enterprise Academic Skill-Discovery Platform

### ASPIRE CODE AI - TEAM 06

| Name | Role |
|---|---|
| Vishnu Maya | Team Lead |
| Ramyaa Lakshmi M | Git & Documentation Owner |
| Monika | Developer |
| Dhanya | Developer |
| Moushme | Presenter/Demo Owner |
| Saif Modan | R&D / Research Owner |

---

> **Discover what you are good at. Find where you can go next.**

Skill Detective is a production-grade, multi-user academic skill-discovery platform designed to help students identify their cognitive strengths, diagnose improvement areas, evaluate career compatibility, and follow personalized learning roadmaps through empirical problem-solving diagnostics.

Rather than relying on speculative personality surveys or static mock dashboards, Skill Detective features **real authentication, persistent database storage, strict multi-tenant isolation, row-level security (RLS), transparent mathematical competency calibration, confidence intervals, career compatibility matching, an administrative control plane, and comprehensive test coverage.**

---

## 🌟 Core Architecture Highlights

### 1. Multi-Tenant Authentication & Session Management
- **Zero Dummy User Accounts**: The platform boots into a real unauthenticated state with dedicated sign-in, registration, and password reset workflows.
- **Clean Initial Zero-State**: Newly registered students start completely unassessed (0 XP, Level 1, 0 streak, 4 lives, all 8 competencies categorized as `Not Assessed` with zero confidence).
- **Dual-Engine Architecture**:
  - **Supabase Cloud Engine**: Connects natively to PostgreSQL via Supabase Auth and PostgREST.
  - **Local Isolated Storage Engine**: A zero-config, schema-identical PostgreSQL mirror providing seamless offline resilience, end-to-end unit test execution, and demo sandbox evaluation.

### 2. Transparent Competency Scoring & Calibration Engine
- **Formula-Driven Scoring**: Attempt scoring incorporates base score, difficulty multipliers (Easy: 1.0x, Medium: 1.15x, Hard: 1.3x), precision accuracy (0.0–1.0), and time efficiency bonuses.
- **Moving Average Smoothing**: Competency calibration applies a weighted moving average (65% baseline stability, 35% recency sensitivity) to prevent volatile rating swings.
- **Attempt-Based Confidence Intervals**:
  - `none`: 0 attempts (Unassessed)
  - `low`: 1–2 verified attempts
  - `medium`: 3–5 verified attempts
  - `high`: 6+ verified attempts
- **Mastery Status Breakdown**: `strong` (>= 80), `developing` (65–79), `needs-practice` (< 65), and `unassessed`.

### 3. Dynamic Career Matching & Gap Analysis
- Real-time compatibility index calculated from verified competency scores weighted against career benchmark requirements.
- Highlights demonstrated strengths, pinpointed skill point gaps, and dynamically suggested remedial masterclasses.
- Multi-career side-by-side comparison modal and goal bookmarking (`Primary Goal`, `Secondary Goal`, `Exploring`, `Saved`).

### 4. Five Real Diagnostic Interactive Runners
1. **Logic & Sequence Deduction**: Algorithmic puzzles with step validation.
2. **Interactive Code Pattern Runner**: Split-screen live code runner supporting JavaScript, Python, and Java with test assertion execution.
3. **Verbal Communication Simulation**: 30-second countdown prompt timer with simulated audio metering, transcription input, and multi-criteria rubric grading.
4. **Data Analysis Diagnostic**: Tabular data evaluation testing trend detection and quarterly variance analysis.
5. **Attention to Detail**: Infrastructure security audit and configuration diff inspection.

### 5. Administrative Control Plane & RBAC
- Role-Based Access Control (`student` vs. `admin`).
- Platform KPI monitoring: total registered users, active students, challenge completions, average competency score, and top skills.
- Live user directory with search, filter, and dynamic role toggle (`student` <-> `admin`).
- Interactive challenge catalog manager and career requirement benchmark inspector.

### 6. Official Diagnostic Report Export
- Printable and PDF-exportable transcript summarizing verified competency ratings, confidence levels, top matching careers, and completed diagnostic history.

---

## 🏗️ Database Schema & Migrations

Normalized PostgreSQL DDL located in the `supabase/migrations/` directory:

| Migration File | Description |
|---|---|
| `001_initial_schema.sql` | DDL creating 18 normalized tables: `profiles`, `skills`, `skill_scores`, `challenges`, `challenge_attempts`, `careers`, `career_requirements`, `user_saved_careers`, `learning_paths`, `learning_modules`, `learning_lessons`, `user_learning_progress`, `achievements`, `user_achievements`, `user_streaks`, `user_xp_transactions`, `notifications`, `user_settings`, `activity_logs`, `audit_logs`. |
| `002_seed_system_data.sql` | Reference catalog seed inserting 8 system skills, 5 diagnostic challenges, 8 careers with weighted requirements, achievements, and 4-week learning curricula. **Contains zero dummy user accounts or fake scores.** |
| `003_row_level_security.sql` | Enables PostgreSQL Row Level Security (RLS) across all tables (`auth.uid() = user_id`) and admin policy overrides (`is_admin(auth.uid())`). |

---

## 📁 Project Structure

```text
aspire_code_ai/
├── public/                     # Static assets and favicon
├── supabase/
│   └── migrations/             # Production PostgreSQL DDL & RLS policies
│       ├── 001_initial_schema.sql
│       ├── 002_seed_system_data.sql
│       └── 003_row_level_security.sql
├── src/
│   ├── __tests__/              # Vitest test suite
│   │   ├── authService.test.ts
│   │   ├── careerService.test.ts
│   │   ├── scoringEngine.test.ts
│   │   ├── setup.ts            # Node localStorage polyfill for testing
│   │   └── storageAdapter.test.ts
│   ├── components/             # Reusable UI modules
│   │   ├── BottomNav.tsx       # Mobile bottom navigation bar
│   │   ├── CareerDetailModal.tsx # Career deep-dive modal
│   │   ├── ChallengeRunner.tsx # Diagnostic runner for all 5 challenge types
│   │   ├── Header.tsx          # Real notifications, profile menu & Ctrl+K search
│   │   ├── OnboardingModal.tsx # Zero-state academic onboarding modal
│   │   ├── RadarChart.tsx      # SVG 8-axis radar visualization with null-safe math
│   │   ├── Sidebar.tsx         # Responsive navigation drawer & Admin link
│   │   └── SkillBar.tsx        # Competency progress bar with confidence badge
│   ├── data/
│   │   └── systemSeedData.ts   # System reference catalog (skills, challenges, careers)
│   ├── services/               # Enterprise Service Layer
│   │   ├── achievementService.ts # Dynamic badge evaluation
│   │   ├── adminService.ts     # User administration & system metrics
│   │   ├── audioService.ts     # Web Audio API sound synthesis
│   │   ├── authService.ts      # Supabase Auth / Local adapter bridge
│   │   ├── careerService.ts    # Algorithmic career matching & comparison
│   │   ├── challengeService.ts # Attempt submission, scoring & XP ledger
│   │   ├── learningService.ts  # Lesson progress tracking
│   │   ├── notificationService.ts # In-app notification queue
│   │   ├── profileService.ts   # Profile and competency persistence
│   │   ├── scoringEngine.ts    # Mathematical scoring & confidence model
│   │   ├── storageAdapter.ts   # Multi-user storage adapter & isolated ledger
│   │   └── supabaseClient.ts   # Supabase client initializer
│   ├── types/
│   │   └── index.ts            # Enterprise TypeScript domain contracts
│   ├── views/                  # Primary platform views
│   │   ├── auth/
│   │   │   ├── ForgotPasswordView.tsx
│   │   │   ├── LoginView.tsx
│   │   │   └── SignUpView.tsx
│   │   ├── AchievementsView.tsx # Dynamic milestone badges
│   │   ├── AdminView.tsx        # Administrative management console
│   │   ├── CareerMatchesView.tsx # Dynamic role compatibility directory
│   │   ├── ChallengesView.tsx   # Diagnostic testing catalog
│   │   ├── DashboardView.tsx    # Central student overview
│   │   ├── LandingPageView.tsx  # Product preview page
│   │   ├── LearningPathView.tsx # 4-week structured curriculum
│   │   ├── ProfileView.tsx      # Academic profile & GDPR deletion
│   │   ├── ProgressView.tsx     # 28-day activity heatmap & score trajectory
│   │   ├── ReportView.tsx       # Exportable diagnostic report transcript
│   │   ├── SettingsView.tsx     # Persistent preferences & privacy controls
│   │   └── SkillProfileView.tsx # 8-competency diagnostic breakdown
│   ├── App.tsx                 # Root application coordinator & URL routing
│   ├── index.css               # Design tokens, typography & media queries
│   └── main.tsx                # Bootstrap entry
├── .env.example                # Environment configuration template
├── package.json
├── tsconfig.json
└── vite.config.ts              # Vite configuration with Vitest setup
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Installation
```bash
git clone https://github.com/saifmodan2006/Skill_Detective.git
cd Skill_Detective
npm install
```

### 2. Environment Configuration (Optional)
To connect to an external Supabase instance, copy the example environment file:
```bash
cp .env.example .env
```
Fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-supabase-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_INITIAL_ADMIN_EMAIL=admin@skilldetective.edu
```
*Note: If no Supabase environment variables are provided, Skill Detective runs in zero-config offline mode with full local multi-user isolation automatically.*

### 3. Launch Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

---

## 🧪 Testing & Verification

Run the automated test suite powered by Vitest:
```bash
npm run test
```

### Test Coverage Summary:
- **`scoringEngine.test.ts`**: Verifies attempt score formulas, difficulty multipliers, time efficiency adjustments, moving average calibration, and confidence upgrades.
- **`careerService.test.ts`**: Verifies 0% compatibility on unassessed profiles, dynamic weighted matching with verified scores, skill gap detection, and side-by-side comparison.
- **`storageAdapter.test.ts`**: Verifies strict multi-user data isolation (User A cannot see User B's attempts or profiles), idempotent XP ledger transactions, and complete GDPR account cleanup.
- **`authService.test.ts`**: Verifies clean unassessed student creation, password constraints, authentication validation, and session clearing.

---

## 📦 Production Build

Validate TypeScript compilation and package production bundles:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 🛡️ Security & Privacy Features

- **Row Level Security (RLS)**: Enforced in PostgreSQL so student queries can only read/write their own records.
- **Idempotent Transactions**: XP awards and challenge submissions verify unique transaction keys to prevent duplicate points or double submissions.
- **GDPR Compliance**: The Profile View includes an immediate **Delete Account & All Diagnostic Data** action that cleans all user-scoped tables and invalidates the session.
- **Role-Based Protection**: Administrative tools and stats are strictly guarded on both API/storage and UI route layers.

---

## 📄 License

This project is licensed under the MIT License.
