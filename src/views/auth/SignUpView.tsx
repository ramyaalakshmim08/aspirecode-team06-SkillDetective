import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthService, AuthSession } from '../../services/authService';
import { soundFx } from '../../services/audioService';

interface SignUpViewProps {
  onSignUpSuccess: (session: AuthSession) => void;
  onNavigateToLogin: () => void;
  onExplorePreview?: () => void;
}

export const SignUpView: React.FC<SignUpViewProps> = ({
  onSignUpSuccess,
  onNavigateToLogin,
  onExplorePreview
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter your academic or professional email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify and retype.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('Please accept the Academic Assessment Honor Code to continue.');
      return;
    }

    setLoading(true);
    try {
      const { session, error } = await AuthService.signUp(email, password, fullName);
      if (error) {
        setErrorMessage(error);
        soundFx.playError();
      } else if (session) {
        soundFx.playSuccess();
        onSignUpSuccess(session);
      }
    } catch {
      setErrorMessage('An unexpected connection error occurred during registration.');
      soundFx.playError();
    } finally {
      setLoading(false);
    }
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
          <h1 className="auth-title">Create Student Account</h1>
          <p className="auth-subtitle">Begin your empirical skill diagnostic and career discovery journey</p>
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
            <label className="form-label" htmlFor="signup-name">Full Name</label>
            <div className="input-with-icon">
              <User size={16} className="input-icon" />
              <input
                id="signup-name"
                type="text"
                className="input-field"
                placeholder="Alex Morgan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">Academic Email</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                id="signup-email"
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
            <label className="form-label" htmlFor="signup-password">Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
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

          <div className="form-group">
            <label className="form-label" htmlFor="signup-confirm-password">Confirm Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                id="signup-confirm-password"
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          {/* Honor Code & Terms */}
          <div className="form-check flex items-start gap-2 mt-1">
            <input
              id="terms-check"
              type="checkbox"
              className="mt-1"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label htmlFor="terms-check" className="text-xs text-muted leading-tight cursor-pointer">
              I agree to the Academic Assessment Honor Code, verifying that interactive challenge submissions reflect my independent work.
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-2"
            disabled={loading}
          >
            {loading ? (
              <span>Creating Clean Account...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="auth-footer">
          <p className="text-xs text-muted text-center">
            Already have an account?{' '}
            <button
              type="button"
              className="font-bold text-accent hover:underline"
              onClick={onNavigateToLogin}
            >
              Sign in
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
    </div>
  );
};
