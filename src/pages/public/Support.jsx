import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, ChevronDown, ChevronUp,
  Clock, Shield, Headphones, BookOpen, Send, CheckCircle2,
  Zap, AlertCircle, ArrowRight, Star
} from 'lucide-react';

const faqs = [
  {
    category: 'Account',
    items: [
      {
        q: 'How do I create a Musk Capital account?',
        a: 'Click "Get Started" on the homepage and fill in your name, email, username, and password. You can also sign up quickly using Google OAuth. Once registered, verify your email and your account will be instantly active.'
      },
      {
        q: 'How do I reset my password?',
        a: 'Go to the Login page and click "Forgot password?". Enter your registered email address and we\'ll send you a secure reset link. The link expires after 30 minutes for security.'
      },
      {
        q: 'Can I change my username after registration?',
        a: 'Yes! Navigate to your Profile page from the dashboard sidebar. You can update your username, display name, bio, and profile picture at any time.'
      },
      {
        q: 'Is my personal data secure?',
        a: 'Absolutely. We use industry-standard AES-256 encryption for data at rest, TLS 1.3 for data in transit, and JWT-based authentication with short-lived tokens. We never sell or share your personal information.'
      },
    ]
  },
  {
    category: 'Deposits & Withdrawals',
    items: [
      {
        q: 'How long does a cryptocurrency deposit take to process?',
        a: 'Crypto deposits are manually reviewed by our team within 1–24 hours on business days. Once approved, funds are immediately reflected in your account balance. You\'ll receive an in-app notification and email when processed.'
      },
      {
        q: 'What cryptocurrencies do you accept for deposits?',
        a: 'We currently accept Bitcoin (BTC), Ethereum (ETH), and Tether (USDT) on their respective networks. Additional currencies may be added in future updates.'
      },
      {
        q: 'Can I deposit using gift cards?',
        a: 'Yes! Navigate to Deposit → Gift Card in your dashboard. Upload a photo of your gift card along with the card code. Supported brands include Amazon, Apple, Google Play, Steam, Visa, Mastercard, and Amex. Processing takes 2–48 hours.'
      },
      {
        q: 'How do I withdraw funds?',
        a: 'Go to Withdraw in your dashboard. Select your preferred cryptocurrency, enter your wallet address, and confirm the amount. Withdrawals are reviewed within 24 hours. Your balance is held during the pending review period.'
      },
      {
        q: 'What is the minimum withdrawal amount?',
        a: 'The minimum withdrawal amount is $50 USD equivalent. There are no maximum limits, but large withdrawals may require additional verification for security purposes.'
      },
    ]
  },
  {
    category: 'Investments & Portfolio',
    items: [
      {
        q: 'What investment plans are available?',
        a: 'We offer four tiers: Starter (3.5% monthly ROI), Premium (5.5% monthly ROI), Advanced (8% monthly ROI), and Elite (12% monthly ROI). Each plan has a minimum investment amount and duration. View full details on the Investment Plans page.'
      },
      {
        q: 'How is my portfolio value calculated?',
        a: 'Your portfolio value combines your account balance with any active investment positions, tracked at live market rates. The dashboard refreshes prices every 30 seconds using real-time market data feeds.'
      },
      {
        q: 'Can I track stocks and crypto in my watchlist?',
        a: 'Yes! Add any stock or crypto symbol to your personal watchlist from the Markets or Watchlist pages. Prices update in real-time and you\'ll see percentage changes, charts, and trend indicators.'
      },
    ]
  },
  {
    category: 'Technical Issues',
    items: [
      {
        q: 'The website is showing a blank page. What should I do?',
        a: 'Try a hard refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac). Clear your browser cache and cookies. If the issue persists, try a different browser or disable browser extensions. Contact support if it continues.'
      },
      {
        q: 'I can\'t log in even with the correct credentials. What\'s wrong?',
        a: 'Ensure you\'re using the correct portal — admin accounts must use /admin/login, not the regular login page. Check for caps lock, ensure cookies are enabled in your browser, and try clearing site data. Use "Forgot Password" if needed.'
      },
      {
        q: 'The market data isn\'t updating. Is this normal?',
        a: 'Market data requires the backend server to be running. If you see stale prices, it may indicate a temporary server issue. Refresh the page after 30 seconds. If the issue persists, contact our technical team.'
      },
    ]
  },
];

