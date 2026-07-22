import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Download, TrendingUp, TrendingDown,
  Users, Briefcase, ArrowLeftRight, DollarSign,
  CheckCircle, Clock, Building2, Newspaper, AlertCircle,
  Server, Database, Wifi, Mail, Activity
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar,
  ResponsiveContainer, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell
} from 'recharts';
import {
  adminUsers, adminDeposits, adminWithdrawals,
  adminTransactions, userGrowthData, depositChartData, withdrawalChartData
} from '../../data/mockData';
import PageHeader from '../../components/ui/PageHeader';

const statCards = [
  { icon: Users, label: 'Total Users', value: '4,752', change: '+12.5%', iconColor: '#D4AF37' },
  { icon: Users, label: 'Active Users', value: '1,243', change: '+8.3%', iconColor: '#10B981' },
  { icon: DollarSign, label: 'Total Deposits', value: '$2.4M', change: '+15.4%', iconColor: '#3B82F6' },
  { icon: ArrowLeftRight, label: 'Total Withdrawals', value: '$340K', change: '+6.2%', iconColor: '#EF4444' },
  { icon: Briefcase, label: 'Transactions', value: '12,458', change: '+11.2%', iconColor: '#8B5CF6' },
  { icon: TrendingUp, label: 'Platform Revenue', value: '$342K', change: '+13.8%', iconColor: '#D4AF37' },
  { icon: Building2, label: 'Companies', value: '6', change: 'Stable', iconColor: '#F97316' },
  { icon: Newspaper, label: 'News Articles', value: '5', change: '+2 this week', iconColor: '#6B7280' },
  { icon: AlertCircle, label: 'Pending Approvals', value: '8', change: 'Needs action', iconColor: '#EF4444', urgent: true },
];

const planData = [
  { name: 'Free', value: 2031, color: '#6B7280' },
  { name: 'Premium', value: 1842, color: '#D4AF37' },
  { name: 'Pro', value: 654, color: '#3B82F6' },
  { name: 'Enterprise', value: 225, color: '#8B5CF6' },
];

const Tooltip_ = ({ active, payload, label, prefix = '' }) =>
  active && payload?.length ? (
    <div className="bg-[#0D0F14] border border-[#1F2937] px-3 py-2 rounded-xl text-xs">
      <p className="text-[#9CA3AF]">{label}</p>
      <p className="text-white font-bold">{prefix}{payload[0].value.toLocaleString()}</p>
    </div>
  ) : null;

export default function AdminDashboard() {
  const pendingDeposits = adminDeposits.filter(d => d.status === 'pending').length;
  const pendingWithdrawals = adminWithdrawals.filter(w => w.status === 'pending').length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Platform analytics and management overview"
        actions={
          <button className="flex items-center gap-2 px-4 py-2 gold-gradient text-black text-xs font-bold rounded-xl hover:opacity-90">
            <Download size={13} /> Export Report
          </button>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        {statCards.map(({ icon: Icon, label, value, change, iconColor, urgent }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-[#0D0F14] border rounded-2xl p-4 hover:border-[#D4AF37]/20 transition-all ${urgent ? 'border-red-400/30 bg-red-400/5' : 'border-[#1F2937]'}`}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: iconColor + '22' }}>
              <Icon size={18} style={{ color: iconColor }} />
            </div>
            <p className="text-[10px] text-[#9CA3AF] mb-1">{label}</p>
            <p className="text-lg font-black text-white">{value}</p>
            <p className={`text-[10px] font-semibold mt-0.5 ${urgent ? 'text-red-400' : 'text-emerald-400'}`}>{change}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* User Growth */}
        <div className="lg:col-span-2 bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-white">User Growth</p>
              <p className="text-xs text-[#9CA3AF]">Total registered users over time</p>
            </div>
            <p className="text-xl font-black text-[#D4AF37]">4,752</p>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="ugGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<Tooltip_ />} />
                <Area type="monotone" dataKey="users" stroke="#D4AF37" strokeWidth={2} fill="url(#ugGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users by Plan */}
        <div className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-5">
          <p className="text-sm font-bold text-white mb-4">Users by Plan</p>
          <div className="flex justify-center mb-3">
            <PieChart width={130} height={130}>
              <Pie data={planData} cx={60} cy={60} innerRadius={38} outerRadius={58} dataKey="value" strokeWidth={0}>
                {planData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-2">
            {planData.map(p => (
              <div key={p.name} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                  <span className="text-xs text-[#9CA3AF]">{p.name}</span>
                </div>
                <span className="text-xs font-bold text-white">{p.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deposits & Withdrawals charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-5">
          <p className="text-sm font-bold text-white mb-1">Deposits Overview</p>
          <p className="text-xs text-[#9CA3AF] mb-4">Monthly deposit volume</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={depositChartData} barSize={24}>
                <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={(p) => <Tooltip_ {...p} prefix="$" />} />
                <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-5">
          <p className="text-sm font-bold text-white mb-1">Withdrawals Overview</p>
          <p className="text-xs text-[#9CA3AF] mb-4">Monthly withdrawal volume</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={withdrawalChartData} barSize={24}>
                <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={(p) => <Tooltip_ {...p} prefix="$" />} />
                <Bar dataKey="amount" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Users */}
        <div className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F2937]">
            <p className="text-sm font-bold text-white">Recent Users</p>
            <Link to="/admin/users" className="text-xs text-[#D4AF37] font-semibold hover:text-[#F0D060]">View All →</Link>
          </div>
          <div className="divide-y divide-[#1F2937]/50">
            {adminUsers.slice(0, 5).map((u) => (
              <div key={u.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-black text-xs font-bold shrink-0">{u.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{u.name}</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">{u.email}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.status === 'active' ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
                  {u.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F2937]">
            <p className="text-sm font-bold text-white">Pending Approvals</p>
            <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">8 pending</span>
          </div>
          <div className="divide-y divide-[#1F2937]/50">
            {[
              { label: 'Crypto Deposits', count: pendingDeposits, color: '#10B981', to: '/admin/deposits' },
              { label: 'Gift Cards', count: 3, color: '#D4AF37', to: '/admin/gift-cards' },
              { label: 'Withdrawals', count: pendingWithdrawals, color: '#EF4444', to: '/admin/withdrawals' },
            ].map((item) => (
              <Link key={item.label} to={item.to} className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: item.color }} />
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                </div>
                <span className="text-sm font-black" style={{ color: item.color }}>{item.count} pending</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-5">
        <p className="text-sm font-bold text-white mb-4">System Status</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { icon: Server, label: 'Server' },
            { icon: Database, label: 'Database' },
            { icon: Wifi, label: 'API Services' },
            { icon: Mail, label: 'Email' },
            { icon: Activity, label: 'Market Feed' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 p-3 bg-emerald-400/5 border border-emerald-400/20 rounded-xl">
              <Icon size={14} className="text-emerald-400" />
              <div>
                <p className="text-[10px] text-[#9CA3AF]">{label}</p>
                <p className="text-[10px] font-bold text-emerald-400">Operational</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
