import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setSent(true); setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#07090D] flex items-center justify-center py-20 px-4">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 30%, #D4AF37 0%, transparent 60%)' }} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center font-black text-black text-xl">M</div>
            <div className="leading-none text-left">
              <div className="text-base font-black text-white tracking-wider">MUSK</div>
              <div className="text-[11px] font-semibold text-[#D4AF37] tracking-[0.2em]">CAPITAL</div>
            </div>
          </Link>
          <h1 className="text-2xl font-black text-white">Reset Password</h1>
          <p className="text-sm text-[#9CA3AF] mt-2">Enter your email and we'll send you a reset link</p>
        </div>

        <div className="card-dark p-8">
          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Reset Link Sent!</h3>
              <p className="text-sm text-[#9CA3AF] mb-6">Check <span className="text-white font-medium">{email}</span> for the password reset link.</p>
              <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-semibold text-[#D4AF37] hover:text-[#F0D060] transition-colors">
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle size={15} />{error}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-[#9CA3AF] mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#0D0F14] border border-[#1F2937] rounded-xl text-white placeholder-[#6B7280] text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-colors" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 gold-gradient text-black font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70">
                {loading
                  ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />Sending...</span>
                  : 'Send Reset Link'}
              </button>
              <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-[#9CA3AF] hover:text-white transition-colors mt-2">
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
