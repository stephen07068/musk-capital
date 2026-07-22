import { useState, useEffect, useRef } from 'react';
import { fetchAllMarketData, fetchCryptoPrices, fetchStockPrices } from '../services/marketDataService';

/**
 * Hook to fetch and continuously update real market data
 * @param {number} updateInterval - How often to fetch new data (milliseconds)
 * @returns {Object} { data, loading, error, lastUpdated }
 */
export function useRealLiveMarketData(updateInterval = 10000) { // Changed from 30000 to 10000 (10 seconds)
  const [data, setData] = useState([
    { symbol: 'BTC', name: 'Bitcoin', price: 0, changePercent: 0, type: 'crypto', color: '#F97316' },
    { symbol: 'ETH', name: 'Ethereum', price: 0, changePercent: 0, type: 'crypto', color: '#6366F1' },
    { symbol: 'TSLA', name: 'Tesla', price: 0, changePercent: 0, type: 'stock', color: '#EF4444' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = async () => {
    try {
      const realMarketData = await fetchAllMarketData();
      if (realMarketData && realMarketData.length > 0) {
        setData(realMarketData);
        setLastUpdated(new Date());
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateInterval]);

  return { data, loading, error, lastUpdated };
}

/**
 * Hook specifically for crypto prices
 */
export function useRealCryptoPrices(updateInterval = 30000) {
  const [cryptoData, setCryptoData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = async () => {
    try {
      const data = await fetchCryptoPrices();
      if (data) {
        setCryptoData(data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching crypto prices:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateInterval]);

  return { cryptoData, loading, error };
}

/**
 * Hook specifically for stock prices
 */
export function useRealStockPrices(updateInterval = 60000) {
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = async () => {
    try {
      const data = await fetchStockPrices();
      if (data) {
        setStockData(data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching stock prices:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateInterval]);

  return { stockData, loading, error };
}
