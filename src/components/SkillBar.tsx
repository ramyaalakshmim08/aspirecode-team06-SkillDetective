import React from 'react';
import { SkillData } from '../types';

interface SkillBarProps {
  skill: SkillData;
  onClick?: () => void;
  showDelta?: boolean;
}

export const SkillBar: React.FC<SkillBarProps> = ({ skill, onClick, showDelta = true }) => {
  const delta = skill.score - skill.initialScore;

  // Restrained colors as instructed in guidelines
  const getStatusConfig = (score: number) => {
    if (score >= 80) {
      return {
        label: 'Strong',
        badgeClass: 'badge-success',
        barColor: 'var(--color-success)',
        textColor: 'var(--color-success)'
      };
    }
    if (score >= 65) {
      return {
        label: 'Developing',
        badgeClass: 'badge-neutral',
        barColor: 'var(--accent-indigo)',
        textColor: 'var(--accent-indigo)'
      };
    }
    return {
      label: 'Needs Practice',
      badgeClass: 'badge-warning',
      barColor: 'var(--color-warning)',
      textColor: 'var(--color-warning)'
    };
  };

  const status = getStatusConfig(skill.score);

  return (
    <div 
      className={`skill-bar-row ${onClick ? 'interactive-row' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="skill-bar-info">
        <div className="skill-meta-left">
          <span className="skill-name">{skill.name}</span>
          <span className={`badge ${status.badgeClass}`}>{status.label}</span>
        </div>
        <div className="skill-meta-right">
          {showDelta && delta > 0 && (
            <span className="skill-delta text-xs text-success">+{delta} pts</span>
          )}
          <span className="skill-score font-mono font-bold">{skill.score}</span>
          <span className="skill-max text-xs text-muted">/100</span>
        </div>
      </div>

      <div className="progress-bar-track" aria-hidden="true">
        <div 
          className="progress-bar-fill"
          style={{ 
            width: `${skill.score}%`,
            backgroundColor: status.barColor 
          }}
        />
      </div>

      <style>{`
        .skill-bar-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 8px 0;
          transition: background-color var(--transition-fast);
        }

        .interactive-row {
          cursor: pointer;
          border-radius: var(--radius-sm);
          padding: 8px 10px;
        }

        .interactive-row:hover {
          background-color: var(--bg-subtle);
        }

        .skill-bar-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .skill-meta-left {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .skill-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .skill-meta-right {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .skill-delta {
          margin-right: 4px;
          font-weight: 600;
        }

        .skill-score {
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .skill-max {
          font-size: 0.72rem;
        }
      `}</style>
    </div>
  );
};
