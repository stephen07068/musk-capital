import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, sub, color = '#D4AF37', positive, negative, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-5 hover:border-[#D4AF37]/20 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        {sub && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              positive ? 'text-emerald-400 bg-emerald-400/10' : negative ? 'text-red-400 bg-red-400/10' : 'text-[#9CA3AF] bg-white/5'
            }`}
          >
            {sub}
          </span>
        )}
      </div>
      <p className="text-[#9CA3AF] text-xs mb-1">{label}</p>
      <p
        className={`text-xl font-black ${
          positive ? 'text-emerald-400' : negative ? 'text-red-400' : 'text-white'
        }`}
      >
        {value}
      </p>
    </motion.div>
  );
}
