import React, { useState } from 'react';
import { Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthService } from '../../services/authService';
import { soundFx } from '../../services/audioService';

interface ForgotPasswordViewProps {
  onNavigateToLogin: () => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onNavigateToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    try {
      const { success, message } = await AuthService.resetPassword(email);
      if (success) {
        soundFx.playSuccess();
        setSuccessMessage(message);
      } else {
        soundFx.playError();
        setErrorMessage(message);
      }
    } catch {
      soundFx.playError();
      setErrorMessage('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-logo-mark mb-3" style={{ margin: '0 auto' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
              <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="11" cy="11" r="2.5" fill="var(--accent-amber)" />
            </svg>
          </div>
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">Enter your academic email to receive a recovery link</p>
        </div>

        {errorMessage && (
          <div className="auth-error-alert" role="alert">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="flex-shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="reset-email">Registered Email</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                id="reset-email"
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

          <button
            type="submit"
            className="btn btn-primary w-full mt-2"
            disabled={loading}
          >
            {loading ? <span>Processing...</span> : <span>Send Reset Instructions</span>}
          </button>
        </form>

        <div className="auth-footer text-center">
          <button
            type="button"
            className="text-xs text-muted hover:text-foreground"
            onClick={onNavigateToLogin}
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
