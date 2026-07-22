import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GoogleSignInModal from '../../components/ui/GoogleSignInModal';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password }, false);
      navigate(from);
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGoogleAccount = async (account) => {
    setGoogleModalOpen(false);
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle({ email: account.email, name: account.name });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090D] flex items-center justify-center py-20 px-4">
      <GoogleSignInModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSelectAccount={handleSelectGoogleAccount}
      />
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 30%, #D4AF37 0%, transparent 60%)' }} />
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center font-black text-black text-xl">M</div>
            <div className="leading-none text-left">
              <div className="text-base font-black text-white tracking-wider">MUSK</div>
              <div className="text-[11px] font-semibold text-[#D4AF37] tracking-[0.2em]">CAPITAL</div>
            </div>
          </Link>
          <h1 className="text-2xl font-black text-white">Welcome Back</h1>
          <p className="text-sm text-[#9CA3AF] mt-2">Sign in to your Musk Capital account</p>
        </div>

        <div className="card-dark p-8">
          {error && (
            <div className="flex items-start gap-2 p-3 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={() => setGoogleModalOpen(true)}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#111827] hover:bg-[#1F2937] border border-[#1F2937] hover:border-[#D4AF37]/40 rounded-xl text-white font-semibold text-sm transition-all mb-6 group"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-[#1F2937] w-full" />
            <span className="bg-[#0D0F14] px-3 text-xs text-[#6B7280] uppercase tracking-wider font-semibold shrink-0">or with email</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="user-login-email" className="block text-xs font-semibold text-[#9CA3AF] mb-2">Email or Username</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  id="user-login-email"
                  name="email"
                  type="text"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#0D0F14] border border-[#1F2937] rounded-xl text-white placeholder-[#6B7280] text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="user-login-password" className="text-xs font-semibold text-[#9CA3AF]">Password</label>
                <Link to="/forgot-password" className="text-xs text-[#D4AF37] hover:text-[#F0D060]">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  id="user-login-password"
                  name="password"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full pl-10 pr-10 py-3 bg-[#0D0F14] border border-[#1F2937] rounded-xl text-white placeholder-[#6B7280] text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                />
                <button type="button" onClick={() => setShow(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="w-4 h-4 rounded accent-[#D4AF37]"
              />
              <span className="text-sm text-[#9CA3AF]">Remember me</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 gold-gradient text-black font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#9CA3AF] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#D4AF37] font-semibold hover:text-[#F0D060] transition-colors">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
