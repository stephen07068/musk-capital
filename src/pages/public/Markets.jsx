import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, TrendingDown, BarChart2, Bitcoin, Globe } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { marketData, stockAssets, cryptoAssets, generateSparkline } from '../../data/mockData';
import { useRealLiveMarketData } from '../../hooks/useRealLiveData';
import LiveIndicator from '../../components/ui/LiveIndicator';

const tabs = ['All', 'Stocks', 'Crypto', 'Indices'];

function AssetRow({ asset, index }) {
  const isPos = asset.change >= 0;
  const data = generateSparkline(asset.price);
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="border-b border-[#1F2937] hover:bg-white/2 transition-colors group"
    >
      <td className="py-4 px-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: (asset.color || '#D4AF37') + '22', color: asset.color || '#D4AF37' }}>
            {asset.symbol.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{asset.symbol}</p>
            <p className="text-xs text-[#9CA3AF]">{asset.name}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-5 text-sm font-semibold text-white">
        {asset.price >= 1000
          ? `$${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
          : asset.price >= 1 ? `$${asset.price.toFixed(2)}` : `$${asset.price.toFixed(4)}`}
      </td>
      <td className="py-4 px-5">
        <span className={`flex items-center gap-1 text-sm font-semibold ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPos ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {isPos ? '+' : ''}{asset.change.toFixed(2)}%
        </span>
      </td>
      <td className="py-4 px-5 text-sm text-[#9CA3AF]">{asset.marketCap}</td>
      <td className="py-4 px-5 text-sm text-[#9CA3AF]">{asset.volume}</td>
      <td className="py-4 px-5">
        <div className="w-24 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line type="monotone" dataKey="value" stroke={isPos ? '#10B981' : '#EF4444'} strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </td>
    </motion.tr>
  );
}

export default function Markets() {
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');

  // Use real live data hook
  const { data: liveMarketData } = useRealLiveMarketData(10000); // Update every 10 seconds

  // Separate assets by type
  const liveStocks = liveMarketData.filter(a => a.type === 'stock');
  const liveCrypto = liveMarketData.filter(a => a.type === 'crypto');
  const liveIndices = liveMarketData.filter(a => a.type === 'index');

  // Combine all assets with proper formatting
  const allAssets = liveMarketData.map(asset => ({
    symbol: asset.symbol,
    name: asset.name,
    price: asset.price,
    change: asset.changePercent,
    marketCap: asset.marketCap || '—',
    volume: asset.volume || '—',
    color: asset.color,
    type: asset.type
  }));

  const filtered = allAssets.filter(a => {
    const matchSearch = a.symbol.toLowerCase().includes(search.toLowerCase()) || a.name.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === 'All' || (tab === 'Stocks' && a.type === 'stock') || (tab === 'Crypto' && a.type === 'crypto') || (tab === 'Indices' && a.type === 'index');
    return matchSearch && matchTab;
  });

  return (
    <div className="min-h-screen bg-[#07090D] pt-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0D0F14] to-transparent py-14 border-b border-[#1F2937]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-2">
            <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Markets</p>
            <LiveIndicator size="sm" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black text-white mb-3">
            Live Market Data
          </motion.h1>
          <p className="text-[#9CA3AF]">Real-time stocks, cryptocurrency, and indices — all in one place.</p>
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-10">
          {liveMarketData.slice(0, 6).map(item => {
            const data = generateSparkline(item.price);
            const isPos = item.changePercent >= 0;
            return (
              <div key={item.symbol} className="card-dark p-4 hover-lift">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: item.color + '22', color: item.color }}>
                    {item.symbol.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-white">{item.symbol}</span>
                </div>
                <p className="text-sm font-bold text-white mb-1">
                  {item.price >= 1000 ? `$${item.price.toLocaleString()}` : item.price >= 1 ? `$${item.price.toFixed(2)}` : `$${item.price.toFixed(4)}`}
                </p>
                <span className={`text-xs font-semibold ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPos ? '▲' : '▼'} {Math.abs(item.changePercent).toFixed(2)}%
                </span>
                <div className="h-8 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <Line type="monotone" dataKey="value" stroke={isPos ? '#10B981' : '#EF4444'} strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search assets..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-[#1F2937] rounded-xl text-white placeholder-[#9CA3AF] text-sm focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>
          <div className="flex gap-2">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all ${tab === t ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'border-[#1F2937] text-[#9CA3AF] hover:border-[#D4AF37]/40 hover:text-white'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1F2937]">
                  {['Asset', 'Price', '24h Change', 'Market Cap', 'Volume', '7D Chart'].map(h => (
                    <th key={h} className="py-3 px-5 text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((asset, i) => <AssetRow key={`${asset.symbol}-${i}`} asset={asset} index={i} />)}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-[#9CA3AF]">No assets match your search.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
