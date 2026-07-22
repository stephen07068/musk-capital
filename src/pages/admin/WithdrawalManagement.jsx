import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle2, XCircle, ArrowUpCircle, AlertTriangle } from 'lucide-react';
import { adminWithdrawals } from '../../data/mockData';
import PageHeader from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/DataTable';

const tabs = ['All', 'Pending', 'Approved', 'Rejected'];
const coinColors = { BTC: '#F97316', ETH: '#6366F1', USDT: '#10B981' };

export default function WithdrawalManagement() {
  const [withdrawals, setWithdrawals] = useState(adminWithdrawals);
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');

  const updateStatus = (id, status) => setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status } : w));

  const filtered = withdrawals.filter(w => {
    const matchTab = tab === 'All' || w.status === tab.toLowerCase();
    const matchSearch = w.user.toLowerCase().includes(search.toLowerCase()) || w.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts = { total: withdrawals.length, pending: withdrawals.filter(w => w.status === 'pending').length, approved: withdrawals.filter(w => w.status === 'approved').length, rejected: withdrawals.filter(w => w.status === 'rejected').length };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader title="Withdrawal Management" subtitle="Process and approve withdrawal requests" />

      {/* Warning */}
      <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle size={18} className="text-yellow-400 mt-0.5 shrink-0" />
        <p className="text-xs text-yellow-200 leading-relaxed">Withdrawal approvals are irreversible. Please verify wallet addresses carefully before approving any withdrawal request.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[{ label: 'Total', value: counts.total }, { label: 'Pending', value: counts.pending }, { label: 'Approved', value: counts.approved }, { label: 'Rejected', value: counts.rejected }].map(({ label, value }) => (
          <div key={label} className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-4">
            <p className="text-[10px] text-[#9CA3AF] mb-1">{label}</p>
            <p className="text-2xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex gap-1 bg-black/40 p-1 rounded-xl">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === t ? 'bg-[#D4AF37] text-black' : 'text-[#9CA3AF] hover:text-white'}`}>{t}</button>
            ))}
          </div>
          <div className="relative ml-auto">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search withdrawals..." className="pl-8 pr-4 py-2 bg-black/40 border border-[#1F2937] rounded-xl text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37]/40 w-48" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F2937]">
                {['ID', 'User', 'Amount', 'Currency', 'Wallet Address', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-widest pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((w, i) => (
                <motion.tr key={w.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-b border-[#1F2937]/50 hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pr-4 font-mono text-[10px] text-[#9CA3AF]">{w.id}</td>
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center text-black text-xs font-bold shrink-0">{w.user.charAt(0)}</div>
                      <div>
                        <p className="text-xs font-bold text-white">{w.user}</p>
                        <p className="text-[10px] text-[#9CA3AF]">{w.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-xs font-bold text-red-400">${w.amount.toLocaleString()}</td>
                  <td className="py-3.5 pr-4">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: (coinColors[w.currency] || '#6B7280') + '22', color: coinColors[w.currency] || '#9CA3AF' }}>{w.currency}</span>
                  </td>
                  <td className="py-3.5 pr-4 font-mono text-[10px] text-[#9CA3AF] max-w-[120px] truncate">{w.walletAddress}</td>
                  <td className="py-3.5 pr-4 text-[10px] text-[#9CA3AF] whitespace-nowrap">{w.date}</td>
                  <td className="py-3.5 pr-4"><StatusBadge status={w.status} /></td>
                  <td className="py-3.5">
                    {w.status === 'pending' ? (
                      <div className="flex gap-1.5">
                        <button onClick={() => updateStatus(w.id, 'approved')} className="flex items-center gap-1 px-2 py-1 bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 rounded-lg text-[10px] font-bold hover:bg-emerald-400/20 transition-colors">
                          <CheckCircle2 size={11} /> Approve
                        </button>
                        <button onClick={() => updateStatus(w.id, 'rejected')} className="flex items-center gap-1 px-2 py-1 bg-red-400/10 text-red-400 border border-red-400/20 rounded-lg text-[10px] font-bold hover:bg-red-400/20 transition-colors">
                          <XCircle size={11} /> Reject
                        </button>
                      </div>
                    ) : <span className="text-[10px] text-[#6B7280]">—</span>}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-10 text-[#9CA3AF] text-sm">No withdrawal requests found.</p>}
        </div>
      </div>
    </div>
  );
}
