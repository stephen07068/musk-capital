import React from 'react';
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { userGrowthData, depositChartData, withdrawalChartData } from '../../data/mockData';
import PageHeader from '../../components/ui/PageHeader';

const platformActivityData = [
  { day: 'Mon', visits: 12000, trades: 4500 },
  { day: 'Tue', visits: 15000, trades: 5200 },
  { day: 'Wed', visits: 14000, trades: 4800 },
  { day: 'Thu', visits: 18000, trades: 6100 },
  { day: 'Fri', visits: 22000, trades: 8500 },
  { day: 'Sat', visits: 19000, trades: 7000 },
  { day: 'Sun', visits: 24000, trades: 9200 },
];

const Tooltip_ = ({ active, payload, label, prefix = '' }) =>
  active && payload?.length ? (
    <div className="bg-[#0D0F14] border border-[#1F2937] px-3 py-2 rounded-xl text-xs">
      <p className="text-[#9CA3AF] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-white font-bold" style={{ color: p.color }}>{p.name}: {prefix}{p.value.toLocaleString()}</p>
      ))}
    </div>
  ) : null;

export default function Analytics() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader title="Platform Analytics" subtitle="Deep dive into platform usage and financial metrics" />

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* User Growth */}
        <div className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-5">
          <p className="text-sm font-bold text-white mb-4">User Registration Growth</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="ug" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} /><stop offset="95%" stopColor="#D4AF37" stopOpacity={0} /></linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<Tooltip_ />} />
                <Area type="monotone" dataKey="users" name="Users" stroke="#D4AF37" strokeWidth={2} fill="url(#ug)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Activity */}
        <div className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-5">
          <p className="text-sm font-bold text-white mb-4">Weekly Platform Activity</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={platformActivityData}>
                <defs>
                  <linearGradient id="pa1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3B82F6" stopOpacity={0} /></linearGradient>
                  <linearGradient id="pa2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<Tooltip_ />} />
                <Area type="monotone" dataKey="visits" name="Page Visits" stroke="#3B82F6" strokeWidth={2} fill="url(#pa1)" />
                <Area type="monotone" dataKey="trades" name="Trades" stroke="#10B981" strokeWidth={2} fill="url(#pa2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deposits vs Withdrawals */}
        <div className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-5 lg:col-span-2">
          <p className="text-sm font-bold text-white mb-4">Financial Flow (Deposits vs Withdrawals)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={depositChartData.map((d, i) => ({ month: d.month, deposits: d.amount, withdrawals: withdrawalChartData[i].amount }))} barSize={20}>
                <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} width={60} tickFormatter={v => `$${(v/1000)}k`} />
                <Tooltip content={<Tooltip_ prefix="$" />} />
                <Bar dataKey="deposits" name="Deposits" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="withdrawals" name="Withdrawals" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-5">
          <p className="text-sm font-bold text-white mb-4">Top Companies (Holdings)</p>
          <div className="space-y-3">
            {[{ n: 'Tesla', v: '$45M' }, { n: 'SpaceX', v: '$32M' }, { n: 'xAI', v: '$18M' }].map(c => (
              <div key={c.n} className="flex justify-between items-center text-sm">
                <span className="text-[#9CA3AF]">{c.n}</span>
                <span className="text-white font-bold">{c.v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-5">
          <p className="text-sm font-bold text-white mb-4">Most Popular Assets</p>
          <div className="space-y-3">
            {[{ n: 'Bitcoin (BTC)', v: '12,400 trades' }, { n: 'Ethereum (ETH)', v: '8,200 trades' }, { n: 'Tesla (TSLA)', v: '6,500 trades' }].map(c => (
              <div key={c.n} className="flex justify-between items-center text-sm">
                <span className="text-[#9CA3AF]">{c.n}</span>
                <span className="text-white font-bold">{c.v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-5">
          <p className="text-sm font-bold text-white mb-4">Active Demographics</p>
          <div className="space-y-3">
            {[{ n: 'USA', v: '45%' }, { n: 'UK', v: '15%' }, { n: 'Canada', v: '12%' }, { n: 'Other', v: '28%' }].map(c => (
              <div key={c.n} className="flex justify-between items-center text-sm">
                <span className="text-[#9CA3AF]">{c.n}</span>
                <span className="text-white font-bold">{c.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
