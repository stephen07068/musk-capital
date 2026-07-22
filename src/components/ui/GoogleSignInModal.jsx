import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, ArrowRight } from 'lucide-react';

const PRESET_ACCOUNTS = [
  { name: 'Alex Mercer', email: 'alex.mercer@gmail.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80' },
  { name: 'Sarah Jenkins', email: 'sarah.jenkins@gmail.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' },
  { name: 'Elon Musk', email: 'elon.musk@gmail.com', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80' },
];

export default function GoogleSignInModal({ isOpen, onClose, onSelectAccount }) {
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail) return;
    const name = customName || customEmail.split('@')[0];
    onSelectAccount({ name, email: customEmail });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md bg-[#0F131C] border border-[#1F2937] rounded-3xl p-6 shadow-2xl relative overflow-hidden"
        >
          {/* Top Google Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1F2937]">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <div>
                <h3 className="text-base font-bold text-white leading-snug">Sign in with Google</h3>
                <p className="text-xs text-[#9CA3AF]">to continue to <span className="text-[#D4AF37] font-semibold">Musk Capital</span></p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#6B7280] hover:text-white rounded-full hover:bg-white/5 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {!customMode ? (
            <div>
              <p className="text-xs text-[#6B7280] font-semibold uppercase tracking-wider mb-3">Choose an account</p>
              <div className="space-y-2 mb-4">
                {PRESET_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => onSelectAccount(acc)}
                    className="w-full flex items-center gap-3.5 p-3 rounded-2xl bg-[#161B26] hover:bg-[#1F2636] border border-[#1F2937] hover:border-[#D4AF37]/50 text-left transition-all group"
                  >
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#1F2937] group-hover:border-[#D4AF37]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">{acc.name}</p>
                      <p className="text-xs text-[#9CA3AF] truncate">{acc.email}</p>
                    </div>
                    <ArrowRight size={16} className="text-[#6B7280] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCustomMode(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-[#1F2937] hover:border-[#D4AF37]/50 text-xs font-semibold text-[#9CA3AF] hover:text-white transition-all bg-white/5"
              >
                <UserPlus size={14} className="text-[#D4AF37]" />
                Use another Google account
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <p className="text-xs text-[#6B7280] font-semibold uppercase tracking-wider">Enter Google Account Info</p>
              
              <div>
                <label className="block text-xs font-semibold text-[#9CA3AF] mb-1.5">Google Email Address</label>
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full px-4 py-2.5 bg-[#161B26] border border-[#1F2937] rounded-xl text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9CA3AF] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Satoshi Nakamoto"
                  className="w-full px-4 py-2.5 bg-[#161B26] border border-[#1F2937] rounded-xl text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCustomMode(false)}
                  className="flex-1 py-2.5 bg-[#161B26] border border-[#1F2937] text-white text-xs font-semibold rounded-xl hover:bg-[#1F2636]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 gold-gradient text-black text-xs font-bold rounded-xl hover:opacity-90"
                >
                  Continue
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
