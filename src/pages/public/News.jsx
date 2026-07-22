import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Tag } from 'lucide-react';
import { newsArticles } from '../../data/mockData';
import NewsCard from '../../components/ui/NewsCard';

const categories = ['All', 'SpaceX', 'Tesla', 'xAI', 'Neuralink', 'Markets', 'Crypto'];

export default function News() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = newsArticles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || a.category === category;
    return matchSearch && matchCat;
  });

  const paginated = filtered.slice(0, page * perPage);
  const hasMore = paginated.length < filtered.length;

  return (
    <div className="min-h-screen bg-[#07090D] pt-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0D0F14] to-transparent py-14 border-b border-[#1F2937]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-2">
            Latest News
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black text-white mb-3">
            Innovation Insights
          </motion.h1>
          <p className="text-[#9CA3AF]">Stay updated on the latest from Musk's companies and the markets.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
        {/* Featured */}
        <div className="mb-10">
          <NewsCard article={newsArticles[0]} featured index={0} />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search news..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-[#1F2937] rounded-xl text-white placeholder-[#9CA3AF] text-sm focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(cat => (
              <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-xl border shrink-0 transition-all ${category === cat ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'border-[#1F2937] text-[#9CA3AF] hover:border-[#D4AF37]/40 hover:text-white'}`}>
                <Tag size={10} />{cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginated.slice(1).map((article, i) => (
            <NewsCard key={article.id} article={article} index={i} />
          ))}
        </div>

        {hasMore && (
          <div className="text-center">
            <button
              onClick={() => setPage(p => p + 1)}
              className="px-8 py-3 glass border border-[#1F2937] text-white text-sm font-semibold rounded-xl hover:border-[#D4AF37]/40 transition-all"
            >
              Load More Articles
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#9CA3AF]">No articles match your search.</div>
        )}
      </div>
    </div>
  );
}
