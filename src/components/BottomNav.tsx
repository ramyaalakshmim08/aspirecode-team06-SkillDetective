import React from 'react';
import { LayoutDashboard, Target, BarChart3, Briefcase, Menu } from 'lucide-react';
import { NavigationTab } from '../types';

interface BottomNavProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onOpenMobileDrawer: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  currentTab, 
  onNavigate,
  onOpenMobileDrawer
}) => {
  const items: { id: NavigationTab | 'more'; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard size={19} /> },
    { id: 'challenges', label: 'Challenges', icon: <Target size={19} /> },
    { id: 'skills', label: 'Skills', icon: <BarChart3 size={19} /> },
    { id: 'careers', label: 'Careers', icon: <Briefcase size={19} /> },
    { id: 'more', label: 'More', icon: <Menu size={19} /> },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      {items.map((item) => {
        const isActive = item.id !== 'more' && currentTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`bottom-nav-btn ${isActive ? 'bottom-nav-active' : ''}`}
            onClick={() => {
              if (item.id === 'more') {
                onOpenMobileDrawer();
              } else {
                onNavigate(item.id);
              }
            }}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        );
      })}

      <style>{`
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: calc(60px + env(safe-area-inset-bottom, 0px));
          background-color: var(--bg-surface);
          border-top: 1px solid var(--border-color);
          z-index: 50;
          align-items: center;
          justify-content: space-around;
          padding: 0 var(--space-1) env(safe-area-inset-bottom, 0px) var(--space-1);
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
          box-sizing: border-box;
        }

        .bottom-nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          color: var(--text-muted);
          padding: 6px 8px;
          border-radius: var(--radius-md);
          transition: color var(--transition-fast);
          flex: 1;
          height: 100%;
        }

        .bottom-nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bottom-nav-label {
          font-size: 0.7rem;
          font-weight: 600;
        }

        .bottom-nav-active {
          color: var(--accent-indigo);
        }

        .bottom-nav-active .bottom-nav-icon {
          transform: translateY(-1px);
        }

        @media (max-width: 900px) {
          .mobile-bottom-nav {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
};
