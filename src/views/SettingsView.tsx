import React, { useState } from 'react';
import { 
  Clock, 
  Eye, 
  Bell, 
  Moon, 
  Sun, 
  CheckCircle2
} from 'lucide-react';
import { soundFx } from '../services/audioService';

export const SettingsView: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(soundFx.isEnabled());
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleSound = (val: boolean) => {
    setSoundEnabled(val);
    soundFx.setEnabled(val);
    if (val) soundFx.playClick();
    showToast(val ? 'Sound feedback enabled' : 'Sound feedback muted');
  };

  const handleToggleTheme = (mode: 'light' | 'dark') => {
    setThemeMode(mode);
    document.documentElement.setAttribute('data-theme', mode);
    soundFx.playClick();
    showToast(`Switched to ${mode === 'dark' ? 'Slate Dark' : 'Academic Light'} theme`);
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div>
        <h2 className="page-heading">Settings & Preferences</h2>
        <p className="page-subtitle">Configure diagnostic interaction defaults, accessibility preferences, and audio telemetry.</p>
      </div>

      {toastMessage && (
        <div className="settings-toast">
          <CheckCircle2 size={16} className="text-success flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Challenge Preferences */}
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
                checked={timerEnabled} 
                onChange={(e) => {
                  setTimerEnabled(e.target.checked);
                  soundFx.playClick();
                  showToast(e.target.checked ? 'Timer enabled' : 'Untimed mode enabled');
                }} 
              />
              <span className="slider-round" />
            </label>
          </div>

          <div className="settings-row">
            <div className="setting-info-col">
              <strong className="setting-title">Audio Micro-Interactions</strong>
              <p className="setting-desc text-xs text-muted">Play gentle acoustic feedback notes on correct answers and milestones (Web Audio API).</p>
            </div>
            <label className="switch-toggle">
              <input 
                type="checkbox" 
                checked={soundEnabled} 
                onChange={(e) => handleToggleSound(e.target.checked)} 
              />
              <span className="slider-round" />
            </label>
          </div>
        </div>
      </div>

      {/* Accessibility & Visual Controls */}
      <div className="card settings-section-card">
        <div className="settings-section-header">
          <Eye size={18} className="text-accent flex-shrink-0" />
          <div>
            <h3 className="settings-section-title">Accessibility & Display</h3>
            <p className="text-xs text-muted">Ensure high readability, reduced motion, and visual clarity.</p>
          </div>
        </div>

        <div className="settings-options-list">
          <div className="settings-row">
            <div className="setting-info-col">
              <strong className="setting-title">Reduce Animations</strong>
              <p className="setting-desc text-xs text-muted">Suppresses progress bar sweeps and micro-transitions for motion sensitivity.</p>
            </div>
            <label className="switch-toggle">
              <input 
                type="checkbox" 
                checked={reducedMotion} 
                onChange={(e) => {
                  setReducedMotion(e.target.checked);
                  soundFx.playClick();
                  showToast(e.target.checked ? 'Reduced motion enabled' : 'Normal motion enabled');
                }} 
              />
              <span className="slider-round" />
            </label>
          </div>

          <div className="settings-row">
            <div className="setting-info-col">
              <strong className="setting-title">Theme Palette</strong>
              <p className="setting-desc text-xs text-muted">Choose between crisp academic light mode and high-contrast dark slate.</p>
            </div>
            <div className="theme-toggle-group">
              <button
                type="button"
                className={`theme-btn ${themeMode === 'light' ? 'theme-btn-active' : ''}`}
                onClick={() => handleToggleTheme('light')}
              >
                <Sun size={14} />
                <span>Light</span>
              </button>
              <button
                type="button"
                className={`theme-btn ${themeMode === 'dark' ? 'theme-btn-active' : ''}`}
                onClick={() => handleToggleTheme('dark')}
              >
                <Moon size={14} />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications & Consistency */}
      <div className="card settings-section-card">
        <div className="settings-section-header">
          <Bell size={18} className="text-accent flex-shrink-0" />
          <div>
            <h3 className="settings-section-title">Notifications & Streaks</h3>
            <p className="text-xs text-muted">Maintain your daily habit loop without spam or fake urgency.</p>
          </div>
        </div>

        <div className="settings-options-list">
          <div className="settings-row">
            <div className="setting-info-col">
              <strong className="setting-title">Daily Streak Reminder</strong>
              <p className="setting-desc text-xs text-muted">A polite daily ping at 6:00 PM if your daily challenge remains unsolved.</p>
            </div>
            <label className="switch-toggle">
              <input 
                type="checkbox" 
                checked={dailyReminders} 
                onChange={(e) => {
                  setDailyReminders(e.target.checked);
                  soundFx.playClick();
                  showToast(e.target.checked ? 'Daily reminders enabled' : 'Daily reminders disabled');
                }} 
              />
              <span className="slider-round" />
            </label>
          </div>
        </div>
      </div>

      <style>{`
        .settings-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          width: 100%;
        }

        .settings-toast {
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

        .settings-section-card {
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .settings-section-header {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: var(--space-2);
        }

        .settings-section-title {
          font-size: 1.0rem;
          color: var(--primary-900);
        }

        .settings-options-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .settings-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          gap: var(--space-3);
        }

        .setting-info-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .setting-title {
          font-size: 0.88rem;
          color: var(--text-primary);
        }

        .setting-desc {
          margin-top: 1px;
        }

        /* Clean switch toggle */
        .switch-toggle {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
          flex-shrink: 0;
        }

        .switch-toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider-round {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background-color: var(--bg-muted);
          border-radius: 34px;
          transition: background-color var(--transition-fast);
        }

        .slider-round:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          border-radius: 50%;
          transition: transform var(--transition-fast);
        }

        input:checked + .slider-round {
          background-color: var(--accent-indigo);
        }

        input:checked + .slider-round:before {
          transform: translateX(20px);
        }

        .theme-toggle-group {
          display: flex;
          background-color: var(--bg-subtle);
          border-radius: var(--radius-md);
          padding: 2px;
          border: 1px solid var(--border-color);
          flex-shrink: 0;
        }

        .theme-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .theme-btn-active {
          background-color: var(--bg-surface);
          color: var(--primary-800);
          box-shadow: var(--shadow-xs);
        }

        @media (max-width: 500px) {
          .settings-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .switch-toggle, .theme-toggle-group {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
};
