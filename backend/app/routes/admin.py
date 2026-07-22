from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from app import db
from app.models import (
    User, Transaction, Portfolio, Deposit, GiftCard,
    Withdrawal, AuditLog, Notification, MarketAsset, NewsArticle
)
from app.middleware.auth import admin_required, log_audit, notify_user
from app.utils.pagination import paginate_query
from app.services.email_service import (
    email_deposit_approved, email_deposit_rejected,
    email_withdrawal_approved, email_withdrawal_rejected,
    email_account_suspended,
)
from datetime import datetime

admin_bp = Blueprint('admin', __name__)


# ── Stats ─────────────────────────────────────────────────────────────────────
@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_stats():
    admin = User.query.get(int(get_jwt_identity()))
    return jsonify({
        'total_users':        User.query.count(),
        'active_users':       User.query.filter_by(is_active=True).count(),
        'total_portfolios':   Portfolio.query.count(),
        'total_transactions': Transaction.query.count(),
        'total_deposits':     Deposit.query.count(),
        'pending_deposits':   Deposit.query.filter_by(status='pending').count(),
        'total_withdrawals':  Withdrawal.query.count(),
        'pending_withdrawals':Withdrawal.query.filter_by(status='pending').count(),
        'total_gift_cards':   GiftCard.query.count(),
        'pending_gift_cards': GiftCard.query.filter_by(status='pending').count(),
        'total_news':         NewsArticle.query.count(),
        'platform_revenue':   342118.48,  # Demo value
    }), 200


# ── Users ─────────────────────────────────────────────────────────────────────
@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    q      = request.args.get('q', '').lower()
    status = request.args.get('status')

    query = User.query
    if q:
        query = query.filter(
            User.name.ilike(f'%{q}%') |
            User.email.ilike(f'%{q}%') |
            User.username.ilike(f'%{q}%')
        )
    if status == 'active':
        query = query.filter_by(is_active=True)
    elif status == 'suspended':
        query = query.filter_by(is_active=False)

    items, meta = paginate_query(query.order_by(User.created_at.desc()), default_per_page=20)
    return jsonify({'users': [u.to_dict() for u in items], **meta}), 200


@admin_bp.route('/users/<int:uid>', methods=['PUT'])
@admin_required
def update_user(uid):
    admin = User.query.get(int(get_jwt_identity()))
    user  = User.query.get_or_404(uid)
    data  = request.get_json()

    for field in ['name', 'email', 'plan', 'role', 'is_active', 'kyc_status', 'balance']:
        if field in data:
            setattr(user, field, data[field])
    db.session.commit()

    log_audit(admin, f'Updated user #{uid} ({user.email})', log_type='system')
    return jsonify(user.to_dict()), 200


@admin_bp.route('/users/<int:uid>/suspend', methods=['POST'])
@admin_required
def suspend_user(uid):
    admin  = User.query.get(int(get_jwt_identity()))
    user   = User.query.get_or_404(uid)
    action = request.get_json().get('action', 'suspend')  # suspend | activate
    user.is_active = (action != 'suspend')
    db.session.commit()
    log_audit(admin, f'{"Suspended" if not user.is_active else "Activated"} user #{uid}', log_type='security')

    # Send suspension email
    if not user.is_active:
        try:
            email_account_suspended(user)
        except Exception:
            pass

    return jsonify({'message': 'User status updated', 'is_active': user.is_active}), 200


# ── Deposits ──────────────────────────────────────────────────────────────────
@admin_bp.route('/deposits', methods=['GET'])
@admin_required
def get_all_deposits():
    status = request.args.get('status')
    query  = Deposit.query
    if status and status != 'all':
        query = query.filter_by(status=status)
    items, meta = paginate_query(query.order_by(Deposit.created_at.desc()), default_per_page=25)

    results = []
    for d in items:
        d_dict = d.to_dict()
        u = User.query.get(d.user_id)
        if u:
            d_dict['user'] = u.name
            d_dict['email'] = u.email
        results.append(d_dict)
    return jsonify({'deposits': results, **meta}), 200


