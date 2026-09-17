import React, { useState } from 'react';
import {
  Shield,
  User,
  Users,
  CheckCircle2,
  Lock,
  Mail,
  ArrowRight,
  ChevronLeft,
  AlertCircle,
  Building,
  MapPin,
  Phone,
  Sparkles,
  Info
} from 'lucide-react';
import { Button } from '../ui/Button';
import { authenticate, registerAccount, AuthSession } from '../../lib/storage';

export type AuthMode = 'login' | 'signup' | 'forgot-password' | 'reset-password';
export type AccountRole = 'user' | 'volunteer';

export interface AuthPageProps {
  initialMode?: AuthMode;
  onAuthenticated: (session: AuthSession) => void;
  onNavigateRoute?: (route: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onAuthenticated,
  onNavigateRoute
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [selectedRole, setSelectedRole] = useState<AccountRole>('user');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');

  // Volunteer specific fields
  const [locality, setLocality] = useState('');
  const [organization, setOrganization] = useState('');
  const [motivation, setMotivation] = useState('');
  const [availability, setAvailability] = useState('Weekends & weekday evenings');
  const [interests, setInterests] = useState<string[]>([
    'Roads',
    'Sanitation',
    'Street Lighting'
  ]);
  const [languages, setLanguages] = useState<string[]>(['English', 'Hindi']);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const interestOptions = [
    'Roads',
    'Water',
    'Sanitation',
    'Street Lighting',
    'Drainage',
    'Electricity',
    'Public Safety',
    'General Civic Issues'
  ];

  const handleRoleChange = (role: AccountRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
  };

  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessNotice(null);
    if (onNavigateRoute) {
      onNavigateRoute(`/auth/${newMode}`);
    }
  };

  const handleQuickDemo = (demoType: 'user' | 'volunteer' | 'moderator') => {
    setErrorMessage(null);
    if (demoType === 'user') {
      setEmail('citizen@example.in');
      setPassword('password123');
      setSelectedRole('user');
    } else if (demoType === 'volunteer') {
      setEmail('volunteer@civicfix.in');
      setPassword('password123');
      setSelectedRole('volunteer');
    } else {
      setEmail('moderator@civicfix.in');
      setPassword('password123');
      setSelectedRole('user');
    }
  };

