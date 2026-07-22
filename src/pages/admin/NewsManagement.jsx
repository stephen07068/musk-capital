import { useState } from 'react';
import { Plus, Edit, Trash2, Star, Eye, X, Save, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../../components/ui/PageHeader';
import { adminNews } from '../../data/mockData';

const CATEGORIES = ['Tesla', 'SpaceX', 'xAI', 'Neuralink', 'Markets', 'Crypto'];

const EMPTY_FORM = {
  title: '',
  category: 'Tesla',
  summary: '',
  imageUrl: '',
  status: 'Published',
  featured: false,
};

function formatDate(d) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return d;
  }
}

const CATEGORY_COLORS = {
  Tesla: 'bg-red-400/10 text-red-400',
  SpaceX: 'bg-blue-400/10 text-blue-400',
  xAI: 'bg-purple-400/10 text-purple-400',
  Neuralink: 'bg-cyan-400/10 text-cyan-400',
  Markets: 'bg-emerald-400/10 text-emerald-400',
  Crypto: 'bg-orange-400/10 text-orange-400',
};

function getCategoryColor(cat) {
  if (!cat) return 'bg-gray-400/10 text-gray-400';
  for (const key of Object.keys(CATEGORY_COLORS)) {
    if (cat.toLowerCase().includes(key.toLowerCase())) return CATEGORY_COLORS[key];
  }
  return 'bg-[#D4AF37]/10 text-[#D4AF37]';
}

