import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { companies } from '../../data/mockData';
import CompanyCard from '../../components/ui/CompanyCard';

const categories = ['All', 'Electric Vehicles', 'Aerospace', 'Artificial Intelligence', 'Neurotechnology', 'Infrastructure', 'Social Media'];
const statuses = ['All', 'PUBLIC', 'PRIVATE'];

export default function Companies() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');

  const filtered = companies.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || c.industry.toLowerCase().includes(category.toLowerCase());
    const matchStatus = status === 'All' || c.status === status;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#07090D] pt-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0D0F14] to-transparent py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-3">
            Musk's Companies
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-black text-white mb-4">
            Building the Future
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-[#9CA3AF] max-w-xl mx-auto">
            Explore the visionary companies reshaping transportation, AI, space, and human potential.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search companies..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-[#1F2937] rounded-xl text-white placeholder-[#9CA3AF] text-sm focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-4 py-2.5 text-xs font-semibold rounded-xl border shrink-0 transition-all ${status === s ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-transparent border-[#1F2937] text-[#9CA3AF] hover:border-[#D4AF37]/40 hover:text-white'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
            {filtered.map((company, i) => (
              <CompanyCard key={company.id} company={company} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-[#9CA3AF] text-lg">No companies match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
