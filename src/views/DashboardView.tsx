import React, { useState } from 'react';
import { 
  ArrowRight, 
  Play, 
  BarChart2, 
  AlertCircle, 
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { SkillData, StudentProfile, InteractiveChallenge, CareerMatch, NavigationTab } from '../types';
import { SkillBar } from '../components/SkillBar';
import { RadarChart } from '../components/RadarChart';
import { soundFx } from '../services/audioService';

interface DashboardViewProps {
  profile: StudentProfile;
  skills: SkillData[];
  continueChallenge: InteractiveChallenge;
  topCareers: CareerMatch[];
  onStartChallenge: (challenge: InteractiveChallenge) => void;
  onNavigate: (tab: NavigationTab) => void;
  onSelectCareer: (career: CareerMatch) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  skills,
  continueChallenge,
  topCareers,
  onStartChallenge,
  onNavigate,
  onSelectCareer
}) => {
  const [snapshotMode, setSnapshotMode] = useState<'bars' | 'radar'>('bars');

  const strongestSkill = [...skills].sort((a, b) => b.score - a.score)[0];
  const weakestSkill = [...skills].sort((a, b) => a.score - b.score)[0];

  const handleContinueClick = () => {
    soundFx.playClick();
    onStartChallenge(continueChallenge);
  };

  return (
    <div className="dashboard-page">
      {/* 1. Header Greeting & Status Overview */}
      <section className="dashboard-welcome-strip">
        <div className="welcome-text-col">
          <h2 className="welcome-heading">Good morning, {profile.name}</h2>
          <p className="welcome-sub">Ready to discover what you're capable of today?</p>
        </div>

        <div className="welcome-stats-strip">
          <div className="summary-stat-item">
            <span className="stat-label">STATUS</span>
            <strong className="stat-val font-bold">Level {profile.level}</strong>
          </div>
          <div className="stat-divider hide-on-xs" />
          <div className="summary-stat-item">
            <span className="stat-label">EXP</span>
            <strong className="stat-val font-mono text-accent">{profile.xp.toLocaleString()} XP</strong>
          </div>
          <div className="stat-divider hide-on-xs" />
          <div className="summary-stat-item">
            <span className="stat-label">STREAK</span>
            <strong className="stat-val text-streak">🔥 {profile.streakDays} days</strong>
          </div>
          <div className="stat-divider hide-on-xs" />
          <div className="summary-stat-item">
            <span className="stat-label">LIVES</span>
            <strong className="stat-val font-mono">{profile.lives}/{profile.maxLives}</strong>
          </div>
        </div>
      </section>

      {/* 2. CONTINUE CHALLENGE (Main Horizontal Module - NOT an ordinary card) */}
      <section className="continue-challenge-banner" aria-label="Continue Active Challenge">
        <div className="continue-left">
          <div className="continue-tag-row">
            <span className="continue-kicker">CONTINUE CHALLENGE</span>
            <span className="badge badge-indigo">{continueChallenge.categoryLabel}</span>
            <span className="badge badge-neutral">{continueChallenge.estimatedMinutes} min</span>
            <span className="badge badge-neutral">+{continueChallenge.xpReward} XP</span>
          </div>
          <h3 className="continue-title">{continueChallenge.title}</h3>
          <p className="continue-prompt">Can you identify the missing numerical progression and deduction pattern?</p>

          <div className="continue-progress-meta">
            <div className="inline-progress">
              <div className="progress-bar-track" style={{ width: '130px', height: '6px' }}>
                <div className="progress-bar-fill" style={{ width: '70%', backgroundColor: 'var(--accent-indigo)' }} />
              </div>
              <span className="text-xs text-muted font-mono">Progress: 7 / 10</span>
            </div>
          </div>
        </div>

        <div className="continue-right">
          <button 
            type="button" 
            className="btn btn-accent btn-lg continue-cta-btn"
            onClick={handleContinueClick}
          >
            <Play size={16} />
            <span>Continue Challenge</span>
          </button>
        </div>
      </section>

      {/* 3. Overall Skill Score & Personalized Opportunity Strip */}
      <div className="dashboard-grid-2">
        {/* Overall Skill Score Card */}
        <div className="card score-summary-card">
          <div className="card-header">
            <div>
              <span className="text-xs font-bold text-muted uppercase tracking-wider">YOUR OVERALL SKILL SCORE</span>
              <div className="score-big-row">
                <span className="score-number font-mono font-extrabold">{profile.overallScore}</span>
                <span className="score-max text-muted font-mono">/ 100</span>
                <span className="badge badge-success score-delta-badge">
                  +{profile.scoreDelta} pts
                </span>
              </div>
            </div>
          </div>

          <p className="score-interpret-text">
            You're currently performing <strong>above average</strong> across the 8 assessed competencies.
          </p>

          <div className="score-extremes-row">
            <div className="extreme-box extreme-strong">
              <span className="extreme-label">Strongest Competency</span>
              <strong className="extreme-name">{strongestSkill.name}</strong>
              <span className="font-mono text-sm font-bold text-success">{strongestSkill.score} / 100</span>
            </div>

            <div className="extreme-box extreme-opportunity">
              <span className="extreme-label">Target for Growth</span>
              <strong className="extreme-name">{weakestSkill.name}</strong>
              <span className="font-mono text-sm font-bold text-warning">{weakestSkill.score} / 100</span>
            </div>
          </div>

          <div className="card-footer-action">
            <button
              type="button"
              className="btn btn-ghost text-accent btn-sm"
              onClick={() => onNavigate('skills')}
            >
              <span>View Full Skill Profile</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Personalized Opportunity Banner */}
        <div className="card opportunity-card">
          <div className="opportunity-header">
            <AlertCircle size={18} className="text-warning" />
            <h4 className="opportunity-title">Personalized Skill Opportunity</h4>
          </div>
          <p className="opportunity-text">
            Your <strong>Coding score (58)</strong> is currently your highest-leverage growth area. Closing edge-case bugs will boost your Software Developer match from 87% to 94%.
          </p>

          <div className="opportunity-action-box">
            <div className="opp-meta">
              <span className="badge badge-warning">High Impact</span>
              <span className="text-xs text-muted font-mono">+120 XP</span>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('challenges')}
            >
              Practice Coding
            </button>
          </div>

          <div className="recent-streak-alert">
            <CheckCircle2 size={16} className="text-success flex-shrink-0" />
            <span className="text-xs">
              7-Day Streak Active: Your consistency accelerated your score by +8 points!
            </span>
          </div>
        </div>
      </div>

      {/* 4. YOUR SKILL SNAPSHOT (Horizontal Skill Bars with Radar toggle) */}
      <section className="snapshot-section">
        <div className="snapshot-header">
          <div>
            <h3 className="section-title">Your Skill Snapshot</h3>
            <p className="text-sm text-muted">A live calibration of your assessed cognitive and technical aptitudes.</p>
          </div>

          <div className="view-mode-toggle">
            <button
              type="button"
              className={`toggle-btn ${snapshotMode === 'bars' ? 'toggle-active' : ''}`}
              onClick={() => setSnapshotMode('bars')}
              title="Horizontal Score Bars"
            >
              <BarChart2 size={14} />
              <span>Skill Bars</span>
            </button>
            <button
              type="button"
              className={`toggle-btn ${snapshotMode === 'radar' ? 'toggle-active' : ''}`}
              onClick={() => setSnapshotMode('radar')}
              title="Radar Chart View"
            >
              <Sliders size={14} />
              <span>Radar View</span>
            </button>
          </div>
        </div>

        {snapshotMode === 'bars' ? (
          <div className="card snapshot-bars-card">
            <div className="skill-bars-grid">
              {skills.map((skill) => (
                <SkillBar
                  key={skill.id}
                  skill={skill}
                  onClick={() => onNavigate('skills')}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="card snapshot-radar-card">
            <div className="radar-layout">
              <RadarChart skills={skills} size={280} />
              <div className="radar-legend-list">
                {skills.map((s) => (
                  <div key={s.id} className="radar-legend-item">
                    <span className="legend-name text-xs">{s.name}</span>
                    <span className="font-mono font-bold text-xs">{s.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. Top Career Matches Preview */}
      <section className="career-preview-section">
        <div className="snapshot-header">
          <div>
            <h3 className="section-title">Top Career Matches</h3>
            <p className="text-sm text-muted">Roles showing the highest alignment with your verified competencies.</p>
          </div>

          <button
            type="button"
            className="btn btn-ghost text-accent"
            onClick={() => onNavigate('careers')}
          >
            <span>View All 8 Careers</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="careers-preview-grid">
          {topCareers.slice(0, 3).map((career) => (
            <div key={career.id} className="card career-preview-card card-hover">
              <div className="career-card-top">
                <span className="badge badge-indigo font-bold">{career.matchPercentage}% Match</span>
                <span className="text-xs text-muted font-mono">{career.salaryRange}</span>
              </div>
              <h4 className="career-card-title">{career.title}</h4>
              <p className="career-card-desc text-xs">{career.description}</p>

              <div className="career-card-reasons">
                <span className="text-xs font-bold text-muted">Why it aligns:</span>
                <ul className="reasons-bullets">
                  {career.whyItMatches.slice(0, 2).map((r, i) => (
                    <li key={i} className="text-xs text-secondary">• {r}</li>
                  ))}
                </ul>
              </div>

              <div className="career-card-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm full-width-mobile"
                  onClick={() => onSelectCareer(career)}
                >
                  Explore Career Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
          width: 100%;
        }

        .dashboard-welcome-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: var(--space-4);
          border-bottom: 1px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: var(--space-3);
        }

        .welcome-heading {
          font-size: 1.5rem;
          color: var(--primary-900);
        }

        .welcome-sub {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .welcome-stats-strip {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 8px var(--space-3);
          flex-wrap: wrap;
        }

        .summary-stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 4px;
        }

        .stat-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .stat-val {
          font-size: 0.9rem;
        }

        .stat-divider {
          width: 1px;
          height: 22px;
          background-color: var(--border-color);
        }

        .text-streak {
          color: #C2410C;
        }

        /* Continue Challenge Banner */
        .continue-challenge-banner {
          background-color: var(--primary-800);
          color: #FFFFFF;
          border-radius: var(--radius-xl);
          padding: var(--space-5);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          box-shadow: var(--shadow-sm);
        }

        .continue-left {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .continue-tag-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .continue-kicker {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--accent-amber);
        }

        .continue-title {
          font-size: 1.3rem;
          color: #FFFFFF;
        }

        .continue-prompt {
          font-size: 0.9rem;
          color: #CBD5E1;
        }

        .continue-progress-meta {
          margin-top: var(--space-1);
        }

        .inline-progress {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .continue-right {
          flex-shrink: 0;
        }

        /* Dashboard Grid 2 */
        .dashboard-grid-2 {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: var(--space-4);
        }

        .score-summary-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .score-big-row {
          display: flex;
          align-items: baseline;
          margin-top: 4px;
          flex-wrap: wrap;
          gap: 4px;
        }

        .score-number {
          font-size: 2.5rem;
          color: var(--primary-800);
          line-height: 1;
        }

        .score-max {
          font-size: 1.1rem;
        }

        .score-delta-badge {
          margin-left: 6px;
        }

        .score-interpret-text {
          font-size: 0.9rem;
          margin: var(--space-2) 0;
        }

        .score-extremes-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-2);
          margin-top: var(--space-2);
        }

        .extreme-box {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 8px 10px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          background-color: var(--bg-subtle);
        }

        .extreme-label {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .extreme-name {
          font-size: 0.85rem;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-footer-action {
          margin-top: var(--space-3);
          display: flex;
          justify-content: flex-end;
        }

        /* Opportunity Card */
        .opportunity-card {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .opportunity-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .opportunity-title {
          font-size: 1.0rem;
        }

        .opportunity-text {
          font-size: 0.88rem;
          line-height: 1.45;
        }

        .opportunity-action-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background-color: var(--bg-subtle);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          margin-top: 4px;
        }

        .opp-meta {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .recent-streak-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: auto;
          padding-top: var(--space-2);
          color: var(--text-secondary);
        }

        /* Snapshot Section */
        .snapshot-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .snapshot-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .section-title {
          font-size: 1.15rem;
          color: var(--primary-900);
        }

        .view-mode-toggle {
          display: flex;
          background-color: var(--bg-subtle);
          border-radius: var(--radius-md);
          padding: 2px;
          border: 1px solid var(--border-color);
        }

        .toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .toggle-active {
          background-color: var(--bg-surface);
          color: var(--primary-800);
          box-shadow: var(--shadow-xs);
        }

        .snapshot-bars-card {
          padding: var(--space-4) var(--space-5);
        }

        .skill-bars-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-2) var(--space-6);
        }

        .radar-layout {
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: var(--space-3);
          padding: var(--space-2);
        }

        .radar-legend-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 12px;
        }

        .radar-legend-item {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          padding: 4px 8px;
          background-color: var(--bg-subtle);
          border-radius: var(--radius-sm);
        }

        /* Careers Preview */
        .career-preview-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .careers-preview-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-3);
        }

        .career-preview-card {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .career-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .career-card-title {
          font-size: 1.05rem;
          margin-top: 2px;
        }

        .career-card-desc {
          color: var(--text-muted);
          line-height: 1.4;
          height: 36px;
          overflow: hidden;
        }

        .career-card-reasons {
          margin: var(--space-1) 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .reasons-bullets {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .career-card-actions {
          margin-top: auto;
          padding-top: var(--space-2);
        }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .dashboard-grid-2 {
            grid-template-columns: 1fr;
          }
          .skill-bars-grid {
            grid-template-columns: 1fr;
          }
          .careers-preview-grid {
            grid-template-columns: 1fr;
          }
          .continue-challenge-banner {
            flex-direction: column;
            align-items: stretch;
          }
          .continue-cta-btn {
            width: 100%;
          }
          .full-width-mobile {
            width: 100%;
          }
        }

        @media (max-width: 600px) {
          .score-extremes-row {
            grid-template-columns: 1fr;
          }
          .welcome-stats-strip {
            width: 100%;
            justify-content: space-between;
          }
          .hide-on-xs {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .welcome-stats-strip {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
            padding: 8px;
          }
          .summary-stat-item {
            align-items: flex-start;
            padding: 4px 6px;
            background-color: var(--bg-subtle);
            border-radius: var(--radius-sm);
          }
          .welcome-heading {
            font-size: 1.25rem;
          }
          .continue-title {
            font-size: 1.15rem;
          }
          .score-number {
            font-size: 2.1rem;
          }
          .snapshot-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .view-mode-toggle {
            width: 100%;
          }
          .toggle-btn {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
