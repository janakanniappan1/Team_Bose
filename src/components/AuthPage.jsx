import React, { useState } from 'react';
import {
  GraduationCap,
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  UserPlus,
  LogIn,
  AlertCircle,
  CheckCircle,
  KeyRound
} from 'lucide-react';
import { authService } from '../services/authService';

export default function AuthPage({ onLoginSuccess, onGoToRegister }) {
  // Tab: 'login' | 'signup' | 'forgot'
  const [activeTab, setActiveTab] = useState('login');

  // ── Login State ──────────────────────────────────────────────
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginAlert, setLoginAlert] = useState(null); // { type: 'error'|'success', message }

  // ── Signup State ─────────────────────────────────────────────
  const [signupData, setSignupData] = useState({ fullName: '', username: '', password: '', confirmPassword: '' });
  const [signupErrors, setSignupErrors] = useState({});
  const [signupAlert, setSignupAlert] = useState(null);

  // ── Forgot Password State ────────────────────────────────────
  const [forgotStep, setForgotStep] = useState(1); // 1 = verify username, 2 = new password
  const [forgotUsername, setForgotUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotAlert, setForgotAlert] = useState(null);

  // ── Shared ───────────────────────────────────────────────────
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ─────────────────────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────────────────────
  const validateLogin = () => {
    const errs = {};
    if (!loginData.username.trim()) errs.username = 'Username is required';
    if (!loginData.password) errs.password = 'Password is required';
    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginAlert(null);
    if (!validateLogin()) return;

    setIsLoading(true);
    const { data, error } = await authService.login(
      loginData.username.trim(),
      loginData.password
    );
    setIsLoading(false);

    if (error) {
      setLoginAlert({ type: 'error', message: error });
    } else {
      authService.saveSession(data);
      setLoginAlert({ type: 'success', message: `Welcome back, ${data.username}! Signing you in...` });
      setTimeout(() => onLoginSuccess(data), 800);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    const { data } = await authService.guestLogin();
    setIsLoading(false);
    onLoginSuccess(data);
  };

  // ─────────────────────────────────────────────────────────────
  // SIGN UP
  // ─────────────────────────────────────────────────────────────
  const validateSignup = () => {
    const errs = {};
    if (!signupData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!signupData.username.trim()) errs.username = 'Username is required';
    if (!signupData.password) errs.password = 'Password is required';
    else if (signupData.password.length < 6) errs.password = 'Minimum 6 characters';
    if (!signupData.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (signupData.password !== signupData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setSignupErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupAlert(null);
    if (!validateSignup()) return;

    setIsLoading(true);
    const { data, error } = await authService.signUp(
      signupData.username.trim(),
      signupData.password,
      signupData.fullName.trim()
    );
    setIsLoading(false);

    if (error) {
      setSignupAlert({ type: 'error', message: error });
    } else {
      setSignupAlert({ type: 'success', message: 'Account created! Redirecting to login...' });
      setTimeout(() => {
        setActiveTab('login');
        setSignupData({ fullName: '', username: '', password: '', confirmPassword: '' });
        setSignupAlert(null);
      }, 1200);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // FORGOT PASSWORD
  // ─────────────────────────────────────────────────────────────
  const handleForgotStep1 = async (e) => {
    e.preventDefault();
    setForgotAlert(null);
    if (!forgotUsername.trim()) {
      setForgotAlert({ type: 'error', message: 'Please enter your username.' });
      return;
    }
    setIsLoading(true);
    const { data, error } = await authService.forgotPassword(forgotUsername.trim());
    setIsLoading(false);
    if (error) {
      setForgotAlert({ type: 'error', message: error });
    } else {
      setForgotAlert({ type: 'success', message: 'Username found! Set your new password below.' });
      setForgotStep(2);
    }
  };

  const handleForgotStep2 = async (e) => {
    e.preventDefault();
    setForgotAlert(null);
    if (!newPassword || newPassword.length < 6) {
      setForgotAlert({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setForgotAlert({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    setIsLoading(true);
    const { data, error } = await authService.updatePassword(forgotUsername.trim(), newPassword);
    setIsLoading(false);
    if (error) {
      setForgotAlert({ type: 'error', message: error });
    } else {
      setForgotAlert({ type: 'success', message: 'Password updated successfully! You can now log in.' });
      setTimeout(() => {
        setActiveTab('login');
        setForgotStep(1);
        setForgotUsername('');
        setNewPassword('');
        setConfirmNewPassword('');
        setForgotAlert(null);
      }, 1400);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Helper: inline alert component
  // ─────────────────────────────────────────────────────────────
  const InlineAlert = ({ alert }) => {
    if (!alert) return null;
    const isError = alert.type === 'error';
    return (
      <div className={`auth-inline-alert ${isError ? 'auth-alert-error' : 'auth-alert-success'}`}>
        {isError ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
        <span>{alert.message}</span>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────
  // Helper: field error
  // ─────────────────────────────────────────────────────────────
  const FieldError = ({ msg }) =>
    msg ? <p className="auth-field-error">{msg}</p> : null;

  return (
    <div className="auth-page-container">
      <div className="auth-split-wrapper">

        {/* ── Left Panel: Branding ── */}
        <div className="auth-left-panel">
          <div className="left-panel-content animate-slide-up">
            <div className="auth-brand-badge">
              <GraduationCap size={24} color="#FFFFFF" />
              <span>Campus Verified Marketplace</span>
            </div>

            <h1 className="auth-hero-title">
              Buy. Sell.<br />
              <span className="text-gradient">Connect.</span>
            </h1>

            <p className="auth-hero-subtitle">
              The trusted marketplace exclusively for your college community. Trade books, calculators, hostel gear, and cycles safely with fellow students &amp; faculty.
            </p>

            <div className="auth-illustration-box">
              <div className="illustration-card card-1 animate-float">
                <ShoppingBag size={28} className="text-primary" />
                <div>
                  <strong>Casio Calculator</strong>
                  <span>₹950 • CS Dept</span>
                </div>
              </div>

              <div className="illustration-card card-2 animate-float-delayed">
                <Sparkles size={28} className="text-secondary" />
                <div>
                  <strong>Verified Student</strong>
                  <span>Hostel Handover</span>
                </div>
              </div>

              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
                alt="Students on Campus Trading"
                className="auth-hero-image"
              />
            </div>

            <div className="auth-features-pills">
              <span><ShieldCheck size={16} /> Campus Email Authentication</span>
              <span>⚡ Instant Chat &amp; Deal Negotiator</span>
            </div>
          </div>
        </div>

        {/* ── Right Panel: Auth Card ── */}
        <div className="auth-right-panel">
          <div className="auth-card card glass-panel animate-slide-up">

            <div className="auth-header">
              <div className="auth-logo-badge">
                <GraduationCap size={28} className="text-primary" />
              </div>
              {activeTab === 'login' && (
                <>
                  <h2 className="auth-title">Welcome Back</h2>
                  <p className="auth-desc">Sign in to your UniSwap campus account</p>
                </>
              )}
              {activeTab === 'signup' && (
                <>
                  <h2 className="auth-title">Create Account</h2>
                  <p className="auth-desc">Join the UniSwap campus marketplace</p>
                </>
              )}
              {activeTab === 'forgot' && (
                <>
                  <h2 className="auth-title">Reset Password</h2>
                  <p className="auth-desc">
                    {forgotStep === 1 ? 'Enter your username to verify your account' : 'Set a new password for your account'}
                  </p>
                </>
              )}
            </div>

            {/* ── Tab Switcher (Login / Sign Up) ── */}
            {activeTab !== 'forgot' && (
              <div className="auth-tab-switcher">
                <button
                  type="button"
                  className={`auth-tab-btn ${activeTab === 'login' ? 'auth-tab-active' : ''}`}
                  onClick={() => { setActiveTab('login'); setLoginAlert(null); }}
                >
                  <LogIn size={16} /> Sign In
                </button>
                <button
                  type="button"
                  className={`auth-tab-btn ${activeTab === 'signup' ? 'auth-tab-active' : ''}`}
                  onClick={() => { setActiveTab('signup'); setSignupAlert(null); }}
                >
                  <UserPlus size={16} /> Sign Up
                </button>
              </div>
            )}

            {/* ══════════════════════════════════════
                LOGIN FORM
            ══════════════════════════════════════ */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="auth-form" noValidate>
                <InlineAlert alert={loginAlert} />

                <div className="form-group">
                  <label className="form-label" htmlFor="login-username">Username</label>
                  <div className="input-icon-wrapper">
                    <User className="input-icon" size={18} />
                    <input
                      id="login-username"
                      type="text"
                      className={`form-input icon-input ${loginErrors.username ? 'input-error' : ''}`}
                      placeholder="Enter your username"
                      value={loginData.username}
                      onChange={(e) => {
                        setLoginData({ ...loginData, username: e.target.value });
                        setLoginErrors({ ...loginErrors, username: '' });
                      }}
                      autoComplete="username"
                    />
                  </div>
                  <FieldError msg={loginErrors.username} />
                </div>

                <div className="form-group">
                  <div className="label-flex">
                    <label className="form-label" htmlFor="login-password">Password</label>
                    <button
                      type="button"
                      className="forgot-link"
                      onClick={() => { setActiveTab('forgot'); setForgotAlert(null); setForgotStep(1); }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="input-icon-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      className={`form-input icon-input ${loginErrors.password ? 'input-error' : ''}`}
                      placeholder="Enter password"
                      value={loginData.password}
                      onChange={(e) => {
                        setLoginData({ ...loginData, password: e.target.value });
                        setLoginErrors({ ...loginErrors, password: '' });
                      }}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <FieldError msg={loginErrors.password} />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span>Signing In...</span>
                  ) : (
                    <>
                      <span>Sign In to Marketplace</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div className="auth-divider"><span>OR</span></div>

                <button
                  type="button"
                  className="btn btn-ghost w-full"
                  onClick={handleGuestLogin}
                  disabled={isLoading}
                  style={{ gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}
                >
                  <Sparkles size={16} />
                  <span>Guest Login — Browse without account</span>
                </button>
              </form>
            )}

            {/* ══════════════════════════════════════
                SIGN UP FORM
            ══════════════════════════════════════ */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignup} className="auth-form" noValidate>
                <InlineAlert alert={signupAlert} />


                <div className="form-group">
                  <label className="form-label" htmlFor="signup-fullname">Full Name</label>
                  <div className="input-icon-wrapper">
                    <User className="input-icon" size={18} />
                    <input
                      id="signup-fullname"
                      type="text"
                      className={`form-input icon-input ${signupErrors.fullName ? 'input-error' : ''}`}
                      placeholder="e.g. Rahul Sharma"
                      value={signupData.fullName}
                      onChange={(e) => {
                        setSignupData({ ...signupData, fullName: e.target.value });
                        setSignupErrors({ ...signupErrors, fullName: '' });
                      }}
                      autoComplete="name"
                    />
                  </div>
                  <FieldError msg={signupErrors.fullName} />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="signup-username">Username</label>
                  <div className="input-icon-wrapper">
                    <User className="input-icon" size={18} />
                    <input
                      id="signup-username"
                      type="text"
                      className={`form-input icon-input ${signupErrors.username ? 'input-error' : ''}`}
                      placeholder="Choose a username"
                      value={signupData.username}
                      onChange={(e) => {
                        setSignupData({ ...signupData, username: e.target.value });
                        setSignupErrors({ ...signupErrors, username: '' });
                      }}
                      autoComplete="username"
                    />
                  </div>
                  <FieldError msg={signupErrors.username} />
                </div>


                <div className="form-group">
                  <label className="form-label" htmlFor="signup-password">Password</label>
                  <div className="input-icon-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      className={`form-input icon-input ${signupErrors.password ? 'input-error' : ''}`}
                      placeholder="Min 6 characters"
                      value={signupData.password}
                      onChange={(e) => {
                        setSignupData({ ...signupData, password: e.target.value });
                        setSignupErrors({ ...signupErrors, password: '' });
                      }}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <FieldError msg={signupErrors.password} />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="signup-confirm">Confirm Password</label>
                  <div className="input-icon-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input
                      id="signup-confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`form-input icon-input ${signupErrors.confirmPassword ? 'input-error' : ''}`}
                      placeholder="Re-enter password"
                      value={signupData.confirmPassword}
                      onChange={(e) => {
                        setSignupData({ ...signupData, confirmPassword: e.target.value });
                        setSignupErrors({ ...signupErrors, confirmPassword: '' });
                      }}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <FieldError msg={signupErrors.confirmPassword} />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span>Creating Account...</span>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      <span>Create Campus Account</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ══════════════════════════════════════
                FORGOT PASSWORD FORM
            ══════════════════════════════════════ */}
            {activeTab === 'forgot' && (
              <div className="auth-form">
                <InlineAlert alert={forgotAlert} />

                {/* Step 1: Verify username */}
                {forgotStep === 1 && (
                  <form onSubmit={handleForgotStep1} noValidate>
                    <div className="form-group">
                      <label className="form-label" htmlFor="forgot-username">Your Username</label>
                      <div className="input-icon-wrapper">
                        <User className="input-icon" size={18} />
                        <input
                          id="forgot-username"
                          type="text"
                          className="form-input icon-input"
                          placeholder="Enter your registered username"
                          value={forgotUsername}
                          onChange={(e) => setForgotUsername(e.target.value)}
                          autoComplete="username"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? <span>Verifying...</span> : (
                        <><KeyRound size={18} /><span>Verify Username</span></>
                      )}
                    </button>
                  </form>
                )}

                {/* Step 2: Set new password */}
                {forgotStep === 2 && (
                  <form onSubmit={handleForgotStep2} noValidate>
                    <div className="form-group">
                      <label className="form-label" htmlFor="reset-new-password">New Password</label>
                      <div className="input-icon-wrapper">
                        <Lock className="input-icon" size={18} />
                        <input
                          id="reset-new-password"
                          type={showPassword ? 'text' : 'password'}
                          className="form-input icon-input"
                          placeholder="Min 6 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="reset-confirm-password">Confirm New Password</label>
                      <div className="input-icon-wrapper">
                        <Lock className="input-icon" size={18} />
                        <input
                          id="reset-confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="form-input icon-input"
                          placeholder="Re-enter new password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label="Toggle confirm password visibility"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? <span>Updating...</span> : (
                        <><ArrowRight size={18} /><span>Update Password</span></>
                      )}
                    </button>
                  </form>
                )}

                <button
                  type="button"
                  className="btn btn-ghost w-full"
                  style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}
                  onClick={() => { setActiveTab('login'); setForgotStep(1); setForgotAlert(null); }}
                >
                  ← Back to Sign In
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
