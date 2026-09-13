import React from 'react';
import { 
  ArrowRight, 
  Target, 
  BarChart3, 
  Briefcase, 
  Compass, 
  CheckCircle2, 
  Flame, 
  Zap, 
  ShieldCheck, 
  Play,
  Layers,
  Code2,
  Users
} from 'lucide-react';
import { soundFx } from '../services/audioService';

interface LandingPageViewProps {
  onStartAssessment: () => void;
  onEnterDashboard: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onStartAssessment,
  onEnterDashboard
}) => {
  const handleStart = () => {
    soundFx.playClick();
    onStartAssessment();
  };

  const handleDashboard = () => {
    soundFx.playClick();
    onEnterDashboard();
  };

  return (
    <div className="landing-page-container">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge badge-indigo font-bold">ACADEMIC & CAREER DISCOVERY</span>
            <span className="text-xs text-muted">Aptitude Engine for Students</span>
          </div>

          <h1 className="hero-headline">
            Discover Your Skills.<br />
            Understand Your Strengths.<br />
            Find Your Direction.
          </h1>

          <p className="hero-subtext">
            Skill Detective transforms short interactive problem-solving challenges into an empirical skill profile and actionable career roadmap. No personality quizzes — real cognitive diagnostics.
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleStart}
            >
              <span>Start Your Assessment</span>
              <ArrowRight size={18} />
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={handleDashboard}
            >
              <span>Explore Interactive Demo</span>
            </button>
          </div>

          <div className="hero-social-proof">
            <div className="proof-item">
              <CheckCircle2 size={16} className="text-success" />
              <span className="text-xs text-muted">8 Verified Skill Dimensions</span>
            </div>
            <div className="proof-item">
              <CheckCircle2 size={16} className="text-success" />
              <span className="text-xs text-muted">Transparent Rubric Criteria</span>
            </div>
            <div className="proof-item">
              <CheckCircle2 size={16} className="text-success" />
              <span className="text-xs text-muted">Zero Speculative AI Guessing</span>
            </div>
          </div>
        </div>

        {/* Realistic Product UI Preview (Strictly NO 3D illustrations or cartoon blobs) */}
        <div className="hero-ui-preview">
          <div className="preview-browser-frame card">
            {/* Top Frame Bar */}
            <div className="frame-header">
              <div className="frame-dots">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
              <span className="frame-url font-mono">skilldetective.edu/student/saif</span>
              <div className="frame-stats">
                <span className="font-mono text-xs text-streak">🔥 7 days</span>
                <span className="font-mono text-xs text-accent">1,240 XP</span>
              </div>
            </div>

            {/* Inner Dashboard Simulation */}
            <div className="frame-content">
              {/* Mini Continue Challenge */}
              <div className="preview-challenge-strip">
                <div>
                  <span className="badge badge-indigo text-xs">Logic Challenge</span>
                  <h4 className="text-sm font-bold" style={{ marginTop: '2px' }}>Pattern Detective</h4>
                </div>
                <button type="button" className="btn btn-accent btn-sm" onClick={handleStart}>
                  <Play size={12} />
                  <span>Test Now</span>
                </button>
              </div>

              {/* Mini Skill Bars Snapshot */}
              <div className="preview-skills-grid">
                {[
                  { name: 'Attention to Detail', score: 91, color: 'var(--color-success)' },
                  { name: 'Logical Thinking', score: 86, color: 'var(--color-success)' },
                  { name: 'Problem Solving', score: 82, color: 'var(--color-success)' },
                  { name: 'Decision Making', score: 77, color: 'var(--accent-indigo)' },
                  { name: 'Data Analysis', score: 74, color: 'var(--accent-indigo)' },
                  { name: 'Coding', score: 58, color: 'var(--color-warning)' }
                ].map((s) => (
                  <div key={s.name} className="mini-skill-row">
                    <div className="mini-label-row">
                      <span className="text-xs font-semibold">{s.name}</span>
                      <span className="font-mono text-xs font-bold">{s.score}</span>
                    </div>
                    <div className="progress-bar-track" style={{ height: '5px' }}>
                      <div className="progress-bar-fill" style={{ width: `${s.score}%`, backgroundColor: s.color }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Mini Career Match Preview */}
              <div className="preview-career-match">
                <div className="pcm-left">
                  <span className="badge badge-success text-xs">88% Alignment</span>
                  <strong className="text-xs block" style={{ marginTop: '2px' }}>QA Engineer & Software Developer</strong>
                </div>
                <span className="text-xs text-muted font-mono">$85k–$130k</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How It Works */}
      <section className="landing-section">
        <div className="section-title-center">
          <span className="text-xs font-bold text-accent uppercase tracking-wider">METHODOLOGY</span>
          <h2 className="section-main-heading">How Skill Detective Works</h2>
          <p className="text-sm text-muted">A continuous discovery cycle connecting diagnostic testing to career outcomes.</p>
        </div>

        <div className="steps-grid-4">
          <div className="card step-card">
            <div className="step-badge-num">1</div>
            <Target size={22} className="step-card-icon text-accent" />
            <h3 className="step-card-title">Take Challenges</h3>
            <p className="step-card-desc text-xs text-muted">
              Solve short 2–5 minute mini-challenges in logic, real code debugging, structured analogies, and tabular data analysis.
            </p>
          </div>

          <div className="card step-card">
            <div className="step-badge-num">2</div>
            <BarChart3 size={22} className="step-card-icon text-accent" />
            <h3 className="step-card-title">Discover Skills</h3>
            <p className="step-card-desc text-xs text-muted">
              View your empirical score blueprint across 8 dimensions. Transparent rubrics explain exactly what was measured.
            </p>
          </div>

          <div className="card step-card">
            <div className="step-badge-num">3</div>
            <Briefcase size={22} className="step-card-icon text-accent" />
            <h3 className="step-card-title">Explore Careers</h3>
            <p className="step-card-desc text-xs text-muted">
              Compare your current profile against 8 modern tech and product roles with honest compatibility percentages.
            </p>
          </div>

          <div className="card step-card">
            <div className="step-badge-num">4</div>
            <Compass size={22} className="step-card-icon text-accent" />
            <h3 className="step-card-title">Build Your Path</h3>
            <p className="step-card-desc text-xs text-muted">
              Follow tailored 4-week step-by-step masterclasses targeting your highest-leverage growth opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: 8 Assessed Competencies */}
      <section className="landing-section">
        <div className="section-title-center">
          <span className="text-xs font-bold text-accent uppercase tracking-wider">COMPREHENSIVE TAXONOMY</span>
          <h2 className="section-main-heading">8 Assessed Competencies</h2>
          <p className="text-sm text-muted">Rigorous cognitive benchmarks grounded in university and industry demands.</p>
        </div>

        <div className="competencies-grid">
          {[
            { title: 'Logical Thinking', desc: 'Pattern deduction, mathematical progression, and inductive synthesis.' },
            { title: 'Problem Solving', desc: 'Modular bottleneck decomposition and algorithmic approach validity.' },
            { title: 'Coding & Debugging', desc: 'Syntactic accuracy, boundary handling, and duplicate edge conditions.' },
            { title: 'Communication', desc: 'Translating dense technical concepts into structured, jargon-free analogies.' },
            { title: 'Creativity', desc: 'Lateral problem reframing and streamlined user journey flow design.' },
            { title: 'Data Analysis', desc: 'Variance calculation, statistical reasoning, and growth inflection discovery.' },
            { title: 'Decision Making', desc: 'Pragmatic risk-benefit containment under server outage pressure.' },
            { title: 'Attention to Detail', desc: 'Uncovering subtle security bypasses and configuration inconsistencies.' }
          ].map((c) => (
            <div key={c.title} className="card comp-card">
              <h3 className="comp-title">{c.title}</h3>
              <p className="comp-desc text-xs text-muted">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="landing-cta-banner">
        <div className="cta-banner-content">
          <h2 className="cta-headline">Start discovering what you're good at.</h2>
          <p className="cta-sub">
            Join thousands of students diagnosing their strengths and unlocking verified career trajectories.
          </p>
          <div className="cta-btn-wrap">
            <button
              type="button"
              className="btn btn-accent btn-lg"
              onClick={handleStart}
            >
              <span>Begin Your Free Assessment</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .landing-page-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-12);
          padding-bottom: var(--space-12);
        }

        .landing-hero {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: var(--space-8);
          align-items: center;
          padding: var(--space-8) 0;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .hero-badge {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hero-headline {
          font-size: 2.5rem;
          color: var(--primary-900);
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .hero-subtext {
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.55;
          max-width: 540px;
        }

        .hero-cta-group {
          display: flex;
          gap: var(--space-3);
          flex-wrap: wrap;
          margin-top: var(--space-2);
        }

        .hero-social-proof {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: var(--space-3);
        }

        .proof-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Hero UI preview frame */
        .hero-ui-preview {
          display: flex;
          justify-content: center;
        }

        .preview-browser-frame {
          width: 100%;
          max-width: 480px;
          padding: 0;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          border-color: var(--border-strong);
        }

        .frame-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background-color: var(--bg-subtle);
          border-bottom: 1px solid var(--border-color);
        }

        .frame-dots {
          display: flex;
          gap: 4px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--bg-muted);
        }

        .frame-url {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .frame-stats {
          display: flex;
          gap: 8px;
        }

        .frame-content {
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          background-color: var(--bg-surface);
        }

        .preview-challenge-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background-color: var(--primary-light);
          border-radius: var(--radius-md);
        }

        .preview-skills-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 8px 0;
        }

        .mini-skill-row {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .mini-label-row {
          display: flex;
          justify-content: space-between;
        }

        .preview-career-match {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background-color: var(--bg-subtle);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        /* Section Layout */
        .landing-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .section-title-center {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .section-main-heading {
          font-size: 1.8rem;
          color: var(--primary-900);
        }

        .steps-grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-4);
        }

        .step-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          padding: var(--space-5);
        }

        .step-badge-num {
          position: absolute;
          top: 14px;
          right: 14px;
          font-family: var(--font-mono);
          font-weight: 800;
          font-size: 1.2rem;
          color: var(--bg-muted);
        }

        .step-card-title {
          font-size: 1.05rem;
          color: var(--primary-900);
        }

        .step-card-desc {
          line-height: 1.45;
        }

        .competencies-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-3);
        }

        .comp-card {
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .comp-title {
          font-size: 0.95rem;
          color: var(--primary-900);
        }

        .comp-desc {
          line-height: 1.4;
        }

        /* Final Banner */
        .landing-cta-banner {
          background-color: var(--primary-800);
          color: #FFFFFF;
          border-radius: var(--radius-xl);
          padding: var(--space-10) var(--space-6);
          text-align: center;
        }

        .cta-banner-content {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .cta-headline {
          font-size: 2rem;
          color: #FFFFFF;
        }

        .cta-sub {
          color: #CBD5E1;
          font-size: 1.0rem;
        }

        .cta-btn-wrap {
          margin-top: var(--space-3);
          display: flex;
          justify-content: center;
        }

        @media (max-width: 900px) {
          .landing-hero {
            grid-template-columns: 1fr;
          }
          .steps-grid-4 {
            grid-template-columns: repeat(2, 1fr);
          }
          .competencies-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .steps-grid-4 {
            grid-template-columns: 1fr;
          }
          .competencies-grid {
            grid-template-columns: 1fr;
          }
          .hero-headline {
            font-size: 1.8rem;
          }
          .hero-cta-group {
            flex-direction: column;
            width: 100%;
          }
          .hero-cta-group .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
