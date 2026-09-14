import React, { useState } from 'react';
import { 
  Flame, 
  Heart, 
  Zap, 
  Bell, 
  CheckCircle2, 
  ChevronRight, 
  Menu, 
  User, 
  Users, 
  Settings, 
  LogOut, 
  LogIn, 
  UserPlus, 
  ChevronDown
} from 'lucide-react';
import { StudentProfile, NavigationTab } from '../types';
import { UserAccount } from '../types/auth';
import { soundFx } from '../services/audioService';

interface HeaderProps {
  currentTab: NavigationTab;
  profile: StudentProfile;
  currentUser: UserAccount | null;
  onNavigate: (tab: NavigationTab) => void;
  onOpenMobileMenu?: () => void;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
  onOpenUserManagement: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentTab, 
  profile, 
  currentUser,
  onNavigate,
  onOpenMobileMenu,
  onOpenLogin,
  onOpenSignup,
  onOpenUserManagement,
  onLogout
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const breadcrumbLabels: Record<NavigationTab, { parent: string; title: string }> = {
    dashboard: { parent: 'Overview', title: 'Dashboard' },
    challenges: { parent: 'Skill Testing', title: 'Challenges' },
    skills: { parent: 'Diagnostics', title: 'Skill Profile' },
    careers: { parent: 'Career Guidance', title: 'Career Matches' },
    'learning-path': { parent: 'Action Plan', title: 'Learning Path' },
    achievements: { parent: 'Recognition', title: 'Achievements' },
    progress: { parent: 'Analytics', title: 'Progress' },
    profile: { parent: 'Account', title: 'Student Profile' },
    settings: { parent: 'Preferences', title: 'Settings' },
    landing: { parent: 'Preview', title: 'Overview' }
  };

  const dynamicNotifications = [
    {
      id: 1,
      title: `${profile.streakDays}-Day Habit Streak`,
      desc: profile.streakDays > 1 
        ? `You have maintained active diagnostic consistency for ${profile.streakDays} consecutive days.`
        : 'Complete today’s diagnostic challenge to build your consistency streak.',
      time: 'Today',
      unread: true
    },
    {
      id: 2,
      title: `Skill Score: ${profile.overallScore}% Verified`,
      desc: `Your cognitive calibration is active across 8 measured dimensions with ${profile.lives} attempts remaining.`,
      time: 'Active',
      unread: false
    },
    {
      id: 3,
      title: `Level ${profile.level} Investigator`,
      desc: `Current total XP: ${profile.xp.toLocaleString()}. Next evaluation milestone at ${profile.nextLevelXp.toLocaleString()} XP.`,
      time: 'Milestone',
      unread: false
    }
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const closeAllDropdowns = () => {
    setShowNotifications(false);
    setShowStreakModal(false);
    setShowUserDropdown(false);
  };

  return (
    <header className="app-header" role="banner">
      {/* Left: Mobile Menu Toggle + Breadcrumbs / Title */}
      <div className="header-left">
        {onOpenMobileMenu && (
          <button
            type="button"
            className="mobile-menu-trigger"
            onClick={onOpenMobileMenu}
            aria-label="Open navigation drawer"
          >
            <Menu size={20} />
          </button>
        )}

        <div className="header-breadcrumbs">
          <span className="breadcrumb-parent">{breadcrumbLabels[currentTab].parent}</span>
          <ChevronRight size={14} className="breadcrumb-separator" />
          <h1 className="header-title">{breadcrumbLabels[currentTab].title}</h1>
        </div>
      </div>

      {/* Right: Gamification Status Indicators & User Controls */}
      <div className="header-right">
        {/* Streak Button */}
        <div className="relative-container">
          <button
            type="button"
            className="stat-pill streak-pill"
            onClick={() => {
              setShowStreakModal(!showStreakModal);
              setShowNotifications(false);
              setShowUserDropdown(false);
            }}
            title={`${profile.streakDays}-Day Streak: Click to view habit progress`}
            aria-label={`${profile.streakDays} Day Streak`}
          >
            <Flame size={15} className="streak-icon" />
            <span className="hide-on-mobile">{profile.streakDays} days</span>
            <span className="show-on-mobile font-mono">{profile.streakDays}</span>
          </button>

          {showStreakModal && (
            <div className="header-popover streak-popover" role="dialog">
              <div className="popover-header">
                <div className="popover-title-row">
                  <Flame size={18} className="streak-icon" />
                  <strong>{profile.streakDays} DAY STREAK</strong>
                </div>
                <p className="text-xs text-muted">Keep your streak active by solving at least 1 diagnostic challenge daily.</p>
              </div>
              <div className="streak-days-grid">
                {daysOfWeek.map((day, idx) => (
                  <div key={day} className={`streak-day-box ${idx < Math.min(7, profile.streakDays) ? 'streak-day-active' : ''}`}>
                    <span className="day-name">{day}</span>
                    <CheckCircle2 size={15} className="day-check" />
                  </div>
                ))}
              </div>
              <div className="popover-footer">
                <span className="text-xs">Next milestone bonus: <strong>+100 XP</strong> on Day 7</span>
              </div>
            </div>
          )}
        </div>

        {/* XP Counter */}
        <div className="stat-pill xp-pill" title="Total Experience Points">
          <Zap size={14} className="xp-icon" />
          <span className="font-mono hide-on-mobile">{profile.xp.toLocaleString()} XP</span>
          <span className="font-mono show-on-mobile">{(profile.xp / 1000).toFixed(1)}k</span>
        </div>

        {/* Lives Counter */}
        <div className="stat-pill lives-pill" title="Challenge attempts remaining">
          <Heart size={14} className="heart-filled" />
          <span className="font-mono text-xs">{profile.lives}</span>
        </div>

        {/* Notifications */}
        <div className="relative-container">
          <button
            type="button"
            className="header-icon-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowStreakModal(false);
              setShowUserDropdown(false);
            }}
            aria-label="Notifications"
          >
            <Bell size={17} />
            <span className="notification-badge">1</span>
          </button>

