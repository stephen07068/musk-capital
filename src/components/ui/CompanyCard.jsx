import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import CompanyLogo from './CompanyLogo';

export default function CompanyCard({ company, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="card-dark flex flex-col p-5 group hover:border-[#D4AF37]/30 border border-[#1F222A] rounded-2xl transition-all"
    >
      {/* Logo */}
      <div className="mb-4 flex items-center justify-center h-16 bg-[#1a2235] rounded-xl overflow-hidden">
        <CompanyLogo company={company} />
      </div>

      {/* Badge */}
      <div className="mb-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
          company.status === 'PUBLIC'
            ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
            : 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
        }`}>
          {company.status}
        </span>
      </div>

      {/* Info */}
      <h3 className="text-base font-bold text-white mb-1">{company.name}</h3>
      <p className="text-xs text-[#D4AF37] mb-2 font-medium">{company.industry}</p>
      <p className="text-xs text-[#9CA3AF] leading-relaxed mb-4">{company.description}</p>

      {/* Learn More */}
      <Link
        to={`/companies/${company.id}`}
        className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#D4AF37] transition-all mt-auto pt-4"
      >
        {company.status === 'PUBLIC' ? 'View Stock' : 'Learn More'}
        <ArrowRight size={12} />
      </Link>
    </motion.div>
  );
}
