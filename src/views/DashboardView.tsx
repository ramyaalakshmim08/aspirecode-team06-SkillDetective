import React, { useState } from 'react';
import { 
  ArrowRight, 
  Play, 
  BarChart2, 
  AlertCircle, 
  CheckCircle2,
  Sliders,
  Sparkles,
  Target,
  Clock,
  Zap
} from 'lucide-react';
import { SkillData, StudentProfile, InteractiveChallenge, CareerMatch, NavigationTab } from '../types';
import { SkillBar } from '../components/SkillBar';
import { RadarChart } from '../components/RadarChart';
import { soundFx } from '../services/audioService';
import { StorageAdapter } from '../services/storageAdapter';

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

  const assessedSkills = skills.filter((s) => s.score !== null);
  const unassessedSkills = skills.filter((s) => s.score === null);

  const strongestSkill = assessedSkills.length > 0 
    ? [...assessedSkills].sort((a, b) => (b.score || 0) - (a.score || 0))[0] 
    : null;

  const weakestSkill = assessedSkills.length > 0 
    ? [...assessedSkills].sort((a, b) => (a.score || 0) - (b.score || 0))[0] 
    : null;

  const recentActivity = StorageAdapter.getActivityLogs(profile.id).slice(0, 4);

  const handleContinueClick = () => {
    soundFx.playClick();
    onStartChallenge(continueChallenge);
  };

  // Dynamic daily missions
  const mission1 = unassessedSkills[0] 
    ? `Assess ${unassessedSkills[0].name} baseline`
    : `Drill ${weakestSkill?.name || 'Logic'} challenge`;
  const mission2 = 'Review updated career compatibility matches';

  return (
    <div className="dashboard-page">
      {/* 1. Header Greeting & Status Overview */}
      <section className="dashboard-welcome-strip">
        <div className="welcome-text-col">
          <h2 className="welcome-heading">Welcome back, {profile.name}</h2>
          <p className="welcome-sub">
            {assessedSkills.length === 0
              ? "Let's discover your authentic strengths through empirical problem-solving diagnostics."
              : `Your empirical diagnostic profile has ${assessedSkills.length} of 8 competencies calibrated.`}
          </p>
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

      {/* Zero Assessments Callout for Brand New Users */}
      {assessedSkills.length === 0 && (
        <section className="card p-6 border border-accent/40 bg-accent/5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} className="text-accent" />
              <h3 className="text-base font-bold text-foreground">Begin Your First Competency Assessment</h3>
            </div>
            <p className="text-xs text-muted max-w-xl">
              You haven't completed any challenges yet. Unlike subjective surveys, Skill Detective evaluates what you can do through active algorithmic code runs, logic deduction, and quantitative analysis.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm flex-shrink-0"
            onClick={handleContinueClick}
          >
            <Play size={14} />
            <span>Start Baseline Challenge</span>
          </button>
        </section>
      )}

      {/* 2. CONTINUE CHALLENGE (Main Horizontal Module) */}
      <section className="continue-challenge-banner" aria-label="Continue Active Challenge">
        <div className="continue-left">
          <div className="continue-tag-row">
            <span className="continue-kicker">RECOMMENDED ASSESSMENT</span>
            <span className="badge badge-indigo">{continueChallenge.categoryLabel}</span>
            <span className="badge badge-neutral">{continueChallenge.estimatedMinutes} min</span>
            <span className="badge badge-neutral">+{continueChallenge.xpReward} XP</span>
          </div>
          <h3 className="continue-title">{continueChallenge.title}</h3>
          <p className="continue-prompt">{continueChallenge.instructions || 'Empirical problem-solving evaluation.'}</p>

          <div className="continue-progress-meta">
            <div className="inline-progress">
              <span className="text-xs text-muted font-mono">
                Assessed: {assessedSkills.length} / 8 Competencies
              </span>
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
            <span>Launch Diagnostic</span>
          </button>
        </div>
      </section>

      {/* 3. Overall Skill Score & Personalized Opportunity Strip */}
      <div className="dashboard-grid-2">
        {/* Overall Skill Score Card */}
        <div className="card score-summary-card">
          <div className="card-header">
            <div>
              <span className="text-xs font-bold text-muted uppercase tracking-wider">OVERALL BASELINE SCORE</span>
              <div className="score-big-row">
                <span className="score-number font-mono font-extrabold">
                  {profile.overallScore !== null ? profile.overallScore : '--'}
                </span>
                <span className="score-max text-muted font-mono">/ 100</span>
                {profile.overallScore !== null && profile.scoreDelta !== 0 && (
                  <span className={`badge ${profile.scoreDelta > 0 ? 'badge-success' : 'badge-warning'} score-delta-badge font-mono`}>
                    {profile.scoreDelta > 0 ? `+${profile.scoreDelta}` : profile.scoreDelta} pts
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="score-interpret-text">
            {profile.overallScore !== null
              ? `Calibrated across ${assessedSkills.length} evaluated competencies.`
              : 'Complete your first diagnostic test to calibrate your empirical score.'}
          </p>

          <div className="score-extremes-row">
            <div className="extreme-box extreme-strong">
              <span className="extreme-label">Demonstrated Strength</span>
              <strong className="extreme-name">{strongestSkill?.name || 'Pending Data'}</strong>
              <span className="font-mono text-sm font-bold text-success">
                {strongestSkill ? `${strongestSkill.score} / 100` : '--'}
              </span>
            </div>

            <div className="extreme-box extreme-opportunity">
              <span className="extreme-label">High-Leverage Growth</span>
              <strong className="extreme-name">{weakestSkill?.name || 'Pending Data'}</strong>
              <span className="font-mono text-sm font-bold text-warning">
                {weakestSkill ? `${weakestSkill.score} / 100` : '--'}
              </span>
            </div>
          </div>

          <div className="card-footer-action">
            <button
              type="button"
              className="btn btn-ghost text-accent btn-sm"
              onClick={() => onNavigate('skills')}
            >
              <span>View Full Skill Breakdown</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Personalized Daily Mission Card */}
        <div className="card opportunity-card">
          <div className="opportunity-header">
            <Target size={18} className="text-accent" />
            <h4 className="opportunity-title">Personalized Daily Missions</h4>
          </div>

          <div className="space-y-2 mt-2">
            <div className="p-2.5 bg-surface-raised border border-subtle rounded-md flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className={assessedSkills.length > 0 ? 'text-success' : 'text-muted'} />
                <span className="font-medium text-foreground">{mission1}</span>
              </div>
              <span className="font-mono text-accent font-bold">+50 XP</span>
            </div>

            <div className="p-2.5 bg-surface-raised border border-subtle rounded-md flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className={topCareers[0]?.isSaved ? 'text-success' : 'text-muted'} />
                <span className="font-medium text-foreground">{mission2}</span>
              </div>
              <span className="font-mono text-accent font-bold">+25 XP</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-subtle flex justify-between items-center">
            <span className="text-xs text-muted">Streak Cadence: {profile.streakDays} days active</span>
            <button
              type="button"
              className="btn btn-secondary btn-xs"
              onClick={() => onNavigate('challenges')}
            >
              Explore Tests
            </button>
          </div>
        </div>
      </div>

      {/* 4. YOUR SKILL SNAPSHOT (Skill Bars with Radar toggle) */}
      <section className="snapshot-section">
        <div className="snapshot-header">
          <div>
            <h3 className="section-title">Cognitive & Technical Snapshot</h3>
            <p className="text-sm text-muted">A live calibration of your assessed aptitudes.</p>
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
                    <span className="font-mono font-bold text-xs">
                      {s.score !== null ? s.score : '--'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. Top Career Compatibility Matches */}
      <section className="top-careers-section">
        <div className="section-heading-row">
          <div>
            <h3 className="section-title">Top Career Matches</h3>
            <p className="text-sm text-muted">
              {assessedSkills.length === 0
                ? 'Complete assessments to unlock empirical career matches.'
                : 'Algorithmic alignment based on your verified performance data.'}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('careers')}
          >
            <span>View All Careers</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="top-careers-grid">
          {topCareers.slice(0, 3).map((career) => (
            <div 
              key={career.id} 
              className="card career-match-card interactive-card"
              onClick={() => onSelectCareer(career)}
            >
              <div className="career-match-top">
                <span className="career-title font-bold">{career.title}</span>
                <span className="badge badge-accent font-mono font-bold">
                  {career.matchPercentage > 0 ? `${career.matchPercentage}% Match` : 'Uncalibrated'}
                </span>
              </div>
              <p className="career-desc text-xs text-muted">{career.description}</p>
              
              <div className="career-card-footer">
                <span className="text-xs text-muted font-mono">{career.salaryRange}</span>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs text-accent"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCareer(career);
                  }}
                >
                  Inspect Roadmap →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Recent Activity Timeline */}
      {recentActivity.length > 0 && (
        <section className="card p-5 mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-muted" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted">Recent Verified Activity</h4>
          </div>
          <div className="space-y-2">
            {recentActivity.map((log) => (
              <div key={log.id} className="flex justify-between items-center text-xs py-1.5 border-b border-subtle last:border-none">
                <div className="flex items-center gap-2 text-foreground">
                  <CheckCircle2 size={13} className="text-success flex-shrink-0" />
                  <span>{log.eventDescription}</span>
                </div>
                <span className="text-muted font-mono flex-shrink-0">
                  {new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
