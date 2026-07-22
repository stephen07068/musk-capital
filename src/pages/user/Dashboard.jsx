import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, ArrowDownCircle,
  ArrowUpCircle, Activity, Eye, EyeOff, ArrowRight,
  Wallet, Target, Zap, BarChart2
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell
} from 'recharts';
import {
  portfolioData, portfolioHistory, marketData, newsArticles,
  transactionsData, watchlistData, generateSparkline
} from '../../data/mockData';
import StatCard from '../../components/ui/StatCard';
import { useAuth } from '../../context/AuthContext';
import { useRealLiveMarketData } from '../../hooks/useRealLiveData';
import { useLiveChartData } from '../../hooks/useLiveData';
import LiveIndicator from '../../components/ui/LiveIndicator';

const perfData = [
  { date: 'Nov', val: 80000 }, { date: 'Dec', val: 88000 },
  { date: 'Jan', val: 84000 }, { date: 'Feb', val: 95000 },
  { date: 'Mar', val: 102000 }, { date: 'Apr', val: 110000 },
  { date: 'May', val: 125430 },
];

const monthlyGrowth = [
  { month: 'Nov', gain: 3.2 }, { month: 'Dec', gain: 5.8 },
  { month: 'Jan', gain: -1.4 }, { month: 'Feb', gain: 8.1 },
  { month: 'Mar', gain: 4.2 }, { month: 'Apr', gain: 6.5 },
  { month: 'May', gain: 3.51 },
];

const pieColors = ['#EF4444', '#F97316', '#6366F1', '#6B7280', '#374151'];

const CustomAreaTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#0D0F14] border border-[#1F222A] px-3 py-2 rounded-xl text-xs">
        <p className="text-[#9CA3AF]">{label}</p>
        <p className="text-white font-bold">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [hideBalance, setHideBalance] = useState(false);
  const displayUser = user || { name: 'John Doe' };

  // Live data hooks
  const { data: liveMarketData } = useRealLiveMarketData(10000); // Update every 10 seconds
  const liveWatchlist = watchlistData; // Keep watchlist static for now
  const livePerformance = useLiveChartData(perfData, 5000, 20);

  const stats = [
    { icon: Wallet, label: 'Portfolio Value', value: hideBalance ? '••••••' : '$125,430.46', color: '#D4AF37', sub: '+3.51% today', positive: true },
    { icon: TrendingUp, label: 'Total Profit / Loss', value: hideBalance ? '••••••' : '+$27,180.46', color: '#10B981', sub: '+27.60%', positive: true },
    { icon: ArrowDownCircle, label: 'Total Deposits', value: hideBalance ? '••••••' : '$98,250.00', color: '#6366F1' },
    { icon: ArrowUpCircle, label: 'Total Withdrawals', value: hideBalance ? '••••••' : '$15,000.00', color: '#EF4444' },
    { icon: Target, label: 'Active Investments', value: '4', color: '#F97316', sub: 'Assets' },
    { icon: Activity, label: 'Market Status', value: 'Open', color: '#10B981', sub: '🟢 Live', positive: true },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">
            Good morning, {displayUser.name?.split(' ')[0] || 'Investor'} 👋
          </h1>
          <p className="text-sm text-[#9CA3AF] mt-0.5">Here's your portfolio summary for today.</p>
        </div>
        <button
          onClick={() => setHideBalance((h) => !h)}
          className="flex items-center gap-2 text-xs text-[#9CA3AF] hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5"
        >
          {hideBalance ? <Eye size={16} /> : <EyeOff size={16} />}
          <span className="hidden sm:inline">{hideBalance ? 'Show' : 'Hide'} Balance</span>
        </button>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.06} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Portfolio Performance */}
        <div className="lg:col-span-2 bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <p className="text-xs text-[#9CA3AF] font-semibold uppercase tracking-widest">Portfolio Performance</p>
                <LiveIndicator size="xs" />
              </div>
              <p className="text-2xl font-black text-white mt-1">{hideBalance ? '••••••' : '$125,430.46'}</p>
              <p className="text-xs text-emerald-400 font-semibold mt-0.5">▲ +$27,180.46 (27.60%)</p>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={livePerformance}>
                <defs>
                  <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip content={<CustomAreaTooltip />} />
                <Area type="monotone" dataKey="val" stroke="#D4AF37" strokeWidth={2} fill="url(#portfolioGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-5">
          <p className="text-xs text-[#9CA3AF] font-semibold uppercase tracking-widest mb-4">Asset Allocation</p>
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <PieChart width={160} height={160}>
                <Pie data={portfolioData.holdings} cx={75} cy={75} innerRadius={50} outerRadius={75} dataKey="percent" strokeWidth={0}>
                  {portfolioData.holdings.map((h, i) => <Cell key={i} fill={pieColors[i]} />)}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xs text-[#9CA3AF]">Total</p>
                <p className="text-sm font-black text-white">{hideBalance ? '••••' : '$125K'}</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {portfolioData.holdings.map((h, i) => (
              <div key={h.asset} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: pieColors[i] }} />
                  <span className="text-xs text-[#9CA3AF] truncate max-w-[100px]">{h.asset.split(' ')[0]}</span>
                </div>
                <span className="text-xs font-bold text-white">{h.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Growth */}
      <div className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-5">
        <p className="text-xs text-[#9CA3AF] font-semibold uppercase tracking-widest mb-4">Monthly Growth</p>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyGrowth} barSize={28}>
              <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <div className="bg-[#0D0F14] border border-[#1F222A] px-3 py-2 rounded-xl text-xs">
                      <p className="text-[#9CA3AF]">{label}</p>
                      <p className={payload[0].value >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        {payload[0].value >= 0 ? '+' : ''}{payload[0].value}%
                      </p>
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="gain" radius={[4, 4, 0, 0]}>
                {monthlyGrowth.map((d, i) => (
                  <Cell key={i} fill={d.gain >= 0 ? '#10B981' : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Watchlist */}
        <div className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <p className="text-xs text-[#9CA3AF] font-semibold uppercase tracking-widest">Watchlist</p>
              <LiveIndicator size="xs" />
            </div>
            <Link to="/dashboard/watchlist" className="text-xs text-[#D4AF37] hover:text-[#F0D060] flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {liveWatchlist.slice(0, 4).map((item) => (
              <div key={item.symbol} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: item.color + '22', color: item.color }}>
                    {item.symbol.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{item.symbol}</p>
                    <p className="text-[10px] text-[#9CA3AF] truncate max-w-[80px]">{item.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-white">${item.price >= 1000 ? item.price.toLocaleString() : item.price.toFixed(2)}</p>
                  <p className={`text-[10px] font-semibold ${item.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {item.changePercent >= 0 ? '▲' : '▼'} {Math.abs(item.changePercent).toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest News */}
        <div className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-[#9CA3AF] font-semibold uppercase tracking-widest">Latest News</p>
            <Link to="/dashboard/news" className="text-xs text-[#D4AF37] hover:text-[#F0D060] flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {newsArticles.slice(0, 3).map((article) => (
              <div key={article.id} className="flex gap-3 group cursor-pointer">
                <img src={article.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-white line-clamp-2 group-hover:text-[#D4AF37] transition-colors">{article.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-[#D4AF37]">{article.category}</span>
                    <span className="text-[10px] text-[#6B7280]">{article.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-[#9CA3AF] font-semibold uppercase tracking-widest">Recent Transactions</p>
            <Link to="/dashboard/transactions" className="text-xs text-[#D4AF37] hover:text-[#F0D060] flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {transactionsData.slice(0, 4).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${tx.type === 'deposit' ? 'bg-emerald-400/10' : 'bg-red-400/10'}`}>
                    {tx.type === 'deposit'
                      ? <ArrowDownCircle size={14} className="text-emerald-400" />
                      : <ArrowUpCircle size={14} className="text-red-400" />
                    }
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{tx.description}</p>
                    <p className="text-[10px] text-[#9CA3AF]">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-bold ${tx.type === 'deposit' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                  </p>
                  <span className={`text-[10px] font-bold capitalize px-1.5 py-0.5 rounded-full ${
                    tx.status === 'approved' ? 'text-emerald-400 bg-emerald-400/10' :
                    tx.status === 'pending' ? 'text-yellow-400 bg-yellow-400/10' : 'text-red-400 bg-red-400/10'
                  }`}>{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Deposit Funds', icon: ArrowDownCircle, to: '/dashboard/deposit', color: '#10B981' },
          { label: 'Withdraw', icon: ArrowUpCircle, to: '/dashboard/withdraw', color: '#EF4444' },
          { label: 'View Portfolio', icon: BarChart2, to: '/dashboard/portfolio', color: '#D4AF37' },
          { label: 'Explore Markets', icon: TrendingUp, to: '/dashboard/markets', color: '#6366F1' },
        ].map(({ label, icon: Icon, to, color }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 p-4 bg-[#0D0F14] border border-[#1F222A] rounded-2xl hover:border-[#D4AF37]/30 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + '15' }}>
              <Icon size={18} style={{ color }} />
            </div>
            <span className="text-sm font-semibold text-white group-hover:text-[#D4AF37] transition-colors">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
