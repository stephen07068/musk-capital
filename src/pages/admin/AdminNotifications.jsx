import React, { useState } from 'react';
import { Send, Bell, History } from 'lucide-react';
import { adminNotificationHistory } from '../../data/mockData';
import PageHeader from '../../components/ui/PageHeader';

export default function AdminNotifications() {
  const [history, setHistory] = useState(adminNotificationHistory);
  const [form, setForm] = useState({ title: '', message: '', target: 'All Users', type: 'system' });
  const [sent, setSent] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!form.title || !form.message) return;
    setHistory(prev => [{ id: Date.now(), ...form, sent: new Date().toISOString().slice(0,16).replace('T', ' ') }, ...prev]);
    setForm({ title: '', message: '', target: 'All Users', type: 'system' });
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const inputCls = "w-full bg-[#0D0F14] border border-[#1F2937] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors";

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader title="Notification Center" subtitle="Send platform announcements and user alerts" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Composer */}
        <div className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
              <Send size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Compose Broadcast</h2>
              <p className="text-xs text-[#9CA3AF]">Send messages to users via email and in-app alerts</p>
            </div>
          </div>

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="text-xs text-[#9CA3AF] block mb-1.5 font-medium">Target Audience</label>
              <select value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} className={inputCls}>
                <option>All Users</option>
                <option>Premium Users</option>
                <option>Active Traders (Last 7 Days)</option>
                <option>Specific User (By Email)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1.5 font-medium">Message Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className={inputCls}>
                  <option value="system">System Alert</option>
                  <option value="promo">Promotional</option>
                  <option value="feature">Feature Update</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1.5 font-medium">Notification Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} placeholder="e.g. Scheduled Maintenance" />
              </div>
            </div>
            <div>
              <label className="text-xs text-[#9CA3AF] block mb-1.5 font-medium">Message Body *</label>
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4} className={inputCls + " resize-none"} placeholder="Write your message here..." />
            </div>
            <div className="pt-2">
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#C9A227] transition-colors">
                <Bell size={16} /> Broadcast Notification
              </button>
            </div>
            {sent && <p className="text-emerald-400 text-xs font-bold text-center mt-2">✓ Notification broadcasted successfully!</p>}
          </form>
        </div>

        {/* History */}
        <div className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#1F2937] flex items-center justify-center text-[#9CA3AF]">
              <History size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Broadcast History</h2>
              <p className="text-xs text-[#9CA3AF]">Previously sent notifications</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {history.map((h, i) => (
              <div key={h.id || i} className="p-4 bg-[#111827] border border-[#1F2937] rounded-xl hover:border-[#D4AF37]/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${h.type === 'system' ? 'text-red-400 bg-red-400/10' : h.type === 'feature' ? 'text-blue-400 bg-blue-400/10' : 'text-emerald-400 bg-emerald-400/10'}`}>
                    {h.type}
                  </span>
                  <span className="text-[10px] text-[#6B7280]">{h.sent}</span>
                </div>
                <p className="text-sm font-bold text-white mb-1">{h.title}</p>
                <p className="text-xs text-[#9CA3AF] mb-3 leading-relaxed line-clamp-2">{h.message}</p>
                <div className="flex items-center justify-between text-[10px] text-[#6B7280] pt-2 border-t border-[#1F2937]/50">
                  <span>Target: <strong className="text-white font-medium">{h.target}</strong></span>
                  <span>Sent by: <strong className="text-white font-medium">Admin</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
