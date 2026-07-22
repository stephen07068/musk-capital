import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { companies } from '../../data/mockData';
import PageHeader from '../../components/ui/PageHeader';

const companyIcons = {
  tesla: <svg viewBox="0 0 342 35" className="h-7 w-auto" fill="#EF4444"><path d="M0 .1a9.7 9.7 0 0 0 7 7h11l.5.1v27.6h6.8V7.3L26 7h11a9.8 9.8 0 0 0 7-7H0zm238.6 0h-6.8v34.8H263a9.7 9.7 0 0 0 6-3.4 9.9 9.9 0 0 0 1-1.3l-18.5-17.3 18.6-12.8h.1zm-52 0h-27.7a9.7 9.7 0 0 0-7 7v21a9.7 9.7 0 0 0 7 7h27.6a9.7 9.7 0 0 0 7-7v-21a9.7 9.7 0 0 0-7-7zm.2 27.6h-28v-20.6h28v20.6zM85.3.1a9.7 9.7 0 0 0-7 7v27.6h6.9v-12h24.6v12h6.8V7.1a9.7 9.7 0 0 0-7-7zm17.3 15.6h-24.4V7.3h24.4zM183.8 7h.1a9.7 9.7 0 0 0-7-7h-27.7a9.7 9.7 0 0 0-7 7v27.6h6.9v-12h24.5v12h6.9V7h.1zm-27.7 8.7V7.3h24.4v8.4h-24.4z"/></svg>,
  spacex: <span className="text-white font-black text-xl tracking-widest">SPACEX</span>,
  xai: <span className="text-white font-black text-2xl">xAI</span>,
  neuralink: <span className="text-white font-bold text-sm tracking-widest">NEURALINK</span>,
  'boring-company': <div className="text-white font-black text-xs text-center leading-tight"><div>THE</div><div>BORING</div><div>COMPANY</div></div>,
  x: <svg viewBox="0 0 19 19" className="h-7 w-auto" fill="#FFFFFF"><path fillRule="evenodd" d="M1.893 1.98c.052.072 1.245 1.769 2.653 3.77l2.892 4.114c.183.261.333.48.333.486s-.068.089-.152.183l-.522.593-.765.867-3.597 4.087c-.375.426-.734.834-.798.905a1 1 0 0 0-.118.148c0 .01.236.017.664.017h.663l.729-.83c.4-.457.796-.906.879-.999a692 692 0 0 0 1.794-2.038c.034-.037.301-.34.594-.675l.551-.624.345-.392a7 7 0 0 1 .34-.374c.006 0 .93 1.306 2.052 2.903l2.084 2.965.045.063h2.275c1.87 0 2.273-.003 2.266-.021-.008-.02-1.098-1.572-3.894-5.547-2.013-2.862-2.28-3.246-2.273-3.266.008-.019.282-.332 2.085-2.38l2-2.274 1.567-1.782c.022-.028-.016-.03-.65-.03h-.674l-.3.342a871 871 0 0 1-1.782 2.025c-.067.075-.405.458-.75.852a100 100 0 0 1-.803.91c-.148.172-.299.344-.99 1.127-.304.343-.32.358-.345.327-.015-.019-.904-1.282-1.976-2.808L6.365 1.85H1.8zm1.782.91 8.078 11.294c.772 1.08 1.413 1.973 1.425 1.984.016.017.241.02 1.05.017l1.03-.004-2.694-3.766L7.796 5.75 5.722 2.852l-1.039-.004-1.039-.004z" clipRule="evenodd"/></svg>,
};

const industryColors = {
  'Electric Vehicles & Clean Energy': '#EF4444',
  'Aerospace & Space Transportation': '#6B7280',
  'Artificial Intelligence': '#8B5CF6',
  'Neurotechnology & Brain-Computer Interface': '#3B82F6',
  'Infrastructure & Tunnel Construction': '#EAB308',
  'Social Media & Communications': '#FFFFFF',
};

export default function UserCompanies() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader
        title="Musk's Companies"
        subtitle="Explore the companies shaping tomorrow"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {companies.map((company, i) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-6 hover:border-[#D4AF37]/30 transition-all group cursor-pointer flex flex-col"
            onClick={() => setSelected(selected?.id === company.id ? null : company)}
          >
            {/* Logo */}
            <div className="flex items-center justify-center h-16 mb-4">
              {companyIcons[company.id] || <span className="text-white font-bold text-xl">{company.name}</span>}
            </div>

            {/* Badge */}
            <div className="flex items-center justify-center mb-3">
              <span className={`text-[10px] font-black px-3 py-1 rounded-full tracking-widest ${
                company.status === 'PUBLIC' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-white/5 text-[#9CA3AF] border border-[#1F222A]'
              }`}>
                {company.status}
              </span>
            </div>

            <h3 className="text-base font-bold text-white text-center mb-1">{company.name}</h3>
            <p className="text-[11px] text-[#9CA3AF] text-center mb-3 flex-1">{company.description}</p>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Industry</span>
                <span className="text-white font-medium text-right max-w-[55%]">{company.industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">CEO</span>
                <span className="text-white font-medium">{company.ceo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Founded</span>
                <span className="text-white font-medium">{company.founded}</span>
              </div>
              {company.ticker && (
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Ticker</span>
                  <span className="text-[#D4AF37] font-bold">{company.ticker}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <Link
                to={`/companies/${company.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl text-xs font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all"
              >
                Learn More <ArrowRight size={12} />
              </Link>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 bg-white/5 border border-[#1F222A] rounded-xl text-[#9CA3AF] hover:text-white hover:border-[#D4AF37]/30 transition-all"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
