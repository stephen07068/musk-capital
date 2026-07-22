import { useState } from 'react';
import { Edit, Plus, ExternalLink, Building2, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../../components/ui/PageHeader';
import { companies } from '../../data/mockData';

const BRAND_COLORS = {
  Tesla: { text: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
  SpaceX: { text: 'text-white', bg: 'bg-white/10', border: 'border-white/20' },
  xAI: { text: 'text-white', bg: 'bg-white/10', border: 'border-white/20' },
  Neuralink: { text: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
  'The Boring Company': { text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  X: { text: 'text-white', bg: 'bg-white/10', border: 'border-white/20' },
};

const defaultBrand = { text: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10', border: 'border-[#D4AF37]/30' };

function getBrand(name) {
  for (const key of Object.keys(BRAND_COLORS)) {
    if (name && name.toLowerCase().includes(key.toLowerCase())) return BRAND_COLORS[key];
  }
  return defaultBrand;
}

export default function CompanyManagement() {
  const [companyList, setCompanyList] = useState(companies);
  const [editTarget, setEditTarget] = useState(null);
  const [formData, setFormData] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  const totalPublic = companyList.filter(c => c.status === 'PUBLIC' || c.isPublic).length;
  const totalPrivate = companyList.length - totalPublic;

  function openEdit(company) {
    setEditTarget(company);
    setFormData({
      name: company.name || '',
      description: company.description || '',
      industry: company.industry || '',
      status: company.status || (company.isPublic ? 'PUBLIC' : 'PRIVATE'),
      ceo: company.ceo || '',
      headquarters: company.headquarters || '',
    });
  }

  function handleSave() {
    setCompanyList(prev =>
      prev.map(c =>
        c.id === editTarget.id
          ? { ...c, ...formData, isPublic: formData.status === 'PUBLIC' }
          : c
      )
    );
    setEditTarget(null);
    setSuccessMsg('Company updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  function handleField(key, value) {
    setFormData(prev => ({ ...prev, [key]: value }));
  }

  const inputCls =
    'w-full bg-[#0D0F14] border border-[#1F2937] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors';

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Company Management"
          subtitle="Manage Elon Musk's portfolio companies"
          icon={Building2}
        />

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Companies', value: companyList.length, color: 'text-[#D4AF37]' },
            { label: 'Public', value: totalPublic, color: 'text-emerald-400' },
            { label: 'Private', value: totalPrivate, color: 'text-gray-400' },
          ].map(stat => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0D0F14] border border-[#1F2937] rounded-xl p-4 text-center"
            >
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Success Toast */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 px-4 py-3 bg-emerald-400/10 border border-emerald-400/30 rounded-lg text-emerald-400 text-sm font-medium"
            >
              ✓ {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Company Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {companyList.map((company, i) => {
            const brand = getBrand(company.name);
            const isPublic = company.status === 'PUBLIC' || company.isPublic;
            return (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-[#0D0F14] border ${brand.border} rounded-2xl p-5 flex flex-col gap-4 hover:border-[#D4AF37]/40 transition-colors group`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-xl font-bold ${brand.text}`}>{company.name}</h3>
                    <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{company.description || company.tagline || '—'}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      isPublic
                        ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                        : 'bg-gray-400/10 text-gray-400 border border-gray-400/20'
                    }`}
                  >
                    {isPublic ? 'PUBLIC' : 'PRIVATE'}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  {[
                    { label: 'Industry', value: company.industry },
                    { label: 'CEO', value: company.ceo || 'Elon Musk' },
                    { label: 'Founded', value: company.founded },
                    { label: 'Revenue', value: company.revenue || company.annualRevenue },
                    { label: 'Employees', value: company.employees ? Number(company.employees).toLocaleString() : company.employeeCount },
                    { label: 'HQ', value: company.headquarters || company.location },
                  ]
                    .filter(r => r.value)
                    .map(row => (
                      <div key={row.label}>
                        <span className="text-gray-500">{row.label}: </span>
                        <span className="text-gray-300 font-medium">{row.value}</span>
                      </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1 border-t border-[#1F2937]/50">
                  <button
                    onClick={() => openEdit(company)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D4AF37]/40 text-[#D4AF37] text-xs hover:bg-[#D4AF37]/10 transition-colors"
                  >
                    <Edit size={12} />
                    Edit
                  </button>
                  {(company.website || company.url) && (
                    <a
                      href={company.website || company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1F2937] text-gray-400 text-xs hover:border-gray-500 transition-colors"
                    >
                      <ExternalLink size={12} />
                      View Site
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Edit Panel Overlay */}
      <AnimatePresence>
        {editTarget && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditTarget(null)}
              className="fixed inset-0 bg-black/60 z-40"
            />

            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: 420 }}
              animate={{ x: 0 }}
              exit={{ x: 420 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0D0F14] border-l border-[#1F2937] z-50 flex flex-col shadow-2xl"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#1F2937]">
                <div>
                  <h2 className="text-white font-bold text-lg">Edit Company</h2>
                  <p className="text-gray-400 text-xs mt-0.5">{editTarget.name}</p>
                </div>
                <button
                  onClick={() => setEditTarget(null)}
                  className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                {[
                  { key: 'name', label: 'Company Name', type: 'text' },
                  { key: 'industry', label: 'Industry', type: 'text' },
                  { key: 'ceo', label: 'CEO', type: 'text' },
                  { key: 'headquarters', label: 'Headquarters', type: 'text' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-gray-400 text-xs font-medium block mb-1.5">{field.label}</label>
                    <input
                      type={field.type}
                      value={formData[field.key] || ''}
                      onChange={e => handleField(field.key, e.target.value)}
                      className={inputCls}
                    />
                  </div>
                ))}

                <div>
                  <label className="text-gray-400 text-xs font-medium block mb-1.5">Status</label>
                  <select
                    value={formData.status || 'PRIVATE'}
                    onChange={e => handleField('status', e.target.value)}
                    className={inputCls}
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Private</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 text-xs font-medium block mb-1.5">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={e => handleField('description', e.target.value)}
                    rows={4}
                    className={inputCls + ' resize-none'}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#1F2937] flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#D4AF37] text-black font-semibold text-sm hover:bg-[#C9A227] transition-colors"
                >
                  <Save size={15} />
                  Save Changes
                </button>
                <button
                  onClick={() => setEditTarget(null)}
                  className="px-5 py-2.5 rounded-xl border border-[#1F2937] text-gray-400 text-sm hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
