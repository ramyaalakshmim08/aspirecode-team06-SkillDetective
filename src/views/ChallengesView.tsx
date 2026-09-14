import React, { useState } from 'react';
import { 
  Clock, 
  Lock, 
  CheckCircle2, 
  Play, 
  Search
} from 'lucide-react';
import { InteractiveChallenge, ChallengeDifficulty } from '../types';
import { soundFx } from '../services/audioService';

interface ChallengesViewProps {
  challenges: InteractiveChallenge[];
  onStartChallenge: (challenge: InteractiveChallenge) => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({
  challenges,
  onStartChallenge
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryTabs = [
    { id: 'all', label: 'All Challenges' },
    { id: 'logical', label: 'Logic' },
    { id: 'problem-solving', label: 'Problem Solving' },
    { id: 'coding', label: 'Coding' },
    { id: 'communication', label: 'Communication' },
    { id: 'creativity', label: 'Creativity' },
    { id: 'data-analysis', label: 'Data' },
    { id: 'decision-making', label: 'Decision Making' },
    { id: 'attention-to-detail', label: 'Attention to Detail' },
  ];

  const filteredChallenges = challenges.filter((c) => {
    const matchesCategory = activeCategory === 'all' || c.category === activeCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || c.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const handleLaunch = (challenge: InteractiveChallenge) => {
    if (challenge.status === 'Locked') return;
    soundFx.playClick();
    onStartChallenge(challenge);
  };

  const getDifficultyBadge = (diff: ChallengeDifficulty) => {
    switch (diff) {
      case 'Easy':
        return <span className="badge badge-success">Easy</span>;
      case 'Medium':
        return <span className="badge badge-neutral">Medium</span>;
      case 'Hard':
        return <span className="badge badge-warning">Hard</span>;
    }
  };

  return (
    <div className="challenges-page">
      {/* Header */}
      <div className="challenges-page-header">
        <div>
          <h2 className="page-heading">Challenges</h2>
          <p className="page-subtitle">Test how you think. Build your verified skill profile with interactive diagnostics.</p>
        </div>

        {/* Search and Filters */}
        <div className="header-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search challenges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="challenge-search-input"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="categories-scroll-wrapper">
        <div className="categories-pill-bar" role="tablist">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === tab.id}
              onClick={() => {
                soundFx.playClick();
                setActiveCategory(tab.id);
              }}
              className={`cat-pill-btn ${activeCategory === tab.id ? 'cat-pill-active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-bar: Count & Difficulty filter */}
      <div className="challenges-filter-strip">
        <span className="results-count text-xs text-muted font-mono">
          Showing <strong>{filteredChallenges.length}</strong> of {challenges.length} challenges
        </span>

        <div className="difficulty-filter-group">
          <span className="text-xs text-muted">Difficulty:</span>
          {['all', 'Easy', 'Medium', 'Hard'].map((d) => (
            <button
              key={d}
              type="button"
              className={`diff-btn ${selectedDifficulty === d ? 'diff-btn-active' : ''}`}
              onClick={() => setSelectedDifficulty(d)}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Cards List */}
      <div className="challenges-list">
        {filteredChallenges.map((challenge) => {
          const isLocked = challenge.status === 'Locked';
          const isCompleted = challenge.status === 'Completed';

          return (
            <div 
              key={challenge.id} 
              className={`challenge-card card ${isLocked ? 'card-locked' : 'card-hover'}`}
            >
              <div className="card-left-col">
                <div className="challenge-tags-row">
                  <span className="badge badge-neutral">{challenge.categoryLabel}</span>
                  {getDifficultyBadge(challenge.difficulty)}
                  <span className="time-pill">
                    <Clock size={12} />
                    <span>{challenge.estimatedMinutes} min</span>
                  </span>
                  <span className="xp-tag font-mono">
                    +{challenge.xpReward} XP
                  </span>
                </div>

                <h3 className="challenge-item-title">{challenge.title}</h3>

                {isLocked ? (
                  <div className="lock-reason-note">
                    <Lock size={14} className="text-muted flex-shrink-0" />
                    <span className="text-xs text-muted">{challenge.lockReason}</span>
                  </div>
                ) : (
                  <p className="challenge-item-desc text-xs text-muted">
                    {challenge.type === 'logic' && 'Mathematical progression & logical sequence deduction.'}
                    {challenge.type === 'coding' && 'Algorithmic implementation with test case edge-condition assertions.'}
                    {challenge.type === 'communication' && 'Timed verbal explanation assessed by clarity & analogy structure.'}
                    {challenge.type === 'data' && 'Quantitative table analysis & inflection rate computation.'}
                    {challenge.type === 'attention' && 'Code audit for security vulnerabilities & silent discrepancies.'}
                  </p>
                )}
              </div>

              <div className="card-right-col">
                {isCompleted ? (
                  <div className="completed-status-badge">
                    <CheckCircle2 size={15} className="text-success" />
                    <span className="text-xs font-semibold text-success">Completed</span>
                  </div>
                ) : isLocked ? (
                  <button type="button" className="btn btn-secondary btn-sm full-width-on-mobile" disabled>
                    <Lock size={13} />
                    <span>Locked</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary full-width-on-mobile"
                    onClick={() => handleLaunch(challenge)}
                  >
                    <Play size={14} />
                    <span>Start Challenge</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .challenges-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          width: 100%;
        }

        .challenges-page-header {
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

        .header-search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 6px 12px;
          width: 260px;
        }

        .search-icon {
          color: var(--text-muted);
        }

        .challenge-search-input {
          border: none;
          background: none;
          font-size: 0.85rem;
          outline: none;
          width: 100%;
        }

        .categories-scroll-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 4px;
        }

        .categories-pill-bar {
          display: flex;
          gap: 6px;
          min-width: max-content;
        }

        .cat-pill-btn {
          padding: 6px 12px;
          border-radius: var(--radius-full);
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .cat-pill-btn:hover {
          background-color: var(--bg-subtle);
          color: var(--text-primary);
        }

        .cat-pill-active {
          background-color: var(--primary-800);
          color: #FFFFFF;
          border-color: var(--primary-800);
          font-weight: 600;
        }

        .challenges-filter-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-2);
          padding: 2px 0;
        }

        .difficulty-filter-group {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
        }

        .diff-btn {
          padding: 3px 8px;
          font-size: 0.72rem;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
        }

        .diff-btn-active {
          background-color: var(--bg-subtle);
          color: var(--text-primary);
          font-weight: 600;
        }

        .challenges-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .challenge-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          padding: var(--space-4);
        }

        .card-locked {
          background-color: var(--bg-subtle);
          opacity: 0.88;
        }

        .card-left-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
        }

        .challenge-tags-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .time-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .xp-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--accent-indigo);
          background-color: var(--accent-indigo-subtle);
          padding: 2px 6px;
          border-radius: var(--radius-xs);
        }

        .challenge-item-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .lock-reason-note {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .card-right-col {
          flex-shrink: 0;
        }

        .completed-status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background-color: var(--color-success-subtle);
          border: 1px solid var(--color-success-border);
          border-radius: var(--radius-md);
        }

        .full-width-on-mobile {
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .challenges-page-header {
            flex-direction: column;
            align-items: stretch;
          }
          .header-search-box {
            width: 100%;
          }
        }

        @media (max-width: 650px) {
          .challenge-card {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          .card-right-col {
            width: 100%;
          }
          .full-width-on-mobile {
            width: 100%;
            display: flex;
            justify-content: center;
          }
          .completed-status-badge {
            justify-content: center;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
