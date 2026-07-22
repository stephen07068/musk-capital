import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2, XCircle, CreditCard, Image } from 'lucide-react';
import { adminGiftCards } from '../../data/mockData';
import PageHeader from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/DataTable';

const tabs = ['All', 'Pending', 'Approved', 'Rejected'];
const cardColors = { Amazon: '#F97316', Apple: '#6B7280', 'Google Play': '#3B82F6', Steam: '#10B981', Visa: '#D4AF37', Mastercard: '#EF4444', Amex: '#6366F1' };

export default function GiftCardManagement() {
  const [cards, setCards] = useState(adminGiftCards);
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');

  const updateStatus = (id, status) => setCards(prev => prev.map(c => c.id === id ? { ...c, status } : c));

  const filtered = cards.filter(c => {
    const matchTab = tab === 'All' || c.status === tab.toLowerCase();
    const matchSearch = c.user.toLowerCase().includes(search.toLowerCase()) || c.cardType.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts = { total: cards.length, pending: cards.filter(c => c.status === 'pending').length, approved: cards.filter(c => c.status === 'approved').length, rejected: cards.filter(c => c.status === 'rejected').length };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader title="Gift Card Management" subtitle="Review and approve gift card submissions" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[{ label: 'Total Submitted', value: counts.total }, { label: 'Pending', value: counts.pending }, { label: 'Approved', value: counts.approved }, { label: 'Rejected', value: counts.rejected }].map(({ label, value }) => (
          <div key={label} className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-4">
            <p className="text-[10px] text-[#9CA3AF] mb-1">{label}</p>
            <p className="text-2xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 bg-[#0D0F14] border border-[#1F2937] p-1 rounded-xl">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === t ? 'bg-[#D4AF37] text-black' : 'text-[#9CA3AF] hover:text-white'}`}>{t}</button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-8 pr-4 py-2 bg-[#0D0F14] border border-[#1F2937] rounded-xl text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37]/40 w-48" />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((card, i) => {
            const color = cardColors[card.cardType] || '#D4AF37';
            return (
              <motion.div key={card.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl overflow-hidden">
                {/* Card Header */}
                <div className="p-4 border-b border-[#1F2937] flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-black text-sm" style={{ background: color }}>
                      {card.cardType.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{card.user}</p>
                      <p className="text-[10px] text-[#9CA3AF]">{card.email}</p>
                    </div>
                  </div>
                  <StatusBadge status={card.status} />
                </div>

                <div className="p-4 space-y-3">
                  {/* Image Placeholder */}
                  <div className="w-full h-28 bg-white/5 border border-[#1F2937] rounded-xl flex items-center justify-center text-[#6B7280] gap-2 text-xs">
                    <Image size={16} /> View Card Images
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: color + '22', color }}>{card.cardType}</span>
                    <span className="text-xl font-black text-white">${card.value}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><p className="text-[#6B7280]">Country</p><p className="text-white font-medium">{card.country}</p></div>
                    <div><p className="text-[#6B7280]">Date</p><p className="text-white font-medium">{card.date}</p></div>
                  </div>

                  {card.notes && (
                    <div className="bg-white/5 border border-[#1F2937] rounded-xl p-2.5 text-[11px] text-[#9CA3AF]">{card.notes}</div>
                  )}

                  {card.status === 'pending' && (
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => updateStatus(card.id, 'approved')} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 rounded-xl text-xs font-bold hover:bg-emerald-400/20 transition-colors">
                        <CheckCircle2 size={14} /> Approve
                      </button>
                      <button onClick={() => updateStatus(card.id, 'rejected')} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-400/10 text-red-400 border border-red-400/20 rounded-xl text-xs font-bold hover:bg-red-400/20 transition-colors">
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {filtered.length === 0 && <p className="text-center py-16 text-[#9CA3AF] text-sm">No gift cards found.</p>}
    </div>
  );
}
