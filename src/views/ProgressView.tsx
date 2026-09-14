import React from 'react';
import { 
  TrendingUp, 
  Award, 
  Target, 
  Briefcase, 
  Flame,
  Calendar
} from 'lucide-react';
import { StudentProfile, SkillData } from '../types';
import { StorageAdapter } from '../services/storageAdapter';

interface ProgressViewProps {
  profile: StudentProfile;
  skills: SkillData[];
}

export const ProgressView: React.FC<ProgressViewProps> = ({ profile, skills }) => {
  const history = profile.assessmentHistory;
  const attempts = StorageAdapter.getChallengeAttempts(profile.id);
  const correctAttempts = attempts.filter((a) => a.isCorrect);
  const achievements = StorageAdapter.getUserAchievements(profile.id);
  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const activityLogs = StorageAdapter.getActivityLogs(profile.id);

  const chartWidth = 500;
  const chartHeight = 180;
  const padding = 40;

  const minScore = 40;
  const maxScore = 100;

  const getX = (idx: number) => {
    if (history.length <= 1) return chartWidth / 2;
    return padding + (idx * (chartWidth - padding * 2)) / (history.length - 1);
  };

  const getY = (score: number) => {
    return chartHeight - padding - ((score - minScore) / (maxScore - minScore)) * (chartHeight - padding * 2);
  };

  const points = history.length > 0
    ? history.map((h, i) => `${getX(i)},${getY(h.score)}`).join(' ')
    : '';

  const totalGrowth = history.length >= 2
    ? history[history.length - 1].score - history[0].score
    : 0;

  // Real 28-day activity heatmap based on activityLogs
  const today = new Date();
  const activityDates = new Set(
    activityLogs.map((log) => new Date(log.createdAt).toISOString().split('T')[0])
  );

  const heatmapDays = Array.from({ length: 28 }).map((_, i) => {
    const dayDate = new Date();
    dayDate.setDate(today.getDate() - (27 - i));
    const dateStr = dayDate.toISOString().split('T')[0];
    return {
      day: i + 1,
      date: dateStr,
      active: activityDates.has(dateStr)
    };
  });

  return (
    <div className="progress-page">
      {/* Header */}
      <div>
        <h2 className="page-heading">Progress Analytics & Longitudinal Trajectory</h2>
        <p className="page-subtitle">
          Longitudinal analytics tracking your diagnostic score improvements, assessment calibration, and consistency.
        </p>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="kpi-grid">
        <div className="card kpi-card">
          <div className="kpi-top">
            <span className="text-xs text-muted font-bold uppercase">OVERALL BASELINE</span>
            <TrendingUp size={16} className="text-accent" />
          </div>
          <div className="kpi-value-row">
            <span className="kpi-number font-mono">
              {profile.overallScore !== null ? `${profile.overallScore}%` : '--'}
            </span>
            {profile.overallScore !== null && profile.scoreDelta !== 0 && (
              <span className={`badge ${profile.scoreDelta > 0 ? 'badge-success' : 'badge-warning'} text-xs font-mono`}>
                {profile.scoreDelta > 0 ? `+${profile.scoreDelta}` : profile.scoreDelta} pts
              </span>
            )}
          </div>
          <span className="text-xs text-muted">
            {skills.filter((s) => s.score !== null).length} of 8 competencies assessed
          </span>
        </div>

        <div className="card kpi-card">
          <div className="kpi-top">
            <span className="text-xs text-muted font-bold uppercase">CHALLENGES SOLVED</span>
            <Target size={16} className="text-warning" />
          </div>
          <div className="kpi-value-row">
            <span className="kpi-number font-mono">{correctAttempts.length}</span>
            <span className="text-sm text-muted font-mono">completed</span>
          </div>
          <span className="text-xs text-muted">
            {attempts.length} total diagnostic attempts
          </span>
        </div>

        <div className="card kpi-card">
          <div className="kpi-top">
            <span className="text-xs text-muted font-bold uppercase">ACTIVITY STREAK</span>
            <Flame size={16} className="text-accent" />
          </div>
          <div className="kpi-value-row">
            <span className="kpi-number font-mono">{profile.streakDays}</span>
            <span className="text-sm text-muted font-mono">days</span>
          </div>
          <span className="text-xs text-muted">Consecutive daily practice cadence</span>
        </div>

        <div className="card kpi-card">
          <div className="kpi-top">
            <span className="text-xs text-muted font-bold uppercase">MILESTONE BADGES</span>
            <Award size={16} className="text-success" />
          </div>
          <div className="kpi-value-row">
            <span className="kpi-number font-mono">{unlockedAchievements.length}</span>
            <span className="text-sm text-muted font-mono">/ {achievements.length} earned</span>
          </div>
          <span className="text-xs text-muted">Verified empirical recognition</span>
        </div>
      </div>

      {/* Skill Progress Over Time Chart Card */}
      <div className="card chart-card mt-6">
        <div className="card-header">
          <div>
            <h3 className="section-title">Score Progression Over Time</h3>
            <p className="text-xs text-muted">
              {history.length > 0 
                ? `Empirical calibration across your ${history.length} formal diagnostic checkpoints.`
                : 'Complete evaluations to plot your historical progress curve.'}
            </p>
          </div>
          {history.length >= 2 && (
            <div className="chart-stat-badge font-mono text-xs">
              <span>Trajectory: </span>
              <strong className={totalGrowth >= 0 ? 'text-success' : 'text-warning'}>
                {totalGrowth >= 0 ? `+${totalGrowth}` : totalGrowth} pts growth
              </strong>
            </div>
          )}
        </div>

        {/* SVG Line Chart or Empty State */}
        {history.length < 2 ? (
          <div className="p-12 text-center text-muted text-xs border border-dashed border-subtle rounded-lg my-4">
            <TrendingUp size={28} className="mx-auto mb-2 text-muted" />
            <p className="font-medium text-foreground">Awaiting Additional Diagnostic Data</p>
            <p className="max-w-sm mx-auto mt-1">
              Your historical score progression line will appear here after completing at least 2 diagnostic assessments.
            </p>
          </div>
        ) : (
          <div className="chart-svg-container">
            <svg width="100%" height="180" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
              {[50, 60, 70, 80, 90, 100].map((val) => {
                const y = getY(val);
                return (
                  <g key={val}>
                    <line
                      x1={padding}
                      y1={y}
                      x2={chartWidth - padding}
                      y2={y}
                      stroke="var(--border-subtle)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding - 8}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="10"
                      fill="var(--text-muted)"
                      fontFamily="var(--font-mono)"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              <polyline
                fill="none"
                stroke="var(--accent-indigo)"
                strokeWidth="3"
                points={points}
              />

              {history.map((h, i) => {
                const x = getX(i);
                const y = getY(h.score);
                return (
                  <g key={h.assessmentNumber}>
                    <circle
                      cx={x}
                      cy={y}
                      r="5"
                      fill="var(--bg-surface)"
                      stroke="var(--accent-indigo)"
                      strokeWidth="3"
                    />
                    <text
                      x={x}
                      y={y - 10}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="bold"
                      fill="var(--text-primary)"
                      fontFamily="var(--font-mono)"
                    >
                      {h.score}
                    </text>
                    <text
                      x={x}
                      y={chartHeight - 12}
                      textAnchor="middle"
                      fontSize="10"
                      fill="var(--text-muted)"
                    >
                      {h.date}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>

      {/* Real 28-Day Habit Consistency Heatmap */}
      <div className="card mt-6 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={16} className="text-accent" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted">28-Day Practice Cadence Heatmap</h4>
        </div>
        <p className="text-xs text-muted mb-4">
          Visual record of daily practice sessions. Consistent daily drills build compound cognitive stamina.
        </p>

        <div className="grid grid-cols-7 sm:grid-cols-14 md:grid-cols-28 gap-1.5">
          {heatmapDays.map((d) => (
            <div
              key={d.day}
              className={`h-7 rounded flex items-center justify-center text-[10px] font-mono transition-colors ${
                d.active 
                  ? 'bg-emerald-600 text-white font-bold' 
                  : 'bg-surface-raised border border-subtle text-muted'
              }`}
              title={`${d.date}: ${d.active ? 'Practice session recorded' : 'No activity'}`}
            >
              {d.day}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2 text-xs text-muted mt-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-surface-raised border border-subtle inline-block" />
            <span>Idle</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" />
            <span>Active Session</span>
          </span>
        </div>
      </div>
    </div>
  );
};
