from app import db
from datetime import datetime
import bcrypt


# ─────────────────────────────────────────────
# USER
# ─────────────────────────────────────────────
class User(db.Model):
    __tablename__ = 'users'

    id            = db.Column(db.Integer, primary_key=True)
    name          = db.Column(db.String(120), nullable=False)
    email         = db.Column(db.String(200), unique=True, nullable=False, index=True)
    username      = db.Column(db.String(80),  unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role          = db.Column(db.String(20),  default='user')     # user | admin
    plan          = db.Column(db.String(30),  default='Free')     # Free | Premium | Pro | Enterprise
    is_active     = db.Column(db.Boolean,     default=True)
    kyc_status    = db.Column(db.String(20),  default='Pending')  # Pending | Verified | Rejected
    country       = db.Column(db.String(80),  nullable=True)
    phone         = db.Column(db.String(30),  nullable=True)
    bio           = db.Column(db.Text,        nullable=True)
    avatar_url    = db.Column(db.String(500), nullable=True)
    balance       = db.Column(db.Float,       default=0.0)
    created_at    = db.Column(db.DateTime,    default=datetime.utcnow)
    updated_at    = db.Column(db.DateTime,    default=datetime.utcnow, onupdate=datetime.utcnow)

    portfolios    = db.relationship('Portfolio',    backref='user', lazy=True, cascade='all, delete-orphan')
    transactions  = db.relationship('Transaction',  backref='user', lazy=True, cascade='all, delete-orphan')
    deposits      = db.relationship('Deposit',      backref='user', lazy=True, cascade='all, delete-orphan')
    gift_cards    = db.relationship('GiftCard',     backref='user', lazy=True, cascade='all, delete-orphan')
    withdrawals   = db.relationship('Withdrawal',   backref='user', lazy=True, cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='user', lazy=True, cascade='all, delete-orphan')
    watchlist     = db.relationship('WatchlistItem',backref='user', lazy=True, cascade='all, delete-orphan')
    settings      = db.relationship('UserSettings', backref='user', lazy=True, uselist=False, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'email': self.email,
            'username': self.username, 'role': self.role, 'plan': self.plan,
            'is_active': self.is_active, 'kyc_status': self.kyc_status,
            'country': self.country, 'phone': self.phone, 'bio': self.bio,
            'avatar_url': self.avatar_url, 'balance': self.balance,
            'created_at': self.created_at.isoformat(),
            'joined': self.created_at.strftime('%b %d, %Y'),
        }


# ─────────────────────────────────────────────
# USER SETTINGS
# ─────────────────────────────────────────────
class UserSettings(db.Model):
    __tablename__ = 'user_settings'

    id                      = db.Column(db.Integer, primary_key=True)
    user_id                 = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    email_deposits          = db.Column(db.Boolean, default=True)
    email_withdrawals       = db.Column(db.Boolean, default=True)
    email_news              = db.Column(db.Boolean, default=False)
    two_factor_enabled      = db.Column(db.Boolean, default=False)
    dark_mode               = db.Column(db.Boolean, default=True)
    currency                = db.Column(db.String(10), default='USD')

    def to_dict(self):
        return {
            'email_deposits': self.email_deposits,
            'email_withdrawals': self.email_withdrawals,
            'email_news': self.email_news,
            'two_factor_enabled': self.two_factor_enabled,
            'dark_mode': self.dark_mode,
            'currency': self.currency,
        }


# ─────────────────────────────────────────────
# COMPANY
# ─────────────────────────────────────────────
class Company(db.Model):
    __tablename__ = 'companies'

    id           = db.Column(db.Integer, primary_key=True)
    slug         = db.Column(db.String(80), unique=True, nullable=False, index=True)
    name         = db.Column(db.String(120), nullable=False)
    industry     = db.Column(db.String(150))
    status       = db.Column(db.String(20), default='PRIVATE')  # PUBLIC | PRIVATE
    ticker       = db.Column(db.String(10), nullable=True)
    description  = db.Column(db.Text)
    long_desc    = db.Column(db.Text)
    ceo          = db.Column(db.String(100))
    founded      = db.Column(db.Integer)
    headquarters = db.Column(db.String(200))
    website      = db.Column(db.String(300))
    employees    = db.Column(db.String(50))
    revenue      = db.Column(db.String(50))
    logo_url     = db.Column(db.String(500))
    banner_url   = db.Column(db.String(500))
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id, 'slug': self.slug, 'name': self.name,
            'industry': self.industry, 'status': self.status, 'ticker': self.ticker,
            'description': self.description, 'long_desc': self.long_desc,
            'ceo': self.ceo, 'founded': self.founded, 'headquarters': self.headquarters,
            'website': self.website, 'employees': self.employees, 'revenue': self.revenue,
            'logo_url': self.logo_url, 'banner_url': self.banner_url,
        }


