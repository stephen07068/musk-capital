import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const NAMES = [
  'James R.', 'Sofia M.', 'Liam T.', 'Aisha K.', 'Carlos B.',
  'Emma W.', 'Noah P.', 'Yuna L.', 'Marcus D.', 'Priya S.',
  'Oliver H.', 'Chloe N.', 'Ahmed Z.', 'Elena V.', 'David O.',
  'Mia C.', 'Ethan J.', 'Layla F.', 'Ryan G.', 'Isabella T.',
  'Jamal A.', 'Hannah M.', 'Lucas R.', 'Zoe B.', 'Andre K.',
];

const LOCATIONS = [
  'New York, US', 'London, UK', 'Dubai, UAE', 'Toronto, CA',
  'Sydney, AU', 'Paris, FR', 'Tokyo, JP', 'Singapore',
  'Lagos, NG', 'Berlin, DE', 'Mumbai, IN', 'São Paulo, BR',
];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomAmount(type) {
  if (type === 'deposit') {
    const amounts = [1000, 2500, 5000, 7500, 10000, 15000, 25000, 50000];
    return amounts[Math.floor(Math.random() * amounts.length)];
  } else {
    const amounts = [800, 1200, 3000, 4500, 8000, 12000, 20000];
    return amounts[Math.floor(Math.random() * amounts.length)];
  }
}

function generateActivity() {
  const type = Math.random() > 0.45 ? 'deposit' : 'withdrawal';
  return {
    id: Date.now() + Math.random(),
    type,
    name: NAMES[Math.floor(Math.random() * NAMES.length)],
    location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    amount: randomAmount(type),
  };
}

export default function ActivityToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(() => {
    const activity = generateActivity();
    setToasts(prev => [...prev.slice(-1), activity]); // max 1 at a time
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== activity.id));
    }, 5000);
  }, []);

  useEffect(() => {
    // First popup after 3s
    const first = setTimeout(addToast, 3000);

    // Then recurring every 7–14 seconds
    let interval;
    const startInterval = () => {
      interval = setInterval(() => {
        addToast();
      }, randomBetween(7000, 14000));
    };
    const startTimer = setTimeout(startInterval, 3000);

    return () => {
      clearTimeout(first);
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, [addToast]);

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => {
          const isDeposit = toast.type === 'deposit';
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: -60, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border"
              style={{
                background: 'rgba(10, 11, 15, 0.95)',
                backdropFilter: 'blur(16px)',
                borderColor: isDeposit ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)',
                boxShadow: isDeposit
                  ? '0 0 24px rgba(16,185,129,0.12), 0 8px 32px rgba(0,0,0,0.5)'
                  : '0 0 24px rgba(239,68,68,0.12), 0 8px 32px rgba(0,0,0,0.5)',
                minWidth: '260px',
                maxWidth: '320px',
              }}
            >
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: isDeposit ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }}
              >
                {isDeposit
                  ? <ArrowDownCircle size={18} className="text-emerald-400" />
                  : <ArrowUpCircle size={18} className="text-red-400" />
                }
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-white">{toast.name}</span>
                  <span className="text-[10px] text-[#6B7280]">from {toast.location}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-[#9CA3AF]">just</span>
                  <span
                    className="text-xs font-black"
                    style={{ color: isDeposit ? '#10B981' : '#EF4444' }}
                  >
                    {isDeposit ? 'deposited' : 'withdrew'}
                  </span>
                  <span className="text-xs font-black text-white">
                    ${toast.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Pulse dot */}
              <div className="relative shrink-0">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isDeposit ? '#10B981' : '#EF4444' }}
                />
                <div
                  className="absolute inset-0 w-2 h-2 rounded-full animate-ping opacity-60"
                  style={{ backgroundColor: isDeposit ? '#10B981' : '#EF4444' }}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
