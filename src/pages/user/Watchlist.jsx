import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { watchlistData, marketData, cryptoAssets, stockAssets, generateSparkline } from '../../data/mockData';
import PageHeader from '../../components/ui/PageHeader';

const allAssets = [...marketData, ...cryptoAssets.filter(a => !marketData.find(m => m.symbol === a.symbol))];

export default function Watchlist() {
  const [items, setItems] = useState(watchlistData);
  const [search, setSearch] = useState('');
  const [addSearch, setAddSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const remove = (symbol) => setItems((prev) => prev.filter((i) => i.symbol !== symbol));

  const add = (asset) => {
    if (!items.find((i) => i.symbol === asset.symbol)) {
      setItems((prev) => [...prev, { ...asset, changePercent: asset.changePercent || asset.change }]);
    }
    setShowAdd(false);
    setAddSearch('');
  };

  const filtered = items.filter((i) =>
    i.symbol.toLowerCase().includes(search.toLowerCase()) ||
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const addableAssets = allAssets.filter((a) =>
    !items.find((i) => i.symbol === a.symbol) &&
    (a.symbol.toLowerCase().includes(addSearch.toLowerCase()) ||
     a.name.toLowerCase().includes(addSearch.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader
        title="Watchlist"
        subtitle="Monitor your favourite assets in real time"
        actions={
          <button
            onClick={() => setShowAdd((s) => !s)}
            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black rounded-xl text-xs font-bold hover:bg-[#F0D060] transition-colors"
          >
            <Plus size={14} /> Add Asset
          </button>
        }
      />

      {/* Add Asset Panel */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#0D0F14] border border-[#D4AF37]/30 rounded-2xl p-5 overflow-hidden"
          >
            <p className="text-sm font-bold text-white mb-3">Search & Add Asset</p>
            <div className="relative mb-3">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                value={addSearch}
                onChange={(e) => setAddSearch(e.target.value)}
                placeholder="Search by name or symbol..."
                className="w-full pl-8 pr-4 py-2 bg-black/40 border border-[#1F222A] rounded-xl text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37]/40"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto">
              {addableAssets.slice(0, 12).map((a) => (
                <button
                  key={a.symbol}
                  onClick={() => add(a)}
                  className="flex items-center gap-2 p-2.5 bg-white/5 hover:bg-[#D4AF37]/10 border border-[#1F222A] hover:border-[#D4AF37]/30 rounded-xl transition-all text-left"
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ background: (a.color || '#D4AF37') + '22', color: a.color || '#D4AF37' }}>
                    {a.symbol.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{a.symbol}</p>
                    <p className="text-[10px] text-[#9CA3AF] truncate">{a.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter watchlist..."
          className="pl-8 pr-4 py-2 bg-[#0D0F14] border border-[#1F222A] rounded-xl text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37]/40 w-full"
        />
      </div>

      {/* Watchlist grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((item, i) => {
            const spark = generateSparkline(item.price, 20, 0.025);
            const isUp = (item.changePercent ?? item.change) >= 0;
            return (
              <motion.div
                key={item.symbol}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-5 hover:border-[#D4AF37]/20 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black"
                      style={{ background: (item.color || '#D4AF37') + '22', color: item.color || '#D4AF37' }}>
                      {item.symbol.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{item.symbol}</p>
                      <p className="text-[11px] text-[#9CA3AF] truncate max-w-[100px]">{item.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => remove(item.symbol)}
                    className="p-1.5 text-[#6B7280] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="h-16 mb-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={spark}>
                      <YAxis hide domain={['auto', 'auto']} />
                      <Line type="monotone" dataKey="value" stroke={isUp ? '#10B981' : '#EF4444'} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-lg font-black text-white">
                      ${item.price >= 1000 ? item.price.toLocaleString() : item.price >= 1 ? item.price.toFixed(2) : item.price.toFixed(4)}
                    </p>
                    <p className={`text-xs font-semibold flex items-center gap-1 ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {isUp ? '+' : ''}{Math.abs(item.changePercent ?? item.change).toFixed(2)}%
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    (item.type || 'stock') === 'crypto' ? 'bg-orange-400/10 text-orange-400' : 'bg-blue-400/10 text-blue-400'
                  }`}>
                    {(item.type || 'stock').toUpperCase()}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[#9CA3AF]">
          <TrendingUp size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No assets in watchlist</p>
          <p className="text-sm mt-1">Click "Add Asset" to start tracking.</p>
        </div>
      )}
    </div>
  );
}
