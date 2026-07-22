import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Camera, Save, Lock, ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { profileAPI } from '../../services/api';

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    country: 'United States',
  });
  
  const [passData, setPassData] = useState({ current_password: '', new_password: '', confirm: '' });
  const [saved, setSaved] = useState(false);
  const [passMsg, setPassMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        country: user.country || 'United States',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await profileAPI.update({
        name: formData.name,
        phone: formData.phone,
        country: formData.country,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassMsg('');
    if (passData.new_password !== passData.confirm) {
      setPassMsg('Passwords do not match');
      return;
    }
    try {
      await profileAPI.changePassword({
        current_password: passData.current_password,
        new_password: passData.new_password,
      });
      setPassMsg('Password updated successfully');
      setPassData({ current_password: '', new_password: '', confirm: '' });
    } catch (err) {
      setPassMsg(err.response?.data?.message || 'Failed to update password');
    }
  };

  if (authLoading) return <div>Loading...</div>;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      <PageHeader title="Profile" subtitle="Manage your personal information and security" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Avatar & Quick Info */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-6 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-24 gold-gradient opacity-10" />
            <div className="relative inline-block mt-4 mb-4">
              {user?.avatar_url ? (
                 <img src={user.avatar_url} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-[#0D0F14] object-cover mx-auto" />
              ) : (
                <div className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center text-black font-black text-3xl mx-auto border-4 border-[#0D0F14]">
                  {formData.name.charAt(0)}
                </div>
              )}
              <button className="absolute bottom-0 right-0 p-2 bg-[#0D0F14] border border-[#1F222A] rounded-full text-[#9CA3AF] hover:text-white hover:border-[#D4AF37] transition-all">
                <Camera size={14} />
              </button>
            </div>
            <h2 className="text-lg font-black text-white">{formData.name}</h2>
            <p className="text-xs text-[#9CA3AF] mb-4">@{formData.username}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck size={12} /> {user?.plan || 'Investor'}
            </div>

            <div className="border-t border-[#1F222A] mt-6 pt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-[#6B7280]" />
                <span className="text-[#9CA3AF] truncate">{formData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-[#6B7280]" />
                <span className="text-[#9CA3AF]">{formData.phone || '—'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-[#6B7280]" />
                <span className="text-[#9CA3AF]">{formData.country}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={16} className="text-[#6B7280]" />
                <span className="text-[#9CA3AF]">Joined {user?.joined || 'Recently'}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Col: Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Profile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-6"
          >
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
              <User size={18} className="text-[#D4AF37]" /> Personal Information
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#9CA3AF] mb-1">Full Name</label>
                  <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black/40 border border-[#1F222A] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label className="block text-xs text-[#9CA3AF] mb-1">Username (Immutable)</label>
                  <input value={formData.username} disabled className="w-full bg-black/40 border border-[#1F222A] rounded-xl px-4 py-2.5 text-sm text-[#6B7280] cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs text-[#9CA3AF] mb-1">Email Address (Immutable)</label>
                  <input type="email" value={formData.email} disabled className="w-full bg-black/40 border border-[#1F222A] rounded-xl px-4 py-2.5 text-sm text-[#6B7280] cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs text-[#9CA3AF] mb-1">Phone Number</label>
                  <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-black/40 border border-[#1F222A] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-[#9CA3AF] mb-1">Country</label>
                  <select value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full bg-black/40 border border-[#1F222A] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37] appearance-none">
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Australia</option>
                    <option>Germany</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#1F222A]">
                {saved && <span className="text-xs font-bold text-emerald-400">Profile Updated Successfully</span>}
                <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#F0D060] transition-colors">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </motion.div>

          {/* Change Password */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-6"
          >
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
              <Lock size={18} className="text-[#D4AF37]" /> Change Password
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1">Current Password</label>
                <input required type="password" value={passData.current_password} onChange={e => setPassData({...passData, current_password: e.target.value})} placeholder="••••••••" className="w-full bg-black/40 border border-[#1F222A] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#9CA3AF] mb-1">New Password</label>
                  <input required minLength={8} type="password" value={passData.new_password} onChange={e => setPassData({...passData, new_password: e.target.value})} placeholder="••••••••" className="w-full bg-black/40 border border-[#1F222A] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label className="block text-xs text-[#9CA3AF] mb-1">Confirm New Password</label>
                  <input required type="password" value={passData.confirm} onChange={e => setPassData({...passData, confirm: e.target.value})} placeholder="••••••••" className="w-full bg-black/40 border border-[#1F222A] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#1F222A]">
                {passMsg && <span className={`text-xs font-bold ${passMsg.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}>{passMsg}</span>}
                <button type="submit" className="px-6 py-2.5 bg-white/5 text-white text-sm font-bold border border-[#1F222A] rounded-xl hover:bg-white/10 transition-colors">
                  Update Password
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
