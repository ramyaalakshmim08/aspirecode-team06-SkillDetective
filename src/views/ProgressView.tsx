import React from 'react';
import { 
  TrendingUp, 
  Award, 
  Target, 
  Briefcase, 
  Flame
} from 'lucide-react';
import { StudentProfile, SkillData } from '../types';

interface ProgressViewProps {
  profile: StudentProfile;
  skills: SkillData[];
}

export const ProgressView: React.FC<ProgressViewProps> = ({ profile }) => {
  const history = profile.assessmentHistory;

  const chartWidth = 500;
  const chartHeight = 180;
  const padding = 40;

  const minScore = 50;
  const maxScore = 100;

  const getX = (idx: number) => padding + (idx * (chartWidth - padding * 2)) / (history.length - 1);
  const getY = (score: number) => chartHeight - padding - ((score - minScore) / (maxScore - minScore)) * (chartHeight - padding * 2);

  const points = history.map((h, i) => `${getX(i)},${getY(h.score)}`).join(' ');

  const heatmapDays = Array.from({ length: 28 }).map((_, i) => {
    const isActive = i >= 21 || (i % 3 !== 0 && i > 5);
    return { day: i + 1, active: isActive };
  });

  return (
    <div className="progress-page">
      {/* Header */}
      <div>
        <h2 className="page-heading">Skill Progress & Trajectory</h2>
        <p className="page-subtitle">
          Longitudinal analytics tracking your diagnostic score improvements, assessment calibration, and consistency.
        </p>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="kpi-grid">
        <div className="card kpi-card">
          <div className="kpi-top">
            <span className="text-xs text-muted font-bold uppercase">OVERALL PROGRESS</span>
            <TrendingUp size={16} className="text-accent" />
          </div>
          <div className="kpi-value-row">
            <span className="kpi-number font-mono">{profile.overallScore}%</span>
            <span className="badge badge-success text-xs font-mono">+{profile.scoreDelta} pts</span>
          </div>
          <span className="text-xs text-muted">Across 8 assessed competencies</span>
        </div>

        <div className="card kpi-card">
          <div className="kpi-top">
            <span className="text-xs text-muted font-bold uppercase">CHALLENGES SOLVED</span>
            <Target size={16} className="text-warning" />
          </div>
          <div className="kpi-value-row">
            <span className="kpi-number font-mono">34</span>
            <span className="text-sm text-muted font-mono">/ 50 total</span>
          </div>
          <span className="text-xs text-muted">68% curriculum completed</span>
        </div>

        <div className="card kpi-card">
          <div className="kpi-top">
            <span className="text-xs text-muted font-bold uppercase">CAREER MATCHES</span>
            <Briefcase size={16} className="text-accent" />
          </div>
          <div className="kpi-value-row">
            <span className="kpi-number font-mono">8</span>
            <span className="text-sm text-muted font-mono">roles</span>
          </div>
          <span className="text-xs text-muted">3 roles with ≥85% alignment</span>
        </div>

        <div className="card kpi-card">
          <div className="kpi-top">
            <span className="text-xs text-muted font-bold uppercase">MILESTONE BADGES</span>
            <Award size={16} className="text-success" />
          </div>
          <div className="kpi-value-row">
            <span className="kpi-number font-mono">4</span>
            <span className="text-sm text-muted font-mono">/ 9 earned</span>
          </div>
          <span className="text-xs text-muted">Next unlock: Logic Master (7/10)</span>
        </div>
      </div>

      {/* Skill Progress Over Time Chart Card */}
      <div className="card chart-card">
        <div className="card-header">
          <div>
            <h3 className="section-title">Score Progression Over Time</h3>
            <p className="text-xs text-muted">Empirical calibration across your 3 formal diagnostic checkpoints.</p>
          </div>
          <div className="chart-stat-badge font-mono text-xs">
            <span>Trajectory: </span>
            <strong className="text-success">+14 pts total growth</strong>
          </div>
        </div>

        {/* SVG Line Chart */}
        <div className="chart-svg-container">
          <svg width="100%" height="180" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
            {[60, 70, 80, 90].map((val) => {
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
                    y={y - 12}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="700"
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
                    {h.date.split(',')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Assessment Timeline Strip */}
        <div className="assessment-history-timeline">
          {history.map((h) => (
            <div key={h.assessmentNumber} className="timeline-item">
              <div className="timeline-num-circle font-mono font-bold">{h.assessmentNumber}</div>
              <div className="timeline-info">
                <span className="timeline-title">{h.label}</span>
                <span className="text-xs text-muted">{h.date}</span>
              </div>
              <span className="timeline-score font-mono font-bold text-accent">{h.score} / 100</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4-Week Activity Heatmap */}
      <div className="card streak-calendar-card">
        <div className="card-header">
          <div className="streak-header-title">
            <Flame size={18} className="text-streak" />
            <div>
              <h3 className="section-title">Daily Practice (Past 4 Weeks)</h3>
              <p className="text-xs text-muted">Daily challenges completed without breaking focus.</p>
            </div>
          </div>
          <span className="badge badge-indigo font-mono">Streak: 7 Days</span>
        </div>

        <div className="heatmap-grid">
          {heatmapDays.map((d) => (
            <div
              key={d.day}
              className={`heatmap-box ${d.active ? 'heatmap-active' : 'heatmap-inactive'}`}
              title={`Day ${d.day}: ${d.active ? 'Challenge Completed' : 'Rest Day'}`}
            >
              <span className="heatmap-day-num">{d.day}</span>
            </div>
          ))}
        </div>

        <div className="heatmap-legend">
          <div className="legend-entry">
            <span className="legend-swatch swatch-inactive" />
            <span className="text-xs text-muted">Rest Day</span>
          </div>
          <div className="legend-entry">
            <span className="legend-swatch swatch-active" />
            <span className="text-xs text-muted">Challenge Solved</span>
          </div>
        </div>
      </div>

      <style>{`
        .progress-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          width: 100%;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-3);
        }

        .kpi-card {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          padding: var(--space-4);
        }

        .kpi-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .kpi-value-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .kpi-number {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--primary-900);
          line-height: 1.1;
        }

        .chart-card {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          padding: var(--space-4);
        }

        .chart-svg-container {
          width: 100%;
          background-color: var(--bg-subtle);
          border-radius: var(--radius-md);
          padding: var(--space-3);
          border: 1px solid var(--border-subtle);
          overflow-x: auto;
        }

        .assessment-history-timeline {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-2);
        }

        .timeline-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3);
          background-color: var(--bg-subtle);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .timeline-num-circle {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: var(--primary-800);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          flex-shrink: 0;
        }

        .timeline-info {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }

        .timeline-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .timeline-score {
          font-size: 0.85rem;
          flex-shrink: 0;
        }

        /* Streak Calendar Heatmap */
        .streak-calendar-card {
          padding: var(--space-4);
        }

        .streak-header-title {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .text-streak {
          color: #EA580C;
        }

        .heatmap-grid {
          display: grid;
          grid-template-columns: repeat(14, 1fr);
          gap: 6px;
          margin: var(--space-3) 0;
        }

        .heatmap-box {
          aspect-ratio: 1;
          border-radius: var(--radius-xs);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-family: var(--font-mono);
          transition: transform var(--transition-fast);
        }

        .heatmap-box:hover {
          transform: scale(1.1);
        }

        .heatmap-inactive {
          background-color: var(--bg-subtle);
          color: var(--text-muted);
          border: 1px solid var(--border-subtle);
        }

        .heatmap-active {
          background-color: #EA580C;
          color: #FFFFFF;
          font-weight: 700;
        }

        .heatmap-legend {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-3);
        }

        .legend-entry {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .legend-swatch {
          width: 10px;
          height: 10px;
          border-radius: 2px;
        }

        .swatch-inactive {
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-color);
        }

        .swatch-active {
          background-color: #EA580C;
        }

        @media (max-width: 900px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .assessment-history-timeline {
            grid-template-columns: 1fr;
          }
          .heatmap-grid {
            grid-template-columns: repeat(7, 1fr);
          }
        }

        @media (max-width: 480px) {
          .kpi-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
