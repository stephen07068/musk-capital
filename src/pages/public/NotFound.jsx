import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07090D] flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 40%, #D4AF37 0%, transparent 60%)' }} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center relative">
        <div className="text-[140px] font-black leading-none gold-text mb-4">404</div>
        <h1 className="text-3xl font-black text-white mb-3">Page Not Found</h1>
        <p className="text-[#9CA3AF] mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="flex items-center justify-center gap-2 px-6 py-3 gold-gradient text-black font-bold rounded-xl hover:opacity-90 transition-opacity text-sm">
            <Home size={16} /> Back to Home
          </Link>
          <button onClick={() => window.history.back()} className="flex items-center justify-center gap-2 px-6 py-3 glass border border-[#1F2937] text-white font-semibold rounded-xl hover:border-[#D4AF37]/40 transition-all text-sm">
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
