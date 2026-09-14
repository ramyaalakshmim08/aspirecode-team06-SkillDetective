import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  BookOpen, 
  Calendar, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { AuthModalMode, UserRole } from '../types/auth';
import { authService } from '../services/authService';
import { soundFx } from '../services/audioService';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: AuthModalMode;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<AuthModalMode>(initialMode);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup Form States
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [department, setDepartment] = useState('Computer Engineering');
  const [year, setYear] = useState('1st Year');
  const [role, setRole] = useState<UserRole>('student');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status & Feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const departmentOptions = [
    'Computer Engineering',
    'Data Science & AI',
    'Software Engineering',
    'Cybersecurity',
    'Information Systems',
    'Robotics & Automation',
    'Business & Technology Analytics',
    'Design & Human-Computer Interaction'
  ];

  const yearOptions = [
    '1st Year (Freshman)',
    '2nd Year (Sophomore)',
    '3rd Year (Junior)',
    'Final Year (Senior)',
    'Graduate / Master’s'
  ];

  const calculatePasswordStrength = (pass: string): { score: number; label: string; color: string } => {
    if (!pass) return { score: 0, label: 'None', color: 'var(--border-color)' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass) || /[A-Z]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: '#ef4444' };
    if (score === 2) return { score: 50, label: 'Fair', color: '#f59e0b' };
    if (score === 3) return { score: 75, label: 'Good', color: '#3b82f6' };
    return { score: 100, label: 'Strong', color: '#10b981' };
  };

  const passwordStrength = calculatePasswordStrength(signupPassword);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMessage('Please provide both email and password.');
      soundFx.playWarning();
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = authService.login({
        email: loginEmail,
        password: loginPassword,
        rememberMe
      });

      setIsSubmitting(false);

      if (result.success) {
        soundFx.playSuccess();
        onSuccess();
        onClose();
      } else {
        soundFx.playWarning();
        setErrorMessage(result.error || 'Failed to sign in.');
      }
    }, 250);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      soundFx.playWarning();
      return;
    }

    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setErrorMessage('Please enter a valid academic or personal email address.');
      soundFx.playWarning();
      return;
    }

    if (signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      soundFx.playWarning();
      return;
    }

    if (signupPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      soundFx.playWarning();
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please agree to the Academic Integrity Standards.');
      soundFx.playWarning();
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = authService.signup({
        name: name.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
        department,
        year,
        role
      });

      setIsSubmitting(false);

      if (result.success) {
        soundFx.playLevelUp();
        onSuccess();
        onClose();
      } else {
        soundFx.playWarning();
        setErrorMessage(result.error || 'Registration failed.');
      }
    }, 300);
  };

  const handleQuickDemoLogin = (email: string, pass: string) => {
    setErrorMessage(null);
    soundFx.playClick();
    const result = authService.login({ email, password: pass });
    if (result.success) {
      soundFx.playSuccess();
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="auth-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="auth-close-btn"
          onClick={onClose}
          aria-label="Close authentication dialog"
        >
          <X size={18} />
        </button>

        {/* Modal Brand Header */}
        <div className="auth-header">
          <div className="auth-brand-badge">
            <div className="badge-icon-box">
              <Sparkles size={16} />
            </div>
            <span>SKILL DETECTIVE PORTAL</span>
          </div>
          <h2 className="auth-title">
            {mode === 'login' ? 'Welcome Back' : 'Create Student Account'}
          </h2>
          <p className="auth-subtext">
            {mode === 'login'
              ? 'Sign in to access your persistent skill diagnostics, challenge streak, and career roadmap.'
              : 'Join the diagnostic platform. Track your cognitive strengths and build an empirical portfolio.'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="auth-tabs-row" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            className={`auth-tab-btn ${mode === 'login' ? 'auth-tab-active' : ''}`}
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
              soundFx.playClick();
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            className={`auth-tab-btn ${mode === 'signup' ? 'auth-tab-active' : ''}`}
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
              soundFx.playClick();
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="auth-error-banner" role="alert">
            <AlertCircle size={16} className="text-danger flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === 'login' && (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Academic or Personal Email
              </label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="e.g. alex.chen@university.edu"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="auth-input"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-row">
                <label className="form-label" htmlFor="login-password">
                  Password
                </label>
                <button
                  type="button"
                  className="text-link-btn text-xs"
                  onClick={() => alert('For this local build, you can use any existing account password: "password123", or switch accounts using the Demo accounts below.')}
                >
                  Forgot password?
                </button>
              </div>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  id="login-password"
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="auth-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-remember-row">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkbox-label text-xs">Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-full-width"
            >
              {isSubmitting ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Quick Demo Sign-ins */}
            <div className="demo-accounts-box">
              <div className="demo-title-row">
                <Zap size={13} className="text-amber" />
                <span className="text-xs text-muted font-bold">1-CLICK DEMO ACCOUNTS</span>
              </div>
              <div className="demo-btn-grid">
                <button
                  type="button"
                  className="demo-account-pill"
                  onClick={() => handleQuickDemoLogin('alex.chen@university.edu', 'password123')}
                >
                  <span className="demo-name">Alex Chen</span>
                  <span className="demo-tag">Level 4 • Data Science</span>
                </button>
                <button
                  type="button"
                  className="demo-account-pill"
                  onClick={() => handleQuickDemoLogin('jordan.taylor@university.edu', 'password123')}
                >
                  <span className="demo-name">Jordan Taylor</span>
                  <span className="demo-tag">Level 1 • Cadet</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* SIGN UP FORM */}
        {mode === 'signup' && (
          <form className="auth-form" onSubmit={handleSignupSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">
                Full Name
              </label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  id="signup-name"
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="auth-input"
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">
                Academic or Primary Email
              </label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  id="signup-email"
                  type="email"
                  required
                  placeholder="e.g. maya.lin@university.edu"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="auth-input"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-grid-dual">
              <div className="form-group">
                <label className="form-label" htmlFor="signup-dept">
                  Department / Major
                </label>
                <div className="input-with-icon">
                  <BookOpen size={16} className="input-icon" />
                  <select
                    id="signup-dept"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="auth-select"
                  >
                    {departmentOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signup-year">
                  Academic Year
                </label>
                <div className="input-with-icon">
                  <Calendar size={16} className="input-icon" />
                  <select
                    id="signup-year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="auth-select"
                  >
                    {yearOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-role">
                Account Role
              </label>
              <div className="role-selector-row">
                <button
                  type="button"
                  className={`role-choice-pill ${role === 'student' ? 'role-choice-active' : ''}`}
                  onClick={() => setRole('student')}
                >
                  <User size={14} />
                  <span>Student Learner</span>
                </button>
                <button
                  type="button"
                  className={`role-choice-pill ${role === 'educator' ? 'role-choice-active' : ''}`}
                  onClick={() => setRole('educator')}
                >
                  <ShieldCheck size={14} />
                  <span>Educator / Mentor</span>
                </button>
              </div>
            </div>

            <div className="form-grid-dual">
              <div className="form-group">
                <label className="form-label" htmlFor="signup-password">
                  Password
                </label>
                <div className="input-with-icon">
                  <Lock size={16} className="input-icon" />
                  <input
                    id="signup-password"
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 chars"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="auth-input"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                  >
                    {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signup-confirm">
                  Confirm Password
                </label>
                <div className="input-with-icon">
                  <Lock size={16} className="input-icon" />
                  <input
                    id="signup-confirm"
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-type password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="auth-input"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            {signupPassword && (
              <div className="strength-meter-container">
                <div className="strength-bar-bg">
                  <div
                    className="strength-bar-fill"
                    style={{
                      width: `${passwordStrength.score}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  />
                </div>
                <div className="strength-label-row">
                  <span className="text-xs text-muted">Password Strength:</span>
                  <span className="text-xs font-bold" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
              </div>
            )}

            <div className="auth-terms-row">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span className="checkbox-label text-xs">
                  I agree to the <strong>Honor Code</strong> and understand diagnostic results reflect real assessment data.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-full-width"
            >
              {isSubmitting ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Student Account</span>
                  <CheckCircle2 size={16} />
                </>
              )}
            </button>
          </form>
        )}

        <div className="auth-footer-prompt">
          {mode === 'login' ? (
            <p className="text-xs text-muted text-center">
              Don't have an account yet?{' '}
              <button
                type="button"
                className="text-link-btn font-bold text-accent"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                }}
              >
                Create one now
              </button>
            </p>
          ) : (
            <p className="text-xs text-muted text-center">
              Already have an account?{' '}
              <button
                type="button"
                className="text-link-btn font-bold text-accent"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>

      <style>{`
        .auth-modal-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(15, 23, 42, 0.72);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--space-4);
          overflow-y: auto;
          animation: fadeIn 0.2s ease-out;
        }

        .auth-modal-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 520px;
          padding: var(--space-6);
          position: relative;
          box-shadow: var(--shadow-xl);
          animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .auth-close-btn {
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

        .auth-close-btn:hover {
          color: var(--text-primary);
          background-color: var(--bg-muted);
        }

        .auth-header {
          text-align: center;
          margin-bottom: var(--space-4);
        }

        .auth-brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          background-color: var(--color-indigo-subtle);
          border: 1px solid var(--color-indigo-border);
          color: var(--accent-indigo);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          margin-bottom: var(--space-2);
        }

        .badge-icon-box {
          display: flex;
          align-items: center;
        }

        .auth-title {
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .auth-subtext {
          font-size: 0.84rem;
          color: var(--text-secondary);
          max-width: 420px;
          margin: 0 auto;
          line-height: 1.45;
        }

        .auth-tabs-row {
          display: flex;
          background-color: var(--bg-subtle);
          border-radius: var(--radius-lg);
          padding: 3px;
          border: 1px solid var(--border-color);
          margin-bottom: var(--space-4);
        }

        .auth-tab-btn {
          flex: 1;
          padding: 8px 12px;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-muted);
          border-radius: var(--radius-md);
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .auth-tab-active {
          background-color: var(--bg-surface);
          color: var(--primary-900);
          box-shadow: var(--shadow-sm);
        }

        .auth-error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background-color: var(--color-danger-subtle);
          border: 1px solid var(--color-danger-border);
          border-radius: var(--radius-md);
          color: var(--color-danger);
          font-size: 0.82rem;
          margin-bottom: var(--space-4);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-grid-dual {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-3);
        }

        .form-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .auth-input, .auth-select {
          width: 100%;
          padding: 10px 12px 10px 38px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background-color: var(--bg-surface);
          color: var(--text-primary);
          font-size: 0.88rem;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }

        .auth-input:focus, .auth-select:focus {
          border-color: var(--accent-indigo);
          outline: none;
          box-shadow: 0 0 0 3px var(--color-indigo-subtle);
        }

        .password-toggle-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
        }

        .password-toggle-btn:hover {
          color: var(--text-primary);
        }

        .role-selector-row {
          display: flex;
          gap: var(--space-2);
        }

        .role-choice-pill {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background-color: var(--bg-subtle);
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .role-choice-active {
          background-color: var(--color-indigo-subtle);
          border-color: var(--accent-indigo);
          color: var(--accent-indigo);
        }

        .auth-remember-row, .auth-terms-row {
          display: flex;
          align-items: center;
          padding: 2px 0;
        }

        .checkbox-container {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }

        .checkbox-container input {
          margin-top: 2px;
          accent-color: var(--accent-indigo);
        }

        .checkbox-label {
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .btn-full-width {
          width: 100%;
          justify-content: center;
          padding: 11px;
          font-weight: 700;
          margin-top: 4px;
        }

        .strength-meter-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 2px 0;
        }

        .strength-bar-bg {
          height: 4px;
          background-color: var(--bg-muted);
          border-radius: 2px;
          overflow: hidden;
        }

        .strength-bar-fill {
          height: 100%;
          transition: width 0.25s ease, background-color 0.25s ease;
        }

        .strength-label-row {
          display: flex;
          justify-content: space-between;
        }

        .demo-accounts-box {
          margin-top: var(--space-3);
          padding-top: var(--space-3);
          border-top: 1px dashed var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .demo-title-row {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .demo-btn-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .demo-account-pill {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 8px 10px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background-color: var(--bg-subtle);
          cursor: pointer;
          text-align: left;
          transition: all var(--transition-fast);
        }

        .demo-account-pill:hover {
          border-color: var(--accent-indigo);
          background-color: var(--color-indigo-subtle);
        }

        .demo-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .demo-tag {
          font-size: 0.68rem;
          color: var(--text-muted);
        }

        .auth-footer-prompt {
          margin-top: var(--space-4);
          padding-top: var(--space-3);
          border-top: 1px solid var(--border-subtle);
        }

        .text-link-btn {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          color: var(--accent-indigo);
          text-decoration: underline;
        }

        @media (max-width: 520px) {
          .form-grid-dual {
            grid-template-columns: 1fr;
          }
          .demo-btn-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
