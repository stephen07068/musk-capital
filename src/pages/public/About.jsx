import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Rocket, TrendingUp, ShieldAlert, Cpu, Database, Globe2, Zap } from 'lucide-react';
import elonImg from '../../assets/elon_about.png';

export default function About() {
  return (
    <div className="min-h-screen bg-[#07090D] pt-20">
      {/* Header */}
      <div className="relative py-20 bg-gradient-to-b from-[#0D0F14] to-transparent overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #D4AF37 0%, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative flex flex-col md:flex-row items-center gap-12">
          
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="w-full md:w-1/2 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#D4AF37] rounded-3xl blur-2xl opacity-20 animate-pulse" />
              <img 
                src={elonImg} 
                alt="Elon Musk" 
                className="relative w-full max-w-md rounded-3xl border border-[#D4AF37]/30 shadow-2xl object-cover"
              />
            </div>
          </motion.div>

          {/* Text */}
          <div className="w-full md:w-1/2 text-left">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-3">About The Vision</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-black text-white mb-5">
              Invest in the Future.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-lg text-[#9CA3AF] leading-relaxed mb-6">
              "When something is important enough, you do it even if the odds are not in your favor. But you don't have to do it alone." 
              <br/><br/>
              Musk Capital is your direct gateway to participating in the greatest technological revolution of our lifetime. By investing with us, you are fueling the companies that will make humanity a multi-planetary species, transition the world to sustainable energy, and unlock the next frontier of artificial intelligence.
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-[#D4AF37] font-semibold">
              - Elon Musk
            </motion.p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-12">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card-dark p-8">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-5">
              <Rocket size={24} className="text-[#D4AF37]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">Why Invest Now?</h2>
            <p className="text-[#9CA3AF] leading-relaxed">
              We are on the cusp of breakthroughs in AI, robotics, and aerospace. Investing your capital here ensures you're positioned at the forefront of exponential growth, rather than being left behind by legacy financial institutions.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="card-dark p-8">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-5">
              <TrendingUp size={24} className="text-[#D4AF37]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">Maximize Returns</h2>
            <p className="text-[#9CA3AF] leading-relaxed">
              Our portfolio isn't just about changing the world; it's about dominating future markets. Our advanced platform leverages AI to optimize your portfolio and provide exclusive access to private equity previously reserved for billionaires.
            </p>
          </motion.div>
        </div>

        {/* Objectives */}
        <div className="card-dark p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Your Investment Capabilities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Direct access to SpaceX & Neuralink private equity',
              'Real-time automated trading algorithms',
              'Institutional-grade security and asset protection',
              'Advanced portfolio analytics and AI insights',
              'Global market execution with zero latency',
              'Dedicated wealth management advisors',
              'Comprehensive tax optimization strategies',
              'Exclusive access to future IPOs and ventures',
            ].map((obj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                </div>
                <p className="text-sm text-[#9CA3AF]">{obj}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="card-dark p-8 border border-[#D4AF37]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-bl-full" />
          <h2 className="text-xl font-bold text-white mb-3">Join the Mission</h2>
          <p className="text-sm text-[#9CA3AF] leading-relaxed relative z-10">
            Musk Capital is an <strong>exclusive investment platform</strong>.
            All investments carry risks. Past performance is not indicative of future results, but we are building a future unlike anything the past has ever seen.
          </p>
        </div>
      </div>
    </div>
  );
}
