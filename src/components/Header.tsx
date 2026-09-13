import React, { useState } from 'react';
import { Flame, Heart, Zap, Bell, CheckCircle2, ChevronRight, Menu } from 'lucide-react';
import { StudentProfile, NavigationTab } from '../types';

interface HeaderProps {
  currentTab: NavigationTab;
  profile: StudentProfile;
  onNavigate: (tab: NavigationTab) => void;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentTab, 
  profile, 
  onNavigate,
  onOpenMobileMenu 
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);

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

  const notifications = [
    {
      id: 1,
      title: '7-Day Streak Achieved!',
      desc: 'You unlocked the 7-Day Consistency badge and earned +100 XP.',
      time: '1h ago',
      unread: true
    },
    {
      id: 2,
      title: 'Attention to Detail Calibrated',
      desc: 'Your recent spot-the-difference assessment scored 91 (+7 points).',
      time: 'Yesterday',
      unread: false
    },
    {
      id: 3,
      title: 'New Career Match Unlocked',
      desc: 'Based on your recent scores, QA Engineer now matches at 88%.',
      time: '2 days ago',
      unread: false
    }
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

      {/* Right: Gamification Status Indicators */}
      <div className="header-right">
        {/* Streak Button */}
        <div className="relative-container">
          <button
            type="button"
            className="stat-pill streak-pill"
            onClick={() => setShowStreakModal(!showStreakModal)}
            title="7-Day Streak: Click to view details"
            aria-label="7 Day Streak"
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
                  <strong>7 DAY STREAK</strong>
                </div>
                <p className="text-xs text-muted">Keep your streak alive by solving 1 challenge daily.</p>
              </div>
              <div className="streak-days-grid">
                {daysOfWeek.map((day, idx) => (
                  <div key={day} className={`streak-day-box ${idx <= 6 ? 'streak-day-active' : ''}`}>
                    <span className="day-name">{day}</span>
                    <CheckCircle2 size={15} className="day-check" />
                  </div>
                ))}
              </div>
              <div className="popover-footer">
                <span className="text-xs">Next reward: <strong>+50 XP</strong> on Day 10</span>
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
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={17} />
            <span className="notification-badge">1</span>
          </button>

          {showNotifications && (
            <div className="header-popover notifications-popover" role="dialog">
              <div className="popover-header">
                <strong>Notifications</strong>
                <span className="text-xs text-muted">1 unread</span>
              </div>
              <div className="notifications-list">
                {notifications.map((notif) => (
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

        {/* Student Avatar & Level */}
        <button
          type="button"
          className="user-profile-btn"
          onClick={() => onNavigate('profile')}
          aria-label="View Student Profile"
        >
          <div className="user-avatar-circle">
            {profile.name.charAt(0)}
          </div>
          <div className="user-info-text hide-on-mobile">
            <span className="user-name">{profile.name}</span>
            <span className="user-level-badge">Lvl {profile.level}</span>
          </div>
        </button>
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
          border-color: #FFEDD5;
          cursor: pointer;
          padding: 4px 8px;
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
          border-color: #C7D2FE;
          padding: 4px 8px;
        }

        .xp-icon {
          color: var(--accent-indigo);
          fill: var(--accent-indigo);
        }

        .lives-pill {
          background-color: var(--bg-subtle);
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
        }

        .heart-filled {
          color: #DC2626;
          fill: #DC2626;
        }

        .header-icon-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background-color: var(--bg-surface);
          color: var(--text-secondary);
          position: relative;
          transition: background-color var(--transition-fast);
        }

        .header-icon-btn:hover {
          background-color: var(--bg-subtle);
          color: var(--text-primary);
        }

        .notification-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: var(--accent-indigo);
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-popover {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 290px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          padding: var(--space-3);
          z-index: 50;
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
          width: 290px;
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
          background-color: var(--accent-indigo-subtle);
          border-color: #C7D2FE;
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
        }

        .popover-footer-btn:hover {
          background-color: var(--bg-subtle);
        }

        .user-profile-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: 3px 6px 3px 3px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background-color: var(--bg-surface);
          transition: background-color var(--transition-fast);
        }

        .user-profile-btn:hover {
          background-color: var(--bg-subtle);
        }

        .user-avatar-circle {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background-color: var(--primary-800);
          color: #FFFFFF;
          font-weight: 700;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-info-text {
          display: flex;
          align-items: center;
          gap: 6px;
          padding-right: 4px;
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
          .notifications-popover, .streak-popover {
            width: 260px;
            right: -20px;
          }
        }

        @media (max-width: 480px) {
          .app-header {
            padding: 0 var(--space-2);
          }
          .header-left {
            gap: 6px;
            max-width: 44%;
            min-width: 0;
          }
          .header-title {
            font-size: 0.92rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .header-right {
            gap: 3px;
          }
          .stat-pill {
            padding: 3px 6px;
            font-size: 0.72rem;
          }
          .user-profile-btn {
            padding: 2px;
          }
          .notifications-popover, .streak-popover {
            width: 270px;
            max-width: calc(100vw - 16px);
            right: -8px;
          }
        }
      `}</style>
    </header>
  );
};
