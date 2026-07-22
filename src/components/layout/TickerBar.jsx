import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { marketData } from '../../data/mockData';
import { useRealLiveMarketData } from '../../hooks/useRealLiveData';

export default function TickerBar({ isFixed = false }) {
  const { data: liveMarketData } = useRealLiveMarketData(10000); // Update every 10 seconds
  const safeData = Array.isArray(liveMarketData) ? liveMarketData : [];
  const doubled = [...safeData, ...safeData]; // duplicate for seamless loop

  return (
    <div className={`w-full bg-[#0D0F14] border-b border-[#1F2937] overflow-hidden py-2 ${isFixed ? 'fixed top-0 left-0 right-0 z-[60]' : 'relative z-0'}`}>
      <div className="flex items-center gap-0 ticker-scroll whitespace-nowrap" style={{ width: 'max-content' }}>
        {doubled.map((item, idx) => (
          <div key={`${item?.symbol || idx}-${idx}`} className="flex items-center gap-2 px-6 border-r border-[#1F2937]">
            <span className="text-xs font-semibold text-white">{item?.symbol || ''}</span>
            <span className="text-xs text-[#9CA3AF]">
              {item?.price >= 1000
                ? `$${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : item?.price >= 1
                ? `$${item.price.toFixed(2)}`
                : `$${(item?.price || 0).toFixed(4)}`}
            </span>
            <span className={`flex items-center gap-0.5 text-xs font-medium ${(item?.changePercent || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {(item?.changePercent || 0) >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {(item?.changePercent || 0) >= 0 ? '+' : ''}{(item?.changePercent || 0).toFixed(2)}%
            </span>
            {idx === safeData.length - 1 && (
              <span className="ml-4 flex items-center gap-1 text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                LIVE
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
