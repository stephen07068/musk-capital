import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield, Monitor, Globe, Save } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';

const Toggle = ({ label, desc, checked, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-[#1F222A] last:border-0">
    <div className="pr-4">
      <p className="text-sm font-bold text-white">{label}</p>
      {desc && <p className="text-xs text-[#9CA3AF] mt-0.5">{desc}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-[#D4AF37]' : 'bg-[#1F222A]'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export default function UserSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  // State for toggles
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [tradeAlerts, setTradeAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const tabs = [
    { id: 'general', icon: SettingsIcon, label: 'General' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Shield, label: 'Security' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      <PageHeader title="Settings" subtitle="Customize your dashboard experience" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                  : 'bg-[#0D0F14] border border-[#1F222A] text-[#9CA3AF] hover:text-white hover:border-[#D4AF37]/30'
              }`}
            >
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit}>
            {activeTab === 'general' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-6">General Preferences</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Globe size={14} /> Language & Region
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#6B7280] mb-1">Display Language</label>
                        <select className="w-full bg-black/40 border border-[#1F222A] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]">
                          <option>English (US)</option>
                          <option>English (UK)</option>
                          <option>Spanish</option>
                          <option>French</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-[#6B7280] mb-1">Base Currency</label>
                        <select className="w-full bg-black/40 border border-[#1F222A] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]">
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                          <option>GBP (£)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-[#1F222A] pt-6">
                    <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Monitor size={14} /> Appearance
                    </label>
                    <Toggle label="Dark Theme" desc="Use the premium black and gold dark mode across the app." checked={darkMode} onChange={setDarkMode} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-6">Notification Settings</h3>
                <div className="space-y-2">
                  <Toggle label="Email Notifications" desc="Receive daily summaries and account alerts via email." checked={emailNotifs} onChange={setEmailNotifs} />
                  <Toggle label="Push Notifications" desc="Get instant browser notifications for deposits and withdrawals." checked={pushNotifs} onChange={setPushNotifs} />
                  <Toggle label="Trade Alerts" desc="Get notified when assets in your watchlist have significant price movement." checked={tradeAlerts} onChange={setTradeAlerts} />
                  <Toggle label="Marketing Communications" desc="Receive promotional offers and newsletters." checked={marketing} onChange={setMarketing} />
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-6">Security Settings</h3>
                <div className="space-y-6">
                  <Toggle label="Two-Factor Authentication (2FA)" desc="Require an authentication code in addition to your password when logging in." checked={twoFactor} onChange={setTwoFactor} />
                  
                  <div className="border-t border-[#1F222A] pt-6">
                    <h4 className="text-sm font-bold text-white mb-4">Active Sessions</h4>
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-[#1F222A] rounded-xl">
                      <div className="flex items-center gap-3">
                        <Monitor size={20} className="text-[#D4AF37]" />
                        <div>
                          <p className="text-sm font-bold text-white">Windows PC - Chrome</p>
                          <p className="text-xs text-[#9CA3AF]">San Francisco, USA • Active now</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">Current</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex items-center justify-end gap-4 mt-6">
              {saved && <span className="text-xs font-bold text-emerald-400">Settings Saved</span>}
              <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#F0D060] transition-colors">
                <Save size={16} /> Save Preferences
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
