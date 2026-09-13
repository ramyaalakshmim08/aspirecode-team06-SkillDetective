import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Compass, 
  Eye, 
  Flame, 
  Cpu, 
  BarChart2, 
  MessageSquare, 
  Code2, 
  Zap, 
  Layers 
} from 'lucide-react';
import { Achievement } from '../types';

interface AchievementsViewProps {
  achievements: Achievement[];
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ achievements }) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const filteredAchievements = achievements.filter(a => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  const renderBadgeIcon = (iconName: string, unlocked: boolean) => {
    const size = 20;
    const colorClass = unlocked ? 'badge-icon-active' : 'badge-icon-locked';
    switch (iconName) {
      case 'Compass': return <Compass size={size} className={colorClass} />;
      case 'Eye': return <Eye size={size} className={colorClass} />;
      case 'Flame': return <Flame size={size} className={colorClass} />;
      case 'Cpu': return <Cpu size={size} className={colorClass} />;
      case 'BarChart2': return <BarChart2 size={size} className={colorClass} />;
      case 'MessageSquare': return <MessageSquare size={size} className={colorClass} />;
      case 'Code2': return <Code2 size={size} className={colorClass} />;
      case 'Zap': return <Zap size={size} className={colorClass} />;
      case 'Layers': return <Layers size={size} className={colorClass} />;
      default: return <Award size={size} className={colorClass} />;
    }
  };

  return (
    <div className="achievements-page">
      {/* Header */}
      <div className="achievements-header-strip">
        <div>
          <h2 className="page-heading">Achievements & Badges</h2>
          <p className="page-subtitle">
            Celebrate milestone problem-solving stamina and verified skill calibration benchmarks.
          </p>
        </div>

        {/* Milestone Summary Counter */}
        <div className="achieve-counter-pill">
          <Award size={16} className="text-accent" />
          <span className="font-mono text-xs">
            <strong>{unlockedCount}</strong> of {achievements.length} Unlocked
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="achieve-filter-row">
        <button
          type="button"
          className={`filter-btn ${filter === 'all' ? 'filter-btn-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Badges ({achievements.length})
        </button>
        <button
          type="button"
          className={`filter-btn ${filter === 'unlocked' ? 'filter-btn-active' : ''}`}
          onClick={() => setFilter('unlocked')}
        >
          Unlocked ({unlockedCount})
        </button>
        <button
          type="button"
          className={`filter-btn ${filter === 'locked' ? 'filter-btn-active' : ''}`}
          onClick={() => setFilter('locked')}
        >
          In Progress ({achievements.length - unlockedCount})
        </button>
      </div>

      {/* Badges Grid */}
      <div className="achievements-grid">
        {filteredAchievements.map((item) => {
          const progressPercent = Math.min(100, Math.round((item.progressCurrent / item.progressTotal) * 100));

          return (
            <div 
              key={item.id} 
              className={`achievement-badge-card card ${item.unlocked ? 'card-unlocked' : 'card-locked'}`}
            >
              {/* Badge Emblem Top */}
              <div className="badge-emblem-wrapper">
                <div className={`badge-geometric-shield ${item.unlocked ? 'shield-active' : 'shield-inactive'}`}>
                  {renderBadgeIcon(item.iconName, item.unlocked)}
                </div>

                <span className="xp-reward-tag font-mono">
                  +{item.xpReward} XP
                </span>
              </div>

              {/* Title & Desc */}
              <div className="badge-text-block">
                <h3 className="badge-title">{item.title}</h3>
                <p className="badge-desc text-xs">{item.description}</p>
              </div>

              {/* Status / Progress Footer */}
              <div className="badge-footer">
                {item.unlocked ? (
                  <div className="unlocked-date-strip">
                    <CheckCircle2 size={13} className="text-success" />
                    <span className="text-xs text-muted">Unlocked {item.unlockedDate}</span>
                  </div>
                ) : (
                  <div className="progress-lock-strip">
                    <div className="progress-numbers">
                      <span className="text-xs text-muted">Progress</span>
                      <span className="font-mono text-xs font-semibold">
                        {item.progressCurrent} / {item.progressTotal}
                      </span>
                    </div>
                    <div className="progress-bar-track" style={{ height: '5px' }}>
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${progressPercent}%`, backgroundColor: 'var(--accent-indigo)' }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .achievements-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          width: 100%;
        }

        .achievements-header-strip {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-3);
        }

        .page-heading {
          font-size: 1.45rem;
          color: var(--primary-900);
        }

        .page-subtitle {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .achieve-counter-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          padding: 6px 12px;
          border-radius: var(--radius-md);
        }

        .achieve-filter-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 5px 12px;
          border-radius: var(--radius-full);
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .filter-btn-active {
          background-color: var(--primary-800);
          color: #FFFFFF;
          border-color: var(--primary-800);
          font-weight: 600;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-3);
        }

        .achievement-badge-card {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          padding: var(--space-4);
        }

        .badge-emblem-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .badge-geometric-shield {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .shield-active {
          background-color: var(--accent-indigo-subtle);
          border: 1.5px solid #C7D2FE;
          color: var(--accent-indigo);
        }

        .shield-inactive {
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-color);
          color: var(--text-muted);
        }

        .badge-icon-active {
          color: var(--accent-indigo);
        }

        .badge-icon-locked {
          color: var(--text-muted);
          opacity: 0.6;
        }

        .xp-reward-tag {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: var(--radius-xs);
          background-color: var(--bg-subtle);
          color: var(--text-secondary);
        }

        .badge-text-block {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .badge-title {
          font-size: 0.98rem;
          color: var(--primary-900);
        }

        .badge-desc {
          color: var(--text-muted);
          line-height: 1.35;
          min-height: 32px;
        }

        .badge-footer {
          margin-top: auto;
          border-top: 1px solid var(--border-subtle);
          padding-top: var(--space-2);
        }

        .unlocked-date-strip {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .progress-lock-strip {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .progress-numbers {
          display: flex;
          justify-content: space-between;
        }

        @media (max-width: 900px) {
          .achievements-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 550px) {
          .achievements-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
