import React from 'react';
import { Printer, ArrowLeft, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { StudentProfile, SkillData, CareerMatch } from '../types';

interface ReportViewProps {
  profile: StudentProfile;
  skills: SkillData[];
  careers: CareerMatch[];
  onBack: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ profile, skills, careers, onBack }) => {
  const assessedSkills = skills.filter((s) => s.score !== null);
  const unassessedSkills = skills.filter((s) => s.score === null);
  const topStrengths = [...assessedSkills].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 3);
  const areasToImprove = [...assessedSkills].sort((a, b) => (a.score || 0) - (b.score || 0)).slice(0, 3);
  const topCareer = careers[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="report-container max-w-4xl mx-auto p-6">
      {/* Non-printed Controls */}
      <div className="flex justify-between items-center mb-6 print-hidden">
        <button type="button" className="btn btn-secondary btn-sm" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <button type="button" className="btn btn-primary btn-sm" onClick={handlePrint}>
          <Printer size={16} />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Official Academic Report Card */}
      <div className="card report-card p-8 border border-border bg-surface text-foreground shadow-sm">
        {/* Report Header */}
        <div className="flex justify-between items-start border-b border-border pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-extrabold text-xl tracking-tight text-foreground">SKILL DETECTIVE</span>
              <span className="badge badge-accent text-xs uppercase font-mono">Academic Diagnostic Report</span>
            </div>
            <p className="text-xs text-muted">Empirical Competency Calibration & Career Compatibility Assessment</p>
          </div>

          <div className="text-right text-xs text-muted">
            <div><strong>Report Date:</strong> {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</div>
            <div><strong>Verification ID:</strong> <span className="font-mono">{profile.id.substring(0, 12)}</span></div>
          </div>
        </div>

        {/* Student Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-surface-raised rounded-lg border border-subtle mb-6 text-sm">
          <div>
            <span className="text-xs text-muted block uppercase">Student Name</span>
            <strong className="text-foreground">{profile.name}</strong>
          </div>
          <div>
            <span className="text-xs text-muted block uppercase">Institution</span>
            <span className="text-foreground">{profile.institution || 'Verified Student'}</span>
          </div>
          <div>
            <span className="text-xs text-muted block uppercase">Department / Year</span>
            <span className="text-foreground">{profile.department} ({profile.year})</span>
          </div>
          <div>
            <span className="text-xs text-muted block uppercase">Overall Baseline</span>
            <strong className="text-accent font-mono">
              {profile.overallScore !== null ? `${profile.overallScore}%` : 'Pending'}
            </strong>
          </div>
        </div>

        {/* Competency Overview */}
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase text-foreground mb-3 tracking-wide">
            Assessed Cognitive & Technical Competencies
          </h3>

          {assessedSkills.length === 0 ? (
            <div className="p-4 bg-surface-raised rounded text-center text-sm text-muted">
              No diagnostic assessments have been completed yet. Baseline scores will populate here as challenges are executed.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {assessedSkills.map((s) => (
                <div key={s.id} className="p-3 border border-subtle rounded flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-sm block text-foreground">{s.name}</span>
                    <span className="text-xs text-muted">Confidence: {s.confidence} ({s.completedChallenges} attempts)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-base text-foreground">{s.score}%</span>
                    <span className="text-xs text-muted block uppercase">{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Strengths and Growth Areas */}
        {assessedSkills.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-lg">
              <h4 className="text-xs font-bold uppercase text-emerald-800 flex items-center gap-1.5 mb-2">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Primary Demonstrated Strengths</span>
              </h4>
              <ul className="text-xs space-y-1.5 text-emerald-950">
                {topStrengths.map((str) => (
                  <li key={str.id}>• <strong>{str.name}:</strong> {str.strength}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-lg">
              <h4 className="text-xs font-bold uppercase text-amber-800 flex items-center gap-1.5 mb-2">
                <AlertCircle size={14} className="text-amber-600" />
                <span>Priority Calibration Areas</span>
              </h4>
              <ul className="text-xs space-y-1.5 text-amber-950">
                {areasToImprove.map((imp) => (
                  <li key={imp.id}>• <strong>{imp.name}:</strong> {imp.practice}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Top Career Recommendation */}
        {topCareer && topCareer.matchPercentage > 0 && (
          <div className="p-4 bg-surface-raised rounded-lg border border-subtle mb-6">
            <h4 className="text-xs font-bold uppercase text-foreground mb-1">Top Career Compatibility Match</h4>
            <div className="flex justify-between items-center mb-2">
              <span className="text-base font-bold text-foreground">{topCareer.title}</span>
              <span className="font-mono text-accent font-bold">{topCareer.matchPercentage}% Compatibility</span>
            </div>
            <p className="text-xs text-muted mb-2">{topCareer.description}</p>
            <div className="text-xs text-muted">
              <strong>Target Skills to Accelerate:</strong> {topCareer.skillsToBuild.join(', ')}
            </div>
          </div>
        )}

        {/* Footer Disclaimer */}
        <div className="border-t border-border pt-4 text-center text-xs text-muted">
          Skill Detective diagnostic reports represent empirical academic skill measurements at the time of evaluation. 
          Results should be used as guidance for personal development roadmaps rather than absolute career determinants.
        </div>
      </div>

      <style>{`
        @media print {
          .print-hidden {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .report-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};
