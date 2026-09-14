import React from 'react';
import { SkillData } from '../types';

interface SkillBarProps {
  skill: SkillData;
  onClick?: () => void;
  showDelta?: boolean;
}

export const SkillBar: React.FC<SkillBarProps> = ({ skill, onClick, showDelta = true }) => {
  // If unassessed, render unassessed baseline state
  if (skill.score === null) {
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
            <span className="badge badge-neutral text-xs">Not Assessed</span>
          </div>
          <div className="skill-meta-right">
            <span className="text-xs text-muted font-mono">0 Challenges</span>
          </div>
        </div>

        <div className="skill-bar-track">
          <div className="skill-bar-fill" style={{ width: '0%', backgroundColor: 'var(--border-color)' }} />
        </div>
      </div>
    );
  }

  const delta = skill.initialScore !== null ? skill.score - skill.initialScore : 0;

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
          {skill.confidence && skill.confidence !== 'none' && (
            <span className="text-[10px] text-muted font-mono uppercase">
              {skill.confidence} Conf
            </span>
          )}
        </div>
        <div className="skill-meta-right">
          {showDelta && delta > 0 && (
            <span className="skill-delta text-xs text-success font-mono">+{delta} pts</span>
          )}
          <span className="skill-score font-mono font-bold">{skill.score}</span>
          <span className="skill-max text-xs text-muted">/100</span>
        </div>
      </div>

      <div className="skill-bar-track">
        <div 
          className="skill-bar-fill"
          style={{ 
            width: `${Math.min(100, Math.max(5, skill.score))}%`,
            backgroundColor: status.barColor 
          }}
        />
      </div>
    </div>
  );
};
