import React from 'react';
import { X, CheckCircle2, ArrowRight, TrendingUp, DollarSign } from 'lucide-react';
import { CareerMatch } from '../types';
import { soundFx } from '../services/audioService';

interface CareerDetailModalProps {
  career: CareerMatch | null;
  onClose: () => void;
  onStartLearningPath: (career: CareerMatch) => void;
}

export const CareerDetailModal: React.FC<CareerDetailModalProps> = ({
  career,
  onClose,
  onStartLearningPath
}) => {
  if (!career) return null;

  const handleStartPath = () => {
    soundFx.playClick();
    onStartLearningPath(career);
    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="career-modal-card">
        {/* Header */}
        <div className="career-modal-header">
          <div className="career-badge-group">
            <span className="badge badge-indigo font-bold">{career.matchPercentage}% Alignment</span>
            <span className="badge badge-neutral">{career.demandGrowth}</span>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="career-modal-body">
          <h2 className="career-title">{career.title}</h2>
          <p className="career-desc">{career.description}</p>

          <div className="career-quick-meta">
            <div className="meta-box">
              <DollarSign size={16} className="text-muted" />
              <div>
                <span className="text-xs text-muted block">Market Salary</span>
                <strong className="text-sm">{career.salaryRange}</strong>
              </div>
            </div>
            <div className="meta-box">
              <TrendingUp size={16} className="text-success" />
              <div>
                <span className="text-xs text-muted block">Demand Growth</span>
                <strong className="text-success text-sm">{career.demandGrowth}</strong>
              </div>
            </div>
          </div>

          {/* Skill Compatibility Breakdown */}
          <div className="section-block">
            <h3 className="section-heading">Skill Compatibility Breakdown</h3>
            <div className="compatibility-bars">
              {career.compatibilityBreakdown.map((item) => (
                <div key={item.skill} className="comp-row">
                  <div className="comp-labels">
                    <span className="comp-name">{item.skill}</span>
                    <span className="comp-pct font-mono font-semibold">{item.percentage}%</span>
                  </div>
                  <div className="progress-bar-track" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar-fill" 
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: item.percentage >= 80 ? 'var(--color-success)' : item.percentage >= 70 ? 'var(--accent-indigo)' : 'var(--color-warning)'
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why this fits you */}
          <div className="section-block">
            <h3 className="section-heading">Why This Fits You</h3>
            <ul className="reasons-list">
              {career.whyThisFitsYou.map((reason, idx) => (
                <li key={idx} className="reason-item">
                  <CheckCircle2 size={15} className="reason-icon text-success flex-shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills to build */}
          <div className="section-block">
            <h3 className="section-heading">Target Skills to Build</h3>
            <div className="tags-flex">
              {career.skillsToBuild.map((skill) => (
                <span key={skill} className="skill-build-tag">
                  + {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Learning Path */}
          <div className="section-block">
            <div className="section-heading-row">
              <h3 className="section-heading">Recommended 4-Step Career Roadmap</h3>
              <span className="text-xs text-muted">~10–12 wks</span>
            </div>
            <div className="roadmap-steps">
              {career.learningPathSteps.map((step) => (
                <div key={step.step} className="roadmap-step-card">
                  <div className="step-number-circle">{step.step}</div>
                  <div className="step-info">
                    <div className="step-header">
                      <span className="step-title">{step.title}</span>
                      <span className="step-duration text-xs text-muted">{step.duration}</span>
                    </div>
                    <p className="step-desc text-xs">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="career-modal-footer">
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Back
          </button>
          <button type="button" className="btn btn-primary" onClick={handleStartPath}>
            <span>Start Learning Path</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-4);
          z-index: 100;
          box-sizing: border-box;
        }

        .career-modal-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 660px;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          overflow: hidden;
        }

        .career-modal-header {
          padding: var(--space-3) var(--space-5);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .career-badge-group {
          display: flex;
          gap: 6px;
        }

        .career-modal-body {
          padding: var(--space-5);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          overscroll-behavior-y: contain;
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .career-title {
          font-size: 1.4rem;
          margin-bottom: 2px;
        }

        .career-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .career-quick-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-3);
        }

        .meta-box {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
        }

        .section-block {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .section-heading-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .section-heading {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .compatibility-bars {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background-color: var(--bg-subtle);
          padding: var(--space-3);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .comp-row {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .comp-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
        }

        .comp-name {
          font-weight: 500;
          color: var(--text-secondary);
        }

        .reasons-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .reason-item {
          display: flex;
          gap: var(--space-2);
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .tags-flex {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .skill-build-tag {
          padding: 4px 8px;
          background-color: var(--accent-indigo-subtle);
          border: 1px solid #C7D2FE;
          color: var(--accent-indigo);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .roadmap-steps {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .roadmap-step-card {
          display: flex;
          gap: var(--space-3);
          padding: 8px 10px;
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
        }

        .step-number-circle {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: var(--primary-800);
          color: #FFFFFF;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-info {
          flex: 1;
          min-width: 0;
        }

        .step-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2px;
          gap: 4px;
        }

        .step-title {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .step-desc {
          color: var(--text-muted);
          line-height: 1.35;
        }

        .career-modal-footer {
          padding: var(--space-3) var(--space-5);
          border-top: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--bg-surface);
        }

        @media (max-width: 600px) {
          .modal-backdrop {
            padding: 0;
          }
          .career-modal-card {
            max-height: 100vh;
            height: 100vh;
            border-radius: 0;
            border: none;
          }
          .career-quick-meta {
            grid-template-columns: 1fr;
          }
          .career-modal-body {
            padding: var(--space-4);
          }
        }

        @media (max-width: 480px) {
          .career-modal-footer {
            flex-direction: column-reverse;
            gap: 8px;
            padding: var(--space-3);
          }
          .career-modal-footer button {
            width: 100%;
            justify-content: center;
          }
          .career-badge-group {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};
