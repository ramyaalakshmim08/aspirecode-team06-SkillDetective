import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Target, 
  Briefcase, 
  BarChart2, 
  ShieldAlert, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Save, 
  X, 
  AlertCircle 
} from 'lucide-react';
import { AdminService, AdminUserView } from '../services/adminService';
import { AdminStats, InteractiveChallenge, CareerMatch, ChallengeDifficulty } from '../types';
import { StorageAdapter } from '../services/storageAdapter';
import { soundFx } from '../services/audioService';

export const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'challenges' | 'careers'>('analytics');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUserView[]>([]);
  const [challenges, setChallenges] = useState<InteractiveChallenge[]>([]);
  const [careers, setCareers] = useState<CareerMatch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Challenge modal state
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<InteractiveChallenge | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const loadData = () => {
    setStats(AdminService.getStats());
    setUsers(AdminService.getUsers());
    setChallenges(StorageAdapter.getChallengesCatalog());
    setCareers(StorageAdapter.getCareersCatalog());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleToggle = (user: AdminUserView) => {
    const nextRole = user.role === 'admin' ? 'student' : 'admin';
    AdminService.updateUserRole(user.id, nextRole);
    soundFx.playClick();
    showNotification(`Updated ${user.fullName} role to ${nextRole.toUpperCase()}`);
    loadData();
  };

  const handleDeleteChallenge = (challengeId: string) => {
    if (confirm('Are you sure you want to delete this challenge from the catalog?')) {
      AdminService.deleteChallenge(challengeId);
      soundFx.playClick();
      showNotification('Challenge removed from catalog.');
      loadData();
    }
  };

  const handleSaveChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChallenge) return;

    AdminService.saveChallenge(editingChallenge);
    soundFx.playSuccess();
    showNotification(`Challenge "${editingChallenge.title}" saved.`);
    setIsChallengeModalOpen(false);
    setEditingChallenge(null);
    loadData();
  };

  const filteredUsers = users.filter((u) =>
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-page p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Administrative Control Center</h1>
            <span className="badge badge-accent text-xs uppercase font-mono">RBAC Root</span>
          </div>
          <p className="text-sm text-muted">
            Platform governance, user credentials, assessment catalog curation, and system analytics.
          </p>
        </div>

        {notification && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-md text-xs">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex gap-2 border-b border-subtle mb-6 pb-2">
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart2 size={16} />
          <span>System Analytics</span>
        </button>

        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={16} />
          <span>User Management ({users.length})</span>
        </button>

        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'challenges' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('challenges')}
        >
          <Target size={16} />
          <span>Challenge Catalog ({challenges.length})</span>
        </button>

        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'careers' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('careers')}
        >
          <Briefcase size={16} />
          <span>Career Benchmarks ({careers.length})</span>
        </button>
      </div>

      {/* Tab 1: System Analytics */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-4">
              <span className="text-xs text-muted font-bold uppercase">Total Accounts</span>
              <p className="text-3xl font-extrabold font-mono mt-1 text-foreground">{stats.totalUsers}</p>
              <span className="text-xs text-emerald-600 font-semibold">Active: {stats.activeUsers} students</span>
            </div>

            <div className="card p-4">
              <span className="text-xs text-muted font-bold uppercase">Completed Evaluations</span>
              <p className="text-3xl font-extrabold font-mono mt-1 text-foreground">{stats.challengesCompleted}</p>
              <span className="text-xs text-muted">Across 5 diagnostic modes</span>
            </div>

            <div className="card p-4">
              <span className="text-xs text-muted font-bold uppercase">Average Diagnostic Score</span>
              <p className="text-3xl font-extrabold font-mono mt-1 text-foreground">
                {stats.averageScore > 0 ? `${stats.averageScore}%` : 'Uncalibrated'}
              </p>
              <span className="text-xs text-muted">Verified empirical baseline</span>
            </div>

            <div className="card p-4">
              <span className="text-xs text-muted font-bold uppercase">Diagnostic Completion Rate</span>
              <p className="text-3xl font-extrabold font-mono mt-1 text-foreground">{stats.completionRate}%</p>
              <span className="text-xs text-muted">Submitted without drop-off</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-5">
              <h3 className="text-sm font-bold uppercase text-foreground mb-4">Top Assessed Competencies</h3>
              <div className="space-y-3">
                {stats.topSkills.map((item) => (
                  <div key={item.skill} className="flex justify-between items-center text-sm">
                    <span className="text-muted">{item.skill}</span>
                    <span className="font-mono font-bold">{item.avgScore > 0 ? `${item.avgScore}%` : 'Pending'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="text-sm font-bold uppercase text-foreground mb-4">Most Bookmarked Careers</h3>
              <div className="space-y-3">
                {stats.popularCareers.map((item) => (
                  <div key={item.career} className="flex justify-between items-center text-sm">
                    <span className="text-muted">{item.career}</span>
                    <span className="badge badge-secondary text-xs">{item.saveCount} saves</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Management */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-4">
            <div className="input-with-icon max-w-sm w-full">
              <Search size={16} className="input-icon" />
              <input
                type="text"
                className="input-field"
                placeholder="Search students by name, email, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="card overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-subtle bg-surface-raised text-xs uppercase text-muted font-bold">
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Level / XP</th>
                  <th className="p-3">Completed Tests</th>
                  <th className="p-3">Streak</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-muted">
                      No users found matching your search query.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-subtle hover:bg-surface-raised/50">
                      <td className="p-3 font-semibold text-foreground">{u.fullName}</td>
                      <td className="p-3 text-muted font-mono text-xs">{u.email}</td>
                      <td className="p-3">
                        <span className={`badge text-xs uppercase ${u.role === 'admin' ? 'badge-accent' : 'badge-secondary'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 font-mono">Lvl {u.level} ({u.xp} XP)</td>
                      <td className="p-3 font-mono">{u.challengesCompletedCount}</td>
                      <td className="p-3 font-mono">{u.streakDays}d</td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          className="btn btn-secondary btn-xs"
                          onClick={() => handleRoleToggle(u)}
                        >
                          {u.role === 'admin' ? 'Demote to Student' : 'Promote to Admin'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Challenge Catalog Management */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted">Curate and publish diagnostic challenges.</p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setEditingChallenge({
                  id: `custom-${Date.now()}`,
                  title: 'New Diagnostic Challenge',
                  category: 'logical',
                  categoryLabel: 'Logical Reasoning',
                  difficulty: 'Medium',
                  estimatedMinutes: 5,
                  xpReward: 50,
                  status: 'Available',
                  type: 'logic',
                  instructions: 'Diagnostic instructions...',
                  isPublished: true
                });
                setIsChallengeModalOpen(true);
              }}
            >
              <Plus size={16} />
              <span>Create Challenge</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((ch) => (
              <div key={ch.id} className="card p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="badge badge-secondary text-xs uppercase">{ch.category}</span>
                    <span className={`badge text-xs ${ch.difficulty === 'Hard' ? 'badge-accent' : 'badge-neutral'}`}>
                      {ch.difficulty}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-foreground mb-1">{ch.title}</h4>
                  <p className="text-xs text-muted mb-3">{ch.instructions || 'No special instructions.'}</p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-subtle">
                  <span className="text-xs font-mono font-bold text-accent">+{ch.xpReward} XP</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="btn btn-secondary btn-xs"
                      onClick={() => {
                        setEditingChallenge({ ...ch });
                        setIsChallengeModalOpen(true);
                      }}
                    >
                      <Edit2 size={12} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-xs text-danger"
                      onClick={() => handleDeleteChallenge(ch.id)}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Career Benchmarks */}
      {activeTab === 'careers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {careers.map((c) => (
            <div key={c.id} className="card p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-base text-foreground">{c.title}</h3>
                  <span className="text-xs text-muted font-mono">{c.salaryRange} • {c.demandGrowth}</span>
                </div>
              </div>
              <p className="text-xs text-muted mb-4">{c.description}</p>
              <div>
                <span className="text-xs font-bold uppercase text-muted block mb-2">Required Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {c.skillsRequired.map((s) => (
                    <span key={s} className="badge badge-secondary text-xs">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Edit / Create Challenge */}
      {isChallengeModalOpen && editingChallenge && (
        <div className="modal-backdrop fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="modal-card bg-surface border border-border rounded-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-foreground">
                {editingChallenge.id.startsWith('custom-') ? 'Create New Challenge' : 'Edit Challenge'}
              </h3>
              <button
                type="button"
                className="text-muted hover:text-foreground"
                onClick={() => setIsChallengeModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveChallenge} className="space-y-4">
              <div>
                <label className="form-label text-xs">Title</label>
                <input
                  type="text"
                  className="input-field text-sm"
                  value={editingChallenge.title}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-xs">Difficulty</label>
                  <select
                    className="input-field text-sm"
                    value={editingChallenge.difficulty}
                    onChange={(e) => setEditingChallenge({ ...editingChallenge, difficulty: e.target.value as ChallengeDifficulty })}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="form-label text-xs">XP Reward</label>
                  <input
                    type="number"
                    className="input-field text-sm"
                    value={editingChallenge.xpReward}
                    onChange={(e) => setEditingChallenge({ ...editingChallenge, xpReward: Number(e.target.value) })}
                    min={10}
                    max={500}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-xs">Instructions</label>
                <textarea
                  className="input-field text-sm h-24"
                  value={editingChallenge.instructions || ''}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, instructions: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-subtle">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsChallengeModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Save size={14} />
                  <span>Save Challenge</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
