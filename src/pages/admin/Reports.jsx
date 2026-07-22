import React, { useState } from 'react';
import { Download, Calendar, BarChart3, Users, Building2, TrendingUp, Newspaper, DollarSign } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';

const reportTypes = [
  { id: 'users', title: 'User Report', icon: Users, desc: 'Registration, activity, and demographics' },
  { id: 'deposits', title: 'Deposits Report', icon: DollarSign, desc: 'Crypto and fiat deposit history' },
  { id: 'withdrawals', title: 'Withdrawals Report', icon: DollarSign, desc: 'Withdrawal requests and status' },
  { id: 'transactions', title: 'Transaction Report', icon: BarChart3, desc: 'Complete platform transaction log' },
  { id: 'companies', title: 'Company Report', icon: Building2, desc: 'Company portfolio metrics' },
  { id: 'markets', title: 'Market Report', icon: TrendingUp, desc: 'Asset performance and volume' },
  { id: 'news', title: 'News & Media Report', icon: Newspaper, desc: 'Article views and engagement' },
];

export default function Reports() {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [generating, setGenerating] = useState(null);

  const handleExport = (id) => {
    setGenerating(id);
    setTimeout(() => setGenerating(null), 1500);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader title="Reports & Exports" subtitle="Generate and download platform data reports" />

      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-[#0D0F14] border border-[#1F2937] p-4 rounded-2xl">
        <div className="flex-1">
          <p className="text-sm font-bold text-white mb-1">Global Date Range</p>
          <p className="text-xs text-[#9CA3AF]">Selected date range applies to all generated reports</p>
        </div>
        <div className="flex items-center gap-3">
          <Calendar size={16} className="text-[#6B7280]" />
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="bg-black/40 border border-[#1F2937] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]">
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {reportTypes.map(({ id, title, icon: Icon, desc }) => (
          <div key={id} className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-5 hover:border-[#D4AF37]/30 transition-all flex flex-col h-full">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#1F2937] flex items-center justify-center text-[#D4AF37]">
                <Icon size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{title}</h3>
                <p className="text-xs text-[#9CA3AF] mt-0.5">{desc}</p>
              </div>
            </div>
            <div className="mt-auto pt-4 border-t border-[#1F2937]">
              <button 
                onClick={() => handleExport(id)} 
                disabled={generating === id}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 text-xs font-semibold text-white hover:bg-[#D4AF37] hover:text-black transition-colors disabled:opacity-50"
              >
                {generating === id ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> Generating...
                  </span>
                ) : (
                  <><Download size={14} /> Export CSV</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
