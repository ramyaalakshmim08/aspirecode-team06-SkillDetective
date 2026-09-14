import React, { useState } from 'react';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Cpu, 
  Target, 
  X,
  Compass
} from 'lucide-react';
import { StudentProfile } from '../types';
import { soundFx } from '../services/audioService';

interface OnboardingModalProps {
  isOpen: boolean;
  profile?: StudentProfile;
  onClose: () => void;
  onComplete: (updatedProfile: Partial<StudentProfile>) => void;
  onLaunchFirstChallenge: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  profile,
  onClose,
  onComplete,
  onLaunchFirstChallenge
}) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(profile?.name || '');
  const [department, setDepartment] = useState(profile?.department && profile.department !== 'Undeclared' ? profile.department : '');
  const [year, setYear] = useState(profile?.year || '1st Year');
  
  const interestOptions = [
    'Technology',
    'Design',
    'Business',
    'Data',
    'Cybersecurity',
    'Communication',
    'Creative Work'
  ];
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    profile?.interests && profile.interests.length > 0 ? profile.interests : []
  );

  const skillOptions = [
    'Python',
    'JavaScript',
    'React',
    'SQL',
    'Excel',
    'Figma',
    'Communication',
    'Public Speaking',
    'Data Analysis',
    'Problem Solving'
  ];
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    profile?.existingSkills && profile.existingSkills.length > 0 ? profile.existingSkills : []
  );

  if (!isOpen) return null;

  const toggleInterest = (item: string) => {
    soundFx.playClick();
    if (selectedInterests.includes(item)) {
      setSelectedInterests(selectedInterests.filter(i => i !== item));
    } else {
      setSelectedInterests([...selectedInterests, item]);
    }
  };

  const toggleSkill = (skill: string) => {
    soundFx.playClick();
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleNext = () => {
    soundFx.playClick();
    if (step < 4) {
      setStep(step + 1);
    } else {
      soundFx.playLevelUp();
      onComplete({
        name,
        department,
        year,
        interests: selectedInterests,
        existingSkills: selectedSkills
      });
      onClose();
      onLaunchFirstChallenge();
    }
  };

  const handleBack = () => {
    soundFx.playClick();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="onboarding-card">
        {/* Header with Steps */}
        <div className="onboarding-header">
          <div className="onboarding-step-indicator">
            <span className="step-tag">STEP {step} OF 4</span>
            <div className="step-dots">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`step-dot ${s === step ? 'active-dot' : s < step ? 'completed-dot' : ''}`} />
              ))}
            </div>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close onboarding">
            <X size={18} />
          </button>
        </div>

        {/* Screen 1: Welcome */}
        {step === 1 && (
          <div className="onboarding-body">
            <div className="onboarding-hero-icon">
              <Compass size={28} />
            </div>
            <h2 className="onboarding-title">Welcome to Skill Detective</h2>
            <p className="onboarding-subtitle">
              Let's understand how you think, create, solve, and communicate. We convert short interactive challenges into your verified skill blueprint and career trajectory.
            </p>

            <div className="welcome-points">
              <div className="point-item">
                <Target size={16} className="point-icon text-accent" />
                <div>
                  <strong>Action-Based Assessment</strong>
                  <p className="text-xs text-muted">No multiple-choice personality guessing. Real problem-solving data.</p>
                </div>
              </div>
              <div className="point-item">
                <Cpu size={16} className="point-icon text-accent" />
                <div>
                  <strong>Transparent Calibration</strong>
                  <p className="text-xs text-muted">Clear breakdown of what is measured across 8 essential dimensions.</p>
                </div>
              </div>
              <div className="point-item">
                <BookOpen size={16} className="point-icon text-accent" />
                <div>
                  <strong>Personalized Direction</strong>
                  <p className="text-xs text-muted">Actionable career compatibility reports and weekly improvement roadmaps.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Screen 2: Student Information */}
        {step === 2 && (
          <div className="onboarding-body">
            <h2 className="onboarding-title">Tell Us About Yourself</h2>
            <p className="onboarding-subtitle">
              Help us tailor diagnostic benchmarks to your current academic stage.
            </p>

            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Saif"
                />
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label className="form-label">Department / Major</label>
                  <input
                    type="text"
                    className="form-input"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Engineering"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Academic Year</label>
                  <select
                    className="form-select"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year / Senior</option>
                    <option>Postgraduate</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Primary Interests (Select all that apply)</label>
                <div className="chips-container">
                  {interestOptions.map((item) => {
                    const isSelected = selectedInterests.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleInterest(item)}
                        className={`chip-btn ${isSelected ? 'chip-btn-selected' : ''}`}
                      >
                        {isSelected && <Check size={13} />}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Screen 3: Existing Skills */}
        {step === 3 && (
          <div className="onboarding-body">
            <h2 className="onboarding-title">What do you already know?</h2>
            <p className="onboarding-subtitle">
              Select existing proficiencies so our assessment calibrates baseline difficulty appropriately.
            </p>

            <div className="chips-container" style={{ marginTop: 'var(--space-3)' }}>
              {skillOptions.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`chip-btn ${isSelected ? 'chip-btn-selected' : ''}`}
                  >
                    {isSelected && <Check size={13} />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>

            <div className="notice-box" style={{ marginTop: 'var(--space-4)' }}>
              <Sparkles size={16} className="text-accent flex-shrink-0" />
              <p className="text-xs">
                Don't worry if you haven't mastered everything yet. Skill Detective discovers latent aptitudes through problem-solving rather than rote memorization.
              </p>
            </div>
          </div>
        )}

        {/* Screen 4: Assessment Introduction */}
        {step === 4 && (
          <div className="onboarding-body">
            <h2 className="onboarding-title">Assessment Blueprint</h2>
            <p className="onboarding-subtitle">
              You are ready to begin your diagnostic investigation. Here is what will be calibrated:
            </p>

            <div className="assessment-meta-strip">
              <div className="meta-pill">
                <Target size={14} />
                <span>8 Skill Areas</span>
              </div>
              <div className="meta-pill">
                <Clock size={14} />
                <span>~15–20 min</span>
              </div>
              <div className="meta-pill">
                <Sparkles size={14} />
                <span>Mini Challenges</span>
              </div>
            </div>

            <div className="skill-areas-grid">
              {[
                { name: 'Logical Thinking', desc: 'Pattern detection & deduction' },
                { name: 'Problem Solving', desc: 'Modular decomposition & approach' },
                { name: 'Coding', desc: 'Logic, syntax & duplicate edge cases' },
                { name: 'Communication', desc: 'Clarity, conciseness & analogies' },
                { name: 'Creativity', desc: 'Lateral alternatives & flow design' },
                { name: 'Data Analysis', desc: 'Growth inflection & variance reading' },
                { name: 'Decision Making', desc: 'Containment under system pressure' },
                { name: 'Attention to Detail', desc: 'Spotting critical security bugs' },
              ].map((sa) => (
                <div key={sa.name} className="skill-area-card">
                  <div className="skill-area-name">{sa.name}</div>
                  <div className="skill-area-desc">{sa.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="onboarding-footer">
          {step > 1 ? (
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleBack}>
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button type="button" className="btn btn-primary" onClick={handleNext}>
            <span>{step === 4 ? 'Begin Assessment' : step === 1 ? 'Start Assessment' : 'Continue'}</span>
            <ArrowRight size={14} />
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

        .onboarding-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 600px;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          overflow: hidden;
        }

        .onboarding-header {
          padding: var(--space-3) var(--space-5);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .onboarding-step-indicator {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .step-tag {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        .step-dots {
          display: flex;
          gap: 4px;
        }

        .step-dot {
          width: 18px;
          height: 4px;
          border-radius: 2px;
          background-color: var(--bg-muted);
          transition: background-color var(--transition-normal);
        }

        .step-dot.active-dot {
          background-color: var(--accent-indigo);
          width: 26px;
        }

        .step-dot.completed-dot {
          background-color: var(--color-success);
        }

        .close-btn {
          color: var(--text-muted);
          padding: 4px;
          border-radius: var(--radius-sm);
        }

        .close-btn:hover {
          background-color: var(--bg-subtle);
          color: var(--text-primary);
        }

        .onboarding-body {
          padding: var(--space-5);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          overscroll-behavior-y: contain;
          flex: 1;
        }

        .onboarding-hero-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background-color: var(--primary-light);
          color: var(--primary-800);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-3);
        }

        .onboarding-title {
          font-size: 1.35rem;
          margin-bottom: 2px;
        }

        .onboarding-subtitle {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-4);
          line-height: 1.45;
        }

        .welcome-points {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          background-color: var(--bg-subtle);
          padding: var(--space-3);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
        }

        .point-item {
          display: flex;
          gap: var(--space-2);
          align-items: flex-start;
        }

        .point-icon {
          margin-top: 2px;
          flex-shrink: 0;
        }

        .form-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-3);
        }

        .form-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .form-input, .form-select {
          padding: 8px 10px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background-color: var(--bg-surface);
          font-size: 0.85rem;
          transition: border-color var(--transition-fast);
        }

        .form-input:focus, .form-select:focus {
          border-color: var(--accent-indigo);
          outline: none;
        }

        .chips-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .chip-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background-color: var(--bg-surface);
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .chip-btn:hover {
          border-color: var(--border-strong);
          background-color: var(--bg-subtle);
        }

        .chip-btn-selected {
          background-color: var(--primary-800);
          color: #FFFFFF;
          border-color: var(--primary-800);
          font-weight: 600;
        }

        .chip-btn-selected:hover {
          background-color: var(--primary-700);
        }

        .notice-box {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          padding: var(--space-3);
          background-color: var(--accent-indigo-subtle);
          border: 1px solid #C7D2FE;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
        }

        .assessment-meta-strip {
          display: flex;
          gap: 6px;
          margin-bottom: var(--space-3);
          flex-wrap: wrap;
        }

        .meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .skill-areas-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .skill-area-card {
          padding: 8px 10px;
          background-color: var(--bg-subtle);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .skill-area-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .skill-area-desc {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .onboarding-footer {
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
          .onboarding-card {
            max-height: 100vh;
            height: 100vh;
            border-radius: 0;
            border: none;
          }
          .form-row-2 {
            grid-template-columns: 1fr;
          }
          .skill-areas-grid {
            grid-template-columns: 1fr;
          }
          .onboarding-body {
            padding: var(--space-4);
          }
        }

        @media (max-width: 480px) {
          .onboarding-footer {
            flex-direction: column-reverse;
            gap: 8px;
            padding: var(--space-3);
          }
          .onboarding-footer button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
