import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Clock, 
  BookOpen, 
  Target, 
  Play
} from 'lucide-react';
import { LearningPath, LearningLesson, NavigationTab } from '../types';
import { soundFx } from '../services/audioService';

interface LearningPathViewProps {
  learningPaths: LearningPath[];
  onNavigate: (tab: NavigationTab) => void;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({
  learningPaths,
  onNavigate
}) => {
  const [selectedPathId, setSelectedPathId] = useState(learningPaths[0].id);
  const [localPaths, setLocalPaths] = useState<LearningPath[]>(learningPaths);

  const activePath = localPaths.find(p => p.id === selectedPathId) || localPaths[0];

  const allLessons = activePath.weeks.flatMap(w => w.lessons);
  const completedLessons = allLessons.filter(l => l.completed);
  const progressPercent = Math.round((completedLessons.length / allLessons.length) * 100);

  const toggleLesson = (weekNum: number, lessonId: string) => {
    soundFx.playClick();
    setLocalPaths(prev => prev.map(p => {
      if (p.id !== activePath.id) return p;
      return {
        ...p,
        weeks: p.weeks.map(w => {
          if (w.week !== weekNum) return w;
          return {
            ...w,
            lessons: w.lessons.map(l => {
              if (l.id !== lessonId) return l;
              const willBeCompleted = !l.completed;
              if (willBeCompleted) soundFx.playSuccess();
              return { ...l, completed: willBeCompleted };
            })
          };
        })
      };
    }));
  };

  const getLessonIcon = (type: LearningLesson['type']) => {
    switch (type) {
      case 'Lesson':
        return <BookOpen size={13} className="text-accent" />;
      case 'Challenge':
        return <Target size={13} className="text-warning" />;
      case 'Practice':
        return <Play size={13} className="text-success" />;
    }
  };

  return (
    <div className="learning-path-page">
      {/* Header */}
      <div className="lp-header">
        <div>
          <h2 className="page-heading">Personalized Learning Paths</h2>
          <p className="page-subtitle">
            Curated 4-week step-by-step masterclasses designed to close your assessed skill gaps.
          </p>
        </div>

        {/* Path Selector Tabs with scroll */}
        <div className="lp-tabs-bar-wrapper">
          <div className="lp-tabs-bar">
            {localPaths.map((path) => (
              <button
                key={path.id}
                type="button"
                className={`lp-tab-btn ${selectedPathId === path.id ? 'lp-tab-active' : ''}`}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedPathId(path.id);
                }}
              >
                <span>{path.skillTarget}</span>
                <span className="badge badge-neutral font-mono text-xs">{path.currentScore} → {path.targetScore}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Path Goal Overview Card */}
      <div className="card lp-goal-banner">
        <div className="lp-goal-left">
          <div className="lp-target-badge-strip">
            <span className="badge badge-indigo">Priority Growth Curriculum</span>
            <span className="badge badge-neutral">{activePath.estimatedWeeks} Weeks</span>
          </div>

          <h3 className="lp-path-title">{activePath.title}</h3>
          <p className="lp-path-desc text-xs text-secondary">
            Engineered to elevate your <strong>{activePath.skillTarget}</strong> proficiency from {activePath.currentScore} to {activePath.targetScore} through structured cognitive lessons, rapid drills, and capstone evaluations.
          </p>

          <div className="lp-score-trajectory">
            <div className="score-node">
              <span className="text-xs text-muted">Current</span>
              <span className="font-mono font-bold text-base">{activePath.currentScore}</span>
            </div>
            <div className="trajectory-line">
              <ArrowRight size={14} className="text-muted" />
            </div>
            <div className="score-node">
              <span className="text-xs text-muted">Target</span>
              <span className="font-mono font-bold text-base text-success">{activePath.targetScore}</span>
            </div>
          </div>
        </div>

        <div className="lp-goal-right">
          <div className="lp-progress-circle-box">
            <span className="font-mono font-extrabold text-2xl text-accent">{progressPercent}%</span>
            <span className="text-xs text-muted">Curriculum Done</span>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm full-width-mobile"
            onClick={() => onNavigate('challenges')}
          >
            <Play size={13} />
            <span>Launch Next Module</span>
          </button>
        </div>
      </div>

      {/* 4-Week Step-by-Step Curriculum */}
      <div className="lp-weeks-list">
        {activePath.weeks.map((week) => {
          const weekCompletedCount = week.lessons.filter(l => l.completed).length;
          const weekDone = weekCompletedCount === week.lessons.length;

          return (
            <div key={week.week} className={`week-card card ${weekDone ? 'week-complete' : ''}`}>
              <div className="week-card-header">
                <div className="week-title-row">
                  <div className="week-badge-circle font-mono">W{week.week}</div>
                  <div>
                    <h4 className="week-title">{week.title}</h4>
                    <p className="week-focus text-xs text-muted">{week.focus}</p>
                  </div>
                </div>

                <span className="text-xs font-mono font-semibold text-muted flex-shrink-0">
                  {weekCompletedCount}/{week.lessons.length}
                </span>
              </div>

              {/* Lessons Checklist */}
              <div className="lessons-checklist">
                {week.lessons.map((lesson) => (
                  <div 
                    key={lesson.id} 
                    className={`lesson-item ${lesson.completed ? 'lesson-completed' : ''}`}
                    onClick={() => toggleLesson(week.week, lesson.id)}
                    role="checkbox"
                    aria-checked={lesson.completed}
                    tabIndex={0}
                  >
                    <div className="lesson-left">
                      <button type="button" className="checkbox-btn" aria-hidden="true">
                        {lesson.completed ? (
                          <CheckCircle2 size={16} className="text-success" />
                        ) : (
                          <Circle size={16} className="text-muted" />
                        )}
                      </button>

                      <div className="lesson-type-tag">
                        {getLessonIcon(lesson.type)}
                        <span className="text-xs font-semibold">{lesson.type}</span>
                      </div>

                      <span className="lesson-title text-xs">{lesson.title}</span>
                    </div>

                    <div className="lesson-meta-right">
                      <Clock size={11} className="text-muted" />
                      <span className="text-xs text-muted font-mono">{lesson.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .learning-path-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          width: 100%;
        }

        .lp-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-3);
        }

        .lp-tabs-bar-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          max-width: 100%;
        }

        .lp-tabs-bar {
          display: flex;
          gap: 6px;
          min-width: max-content;
        }

        .lp-tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .lp-tab-btn:hover {
          background-color: var(--bg-subtle);
        }

        .lp-tab-active {
          background-color: var(--primary-800);
          color: #FFFFFF;
          border-color: var(--primary-800);
          font-weight: 600;
        }

        .lp-tab-active .badge {
          background-color: var(--primary-700);
          color: #FFFFFF;
          border-color: transparent;
        }

        .lp-goal-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-5);
        }

        .lp-goal-left {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          max-width: 620px;
        }

        .lp-target-badge-strip {
          display: flex;
          gap: 6px;
        }

        .lp-path-title {
          font-size: 1.3rem;
          color: var(--primary-900);
        }

        .lp-score-trajectory {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-top: var(--space-2);
          background-color: var(--bg-subtle);
          padding: 6px 12px;
          border-radius: var(--radius-md);
          width: fit-content;
        }

        .score-node {
          display: flex;
          flex-direction: column;
        }

        .lp-goal-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
          border-left: 1px solid var(--border-subtle);
          padding-left: var(--space-5);
          flex-shrink: 0;
        }

        .lp-progress-circle-box {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .lp-weeks-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .week-card {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          padding: var(--space-4);
        }

        .week-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: var(--space-2);
          gap: var(--space-2);
        }

        .week-title-row {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          min-width: 0;
        }

        .week-badge-circle {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          background-color: var(--primary-800);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .week-title {
          font-size: 0.95rem;
          color: var(--primary-900);
        }

        .lessons-checklist {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .lesson-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          background-color: var(--bg-subtle);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: background-color var(--transition-fast);
          gap: var(--space-2);
        }

        .lesson-item:hover {
          background-color: var(--bg-muted);
        }

        .lesson-completed {
          opacity: 0.75;
          text-decoration: line-through;
        }

        .lesson-left {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          min-width: 0;
        }

        .checkbox-btn {
          display: flex;
          align-items: center;
          padding: 0;
          flex-shrink: 0;
        }

        .lesson-type-tag {
          display: flex;
          align-items: center;
          gap: 3px;
          background-color: var(--bg-surface);
          padding: 2px 6px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          flex-shrink: 0;
        }

        .lesson-title {
          line-height: 1.35;
        }

        .lesson-meta-right {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }

        @media (max-width: 800px) {
          .lp-goal-banner {
            flex-direction: column;
            align-items: flex-start;
          }
          .lp-goal-right {
            border-left: none;
            padding-left: 0;
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
          }
          .full-width-mobile {
            width: auto;
          }
        }

        @media (max-width: 500px) {
          .lp-goal-right {
            flex-direction: column;
            align-items: stretch;
            gap: var(--space-3);
          }
          .full-width-mobile {
            width: 100% !important;
            justify-content: center;
          }
          .lesson-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
          .lesson-meta-right {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};
