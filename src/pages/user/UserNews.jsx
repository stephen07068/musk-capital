import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bookmark, Clock, ArrowRight } from 'lucide-react';
import { newsArticles } from '../../data/mockData';
import PageHeader from '../../components/ui/PageHeader';

const categories = ['All', 'Tesla', 'SpaceX', 'xAI', 'Neuralink', 'Markets', 'Crypto'];

export default function UserNews() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [bookmarked, setBookmarked] = useState(new Set());

  const toggleBookmark = (id) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = newsArticles.filter((a) => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
                        a.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader
        title="Market News"
        subtitle="Stay ahead with personalised investment news"
        actions={
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search news..."
              className="pl-8 pr-4 py-2 bg-[#0D0F14] border border-[#1F222A] rounded-xl text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37]/40 w-48"
            />
          </div>
        }
      />

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeCategory === cat
                ? 'bg-[#D4AF37] text-black'
                : 'bg-[#0D0F14] border border-[#1F222A] text-[#9CA3AF] hover:text-white hover:border-[#D4AF37]/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured article */}
      {filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden group cursor-pointer"
        >
          <img src={filtered[0].image} alt={filtered[0].title} className="w-full h-56 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/20 px-2.5 py-1 rounded-full">{filtered[0].category}</span>
              <span className="text-xs text-white/60 flex items-center gap-1"><Clock size={11} /> {filtered[0].readTime}</span>
            </div>
            <h2 className="text-xl font-black text-white mb-1">{filtered[0].title}</h2>
            <p className="text-sm text-white/70 line-clamp-2">{filtered[0].summary}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); toggleBookmark(filtered[0].id); }}
            className="absolute top-4 right-4 p-2 bg-black/40 rounded-xl backdrop-blur-sm hover:bg-[#D4AF37]/20 transition-all"
          >
            <Bookmark size={16} className={bookmarked.has(filtered[0].id) ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-white'} />
          </button>
        </motion.div>
      )}

      {/* Article grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.slice(1).map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl overflow-hidden hover:border-[#D4AF37]/30 transition-all group cursor-pointer"
          >
            <div className="relative">
              <img src={article.image} alt={article.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
              <button
                onClick={(e) => { e.stopPropagation(); toggleBookmark(article.id); }}
                className="absolute top-3 right-3 p-1.5 bg-black/50 rounded-lg backdrop-blur-sm hover:bg-[#D4AF37]/20 transition-all"
              >
                <Bookmark size={14} className={bookmarked.has(article.id) ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-white/70'} />
              </button>
              <span className="absolute bottom-3 left-3 text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/20 px-2 py-0.5 rounded-full">
                {article.category}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">{article.title}</h3>
              <p className="text-xs text-[#9CA3AF] line-clamp-2 mb-3">{article.summary}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
                  <Clock size={11} />
                  <span>{article.readTime}</span>
                  <span>•</span>
                  <span>{article.date}</span>
                </div>
                <span className="text-[#D4AF37] hover:text-[#F0D060] transition-colors">
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[#9CA3AF]">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No articles found</p>
        </div>
      )}
    </div>
  );
}
