import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Users, DollarSign, MapPin, Calendar, Building2, ExternalLink } from 'lucide-react';
import { companies, newsArticles } from '../../data/mockData';
import NewsCard from '../../components/ui/NewsCard';
import CompanyLogo from '../../components/ui/CompanyLogo';

export default function CompanyDetail() {
  const { id } = useParams();
  const company = companies.find(c => c.id === id);
  if (!company) return <Navigate to="/companies" replace />;

  const relatedNews = newsArticles.filter(n => n.category.toLowerCase() === company.name.toLowerCase()).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#07090D] pt-20">
      {/* Hero Banner */}
      <div className={`relative py-20 bg-gradient-to-br ${company.bgColor} border-b border-[#1F2937]`}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #D4AF37 0%, transparent 70%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link to="/companies" className="inline-flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Companies
          </Link>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="w-24 h-24 rounded-2xl bg-[#111827] border border-[#1F2937] overflow-hidden">
              <CompanyLogo company={company} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-white">{company.name}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${company.status === 'PUBLIC' ? 'bg-emerald-400/20 text-emerald-400' : 'bg-[#D4AF37]/20 text-[#D4AF37]'}`}>
                  {company.status}
                </span>
              </div>
              <p className="text-[#D4AF37] font-medium mb-2">{company.industry}</p>
              <p className="text-[#9CA3AF] max-w-2xl">{company.longDescription}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Info */}
            <div className="card-dark p-6">
              <h2 className="text-lg font-bold text-white mb-5">Company Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {[
                  { icon: Users, label: 'CEO', value: company.ceo },
                  { icon: Calendar, label: 'Founded', value: company.founded },
                  { icon: MapPin, label: 'Headquarters', value: company.headquarters },
                  { icon: Building2, label: 'Industry', value: company.industry },
                  { icon: Users, label: 'Employees', value: company.employees },
                  { icon: DollarSign, label: 'Revenue', value: company.revenue },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={14} className="text-[#D4AF37]" />
                      <span className="text-xs text-[#9CA3AF] font-medium">{label}</span>
                    </div>
                    <p className="text-sm font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div className="card-dark p-6">
              <h2 className="text-lg font-bold text-white mb-6">Key Milestones</h2>
              <div className="relative pl-4">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-[#1F2937]" />
                <div className="space-y-6">
                  {company.milestones.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="relative"
                    >
                      <div className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-[#D4AF37] border-2 border-[#07090D]" style={{ marginLeft: '-4px' }} />
                      <span className="text-xs font-bold text-[#D4AF37] mb-1 block">{m.year}</span>
                      <p className="text-sm text-[#9CA3AF]">{m.event}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Related News */}
            {relatedNews.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-5">Related News</h2>
                <div className="grid gap-4">
                  {relatedNews.map((article, i) => (
                    <NewsCard key={article.id} article={article} index={i} featured />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="card-dark p-5">
              <h3 className="text-sm font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {company.status === 'PUBLIC' && (
                  <Link to="/markets" className="flex items-center justify-center gap-2 w-full py-2.5 gold-gradient text-black text-sm font-bold rounded-xl hover:opacity-90 transition-opacity">
                    View Stock
                  </Link>
                )}
                <Link to="/dashboard" className="flex items-center justify-center gap-2 w-full py-2.5 glass border border-[#1F2937] text-white text-sm font-medium rounded-xl hover:border-[#D4AF37]/40 transition-all">
                  Add to Watchlist
                </Link>
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2.5 text-[#9CA3AF] hover:text-white text-sm font-medium transition-colors">
                    <ExternalLink size={14} /> Official Website
                  </a>
                )}
              </div>
            </div>
            <div className="card-dark p-5">
              <h3 className="text-sm font-bold text-white mb-3">Status</h3>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${company.status === 'PUBLIC' ? 'bg-emerald-400/10 border border-emerald-400/20' : 'bg-[#D4AF37]/10 border border-[#D4AF37]/20'}`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${company.status === 'PUBLIC' ? 'bg-emerald-400' : 'bg-[#D4AF37]'}`} />
                <span className={`text-sm font-semibold ${company.status === 'PUBLIC' ? 'text-emerald-400' : 'text-[#D4AF37]'}`}>{company.status}</span>
              </div>
              {company.ticker && <p className="text-xs text-[#9CA3AF] mt-2">Ticker: <span className="text-white font-mono">{company.ticker}</span></p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
