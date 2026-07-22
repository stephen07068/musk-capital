import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Core
    SECRET_KEY              = os.getenv('JWT_SECRET_KEY', 'dev-secret-key-change-in-production')
    FLASK_ENV               = os.getenv('FLASK_ENV', 'development')

    # Database — supports Supabase PostgreSQL or local SQLite
    _db_url = os.getenv('DATABASE_URL', 'sqlite:///muskcapital.db')
    # Supabase/Heroku give postgres:// — SQLAlchemy needs postgresql://
    if _db_url.startswith('postgres://'):
        _db_url = _db_url.replace('postgres://', 'postgresql://', 1)
    SQLALCHEMY_DATABASE_URI = _db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping':    True,
        'pool_recycle':     300,
        'connect_args':     {'sslmode': 'require'} if 'supabase' in os.getenv('DATABASE_URL', '') else {},
    }

    # JWT
    JWT_SECRET_KEY              = os.getenv('JWT_SECRET_KEY', 'dev-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES    = timedelta(hours=int(os.getenv('JWT_ACCESS_HOURS', 24)))
    JWT_REFRESH_TOKEN_EXPIRES   = timedelta(days=int(os.getenv('JWT_REFRESH_DAYS', 30)))

    # CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173').split(',')

    # File Uploads
    UPLOAD_FOLDER       = os.path.join(os.path.dirname(__file__), '..', 'uploads')
    MAX_CONTENT_LENGTH  = 10 * 1024 * 1024   # 10 MB
    ALLOWED_EXTENSIONS  = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'pdf'}

    # Rate Limiting
    RATELIMIT_DEFAULT           = os.getenv('RATELIMIT_DEFAULT', '200 per day;50 per hour')
    RATELIMIT_STORAGE_URL       = 'memory://'

    # Email (stub – set SMTP vars for production)
    MAIL_SERVER     = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT       = int(os.getenv('MAIL_PORT', 587))
    MAIL_USE_TLS    = os.getenv('MAIL_USE_TLS', 'true').lower() == 'true'
    MAIL_USERNAME   = os.getenv('MAIL_USERNAME', '')
    MAIL_PASSWORD   = os.getenv('MAIL_PASSWORD', '')
    MAIL_FROM       = os.getenv('MAIL_FROM', 'noreply@muskcapital.com')

    # Platform Wallet Addresses (demo)
    WALLET_BTC  = os.getenv('WALLET_BTC',  'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')
    WALLET_ETH  = os.getenv('WALLET_ETH',  '0x71C7656EC7ab88b098defB751B7401B5f6d8976F')
    WALLET_USDT = os.getenv('WALLET_USDT', 'TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7')
