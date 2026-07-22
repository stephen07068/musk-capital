import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Shield, TrendingUp, Brain, ChevronRight,
  BarChart2, Bitcoin, LineChart, Flame, Mail,
  Rocket, Zap, ShieldAlert, CheckCircle2, PieChart as PieChartIcon,
  Star, Crown
} from 'lucide-react';
import { LineChart as ReLineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { marketData, companies, newsArticles, portfolioData, generateSparkline } from '../../data/mockData';
import CompanyCard from '../../components/ui/CompanyCard';
import NewsCard from '../../components/ui/NewsCard';
import InvestmentPlanSection from '../../components/ui/InvestmentPlanSection';
import heroImg from '../../assets/hero_rocket.png';
import { useRealLiveMarketData } from '../../hooks/useRealLiveData';
import LiveIndicator from '../../components/ui/LiveIndicator';

const getMarketIcon = (symbol) => {
  switch (symbol) {
    case 'TSLA':
      return <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.3 8.3c-.6.3-1.6.5-3.3.5s-2.7-.2-3.3-.5V8.5h6.6v1.8z" /></svg>;
    case 'BTC':
      return <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#F97316]"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.5 13c-1.5.3-2.5.3-4.5.3v2h-1v-2H7v-1h1v-4H7V9h1V7h1v2h3.5c1.5 0 2.5.5 2.5 1.5 0 .8-.6 1.3-1.5 1.5 1 .2 2 .8 2 1.8 0 1-1 1.5-2 1.2zm-2.5-4h-2v2h2c.5 0 1-.2 1-.8 0-.5-.5-1-1-1.2zm.5 4.5h-2.5v2h2.5c.8 0 1.2-.3 1.2-.8 0-.6-.4-1-1.2-1.2z"/></svg>;
    case 'ETH':
      return <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#6366F1]"><path d="M12 2L4 13l8 3 8-3-8-11zm0 15l-8-4 8 8 8-8-8 4z"/></svg>;
    case 'DOGE':
      return <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#EAB308]"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.5 13.5H9v-7h4.5c2 0 3.5 1.5 3.5 3.5s-1.5 3.5-3.5 3.5zm-3-5.5v4h2.5c1 0 2-.8 2-2s-1-2-2-2H10.5z"/></svg>;
    case 'NASDAQ':
      return <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#3B82F6]"><path d="M4 4h16v16H4V4zm3 11h2v-4l4 4h2V7h-2v4l-4-4H7v8z"/></svg>;
    default:
      return <div className="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-bold">{symbol.charAt(0)}</div>;
  }
};

/* ─── Live Markets Panel ─── */
function LiveMarketsPanel() {
  const { data: liveMarketData } = useRealLiveMarketData(10000); // Update every 10 seconds
  
  return (
    <div className="card-dark p-5 min-w-[260px]">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest">Live Markets</h3>
        <LiveIndicator size="xs" />
      </div>
      <div className="space-y-3">
        {liveMarketData.slice(0, 5).map(item => (
          <div key={item.symbol} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {getMarketIcon(item.symbol)}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{item.symbol}</p>
                <p className="text-xs text-[#9CA3AF] truncate max-w-[90px]">{item.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-white">
                {item.price >= 1 ? `$${item.price.toLocaleString()}` : `$${item.price.toFixed(4)}`}
              </p>
              <p className={`text-xs font-medium ${item.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {item.changePercent >= 0 ? '▲' : '▼'} {Math.abs(item.changePercent).toFixed(2)}%
              </p>
            </div>
            <div className="w-14 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart data={generateSparkline(item.price)}>
                  <YAxis domain={['auto', 'auto']} hide />
                  <Line type="monotone" dataKey="value" stroke={item.changePercent >= 0 ? "#10B981" : "#EF4444"} strokeWidth={1.5} dot={false} />
                </ReLineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
      <Link to="/markets" className="flex items-center gap-1 text-xs font-semibold text-[#D4AF37] hover:text-[#F0D060] mt-4 transition-colors">
        View All Markets <ArrowRight size={12} />
      </Link>
    </div>
  );
}

/* ─── Market Overview Card ─── */
function MktOverviewCard({ item }) {
  const data = generateSparkline(item.price);
  return (
    <div className="card-dark p-4 hover-lift flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0">
          {getMarketIcon(item.symbol)}
        </div>
        <div>
          <p className="text-sm font-bold text-white">{item.symbol}</p>
          <p className="text-xs text-emerald-400 font-medium">▲ {item.changePercent.toFixed(2)}%</p>
        </div>
      </div>
      <p className="text-base font-bold text-white">
        {item.price >= 1000 ? `$${item.price.toLocaleString()}` : item.price >= 1 ? `$${item.price.toFixed(2)}` : `$${item.price.toFixed(4)}`}
      </p>
      <div className="h-8">
        <ResponsiveContainer width="100%" height="100%">
          <ReLineChart data={data}>
            <YAxis domain={['auto', 'auto']} hide />
            <Line type="monotone" dataKey="value" stroke={item.changePercent >= 0 ? "#10B981" : "#EF4444"} strokeWidth={1.5} dot={false} />
          </ReLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ─── Investment Plan Card ─── */
function InvestmentPlanCard() {
  const planData = [
    { name: 'xAI', value: 40, color: '#3B82F6' },
    { name: 'SpaceX', value: 30, color: '#F97316' },
    { name: 'Neuralink', value: 15, color: '#8B5CF6' },
    { name: 'Tesla', value: 10, color: '#EF4444' },
    { name: 'Boring Co', value: 5, color: '#EAB308' },
  ];

  return (
    <div className="relative bg-gradient-to-br from-[#0D0F14] to-[#050505] border border-[#D4AF37]/20 rounded-2xl p-6 overflow-hidden shadow-2xl group hover:border-[#D4AF37]/40 transition-all h-full flex flex-col">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Premium Tier</p>
          <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">10x-50x ROI</span>
        </div>
        
        <h3 className="text-xl font-black text-white mb-1">Aggressive Growth</h3>
        <p className="text-xs text-[#9CA3AF] mb-6">High-yield Private Equity Portfolio</p>

        {/* Holdings Donut */}
        <div className="flex items-center gap-4 mb-6 flex-1">
          <div className="shrink-0">
            <PieChart width={100} height={100}>
              <Pie data={planData} cx={45} cy={45} innerRadius={30} outerRadius={45} dataKey="value" strokeWidth={0}>
                {planData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="flex-1 space-y-2">
            {planData.slice(0, 4).map(h => (
              <div key={h.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: h.color }} />
                  <span className="text-[11px] font-semibold text-[#9CA3AF] truncate">{h.name}</span>
                </div>
                <span className="text-xs font-bold text-white">{h.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <Link to="/dashboard/plans" className="mt-auto w-full py-3 bg-white/5 hover:bg-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-white hover:text-black rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
          <Flame size={16} /> View Investment Plan
        </Link>
      </div>
    </div>
  );
}

/* ─── AI Insights Card ─── */
function AIInsightsCard() {
  return (
    <div className="card-dark p-6 h-full flex flex-col">
      <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-4">AI Market Insights</p>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-4">
          <Brain size={32} className="text-[#D4AF37]" />
        </div>
        <p className="text-sm text-[#9CA3AF] leading-relaxed mb-4">
          Technology and AI-related stocks are showing strong momentum with increased investor interest.
        </p>
        <p className="text-sm text-[#9CA3AF] leading-relaxed mb-6">
          Long-term outlook remains positive across all sectors associated with innovation.
        </p>
        <Link to="/dashboard/ai-insights" className="flex items-center gap-1.5 text-sm font-semibold text-[#D4AF37] hover:text-[#F0D060] transition-colors">
          View Full Insights <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

const planData = [
  { name: 'xAI', value: 40, color: '#3B82F6', type: 'Private', roi: '50x' },
  { name: 'SpaceX', value: 30, color: '#F97316', type: 'Private', roi: '10x' },
  { name: 'Neuralink', value: 15, color: '#8B5CF6', type: 'Private', roi: '25x' },
  { name: 'Tesla (TSLA)', value: 10, color: '#EF4444', type: 'Public', roi: '3x' },
  { name: 'The Boring Co.', value: 5, color: '#EAB308', type: 'Private', roi: '15x' },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0D0F14] border border-[#1F222A] px-4 py-3 rounded-xl shadow-2xl z-50">
        <p className="text-white font-bold mb-1" style={{ color: data.color }}>{data.name}</p>
        <p className="text-xs text-[#9CA3AF]">Allocation: <span className="text-white font-semibold">{data.value}%</span></p>
        <p className="text-xs text-[#9CA3AF]">Target ROI: <span className="text-emerald-400 font-semibold">{data.roi}</span></p>
      </div>
    );
  }
  return null;
};

/* ─── Main Home Page ─── */
export default function Home() {
  const { data: liveMarketData } = useRealLiveMarketData(30000); // Get real market data
  
  return (
    <div className="min-h-screen bg-[#07090D]">
      {/* ── Hero ── */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#07090D] via-[#07090D]/70 to-[#07090D]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090D] via-transparent to-[#07090D]/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="flex-1 max-w-2xl">
              

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6"
              >
                Investing in the <br />
                <span className="text-[#D4AF37]">Future of Innovation</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg text-[#9CA3AF] mb-8 leading-relaxed max-w-lg"
              >
                Explore Elon Musk's companies, track global markets,<br className="hidden sm:block" />
                and build your portfolio around the future.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-10"
              >
                <Link
                  to="/companies"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-semibold rounded hover:bg-[#F0D060] transition-colors text-sm"
                >
                  Explore Companies <ChevronRight size={16} />
                </Link>
                <Link
                  to="/dashboard/plans"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-[#374151] text-white font-semibold rounded hover:border-[#D4AF37] transition-all text-sm"
                >
                  <Rocket size={16} className="text-[#D4AF37]" /> View Investment Plans
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-6 text-xs text-[#9CA3AF]"
              >
                {[
                  { icon: Shield, label: 'Secure & Trusted', sub: 'Bank-level security' },
                  { icon: TrendingUp, label: 'Real-time Data', sub: 'Live market updates' },
                  { icon: Brain, label: 'AI Insights', sub: 'Smarter decisions' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-3">
                    <Icon size={20} className="text-[#D4AF37]" />
                    <div>
                      <p className="font-bold text-white text-xs">{label}</p>
                      <p className="text-[10px] text-[#9CA3AF]">{sub}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Live Markets Panel */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block shrink-0"
            >
              <LiveMarketsPanel />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Companies Section ── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-2">Musk's Companies</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Building the Future, Today</h2>
          </div>
          <Link to="/companies" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#D4AF37] hover:text-[#F0D060] transition-colors">
            View All Companies <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {companies.map((company, i) => (
            <CompanyCard key={company.id} company={company} index={i} />
          ))}
        </div>
      </section>

      {/* ── Tiered Investment Plans ── */}
      <InvestmentPlanSection />

      {/* ── Market Overview ── */}
      <section className="py-12 border-t border-[#1F2937]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Market Overview</p>
            <Link to="/markets" className="flex items-center gap-1 text-sm font-semibold text-[#D4AF37] hover:text-[#F0D060] transition-colors">
              View All Markets <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {liveMarketData.slice(0, 6).map(item => (
              <MktOverviewCard key={item.symbol} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3-Column Section: News | Investment Plan | AI Insights ── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Latest News */}
          <div className="card-dark p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Latest News</p>
              <Link to="/news" className="flex items-center gap-1 text-xs font-semibold text-[#D4AF37] hover:text-[#F0D060] transition-colors">
                View All News <ArrowRight size={11} />
              </Link>
            </div>
            <div className="space-y-4">
              {newsArticles.slice(0, 4).map(article => (
                <div key={article.id} className="flex items-center gap-3 group">
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/news/${article.id}`} className="text-sm font-semibold text-white hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </Link>
                    <p className="text-xs text-[#6B7280] mt-1">{article.category} · {article.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Investment Plan Preview */}
          <InvestmentPlanCard />

          {/* AI Insights */}
          <AIInsightsCard />
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="py-16 border-t border-[#1F2937]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl glass-gold flex items-center justify-center shrink-0">
                <Mail size={24} className="text-[#D4AF37]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Stay Ahead of the Future</h2>
                <p className="text-sm text-[#9CA3AF] mt-1">Subscribe to receive curated market insights, company updates, and exclusive reports.</p>
              </div>
            </div>
            <form className="flex gap-2 w-full md:w-auto min-w-[340px]" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 bg-[#111827] border border-[#1F2937] rounded-xl text-white placeholder-[#9CA3AF] text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
              <button type="submit" className="px-5 py-2.5 gold-gradient text-black text-sm font-bold rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 text-center bg-gradient-to-b from-transparent to-[#0D0F14]">
        <div className="max-w-2xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-black text-white mb-4"
          >
            Start Your Investment Journey Today
          </motion.h2>
          <p className="text-[#9CA3AF] mb-8">Join thousands of users exploring the future of innovation.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="px-8 py-3 gold-gradient text-black font-bold rounded-xl hover:opacity-90 transition-opacity">
              Register Now
            </Link>
            <Link to="/markets" className="px-8 py-3 glass border border-white/10 text-white font-semibold rounded-xl hover:border-[#D4AF37]/40 transition-all">
              Explore Markets
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