# ─────────────────────────────────────────────
# MARKET ASSET (stocks, crypto, indices unified)
# ─────────────────────────────────────────────
class MarketAsset(db.Model):
    __tablename__ = 'market_assets'

    id           = db.Column(db.Integer, primary_key=True)
    symbol       = db.Column(db.String(20), unique=True, nullable=False, index=True)
    name         = db.Column(db.String(120), nullable=False)
    asset_type   = db.Column(db.String(20), default='stock')  # stock | crypto | index
    price        = db.Column(db.Float, default=0.0)
    change_pct   = db.Column(db.Float, default=0.0)
    market_cap   = db.Column(db.String(50))
    volume       = db.Column(db.String(50))
    color        = db.Column(db.String(10), default='#D4AF37')
    company_id   = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=True)
    updated_at   = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id, 'symbol': self.symbol, 'name': self.name,
            'asset_type': self.asset_type, 'price': self.price,
            'change_pct': self.change_pct, 'change': self.change_pct,
            'market_cap': self.market_cap, 'volume': self.volume, 'color': self.color,
        }

# Keep Stock alias for backward compat
Stock = MarketAsset


# ─────────────────────────────────────────────
# NEWS ARTICLE
# ─────────────────────────────────────────────
class NewsArticle(db.Model):
    __tablename__ = 'news_articles'

    id          = db.Column(db.Integer, primary_key=True)
    title       = db.Column(db.String(500), nullable=False)
    summary     = db.Column(db.Text)
    content     = db.Column(db.Text)
    category    = db.Column(db.String(80))
    author      = db.Column(db.String(120), default='Musk Capital Editorial')
    image_url   = db.Column(db.String(500))
    read_time   = db.Column(db.String(20))
    status      = db.Column(db.String(20), default='published')  # published | draft
    is_featured = db.Column(db.Boolean, default=False)
    views       = db.Column(db.Integer, default=0)
    published   = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id, 'title': self.title, 'summary': self.summary,
            'category': self.category, 'author': self.author,
            'image_url': self.image_url, 'read_time': self.read_time,
            'is_featured': self.is_featured, 'views': self.views,
            'status': self.status,
            'published': self.published.strftime('%b %d, %Y'),
            'date': self.published.strftime('%b %d, %Y'),
        }


# ─────────────────────────────────────────────
# PORTFOLIO & HOLDINGS
# ─────────────────────────────────────────────
class Portfolio(db.Model):
    __tablename__ = 'portfolios'

    id           = db.Column(db.Integer, primary_key=True)
    user_id      = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name         = db.Column(db.String(120), default='My Portfolio')
    total_value  = db.Column(db.Float, default=0.0)
    cash_balance = db.Column(db.Float, default=10000.0)
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)

    holdings     = db.relationship('Holding', backref='portfolio', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id, 'user_id': self.user_id, 'name': self.name,
            'total_value': self.total_value, 'cash_balance': self.cash_balance,
            'created_at': self.created_at.isoformat(),
            'holdings': [h.to_dict() for h in self.holdings],
        }


class Holding(db.Model):
    __tablename__ = 'holdings'

    id            = db.Column(db.Integer, primary_key=True)
    portfolio_id  = db.Column(db.Integer, db.ForeignKey('portfolios.id'), nullable=False)
    symbol        = db.Column(db.String(20), nullable=False)
    asset_name    = db.Column(db.String(120))
    asset_type    = db.Column(db.String(20), default='stock')
    shares        = db.Column(db.Float, default=0.0)
    avg_cost      = db.Column(db.Float, default=0.0)
    current_price = db.Column(db.Float, default=0.0)
    color         = db.Column(db.String(10), default='#D4AF37')

    def to_dict(self):
        value = self.shares * self.current_price
        gain  = value - (self.shares * self.avg_cost)
        return {
            'id': self.id, 'symbol': self.symbol, 'asset_name': self.asset_name,
            'asset_type': self.asset_type, 'shares': self.shares,
            'avg_cost': self.avg_cost, 'current_price': self.current_price,
            'value': value, 'gain': gain,
            'gain_pct': ((gain / (self.shares * self.avg_cost)) * 100) if self.avg_cost else 0,
            'color': self.color,
        }


# ─────────────────────────────────────────────
# WATCHLIST
# ─────────────────────────────────────────────
class WatchlistItem(db.Model):
    __tablename__ = 'watchlist_items'

    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    symbol     = db.Column(db.String(20), nullable=False)
    added_at   = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (db.UniqueConstraint('user_id', 'symbol', name='uq_user_symbol'),)

    def to_dict(self):
        return {'symbol': self.symbol, 'added_at': self.added_at.isoformat()}


# ─────────────────────────────────────────────
# DEPOSIT (Crypto)
# ─────────────────────────────────────────────
class Deposit(db.Model):
    __tablename__ = 'deposits'

    id             = db.Column(db.Integer, primary_key=True)
    user_id        = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    currency       = db.Column(db.String(10), nullable=False)  # BTC | ETH | USDT
    network        = db.Column(db.String(30))
    amount         = db.Column(db.Float, nullable=False)
    wallet_address = db.Column(db.String(200))
    tx_hash        = db.Column(db.String(200))
    status         = db.Column(db.String(20), default='pending')  # pending | approved | rejected
    admin_note     = db.Column(db.Text)
    created_at     = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_at    = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            'id': self.id, 'user_id': self.user_id,
            'currency': self.currency, 'network': self.network,
            'amount': self.amount, 'wallet_address': self.wallet_address,
            'tx_hash': self.tx_hash, 'status': self.status,
            'admin_note': self.admin_note,
            'date': self.created_at.strftime('%b %d, %Y'),
            'created_at': self.created_at.isoformat(),
        }