@admin_bp.route('/deposits/<int:did>/approve', methods=['POST'])
@admin_required
def approve_deposit(did):
    admin   = User.query.get(int(get_jwt_identity()))
    deposit = Deposit.query.get_or_404(did)

    if deposit.status != 'pending':
        return jsonify({'message': 'Deposit is not pending'}), 400

    deposit.status      = 'approved'
    deposit.reviewed_at = datetime.utcnow()

    # Credit user balance
    user = User.query.get(deposit.user_id)
    if user:
        user.balance = (user.balance or 0) + deposit.amount

    # Update transaction status
    tx = Transaction.query.filter_by(ref_id=did, tx_type='deposit').first()
    if tx:
        tx.status = 'approved'

    db.session.commit()

    notify_user(deposit.user_id, '✅ Deposit Approved',
                f'Your {deposit.currency} deposit of ${deposit.amount:,.2f} has been approved and credited to your account.',
                notif_type='deposit')
    log_audit(admin, f'Approved deposit #{did} for ${deposit.amount:,.2f}', log_type='approval')

    # Send approval email
    if user:
        try:
            email_deposit_approved(user, deposit)
        except Exception:
            pass

    return jsonify({'message': 'Deposit approved', 'deposit': deposit.to_dict()}), 200


@admin_bp.route('/deposits/<int:did>/reject', methods=['POST'])
@admin_required
def reject_deposit(did):
    admin   = User.query.get(int(get_jwt_identity()))
    deposit = Deposit.query.get_or_404(did)

    if deposit.status != 'pending':
        return jsonify({'message': 'Deposit is not pending'}), 400

    data = request.get_json() or {}
    deposit.status      = 'rejected'
    deposit.admin_note  = data.get('reason', '')
    deposit.reviewed_at = datetime.utcnow()

    tx = Transaction.query.filter_by(ref_id=did, tx_type='deposit').first()
    if tx:
        tx.status = 'rejected'

    db.session.commit()

    reason = deposit.admin_note or ''
    notify_user(deposit.user_id, '❌ Deposit Rejected',
                f'Your {deposit.currency} deposit of ${deposit.amount:,.2f} was rejected. {reason}',
                notif_type='deposit')
    log_audit(admin, f'Rejected deposit #{did}', log_type='approval')

    # Send rejection email
    rej_user = User.query.get(deposit.user_id)
    if rej_user:
        try:
            email_deposit_rejected(rej_user, deposit, reason)
        except Exception:
            pass

    return jsonify({'message': 'Deposit rejected', 'deposit': deposit.to_dict()}), 200


# ── Gift Cards ────────────────────────────────────────────────────────────────
@admin_bp.route('/gift-cards', methods=['GET'])
@admin_required
def get_all_gift_cards():
    status = request.args.get('status')
    query  = GiftCard.query
    if status and status != 'all':
        query = query.filter_by(status=status)
    items, meta = paginate_query(query.order_by(GiftCard.created_at.desc()), default_per_page=25)

    results = []
    for gc in items:
        d = gc.to_dict()
        u = User.query.get(gc.user_id)
        if u:
            d['user'] = u.name
            d['email'] = u.email
        results.append(d)
    return jsonify({'gift_cards': results, **meta}), 200


@admin_bp.route('/gift-cards/<int:gcid>/approve', methods=['POST'])
@admin_required
def approve_gift_card(gcid):
    admin = User.query.get(int(get_jwt_identity()))
    gc    = GiftCard.query.get_or_404(gcid)

    if gc.status != 'pending':
        return jsonify({'message': 'Gift card is not pending'}), 400

    gc.status      = 'approved'
    gc.reviewed_at = datetime.utcnow()

    user = User.query.get(gc.user_id)
    if user:
        user.balance = (user.balance or 0) + gc.value

    tx = Transaction.query.filter_by(ref_id=gcid, tx_type='gift_card').first()
    if tx:
        tx.status = 'approved'

    db.session.commit()

    notify_user(gc.user_id, '✅ Gift Card Approved',
                f'Your {gc.card_type} gift card worth ${gc.value:,.2f} has been approved.',
                notif_type='deposit')
    log_audit(admin, f'Approved gift card #{gcid}', log_type='approval')

    # Send approval email (reuse deposit_approved style)
    gc_user = User.query.get(gc.user_id)
    if gc_user:
        try:
            from app.services.email_service import email_gift_card_received
            # We re-use deposit_approved email here for simplicity
            from app.services.email_service import send_email, deposit_approved_template
            html = deposit_approved_template(gc_user.name or gc_user.username, gc.value, gc.card_type, gc_user.balance or 0)
            send_email(gc_user.email, gc_user.name or gc_user.username,
                       f'✅ Your {gc.card_type} gift card of ${gc.value:,.2f} has been approved!', html)
        except Exception:
            pass

    return jsonify({'message': 'Gift card approved', 'gift_card': gc.to_dict()}), 200


