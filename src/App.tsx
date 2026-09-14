import React, { useState, useEffect, useCallback } from 'react';
import { 
  NavigationTab, 
  StudentProfile, 
  SkillData, 
  InteractiveChallenge, 
  CareerMatch, 
  Achievement, 
  LearningPath 
} from './types';

// Services
import { AuthService, AuthSession } from './services/authService';
import { ProfileService } from './services/profileService';
import { ChallengeService } from './services/challengeService';
import { CareerService } from './services/careerService';
import { LearningService } from './services/learningService';
import { AchievementService } from './services/achievementService';
import { soundFx } from './services/audioService';

// Layout & Core Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OnboardingModal } from './components/OnboardingModal';
import { ChallengeRunner } from './components/ChallengeRunner';
import { CareerDetailModal } from './components/CareerDetailModal';

// Views
import { DashboardView } from './views/DashboardView';
import { ChallengesView } from './views/ChallengesView';
import { SkillProfileView } from './views/SkillProfileView';
import { CareerMatchesView } from './views/CareerMatchesView';
import { LearningPathView } from './views/LearningPathView';
import { AchievementsView } from './views/AchievementsView';
import { ProgressView } from './views/ProgressView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';
import { LandingPageView } from './views/LandingPageView';
import { AdminView } from './views/AdminView';
import { ReportView } from './views/ReportView';

// Auth Views
import { LoginView } from './views/auth/LoginView';
import { SignUpView } from './views/auth/SignUpView';
import { ForgotPasswordView } from './views/auth/ForgotPasswordView';

