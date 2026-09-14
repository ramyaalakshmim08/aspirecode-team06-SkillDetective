import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Play, 
  ShieldCheck,
  Award
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
      case 'unassessed':
      default:
        return <span className="badge badge-neutral">Not Assessed</span>;
    }
  };

  return (
    <div className="skill-profile-page">
      {/* Page Header */}
      <div className="profile-header-strip">
        <div>
          <h2 className="page-heading">Your Skill Profile & Calibration</h2>
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

      {/* Measurement Methodology Trust Banner */}
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
          const delta = skill.score !== null && skill.initialScore !== null 
            ? skill.score - skill.initialScore 
            : 0;

          return (
            <div key={skill.id} className="skill-detail-card card">
              {/* Card Header */}
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
                    {skill.confidence && skill.confidence !== 'none' && (
                      <span className="badge badge-secondary text-[10px] uppercase font-mono">
                        {skill.confidence} Confidence
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted">
                    {skill.completedChallenges} verified {skill.completedChallenges === 1 ? 'attempt' : 'attempts'}
                  </span>
                </div>

                <div className="skill-header-right">
                  <div className="score-badge-box">
                    <span className="score-val font-mono font-bold">
                      {skill.score !== null ? skill.score : '--'}
                    </span>
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
                      width: skill.score !== null ? `${skill.score}%` : '0%',
                      backgroundColor: skill.score !== null && skill.score >= 80 
                        ? 'var(--color-success)' 
                        : skill.score !== null && skill.score >= 65 
                        ? 'var(--accent-indigo)' 
                        : 'var(--color-warning)'
                    }}
                  />
                </div>
              </div>

              {/* Collapsible Details */}
              {isExpanded && (
                <div className="skill-drawer-content">
                  <div className="drawer-grid">
                    {/* Demonstrated Strength */}
                    <div className="drawer-col col-strength">
                      <div className="col-heading-row">
                        <CheckCircle2 size={16} className="text-success" />
                        <h4 className="drawer-col-title">Diagnostic Findings</h4>
                      </div>
                      <p className="drawer-col-body">{skill.strength}</p>
                    </div>

                    {/* Practice Area */}
                    <div className="drawer-col col-practice">
                      <div className="col-heading-row">
                        <Award size={16} className="text-accent" />
                        <h4 className="drawer-col-title">Practice Recommendation</h4>
                      </div>
                      <p className="drawer-col-body">{skill.practice}</p>
                    </div>
                  </div>

                  {/* Rubric Criteria */}
                  <div className="rubric-measured-box">
                    <span className="text-[11px] font-bold text-muted uppercase tracking-wider block mb-2">
                      Empirical Dimensions Evaluated:
                    </span>
                    <div className="rubric-pills-row">
                      {skill.whatIsMeasured.map((dim) => (
                        <span key={dim} className="badge badge-secondary text-xs">{dim}</span>
                      ))}
                    </div>
                  </div>

                  {/* Practice CTA */}
                  <div className="drawer-cta-row">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => onNavigate('challenges')}
                    >
                      <Play size={14} />
                      <span>Launch {skill.name} Challenge</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
