import React, { useState } from 'react';
import { 
  Flame, 
  Zap, 
  Check, 
  Edit3, 
  Save, 
  X,
  Shield,
  Trash2,
  AlertTriangle,
  Award,
  BookOpen
} from 'lucide-react';
import { StudentProfile } from '../types';
import { soundFx } from '../services/audioService';

interface ProfileViewProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  onDeleteAccount?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  profile, 
  onUpdateProfile,
  onDeleteAccount 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [institution, setInstitution] = useState(profile.institution || '');
  const [department, setDepartment] = useState(profile.department || '');
  const [year, setYear] = useState(profile.year || '1st Year');
  const [bio, setBio] = useState(profile.bio || '');
  const [saveToast, setSaveToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSave = () => {
    soundFx.playSuccess();
    onUpdateProfile({ 
      name: name.trim() || profile.name,
      institution: institution.trim(),
      department: department.trim(),
      year,
      bio: bio.trim()
    });
    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleConfirmDelete = () => {
    if (onDeleteAccount) {
      onDeleteAccount();
    }
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-top-strip">
        <div>
          <h2 className="page-heading">Student Profile & Credentials</h2>
          <p className="page-subtitle">Your verified academic identity, assessment history, and institutional credentials.</p>
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
        <div className="settings-toast fixed top-20 right-6 z-50 flex items-center gap-2 bg-emerald-800 text-white px-4 py-2 rounded-lg text-xs shadow-xl">
          <Check size={16} />
          <span>Profile changes saved to database.</span>
        </div>
      )}

      {/* Main Student Identity Card */}
      <div className="card profile-id-card">
        <div className="student-profile-row">
          <div className="avatar-big-circle">
            {profile.name.charAt(0).toUpperCase()}
          </div>

          <div className="student-info-main">
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                <div>
                  <label className="text-[11px] font-bold text-muted uppercase">Full Name</label>
                  <input
                    type="text"
                    className="input-field text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted uppercase">Institution</label>
                  <input
                    type="text"
                    className="input-field text-sm"
                    placeholder="e.g. Stanford University"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted uppercase">Department / Course</label>
                  <input
                    type="text"
                    className="input-field text-sm"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted uppercase">Academic Year</label>
                  <select
                    className="input-field text-sm"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="student-name-lg">{profile.name}</h3>
                  <span className={`badge text-xs uppercase ${profile.role === 'admin' ? 'badge-accent' : 'badge-secondary'}`}>
                    {profile.role}
                  </span>
                </div>
                <p className="student-dept-year text-xs text-muted">
                  {profile.department} • {profile.year} {profile.institution ? `(${profile.institution})` : ''}
                </p>
                <p className="text-xs text-muted font-mono mt-0.5">{profile.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* 3 Metric Badges */}
        <div className="profile-stats-triple">
          <div className="p-stat-box">
            <Shield size={18} className="text-accent" />
            <div className="p-stat-text">
              <span className="p-stat-label">ASSESSMENT STATUS</span>
              <strong className="font-mono text-sm">
                {profile.overallScore !== null ? `${profile.overallScore}% Overall` : 'Unassessed'}
              </strong>
            </div>
          </div>

          <div className="p-stat-box">
            <Zap size={18} className="text-accent" />
            <div className="p-stat-text">
              <span className="p-stat-label">EXPERIENCE POINTS</span>
              <strong className="font-mono text-sm">{profile.xp.toLocaleString()} XP (Lvl {profile.level})</strong>
            </div>
          </div>

          <div className="p-stat-box">
            <Flame size={18} className="text-streak" />
            <div className="p-stat-text">
              <span className="p-stat-label">ACTIVITY CADENCE</span>
              <strong className="font-mono text-sm">{profile.streakDays} Day Streak</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Interests & Target Goals */}
      <div className="dual-info-grid">
        <div className="card info-box-card">
          <div className="box-header-sm">
            <BookOpen size={16} className="text-accent" />
            <h4 className="box-section-title text-sm font-bold">Academic Interests</h4>
          </div>
          <div className="chips-wrap mt-2">
            {profile.interests.length > 0 ? (
              profile.interests.map((interest) => (
                <span key={interest} className="chip-badge">{interest}</span>
              ))
            ) : (
              <span className="text-xs text-muted">No academic interests specified yet.</span>
            )}
          </div>
        </div>

        <div className="card info-box-card">
          <div className="box-header-sm">
            <Award size={16} className="text-accent" />
            <h4 className="box-section-title text-sm font-bold">Target Career Goals</h4>
          </div>
          <div className="chips-wrap mt-2">
            {profile.careerGoals.length > 0 ? (
              profile.careerGoals.map((g) => (
                <span key={g} className="chip-badge chip-skill">{g}</span>
              ))
            ) : (
              <span className="text-xs text-muted">Bookmark careers from the Career Matches tab to track them here.</span>
            )}
          </div>
        </div>
      </div>

      {/* Verified Assessment History Table */}
      <div className="card history-card mt-6">
        <div className="p-4 border-b border-subtle">
          <h4 className="font-bold text-sm text-foreground">Verified Diagnostic History</h4>
          <p className="text-xs text-muted">Chronological log of submitted evaluations and calibrated scores.</p>
        </div>

        <div className="table-scroll-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Test #</th>
                <th>Diagnostic Type</th>
                <th>Date Completed</th>
                <th>Score Earned</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {profile.assessmentHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-xs text-muted">
                    No assessments completed yet. Take your first challenge to establish your diagnostic timeline.
                  </td>
                </tr>
              ) : (
                profile.assessmentHistory.map((h) => (
                  <tr key={h.assessmentNumber}>
                    <td className="font-mono">#{h.assessmentNumber}</td>
                    <td className="font-medium">{h.label}</td>
                    <td className="text-muted text-xs font-mono">{h.date}</td>
                    <td className="font-mono font-bold text-accent">{h.score}/100</td>
                    <td>
                      <span className="badge badge-success text-xs">Verified</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="card p-5 mt-6 border-danger/30 bg-red-50/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="text-sm font-bold text-danger flex items-center gap-1.5">
              <AlertTriangle size={16} />
              <span>Account Danger Zone</span>
            </h4>
            <p className="text-xs text-muted max-w-xl mt-1">
              Permanently delete your student profile, verified competency scores, challenge attempts, and learning records. This action cannot be reversed.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm text-danger border-danger/40 hover:bg-danger/10 flex-shrink-0"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 size={14} />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-backdrop fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-danger mb-2">
              <AlertTriangle size={20} />
              <h3 className="font-bold text-base text-foreground">Confirm Account Deletion</h3>
            </div>
            <p className="text-xs text-muted mb-4">
              Are you sure you want to delete your Skill Detective account? All your scores, XP, streak progress, and attempts will be permanently erased.
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-subtle">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm bg-danger border-danger text-white hover:bg-danger/90"
                onClick={handleConfirmDelete}
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