// Helper to convert URL path to NavigationTab
const getTabFromPath = (path: string): NavigationTab => {
  const clean = path.replace(/^\//, '').toLowerCase();
  switch (clean) {
    case 'login': return 'login';
    case 'signup': return 'signup';
    case 'forgot-password': return 'forgot-password';
    case 'dashboard': return 'dashboard';
    case 'challenges': return 'challenges';
    case 'skills': return 'skills';
    case 'careers': return 'careers';
    case 'learning':
    case 'learning-path': return 'learning-path';
    case 'achievements': return 'achievements';
    case 'progress': return 'progress';
    case 'profile': return 'profile';
    case 'settings': return 'settings';
    case 'admin': return 'admin';
    case 'report': return 'report';
    case 'landing': return 'landing';
    default: return 'landing';
  }
};

const getPathFromTab = (tab: NavigationTab): string => {
  if (tab === 'landing') return '/';
  return `/${tab}`;
};

export const App: React.FC = () => {
  // Session & Auth State
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavigationTab>(() => {
    if (typeof window !== 'undefined') {
      return getTabFromPath(window.location.pathname);
    }
    return 'landing';
  });

  // Data States
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [challenges, setChallenges] = useState<InteractiveChallenge[]>([]);
  const [careers, setCareers] = useState<CareerMatch[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);

  // Modals & Runners
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<InteractiveChallenge | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<CareerMatch | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Sync state with URL changes
  const navigateTo = useCallback((tab: NavigationTab) => {
    setCurrentTab(tab);
    setIsMobileDrawerOpen(false);
    const newPath = getPathFromTab(tab);
    if (window.location.pathname !== newPath) {
      window.history.pushState({ tab }, '', newPath);
    }
  }, []);

  // Reload user data from services
  const refreshUserData = useCallback((userId: string) => {
    const prof = ProfileService.getStudentProfile(userId);
    const sk = ProfileService.getSkillDataList(userId);
    const ch = ChallengeService.getChallenges(userId);
    const cr = CareerService.getCareerMatches(userId);
    const ach = AchievementService.getAchievements(userId);
    const lp = LearningService.getLearningPaths(userId);

    setProfile(prof);
    setSkills(sk);
    setChallenges(ch);
    setCareers(cr);
    setAchievements(ach);
    setLearningPaths(lp);

    // Prompt onboarding if newly registered and uncompleted
    if (prof && !prof.onboardingCompleted) {
      setIsOnboardingOpen(true);
    }
  }, []);

  // Initialize Session on App Mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const curSession = await AuthService.getCurrentSession();
        if (curSession) {
          setSession(curSession);
          refreshUserData(curSession.user.id);
          // If on public auth page, move to dashboard
          if (currentTab === 'login' || currentTab === 'signup' || currentTab === 'landing') {
            navigateTo('dashboard');
          }
        } else {
          // Protected route guard: if user tries to open dashboard without session, send to landing
          if (
            currentTab !== 'landing' && 
            currentTab !== 'login' && 
            currentTab !== 'signup' && 
            currentTab !== 'forgot-password'
          ) {
            navigateTo('landing');
          }
        }
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        setAuthInitialized(true);
      }
    };

    initAuth();
  }, [refreshUserData, navigateTo]);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const tab = getTabFromPath(window.location.pathname);
      setCurrentTab(tab);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currentTab]);

  // Keyboard shortcut listener (Escape to close open modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMobileDrawerOpen) setIsMobileDrawerOpen(false);
        if (activeChallenge) setActiveChallenge(null);
        if (selectedCareer) setSelectedCareer(null);
        if (isOnboardingOpen) setIsOnboardingOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeChallenge, selectedCareer, isOnboardingOpen, isMobileDrawerOpen]);

  // ---------------------------------------------------------------------------
  // Auth Handlers
  // ---------------------------------------------------------------------------
  const handleLoginSuccess = (newSession: AuthSession) => {
    setSession(newSession);
    refreshUserData(newSession.user.id);
    navigateTo('dashboard');
  };

  const handleSignUpSuccess = (newSession: AuthSession) => {
    setSession(newSession);
    refreshUserData(newSession.user.id);
    setIsOnboardingOpen(true);
    navigateTo('dashboard');
  };

  const handleLogout = async () => {
    await AuthService.signOut();
    setSession(null);
    setProfile(null);
    soundFx.playClick();
    navigateTo('login');
  };

  const handleDeleteAccount = async () => {
    if (!session) return;
    await AuthService.deleteAccount(session.user.id);
    setSession(null);
    setProfile(null);
    soundFx.playClick();
    navigateTo('signup');
  };

  // ---------------------------------------------------------------------------
  // Challenge Handlers
  // ---------------------------------------------------------------------------
  const handleChallengeComplete = (challengeId: string, earnedXp: number, scoreGained: number) => {
    if (!session) return;

    // ChallengeRunner onComplete passes challengeId, earnedXp, scoreGained
    ChallengeService.submitAttempt(session.user.id, challengeId, {
      isCorrect: true,
      timeTakenSeconds: 90,
      partialAccuracy: 1.0
    });

    // Refresh all state from database
    refreshUserData(session.user.id);
    setActiveChallenge(null);
  };

  const handleLifeLost = () => {
    if (!session) return;
    ChallengeService.loseLife(session.user.id);
    if (profile) {
      setProfile({
        ...profile,
        lives: Math.max(0, profile.lives - 1)
      });
    }
  };

  const handleUpdateProfile = (updated: Partial<StudentProfile>) => {
    if (!session) return;
    ProfileService.updateProfile(session.user.id, {
      fullName: updated.name,
      course: updated.department,
      institution: updated.institution,
      year: updated.year,
      bio: updated.bio
    });
    refreshUserData(session.user.id);
  };

  const handleCompleteOnboarding = (updated: Partial<StudentProfile>) => {
    if (!session) return;
    ProfileService.completeOnboarding(session.user.id, {
      name: updated.name,
      course: updated.department,
      institution: updated.institution,
      year: updated.year,
      interests: updated.interests,
      careerGoals: updated.careerGoals
    });
    refreshUserData(session.user.id);
    setIsOnboardingOpen(false);
  };

  // Find continuing challenge (or first available)
  const continueChallenge = challenges.find((c) => c.status !== 'Completed') || challenges[0];

  // ---------------------------------------------------------------------------
  // Loading Screen during Auth Check
  // ---------------------------------------------------------------------------
  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="text-center p-8">
          <div className="brand-logo-mark mx-auto mb-3 animate-pulse">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
              <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="11" cy="11" r="2.5" fill="var(--accent-amber)" />
            </svg>
          </div>
          <p className="text-xs font-mono text-muted uppercase tracking-widest">
            Initializing Skill Detective Engine...
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Public Unauthenticated Views
  // ---------------------------------------------------------------------------
  if (currentTab === 'login') {
    return (
      <LoginView
        onLoginSuccess={handleLoginSuccess}
        onNavigateToSignUp={() => navigateTo('signup')}
        onNavigateToForgotPassword={() => navigateTo('forgot-password')}
        onExplorePreview={() => navigateTo('landing')}
      />
    );
  }

  if (currentTab === 'signup') {
    return (
      <SignUpView
        onSignUpSuccess={handleSignUpSuccess}
        onNavigateToLogin={() => navigateTo('login')}
        onExplorePreview={() => navigateTo('landing')}
      />
    );
  }

  if (currentTab === 'forgot-password') {
    return (
      <ForgotPasswordView
        onNavigateToLogin={() => navigateTo('login')}
      />
    );
  }

  if (currentTab === 'landing') {
    return (
      <LandingPageView
        onStartAssessment={() => {
          if (session) {
            navigateTo('challenges');
          } else {
            navigateTo('signup');
          }
        }}
        onEnterDashboard={() => {
          if (session) {
            navigateTo('dashboard');
          } else {
            navigateTo('login');
          }
        }}
      />
    );
  }

  // If on a protected route but no active session, redirect to login
  if (!session || !profile) {
    return (
      <LoginView
        onLoginSuccess={handleLoginSuccess}
        onNavigateToSignUp={() => navigateTo('signup')}
        onNavigateToForgotPassword={() => navigateTo('forgot-password')}
        onExplorePreview={() => navigateTo('landing')}
      />
    );
  }

  // Admin Route Protection
  if (currentTab === 'admin' && profile.role !== 'admin') {
    navigateTo('dashboard');
    return null;
  }

  // ---------------------------------------------------------------------------
  // Authenticated Application Shell
  // ---------------------------------------------------------------------------
  return (
    <div className="app-layout">
      {/* Desktop & Mobile Drawer Sidebar */}
      <Sidebar
        currentTab={currentTab}
        role={profile.role}
        onNavigate={navigateTo}
        onLogout={handleLogout}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        isMobileOpen={isMobileDrawerOpen}
        onCloseMobile={() => setIsMobileDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Sticky Header */}
        <Header
          currentTab={currentTab}
          profile={profile}
          onNavigate={navigateTo}
          onLogout={handleLogout}
          onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
        />

        {/* Dynamic Route View */}
        <main className="main-content" role="main">
          {currentTab === 'dashboard' && continueChallenge && (
            <DashboardView
              profile={profile}
              skills={skills}
              continueChallenge={continueChallenge}
              topCareers={careers}
              onStartChallenge={(ch) => setActiveChallenge(ch)}
              onNavigate={navigateTo}
              onSelectCareer={(car) => setSelectedCareer(car)}
            />
          )}

          {currentTab === 'challenges' && (
            <ChallengesView
              challenges={challenges}
              onStartChallenge={(ch) => setActiveChallenge(ch)}
            />
          )}

          {currentTab === 'skills' && (
            <SkillProfileView
              skills={skills}
              onNavigate={navigateTo}
            />
          )}

          {currentTab === 'careers' && (
            <CareerMatchesView
              careers={careers}
              userId={session.user.id}
              onSelectCareer={(car) => setSelectedCareer(car)}
              onStartAssessment={() => navigateTo('challenges')}
            />
          )}

          {currentTab === 'learning-path' && (
            <LearningPathView
              learningPaths={learningPaths}
              userId={session.user.id}
              onNavigate={navigateTo}
            />
          )}

          {currentTab === 'achievements' && (
            <AchievementsView
              achievements={achievements}
            />
          )}

          {currentTab === 'progress' && (
            <ProgressView
              profile={profile}
              skills={skills}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onDeleteAccount={handleDeleteAccount}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              userId={session.user.id}
            />
          )}

          {currentTab === 'admin' && profile.role === 'admin' && (
            <AdminView />
          )}

          {currentTab === 'report' && (
            <ReportView
              profile={profile}
              skills={skills}
              careers={careers}
              onBack={() => navigateTo('dashboard')}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={navigateTo}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
      />

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        profile={profile}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleCompleteOnboarding}
        onLaunchFirstChallenge={() => {
          setIsOnboardingOpen(false);
          if (continueChallenge) {
            setActiveChallenge(continueChallenge);
          }
        }}
      />

      {/* Diagnostic Challenge Runner */}
      {activeChallenge && (
        <ChallengeRunner
          challenge={activeChallenge}
          userLives={profile.lives}
          onClose={() => setActiveChallenge(null)}
          onComplete={handleChallengeComplete}
          onLifeLost={handleLifeLost}
        />
      )}

      {/* Career Deep-Dive Roadmap Modal */}
      {selectedCareer && (
        <CareerDetailModal
          career={selectedCareer}
          onClose={() => setSelectedCareer(null)}
          onStartLearningPath={() => {
            setSelectedCareer(null);
            navigateTo('learning-path');
          }}
        />
      )}
    </div>
  );
};

export default App;
