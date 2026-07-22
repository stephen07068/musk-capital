import api from './api';

/**
 * Fetch real-time cryptocurrency prices from backend proxy
 */
export async function fetchCryptoPrices() {
  try {
    const response = await api.get('/market/crypto-prices');
    const cryptoArray = response.data || [];
    
    // Convert array to object keyed by symbol
    const cryptoData = {};
    if (Array.isArray(cryptoArray)) {
      cryptoArray.forEach(crypto => {
        cryptoData[crypto.symbol] = {
          symbol: crypto.symbol,
          name: crypto.name,
          price: crypto.price,
          change: crypto.changePercent,
          marketCap: crypto.marketCap,
          volume: crypto.volume,
          color: crypto.color
        };
      });
    }
    
    return cryptoData;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return null;
  }
}

/**
 * Fetch real-time stock prices from backend proxy
 */
export async function fetchStockPrices() {
  try {
    const response = await api.get('/market/stock-prices');
    const stockArray = response.data || [];
    
    // Convert array to object keyed by symbol
    const stockData = {};
    if (Array.isArray(stockArray)) {
      stockArray.forEach(stock => {
        stockData[stock.symbol] = {
          symbol: stock.symbol,
          name: stock.name,
          price: stock.price,
          change: stock.changePercent,
          changeValue: stock.changePercent,
          color: stock.color
        };
      });
    }
    
    return stockData;
  } catch (error) {
    console.error('Error fetching stock prices:', error);
    return null;
  }
}

/**
 * Combine all market data into one array
 */
export async function fetchAllMarketData() {
  try {
    const response = await api.get('/market/all-prices');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching all market data:', error);
    return [];
  }
}
