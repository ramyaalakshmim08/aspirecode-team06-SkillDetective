import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';
import { AuthService, AuthSession } from '../../services/authService';
import { soundFx } from '../../services/audioService';

interface LoginViewProps {
  onLoginSuccess: (session: AuthSession) => void;
  onNavigateToSignUp: () => void;
  onNavigateToForgotPassword: () => void;
  onExplorePreview?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigateToSignUp,
  onNavigateToForgotPassword,
  onExplorePreview
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const { session, error } = await AuthService.signIn(email, password);
      if (error) {
        setErrorMessage(error);
        soundFx.playError();
      } else if (session) {
        soundFx.playSuccess();
        onLoginSuccess(session);
      }
    } catch {
      setErrorMessage('A network error occurred. Please try again.');
      soundFx.playError();
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'new_student' | 'admin') => {
    setLoading(true);
    setErrorMessage(null);

    const demoEmail = role === 'admin' ? 'admin@skilldetective.edu' : 'student@skilldetective.edu';
    const demoPassword = 'password123';
    const demoName = role === 'admin' ? 'Dr. Evelyn Vance (Admin)' : 'New Student';

    // Ensure demo account exists in local storage
    const existing = await AuthService.signIn(demoEmail, demoPassword);
    if (existing.session) {
      soundFx.playSuccess();
      onLoginSuccess(existing.session);
      setLoading(false);
      return;
    }

    // Otherwise create it
    const created = await AuthService.signUp(demoEmail, demoPassword, demoName);
    if (created.session) {
      if (role === 'admin') {
        const { AdminService } = await import('../../services/adminService');
        AdminService.updateUserRole(created.session.user.id, 'admin');
        created.session.user.role = 'admin';
        created.session.profile.role = 'admin';
      }
      soundFx.playSuccess();
      onLoginSuccess(created.session);
    } else {
      setErrorMessage(created.error || 'Failed to initialize demo account.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-header">
          <div className="brand-logo-mark mb-3" style={{ margin: '0 auto' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
              <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="11" cy="11" r="2.5" fill="var(--accent-amber)" />
            </svg>
          </div>
          <h1 className="auth-title">Welcome to Skill Detective</h1>
          <p className="auth-subtitle">Sign in to your student or administrative assessment account</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="auth-error-alert" role="alert">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Academic Email</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                id="login-email"
                type="email"
                className="input-field"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label-row">
              <label className="form-label" htmlFor="login-password">Password</label>
              <button
                type="button"
                className="text-btn text-xs text-accent"
                onClick={onNavigateToForgotPassword}
              >
                Forgot password?
              </button>
            </div>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-2"
            disabled={loading}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials for Fast Evaluation */}
        <div className="demo-credentials-box">
          <div className="demo-credentials-header">
            <ShieldCheck size={14} className="text-accent" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Evaluation Quick Access</span>
          </div>
          <div className="demo-btns-grid">
            <button
              type="button"
              className="btn btn-secondary btn-xs"
              onClick={() => handleQuickLogin('new_student')}
              disabled={loading}
            >
              Sign in as Clean Student
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-xs"
              onClick={() => handleQuickLogin('admin')}
              disabled={loading}
            >
              Sign in as Admin
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="auth-footer">
          <p className="text-xs text-muted text-center">
            Don't have an account yet?{' '}
            <button
              type="button"
              className="font-bold text-accent hover:underline"
              onClick={onNavigateToSignUp}
            >
              Create free account
            </button>
          </p>

          {onExplorePreview && (
            <div className="text-center mt-3 pt-3 border-t border-subtle">
              <button
                type="button"
                className="text-xs text-muted hover:text-foreground"
                onClick={onExplorePreview}
              >
                ← Back to Product Overview
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .auth-page-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-4);
          background-color: var(--bg-canvas);
        }

        .auth-card {
          width: 100%;
          max-width: 440px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08);
        }

        .auth-header {
          text-align: center;
          margin-bottom: var(--space-6);
        }

        .auth-title {
          font-size: var(--text-2xl);
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          margin-bottom: var(--space-1);
        }

        .auth-subtitle {
          font-size: var(--text-sm);
          color: var(--text-muted);
        }

        .auth-error-alert {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background-color: #FEF2F2;
          border: 1px solid #FCA5A5;
          color: #DC2626;
          padding: var(--space-3);
          border-radius: var(--radius-md);
          font-size: var(--text-xs);
          margin-bottom: var(--space-4);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: var(--space-3);
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-field {
          width: 100%;
          padding: var(--space-2-5) var(--space-3) var(--space-2-5) var(--space-9);
          background-color: var(--bg-surface-raised);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          color: var(--text-primary);
          transition: border-color var(--transition-fast);
        }

        .input-field:focus {
          outline: none;
          border-color: var(--accent-indigo);
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.15);
        }

        .password-toggle-btn {
          position: absolute;
          right: var(--space-3);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .password-toggle-btn:hover {
          color: var(--text-primary);
        }

        .demo-credentials-box {
          margin-top: var(--space-6);
          padding: var(--space-3);
          background-color: var(--bg-surface-raised);
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-md);
        }

        .demo-credentials-header {
          display: flex;
          align-items: center;
          gap: var(--space-1-5);
          margin-bottom: var(--space-2);
        }

        .demo-btns-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-2);
        }

        .auth-footer {
          margin-top: var(--space-6);
          padding-top: var(--space-4);
          border-top: 1px solid var(--border-subtle);
        }
      `}</style>
    </div>
  );
};
