from flask import Blueprint, jsonify
import requests
import yfinance as yf
from datetime import datetime, timedelta
from functools import lru_cache

market_bp = Blueprint('market_data', __name__)

# CoinGecko API - Free, no key required
COINGECKO_API = 'https://api.coingecko.com/api/v3'

# Cache for storing data
_cache = {
    'crypto': {'data': None, 'timestamp': None},
    'stocks': {'data': None, 'timestamp': None}
}
CACHE_DURATION = 10  # Cache for 10 seconds

@market_bp.route('/crypto-prices', methods=['GET'])
def get_crypto_prices():
    """Fetch real-time cryptocurrency prices from CoinGecko with caching"""
    try:
        # Check cache
        now = datetime.now()
        if (_cache['crypto']['data'] and _cache['crypto']['timestamp'] and 
            (now - _cache['crypto']['timestamp']).seconds < CACHE_DURATION):
            return jsonify(_cache['crypto']['data']), 200
        
        response = requests.get(
            f'{COINGECKO_API}/simple/price',
            params={
                'ids': 'bitcoin,ethereum,dogecoin,solana,cardano,avalanche-2',
                'vs_currencies': 'usd',
                'include_24hr_change': 'true',
                'include_market_cap': 'true',
                'include_24hr_vol': 'true'
            },
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            
            # Format the response
            crypto_data = []
            
            if 'bitcoin' in data:
                crypto_data.append({
                    'symbol': 'BTC',
                    'name': 'Bitcoin',
                    'price': data['bitcoin'].get('usd', 0),
                    'changePercent': data['bitcoin'].get('usd_24h_change', 0),
                    'marketCap': format_market_cap(data['bitcoin'].get('usd_market_cap', 0)),
                    'volume': format_volume(data['bitcoin'].get('usd_24h_vol', 0)),
                    'color': '#F97316',
                    'type': 'crypto'
                })
            
            if 'ethereum' in data:
                crypto_data.append({
                    'symbol': 'ETH',
                    'name': 'Ethereum',
                    'price': data['ethereum'].get('usd', 0),
                    'changePercent': data['ethereum'].get('usd_24h_change', 0),
                    'marketCap': format_market_cap(data['ethereum'].get('usd_market_cap', 0)),
                    'volume': format_volume(data['ethereum'].get('usd_24h_vol', 0)),
                    'color': '#6366F1',
                    'type': 'crypto'
                })
            
            if 'dogecoin' in data:
                crypto_data.append({
                    'symbol': 'DOGE',
                    'name': 'Dogecoin',
                    'price': data['dogecoin'].get('usd', 0),
                    'changePercent': data['dogecoin'].get('usd_24h_change', 0),
                    'marketCap': format_market_cap(data['dogecoin'].get('usd_market_cap', 0)),
                    'volume': format_volume(data['dogecoin'].get('usd_24h_vol', 0)),
                    'color': '#EAB308',
                    'type': 'crypto'
                })
            
            if 'solana' in data:
                crypto_data.append({
                    'symbol': 'SOL',
                    'name': 'Solana',
                    'price': data['solana'].get('usd', 0),
                    'changePercent': data['solana'].get('usd_24h_change', 0),
                    'marketCap': format_market_cap(data['solana'].get('usd_market_cap', 0)),
                    'volume': format_volume(data['solana'].get('usd_24h_vol', 0)),
                    'color': '#8B5CF6',
                    'type': 'crypto'
                })
            
            if 'cardano' in data:
                crypto_data.append({
                    'symbol': 'ADA',
                    'name': 'Cardano',
                    'price': data['cardano'].get('usd', 0),
                    'changePercent': data['cardano'].get('usd_24h_change', 0),
                    'marketCap': format_market_cap(data['cardano'].get('usd_market_cap', 0)),
                    'volume': format_volume(data['cardano'].get('usd_24h_vol', 0)),
                    'color': '#3B82F6',
                    'type': 'crypto'
                })
            
            if 'avalanche-2' in data:
                crypto_data.append({
                    'symbol': 'AVAX',
                    'name': 'Avalanche',
                    'price': data['avalanche-2'].get('usd', 0),
                    'changePercent': data['avalanche-2'].get('usd_24h_change', 0),
                    'marketCap': format_market_cap(data['avalanche-2'].get('usd_market_cap', 0)),
                    'volume': format_volume(data['avalanche-2'].get('usd_24h_vol', 0)),
                    'color': '#EF4444',
                    'type': 'crypto'
                })
            
            # Update cache
            _cache['crypto']['data'] = crypto_data
            _cache['crypto']['timestamp'] = now
            
            return jsonify(crypto_data), 200
        else:
            return jsonify({'error': 'Failed to fetch crypto prices'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@market_bp.route('/stock-prices', methods=['GET'])
def get_stock_prices():
    """Fetch real-time stock prices using yfinance with caching"""
    try:
        # Check cache
        now = datetime.now()
        if (_cache['stocks']['data'] and _cache['stocks']['timestamp'] and 
            (now - _cache['stocks']['timestamp']).seconds < CACHE_DURATION):
            return jsonify(_cache['stocks']['data']), 200
        
        symbols = ['TSLA', 'NVDA', 'AAPL', 'MSFT', 'AMZN', 'GOOGL']
        stock_data = []
        
        # Fetch all at once for speed
        tickers = yf.Tickers(' '.join(symbols))
        
        for symbol in symbols:
            try:
                ticker = tickers.tickers[symbol]
                info = ticker.history(period='2d')
                
                if not info.empty:
                    current_price = info['Close'].iloc[-1]
                    prev_close = info['Close'].iloc[-2] if len(info) > 1 else current_price
                    change_percent = ((current_price - prev_close) / prev_close * 100) if prev_close else 0
                    
                    stock_data.append({
                        'symbol': symbol,
                        'name': get_stock_name(symbol),
                        'price': round(float(current_price), 2),
                        'changePercent': round(float(change_percent), 2),
                        'color': get_stock_color(symbol),
                        'type': 'stock'
                    })
            except Exception as e:
                print(f"Error fetching {symbol}: {e}")
                continue
        
        # Update cache
        _cache['stocks']['data'] = stock_data
        _cache['stocks']['timestamp'] = now
        
        return jsonify(stock_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@market_bp.route('/all-prices', methods=['GET'])
def get_all_prices():
    """Fetch all market data (crypto + stocks) with caching and fallbacks"""
    try:
        now = datetime.now()
        
        # Determine if we need to fetch crypto
        if not (_cache['crypto']['data'] and _cache['crypto']['timestamp'] and 
               (now - _cache['crypto']['timestamp']).seconds < CACHE_DURATION):
            try:
                # Fetch Crypto
                crypto_response = requests.get(
                    f'{COINGECKO_API}/simple/price',
                    params={
                        'ids': 'bitcoin,ethereum,dogecoin,solana,cardano,avalanche-2',
                        'vs_currencies': 'usd',
                        'include_24hr_change': 'true',
                        'include_market_cap': 'true',
                        'include_24hr_vol': 'true'
                    },
                    timeout=5
                )
                
                crypto_data = []
                if crypto_response.status_code == 200:
                    data = crypto_response.json()
                    
                    if 'bitcoin' in data:
                        crypto_data.append({'symbol': 'BTC', 'name': 'Bitcoin', 'price': data['bitcoin'].get('usd', 0), 'changePercent': data['bitcoin'].get('usd_24h_change', 0), 'marketCap': format_market_cap(data['bitcoin'].get('usd_market_cap', 0)), 'volume': format_volume(data['bitcoin'].get('usd_24h_vol', 0)), 'color': '#F97316', 'type': 'crypto'})
                    if 'ethereum' in data:
                        crypto_data.append({'symbol': 'ETH', 'name': 'Ethereum', 'price': data['ethereum'].get('usd', 0), 'changePercent': data['ethereum'].get('usd_24h_change', 0), 'marketCap': format_market_cap(data['ethereum'].get('usd_market_cap', 0)), 'volume': format_volume(data['ethereum'].get('usd_24h_vol', 0)), 'color': '#6366F1', 'type': 'crypto'})
                    if 'dogecoin' in data:
                        crypto_data.append({'symbol': 'DOGE', 'name': 'Dogecoin', 'price': data['dogecoin'].get('usd', 0), 'changePercent': data['dogecoin'].get('usd_24h_change', 0), 'marketCap': format_market_cap(data['dogecoin'].get('usd_market_cap', 0)), 'volume': format_volume(data['dogecoin'].get('usd_24h_vol', 0)), 'color': '#EAB308', 'type': 'crypto'})
                    if 'solana' in data:
                        crypto_data.append({'symbol': 'SOL', 'name': 'Solana', 'price': data['solana'].get('usd', 0), 'changePercent': data['solana'].get('usd_24h_change', 0), 'marketCap': format_market_cap(data['solana'].get('usd_market_cap', 0)), 'volume': format_volume(data['solana'].get('usd_24h_vol', 0)), 'color': '#8B5CF6', 'type': 'crypto'})
                    if 'cardano' in data:
                        crypto_data.append({'symbol': 'ADA', 'name': 'Cardano', 'price': data['cardano'].get('usd', 0), 'changePercent': data['cardano'].get('usd_24h_change', 0), 'marketCap': format_market_cap(data['cardano'].get('usd_market_cap', 0)), 'volume': format_volume(data['cardano'].get('usd_24h_vol', 0)), 'color': '#3B82F6', 'type': 'crypto'})
                    if 'avalanche-2' in data:
                        crypto_data.append({'symbol': 'AVAX', 'name': 'Avalanche', 'price': data['avalanche-2'].get('usd', 0), 'changePercent': data['avalanche-2'].get('usd_24h_change', 0), 'marketCap': format_market_cap(data['avalanche-2'].get('usd_market_cap', 0)), 'volume': format_volume(data['avalanche-2'].get('usd_24h_vol', 0)), 'color': '#EF4444', 'type': 'crypto'})
                    
                    _cache['crypto']['data'] = crypto_data
                    _cache['crypto']['timestamp'] = now
                else:
                    raise Exception("Non-200 from CoinGecko")
            except Exception as e:
                print(f"CoinGecko error: {e}")
                if not _cache['crypto']['data']:
                    _cache['crypto']['data'] = [
                        {'symbol': 'BTC', 'name': 'Bitcoin', 'price': 65432.10, 'changePercent': 2.5, 'marketCap': '$1.2T', 'volume': '$30B', 'color': '#F97316', 'type': 'crypto'},
                        {'symbol': 'ETH', 'name': 'Ethereum', 'price': 3456.78, 'changePercent': 1.2, 'marketCap': '$400B', 'volume': '$15B', 'color': '#6366F1', 'type': 'crypto'}
                    ]
                
        # Determine if we need to fetch stocks
        if not (_cache['stocks']['data'] and _cache['stocks']['timestamp'] and 
               (now - _cache['stocks']['timestamp']).seconds < CACHE_DURATION):
            try:
                symbols = ['TSLA', 'NVDA', 'AAPL', 'MSFT', 'AMZN', 'GOOGL']
                stock_data = []
                tickers = yf.Tickers(' '.join(symbols))
                
                for symbol in symbols:
                    try:
                        ticker = tickers.tickers[symbol]
                        info = ticker.history(period='2d')
                        if not info.empty:
                            current_price = info['Close'].iloc[-1]
                            prev_close = info['Close'].iloc[-2] if len(info) > 1 else current_price
                            change_percent = ((current_price - prev_close) / prev_close * 100) if prev_close else 0
                            stock_data.append({'symbol': symbol, 'name': get_stock_name(symbol), 'price': round(float(current_price), 2), 'changePercent': round(float(change_percent), 2), 'color': get_stock_color(symbol), 'type': 'stock'})
                    except Exception as e:
                        print(f"Error fetching {symbol}: {e}")
                        continue
                        
                if stock_data:
                    _cache['stocks']['data'] = stock_data
                    _cache['stocks']['timestamp'] = now
                else:
                    raise Exception("No stock data returned")
            except Exception as e:
                print(f"yfinance error: {e}")
                if not _cache['stocks']['data']:
                    _cache['stocks']['data'] = [
                        {'symbol': 'TSLA', 'name': 'Tesla, Inc.', 'price': 250.00, 'changePercent': 4.5, 'color': '#EF4444', 'type': 'stock'},
                        {'symbol': 'NVDA', 'name': 'NVIDIA Corp.', 'price': 120.50, 'changePercent': 3.2, 'color': '#10B981', 'type': 'stock'}
                    ]

        all_data = (_cache['stocks']['data'] or []) + (_cache['crypto']['data'] or [])
        return jsonify(all_data), 200
        
    except Exception as e:
        # Failsafe fallback
        print(f"Global all-prices error: {e}")
        fallback = [
            {'symbol': 'BTC', 'name': 'Bitcoin', 'price': 65432.10, 'changePercent': 2.5, 'color': '#F97316', 'type': 'crypto'},
            {'symbol': 'TSLA', 'name': 'Tesla', 'price': 250.00, 'changePercent': 4.5, 'color': '#EF4444', 'type': 'stock'}
        ]
        return jsonify(fallback), 200


def format_market_cap(value):
    """Format market cap to readable string"""
    if value >= 1e12:
        return f'${value / 1e12:.2f}T'
    elif value >= 1e9:
        return f'${value / 1e9:.1f}B'
    elif value >= 1e6:
        return f'${value / 1e6:.1f}M'
    return f'${value:.0f}'


def format_volume(value):
    """Format volume to readable string"""
    if value >= 1e9:
        return f'${value / 1e9:.1f}B'
    elif value >= 1e6:
        return f'${value / 1e6:.1f}M'
    elif value >= 1e3:
        return f'${value / 1e3:.1f}K'
    return f'${value:.0f}'


def get_stock_name(symbol):
    """Get full stock name"""
    names = {
        'TSLA': 'Tesla, Inc.',
        'NVDA': 'NVIDIA Corp.',
        'AAPL': 'Apple Inc.',
        'MSFT': 'Microsoft Corp.',
        'AMZN': 'Amazon.com',
        'GOOGL': 'Alphabet Inc.'
    }
    return names.get(symbol, symbol)


def get_stock_color(symbol):
    """Get stock color"""
    colors = {
        'TSLA': '#EF4444',
        'NVDA': '#10B981',
        'AAPL': '#6B7280',
        'MSFT': '#3B82F6',
        'AMZN': '#F97316',
        'GOOGL': '#EAB308'
    }
    return colors.get(symbol, '#9CA3AF')
