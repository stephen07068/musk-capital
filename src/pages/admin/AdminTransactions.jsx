import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowDownCircle, ArrowUpCircle, Download } from 'lucide-react';
import { adminTransactions } from '../../data/mockData';
import PageHeader from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/DataTable';

const PAGE_SIZE = 6;

export default function AdminTransactions() {
  const [transactions] = useState(adminTransactions);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = transactions.filter(tx => {
    const matchType = typeFilter === 'All' || tx.type === typeFilter.toLowerCase();
    const matchStatus = statusFilter === 'All' || tx.status === statusFilter.toLowerCase();
    const matchSearch = tx.user.toLowerCase().includes(search.toLowerCase()) || tx.id.toLowerCase().includes(search.toLowerCase()) || tx.method.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = {
    total: transactions.length,
    deposits: transactions.filter(t => t.type === 'deposit').length,
    withdrawals: transactions.filter(t => t.type === 'withdrawal').length,
    pending: transactions.filter(t => t.status === 'pending').length,
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader
        title="Transactions"
        subtitle="Complete platform transaction history"
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0D0F14] border border-[#1F2937] rounded-xl text-xs font-semibold text-[#9CA3AF] hover:text-white hover:border-[#D4AF37]/40 transition-all">
            <Download size={14} /> Export CSV
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[{ label: 'Total', value: counts.total }, { label: 'Deposits', value: counts.deposits }, { label: 'Withdrawals', value: counts.withdrawals }, { label: 'Pending', value: counts.pending }].map(({ label, value }) => (
          <div key={label} className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-4">
            <p className="text-[10px] text-[#9CA3AF] mb-1">{label}</p>
            <p className="text-2xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Type tabs */}
          <div className="flex gap-1 bg-black/40 p-1 rounded-xl">
            {['All', 'Deposits', 'Withdrawals'].map(t => (
              <button key={t} onClick={() => { setTypeFilter(t === 'Deposits' ? 'deposit' : t === 'Withdrawals' ? 'withdrawal' : 'All'); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${typeFilter === (t === 'Deposits' ? 'deposit' : t === 'Withdrawals' ? 'withdrawal' : 'All') ? 'bg-[#D4AF37] text-black' : 'text-[#9CA3AF] hover:text-white'}`}>{t}</button>
            ))}
          </div>

          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 bg-black/40 border border-[#1F2937] rounded-xl text-xs text-[#9CA3AF] focus:outline-none focus:border-[#D4AF37]/40">
            <option value="All">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <div className="relative ml-auto">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search..." className="pl-8 pr-4 py-2 bg-black/40 border border-[#1F2937] rounded-xl text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37]/40 w-44" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F2937]">
                {['TX ID', 'User', 'Type', 'Method', 'Amount', 'Date', 'Status'].map(h => (
                  <th key={h} className="text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-widest pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((tx, i) => (
                <motion.tr key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-b border-[#1F2937]/50 hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pr-4 font-mono text-[10px] text-[#9CA3AF]">{tx.id}</td>
                  <td className="py-3.5 pr-4 text-xs font-semibold text-white">{tx.user}</td>
                  <td className="py-3.5 pr-4">
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${tx.type === 'deposit' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.type === 'deposit' ? <ArrowDownCircle size={13} /> : <ArrowUpCircle size={13} />}
                      <span className="capitalize">{tx.type}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-xs text-white">{tx.method}</td>
                  <td className="py-3.5 pr-4">
                    <span className={`text-xs font-bold ${tx.type === 'deposit' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-[10px] text-[#9CA3AF] whitespace-nowrap">{tx.date}</td>
                  <td className="py-3.5"><StatusBadge status={tx.status} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {paginated.length === 0 && <p className="text-center py-10 text-[#9CA3AF] text-sm">No transactions found.</p>}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#1F2937]">
          <p className="text-xs text-[#9CA3AF]">Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} transactions</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 bg-[#111827] border border-[#1F2937] rounded-lg text-xs text-white disabled:opacity-40 hover:border-[#D4AF37]/40 transition-colors">Prev</button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 bg-[#111827] border border-[#1F2937] rounded-lg text-xs text-white disabled:opacity-40 hover:border-[#D4AF37]/40 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