export default function NewsManagement() {
  const [articles, setArticles] = useState(
    (Array.isArray(adminNews) ? adminNews : []).map((a, i) => ({ ...a, id: a.id ?? i }))
  );
  const [showForm, setShowForm] = useState(false);
  const [editArticle, setEditArticle] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filterTab, setFilterTab] = useState('All');

  const total = articles.length;
  const published = articles.filter(a => (a.status || '').toLowerCase() === 'published').length;
  const draft = articles.filter(a => (a.status || '').toLowerCase() === 'draft').length;
  const featured = articles.filter(a => a.featured).length;

  const filtered = articles.filter(a => {
    if (filterTab === 'All') return true;
    if (filterTab === 'Published') return (a.status || '').toLowerCase() === 'published';
    if (filterTab === 'Draft') return (a.status || '').toLowerCase() === 'draft';
    return true;
  });

  function openCreate() {
    setEditArticle(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(article) {
    setEditArticle(article);
    setForm({
      title: article.title || '',
      category: article.category || 'Tesla',
      summary: article.summary || article.excerpt || '',
      imageUrl: article.imageUrl || article.image || '',
      status: article.status || 'Published',
      featured: !!article.featured,
    });
    setShowForm(true);
  }

  function handleSave() {
    if (!form.title) return;
    if (editArticle) {
      setArticles(prev =>
        prev.map(a =>
          a.id === editArticle.id
            ? { ...a, ...form, image: form.imageUrl }
            : a
        )
      );
    } else {
      setArticles(prev => [
        {
          id: Date.now(),
          ...form,
          image: form.imageUrl,
          date: new Date().toISOString(),
          author: 'Admin',
          views: 0,
        },
        ...prev,
      ]);
    }
    setShowForm(false);
    setEditArticle(null);
  }

  function handleDelete(id) {
    setArticles(prev => prev.filter(a => a.id !== id));
  }

  function toggleFeatured(id) {
    setArticles(prev => prev.map(a => (a.id === id ? { ...a, featured: !a.featured } : a)));
  }

  function toggleStatus(id) {
    setArticles(prev =>
      prev.map(a =>
        a.id === id
          ? { ...a, status: (a.status || '').toLowerCase() === 'published' ? 'Draft' : 'Published' }
          : a
      )
    );
  }

  const inputCls =
    'w-full bg-[#050505] border border-[#1F2937] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors';

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <PageHeader title="News Management" subtitle="Manage articles & editorial content" icon={Newspaper} />
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-semibold text-sm hover:bg-[#C9A227] transition-colors"
          >
            <Plus size={15} />
            Create Article
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: total, color: 'text-[#D4AF37]' },
            { label: 'Published', value: published, color: 'text-emerald-400' },
            { label: 'Draft', value: draft, color: 'text-yellow-400' },
            { label: 'Featured', value: featured, color: 'text-orange-400' },
          ].map(s => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0D0F14] border border-[#1F2937] rounded-xl p-4 text-center"
            >
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-gray-400 text-xs mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-[#0D0F14] border border-[#1F2937] rounded-xl p-1 w-fit mb-6">
          {['All', 'Published', 'Draft'].map(t => (
            <button
              key={t}
              onClick={() => setFilterTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterTab === t ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Article Cards */}
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-500">No articles found</div>
            ) : (
              filtered.map((article, i) => {
                const isPublished = (article.status || '').toLowerCase() === 'published';
                const imgSrc = article.imageUrl || article.image || article.thumbnail;
                return (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-4 flex items-start gap-4 hover:border-[#1F2937] hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-[100px] h-[70px] rounded-lg overflow-hidden bg-[#1F2937]">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={article.title}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <Newspaper size={24} />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getCategoryColor(article.category)}`}>
                              {article.category}
                            </span>
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                isPublished
                                  ? 'bg-emerald-400/10 text-emerald-400'
                                  : 'bg-yellow-400/10 text-yellow-400'
                              }`}
                            >
                              {isPublished ? 'Published' : 'Draft'}
                            </span>
                            {article.featured && (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-400/10 text-orange-400">
                                Featured
                              </span>
                            )}
                          </div>
                          <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 mb-1">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-3 text-gray-500 text-xs">
                            <span>{article.author || 'Admin'}</span>
                            <span>·</span>
                            <span>{formatDate(article.date || article.publishedAt || article.createdAt)}</span>
                            {article.views !== undefined && (
                              <>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                  <Eye size={11} /> {Number(article.views).toLocaleString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => toggleFeatured(article.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              article.featured
                                ? 'text-orange-400 bg-orange-400/10'
                                : 'text-gray-500 hover:text-orange-400 hover:bg-orange-400/10'
                            }`}
                            title="Toggle Featured"
                          >
                            <Star size={15} fill={article.featured ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            onClick={() => toggleStatus(article.id)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              isPublished
                                ? 'bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20'
                                : 'bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20'
                            }`}
                            title={isPublished ? 'Set to Draft' : 'Publish'}
                          >
                            {isPublished ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => openEdit(article)}
                            className="p-2 rounded-lg hover:bg-[#D4AF37]/10 text-[#D4AF37] transition-colors"
                            title="Edit"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="p-2 rounded-lg hover:bg-red-400/10 text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl w-full max-w-xl shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#1F2937]">
                <h2 className="text-white font-bold text-lg">
                  {editArticle ? 'Edit Article' : 'Create Article'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="text-gray-400 text-xs font-medium block mb-1.5">Title *</label>
                  <input
                    className={inputCls}
                    placeholder="Article title..."
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-xs font-medium block mb-1.5">Category</label>
                    <select
                      className={inputCls}
                      value={form.category}
                      onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    >
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs font-medium block mb-1.5">Status</label>
                    <select
                      className={inputCls}
                      value={form.status}
                      onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-xs font-medium block mb-1.5">Summary</label>
                  <textarea
                    className={inputCls + ' resize-none'}
                    rows={3}
                    placeholder="Brief summary..."
                    value={form.summary}
                    onChange={e => setForm(p => ({ ...p, summary: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-xs font-medium block mb-1.5">Image URL</label>
                  <input
                    className={inputCls}
                    placeholder="https://..."
                    value={form.imageUrl}
                    onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="featured-check"
                    type="checkbox"
                    checked={form.featured}
                    onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
                    className="w-4 h-4 accent-[#D4AF37] rounded"
                  />
                  <label htmlFor="featured-check" className="text-gray-300 text-sm select-none cursor-pointer">
                    Mark as Featured Article
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-[#1F2937] flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#D4AF37] text-black font-semibold text-sm hover:bg-[#C9A227] transition-colors"
                >
                  <Save size={15} />
                  {editArticle ? 'Save Changes' : 'Create Article'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#1F2937] text-gray-400 text-sm hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
