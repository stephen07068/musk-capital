import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, TrendingUp, Star, Crown } from 'lucide-react';

const tieredPlans = [
  {
    id: 'starter',
    name: 'Starter Plan',
    badge: null,
    dailyROI: '1.5%',
    minInvestment: 1000,
    maxInvestment: 4999,
    duration: '30 Days',
    totalROI: '45%',
    color: '#D4AF37',
    icon: TrendingUp,
    features: ['Instant Withdrawals', '24/7 Support', 'Secure Platform', 'Real-time Dashboard', 'Email Notifications'],
  },
  {
    id: 'professional',
    name: 'Professional Plan',
    badge: '⭐ MOST POPULAR',
    dailyROI: '2.5%',
    minInvestment: 5000,
    maxInvestment: 49999,
    duration: '60 Days',
    totalROI: '150%',
    color: '#F97316',
    icon: Star,
    features: ['Instant Withdrawals', '24/7 Priority Support', 'Secure Platform', 'Real-time Dashboard', 'Email & SMS Notifications', 'Dedicated Account Manager'],
  },
  {
    id: 'vip',
    name: 'VIP Plan',
    badge: null,
    dailyROI: '3.5%',
    minInvestment: 50000,
    maxInvestment: 1000000,
    duration: '90 Days',
    totalROI: '315%',
    color: '#8B5CF6',
    icon: Crown,
    features: ['Instant Withdrawals', '24/7 VIP Support', 'Secure Platform', 'Real-time Dashboard', 'All Notification Channels', 'Dedicated Account Manager', 'Private Investment Reports'],
  },
];

export default function InvestmentPlanSection() {
  return (
    <section className="py-20 border-t border-[#1F2937]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Investment Plans</h2>
          <p className="text-[#9CA3AF] text-lg">Choose a plan that fits your goals and start growing your wealth today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tieredPlans.map((plan, i) => {
            const Icon = plan.icon;
            const isPopular = !!plan.badge;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex flex-col rounded-2xl overflow-hidden border transition-all ${
                  isPopular
                    ? 'border-[#F97316]/50 shadow-2xl shadow-[#F97316]/10 scale-[1.02] z-10'
                    : 'border-[#1F222A] hover:border-[#D4AF37]/30'
                } bg-[#0D0F14]`}
              >
                {/* Top color bar */}
                <div className="h-1.5 w-full" style={{ backgroundColor: plan.color }} />

                {/* Badge */}
                {plan.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-black" style={{ backgroundColor: plan.color }}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: plan.color + '20' }}>
                      <Icon size={20} style={{ color: plan.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={13} style={{ color: plan.color }} />
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: plan.color }}>{plan.name.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Daily ROI */}
                  <div className="mb-5">
                    <p className="text-5xl font-black text-white mb-1">{plan.dailyROI}</p>
                    <p className="text-sm text-[#9CA3AF] font-medium">Daily ROI</p>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-[#0A0B0F] border border-[#1F222A] rounded-xl p-3">
                      <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider mb-1">Min. Investment</p>
                      <p className="text-base font-black text-white">${plan.minInvestment.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#0A0B0F] border border-[#1F222A] rounded-xl p-3">
                      <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider mb-1">Max. Investment</p>
                      <p className="text-base font-black text-white">${plan.maxInvestment.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#0A0B0F] border border-[#1F222A] rounded-xl p-3">
                      <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider mb-1">Duration</p>
                      <p className="text-base font-black text-white">{plan.duration}</p>
                    </div>
                    <div className="bg-[#0A0B0F] border border-[#1F222A] rounded-xl p-3">
                      <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider mb-1">Total ROI</p>
                      <p className="text-base font-black text-emerald-400">{plan.totalROI}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-[#9CA3AF]">
                        <CheckCircle2 size={14} style={{ color: plan.color }} className="shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    to="/register"
                    className="w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 hover:opacity-90 shadow-lg"
                    style={{
                      backgroundColor: plan.color,
                      color: '#000',
                      boxShadow: `0 0 20px ${plan.color}40`
                    }}
                  >
                    Invest Now
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
