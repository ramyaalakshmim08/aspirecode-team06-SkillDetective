import React, { useState, useEffect } from 'react';
import { NavigationTab, StudentProfile, SkillData, InteractiveChallenge, CareerMatch } from './types';
import { initialStudentProfile } from './data/studentProfileData';
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

  // Core Data States
  const [profile, setProfile] = useState<StudentProfile>(initialStudentProfile);
  const [skills, setSkills] = useState<SkillData[]>(initialSkillsData);
  const [challenges, setChallenges] = useState<InteractiveChallenge[]>(challengesData);
  const [careers] = useState<CareerMatch[]>(careersData);
  const [achievements, setAchievements] = useState(achievementsData);
  const [learningPaths] = useState(learningPathsData);

  // Modals & Active Runners
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<InteractiveChallenge | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<CareerMatch | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Check if first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('skill_detective_visited');
    if (!hasVisited) {
      setIsOnboardingOpen(true);
      localStorage.setItem('skill_detective_visited', 'true');
    }
  }, []);

  // Smooth scroll to top whenever navigation tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currentTab]);

  // Keyboard shortcut listener (Escape to close modals & drawer)
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
  };

  const handleStartCareerPath = () => {
    setCurrentTab('learning-path');
  };

  const continueChallenge = challenges.find((c) => c.id === 'logic-pattern-detective') || challenges[0];

  return (
    <div className="app-layout">
      {/* Desktop & Mobile Drawer Sidebar */}
      {currentTab !== 'landing' && (
        <Sidebar
          currentTab={currentTab}
          onNavigate={(tab) => {
            setCurrentTab(tab);
            setIsMobileDrawerOpen(false);
          }}
          onOpenOnboarding={() => {
            setIsOnboardingOpen(true);
            setIsMobileDrawerOpen(false);
          }}
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
          onNavigate={(tab) => setCurrentTab(tab)}
          onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
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
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView />
          )}

          {currentTab === 'landing' && (
            <LandingPageView
              onStartAssessment={() => {
                setCurrentTab('dashboard');
                setIsOnboardingOpen(true);
              }}
              onEnterDashboard={() => setCurrentTab('dashboard')}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation with 5 tabs including 'More' drawer toggle */}
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

      <style>{`
        .landing-mode-wrapper {
          margin-left: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default App;
