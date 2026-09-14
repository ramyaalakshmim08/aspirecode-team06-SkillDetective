import React, { useState } from 'react';
import { 
  X, 
  Users, 
  UserCheck, 
  UserPlus, 
  Download, 
  RotateCcw, 
  Trash2, 
  LogOut, 
  Check, 
  AlertTriangle,
  Award,
  Zap,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { UserAccount } from '../types/auth';
import { authService } from '../services/authService';
import { soundFx } from '../services/audioService';

interface UserManagementModalProps {
  isOpen: boolean;
  currentUser: UserAccount | null;
  onClose: () => void;
  onUserSwitched: (user: UserAccount) => void;
  onOpenSignUp: () => void;
  onLogout: () => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onUserSwitched,
  onOpenSignUp,
  onLogout
}) => {
  const [copiedExport, setCopiedExport] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmResetId, setConfirmResetId] = useState<string | null>(null);

  if (!isOpen) return null;

  const allUsers = authService.getUsers();

  const handleSwitch = (user: UserAccount) => {
    if (currentUser?.id === user.id) return;
    soundFx.playClick();
    const switched = authService.switchUser(user.id);
    if (switched) {
      soundFx.playSuccess();
      onUserSwitched(switched);
      onClose();
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

  const handleResetProgress = (userId: string) => {
    soundFx.playWarning();
    const resetUser = authService.resetUserProgress(userId);
    if (resetUser) {
      onUserSwitched(resetUser);
      setConfirmResetId(null);
    }
  };

  const handleDeleteUser = (userId: string) => {
    soundFx.playWarning();
    authService.deleteUser(userId);
    setConfirmDeleteId(null);
    const remaining = authService.getCurrentUser();
    if (remaining) {
      onUserSwitched(remaining);
    } else {
      onLogout();
      onClose();
    }
  };

  return (
    <div className="user-mgmt-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="user-mgmt-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close user management"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mgmt-header">
          <div className="mgmt-badge">
            <Users size={15} />
            <span>USER & PROFILE DIRECTORY</span>
          </div>
          <h2 className="mgmt-title">Student Account Management</h2>
          <p className="mgmt-subtext">
            Switch between authenticated profiles, register new learner accounts, or export verified skill credentials.
          </p>
        </div>

        {/* Current Active User Banner */}
        {currentUser && (
          <div className="current-user-card card">
            <div className="user-card-main-row">
              <div className="user-avatar-circle font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div className="user-card-info">
                <div className="user-name-row">
                  <h3 className="user-card-name">{currentUser.name}</h3>
                  <span className="badge badge-indigo text-xs">Active Session</span>
                </div>
                <p className="user-card-meta">
                  {currentUser.department} • {currentUser.year} • <span className="font-mono">{currentUser.email}</span>
                </p>
                <div className="user-card-stats">
                  <span className="stat-item"><Award size={13} /> Level {currentUser.profile.level}</span>
                  <span className="stat-item"><Zap size={13} /> {currentUser.profile.xp.toLocaleString()} XP</span>
                  <span className="stat-item"><Flame size={13} /> {currentUser.profile.streakDays}d Streak</span>
                  <span className="stat-item text-success"><ShieldCheck size={13} /> Score: {currentUser.profile.overallScore}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Registered Profiles List */}
        <div className="section-block">
          <div className="section-title-row">
            <h4 className="section-heading">Available Accounts ({allUsers.length})</h4>
            <button
              type="button"
              className="btn btn-secondary btn-xs"
              onClick={() => {
                onClose();
                onOpenSignUp();
              }}
            >
              <UserPlus size={14} />
              <span>Add New Account</span>
            </button>
          </div>

          <div className="accounts-list">
            {allUsers.map((user) => {
              const isCurrent = currentUser?.id === user.id;
              return (
                <div
                  key={user.id}
                  className={`account-item-row ${isCurrent ? 'account-item-active' : ''}`}
                  onClick={() => handleSwitch(user)}
                >
                  <div className="account-item-left">
                    <div className="small-avatar font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="account-name-badge">
                        <strong className="account-name">{user.name}</strong>
                        {isCurrent && (
                          <span className="current-indicator">
                            <UserCheck size={13} /> Current
                          </span>
                        )}
                      </div>
                      <span className="account-details text-xs text-muted">
                        {user.department} • Lvl {user.profile.level} • {user.email}
                      </span>
                    </div>
                  </div>

                  <div className="account-item-right" onClick={(e) => e.stopPropagation()}>
                    {!isCurrent && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        onClick={() => handleSwitch(user)}
                      >
                        Switch
                      </button>
                    )}

                    {confirmDeleteId === user.id ? (
                      <div className="confirm-delete-group">
                        <span className="text-xs text-danger font-bold">Delete?</span>
                        <button
                          type="button"
                          className="btn btn-danger btn-xs"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-xs"
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      allUsers.length > 1 && (
                        <button
                          type="button"
                          className="icon-action-btn"
                          title="Delete this account"
                          onClick={() => setConfirmDeleteId(user.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Management & Session Actions */}
        {currentUser && (
          <div className="section-block">
            <h4 className="section-heading">Active Account Actions</h4>
            <div className="actions-grid">
              <button
                type="button"
                className="mgmt-action-btn"
                onClick={handleExportData}
              >
                {copiedExport ? <Check size={16} className="text-success" /> : <Download size={16} />}
                <div className="action-text-col">
                  <strong>{copiedExport ? 'Dossier Copied!' : 'Export Skill Dossier'}</strong>
                  <span className="text-xs text-muted">Copy complete empirical diagnostic data as JSON</span>
                </div>
              </button>

              {confirmResetId === currentUser.id ? (
                <div className="mgmt-confirm-box">
                  <AlertTriangle size={16} className="text-amber flex-shrink-0" />
                  <div className="confirm-text-col">
                    <strong>Reset all challenge scores to baseline?</strong>
                    <div className="confirm-btns-row">
                      <button
                        type="button"
                        className="btn btn-danger btn-xs"
                        onClick={() => handleResetProgress(currentUser.id)}
                      >
                        Confirm Reset
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        onClick={() => setConfirmResetId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="mgmt-action-btn"
                  onClick={() => setConfirmResetId(currentUser.id)}
                >
                  <RotateCcw size={16} />
                  <div className="action-text-col">
                    <strong>Reset Diagnostic Calibration</strong>
                    <span className="text-xs text-muted">Revert diagnostic scores back to Level 1 baseline</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer: Log Out */}
        <div className="mgmt-footer">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              soundFx.playClick();
              onLogout();
              onClose();
            }}
          >
            <LogOut size={15} />
            <span>Sign Out Current Session</span>
          </button>
        </div>
      </div>

      <style>{`
        .user-mgmt-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(15, 23, 42, 0.72);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--space-4);
          animation: fadeIn 0.2s ease-out;
        }

        .user-mgmt-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 580px;
          max-height: 90vh;
          overflow-y: auto;
          padding: var(--space-6);
          position: relative;
          box-shadow: var(--shadow-xl);
          animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .modal-close-btn {
          position: absolute;
          top: var(--space-4);
          right: var(--space-4);
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .modal-close-btn:hover {
          color: var(--text-primary);
          background-color: var(--bg-muted);
        }

        .mgmt-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mgmt-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--accent-indigo);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .mgmt-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .mgmt-subtext {
          font-size: 0.82rem;
          color: var(--text-secondary);
        }

        .current-user-card {
          padding: var(--space-4);
          background-color: var(--bg-subtle);
          border: 1px solid var(--color-indigo-border);
        }

        .user-card-main-row {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .user-avatar-circle {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full);
          background-color: var(--accent-indigo);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .user-card-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
          flex: 1;
        }

        .user-name-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .user-card-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .user-card-meta {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .user-card-stats {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-top: 4px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .section-block {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .section-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .section-heading {
          font-size: 0.86rem;
          font-weight: 700;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .accounts-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .account-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background-color: var(--bg-surface);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .account-item-row:hover {
          border-color: var(--accent-indigo);
          background-color: var(--bg-subtle);
        }

        .account-item-active {
          border-color: var(--accent-indigo);
          background-color: var(--color-indigo-subtle);
        }

        .account-item-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .small-avatar {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-full);
          background-color: var(--primary-700);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .account-name-badge {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .account-name {
          font-size: 0.88rem;
          color: var(--text-primary);
        }

        .current-indicator {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--accent-indigo);
          background-color: var(--bg-surface);
          padding: 2px 6px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-indigo-border);
        }

        .account-item-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .icon-action-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          padding: 6px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color var(--transition-fast);
        }

        .icon-action-btn:hover {
          color: var(--color-danger);
        }

        .confirm-delete-group {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-3);
        }

        .mgmt-action-btn {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background-color: var(--bg-subtle);
          cursor: pointer;
          text-align: left;
          color: var(--text-primary);
          transition: all var(--transition-fast);
        }

        .mgmt-action-btn:hover {
          border-color: var(--accent-indigo);
          background-color: var(--bg-surface);
        }

        .action-text-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mgmt-confirm-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-danger-border);
          background-color: var(--color-danger-subtle);
        }

        .confirm-text-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .confirm-btns-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .mgmt-footer {
          display: flex;
          justify-content: flex-end;
          padding-top: var(--space-3);
          border-top: 1px solid var(--border-subtle);
        }

        @media (max-width: 540px) {
          .actions-grid {
            grid-template-columns: 1fr;
          }
          .user-card-stats {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};
