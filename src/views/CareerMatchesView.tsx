import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2
} from 'lucide-react';
import { CareerMatch } from '../types';
import { soundFx } from '../services/audioService';

interface CareerMatchesViewProps {
  careers: CareerMatch[];
  onSelectCareer: (career: CareerMatch) => void;
}

export const CareerMatchesView: React.FC<CareerMatchesViewProps> = ({
  careers,
  onSelectCareer
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'high-match' | 'technical'>('all');

  const filteredCareers = careers.filter((c) => {
    if (filterMode === 'high-match') return c.matchPercentage >= 85;
    if (filterMode === 'technical') return c.skillsRequired.includes('Coding') || c.skillsRequired.includes('Automated Testing');
    return true;
  });

  const handleOpenDetail = (career: CareerMatch) => {
    soundFx.playClick();
    onSelectCareer(career);
  };

  return (
    <div className="career-matches-page">
      {/* Header */}
      <div className="careers-header-strip">
        <div>
          <h2 className="page-heading">Career Matches</h2>
          <p className="page-subtitle">
            Explore roles that align with your verified skill profile. Derived from empirical challenge performance — no speculative forecasts.
          </p>
        </div>

        {/* Filter Chips with touch-scroll */}
        <div className="filter-chips-row">
          <button
            type="button"
            className={`filter-chip ${filterMode === 'all' ? 'chip-active' : ''}`}
            onClick={() => setFilterMode('all')}
          >
            All Roles (8)
          </button>
          <button
            type="button"
            className={`filter-chip ${filterMode === 'high-match' ? 'chip-active' : ''}`}
            onClick={() => setFilterMode('high-match')}
          >
            High Alignment (≥85%)
          </button>
          <button
            type="button"
            className={`filter-chip ${filterMode === 'technical' ? 'chip-active' : ''}`}
            onClick={() => setFilterMode('technical')}
          >
            Engineering & QA
          </button>
        </div>
      </div>

      {/* Career Cards Grid */}
      <div className="career-cards-grid">
        {filteredCareers.map((career) => (
          <div key={career.id} className="career-match-card card card-hover">
            {/* Top Bar with Match Pill */}
            <div className="cm-header">
              <div className="cm-title-block">
                <span className="badge badge-indigo font-bold text-sm">
                  {career.matchPercentage}% Alignment
                </span>
                <h3 className="cm-role-title">{career.title}</h3>
              </div>

              <div className="cm-meta-right">
                <span className="text-xs text-muted font-mono">{career.salaryRange}</span>
                <span className="text-xs text-success font-semibold">{career.demandGrowth}</span>
              </div>
            </div>

            <p className="cm-role-desc text-xs text-secondary">{career.description}</p>

            {/* Why it Matches (Transparent reasoning) */}
            <div className="cm-reasons-block">
              <span className="cm-block-label">Why it matches:</span>
              <ul className="cm-reasons-list">
                {career.whyItMatches.map((reason, idx) => (
                  <li key={idx} className="cm-reason-item">
                    <CheckCircle2 size={13} className="text-success flex-shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills Required & Skills to Improve */}
            <div className="cm-skills-dual-grid">
              <div className="cm-skill-col">
                <span className="cm-block-label">Core Skills Required:</span>
                <div className="cm-tags-wrap">
                  {career.skillsRequired.slice(0, 3).map((req) => (
                    <span key={req} className="badge badge-neutral text-xs">
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              <div className="cm-skill-col">
                <span className="cm-block-label text-warning">Opportunities to Build:</span>
                <div className="cm-tags-wrap">
                  {career.skillsToImprove.map((imp) => (
                    <span key={imp} className="badge badge-warning text-xs">
                      + {imp}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="cm-footer">
              <button
                type="button"
                className="btn btn-secondary btn-sm full-width-btn"
                onClick={() => handleOpenDetail(career)}
              >
                <span>Explore Career & Roadmap</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .career-matches-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          width: 100%;
        }

        .careers-header-strip {
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

        .filter-chips-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .filter-chip {
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

        .filter-chip:hover {
          background-color: var(--bg-subtle);
        }

        .chip-active {
          background-color: var(--primary-800);
          color: #FFFFFF;
          border-color: var(--primary-800);
          font-weight: 600;
        }

        .career-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
        }

        .career-match-card {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          padding: var(--space-4);
        }

        .cm-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .cm-title-block {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cm-role-title {
          font-size: 1.15rem;
          color: var(--primary-900);
        }

        .cm-meta-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .cm-role-desc {
          line-height: 1.45;
          min-height: 32px;
        }

        .cm-block-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 4px;
          display: block;
        }

        .cm-reasons-block {
          background-color: var(--bg-subtle);
          padding: var(--space-3);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .cm-reasons-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cm-reason-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        .cm-skills-dual-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-3);
          margin-top: auto;
          padding-top: var(--space-1);
        }

        .cm-tags-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .cm-footer {
          margin-top: var(--space-2);
          border-top: 1px solid var(--border-subtle);
          padding-top: var(--space-2);
        }

        .full-width-btn {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        @media (max-width: 850px) {
          .career-cards-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 500px) {
          .cm-skills-dual-grid {
            grid-template-columns: 1fr;
          }
          .cm-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .cm-meta-right {
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};
