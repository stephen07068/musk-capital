import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { marketData, cryptoAssets, stockAssets, generateSparkline } from '../../data/mockData';
import PageHeader from '../../components/ui/PageHeader';

const tabs = ['All', 'Stocks', 'Crypto', 'Indices'];

const indicesData = [
  { symbol: 'S&P 500', name: 'S&P 500 Index', price: 5325.69, change: 0.74, marketCap: '—', volume: '$387B', color: '#10B981' },
  { symbol: 'NASDAQ', name: 'NASDAQ Composite', price: 17689.66, change: 0.92, marketCap: '—', volume: '$280B', color: '#3B82F6' },
  { symbol: 'DOW', name: 'Dow Jones Industrial', price: 38686.32, change: 0.43, marketCap: '—', volume: '$195B', color: '#8B5CF6' },
  { symbol: 'VIX', name: 'CBOE Volatility Index', price: 13.42, change: -2.15, marketCap: '—', volume: '—', color: '#EAB308' },
];

function AssetRow({ asset, i }) {
  const sparkData = generateSparkline(asset.price, 15, 0.025);
  const isUp = asset.change >= 0;

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.04 }}
      className="border-b border-[#1F222A]/50 hover:bg-white/5 transition-colors"
    >
      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: asset.color + '22', color: asset.color }}>
            {asset.symbol.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{asset.symbol}</p>
            <p className="text-[11px] text-[#9CA3AF] truncate max-w-[120px]">{asset.name}</p>
          </div>
        </div>
      </td>
      <td className="py-3.5 pr-4 text-white font-bold text-sm">
        ${asset.price >= 1000 ? asset.price.toLocaleString() : asset.price >= 1 ? asset.price.toFixed(2) : asset.price.toFixed(4)}
      </td>
      <td className="py-3.5 pr-4">
        <span className={`flex items-center gap-1 text-sm font-semibold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
          {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {isUp ? '+' : ''}{asset.change.toFixed(2)}%
        </span>
      </td>
      <td className="py-3.5 pr-4 text-[#9CA3AF] text-xs hidden md:table-cell">{asset.marketCap}</td>
      <td className="py-3.5 pr-4 text-[#9CA3AF] text-xs hidden lg:table-cell">{asset.volume}</td>
      <td className="py-3.5 w-24">
        <div className="h-8 w-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <YAxis hide domain={['auto', 'auto']} />
              <Line type="monotone" dataKey="value" stroke={isUp ? '#10B981' : '#EF4444'} strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </td>
    </motion.tr>
  );
}

export default function UserMarkets() {
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const getData = () => {
    let data = [];
    if (tab === 'All' || tab === 'Stocks') data = [...data, ...stockAssets];
    if (tab === 'All' || tab === 'Crypto') data = [...data, ...cryptoAssets];
    if (tab === 'Indices') data = indicesData;
    if (search) data = data.filter((a) => a.symbol.toLowerCase().includes(search.toLowerCase()) || a.name.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === 'price') data = [...data].sort((a, b) => b.price - a.price);
    if (sortBy === 'change') data = [...data].sort((a, b) => b.change - a.change);
    return data;
  };

  const assets = getData();

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader title="Markets" subtitle="Live prices across stocks, crypto, and indices" />

      {/* Market summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {marketData.slice(0, 4).map((m) => (
          <div key={m.symbol} className="bg-[#0D0F14] border border-[#1F222A] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full" style={{ background: m.color + '33' }} />
              <span className="text-xs font-bold text-white">{m.symbol}</span>
            </div>
            <p className="text-sm font-black text-white">${m.price >= 1000 ? m.price.toLocaleString() : m.price.toFixed(2)}</p>
            <p className={`text-xs font-semibold ${m.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {m.changePercent >= 0 ? '▲' : '▼'} {Math.abs(m.changePercent).toFixed(2)}%
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Tabs */}
          <div className="flex gap-1 bg-black/40 p-1 rounded-xl">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  tab === t ? 'bg-[#D4AF37] text-black' : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex gap-2 ml-auto">
            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-8 pr-3 py-2 bg-black/40 border border-[#1F222A] rounded-xl text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37]/40 w-36"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-black/40 border border-[#1F222A] rounded-xl text-xs text-[#9CA3AF] focus:outline-none focus:border-[#D4AF37]/40"
            >
              <option value="default">Default</option>
              <option value="price">Sort by Price</option>
              <option value="change">Sort by Change</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1F222A]">
                {['Asset', 'Price', '24h Change', 'Market Cap', 'Volume', 'Trend'].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-widest pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assets.map((a, i) => <AssetRow key={a.symbol} asset={a} i={i} />)}
            </tbody>
          </table>
          {assets.length === 0 && (
            <p className="text-center py-10 text-[#9CA3AF] text-sm">No assets found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
