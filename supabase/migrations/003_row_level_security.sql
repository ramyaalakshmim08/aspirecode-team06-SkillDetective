-- =============================================================================
-- Migration 003: Row Level Security (RLS) & Access Control
-- Enforces strict user data isolation and Admin Role-Based Access Control (RBAC)
-- =============================================================================

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles Policies
-- Users can view their own profile, or public profiles if enabled
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Public profile view"
    ON public.profiles FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.user_settings s
        WHERE s.user_id = profiles.id AND s.public_profile = TRUE
    ));

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin())
    WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
    ON public.profiles FOR DELETE
    USING (auth.uid() = id OR public.is_admin());

-- 2. System Catalogs (Read-only for all, write for Admins)
CREATE POLICY "Everyone can view published skills"
    ON public.skills FOR SELECT USING (TRUE);

CREATE POLICY "Admins can modify skills"
    ON public.skills FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Everyone can view published challenges"
    ON public.challenges FOR SELECT
    USING (is_published = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage challenges"
    ON public.challenges FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Everyone can view published careers"
    ON public.careers FOR SELECT
    USING (is_published = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage careers"
    ON public.careers FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Everyone can view career requirements"
    ON public.career_requirements FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage career requirements"
    ON public.career_requirements FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Everyone can view published learning paths"
    ON public.learning_paths FOR SELECT
    USING (is_published = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage learning paths"
    ON public.learning_paths FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Everyone can view learning modules"
    ON public.learning_modules FOR SELECT USING (TRUE);

CREATE POLICY "Everyone can view learning lessons"
    ON public.learning_lessons FOR SELECT USING (TRUE);

CREATE POLICY "Everyone can view achievements"
    ON public.achievements FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage achievements"
    ON public.achievements FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 3. User Data Isolation Policies (auth.uid() = user_id)
-- Skill Scores
CREATE POLICY "Users can view own skill scores"
    ON public.skill_scores FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can manage own skill scores"
    ON public.skill_scores FOR ALL
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Challenge Attempts
CREATE POLICY "Users can view own attempts"
    ON public.challenge_attempts FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own attempts"
    ON public.challenge_attempts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Saved Careers
CREATE POLICY "Users can view own saved careers"
    ON public.user_saved_careers FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own saved careers"
    ON public.user_saved_careers FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Learning Progress
CREATE POLICY "Users can view own learning progress"
    ON public.user_learning_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own learning progress"
    ON public.user_learning_progress FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- User Achievements
CREATE POLICY "Users can view own achievements"
    ON public.user_achievements FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can manage own achievements"
    ON public.user_achievements FOR ALL
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Streaks
CREATE POLICY "Users can view own streaks"
    ON public.user_streaks FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can manage own streaks"
    ON public.user_streaks FOR ALL
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- XP Transactions
CREATE POLICY "Users can view own XP transactions"
    ON public.user_xp_transactions FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own XP transactions"
    ON public.user_xp_transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Notifications
CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own notifications"
    ON public.notifications FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- User Settings
CREATE POLICY "Users can view own settings"
    ON public.user_settings FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can manage own settings"
    ON public.user_settings FOR ALL
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Activity Logs
CREATE POLICY "Users can view own activity logs"
    ON public.activity_logs FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own activity logs"
    ON public.activity_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Audit Logs (Admin only)
CREATE POLICY "Admins can view and insert audit logs"
    ON public.audit_logs FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