@admin_bp.route('/gift-cards/<int:gcid>/reject', methods=['POST'])
@admin_required
def reject_gift_card(gcid):
    admin = User.query.get(int(get_jwt_identity()))
    gc    = GiftCard.query.get_or_404(gcid)

    data = request.get_json() or {}
    gc.status      = 'rejected'
    gc.admin_note  = data.get('reason', '')
    gc.reviewed_at = datetime.utcnow()

    tx = Transaction.query.filter_by(ref_id=gcid, tx_type='gift_card').first()
    if tx:
        tx.status = 'rejected'

    db.session.commit()

    gc_reason = gc.admin_note or ''
    notify_user(gc.user_id, '❌ Gift Card Rejected',
                f'Your {gc.card_type} gift card was rejected. {gc_reason}',
                notif_type='deposit')
    log_audit(admin, f'Rejected gift card #{gcid}', log_type='approval')

    # Send rejection email
    gc_rej_user = User.query.get(gc.user_id)
    if gc_rej_user:
        try:
            from app.services.email_service import send_email, deposit_rejected_template
            html = deposit_rejected_template(gc_rej_user.name or gc_rej_user.username, gc.value, gc.card_type, gc_reason)
            send_email(gc_rej_user.email, gc_rej_user.name or gc_rej_user.username,
                       f'❌ Your {gc.card_type} gift card was not approved', html)
        except Exception:
            pass

    return jsonify({'message': 'Gift card rejected'}), 200


# ── Withdrawals ───────────────────────────────────────────────────────────────
@admin_bp.route('/withdrawals', methods=['GET'])
@admin_required
def get_all_withdrawals():
    status = request.args.get('status')
    query  = Withdrawal.query
    if status and status != 'all':
        query = query.filter_by(status=status)
    items, meta = paginate_query(query.order_by(Withdrawal.created_at.desc()), default_per_page=25)

    results = []
    for w in items:
        d = w.to_dict()
        u = User.query.get(w.user_id)
        if u:
            d['user'] = u.name
            d['email'] = u.email
        results.append(d)
    return jsonify({'withdrawals': results, **meta}), 200


@admin_bp.route('/withdrawals/<int:wid>/approve', methods=['POST'])
@admin_required
def approve_withdrawal(wid):
    admin      = User.query.get(int(get_jwt_identity()))
    withdrawal = Withdrawal.query.get_or_404(wid)

    if withdrawal.status != 'pending':
        return jsonify({'message': 'Withdrawal is not pending'}), 400

    withdrawal.status      = 'approved'
    withdrawal.reviewed_at = datetime.utcnow()

    tx = Transaction.query.filter_by(ref_id=wid, tx_type='withdrawal').first()
    if tx:
        tx.status = 'approved'

    db.session.commit()

    w_user = User.query.get(withdrawal.user_id)
    notify_user(withdrawal.user_id, '✅ Withdrawal Approved',
                f'Your withdrawal of ${withdrawal.amount:,.2f} {withdrawal.currency} has been processed.',
                notif_type='withdrawal')
    log_audit(admin, f'Approved withdrawal #{wid} for ${withdrawal.amount:,.2f}', log_type='approval')

    # Send approval email
    if w_user:
        try:
            email_withdrawal_approved(w_user, withdrawal)
        except Exception:
            pass

    return jsonify({'message': 'Withdrawal approved', 'withdrawal': withdrawal.to_dict()}), 200


@admin_bp.route('/withdrawals/<int:wid>/reject', methods=['POST'])
@admin_required
def reject_withdrawal(wid):
    admin      = User.query.get(int(get_jwt_identity()))
    withdrawal = Withdrawal.query.get_or_404(wid)

    data = request.get_json() or {}
    withdrawal.status      = 'rejected'
    withdrawal.admin_note  = data.get('reason', '')
    withdrawal.reviewed_at = datetime.utcnow()

    # Refund balance
    user = User.query.get(withdrawal.user_id)
    if user:
        user.balance = (user.balance or 0) + withdrawal.amount

    tx = Transaction.query.filter_by(ref_id=wid, tx_type='withdrawal').first()
    if tx:
        tx.status = 'rejected'

    db.session.commit()

    w_reason = withdrawal.admin_note or ''
    notify_user(withdrawal.user_id, '❌ Withdrawal Rejected',
                f'Your withdrawal of ${withdrawal.amount:,.2f} has been rejected and refunded. {w_reason}',
                notif_type='withdrawal')
    log_audit(admin, f'Rejected withdrawal #{wid}', log_type='approval')

    # Send rejection email
    if user:
        try:
            email_withdrawal_rejected(user, withdrawal, w_reason)
        except Exception:
            pass

    return jsonify({'message': 'Withdrawal rejected and balance refunded'}), 200


