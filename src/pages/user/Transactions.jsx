import React, { useState } from 'react';
import { Search, Download, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import DataTable, { StatusBadge } from '../../components/ui/DataTable';
import { transactionsAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';

const types = ['All', 'Deposit', 'Withdrawal', 'Gift_Card'];
const statuses = ['All', 'Approved', 'Pending', 'Rejected'];

export default function Transactions() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const { data, loading } = useApi(() => transactionsAPI.getAll({
    type: typeFilter === 'All' ? undefined : typeFilter.toLowerCase(),
    status: statusFilter === 'All' ? undefined : statusFilter.toLowerCase(),
  }), { transactions: [] }, [typeFilter, statusFilter]);

  const filtered = (data?.transactions || []).filter((tx) => {
    const searchLower = search.toLowerCase();
    const matchSearch = String(tx.id).includes(searchLower) || 
                        (tx.method || '').toLowerCase().includes(searchLower);
    return matchSearch;
  });

  const columns = [
    { key: 'id', label: 'TX ID', render: (val) => <span className="font-mono text-[10px] text-[#9CA3AF]">#{val}</span> },
    { key: 'date', label: 'Date', render: (val) => <span className="text-xs text-[#9CA3AF]">{val}</span> },
    { key: 'type', label: 'Type', render: (val) => (
      <div className="flex items-center gap-2 capitalize">
        {val === 'withdrawal' ? <ArrowUpCircle size={14} className="text-red-400" /> : <ArrowDownCircle size={14} className="text-emerald-400" />}
        <span className="font-semibold text-white text-xs">{val.replace('_', ' ')}</span>
      </div>
    )},
    { key: 'method', label: 'Method', render: (val) => <span className="text-xs text-white">{val}</span> },
    { key: 'amount', label: 'Amount', render: (val, row) => (
      <span className={`text-xs font-bold ${row.type === 'withdrawal' ? 'text-red-400' : 'text-emerald-400'}`}>
        {row.type === 'withdrawal' ? '-' : '+'}${val.toLocaleString(undefined, {minimumFractionDigits: 2})}
      </span>
    )},
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader
        title="Transactions"
        subtitle="View and manage your account activity"
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0D0F14] border border-[#1F222A] rounded-xl text-xs font-semibold text-[#9CA3AF] hover:text-white hover:border-[#D4AF37]/40 transition-all">
            <Download size={14} /> Export CSV
          </button>
        }
      />

      <div className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search TX ID or method..."
              className="w-full pl-8 pr-4 py-2 bg-black/40 border border-[#1F222A] rounded-xl text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37]/40"
            />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-black/40 border border-[#1F222A] rounded-xl text-xs text-[#9CA3AF] focus:outline-none focus:border-[#D4AF37]/40"
          >
            {types.map((t) => <option key={t} value={t}>{t.replace('_', ' ')} Type</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-black/40 border border-[#1F222A] rounded-xl text-xs text-[#9CA3AF] focus:outline-none focus:border-[#D4AF37]/40"
          >
            {statuses.map((s) => <option key={s} value={s}>{s} Status</option>)}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-10 text-[#9CA3AF] text-sm animate-pulse">Loading transactions...</div>
        ) : (
          <DataTable columns={columns} data={filtered} emptyMessage="No transactions found matching your filters." />
        )}
      </div>
    </div>
  );
}
