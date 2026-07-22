import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Zap, Star, Crown, ChevronRight, ShieldCheck, Clock, TrendingUp, X } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';

const plans = [
  {
    id: 'starter',
    name: 'Starter Plan',
    badge: null,
    dailyROI: '1.5%',
    dailyROINum: 1.5,
    minInvestment: 1000,
    maxInvestment: 4999,
    duration: '30 Days',
    totalROI: '45%',
    color: '#D4AF37',
    icon: TrendingUp,
    features: [
      'Instant Withdrawals',
      '24/7 Support',
      'Secure Platform',
      'Real-time Dashboard',
      'Email Notifications',
    ],
  },
  {
    id: 'professional',
    name: 'Professional Plan',
    badge: '⭐ MOST POPULAR',
    dailyROI: '2.5%',
    dailyROINum: 2.5,
    minInvestment: 5000,
    maxInvestment: 49999,
    duration: '60 Days',
    totalROI: '150%',
    color: '#F97316',
    icon: Star,
    features: [
      'Instant Withdrawals',
      '24/7 Priority Support',
      'Secure Platform',
      'Real-time Dashboard',
      'Email & SMS Notifications',
      'Dedicated Account Manager',
    ],
  },
  {
    id: 'vip',
    name: 'VIP Plan',
    badge: null,
    dailyROI: '3.5%',
    dailyROINum: 3.5,
    minInvestment: 50000,
    maxInvestment: 1000000,
    duration: '90 Days',
    totalROI: '315%',
    color: '#8B5CF6',
    icon: Crown,
    features: [
      'Instant Withdrawals',
      '24/7 VIP Support',
      'Secure Platform',
      'Real-time Dashboard',
      'All Notification Channels',
      'Dedicated Account Manager',
      'Private Investment Reports',
    ],
  },
];

function InvestModal({ plan, onClose }) {
  const [amount, setAmount] = useState(plan.minInvestment);
  const [step, setStep] = useState(1); // 1: input, 2: processing, 3: success

  const dailyEarning = ((amount * plan.dailyROINum) / 100).toFixed(2);
  const totalEarning = ((amount * parseFloat(plan.totalROI)) / 100).toFixed(2);

  const handleConfirm = () => {
    setStep(2);
    setTimeout(() => setStep(3), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => step !== 2 && onClose()}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-[#0D0F14] border border-[#1F222A] rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden"
      >
        {/* Top accent */}
        <div className="h-1 w-full" style={{ backgroundColor: plan.color }} />

        {step === 1 && (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="text-sm text-[#9CA3AF]">{plan.dailyROI} Daily ROI · {plan.duration}</p>
              </div>
              <button onClick={onClose} className="text-[#6B7280] hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block mb-2">Investment Amount ($)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-bold text-lg">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  min={plan.minInvestment}
                  max={plan.maxInvestment}
                  className="w-full bg-[#050505] border border-[#1F222A] rounded-xl py-3.5 pl-9 pr-4 text-white font-bold text-lg focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
              <p className="text-xs text-[#6B7280] mt-1">
                Min: ${plan.minInvestment.toLocaleString()} · Max: ${plan.maxInvestment.toLocaleString()}
              </p>
              {(amount < plan.minInvestment || amount > plan.maxInvestment) && (
                <p className="text-xs text-red-400 mt-1">Amount must be between ${plan.minInvestment.toLocaleString()} and ${plan.maxInvestment.toLocaleString()}</p>
              )}
            </div>

            {/* Earnings preview */}
            <div className="bg-[#050505] border border-[#1F222A] rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Earnings Preview</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#9CA3AF]">Daily Earnings</span>
                <span className="text-sm font-bold" style={{ color: plan.color }}>${parseFloat(dailyEarning).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#9CA3AF]">Total Earnings ({plan.duration})</span>
                <span className="text-sm font-bold text-emerald-400">${parseFloat(totalEarning).toLocaleString()}</span>
              </div>
              <div className="border-t border-[#1F222A] pt-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-white">Total Return</span>
                <span className="text-lg font-black text-white">${(amount + parseFloat(totalEarning)).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 bg-[#1F222A] hover:bg-[#374151] text-white rounded-xl font-semibold transition-colors text-sm">
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={amount < plan.minInvestment || amount > plan.maxInvestment}
                className="flex-1 py-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
                style={{ backgroundColor: plan.color, color: '#000' }}
              >
                Invest Now <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-10 flex flex-col items-center justify-center space-y-6 text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#1F222A] rounded-full animate-spin" style={{ borderTopColor: plan.color }} />
              <Zap size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: plan.color }} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Processing Investment</h3>
              <p className="text-sm text-[#9CA3AF]">Securing your allocation...</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-10 flex flex-col items-center justify-center space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Investment Activated!</h3>
              <p className="text-sm text-[#9CA3AF]">
                Your <span className="text-white font-bold">${amount.toLocaleString()}</span> has been invested in the <span style={{ color: plan.color }} className="font-bold">{plan.name}</span>. You will earn <span className="text-emerald-400 font-bold">${parseFloat(dailyEarning).toLocaleString()}</span> daily.
              </p>
            </div>
            <button onClick={onClose} className="w-full py-3 bg-[#1F222A] hover:bg-[#374151] text-white rounded-xl font-semibold transition-colors text-sm">
              Close
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function InvestmentPlans() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div className="p-4 sm:p-6 space-y-8">
      <PageHeader
        title="Investment Plans"
        subtitle="Choose a plan that fits your goals and start growing your wealth today."
      />

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => {
          const Icon = plan.icon;
          const isPopular = !!plan.badge;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col rounded-2xl overflow-hidden border transition-all ${
                isPopular
                  ? 'border-[#F97316]/50 shadow-2xl shadow-[#F97316]/10 scale-[1.02]'
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
                <button
                  onClick={() => setSelectedPlan(plan)}
                  className="w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 hover:opacity-90 shadow-lg"
                  style={{
                    backgroundColor: plan.color,
                    color: '#000',
                    boxShadow: `0 0 20px ${plan.color}40`
                  }}
                >
                  Invest Now
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: ShieldCheck, label: 'Secure Platform', sub: 'Bank-level encryption' },
          { icon: Zap, label: 'Instant Withdrawals', sub: 'Withdraw anytime' },
          { icon: Clock, label: '24/7 Support', sub: 'Always available' },
          { icon: TrendingUp, label: 'Real-time Dashboard', sub: 'Live portfolio tracking' },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-3 bg-[#0D0F14] border border-[#1F222A] rounded-xl p-4">
            <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
              <Icon size={18} className="text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">{label}</p>
              <p className="text-[10px] text-[#6B7280]">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <InvestModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
