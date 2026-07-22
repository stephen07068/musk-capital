import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { generateSparkline } from '../../data/mockData';

export default function MarketCard({ symbol, name, price, changePercent, color }) {
  const data = generateSparkline(price);
  const isPositive = changePercent >= 0;

  const formatPrice = (p) => {
    if (p >= 10000) return `$${p.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    if (p >= 1) return `$${p.toFixed(2)}`;
    return `$${p.toFixed(4)}`;
  };

  return (
    <div className="card-dark p-4 hover-lift flex items-center justify-between gap-3 min-w-[160px]">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: color + '22', color }}>
            {symbol.charAt(0)}
          </div>
          <span className="text-sm font-bold text-white truncate">{symbol}</span>
        </div>
        <p className="text-xs text-[#9CA3AF] truncate mb-2">{name}</p>
        <p className="text-base font-bold text-white">{formatPrice(price)}</p>
        <div className={`flex items-center gap-1 text-xs font-medium mt-0.5 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
        </div>
      </div>
      <div className="w-20 h-12 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={isPositive ? '#10B981' : '#EF4444'}
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
