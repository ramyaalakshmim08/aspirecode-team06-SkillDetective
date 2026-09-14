import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Heart, 
  Zap, 
  Bell, 
  CheckCircle2, 
  ChevronRight, 
  Menu, 
  LogOut, 
  User, 
  Settings, 
  ShieldCheck, 
  Printer, 
  Search,
  X
} from 'lucide-react';
import { StudentProfile, NavigationTab, AppNotification } from '../types';
import { NotificationService } from '../services/notificationService';
import { soundFx } from '../services/audioService';

interface HeaderProps {
  currentTab: NavigationTab;
  profile: StudentProfile;
  onNavigate: (tab: NavigationTab) => void;
  onLogout?: () => void;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentTab, 
  profile, 
  onNavigate,
  onLogout,
  onOpenMobileMenu 
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    landing: { parent: 'Preview', title: 'Overview' },
    login: { parent: 'Security', title: 'Sign In' },
    signup: { parent: 'Security', title: 'Register' },
    'forgot-password': { parent: 'Security', title: 'Reset' },
    admin: { parent: 'Platform', title: 'Admin Center' },
    report: { parent: 'Transcript', title: 'Assessment Report' }
  };

  useEffect(() => {
    if (profile.id) {
      setNotifications(NotificationService.getNotifications(profile.id));
    }
  }, [profile.id, showNotifications]);

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    NotificationService.markAllAsRead(profile.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    soundFx.playClick();
  };

  const handleNotificationClick = (notif: AppNotification) => {
    NotificationService.markAsRead(profile.id, notif.id);
    setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)));
    if (notif.type === 'milestone') onNavigate('achievements');
    if (notif.type === 'streak') onNavigate('progress');
    if (notif.type === 'recommendation') onNavigate('challenges');
    setShowNotifications(false);
  };

  const searchResults = [
    { title: 'Logic & Sequence Deduction', category: 'Challenges', tab: 'challenges' as NavigationTab },
    { title: 'Array Deduplication in O(N)', category: 'Challenges', tab: 'challenges' as NavigationTab },
    { title: 'Attention to Detail Security Audit', category: 'Challenges', tab: 'challenges' as NavigationTab },
    { title: 'QA / Test Automation Engineer', category: 'Careers', tab: 'careers' as NavigationTab },
    { title: 'Software Developer', category: 'Careers', tab: 'careers' as NavigationTab },
    { title: 'Data Analyst', category: 'Careers', tab: 'careers' as NavigationTab },
    { title: 'Executive Communication Curriculum', category: 'Learning', tab: 'learning-path' as NavigationTab },
    { title: 'Verified Assessment Report', category: 'Reports', tab: 'report' as NavigationTab }
  ].filter((item) => 
    !searchQuery || 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="app-header" role="banner">
      {/* Left: Mobile Menu Toggle + Breadcrumbs */}
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
          <span className="breadcrumb-parent">{breadcrumbLabels[currentTab]?.parent || 'Skill Detective'}</span>
          <ChevronRight size={14} className="breadcrumb-separator" />
          <h1 className="header-title">{breadcrumbLabels[currentTab]?.title || 'Dashboard'}</h1>
        </div>
      </div>

      {/* Global Quick Search Shortcut */}
      <div className="header-search-trigger hide-on-mobile">
        <button
          type="button"
          className="search-shortcut-btn"
          onClick={() => setShowSearchModal(true)}
          title="Search Skill Detective (Ctrl+K)"
        >
          <Search size={14} className="text-muted" />
          <span className="text-xs text-muted">Quick Search...</span>
          <kbd className="search-kbd">Ctrl K</kbd>
        </button>
      </div>

      {/* Right: Gamification Status + Profile Menu */}
      <div className="header-right">
        {/* Streak Button */}
        <div className="stat-pill streak-pill" title={`Current streak: ${profile.streakDays} days`}>
          <Flame size={15} className="streak-icon" />
          <span className="font-mono">{profile.streakDays}d</span>
        </div>

        {/* Lives Counter */}
        <div className="stat-pill lives-pill" title={`${profile.lives} diagnostic attempts remaining`}>
          <Heart size={15} className="lives-icon" />
          <span className="font-mono">{profile.lives}/{profile.maxLives}</span>
        </div>

        {/* XP Counter */}
        <div className="stat-pill xp-pill" title={`Level ${profile.level} (${profile.xp} Total XP)`}>
          <Zap size={15} className="xp-icon" />
          <span className="font-mono">{profile.xp} XP</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative-container">
          <button
            type="button"
            className="icon-btn notif-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="header-popover notif-popover" role="dialog">
              <div className="popover-header">
                <span className="popover-title">Notifications</span>
                {unreadCount > 0 && (
                  <button type="button" className="text-btn text-xs text-accent" onClick={handleMarkAllRead}>
                    Mark all read
                  </button>
                )}
              </div>

              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-muted">
                    No notifications yet. Complete challenges to earn milestones!
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`notif-item ${notif.isRead ? 'notif-read' : 'notif-unread'}`}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="notif-content">
                        <strong className="notif-item-title">{notif.title}</strong>
                        <p className="notif-item-desc">{notif.description}</p>
                        <span className="notif-item-time">
                          {new Date(notif.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      {!notif.isRead && <span className="notif-dot" />}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative-container">
          <button
            type="button"
            className="user-profile-btn"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            aria-label="User Account Menu"
          >
            <div className="user-avatar-mark">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <span className="hide-on-mobile text-xs font-bold text-foreground max-w-[100px] truncate">
              {profile.name}
            </span>
          </button>

          {showUserMenu && (
            <div className="header-popover user-dropdown-popover" role="dialog">
              <div className="p-3 border-b border-subtle">
                <div className="font-bold text-sm text-foreground truncate">{profile.name}</div>
                <div className="text-xs text-muted font-mono truncate">{profile.email}</div>
                <span className={`badge text-[10px] mt-1 uppercase ${profile.role === 'admin' ? 'badge-accent' : 'badge-secondary'}`}>
                  {profile.role}
                </span>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    onNavigate('profile');
                    setShowUserMenu(false);
                  }}
                >
                  <User size={15} />
                  <span>Student Profile</span>
                </button>

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    onNavigate('report');
                    setShowUserMenu(false);
                  }}
                >
                  <Printer size={15} />
                  <span>Assessment Report</span>
                </button>

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    onNavigate('settings');
                    setShowUserMenu(false);
                  }}
                >
                  <Settings size={15} />
                  <span>Settings & Preferences</span>
                </button>

                {profile.role === 'admin' && (
                  <button
                    type="button"
                    className="dropdown-item text-accent font-semibold"
                    onClick={() => {
                      onNavigate('admin');
                      setShowUserMenu(false);
                    }}
                  >
                    <ShieldCheck size={15} />
                    <span>Admin Control Center</span>
                  </button>
                )}

                {onLogout && (
                  <button
                    type="button"
                    className="dropdown-item text-danger border-t border-subtle mt-1"
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Search Dialog */}
      {showSearchModal && (
        <div className="modal-backdrop fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 p-4">
          <div className="bg-surface border border-border rounded-xl max-w-lg w-full p-4 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-subtle pb-3 mb-3">
              <Search size={18} className="text-muted" />
              <input
                type="text"
                className="w-full bg-transparent border-none text-foreground text-sm outline-none"
                placeholder="Search challenges, skills, careers, or curricula..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                className="text-muted hover:text-foreground"
                onClick={() => setShowSearchModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-1">
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted">
                  No matches found for "{searchQuery}".
                </div>
              ) : (
                searchResults.map((res) => (
                  <button
                    key={res.title}
                    type="button"
                    className="w-full text-left p-2 rounded hover:bg-surface-raised flex justify-between items-center text-sm"
                    onClick={() => {
                      onNavigate(res.tab);
                      setShowSearchModal(false);
                    }}
                  >
                    <span className="font-medium text-foreground">{res.title}</span>
                    <span className="badge badge-secondary text-xs">{res.category}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .search-shortcut-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background-color: var(--bg-surface-raised);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 4px 10px;
          cursor: pointer;
        }

        .search-kbd {
          font-size: 10px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
          padding: 1px 4px;
          color: var(--text-muted);
          font-family: monospace;
        }

        .user-profile-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px 6px;
          border-radius: var(--radius-md);
        }

        .user-profile-btn:hover {
          background-color: var(--bg-surface-raised);
        }

        .user-avatar-mark {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-full);
          background-color: var(--accent-indigo);
          color: white;
          font-weight: bold;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-dropdown-popover {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 220px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
          z-index: 100;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          width: 100%;
          padding: 8px 12px;
          text-align: left;
          background: none;
          border: none;
          font-size: var(--text-xs);
          color: var(--text-primary);
          cursor: pointer;
        }

        .dropdown-item:hover {
          background-color: var(--bg-surface-raised);
        }
      `}</style>
    </header>
  );
};
