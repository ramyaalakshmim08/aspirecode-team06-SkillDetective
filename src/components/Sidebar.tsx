import React from 'react';
import { 
  LayoutDashboard, 
  Target, 
  BarChart3, 
  Briefcase, 
  Compass, 
  Award, 
  TrendingUp, 
  User, 
  Settings,
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onOpenOnboarding: () => void;
  role?: string;
  onLogout?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onNavigate, 
  onOpenOnboarding,
  role = 'student',
  onLogout,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'challenges', label: 'Challenges', icon: <Target size={18} /> },
    { id: 'skills', label: 'Skill Profile', icon: <BarChart3 size={18} /> },
    { id: 'careers', label: 'Career Matches', icon: <Briefcase size={18} /> },
    { id: 'learning-path', label: 'Learning Path', icon: <Compass size={18} /> },
    { id: 'achievements', label: 'Achievements', icon: <Award size={18} /> },
    { id: 'progress', label: 'Progress', icon: <TrendingUp size={18} /> },
  ];

  if (role === 'admin') {
    navItems.push({
      id: 'admin',
      label: 'Admin Center',
      icon: <Sparkles size={18} />,
      badge: 'Admin'
    });
  }

  const handleItemClick = (id: NavigationTab) => {
    onNavigate(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop overlay when drawer is open */}
      {isMobileOpen && (
        <div 
          className="mobile-sidebar-backdrop" 
          onClick={onCloseMobile} 
          aria-hidden="true" 
        />
      )}

      <aside className={`sidebar-container ${isMobileOpen ? 'sidebar-mobile-open' : ''}`} aria-label="Main Navigation">
        {/* Brand Logo Header */}
        <div className="sidebar-brand">
          <div className="brand-logo-mark" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
              <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="11" cy="11" r="2.5" fill="var(--accent-amber)" />
            </svg>
          </div>
          <div className="brand-text-block">
            <span className="brand-name">SKILL DETECTIVE</span>
            <span className="brand-tagline">Discovery Engine</span>
          </div>

          {/* Close button on mobile */}
          {onCloseMobile && (
            <button 
              type="button" 
              className="sidebar-close-btn-mobile" 
              onClick={onCloseMobile}
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Main Nav Items */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">ASSESSMENT & PATHS</div>
          <ul className="nav-list">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleItemClick(item.id)}
                    className={`nav-btn ${isActive ? 'nav-btn-active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                    {isActive && <span className="active-indicator" aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Explore Landing Page Mode */}
          <div className="nav-section-label" style={{ marginTop: 'var(--space-6)' }}>PREVIEWS & REPORTS</div>
          <ul className="nav-list">
            <li>
              <button
                type="button"
                onClick={() => handleItemClick('report')}
                className={`nav-btn ${currentTab === 'report' ? 'nav-btn-active' : ''}`}
              >
                <span className="nav-icon"><Award size={18} /></span>
                <span className="nav-label">Diagnostic Report</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleItemClick('landing')}
                className={`nav-btn ${currentTab === 'landing' ? 'nav-btn-active' : ''}`}
              >
                <span className="nav-icon"><Sparkles size={18} /></span>
                <span className="nav-label">Product Landing Page</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  onOpenOnboarding();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="nav-btn"
              >
                <span className="nav-icon"><HelpCircle size={18} /></span>
                <span className="nav-label">Retake Onboarding</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Bottom Profile & Settings */}
        <div className="sidebar-bottom">
          <ul className="nav-list">
            <li>
              <button
                type="button"
                onClick={() => handleItemClick('profile')}
                className={`nav-btn ${currentTab === 'profile' ? 'nav-btn-active' : ''}`}
              >
                <span className="nav-icon"><User size={18} /></span>
                <span className="nav-label">Student Profile</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleItemClick('settings')}
                className={`nav-btn ${currentTab === 'settings' ? 'nav-btn-active' : ''}`}
              >
                <span className="nav-icon"><Settings size={18} /></span>
                <span className="nav-label">Settings</span>
              </button>
            </li>
            {onLogout && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                    onLogout();
                  }}
                  className="nav-btn text-danger hover:text-danger"
                >
                  <span className="nav-icon"><X size={18} /></span>
                  <span className="nav-label">Sign Out</span>
                </button>
              </li>
            )}
          </ul>

          <div className="sidebar-version-tag">
            <span>Skill Detective v2.4</span>
            <span>Academic Edition</span>
          </div>
        </div>

        <style>{`
          .mobile-sidebar-backdrop {
            display: none;
            position: fixed;
            inset: 0;
            background-color: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(2px);
            z-index: 95;
          }

          .sidebar-container {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            width: var(--sidebar-width);
            background-color: var(--bg-surface);
            border-right: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            z-index: 40;
            user-select: none;
            transition: transform var(--transition-normal);
          }

          .sidebar-brand {
            height: var(--header-height);
            padding: 0 var(--space-4);
            display: flex;
            align-items: center;
            gap: var(--space-3);
            border-bottom: 1px solid var(--border-subtle);
          }

          .brand-logo-mark {
            width: 32px;
            height: 32px;
            border-radius: var(--radius-md);
            background-color: var(--primary-800);
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .brand-text-block {
            display: flex;
            flex-direction: column;
            flex: 1;
          }

          .brand-name {
            font-weight: 800;
            font-size: 0.85rem;
            letter-spacing: 0.04em;
            color: var(--primary-800);
            line-height: 1.2;
          }

          .brand-tagline {
            font-size: 0.68rem;
            color: var(--text-muted);
            font-weight: 500;
          }

          .sidebar-close-btn-mobile {
            display: none;
            color: var(--text-muted);
            padding: 6px;
            border-radius: var(--radius-sm);
          }

          .sidebar-close-btn-mobile:hover {
            background-color: var(--bg-subtle);
            color: var(--text-primary);
          }

          .sidebar-nav {
            flex: 1;
            padding: var(--space-4) var(--space-3);
            overflow-y: auto;
          }

          .nav-section-label {
            font-size: 0.68rem;
            font-weight: 700;
            color: var(--text-muted);
            letter-spacing: 0.06em;
            padding: 0 var(--space-3) var(--space-2) var(--space-3);
          }

          .nav-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 3px;
          }

          .nav-btn {
            width: 100%;
            display: flex;
            align-items: center;
            gap: var(--space-3);
            padding: 9px var(--space-3);
            border-radius: var(--radius-md);
            color: var(--text-secondary);
            font-size: 0.88rem;
            font-weight: 500;
            transition: background-color var(--transition-fast), color var(--transition-fast);
            position: relative;
            text-align: left;
          }

          .nav-btn:hover {
            background-color: var(--bg-subtle);
            color: var(--text-primary);
          }

          .nav-btn-active {
            background-color: var(--primary-light);
            color: var(--primary-800);
            font-weight: 600;
          }

          .nav-icon {
            display: flex;
            align-items: center;
            color: inherit;
          }

          .nav-label {
            flex: 1;
          }

          .nav-badge {
            font-size: 0.68rem;
            font-weight: 600;
            padding: 2px 6px;
            border-radius: var(--radius-full);
            background-color: var(--bg-subtle);
            color: var(--text-secondary);
            border: 1px solid var(--border-color);
          }

          .nav-btn-active .nav-badge {
            background-color: var(--bg-surface);
            color: var(--primary-800);
            border-color: var(--border-strong);
          }

          .active-indicator {
            position: absolute;
            left: 0;
            top: 6px;
            bottom: 6px;
            width: 3.5px;
            background-color: var(--accent-indigo);
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
          }

          .sidebar-bottom {
            padding: var(--space-3);
            border-top: 1px solid var(--border-subtle);
            background-color: var(--bg-surface);
          }

          .sidebar-version-tag {
            display: flex;
            justify-content: space-between;
            font-size: 0.68rem;
            color: var(--text-muted);
            padding: var(--space-2) var(--space-3) 0 var(--space-3);
          }

          /* Mobile drawer mode when width <= 900px */
          @media (max-width: 900px) {
            .mobile-sidebar-backdrop {
              display: block;
            }

            .sidebar-container {
              transform: translateX(-100%);
              z-index: 100;
              width: 280px;
              box-shadow: var(--shadow-lg);
            }

            .sidebar-container.sidebar-mobile-open {
              transform: translateX(0);
            }

            .sidebar-close-btn-mobile {
              display: flex;
            }
          }
        `}</style>
      </aside>
    </>
  );
};