# ── Transactions ──────────────────────────────────────────────────────────────
@admin_bp.route('/transactions', methods=['GET'])
@admin_required
def get_all_transactions():
    tx_type = request.args.get('type')
    status  = request.args.get('status')
    q       = request.args.get('q', '')

    query = Transaction.query
    if tx_type:
        query = query.filter_by(tx_type=tx_type)
    if status:
        query = query.filter_by(status=status)
    if q:
        users = User.query.filter(
            User.name.ilike(f'%{q}%') | User.email.ilike(f'%{q}%')
        ).with_entities(User.id).all()
        user_ids = [u.id for u in users]
        query = query.filter(Transaction.user_id.in_(user_ids))

    items, meta = paginate_query(query.order_by(Transaction.created_at.desc()), default_per_page=25)

    results = []
    for t in items:
        d = t.to_dict()
        u = User.query.get(t.user_id)
        if u:
            d['user'] = u.name
            d['email'] = u.email
        results.append(d)
    return jsonify({'transactions': results, **meta}), 200


# ── Broadcast Notifications ───────────────────────────────────────────────────
@admin_bp.route('/notifications/broadcast', methods=['POST'])
@admin_required
def broadcast_notification():
    admin = User.query.get(int(get_jwt_identity()))
    data  = request.get_json()

    title   = data.get('title', '').strip()
    message = data.get('message', '').strip()
    target  = data.get('target', 'all')   # all | premium | specific

    if not title or not message:
        return jsonify({'message': 'title and message are required'}), 400

    query = User.query.filter_by(is_active=True)
    if target == 'premium':
        query = query.filter(User.plan != 'Free')

    users = query.all()
    notifs = []
    for u in users:
        notifs.append(Notification(
            user_id=u.id, title=title,
            message=message, notif_type='system',
        ))

    db.session.bulk_save_objects(notifs)
    db.session.commit()

    log_audit(admin, f'Broadcast notification to {len(users)} users: "{title}"', log_type='system')
    return jsonify({'message': f'Notification sent to {len(users)} users'}), 200


# ── Audit Logs ────────────────────────────────────────────────────────────────
@admin_bp.route('/audit-logs', methods=['GET'])
@admin_required
def get_audit_logs():
    q      = request.args.get('q', '')
    ltype  = request.args.get('type')
    query  = AuditLog.query
    if q:
        query = query.filter(
            AuditLog.action.ilike(f'%{q}%') | AuditLog.admin_name.ilike(f'%{q}%')
        )
    if ltype and ltype != 'All':
        query = query.filter_by(log_type=ltype.lower())
    items, meta = paginate_query(query.order_by(AuditLog.created_at.desc()), default_per_page=25)
    return jsonify({'logs': [l.to_dict() for l in items], **meta}), 200


# ── Analytics ─────────────────────────────────────────────────────────────────
@admin_bp.route('/analytics', methods=['GET'])
@admin_required
def get_analytics():
    """Summary analytics for admin dashboard charts."""
    from sqlalchemy import func
    from app.models import Deposit, Withdrawal

    user_count_by_month = db.session.query(
        func.strftime('%Y-%m', User.created_at).label('month'),
        func.count(User.id).label('count')
    ).group_by('month').order_by('month').all()

    deposit_by_month = db.session.query(
        func.strftime('%Y-%m', Deposit.created_at).label('month'),
        func.sum(Deposit.amount).label('total')
    ).filter_by(status='approved').group_by('month').order_by('month').all()

    return jsonify({
        'user_growth':  [{'month': r.month, 'users': r.count} for r in user_count_by_month],
        'deposit_flow': [{'month': r.month, 'amount': float(r.total or 0)} for r in deposit_by_month],
    }), 200


# ── Companies CRUD ────────────────────────────────────────────────────────────
@admin_bp.route('/companies', methods=['POST'])
@admin_required
def create_company():
    from app.models import Company
    admin = User.query.get(int(get_jwt_identity()))
    data  = request.get_json()
    c     = Company(**{k: v for k, v in data.items() if hasattr(Company, k)})
    db.session.add(c)
    db.session.commit()
    log_audit(admin, f'Created company {c.name}', log_type='system')
    return jsonify(c.to_dict()), 201


@admin_bp.route('/companies/<int:cid>', methods=['PUT'])
@admin_required
def update_company(cid):
    from app.models import Company
    admin = User.query.get(int(get_jwt_identity()))
    c     = Company.query.get_or_404(cid)
    data  = request.get_json()
    for k, v in data.items():
        if hasattr(c, k):
            setattr(c, k, v)
    db.session.commit()
    log_audit(admin, f'Updated company {c.name}', log_type='system')
    return jsonify(c.to_dict()), 200


