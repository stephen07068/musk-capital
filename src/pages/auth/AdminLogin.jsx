import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password }, true);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090D] flex items-center justify-center py-20 px-4">
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

          <div className="flex items-center justify-center gap-2 text-[#D4AF37] mb-2">
            <Shield size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Admin Portal</span>
          </div>

          <h1 className="text-2xl font-black text-white">Administrator Access</h1>
          <p className="text-sm text-[#9CA3AF] mt-2">Enter your credentials to manage the platform</p>
        </div>

        <div className="card-dark p-8 border border-[#D4AF37]/20">
          {error && (
            <div className="flex items-start gap-2 p-3 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email-field" className="block text-xs font-semibold text-[#9CA3AF] mb-2">Admin Email or Username</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  id="admin-email-field"
                  name="email"
                  type="text"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@muskcapital.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#0D0F14] border border-[#1F2937] rounded-xl text-white placeholder-[#6B7280] text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="admin-password-field" className="text-xs font-semibold text-[#9CA3AF]">Password</label>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  id="admin-password-field"
                  name="password"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 bg-[#0D0F14] border border-[#1F2937] rounded-xl text-white placeholder-[#6B7280] text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShow(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 gold-gradient text-black font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70 mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                'Access Admin Dashboard'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#1F2937]">
            <p className="text-center text-sm text-[#6B7280]">
              Not an administrator?{' '}
              <Link to="/login" className="text-[#D4AF37] font-semibold hover:text-[#F0D060] transition-colors">
                User Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
