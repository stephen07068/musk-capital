import React from 'react';
import { motion } from 'framer-motion';

export default function LiveIndicator({ size = 'sm', label = 'LIVE' }) {
  const sizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const textSizeClasses = {
    xs: 'text-[9px]',
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="relative">
        <motion.div
          className={`${sizeClasses[size]} bg-emerald-400 rounded-full`}
          animate={{
            opacity: [1, 0.4, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} bg-emerald-400 rounded-full`}
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </div>
      <span className={`${textSizeClasses[size]} font-bold text-emerald-400 tracking-wider`}>
        {label}
      </span>
    </div>
  );
}
