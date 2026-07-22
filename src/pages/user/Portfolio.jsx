import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, TrendingUp, TrendingDown, Briefcase } from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell
} from 'recharts';
import { portfolioData, portfolioHistory, generateSparkline } from '../../data/mockData';
import PageHeader from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/DataTable';

const pieColors = ['#EF4444', '#F97316', '#6366F1', '#6B7280', '#374151'];
const timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'];

const TooltipContent = ({ active, payload, label }) =>
  active && payload?.length ? (
    <div className="bg-[#0D0F14] border border-[#1F222A] px-3 py-2 rounded-xl text-xs">
      <p className="text-[#9CA3AF]">{label}</p>
      <p className="text-white font-bold">${payload[0].value.toLocaleString()}</p>
    </div>
  ) : null;

export default function Portfolio() {
  const [search, setSearch] = useState('');
  const [activeTf, setActiveTf] = useState('1Y');

  const filtered = portfolioData.holdings.filter((h) =>
    h.asset.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader
        title="My Portfolio"
        subtitle="Track your investments and performance"
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0D0F14] border border-[#1F222A] rounded-xl text-xs font-semibold text-[#9CA3AF] hover:text-white hover:border-[#D4AF37]/40 transition-all">
            <Download size={14} /> Export
          </button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Value', value: `$${portfolioData.totalValue.toLocaleString()}`, color: '#D4AF37' },
          { label: 'Total Gain', value: `+$${portfolioData.totalGain.toLocaleString()}`, color: '#10B981', green: true },
          { label: 'Invested', value: `$${portfolioData.investedAmount.toLocaleString()}`, color: '#6366F1' },
          { label: 'Cash Balance', value: `$${portfolioData.cashBalance.toLocaleString()}`, color: '#F97316' },
        ].map(({ label, value, color, green }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-4"
          >
            <p className="text-[11px] text-[#9CA3AF] mb-1">{label}</p>
            <p className={`text-lg font-black ${green ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Performance */}
        <div className="lg:col-span-2 bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-white">Performance</p>
            <div className="flex gap-1">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActiveTf(tf)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeTf === tf ? 'bg-[#D4AF37] text-black' : 'text-[#9CA3AF] hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioHistory}>
                <defs>
                  <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip content={<TooltipContent />} />
                <Area type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={2} fill="url(#perfGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Allocation */}
        <div className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-5">
          <p className="text-sm font-bold text-white mb-4">Allocation</p>
          <div className="flex justify-center mb-4">
            <PieChart width={150} height={150}>
              <Pie data={portfolioData.holdings} cx={70} cy={70} innerRadius={45} outerRadius={70} dataKey="percent" strokeWidth={0}>
                {portfolioData.holdings.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-2">
            {portfolioData.holdings.map((h, i) => (
              <div key={h.asset} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: pieColors[i] }} />
                  <span className="text-xs text-[#9CA3AF]">{h.asset.split(' ')[0]}</span>
                </div>
                <span className="text-xs font-bold text-white">{h.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-white">Holdings</p>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets..."
              className="pl-8 pr-3 py-2 bg-[#111827] border border-[#1F222A] rounded-xl text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37]/40 w-48"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F222A]">
                {['Asset', 'Shares', 'Price', 'Value', 'Gain/Loss', 'Allocation'].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-widest pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F222A]/40">
              {filtered.map((h, i) => (
                <tr key={h.asset} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: pieColors[i] + '22', color: pieColors[i] }}>
                        {h.asset.charAt(0)}
                      </div>
                      <span className="text-white font-semibold text-xs">{h.asset}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-[#9CA3AF] text-xs">{h.shares ?? '—'}</td>
                  <td className="py-3.5 pr-4 text-white text-xs">{h.price ? `$${h.price.toFixed(2)}` : '—'}</td>
                  <td className="py-3.5 pr-4 text-white font-semibold text-xs">${h.value.toLocaleString()}</td>
                  <td className="py-3.5 pr-4">
                    {h.gain != null ? (
                      <span className={`text-xs font-semibold flex items-center gap-1 ${h.gain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {h.gain >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {h.gain >= 0 ? '+' : ''}{h.gain}%
                      </span>
                    ) : <span className="text-[#6B7280] text-xs">—</span>}
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#1F222A] rounded-full max-w-[80px]">
                        <div className="h-full rounded-full" style={{ width: `${h.percent}%`, background: pieColors[i] }} />
                      </div>
                      <span className="text-xs text-[#9CA3AF]">{h.percent}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