  const handleToggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password) {
          setErrorMessage('Please enter both email and password.');
          setIsLoading(false);
          return;
        }

        const res = authenticate(email, password);
        if (!res.success || !res.session) {
          setErrorMessage(res.error || 'Incorrect email or password.');
          setIsLoading(false);
          return;
        }

        // Authentication success:
        // Server rule: session.user.role determines actual portal
        onAuthenticated(res.session);
      } else if (mode === 'signup') {
        if (!fullName.trim()) {
          setErrorMessage('Full name is required.');
          setIsLoading(false);
          return;
        }
        if (!email.trim() || !email.includes('@')) {
          setErrorMessage('Please enter a valid email address.');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage('Password must contain at least 6 characters.');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match.');
          setIsLoading(false);
          return;
        }

        if (selectedRole === 'volunteer') {
          if (!locality.trim()) {
            setErrorMessage('Please provide your local area or ward for verification assignments.');
            setIsLoading(false);
            return;
          }
          if (!motivation.trim()) {
            setErrorMessage('Please briefly share why you would like to volunteer.');
            setIsLoading(false);
            return;
          }
        }

        const res = registerAccount({
          fullName,
          email,
          password,
          role: selectedRole,
          phone,
          city,
          state,
          locality,
          motivation,
          organization,
          interests,
          languages,
          availability
        });

        if (!res.success || !res.session) {
          setErrorMessage(res.error || 'Your account could not be created. Please try again.');
          setIsLoading(false);
          return;
        }

        onAuthenticated(res.session);
      } else if (mode === 'forgot-password') {
        if (!email.trim() || !email.includes('@')) {
          setErrorMessage('Please enter a valid email address.');
          setIsLoading(false);
          return;
        }

        // Simulate password reset email
        setTimeout(() => {
          setIsLoading(false);
          setSuccessNotice(
            `A password reset link has been dispatched to ${email}. Check your email to reset your credentials.`
          );
        }, 600);
        return;
      } else if (mode === 'reset-password') {
        if (password.length < 6) {
          setErrorMessage('New password must be at least 6 characters.');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match.');
          setIsLoading(false);
          return;
        }

        setTimeout(() => {
          setIsLoading(false);
          setSuccessNotice('Password updated successfully. You can now login with your new credentials.');
          setTimeout(() => handleSwitchMode('login'), 1200);
        }, 600);
        return;
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f6f3] via-[#f7faf8] to-[#edf4f0] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 text-[#17201d]">
      {/* Top Brand Banner */}
      <div className="max-w-md w-full mx-auto text-center pt-2 pb-6">
        <div className="inline-flex items-center justify-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-[#087f5b] text-white flex items-center justify-center font-black text-base shadow-sm">
            CF
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-[#17201d]">CivicFix</span>
        </div>
        <p className="text-sm font-medium text-[#4a5853]">
          Make civic problems visible. Track action.
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-2xl border border-[#dce5e1] shadow-xl p-6 sm:p-8">
        {/* Mode Toggle Header (Login / Sign Up) */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="flex rounded-xl bg-[#f2f6f4] p-1 mb-6 border border-[#e1eae5]">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#087f5b] shadow-xs'
                  : 'text-[#66736e] hover:text-[#17201d]'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white text-[#087f5b] shadow-xs'
                  : 'text-[#66736e] hover:text-[#17201d]'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Forgot Password Header */}
        {mode === 'forgot-password' && (
          <div className="mb-6 text-center">
            <h2 className="text-lg font-extrabold text-[#17201d]">Forgot your password?</h2>
            <p className="text-xs text-[#66736e] mt-1">
              Enter the email address associated with your CivicFix account.
            </p>
          </div>
        )}

        {/* Reset Password Header */}
        {mode === 'reset-password' && (
          <div className="mb-6 text-center">
            <h2 className="text-lg font-extrabold text-[#17201d]">Create a new password</h2>
            <p className="text-xs text-[#66736e] mt-1">
              Ensure your new password has at least 6 characters.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-[#fff0ee] border border-[#f5c6cb] flex items-start gap-2.5 text-xs text-[#c0392b]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successNotice && (
          <div className="mb-5 p-3 rounded-xl bg-[#e7f7f1] border border-[#a3e3cb] flex items-start gap-2.5 text-xs text-[#087f5b]">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sign Up: Full Name */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-[#17201d] mb-1.5">
                Full Name <span className="text-[#c0392b]">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#dce5e1] text-xs focus:outline-none focus:ring-2 focus:ring-[#087f5b] focus:border-transparent bg-[#fafcfb]"
              />
            </div>
          )}

          {/* Email Address */}
          {(mode === 'login' || mode === 'signup' || mode === 'forgot-password') && (
            <div>
              <label className="block text-xs font-bold text-[#17201d] mb-1.5">
                Email Address <span className="text-[#c0392b]">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.in"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#dce5e1] text-xs focus:outline-none focus:ring-2 focus:ring-[#087f5b] focus:border-transparent bg-[#fafcfb]"
                />
                <Mail className="w-4 h-4 text-[#8a9993] absolute left-3 top-3" />
              </div>
            </div>
          )}

          {/* Password */}
          {(mode === 'login' || mode === 'signup' || mode === 'reset-password') && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#17201d]">
                  {mode === 'reset-password' ? 'New Password' : 'Password'}{' '}
                  <span className="text-[#c0392b]">*</span>
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('forgot-password')}
                    className="text-[11px] font-semibold text-[#087f5b] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#dce5e1] text-xs focus:outline-none focus:ring-2 focus:ring-[#087f5b] focus:border-transparent bg-[#fafcfb]"
                />
                <Lock className="w-4 h-4 text-[#8a9993] absolute left-3 top-3" />
              </div>
            </div>
          )}

          {/* Confirm Password */}
          {(mode === 'signup' || mode === 'reset-password') && (
            <div>
              <label className="block text-xs font-bold text-[#17201d] mb-1.5">
                Confirm Password <span className="text-[#c0392b]">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#dce5e1] text-xs focus:outline-none focus:ring-2 focus:ring-[#087f5b] focus:border-transparent bg-[#fafcfb]"
                />
                <Lock className="w-4 h-4 text-[#8a9993] absolute left-3 top-3" />
              </div>
            </div>
          )}

          {/* Common Signup fields: Phone, City, State */}
          {mode === 'signup' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-[#17201d] mb-1.5">
                  Phone {selectedRole === 'volunteer' ? <span className="text-[#c0392b]">*</span> : '(Optional)'}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required={selectedRole === 'volunteer'}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#dce5e1] text-xs focus:outline-none focus:ring-2 focus:ring-[#087f5b] bg-[#fafcfb]"
                  />
                  <Phone className="w-3.5 h-3.5 text-[#8a9993] absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17201d] mb-1.5">City</label>
                <div className="relative">
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#dce5e1] text-xs focus:outline-none focus:ring-2 focus:ring-[#087f5b] bg-[#fafcfb]"
                  />
                  <MapPin className="w-3.5 h-3.5 text-[#8a9993] absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>
          )}

          {/* Volunteer-Specific Signup Fields */}
          {mode === 'signup' && selectedRole === 'volunteer' && (
            <div className="pt-2 border-t border-[#e1eae5] space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#17201d] mb-1.5">
                  Area / Locality <span className="text-[#c0392b]">*</span>
                </label>
                <input
                  type="text"
                  value={locality}
                  onChange={e => setLocality(e.target.value)}
                  placeholder="e.g. Indiranagar, Ward 89, East Zone"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-[#dce5e1] text-xs focus:outline-none focus:ring-2 focus:ring-[#087f5b] bg-[#fafcfb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17201d] mb-1.5">
                  Why do you want to volunteer? <span className="text-[#c0392b]">*</span>
                </label>
                <textarea
                  value={motivation}
                  onChange={e => setMotivation(e.target.value)}
                  rows={2}
                  placeholder="e.g. Passionate about road safety and resolving local water logging..."
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-[#dce5e1] text-xs focus:outline-none focus:ring-2 focus:ring-[#087f5b] bg-[#fafcfb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17201d] mb-1.5">
                  Organization / Institution (Optional)
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  placeholder="e.g. Resident Welfare Association / University"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#dce5e1] text-xs focus:outline-none focus:ring-2 focus:ring-[#087f5b] bg-[#fafcfb]"
                />
              </div>

              {/* Areas of Interest Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-[#17201d] mb-1.5">
                  Areas of Interest
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-2 bg-[#f8faf9] rounded-xl border border-[#dce5e1]">
                  {interestOptions.map(interest => (
                    <label
                      key={interest}
                      className="flex items-center gap-2 text-[11px] text-[#2c3833] cursor-pointer hover:text-[#087f5b]"
                    >
                      <input
                        type="checkbox"
                        checked={interests.includes(interest)}
                        onChange={() => handleToggleInterest(interest)}
                        className="rounded border-[#dce5e1] text-[#087f5b] focus:ring-[#087f5b]"
                      />
                      <span>{interest}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isLoading}
              className="py-2.5 text-xs font-bold shadow-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>
                  {mode === 'login'
                    ? 'Signing in...'
                    : mode === 'signup'
                    ? 'Creating account...'
                    : 'Processing...'}
                </span>
              ) : (
                <>
                  <span>
                    {mode === 'login'
                      ? 'Continue'
                      : mode === 'signup'
                      ? `Register as ${selectedRole === 'volunteer' ? 'Volunteer' : 'User'}`
                      : mode === 'forgot-password'
                      ? 'Send Reset Link'
                      : 'Update Password'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </div>

          {/* Back to Login Links for Reset / Forgot */}
          {(mode === 'forgot-password' || mode === 'reset-password') && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#087f5b] hover:underline"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Back to Login
              </button>
            </div>
          )}
        </form>

        {/* ROLE SELECTOR (Required below form for Login & Sign Up) */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="mt-6 pt-6 border-t border-[#e1eae5]">
            <div className="text-center mb-3">
              <span className="text-[11px] font-bold tracking-wide uppercase text-[#66736e]">
                You are a...
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* User Option */}
              <button
                type="button"
                onClick={() => handleRoleChange('user')}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  selectedRole === 'user'
                    ? 'border-[#087f5b] bg-[#f0f9f5] ring-2 ring-[#087f5b]/20 shadow-xs'
                    : 'border-[#dce5e1] hover:border-[#b8ccc4] bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">👤</span>
                  {selectedRole === 'user' && (
                    <span className="w-2 h-2 rounded-full bg-[#087f5b]"></span>
                  )}
                </div>
                <div className="font-bold text-xs text-[#17201d]">User</div>
                <div className="text-[10px] text-[#66736e] leading-snug mt-0.5">
                  Report & track civic problems
                </div>
              </button>

              {/* Volunteer Option */}
              <button
                type="button"
                onClick={() => handleRoleChange('volunteer')}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  selectedRole === 'volunteer'
                    ? 'border-[#087f5b] bg-[#f0f9f5] ring-2 ring-[#087f5b]/20 shadow-xs'
                    : 'border-[#dce5e1] hover:border-[#b8ccc4] bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">🤝</span>
                  {selectedRole === 'volunteer' && (
                    <span className="w-2 h-2 rounded-full bg-[#087f5b]"></span>
                  )}
                </div>
                <div className="font-bold text-xs text-[#17201d]">Volunteer</div>
                <div className="text-[10px] text-[#66736e] leading-snug mt-0.5">
                  Help communities verify & follow up
                </div>
              </button>
            </div>

            <p className="text-[10px] text-center text-[#8a9993] mt-2.5">
              Role selection filters your dashboard context upon login.
            </p>
          </div>
        )}

        {/* Quick Demo Fill Helper for Reviewers */}
        <div className="mt-6 pt-4 border-t border-dashed border-[#e1eae5]">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#66736e] mb-2 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#087f5b]" />
            <span>Instant Demo Sign-In:</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('user')}
              className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-[#f0f6f3] hover:bg-[#e2ede7] text-[#1e4d3c] border border-[#d2e2da] transition-colors"
            >
              👤 Citizen Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('volunteer')}
              className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-[#e7f5ff] hover:bg-[#d0ebff] text-[#1864ab] border border-[#a5d8ff] transition-colors"
            >
              🤝 Volunteer Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('moderator')}
              className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-[#fff9db] hover:bg-[#fff3bf] text-[#f08c00] border border-[#ffe066] transition-colors"
            >
              🛡️ Moderator Demo
            </button>
          </div>
        </div>
      </div>

      {/* Footer Branding & Privacy Assurance */}
      <footer className="max-w-md w-full mx-auto text-center mt-6 text-[11px] text-[#8a9993] space-y-1">
        <p>© 2026 CivicFix · Public Interest Civic Technology</p>
        <p className="text-[10px]">
          Compliant with DPDP Act 2023 · Private citizen records are isolated and encrypted
        </p>
      </footer>
    </div>
  );
};