const channels = [
  {
    icon: Mail,
    title: 'Email Support',
    desc: 'Detailed responses within 24 hours',
    value: 'muskcapital7@gmail.com',
    color: '#D4AF37',
    action: 'Send Email',
    href: 'mailto:muskcapital7@gmail.com',
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      layout
      className="border border-[#1F2937] rounded-2xl overflow-hidden hover:border-[#D4AF37]/20 transition-all"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left bg-[#0D0F14] hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-sm font-semibold text-white leading-snug">{q}</span>
        <span className="shrink-0 mt-0.5 text-[#D4AF37]">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 text-sm text-[#9CA3AF] leading-relaxed bg-[#0D0F14] border-t border-[#1F2937]">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Support() {
  const [activeCategory, setActiveCategory] = useState('Account');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', priority: 'medium' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const activeFAQs = faqs.find(f => f.category === activeCategory)?.items || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Hero */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold mb-6">
            <Headphones size={12} />
            24/7 Customer Support
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            How can we <span className="text-[#D4AF37]">help you?</span>
          </h1>
          <p className="text-lg text-[#9CA3AF] max-w-xl mx-auto">
            Our dedicated support team is here to assist you with anything — from account setup to investment questions.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
            {[
              { icon: Clock, label: '< 24hr Response' },
              { icon: Shield, label: 'Bank-Level Security' },
              { icon: Star, label: '4.9/5 Satisfaction' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                  <Icon size={14} className="text-[#D4AF37]" />
                </div>
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact Channels */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <div className="flex justify-center">
          {channels.map(({ icon: Icon, title, desc, value, color, action, href }, i) => (
            <motion.a
              key={title}
              href={href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group block bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-6 hover:border-[#D4AF37]/30 transition-all max-w-sm w-full"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: color + '18' }}
              >
                <Icon size={22} style={{ color }} />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
              <p className="text-xs text-[#6B7280] mb-3">{desc}</p>
              <p className="text-xs font-semibold text-[#9CA3AF] mb-4">{value}</p>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors"
                style={{ color }}
              >
                {action} <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </motion.a>
          ))}
        </div>
      </section>

      {/* FAQ + Ticket Form */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* FAQ */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen size={18} className="text-[#D4AF37]" />
              <h2 className="text-lg font-black text-white">Frequently Asked Questions</h2>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-5">
              {faqs.map(f => (
                <button
                  key={f.category}
                  onClick={() => setActiveCategory(f.category)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === f.category
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-[#0D0F14] border border-[#1F2937] text-[#9CA3AF] hover:text-white hover:border-[#D4AF37]/30'
                  }`}
                >
                  {f.category}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                {activeFAQs.map((item, i) => (
                  <FAQItem key={i} {...item} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Quick links */}
            <div className="mt-8 p-5 bg-[#0D0F14] border border-[#1F2937] rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={14} className="text-[#D4AF37]" />
                <span className="text-xs font-bold text-white">Quick Resources</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Deposit Guide', to: '/dashboard/deposit' },
                  { label: 'Withdrawal Info', to: '/dashboard/withdraw' },
                  { label: 'Investment Plans', to: '/dashboard/plans' },
                  { label: 'Account Settings', to: '/dashboard/settings' },
                  { label: 'Live Markets', to: '/markets' },
                  { label: 'About Us', to: '/about' },
                ].map(({ label, to }) => (
                  <a
                    key={label}
                    href={to}
                    className="flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#D4AF37] transition-colors py-1"
                  >
                    <ArrowRight size={11} />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Support Ticket Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-6 sticky top-28">
              <div className="flex items-center gap-2 mb-5">
                <Send size={16} className="text-[#D4AF37]" />
                <h2 className="text-sm font-black text-white">Submit a Ticket</h2>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-400/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={28} className="text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-black text-white mb-2">Ticket Submitted!</h3>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed mb-5">
                    We've received your message and will respond to <span className="text-[#D4AF37]">{form.email}</span> within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '', priority: 'medium' }); }}
                    className="px-4 py-2 text-xs font-bold text-[#D4AF37] border border-[#D4AF37]/30 rounded-xl hover:bg-[#D4AF37]/10 transition-colors"
                  >
                    Submit Another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-[#9CA3AF] mb-1.5 uppercase tracking-wider">Full Name</label>
                    <input
                      id="support-name"
                      name="name"
                      required
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="John Doe"
                      className="w-full px-3 py-2.5 bg-black/40 border border-[#1F2937] rounded-xl text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#9CA3AF] mb-1.5 uppercase tracking-wider">Email Address</label>
                    <input
                      id="support-email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full px-3 py-2.5 bg-black/40 border border-[#1F2937] rounded-xl text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#9CA3AF] mb-1.5 uppercase tracking-wider">Priority</label>
                    <select
                      id="support-priority"
                      name="priority"
                      value={form.priority}
                      onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-black/40 border border-[#1F2937] rounded-xl text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                    >
                      <option value="low">🟢 Low — General question</option>
                      <option value="medium">🟡 Medium — Account issue</option>
                      <option value="high">🔴 High — Financial / urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#9CA3AF] mb-1.5 uppercase tracking-wider">Subject</label>
                    <input
                      id="support-subject"
                      name="subject"
                      required
                      value={form.subject}
                      onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                      placeholder="Brief description of your issue"
                      className="w-full px-3 py-2.5 bg-black/40 border border-[#1F2937] rounded-xl text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#9CA3AF] mb-1.5 uppercase tracking-wider">Message</label>
                    <textarea
                      id="support-message"
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Describe your issue in detail..."
                      className="w-full px-3 py-2.5 bg-black/40 border border-[#1F2937] rounded-xl text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37]/50 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-[#D4AF37]/5 border border-[#D4AF37]/15 rounded-xl">
                    <AlertCircle size={13} className="text-[#D4AF37] shrink-0 mt-0.5" />
                    <p className="text-[10px] text-[#9CA3AF] leading-relaxed">
                      For financial issues (deposits/withdrawals), please include your transaction ID for faster resolution.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 gold-gradient text-black text-sm font-black rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Submit Ticket
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
