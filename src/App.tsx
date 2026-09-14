import React, { useState, useEffect } from 'react';
import { NavigationTab, StudentProfile, SkillData, InteractiveChallenge, CareerMatch } from './types';
import { UserAccount, AuthModalMode } from './types/auth';
import { authService } from './services/authService';
import { guestProfile } from './data/studentProfileData';
import { initialSkillsData } from './data/skillsData';
import { challengesData } from './data/challengesData';
import { careersData } from './data/careersData';
import { achievementsData } from './data/achievementsData';
import { learningPathsData } from './data/learningPathsData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OnboardingModal } from './components/OnboardingModal';
import { ChallengeRunner } from './components/ChallengeRunner';
import { CareerDetailModal } from './components/CareerDetailModal';
import { AuthModal } from './components/AuthModal';
import { UserManagementModal } from './components/UserManagementModal';

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

export const App: React.FC = () => {
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');

  // Authenticated User Session
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => authService.getCurrentUser());

  // Core Data States
  const [profile, setProfile] = useState<StudentProfile>(() => currentUser?.profile || guestProfile);
  const [skills, setSkills] = useState<SkillData[]>(() => currentUser?.skills || initialSkillsData);
  const [challenges, setChallenges] = useState<InteractiveChallenge[]>(() => currentUser?.challenges || challengesData);
  const [careers] = useState<CareerMatch[]>(careersData);
  const [achievements, setAchievements] = useState(() => currentUser?.achievements || achievementsData);
  const [learningPaths] = useState(() => currentUser?.learningPaths || learningPathsData);

  // Modals & Active Runners
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    const hasVisited = localStorage.getItem('skill_detective_visited_v2');
    if (!hasVisited && !authService.getCurrentUser()) {
      localStorage.setItem('skill_detective_visited_v2', 'true');
      return true;
    }
    return false;
  });
  const [activeChallenge, setActiveChallenge] = useState<InteractiveChallenge | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<CareerMatch | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Auth & User Management Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);

  // Smooth scroll to top whenever navigation tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currentTab]);

  // Sync state back to persistent storage whenever active user's data changes
  useEffect(() => {
    if (currentUser) {
      authService.saveUserProgress(currentUser.id, profile, skills, challenges, achievements);
    }
  }, [currentUser, profile, skills, challenges, achievements]);

  // Keyboard shortcut listener (Escape to close modals & drawer)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMobileDrawerOpen) setIsMobileDrawerOpen(false);
        if (activeChallenge) setActiveChallenge(null);
        if (selectedCareer) setSelectedCareer(null);
        if (isOnboardingOpen) setIsOnboardingOpen(false);
        if (isAuthModalOpen) setIsAuthModalOpen(false);
        if (isUserManagementOpen) setIsUserManagementOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeChallenge, selectedCareer, isOnboardingOpen, isMobileDrawerOpen, isAuthModalOpen, isUserManagementOpen]);

  // Handle Challenge Completion
  const handleChallengeComplete = (challengeId: string, earnedXp: number, scoreGained: number) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, status: 'Completed' } : c))
    );

    const completedChallenge = challenges.find((c) => c.id === challengeId);
    if (completedChallenge) {
      setSkills((prev) =>
        prev.map((s) => {
          if (s.id === completedChallenge.category) {
            const newScore = Math.min(100, s.score + scoreGained);
            return {
              ...s,
              score: newScore,
              completedChallenges: s.completedChallenges + 1
            };
          }
          return s;
        })
      );
    }

    setProfile((prev) => ({
      ...prev,
      xp: prev.xp + earnedXp,
      overallScore: Math.min(100, prev.overallScore + 1)
    }));

    setAchievements((prev) =>
      prev.map((a) => {
        if (a.id === 'logic-master' && completedChallenge?.category === 'logical') {
          const nextVal = a.progressCurrent + 1;
          return { ...a, progressCurrent: nextVal, unlocked: nextVal >= a.progressTotal };
        }
        return a;
      })
    );

    setActiveChallenge(null);
  };

  const handleLifeLost = () => {
    setProfile((prev) => ({
      ...prev,
      lives: Math.max(0, prev.lives - 1)
    }));
  };

  const handleUpdateProfile = (updated: Partial<StudentProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updated
    }));
    if (currentUser) {
      authService.updateUserProfile(currentUser.id, updated);
    }
  };

  const handleStartCareerPath = () => {
    setCurrentTab('learning-path');
  };

  // Auth Handlers
  const handleOpenLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenSignup = () => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setProfile(user.profile);
      setSkills(user.skills);
      setChallenges(user.challenges);
      setAchievements(user.achievements);
    }
  };

  const handleUserSwitched = (switchedUser: UserAccount) => {
    setCurrentUser(switchedUser);
    setProfile(switchedUser.profile);
    setSkills(switchedUser.skills);
    setChallenges(switchedUser.challenges);
    setAchievements(switchedUser.achievements);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setProfile(guestProfile);
    setCurrentTab('landing');
  };

  const continueChallenge = challenges.find((c) => c.id === 'logic-pattern-detective') || challenges[0];

  return (
    <div className="app-layout">
      {/* Desktop & Mobile Drawer Sidebar */}
      {currentTab !== 'landing' && (
        <Sidebar
          currentTab={currentTab}
          currentUser={currentUser}
          onNavigate={(tab) => {
            setCurrentTab(tab);
            setIsMobileDrawerOpen(false);
          }}
          onOpenOnboarding={() => {
            setIsOnboardingOpen(true);
            setIsMobileDrawerOpen(false);
          }}
          onOpenLogin={handleOpenLogin}
          onOpenUserManagement={() => setIsUserManagementOpen(true)}
          isMobileOpen={isMobileDrawerOpen}
          onCloseMobile={() => setIsMobileDrawerOpen(false)}
        />
      )}

      {/* Main Wrapper */}
      <div className={`main-wrapper ${currentTab === 'landing' ? 'landing-mode-wrapper' : ''}`}>
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          profile={profile}
          currentUser={currentUser}
          onNavigate={(tab) => setCurrentTab(tab)}
          onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
          onOpenLogin={handleOpenLogin}
          onOpenSignup={handleOpenSignup}
          onOpenUserManagement={() => setIsUserManagementOpen(true)}
          onLogout={handleLogout}
        />

        {/* Dynamic Main View */}
        <main className="main-content" role="main">
          {currentTab === 'dashboard' && (
            <DashboardView
              profile={profile}
              skills={skills}
              continueChallenge={continueChallenge}
              topCareers={careers}
              onStartChallenge={(ch) => setActiveChallenge(ch)}
              onNavigate={(tab) => setCurrentTab(tab)}
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
              onNavigate={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'careers' && (
            <CareerMatchesView
              careers={careers}
              onSelectCareer={(car) => setSelectedCareer(car)}
            />
          )}

          {currentTab === 'learning-path' && (
            <LearningPathView
              learningPaths={learningPaths}
              onNavigate={(tab) => setCurrentTab(tab)}
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
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
              onOpenUserManagement={() => setIsUserManagementOpen(true)}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView />
          )}

          {currentTab === 'landing' && (
            <LandingPageView
              onStartAssessment={() => {
                if (currentUser) {
                  setCurrentTab('dashboard');
                } else {
                  handleOpenSignup();
                }
              }}
              onEnterDashboard={() => setCurrentTab('dashboard')}
              onOpenLogin={handleOpenLogin}
              onOpenSignup={handleOpenSignup}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {currentTab !== 'landing' && (
        <BottomNav
          currentTab={currentTab}
          onNavigate={(tab) => setCurrentTab(tab)}
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        />
      )}

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        currentProfile={profile}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={(updated) => {
          handleUpdateProfile(updated);
        }}
        onLaunchFirstChallenge={() => {
          setActiveChallenge(continueChallenge);
        }}
      />

      {/* Focused Challenge Runner */}
      {activeChallenge && (
        <ChallengeRunner
          challenge={activeChallenge}
          userLives={profile.lives}
          onClose={() => setActiveChallenge(null)}
          onComplete={handleChallengeComplete}
          onLifeLost={handleLifeLost}
        />
      )}

      {/* Career Detail Modal */}
      {selectedCareer && (
        <CareerDetailModal
          career={selectedCareer}
          onClose={() => setSelectedCareer(null)}
          onStartLearningPath={handleStartCareerPath}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* User Management Directory Modal */}
      <UserManagementModal
        isOpen={isUserManagementOpen}
        currentUser={currentUser}
        onClose={() => setIsUserManagementOpen(false)}
        onUserSwitched={handleUserSwitched}
        onOpenSignUp={() => {
          setIsUserManagementOpen(false);
          handleOpenSignup();
        }}
        onLogout={handleLogout}
      />

      <style>{`
        .landing-mode-wrapper {
          margin-left: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default App;
