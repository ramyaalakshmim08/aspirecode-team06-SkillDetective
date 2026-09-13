import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Play, 
  ShieldCheck
} from 'lucide-react';
import { SkillData, NavigationTab } from '../types';
import { soundFx } from '../services/audioService';

interface SkillProfileViewProps {
  skills: SkillData[];
  onNavigate: (tab: NavigationTab) => void;
}

export const SkillProfileView: React.FC<SkillProfileViewProps> = ({
  skills,
  onNavigate
}) => {
  // Keep first 2 expanded by default
  const [expandedSkillIds, setExpandedSkillIds] = useState<string[]>([
    'attention-to-detail',
    'logical'
  ]);

  const toggleExpand = (skillId: string) => {
    soundFx.playClick();
    if (expandedSkillIds.includes(skillId)) {
      setExpandedSkillIds(expandedSkillIds.filter(id => id !== skillId));
    } else {
      setExpandedSkillIds([...expandedSkillIds, skillId]);
    }
  };

  const expandAll = () => {
    soundFx.playClick();
    if (expandedSkillIds.length === skills.length) {
      setExpandedSkillIds([]);
    } else {
      setExpandedSkillIds(skills.map(s => s.id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'strong':
        return <span className="badge badge-success">Strong</span>;
      case 'developing':
        return <span className="badge badge-indigo">Developing</span>;
      case 'needs-practice':
        return <span className="badge badge-warning">Needs Practice</span>;
      default:
        return null;
    }
  };

  return (
    <div className="skill-profile-page">
      {/* Page Header */}
      <div className="profile-header-strip">
        <div>
          <h2 className="page-heading">Your Skill Profile</h2>
          <p className="page-subtitle">
            Your verified results reveal how you approach patterns, algorithmic trade-offs, analytical data, and verbal communication.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={expandAll}
        >
          {expandedSkillIds.length === skills.length ? 'Collapse All' : 'Expand All Insights'}
        </button>
      </div>

      {/* Measurement Methodology Trust Banner (Section 35) */}
      <div className="transparency-note-box">
        <ShieldCheck size={20} className="text-accent flex-shrink-0" />
        <div className="note-content">
          <strong>Transparent Calibration Standards</strong>
          <p className="text-xs text-muted">
            Skill Detective scores represent empirical assessment estimates derived from challenge completion accuracy, deduction latency, and edge-case handling — never vague personality stereotypes.
          </p>
        </div>
      </div>

      {/* Expandable Skills List */}
      <div className="skills-expanded-list">
        {skills.map((skill) => {
          const isExpanded = expandedSkillIds.includes(skill.id);
          const delta = skill.score - skill.initialScore;

          return (
            <div key={skill.id} className="skill-detail-card card">
              {/* Card Header (Clickable toggle) */}
              <button
                type="button"
                className="skill-card-toggle-btn"
                onClick={() => toggleExpand(skill.id)}
                aria-expanded={isExpanded}
              >
                <div className="skill-header-main">
                  <div className="skill-title-group">
                    <h3 className="skill-title">{skill.name}</h3>
                    {getStatusBadge(skill.status)}
                  </div>
                  <span className="text-xs text-muted">Level {skill.level} Aptitude</span>
                </div>

                <div className="skill-header-right">
                  <div className="score-badge-box">
                    <span className="score-val font-mono font-bold">{skill.score}</span>
                    <span className="score-denom font-mono text-xs text-muted">/ 100</span>
                  </div>

                  {delta > 0 && (
                    <span className="delta-badge font-mono text-xs text-success">
                      +{delta} pts
                    </span>
                  )}

                  <div className="chevron-circle">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </button>

              {/* Progress track always visible */}
              <div className="skill-preview-bar">
                <div className="progress-bar-track">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${skill.score}%`,
                      backgroundColor: skill.score >= 80 ? 'var(--color-success)' : skill.score >= 65 ? 'var(--accent-indigo)' : 'var(--color-warning)'
                    }}
                  />
                </div>
              </div>

              {/* Expandable Detail Section */}
              {isExpanded && (
                <div className="skill-expanded-body">
                  <div className="expanded-grid">
                    {/* Left: Strength & Practice */}
                    <div className="insight-col">
                      <div className="insight-box insight-strength">
                        <span className="insight-label text-success">Demonstrated Strength</span>
                        <p className="insight-text text-sm">{skill.strength}</p>
                      </div>

                      <div className="insight-box insight-practice">
                        <span className="insight-label text-warning">Targeted Practice Recommendation</span>
                        <p className="insight-text text-sm">{skill.practice}</p>
                      </div>
                    </div>

                    {/* Right: Metrics Measured & Progress Meta */}
                    <div className="metrics-col">
                      <h4 className="metrics-heading">What is Being Measured</h4>
                      <ul className="metrics-bullets">
                        {skill.whatIsMeasured.map((m, idx) => (
                          <li key={idx} className="metric-item">
                            <CheckCircle2 size={14} className="text-accent metric-icon" />
                            <span className="text-xs text-secondary">{m}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="progress-meta-strip">
                        <div className="p-meta-item">
                          <span className="text-xs text-muted">Baseline: </span>
                          <strong className="font-mono text-xs">{skill.initialScore}</strong>
                        </div>
                        <div className="p-meta-item">
                          <span className="text-xs text-muted">Current: </span>
                          <strong className="font-mono text-xs text-success">{skill.score}</strong>
                        </div>
                        <div className="p-meta-item">
                          <span className="text-xs text-muted">Drills: </span>
                          <strong className="font-mono text-xs">{skill.completedChallenges}</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-secondary btn-sm drill-action-btn"
                        onClick={() => onNavigate('challenges')}
                      >
                        <Play size={13} />
                        <span>Practice {skill.name}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .skill-profile-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          width: 100%;
        }

        .profile-header-strip {
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

        .transparency-note-box {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          padding: var(--space-3);
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-left: 3px solid var(--accent-indigo);
          border-radius: var(--radius-md);
        }

        .note-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .skills-expanded-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .skill-detail-card {
          padding: 0;
          overflow: hidden;
        }

        .skill-card-toggle-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4);
          background-color: var(--bg-surface);
          border: none;
          text-align: left;
          cursor: pointer;
          transition: background-color var(--transition-fast);
          gap: var(--space-2);
        }

        .skill-card-toggle-btn:hover {
          background-color: var(--bg-subtle);
        }

        .skill-header-main {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .skill-title-group {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .skill-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .skill-header-right {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          flex-shrink: 0;
        }

        .score-badge-box {
          display: flex;
          align-items: baseline;
          gap: 2px;
        }

        .score-val {
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .delta-badge {
          background-color: var(--color-success-subtle);
          padding: 2px 5px;
          border-radius: var(--radius-xs);
          font-weight: 700;
        }

        .chevron-circle {
          color: var(--text-muted);
        }

        .skill-preview-bar {
          padding: 0 var(--space-4) var(--space-3) var(--space-4);
        }

        .skill-expanded-body {
          padding: var(--space-4);
          border-top: 1px solid var(--border-subtle);
          background-color: var(--bg-subtle);
        }

        .expanded-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: var(--space-3);
        }

        .insight-col {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .insight-box {
          padding: var(--space-3);
          border-radius: var(--radius-md);
          background-color: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .insight-label {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .insight-text {
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .metrics-col {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          background-color: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: var(--space-3);
        }

        .metrics-heading {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .metrics-bullets {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .metric-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .metric-icon {
          flex-shrink: 0;
        }

        .progress-meta-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 8px;
          background-color: var(--bg-subtle);
          border-radius: var(--radius-sm);
          flex-wrap: wrap;
          gap: 6px;
        }

        .drill-action-btn {
          margin-top: auto;
          width: 100%;
        }

        @media (max-width: 768px) {
          .expanded-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 500px) {
          .skill-card-toggle-btn {
            flex-direction: column;
            align-items: flex-start;
          }
          .skill-header-right {
            width: 100%;
            justify-content: space-between;
            border-top: 1px dashed var(--border-subtle);
            padding-top: 6px;
          }
        }
      `}</style>
    </div>
  );
};