          {showNotifications && (
            <div className="header-popover notifications-popover" role="dialog">
              <div className="popover-header">
                <strong>Diagnostic Alerts</strong>
                <span className="text-xs text-muted">1 unread</span>
              </div>
              <div className="notifications-list">
                {dynamicNotifications.map((notif) => (
                  <div key={notif.id} className={`notification-item ${notif.unread ? 'unread-item' : ''}`}>
                    <div className="notification-title-row">
                      <span className="notif-title">{notif.title}</span>
                      <span className="notif-time">{notif.time}</span>
                    </div>
                    <p className="notif-desc">{notif.desc}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="popover-footer-btn"
                onClick={() => setShowNotifications(false)}
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>

        {/* User Profile / Auth Controls */}
        {currentUser ? (
          <div className="relative-container">
            <button
              type="button"
              className="user-profile-btn"
              onClick={() => {
                setShowUserDropdown(!showUserDropdown);
                setShowNotifications(false);
                setShowStreakModal(false);
              }}
              aria-label="User Account Menu"
              aria-expanded={showUserDropdown}
            >
              <div className="user-avatar-circle">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-info-text hide-on-mobile">
                <span className="user-name">{currentUser.name}</span>
                <span className="user-level-badge">Lvl {profile.level}</span>
              </div>
              <ChevronDown size={14} className="dropdown-caret hide-on-mobile" />
            </button>

            {showUserDropdown && (
              <div className="header-popover user-dropdown-popover" role="menu">
                {/* Account Summary */}
                <div className="user-dropdown-header">
                  <div className="user-dropdown-avatar">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-dropdown-info">
                    <strong className="user-dropdown-name">{currentUser.name}</strong>
                    <span className="user-dropdown-email text-xs text-muted font-mono">{currentUser.email}</span>
                    <div className="user-dropdown-badges">
                      <span className="badge badge-indigo text-xs">{currentUser.department}</span>
                      <span className="badge badge-gray text-xs">{currentUser.year}</span>
                    </div>
                  </div>
                </div>

                {/* Dropdown Menu Items */}
                <div className="user-dropdown-items">
                  <button
                    type="button"
                    className="dropdown-item-btn"
                    onClick={() => {
                      onNavigate('profile');
                      closeAllDropdowns();
                    }}
                  >
                    <User size={15} />
                    <span>My Student Profile</span>
                  </button>

                  <button
                    type="button"
                    className="dropdown-item-btn"
                    onClick={() => {
                      onOpenUserManagement();
                      closeAllDropdowns();
                    }}
                  >
                    <Users size={15} />
                    <span>Switch User / Manage Accounts</span>
                  </button>

                  <button
                    type="button"
                    className="dropdown-item-btn"
                    onClick={() => {
                      onNavigate('settings');
                      closeAllDropdowns();
                    }}
                  >
                    <Settings size={15} />
                    <span>Settings & Preferences</span>
                  </button>

                  <div className="dropdown-divider" />

                  <button
                    type="button"
                    className="dropdown-item-btn logout-btn"
                    onClick={() => {
                      soundFx.playClick();
                      onLogout();
                      closeAllDropdowns();
                    }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="guest-auth-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                soundFx.playClick();
                onOpenLogin();
              }}
            >
              <LogIn size={14} />
              <span className="hide-on-mobile">Sign In</span>
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                soundFx.playClick();
                onOpenSignup();
              }}
            >
              <UserPlus size={14} />
              <span>Create Account</span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        .app-header {
          height: var(--header-height);
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-8);
          position: sticky;
          top: 0;
          z-index: 30;
          box-sizing: border-box;
          width: 100%;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          min-width: 0;
        }

        .mobile-menu-trigger {
          display: none;
          align-items: center;
          justify-content: center;
          padding: 6px;
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-color);
          cursor: pointer;
        }

        .header-breadcrumbs {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .breadcrumb-parent {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .breadcrumb-separator {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .header-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex-shrink: 0;
        }

        .relative-container {
          position: relative;
        }

        .streak-pill {
          color: #C2410C;
          background-color: #FFF7ED;
          border: 1px solid #FFEDD5;
          cursor: pointer;
          padding: 4px 8px;
          display: flex;
          align-items: center;
          gap: 5px;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 600;
          transition: background-color var(--transition-fast);
        }

        .streak-pill:hover {
          background-color: #FFEDD5;
        }

        .streak-icon {
          color: #EA580C;
          fill: #EA580C;
        }

        .xp-pill {
          color: var(--accent-indigo);
          background-color: var(--accent-indigo-subtle);
          border: 1px solid #C7D2FE;
          padding: 4px 8px;
          display: flex;
          align-items: center;
          gap: 5px;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 600;
        }

        .xp-icon {
          color: var(--accent-indigo);
          fill: var(--accent-indigo);
        }

        .lives-pill {
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 600;
        }

        .heart-filled {
          color: #EF4444;
          fill: #EF4444;
        }

        .header-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background-color: var(--bg-surface);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all var(--transition-fast);
        }

        .header-icon-btn:hover {
          background-color: var(--bg-subtle);
          color: var(--text-primary);
        }

        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background-color: var(--color-danger);
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-surface);
        }

        .header-popover {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          padding: var(--space-3);
          z-index: 50;
          animation: slideUp 0.15s ease-out;
        }

        .streak-popover {
          width: 280px;
        }

        .popover-header {
          padding-bottom: var(--space-2);
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: var(--space-3);
        }

        .popover-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .streak-days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          margin-bottom: var(--space-3);
        }

        .streak-day-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 6px 2px;
          background-color: var(--bg-subtle);
          border-radius: var(--radius-sm);
          font-size: 0.68rem;
          color: var(--text-muted);
        }

        .streak-day-active {
          background-color: #FFEDD5;
          color: #C2410C;
          font-weight: 600;
        }

        .day-check {
          color: #EA580C;
        }

        .popover-footer {
          border-top: 1px solid var(--border-subtle);
          padding-top: var(--space-2);
          text-align: center;
          color: var(--text-secondary);
        }

        .notifications-popover {
          width: 300px;
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 240px;
          overflow-y: auto;
          margin-bottom: var(--space-2);
        }

        .notification-item {
          padding: 8px;
          border-radius: var(--radius-sm);
          background-color: var(--bg-surface);
          border: 1px solid var(--border-subtle);
        }

        .notification-item.unread-item {
          background-color: var(--color-indigo-subtle);
          border-color: var(--color-indigo-border);
        }

        .notification-title-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .notif-time {
          font-size: 0.68rem;
          color: var(--text-muted);
        }

        .notif-desc {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.35;
        }

        .popover-footer-btn {
          width: 100%;
          padding: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent-indigo);
          text-align: center;
          border-radius: var(--radius-sm);
          background: none;
          border: none;
          cursor: pointer;
        }

