import React, { useState } from 'react';
import { 
  Flame, 
  Zap, 
  Check, 
  Edit3, 
  Save, 
  X,
  Shield,
  Lock,
  Mail,
  Users,
  Download,
  AlertCircle,
  KeyRound,
  Calendar
} from 'lucide-react';
import { StudentProfile } from '../types';
import { UserAccount } from '../types/auth';
import { authService } from '../services/authService';
import { soundFx } from '../services/audioService';

interface ProfileViewProps {
  profile: StudentProfile;
  currentUser?: UserAccount | null;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  onOpenUserManagement?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  profile, 
  currentUser,
  onUpdateProfile,
  onOpenUserManagement
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [department, setDepartment] = useState(profile.department);
  const [year, setYear] = useState(profile.year);
  const [saveToast, setSaveToast] = useState(false);

  // Password Change States
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwdMessage, setPwdMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedExport, setCopiedExport] = useState(false);

  const handleSave = () => {
    soundFx.playSuccess();
    onUpdateProfile({ name, department, year });
    if (currentUser) {
      authService.updateUserProfile(currentUser.id, { name, department, year });
    }
    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMessage(null);

    if (!currentUser) return;

    if (newPassword !== confirmNewPassword) {
      setPwdMessage({ type: 'error', text: 'New passwords do not match.' });
      soundFx.playWarning();
      return;
    }

    const result = authService.changePassword(currentUser.id, oldPassword, newPassword);
    if (result.success) {
      soundFx.playSuccess();
      setPwdMessage({ type: 'success', text: 'Password successfully updated.' });
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setShowPasswordChange(false), 2000);
    } else {
      soundFx.playWarning();
      setPwdMessage({ type: 'error', text: result.error || 'Password update failed.' });
    }
  };

  const handleExportData = () => {
    if (!currentUser) return;
    soundFx.playClick();
    const dataStr = authService.exportUserData(currentUser.id);
    navigator.clipboard.writeText(dataStr);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 3000);
  };

  const studentId = currentUser 
    ? `SD-${currentUser.id.slice(-6).toUpperCase()}`
    : 'SD-CADET-01';

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-top-strip">
        <div>
          <h2 className="page-heading">Student Profile & Credentials</h2>
          <p className="page-subtitle">Your verified academic identity, diagnostic scores, and authenticated account settings.</p>
        </div>

        <div className="top-actions-cluster">
          {onOpenUserManagement && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onOpenUserManagement}
            >
              <Users size={14} />
              <span>Switch / Manage Accounts</span>
            </button>
          )}

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
          <span>Profile information successfully updated and saved to active account.</span>
        </div>
      )}

      {/* Main Profile Info Card */}
      <div className="card student-card">
        <div className="student-profile-row">
          <div className="avatar-big-circle font-bold">
            {profile.name.charAt(0).toUpperCase()}
          </div>

          <div className="student-details-col">
            {isEditing ? (
              <div className="inline-edit-fields">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="edit-input"
                  placeholder="Student Full Name"
                />
                <div className="edit-dual-row">
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="edit-input"
                    placeholder="Department / Major"
                  />
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="edit-input"
                    placeholder="Academic Year"
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className="name-email-row">
                  <h3 className="student-display-name">{profile.name}</h3>
                  {currentUser?.email && (
                    <span className="student-email-tag font-mono text-xs">
                      <Mail size={12} /> {currentUser.email}
                    </span>
                  )}
                </div>
                <p className="student-academic-line">
                  {profile.department} • <span>{profile.year}</span>
                  {currentUser?.role && (
                    <span className="role-tag"> • {currentUser.role.toUpperCase()}</span>
                  )}
                </p>
              </div>
            )}

            <div className="badge-credential-row">
              <span className="badge badge-indigo font-bold">Level {profile.level} Investigator</span>
              <span className="badge badge-neutral">ID: {studentId}</span>
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

      {/* Account Security & Data Management Box */}
      {currentUser && (
        <div className="card security-box">
          <div className="security-header-row">
            <div className="sec-title-wrap">
              <KeyRound size={18} className="text-accent" />
              <div>
                <h4 className="box-section-title">Account Security & Credentials</h4>
                <p className="text-xs text-muted">Manage authenticated credentials, password, and portable diagnostics data.</p>
              </div>
            </div>

            <div className="sec-actions-wrap">
              <button
                type="button"
                className="btn btn-secondary btn-xs"
                onClick={handleExportData}
              >
                {copiedExport ? <Check size={13} className="text-success" /> : <Download size={13} />}
                <span>{copiedExport ? 'Dossier Copied!' : 'Export Skill JSON'}</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-xs"
                onClick={() => setShowPasswordChange(!showPasswordChange)}
              >
                <Lock size={13} />
                <span>{showPasswordChange ? 'Cancel' : 'Change Password'}</span>
              </button>
            </div>
          </div>

          {showPasswordChange && (
            <form className="password-change-form" onSubmit={handlePasswordSubmit}>
              <div className="pwd-grid">
                <div className="form-group">
                  <label className="text-xs font-bold">Current Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="edit-input"
                  />
                </div>
                <div className="form-group">
                  <label className="text-xs font-bold">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="edit-input"
                  />
                </div>
                <div className="form-group">
                  <label className="text-xs font-bold">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Re-type new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="edit-input"
                  />
                </div>
              </div>

              {pwdMessage && (
                <div className={`pwd-status ${pwdMessage.type === 'error' ? 'pwd-error' : 'pwd-success'}`}>
                  {pwdMessage.type === 'error' ? <AlertCircle size={14} /> : <Check size={14} />}
                  <span>{pwdMessage.text}</span>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-sm align-self-start">
                Update Password
              </button>
            </form>
          )}
        </div>
      )}

      {/* Interests & Existing Skills Section */}
      <div className="dual-info-grid">
        <div className="card">
          <h4 className="box-section-title">Academic & Career Interests</h4>
          <p className="text-xs text-muted" style={{ marginBottom: 'var(--space-3)' }}>
            Curated domains that influence personalized career matching recommendations.
          </p>

          <div className="chips-wrap">
            {profile.interests.length > 0 ? (
              profile.interests.map((interest) => (
                <span key={interest} className="chip-badge">
                  {interest}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted">No interests selected yet.</span>
            )}
          </div>
        </div>

        <div className="card">
          <h4 className="box-section-title">Pre-Existing Technical Foundations</h4>
          <p className="text-xs text-muted" style={{ marginBottom: 'var(--space-3)' }}>
            Self-declared skills recorded during onboarding.
          </p>

          <div className="chips-wrap">
            {profile.existingSkills.length > 0 ? (
              profile.existingSkills.map((skill) => (
                <span key={skill} className="chip-badge chip-skill">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted">No foundation skills selected yet.</span>
            )}
          </div>
        </div>
      </div>

      {/* Assessment Calibration Records with table scroll */}
      <div className="card history-card">
        <div className="card-header">
          <div>
            <h4 className="box-section-title">Diagnostic Assessment History</h4>
            <p className="text-xs text-muted">Complete audit trail of all standardized cognitive evaluations.</p>
          </div>
        </div>

        {profile.assessmentHistory.length > 0 ? (
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
        ) : (
          <div className="empty-history-box">
            <Calendar size={28} className="text-muted" />
            <strong className="text-sm">No Formal Assessment Milestones Recorded Yet</strong>
            <p className="text-xs text-muted">
              Solve challenges in the Challenges tab to calibrate your skills and generate formal diagnostic records.
            </p>
          </div>
        )}
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

        .top-actions-cluster {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .page-heading {
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .page-subtitle {
          font-size: 0.84rem;
          color: var(--text-secondary);
          margin-top: 2px;
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
          animation: slideUp 0.15s ease-out;
        }

        .student-card {
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .student-profile-row {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .avatar-big-circle {
          width: 68px;
          height: 68px;
          border-radius: var(--radius-full);
          background-color: var(--accent-indigo);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          flex-shrink: 0;
          box-shadow: var(--shadow-sm);
        }

        .student-details-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
          flex: 1;
        }

        .name-email-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .student-display-name {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .student-email-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          background-color: var(--bg-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-muted);
        }

        .student-academic-line {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .role-tag {
          font-weight: 700;
          font-size: 0.75rem;
          color: var(--accent-indigo);
        }

        .badge-credential-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 4px;
        }

        .inline-edit-fields {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .edit-dual-row {
          display: flex;
          gap: 8px;
        }

        .edit-input {
          padding: 7px 10px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background-color: var(--bg-surface);
          color: var(--text-primary);
          font-size: 0.84rem;
        }

        .edit-input:focus {
          border-color: var(--accent-indigo);
          outline: none;
        }

        .edit-actions-group {
          display: flex;
          gap: 8px;
        }

        .profile-stats-triple {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-3);
          padding-top: var(--space-4);
          border-top: 1px solid var(--border-subtle);
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
          gap: 2px;
        }

        .p-stat-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }

        .security-box {
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .security-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .sec-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sec-actions-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .password-change-form {
          margin-top: var(--space-2);
          padding-top: var(--space-3);
          border-top: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .pwd-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-3);
        }

        .pwd-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          padding: 6px 10px;
          border-radius: var(--radius-sm);
        }

        .pwd-error {
          background-color: var(--color-danger-subtle);
          color: var(--color-danger);
          border: 1px solid var(--color-danger-border);
        }

        .pwd-success {
          background-color: var(--color-success-subtle);
          color: var(--color-success);
          border: 1px solid var(--color-success-border);
        }

        .dual-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        .box-section-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .chip-badge {
          display: inline-block;
          padding: 4px 10px;
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .chip-skill {
          border-color: var(--color-indigo-border);
          color: var(--accent-indigo);
          background-color: var(--color-indigo-subtle);
        }

        .history-card {
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .table-scroll-wrapper {
          overflow-x: auto;
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.82rem;
        }

        .history-table th {
          text-align: left;
          padding: 8px 12px;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border-color);
          text-transform: uppercase;
        }

        .history-table td {
          padding: 10px 12px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .empty-history-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: var(--space-6) var(--space-4);
          text-align: center;
        }

        @media (max-width: 768px) {
          .profile-stats-triple {
            grid-template-columns: 1fr;
          }
          .dual-info-grid {
            grid-template-columns: 1fr;
          }
          .pwd-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