# ── News CRUD ─────────────────────────────────────────────────────────────────
@admin_bp.route('/news', methods=['POST'])
@admin_required
def create_news():
    admin = User.query.get(int(get_jwt_identity()))
    data  = request.get_json()
    n     = NewsArticle(
        title=data.get('title'), summary=data.get('summary'),
        content=data.get('content', ''), category=data.get('category'),
        author=data.get('author', admin.name),
        image_url=data.get('image_url'), read_time=data.get('read_time'),
        is_featured=data.get('is_featured', False),
        status=data.get('status', 'published'),
    )
    db.session.add(n)
    db.session.commit()
    return jsonify(n.to_dict()), 201


@admin_bp.route('/news/<int:nid>', methods=['PUT'])
@admin_required
def update_news(nid):
    n    = NewsArticle.query.get_or_404(nid)
    data = request.get_json()
    for k in ['title', 'summary', 'content', 'category', 'image_url', 'is_featured', 'status']:
        if k in data:
            setattr(n, k, data[k])
    db.session.commit()
    return jsonify(n.to_dict()), 200


@admin_bp.route('/news/<int:nid>', methods=['DELETE'])
@admin_required
def delete_news(nid):
    n = NewsArticle.query.get_or_404(nid)
    db.session.delete(n)
    db.session.commit()
    return jsonify({'message': 'Article deleted'}), 200


@admin_bp.route('/settings', methods=['GET'])
@admin_required
def get_settings():
    """Get platform settings including wallet addresses."""
    cfg = current_app.config
    return jsonify({
        'walletAddresses': {
            'BTC': cfg.get('WALLET_BTC', ''),
            'ETH': cfg.get('WALLET_ETH', ''),
            'USDT': cfg.get('WALLET_USDT', ''),
        },
        'minDeposit': 100,
        'minWithdrawal': 500,
        'confirmations': 3,
    }), 200


@admin_bp.route('/settings', methods=['PUT'])
@admin_required
def update_settings():
    """Update platform settings (wallet addresses stored in .env)."""
    admin = User.query.get(int(get_jwt_identity()))
    data = request.get_json()
    
    # In production, this should update environment variables or database config
    # For now, we'll update the config object (resets on restart)
    wallet_addresses = data.get('walletAddresses', {})
    
    if 'BTC' in wallet_addresses:
        current_app.config['WALLET_BTC'] = wallet_addresses['BTC']
    if 'ETH' in wallet_addresses:
        current_app.config['WALLET_ETH'] = wallet_addresses['ETH']
    if 'USDT' in wallet_addresses:
        current_app.config['WALLET_USDT'] = wallet_addresses['USDT']
    
    log_audit(admin, f'Updated platform wallet addresses', log_type='system')
    
    return jsonify({
        'message': 'Settings updated successfully',
        'walletAddresses': {
            'BTC': current_app.config['WALLET_BTC'],
            'ETH': current_app.config['WALLET_ETH'],
            'USDT': current_app.config['WALLET_USDT'],
        }
    }), 200


# ── Market Assets CRUD ────────────────────────────────────────────────────────
@admin_bp.route('/markets', methods=['POST'])
@admin_required
def create_market_asset():
    data = request.get_json()
    a    = MarketAsset(
        symbol=data.get('symbol', '').upper(),
        name=data.get('name'), asset_type=data.get('asset_type', 'stock'),
        price=float(data.get('price', 0)),
        change_pct=float(data.get('change_pct', 0)),
        market_cap=data.get('market_cap'), volume=data.get('volume'),
    )
    db.session.add(a)
    db.session.commit()
    return jsonify(a.to_dict()), 201


@admin_bp.route('/markets/<int:mid>', methods=['PUT'])
@admin_required
def update_market_asset(mid):
    a    = MarketAsset.query.get_or_404(mid)
    data = request.get_json()
    for k in ['price', 'change_pct', 'market_cap', 'volume', 'name']:
        if k in data:
            setattr(a, k, data[k])
    db.session.commit()
    return jsonify(a.to_dict()), 200


@admin_bp.route('/markets/<int:mid>', methods=['DELETE'])
@admin_required
def delete_market_asset(mid):
    a = MarketAsset.query.get_or_404(mid)
    db.session.delete(a)
    db.session.commit()
    return jsonify({'message': 'Asset removed'}), 200
