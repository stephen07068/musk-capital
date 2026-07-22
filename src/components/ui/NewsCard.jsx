import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const categoryColors = {
  SpaceX: 'text-blue-400 bg-blue-400/10',
  Tesla: 'text-red-400 bg-red-400/10',
  xAI: 'text-purple-400 bg-purple-400/10',
  Neuralink: 'text-cyan-400 bg-cyan-400/10',
  Markets: 'text-emerald-400 bg-emerald-400/10',
  Crypto: 'text-yellow-400 bg-yellow-400/10',
};

export default function NewsCard({ article, index = 0, featured = false }) {
  const colorClass = categoryColors[article.category] || 'text-[#D4AF37] bg-[#D4AF37]/10';

  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="card-dark hover-lift overflow-hidden flex flex-col md:flex-row"
      >
        <div className="md:w-64 h-48 md:h-auto shrink-0 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col p-6 flex-1">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 w-fit ${colorClass}`}>
            <Tag size={10} />
            {article.category}
          </span>
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-snug">{article.title}</h3>
          <p className="text-sm text-[#9CA3AF] leading-relaxed flex-1 mb-4 line-clamp-3">{article.summary}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-[#6B7280]">
              <span className="flex items-center gap-1"><Calendar size={11} />{article.date}</span>
              <span className="flex items-center gap-1"><Clock size={11} />{article.readTime}</span>
            </div>
            <Link to={`/news/${article.id}`} className="flex items-center gap-1 text-xs font-semibold text-[#D4AF37] hover:text-[#F0D060] transition-colors">
              Read More <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card-dark hover-lift overflow-hidden flex flex-col group"
    >
      <div className="h-44 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 w-fit ${colorClass}`}>
          <Tag size={10} />
          {article.category}
        </span>
        <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 flex-1">{article.title}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-[#6B7280] flex items-center gap-1">
            <Calendar size={10} />{article.date}
          </span>
          <Link to={`/news/${article.id}`} className="flex items-center gap-1 text-xs font-semibold text-[#D4AF37] hover:text-[#F0D060] transition-colors">
            Read More <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