# ─────────────────────────────────────────────
# GIFT CARD DEPOSIT
# ─────────────────────────────────────────────
class GiftCard(db.Model):
    __tablename__ = 'gift_cards'

    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    card_type   = db.Column(db.String(60), nullable=False)   # Amazon | Apple | Google Play etc.
    value       = db.Column(db.Float, nullable=False)
    country     = db.Column(db.String(80))
    card_code   = db.Column(db.String(200))
    notes       = db.Column(db.Text)
    image_path  = db.Column(db.String(500))                  # uploaded image path
    status      = db.Column(db.String(20), default='pending')
    admin_note  = db.Column(db.Text)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            'id': self.id, 'user_id': self.user_id,
            'card_type': self.card_type, 'value': self.value,
            'country': self.country, 'notes': self.notes,
            'image_path': self.image_path, 'status': self.status,
            'admin_note': self.admin_note,
            'date': self.created_at.strftime('%b %d, %Y'),
            'created_at': self.created_at.isoformat(),
        }


# ─────────────────────────────────────────────
# WITHDRAWAL
# ─────────────────────────────────────────────
class Withdrawal(db.Model):
    __tablename__ = 'withdrawals'

    id             = db.Column(db.Integer, primary_key=True)
    user_id        = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    currency       = db.Column(db.String(10), nullable=False)
    amount         = db.Column(db.Float, nullable=False)
    wallet_address = db.Column(db.String(200), nullable=False)
    network        = db.Column(db.String(30))
    status         = db.Column(db.String(20), default='pending')
    admin_note     = db.Column(db.Text)
    created_at     = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_at    = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            'id': self.id, 'user_id': self.user_id,
            'currency': self.currency, 'amount': self.amount,
            'wallet_address': self.wallet_address, 'network': self.network,
            'status': self.status, 'admin_note': self.admin_note,
            'date': self.created_at.strftime('%b %d, %Y'),
            'created_at': self.created_at.isoformat(),
        }


# ─────────────────────────────────────────────
# TRANSACTION (unified ledger)
# ─────────────────────────────────────────────
class Transaction(db.Model):
    __tablename__ = 'transactions'

    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    tx_type     = db.Column(db.String(20))   # deposit | withdrawal | gift_card
    method      = db.Column(db.String(40))   # BTC | ETH | Amazon | etc.
    amount      = db.Column(db.Float, default=0.0)
    status      = db.Column(db.String(20), default='pending')
    ref_id      = db.Column(db.Integer, nullable=True)   # FK to deposit/withdrawal id
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id, 'user_id': self.user_id,
            'type': self.tx_type, 'tx_type': self.tx_type,
            'method': self.method, 'amount': self.amount,
            'status': self.status,
            'date': self.created_at.strftime('%b %d, %Y'),
            'created_at': self.created_at.isoformat(),
        }


# ─────────────────────────────────────────────
# NOTIFICATION
# ─────────────────────────────────────────────
class Notification(db.Model):
    __tablename__ = 'notifications'

    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title       = db.Column(db.String(255), nullable=False)
    message     = db.Column(db.Text, nullable=False)
    notif_type  = db.Column(db.String(40), default='system')  # system | deposit | withdrawal | promo
    is_read     = db.Column(db.Boolean, default=False)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id, 'title': self.title, 'message': self.message,
            'type': self.notif_type, 'is_read': self.is_read,
            'date': self.created_at.strftime('%b %d, %Y at %I:%M %p'),
            'created_at': self.created_at.isoformat(),
        }


# ─────────────────────────────────────────────
# AUDIT LOG
# ─────────────────────────────────────────────
class AuditLog(db.Model):
    __tablename__ = 'audit_logs'

    id          = db.Column(db.Integer, primary_key=True)
    admin_id    = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    admin_name  = db.Column(db.String(120))
    action      = db.Column(db.String(255), nullable=False)
    details     = db.Column(db.Text)
    log_type    = db.Column(db.String(30), default='system')  # system | security | approval
    ip_address  = db.Column(db.String(60))
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id, 'admin': self.admin_name or 'System',
            'action': self.action, 'details': self.details,
            'type': self.log_type,
            'ip': self.ip_address or '—',
            'date': self.created_at.strftime('%b %d, %Y %H:%M'),
            'created_at': self.created_at.isoformat(),
        }


# ─────────────────────────────────────────────
# PLAN (subscription tiers)
# ─────────────────────────────────────────────
class Plan(db.Model):
    __tablename__ = 'plans'

    id        = db.Column(db.Integer, primary_key=True)
    name      = db.Column(db.String(60), unique=True, nullable=False)
    price     = db.Column(db.Float, default=0.0)
    billing   = db.Column(db.String(20), default='monthly')
    features  = db.Column(db.JSON, default=list)
    is_active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'price': self.price,
            'billing': self.billing, 'features': self.features,
        }
