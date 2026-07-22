import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#07090D] pt-20">
      <div className="bg-gradient-to-b from-[#0D0F14] to-transparent py-14 border-b border-[#1F2937]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-2">Contact</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black text-white mb-3">Get in Touch</motion.h1>
          <p className="text-[#9CA3AF]">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-5">
            {[
              { icon: Mail, label: 'Email', value: 'contact@muskcapital.com', sub: 'For general inquiries' },
              { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', sub: 'Mon-Fri, 9am-6pm EST' },
              { icon: MapPin, label: 'Office', value: '123 Innovation Blvd', sub: 'San Francisco, CA 94105' },
              { icon: Clock, label: 'Business Hours', value: 'Mon–Fri: 9am–6pm', sub: 'Sat–Sun: Closed' },
            ].map(({ icon: Icon, label, value, sub }) => (
              <motion.div key={label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="card-dark p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF] font-medium">{label}</p>
                  <p className="text-sm font-semibold text-white">{value}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 card-dark p-8">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-[#9CA3AF]">Thank you for reaching out. We'll get back to you soon.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="mt-6 px-6 py-2.5 gold-gradient text-black text-sm font-bold rounded-xl">
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { field: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
                    { field: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
                  ].map(({ field, label, type, placeholder }) => (
                    <div key={field}>
                      <label className="block text-xs font-semibold text-[#9CA3AF] mb-2">{label}</label>
                      <input
                        type={type}
                        required
                        value={form[field]}
                        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 bg-[#0D0F14] border border-[#1F2937] rounded-xl text-white placeholder-[#6B7280] text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#9CA3AF] mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 bg-[#0D0F14] border border-[#1F2937] rounded-xl text-white placeholder-[#6B7280] text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#9CA3AF] mb-2">Message</label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Your message..."
                    className="w-full px-4 py-3 bg-[#0D0F14] border border-[#1F2937] rounded-xl text-white placeholder-[#6B7280] text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full py-3.5 gold-gradient text-black font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70"
                >
                  {loading ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />Sending...</span>
                  ) : (
                    <><Send size={16} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
