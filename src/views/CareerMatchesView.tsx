import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  Bookmark, 
  SlidersHorizontal, 
  X, 
  TrendingUp, 
  Sparkles,
  Target
} from 'lucide-react';
import { CareerMatch } from '../types';
import { soundFx } from '../services/audioService';
import { CareerService } from '../services/careerService';

interface CareerMatchesViewProps {
  careers: CareerMatch[];
  userId?: string;
  onSelectCareer: (career: CareerMatch) => void;
  onStartAssessment?: () => void;
}

export const CareerMatchesView: React.FC<CareerMatchesViewProps> = ({
  careers,
  userId,
  onSelectCareer,
  onStartAssessment
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'high-match' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleOpenDetail = (career: CareerMatch) => {
    soundFx.playClick();
    onSelectCareer(career);
  };

  const handleToggleBookmark = (e: React.MouseEvent, careerId: string, currentStatus?: string) => {
    e.stopPropagation();
    soundFx.playClick();
    if (!userId) return;

    const nextStatus = currentStatus ? null : 'primary_goal';
    CareerService.setGoalStatus(userId, careerId, nextStatus);
    showToast(nextStatus ? 'Career marked as Primary Goal' : 'Career removed from goals');
  };

  const handleToggleCompare = (e: React.MouseEvent, careerId: string) => {
    e.stopPropagation();
    soundFx.playClick();

    if (selectedForCompare.includes(careerId)) {
      setSelectedForCompare(selectedForCompare.filter((id) => id !== careerId));
    } else {
      if (selectedForCompare.length >= 3) {
        showToast('You can compare a maximum of 3 careers simultaneously.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, careerId]);
    }
  };

  const filteredCareers = careers.filter((c) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchSkills = c.skillsRequired.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchSkills) return false;
    }
    if (filterMode === 'high-match') return c.matchPercentage >= 75;
    if (filterMode === 'saved') return Boolean(c.isSaved);
    return true;
  });

  const comparedCareerObjects = careers.filter((c) => selectedForCompare.includes(c.id));

  return (
    <div className="career-matches-page">
      {toastMessage && (
        <div className="settings-toast fixed top-20 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-xs shadow-xl">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="careers-header-strip">
        <div>
          <h2 className="page-heading">Career Compatibility Directory</h2>
          <p className="page-subtitle">
            Explore industry roles aligned with your verified diagnostic performance. Derived from empirical problem-solving — zero subjective personality quizzes.
          </p>
        </div>

        {/* Search & Compare Actions */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <div className="input-with-icon max-w-xs w-full">
            <Search size={14} className="input-icon" />
            <input
              type="text"
              className="input-field text-xs py-1.5"
              placeholder="Search roles or required tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-chips-row">
            <button
              type="button"
              className={`filter-chip ${filterMode === 'all' ? 'chip-active' : ''}`}
              onClick={() => setFilterMode('all')}
            >
              All Roles ({careers.length})
            </button>
            <button
              type="button"
              className={`filter-chip ${filterMode === 'high-match' ? 'chip-active' : ''}`}
              onClick={() => setFilterMode('high-match')}
            >
              High Compatibility (≥75%)
            </button>
            <button
              type="button"
              className={`filter-chip ${filterMode === 'saved' ? 'chip-active' : ''}`}
              onClick={() => setFilterMode('saved')}
            >
              My Saved Goals
            </button>
          </div>

          {selectedForCompare.length >= 2 && (
            <button
              type="button"
              className="btn btn-primary btn-sm ml-auto"
              onClick={() => setIsCompareModalOpen(true)}
            >
              <SlidersHorizontal size={14} />
              <span>Compare Roles ({selectedForCompare.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Zero Assessments Alert */}
      {careers.length > 0 && careers[0].matchPercentage === 0 && (
        <div className="card p-6 border border-accent/40 bg-accent/5 mb-6 text-center">
          <Target size={24} className="text-accent mx-auto mb-2" />
          <h3 className="text-base font-bold text-foreground">Awaiting Diagnostic Calibration</h3>
          <p className="text-xs text-muted max-w-md mx-auto mb-3">
            Career compatibility percentages are calculated from actual challenge evaluations. Complete your first challenge to generate empirical compatibility scores.
          </p>
          {onStartAssessment && (
            <button type="button" className="btn btn-primary btn-sm" onClick={onStartAssessment}>
              <span>Launch First Assessment</span>
            </button>
          )}
        </div>
      )}

      {/* Career Cards Grid */}
      <div className="career-cards-grid">
        {filteredCareers.map((career) => {
          const isSelected = selectedForCompare.includes(career.id);

          return (
            <div 
              key={career.id} 
              className={`career-match-card card card-hover ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20' : ''}`}
              onClick={() => handleOpenDetail(career)}
            >
              {/* Top Bar with Match Pill and Actions */}
              <div className="cm-header">
                <div className="cm-title-block">
                  <span className="badge badge-indigo font-bold text-xs">
                    {career.matchPercentage > 0 ? `${career.matchPercentage}% Alignment` : 'Pending Assessment'}
                  </span>
                  <h3 className="cm-role-title">{career.title}</h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className={`btn btn-xs ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={(e) => handleToggleCompare(e, career.id)}
                    title="Select to compare side-by-side"
                  >
                    {isSelected ? 'Selected' : 'Compare'}
                  </button>

                  <button
                    type="button"
                    className={`icon-btn ${career.isSaved ? 'text-accent' : 'text-muted'}`}
                    onClick={(e) => handleToggleBookmark(e, career.id, career.goalStatus)}
                    title={career.isSaved ? 'Remove from Career Goals' : 'Save to Career Goals'}
                    aria-label="Save goal"
                  >
                    <Bookmark size={16} fill={career.isSaved ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>

              {/* Salary & Demand Metrics */}
              <div className="cm-metrics-row">
                <span className="text-xs font-mono font-bold text-foreground">{career.salaryRange}</span>
                <span className="text-xs text-muted font-mono">• {career.demandGrowth}</span>
              </div>

              <p className="cm-desc text-xs text-muted">{career.description}</p>

              {/* Why It Fits */}
              <div className="cm-reasons-block">
                <span className="text-[11px] font-bold uppercase text-muted tracking-wider block mb-1">
                  Diagnostic Alignment:
                </span>
                <ul className="text-xs space-y-1 text-foreground">
                  {career.whyItMatches.slice(0, 2).map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 size={13} className="text-success flex-shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Skills Chips */}
              <div className="cm-skills-block">
                <span className="text-[11px] font-bold uppercase text-muted tracking-wider block mb-1">
                  Target Skills to Accelerate:
                </span>
                <div className="flex flex-wrap gap-1">
                  {career.skillsToBuild.slice(0, 3).map((skill) => (
                    <span key={skill} className="badge badge-secondary text-[11px]">{skill}</span>
                  ))}
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="cm-footer pt-3 mt-3 border-t border-subtle flex justify-between items-center">
                <span className="text-xs text-muted font-mono">
                  {career.learningPathSteps.length} Step Roadmap
                </span>
                <span className="text-xs font-bold text-accent flex items-center gap-1">
                  <span>Deep Dive</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Modal */}
      {isCompareModalOpen && (
        <div className="modal-backdrop fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-subtle mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Side-by-Side Career Comparison</h3>
                <p className="text-xs text-muted">Comparative breakdown across requirements, market compensation, and roadmaps.</p>
              </div>
              <button
                type="button"
                className="text-muted hover:text-foreground"
                onClick={() => setIsCompareModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {comparedCareerObjects.map((c) => (
                <div key={c.id} className="card p-4 space-y-3 bg-surface-raised">
                  <div>
                    <h4 className="font-bold text-base text-foreground">{c.title}</h4>
                    <span className="badge badge-indigo text-xs mt-1 font-mono">
                      {c.matchPercentage > 0 ? `${c.matchPercentage}% Compatibility` : 'Unassessed'}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-muted uppercase font-bold block">Market Benchmark</span>
                    <p className="font-mono text-xs">{c.salaryRange} ({c.demandGrowth})</p>
                  </div>

                  <div>
                    <span className="text-xs text-muted uppercase font-bold block mb-1">Required Competencies</span>
                    <div className="space-y-1 text-xs">
                      {c.skillsRequired.map((s) => (
                        <div key={s} className="flex justify-between">
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-muted uppercase font-bold block mb-1">Target Tools</span>
                    <div className="flex flex-wrap gap-1">
                      {c.skillsToBuild.map((t) => (
                        <span key={t} className="badge badge-secondary text-[10px]">{t}</span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary btn-xs w-full mt-2"
                    onClick={() => {
                      setIsCompareModalOpen(false);
                      onSelectCareer(c);
                    }}
                  >
                    View Full 4-Step Roadmap
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
