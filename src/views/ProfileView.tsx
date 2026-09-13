import React, { useState } from 'react';
import { 
  Flame, 
  Zap, 
  Check, 
  Edit3, 
  Save, 
  X,
  Shield
} from 'lucide-react';
import { StudentProfile } from '../types';
import { soundFx } from '../services/audioService';

interface ProfileViewProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [department, setDepartment] = useState(profile.department);
  const [year, setYear] = useState(profile.year);
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = () => {
    soundFx.playSuccess();
    onUpdateProfile({ name, department, year });
    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-top-strip">
        <div>
          <h2 className="page-heading">Student Profile</h2>
          <p className="page-subtitle">Your academic identity, diagnostic credentials, and verified skill achievements.</p>
        </div>

        <div>
          {isEditing ? (
            <div className="edit-actions-group">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsEditing(false)}
              >
                <X size={14} />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSave}
              >
                <Save size={14} />
                <span>Save Changes</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 size={14} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {saveToast && (
        <div className="save-toast-alert">
          <Check size={16} className="text-success flex-shrink-0" />
          <span>Profile information successfully updated.</span>
        </div>
      )}

      {/* Main Profile Info Card */}
      <div className="card student-card">
        <div className="student-profile-row">
          <div className="avatar-big-circle font-bold">
            {profile.name.charAt(0)}
          </div>

          <div className="student-details-col">
            {isEditing ? (
              <div className="inline-edit-fields">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="edit-input"
                  placeholder="Student Name"
                />
                <div className="edit-dual-row">
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="edit-input"
                    placeholder="Department"
                  />
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="edit-input"
                    placeholder="Year"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h3 className="student-display-name">{profile.name}</h3>
                <p className="student-academic-line">
                  {profile.department} • <span>{profile.year}</span>
                </p>
              </div>
            )}

            <div className="badge-credential-row">
              <span className="badge badge-indigo font-bold">Level {profile.level} Investigator</span>
              <span className="badge badge-neutral">ID: SD-2026-0842</span>
              <span className="badge badge-success">Verified Academic Account</span>
            </div>
          </div>
        </div>

        {/* 3 Major Statistics */}
        <div className="profile-stats-triple">
          <div className="p-stat-box">
            <Zap size={18} className="text-accent flex-shrink-0" />
            <div className="p-stat-text">
              <span className="p-stat-label">TOTAL EXPERIENCE</span>
              <strong className="font-mono text-base">{profile.xp.toLocaleString()} XP</strong>
            </div>
          </div>

          <div className="p-stat-box">
            <Flame size={18} className="text-streak flex-shrink-0" />
            <div className="p-stat-text">
              <span className="p-stat-label">ACTIVE CADENCE</span>
              <strong className="text-streak text-base">{profile.streakDays} Day Streak</strong>
            </div>
          </div>

          <div className="p-stat-box">
            <Shield size={18} className="text-success flex-shrink-0" />
            <div className="p-stat-text">
              <span className="p-stat-label">ASSESSED SCORE</span>
              <strong className="font-mono text-base text-success">{profile.overallScore} / 100</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Interests & Existing Skills Section */}
      <div className="dual-info-grid">
        <div className="card">
          <h4 className="box-section-title">Academic & Career Interests</h4>
          <p className="text-xs text-muted" style={{ marginBottom: 'var(--space-3)' }}>
            Curated domains that influence personalized career matching recommendations.
          </p>

          <div className="chips-wrap">
            {profile.interests.map((interest) => (
              <span key={interest} className="chip-badge">
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="card">
          <h4 className="box-section-title">Pre-Existing Technical Foundations</h4>
          <p className="text-xs text-muted" style={{ marginBottom: 'var(--space-3)' }}>
            Self-declared skills recorded during onboarding.
          </p>

          <div className="chips-wrap">
            {profile.existingSkills.map((skill) => (
              <span key={skill} className="chip-badge chip-skill">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Assessment Calibration Records with table scroll */}
      <div className="card history-card">
        <div className="card-header">
          <div>
            <h4 className="box-section-title">Diagnostic Assessment History</h4>
            <p className="text-xs text-muted">Complete audit trail of all standardized evaluations.</p>
          </div>
        </div>

        <div className="table-scroll-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Evaluation Milestone</th>
                <th>Date</th>
                <th>Score</th>
                <th>Outcome</th>
              </tr>
            </thead>
            <tbody>
              {profile.assessmentHistory.map((rec) => (
                <tr key={rec.assessmentNumber}>
                  <td>
                    <strong className="text-xs">{rec.label}</strong>
                    <span className="text-xs text-muted block">Calibration #{rec.assessmentNumber}</span>
                  </td>
                  <td className="text-muted text-xs">{rec.date}</td>
                  <td className="font-mono font-bold text-xs">{rec.score}/100</td>
                  <td>
                    <span className="badge badge-success text-xs">Calibrated</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .profile-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          width: 100%;
        }

        .profile-top-strip {
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

        .edit-actions-group {
          display: flex;
          gap: 6px;
        }

        .save-toast-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background-color: var(--color-success-subtle);
          border: 1px solid var(--color-success-border);
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          color: var(--color-success);
        }

        .student-card {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          padding: var(--space-5);
        }

        .student-profile-row {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .avatar-big-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background-color: var(--primary-800);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          flex-shrink: 0;
        }

        .student-details-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .student-display-name {
          font-size: 1.4rem;
          color: var(--primary-900);
        }

        .student-academic-line {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .badge-credential-row {
          display: flex;
          gap: 6px;
          margin-top: 4px;
          flex-wrap: wrap;
        }

        .inline-edit-fields {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .edit-input {
          padding: 6px 10px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 0.85rem;
        }

        .edit-dual-row {
          display: flex;
          gap: 6px;
        }

        .profile-stats-triple {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-3);
          border-top: 1px solid var(--border-subtle);
          padding-top: var(--space-3);
        }

        .p-stat-box {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          background-color: var(--bg-subtle);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .p-stat-text {
          display: flex;
          flex-direction: column;
        }

        .p-stat-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .text-streak {
          color: #EA580C;
        }

        .dual-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-3);
        }

        .box-section-title {
          font-size: 1.0rem;
          color: var(--primary-900);
          margin-bottom: 2px;
        }

        .chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .chip-badge {
          padding: 5px 10px;
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .chip-skill {
          background-color: var(--accent-indigo-subtle);
          border-color: #C7D2FE;
          color: var(--accent-indigo);
          font-weight: 600;
        }

        .history-card {
          overflow: hidden;
        }

        .table-scroll-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.85rem;
          min-width: 480px;
        }

        .history-table th, .history-table td {
          padding: 8px 12px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .history-table th {
          background-color: var(--bg-subtle);
          font-weight: 600;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .profile-stats-triple {
            grid-template-columns: 1fr;
          }
          .dual-info-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 500px) {
          .student-profile-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .avatar-big-circle {
            width: 52px;
            height: 52px;
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};
