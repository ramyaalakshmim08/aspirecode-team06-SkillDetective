-- =============================================================================
-- Migration 001: Initial Schema for Skill Detective
-- Multi-user academic skill assessment and career guidance platform
-- =============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin', 'mentor')),
    institution TEXT DEFAULT '',
    course TEXT DEFAULT '',
    year TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    interests TEXT[] DEFAULT '{}',
    career_goals TEXT[] DEFAULT '{}',
    level INT NOT NULL DEFAULT 1,
    xp INT NOT NULL DEFAULT 0,
    lives INT NOT NULL DEFAULT 4,
    max_lives INT NOT NULL DEFAULT 4,
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 2. Competency Skills Catalog (System reference data)
CREATE TABLE IF NOT EXISTS public.skills (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    what_is_measured TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. User Skill Scores & Calibration
CREATE TABLE IF NOT EXISTS public.skill_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id TEXT NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    score INT CHECK (score >= 0 AND score <= 100), -- NULL means "Not Assessed"
    initial_score INT CHECK (initial_score >= 0 AND initial_score <= 100),
    level INT NOT NULL DEFAULT 1,
    confidence TEXT NOT NULL DEFAULT 'none' CHECK (confidence IN ('none', 'low', 'medium', 'high')),
    attempts_count INT NOT NULL DEFAULT 0,
    previous_score INT,
    score_delta INT NOT NULL DEFAULT 0,
    last_assessed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_skill_scores_user ON public.skill_scores(user_id);

-- 4. Challenges Catalog
CREATE TABLE IF NOT EXISTS public.challenges (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
    category_label TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    estimated_minutes INT NOT NULL DEFAULT 5,
    xp_reward INT NOT NULL DEFAULT 50,
    type TEXT NOT NULL CHECK (type IN ('logic', 'coding', 'communication', 'data', 'attention')),
    question_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    solution_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    explanation TEXT NOT NULL DEFAULT '',
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_challenges_category ON public.challenges(category);
CREATE INDEX IF NOT EXISTS idx_challenges_difficulty ON public.challenges(difficulty);

-- 5. User Challenge Attempts
CREATE TABLE IF NOT EXISTS public.challenge_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    score_earned INT NOT NULL DEFAULT 0,
    xp_earned INT NOT NULL DEFAULT 0,
    time_taken_seconds INT NOT NULL DEFAULT 0,
    user_answer JSONB,
    feedback TEXT,
    attempt_number INT NOT NULL DEFAULT 1,
    idempotency_key TEXT UNIQUE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_challenge_attempts_user ON public.challenge_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_attempts_challenge ON public.challenge_attempts(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_attempts_user_challenge ON public.challenge_attempts(user_id, challenge_id);

-- 6. Careers Catalog
CREATE TABLE IF NOT EXISTS public.careers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    salary_range TEXT NOT NULL,
    demand_growth TEXT NOT NULL,
    skills_required TEXT[] NOT NULL DEFAULT '{}',
    skills_to_build TEXT[] NOT NULL DEFAULT '{}',
    learning_path_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Career Skill Requirements
CREATE TABLE IF NOT EXISTS public.career_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    career_id TEXT NOT NULL REFERENCES public.careers(id) ON DELETE CASCADE,
    skill_id TEXT NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    benchmark_score INT NOT NULL CHECK (benchmark_score >= 0 AND benchmark_score <= 100),
    weight NUMERIC(3,2) NOT NULL DEFAULT 1.0 CHECK (weight > 0),
    UNIQUE(career_id, skill_id)
);

-- 8. Saved Careers & Goals
CREATE TABLE IF NOT EXISTS public.user_saved_careers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    career_id TEXT NOT NULL REFERENCES public.careers(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'saved' CHECK (status IN ('primary_goal', 'secondary_goal', 'exploring', 'saved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, career_id)
);

-- 9. Learning Paths & Curricula
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    skill_target TEXT NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    estimated_weeks INT NOT NULL DEFAULT 4,
    target_score INT NOT NULL DEFAULT 75,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.learning_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    learning_path_id TEXT NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    week_number INT NOT NULL,
    title TEXT NOT NULL,
    focus TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.learning_lessons (
    id TEXT PRIMARY KEY,
    module_id UUID NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Lesson', 'Challenge', 'Practice')),
    duration TEXT NOT NULL DEFAULT '10 min',
    order_index INT NOT NULL DEFAULT 0,
    content TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_learning_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES public.learning_lessons(id) ON DELETE CASCADE,
    completed BOOLEAN NOT NULL DEFAULT TRUE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- 10. Achievements Catalog
CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    xp_reward INT NOT NULL DEFAULT 50,
    progress_total INT NOT NULL DEFAULT 1,
    icon_name TEXT NOT NULL DEFAULT 'Award',
    criteria_type TEXT NOT NULL,
    criteria_threshold INT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    progress_current INT NOT NULL DEFAULT 0,
    unlocked BOOLEAN NOT NULL DEFAULT FALSE,
    unlocked_at TIMESTAMPTZ,
    UNIQUE(user_id, achievement_id)
);

-- 11. User Streaks
CREATE TABLE IF NOT EXISTS public.user_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_streak INT NOT NULL DEFAULT 0,
    longest_streak INT NOT NULL DEFAULT 0,
    last_activity_date DATE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. XP Transaction Ledger (Idempotent)
CREATE TABLE IF NOT EXISTS public.user_xp_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL CHECK (source_type IN ('challenge', 'achievement', 'learning', 'streak', 'admin')),
    source_id TEXT NOT NULL,
    xp_amount INT NOT NULL CHECK (xp_amount > 0),
    idempotency_key TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xp_transactions_user ON public.user_xp_transactions(user_id);

-- 13. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('milestone', 'recommendation', 'streak', 'skill', 'info')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- 14. User Preferences & Settings
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sound_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    timer_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    reduced_motion BOOLEAN NOT NULL DEFAULT FALSE,
    daily_reminders BOOLEAN NOT NULL DEFAULT TRUE,
    theme_mode TEXT NOT NULL DEFAULT 'light' CHECK (theme_mode IN ('light', 'dark', 'system')),
    public_profile BOOLEAN NOT NULL DEFAULT FALSE,
    show_achievements BOOLEAN NOT NULL DEFAULT TRUE,
    show_skills BOOLEAN NOT NULL DEFAULT TRUE,
    show_careers BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Activity & Audit Logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_description TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.activity_logs(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
