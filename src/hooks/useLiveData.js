import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for simulating live market data updates
 * @param {Array} initialData - Initial data array
 * @param {number} interval - Update interval in milliseconds (default: 3000)
 * @param {number} volatility - Price change volatility 0-1 (default: 0.02 = 2%)
 * @returns {Array} Updated live data
 */
export function useLiveData(initialData, interval = 3000, volatility = 0.02) {
  const [liveData, setLiveData] = useState(initialData);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!initialData || initialData.length === 0) return;

    intervalRef.current = setInterval(() => {
      setLiveData(prevData => 
        prevData.map(item => {
          // Generate random price change within volatility range
          const changePercent = (Math.random() - 0.5) * volatility * 2;
          const newPrice = item.price * (1 + changePercent);
          const newChange = ((newPrice - item.price) / item.price) * 100;

          return {
            ...item,
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(newChange.toFixed(2)),
            change_pct: parseFloat(newChange.toFixed(2)),
            // Update sparkline data if exists
            sparkline: item.sparkline ? [
              ...item.sparkline.slice(1),
              { value: newPrice }
            ] : item.sparkline,
          };
        })
      );
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [initialData, interval, volatility]);

  return liveData;
}

/**
 * Custom hook for simulating live chart data updates
 * @param {Array} initialData - Initial chart data array
 * @param {number} interval - Update interval in milliseconds (default: 5000)
 * @param {number} maxPoints - Maximum number of data points to keep (default: 20)
 * @returns {Array} Updated live chart data
 */
export function useLiveChartData(initialData, interval = 5000, maxPoints = 20) {
  const [chartData, setChartData] = useState(initialData);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!initialData || initialData.length === 0) return;

    intervalRef.current = setInterval(() => {
      setChartData(prevData => {
        const lastPoint = prevData[prevData.length - 1];
        const baseValue = lastPoint.value || lastPoint.amount || lastPoint.users || 0;
        
        // Generate new value with random fluctuation
        const fluctuation = (Math.random() - 0.5) * 0.1; // ±5%
        const newValue = baseValue * (1 + fluctuation);

        // Create new data point
        const newPoint = {
          ...lastPoint,
          time: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          value: parseFloat(newValue.toFixed(2)),
          amount: parseFloat(newValue.toFixed(2)),
          users: Math.round(newValue),
        };

        // Keep only maxPoints data points
        const updatedData = [...prevData, newPoint];
        return updatedData.slice(-maxPoints);
      });
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [initialData, interval, maxPoints]);

  return chartData;
}

/**
 * Custom hook for live stats counter animation
 * @param {number} targetValue - Target value to count to
 * @param {number} duration - Animation duration in milliseconds
 * @returns {number} Current animated value
 */
export function useLiveCounter(targetValue, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Ease out animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(targetValue * easeOut));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetValue, duration]);

  return count;
}

/**
 * Custom hook for live price ticker updates
 * @param {number} initialPrice - Starting price
 * @param {number} interval - Update interval in milliseconds
 * @param {number} volatility - Price volatility (default: 0.01 = 1%)
 * @returns {Object} { price, change, isIncreasing }
 */
export function useLivePriceTicker(initialPrice, interval = 2000, volatility = 0.01) {
  const [priceData, setPriceData] = useState({
    price: initialPrice,
    change: 0,
    isIncreasing: true,
  });
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPriceData(prev => {
        const changePercent = (Math.random() - 0.5) * volatility * 2;
        const newPrice = prev.price * (1 + changePercent);
        const priceChange = newPrice - prev.price;

        return {
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(priceChange.toFixed(2)),
          isIncreasing: priceChange >= 0,
        };
      });
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [initialPrice, interval, volatility]);

  return priceData;
}
