import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, Search, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../../components/ui/PageHeader';
import { marketData } from '../../data/mockData';

// Gracefully handle missing named exports
let cryptoAssets, stockAssets;
try {
  const mod = require('../../data/mockData');
  cryptoAssets = mod.cryptoAssets;
  stockAssets = mod.stockAssets;
} catch (_) {}

function formatPrice(price) {
  const n = Number(price);
  if (isNaN(n)) return price;
  if (n >= 1000) return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (n >= 1) return '$' + n.toFixed(2);
  return '$' + n.toFixed(4);
}

function formatLarge(val) {
  const n = Number(val);
  if (isNaN(n)) return val ?? '—';
  if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  return '$' + n.toLocaleString();
}

const TABS = ['Stocks', 'Crypto', 'Indices'];

const EMPTY_FORM = {
  symbol: '',
  name: '',
  price: '',
  change: '',
  marketCap: '',
  volume: '',
  type: 'Stock',
};

export default function MarketManagement() {
  const allAssets = useMemo(() => {
    const base = Array.isArray(marketData) ? marketData : [];
    if (!base.length) {
      // fallback demo data
      return [
        { id: 1, symbol: 'TSLA', name: 'Tesla Inc.', price: 248.5, change: 2.4, marketCap: 790e9, volume: 28e9, type: 'Stock' },
        { id: 2, symbol: 'SPACE', name: 'SpaceX', price: 185.0, change: -0.8, marketCap: 210e9, volume: 1.2e9, type: 'Stock' },
        { id: 3, symbol: 'BTC', name: 'Bitcoin', price: 67420.0, change: 1.2, marketCap: 1.32e12, volume: 38e9, type: 'Crypto' },
        { id: 4, symbol: 'ETH', name: 'Ethereum', price: 3480.0, change: -0.5, marketCap: 418e9, volume: 18e9, type: 'Crypto' },
        { id: 5, symbol: 'SPX', name: 'S&P 500', price: 5280.0, change: 0.3, marketCap: null, volume: null, type: 'Index' },
      ];
    }
    return base;
  }, []);

  const [tab, setTab] = useState('Stocks');
  const [assets, setAssets] = useState(allAssets);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);

  const tabTypeMap = { Stocks: 'Stock', Crypto: 'Crypto', Indices: 'Index' };

  const filtered = useMemo(() => {
    let list = assets;
    if (tab !== 'All') {
      list = list.filter(a => {
        const t = (a.type || '').toLowerCase();
        if (tab === 'Stocks') return t === 'stock' || t === 'equity';
        if (tab === 'Crypto') return t === 'crypto' || t === 'cryptocurrency';
        if (tab === 'Indices') return t === 'index' || t === 'indices';
        return true;
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        a =>
          (a.symbol || '').toLowerCase().includes(q) ||
          (a.name || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [assets, tab, search]);

  const stocks = assets.filter(a => { const t = (a.type || '').toLowerCase(); return t === 'stock' || t === 'equity'; });
  const crypto = assets.filter(a => { const t = (a.type || '').toLowerCase(); return t === 'crypto' || t === 'cryptocurrency'; });
  const indices = assets.filter(a => { const t = (a.type || '').toLowerCase(); return t === 'index' || t === 'indices'; });

  function handleAdd() {
    if (!form.symbol || !form.name) return;
    if (editId !== null) {
      setAssets(prev => prev.map(a => a.id === editId ? { ...a, ...form, price: Number(form.price), change: Number(form.change) } : a));
      setEditId(null);
    } else {
      setAssets(prev => [
        ...prev,
        {
          id: Date.now(),
          ...form,
          price: Number(form.price),
          change: Number(form.change),
          marketCap: Number(form.marketCap) || null,
          volume: Number(form.volume) || null,
        },
      ]);
    }
    setForm(EMPTY_FORM);
    setShowForm(false);
  }

  function handleRemove(id) {
    setAssets(prev => prev.filter(a => a.id !== id));
  }

  function handleEdit(asset) {
    setForm({
      symbol: asset.symbol || '',
      name: asset.name || '',
      price: asset.price || '',
      change: asset.change ?? '',
      marketCap: asset.marketCap || '',
      volume: asset.volume || '',
      type: asset.type || 'Stock',
    });
    setEditId(asset.id);
    setShowForm(true);
  }

  const inputCls =
    'bg-[#0D0F14] border border-[#1F2937] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors';

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <PageHeader
            title="Market Management"
            subtitle="Manage assets, prices & market data"
            icon={BarChart2}
          />
          <button
            onClick={() => { setShowForm(v => !v); setEditId(null); setForm(EMPTY_FORM); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-semibold text-sm hover:bg-[#C9A227] transition-colors"
          >
            <Plus size={15} />
            Add Asset
          </button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Assets', value: assets.length, color: 'text-[#D4AF37]' },
            { label: 'Stocks', value: stocks.length, color: 'text-blue-400' },
            { label: 'Crypto', value: crypto.length, color: 'text-purple-400' },
            { label: 'Indices', value: indices.length, color: 'text-emerald-400' },
          ].map(s => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0D0F14] border border-[#1F2937] rounded-xl p-4 text-center"
            >
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-gray-400 text-xs mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Add/Edit Asset Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-[#0D0F14] border border-[#D4AF37]/30 rounded-2xl p-6">
                <h3 className="text-[#D4AF37] font-semibold mb-4">{editId !== null ? 'Edit Asset' : 'Add New Asset'}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[
                    { key: 'symbol', label: 'Symbol', placeholder: 'BTC' },
                    { key: 'name', label: 'Name', placeholder: 'Bitcoin' },
                    { key: 'price', label: 'Current Price', placeholder: '67420.00' },
                    { key: 'change', label: '24h Change %', placeholder: '1.25' },
                    { key: 'marketCap', label: 'Market Cap', placeholder: '1320000000000' },
                    { key: 'volume', label: 'Volume', placeholder: '38000000000' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-gray-400 text-xs block mb-1">{f.label}</label>
                      <input
                        className={inputCls + ' w-full'}
                        placeholder={f.placeholder}
                        value={form[f.key]}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-gray-400 text-xs block mb-1">Type</label>
                    <select
                      className={inputCls + ' w-full'}
                      value={form.type}
                      onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    >
                      <option value="Stock">Stock</option>
                      <option value="Crypto">Crypto</option>
                      <option value="Index">Index</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAdd} className="px-5 py-2 rounded-xl bg-[#D4AF37] text-black font-semibold text-sm hover:bg-[#C9A227] transition-colors">
                    {editId !== null ? 'Update Asset' : 'Add Asset'}
                  </button>
                  <button
                    onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM); }}
                    className="px-5 py-2 rounded-xl border border-[#1F2937] text-gray-400 text-sm hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Tabs */}
          <div className="flex gap-1 bg-[#0D0F14] border border-[#1F2937] rounded-xl p-1">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  tab === t ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              placeholder="Search symbol or name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#0D0F14] border border-[#1F2937] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F2937]">
                {['Asset', 'Price', '24h Change', 'Market Cap', 'Volume', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-gray-400 font-medium text-xs uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">No assets found</td>
                </tr>
              ) : (
                filtered.map(asset => {
                  const chg = Number(asset.change ?? asset.changePercent ?? asset.priceChange ?? 0);
                  const isPos = chg >= 0;
                  return (
                    <tr key={asset.id} className="border-b border-[#1F2937]/50 hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center">
                            <span className="text-[#D4AF37] text-xs font-bold">{(asset.symbol || '?')[0]}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-white">{asset.symbol}</p>
                            <p className="text-gray-500 text-xs">{asset.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-white font-mono">{formatPrice(asset.price ?? asset.currentPrice)}</td>
                      <td className="px-5 py-4">
                        <span className={`flex items-center gap-1 font-medium ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                          {isPos ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                          {isPos ? '▲' : '▼'} {Math.abs(chg).toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-300">{formatLarge(asset.marketCap)}</td>
                      <td className="px-5 py-4 text-gray-300">{formatLarge(asset.volume ?? asset.dailyVolume)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(asset)}
                            className="p-1.5 rounded-lg hover:bg-[#D4AF37]/10 text-[#D4AF37] transition-colors"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleRemove(asset.id)}
                            className="p-1.5 rounded-lg hover:bg-red-400/10 text-red-400 transition-colors"
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