        .popover-footer-btn:hover {
          background-color: var(--bg-subtle);
        }

        .user-profile-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: 3px 8px 3px 3px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background-color: var(--bg-surface);
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }

        .user-profile-btn:hover {
          background-color: var(--bg-subtle);
        }

        .user-avatar-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: var(--accent-indigo);
          color: #FFFFFF;
          font-weight: 700;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-info-text {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .user-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .user-level-badge {
          font-size: 0.68rem;
          font-weight: 700;
          background-color: var(--bg-subtle);
          color: var(--text-secondary);
          padding: 1px 5px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
        }

        .dropdown-caret {
          color: var(--text-muted);
        }

        .user-dropdown-popover {
          width: 290px;
        }

        .user-dropdown-header {
          display: flex;
          gap: 10px;
          padding-bottom: var(--space-3);
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: var(--space-2);
        }

        .user-dropdown-avatar {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          background-color: var(--accent-indigo);
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .user-dropdown-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .user-dropdown-name {
          font-size: 0.92rem;
          color: var(--text-primary);
        }

        .user-dropdown-badges {
          display: flex;
          gap: 4px;
          margin-top: 4px;
          flex-wrap: wrap;
        }

        .user-dropdown-items {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .dropdown-item-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: var(--radius-md);
          border: none;
          background: transparent;
          color: var(--text-primary);
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: background-color var(--transition-fast);
        }

        .dropdown-item-btn:hover {
          background-color: var(--bg-subtle);
        }

        .dropdown-divider {
          height: 1px;
          background-color: var(--border-subtle);
          margin: 4px 0;
        }

        .logout-btn {
          color: var(--color-danger);
        }

        .logout-btn:hover {
          background-color: var(--color-danger-subtle);
        }

        .guest-auth-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .show-on-mobile {
          display: none;
        }

        @media (max-width: 900px) {
          .app-header {
            padding: 0 var(--space-3);
          }
          .mobile-menu-trigger {
            display: flex;
          }
          .breadcrumb-parent, .breadcrumb-separator {
            display: none;
          }
          .header-title {
            font-size: 1.05rem;
          }
        }

        @media (max-width: 600px) {
          .hide-on-mobile {
            display: none !important;
          }
          .show-on-mobile {
            display: inline-block;
          }
          .header-right {
            gap: 4px;
          }
          .notifications-popover, .streak-popover, .user-dropdown-popover {
            width: 270px;
            right: -10px;
          }
        }

        @media (max-width: 480px) {
          .app-header {
            padding: 0 var(--space-2);
          }
          .header-left {
            gap: 6px;
            max-width: 40%;
            min-width: 0;
          }
          .header-title {
            font-size: 0.92rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .header-right {
            gap: 4px;
          }
          .stat-pill {
            padding: 3px 6px;
            font-size: 0.72rem;
          }
          .user-profile-btn {
            padding: 2px;
          }
        }
      `}</style>
    </header>
  );
};
