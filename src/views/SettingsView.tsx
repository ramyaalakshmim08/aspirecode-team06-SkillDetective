import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Eye, 
  Bell, 
  Moon, 
  Sun, 
  CheckCircle2,
  Volume2,
  VolumeX,
  Shield,
  Share2
} from 'lucide-react';
import { soundFx } from '../services/audioService';
import { StorageAdapter } from '../services/storageAdapter';
import { UserSettings } from '../types';

interface SettingsViewProps {
  userId?: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ userId }) => {
  const [settings, setSettings] = useState<UserSettings>({
    soundEnabled: soundFx.isEnabled(),
    timerEnabled: true,
    reducedMotion: false,
    dailyReminders: true,
    themeMode: 'light',
    publicProfile: false,
    showAchievements: true,
    showSkills: true,
    showCareers: true
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      const saved = StorageAdapter.getUserSettings(userId);
      setSettings(saved);
      soundFx.setEnabled(saved.soundEnabled);
      document.documentElement.setAttribute('data-theme', saved.themeMode);
    }
  }, [userId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const updateSetting = <K extends keyof UserSettings>(key: K, val: UserSettings[K]) => {
    const updated = { ...settings, [key]: val };
    setSettings(updated);

    if (userId) {
      StorageAdapter.saveUserSettings(userId, updated);
    }

    if (key === 'soundEnabled') {
      soundFx.setEnabled(val as boolean);
      if (val) soundFx.playClick();
      showToast(val ? 'Sound feedback enabled' : 'Sound feedback muted');
    } else if (key === 'themeMode') {
      document.documentElement.setAttribute('data-theme', val as string);
      soundFx.playClick();
      showToast(`Switched to ${val === 'dark' ? 'Slate Dark' : 'Academic Light'} theme`);
    } else {
      soundFx.playClick();
      showToast('Preference saved to database.');
    }
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div>
        <h2 className="page-heading">Settings & Preferences</h2>
        <p className="page-subtitle">Configure diagnostic interaction defaults, accessibility preferences, audio feedback, and privacy.</p>
      </div>

      {toastMessage && (
        <div className="settings-toast fixed top-20 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-xs shadow-xl">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Challenge Preferences */}
      <div className="card settings-section-card">
        <div className="settings-section-header">
          <Clock size={18} className="text-accent flex-shrink-0" />
          <div>
            <h3 className="settings-section-title">Challenge & Diagnostic Rules</h3>
            <p className="text-xs text-muted">Controls timing pressure and feedback behavior during active evaluations.</p>
          </div>
        </div>

        <div className="settings-options-list">
          <div className="settings-row">
            <div className="setting-info-col">
              <strong className="setting-title">Enforce Challenge Countdown Timer</strong>
              <p className="setting-desc text-xs text-muted">Displays live countdown clock during timed problem-solving exercises.</p>
            </div>
            <label className="switch-toggle">
              <input
                type="checkbox"
                checked={settings.timerEnabled}
                onChange={(e) => updateSetting('timerEnabled', e.target.checked)}
              />
              <span className="slider-round" />
            </label>
          </div>

          <div className="settings-row">
            <div className="setting-info-col">
              <strong className="setting-title">Web Audio API Sound Effects</strong>
              <p className="setting-desc text-xs text-muted">Synthesized micro-interaction audio tones on selection, correct answers, and errors.</p>
            </div>
            <label className="switch-toggle">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
              />
              <span className="slider-round" />
            </label>
          </div>
        </div>
      </div>

      {/* 2. Appearance & Visual Accessibility */}
      <div className="card settings-section-card">
        <div className="settings-section-header">
          <Eye size={18} className="text-accent flex-shrink-0" />
          <div>
            <h3 className="settings-section-title">Visual & Accessibility</h3>
            <p className="text-xs text-muted">Tailor visual contrast and animation physics.</p>
          </div>
        </div>

        <div className="settings-options-list">
          <div className="settings-row">
            <div className="setting-info-col">
              <strong className="setting-title">Theme Mode</strong>
              <p className="setting-desc text-xs text-muted">Select your preferred academic interface theme.</p>
            </div>
            <div className="theme-toggle-group flex gap-2">
              <button
                type="button"
                className={`btn btn-xs ${settings.themeMode === 'light' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => updateSetting('themeMode', 'light')}
              >
                <Sun size={13} />
                <span>Academic Light</span>
              </button>
              <button
                type="button"
                className={`btn btn-xs ${settings.themeMode === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => updateSetting('themeMode', 'dark')}
              >
                <Moon size={13} />
                <span>Slate Dark</span>
              </button>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-info-col">
              <strong className="setting-title">Reduced Motion</strong>
              <p className="setting-desc text-xs text-muted">Minimizes modal transitions, drawer slide animations, and radar sweeps.</p>
            </div>
            <label className="switch-toggle">
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
              />
              <span className="slider-round" />
            </label>
          </div>
        </div>
      </div>

      {/* 3. Privacy & Public Profile */}
      <div className="card settings-section-card">
        <div className="settings-section-header">
          <Shield size={18} className="text-accent flex-shrink-0" />
          <div>
            <h3 className="settings-section-title">Privacy & Public Showcase</h3>
            <p className="text-xs text-muted">Configure who can view your verified diagnostic results.</p>
          </div>
        </div>

        <div className="settings-options-list">
          <div className="settings-row">
            <div className="setting-info-col">
              <strong className="setting-title">Public Student Showcase Profile</strong>
              <p className="setting-desc text-xs text-muted">Enables a shareable public URL showing verified scores and milestone badges.</p>
            </div>
            <label className="switch-toggle">
              <input
                type="checkbox"
                checked={settings.publicProfile}
                onChange={(e) => updateSetting('publicProfile', e.target.checked)}
              />
              <span className="slider-round" />
            </label>
          </div>

          <div className="settings-row">
            <div className="setting-info-col">
              <strong className="setting-title">Display Competency Scores on Public Profile</strong>
              <p className="setting-desc text-xs text-muted">Allows verified numerical scores to be visible on your public transcript.</p>
            </div>
            <label className="switch-toggle">
              <input
                type="checkbox"
                checked={settings.showSkills}
                onChange={(e) => updateSetting('showSkills', e.target.checked)}
                disabled={!settings.publicProfile}
              />
              <span className="slider-round" />
            </label>
          </div>

          <div className="settings-row">
            <div className="setting-info-col">
              <strong className="setting-title">Display Milestone Badges</strong>
              <p className="setting-desc text-xs text-muted">Showcase earned achievement badges to prospective employers or mentors.</p>
            </div>
            <label className="switch-toggle">
              <input
                type="checkbox"
                checked={settings.showAchievements}
                onChange={(e) => updateSetting('showAchievements', e.target.checked)}
                disabled={!settings.publicProfile}
              />
              <span className="slider-round" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
