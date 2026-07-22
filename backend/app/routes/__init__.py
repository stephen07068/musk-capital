from .auth import auth_bp
from .companies import companies_bp
from .markets import markets_bp
from .news import news_bp
from .portfolio import portfolio_bp
from .admin import admin_bp

__all__ = ['auth_bp', 'companies_bp', 'markets_bp', 'news_bp', 'portfolio_bp', 'admin_bp']
