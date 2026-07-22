from flask import Flask, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from .config import Config
import os

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
limiter = Limiter(key_func=get_remote_address, default_limits=["20000 per day", "5000 per hour"])

def create_app(config_class=Config):
    # React dist folder sits at repo root: ../dist relative to backend/
    static_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'dist'))
    app = Flask(__name__, static_folder=static_folder, static_url_path='')
    app.config.from_object(config_class)

    # Init extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app, origins=app.config['CORS_ORIGINS'], supports_credentials=True)
    limiter.init_app(app)

    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.companies import companies_bp
    from .routes.markets import markets_bp
    from .routes.news import news_bp
    from .routes.portfolio import portfolio_bp
    from .routes.admin import admin_bp
    from .routes.deposits import deposits_bp
    from .routes.withdrawals import withdrawals_bp
    from .routes.transactions import transactions_bp
    from .routes.notifications import notifications_bp
    from .routes.profile import profile_bp
    from .routes.settings import settings_bp
    from .routes.watchlist import watchlist_bp
    from .routes.search import search_bp
    from .routes.market_data import market_bp

    app.register_blueprint(auth_bp,          url_prefix='/api/auth')
    app.register_blueprint(companies_bp,     url_prefix='/api/companies')
    app.register_blueprint(markets_bp,       url_prefix='/api/markets')
    app.register_blueprint(news_bp,          url_prefix='/api/news')
    app.register_blueprint(portfolio_bp,     url_prefix='/api/portfolio')
    app.register_blueprint(admin_bp,         url_prefix='/api/admin')
    app.register_blueprint(deposits_bp,      url_prefix='/api/deposits')
    app.register_blueprint(withdrawals_bp,   url_prefix='/api/withdrawals')
    app.register_blueprint(transactions_bp,  url_prefix='/api/transactions')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    app.register_blueprint(profile_bp,       url_prefix='/api/profile')
    app.register_blueprint(settings_bp,      url_prefix='/api/settings')
    app.register_blueprint(watchlist_bp,     url_prefix='/api/watchlist')
    app.register_blueprint(search_bp,        url_prefix='/api/search')
    app.register_blueprint(market_bp,        url_prefix='/api/market')

    # ── Global Error Handlers ─────────────────────────────────────────────────
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify(error="Bad request", message=str(e.description)), 400

    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify(error="Unauthorized", message=str(e.description)), 401

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify(error="Forbidden", message=str(e.description)), 403

    @app.errorhandler(404)
    def not_found(e):
        # Serve React's index.html for all unknown routes (SPA routing)
        if os.path.exists(static_folder):
            return send_from_directory(static_folder, 'index.html')
        return jsonify(error="Not found", message=str(e.description)), 404

    @app.errorhandler(429)
    def ratelimit_handler(e):
        return jsonify(error="Rate limit exceeded", message=str(e.description)), 429

    @app.errorhandler(500)
    def internal_server_error(e):
        return jsonify(error="Internal server error", message=str(e.description)), 500

    # ── Health Check ──────────────────────────────────────────────────────────
    @app.route('/api/health')
    @limiter.exempt
    def health():
        return jsonify({'status': 'ok', 'message': 'Musk Capital API is running'}), 200

    # ── Serve React Frontend (SPA catch-all) ──────────────────────────────────
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        # Don't intercept /api/* routes
        if path.startswith('api/'):
            return jsonify(error="Not found"), 404
        # Serve actual static files (JS, CSS, images) if they exist
        full_path = os.path.join(static_folder, path)
        if path and os.path.exists(full_path):
            return send_from_directory(static_folder, path)
        # For everything else (React routes), serve index.html
        return send_from_directory(static_folder, 'index.html')

    return app
