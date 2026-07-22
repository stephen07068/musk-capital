from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Withdrawal, Transaction, User
from app.middleware.auth import notify_user
from app.services.email_service import email_withdrawal_received

withdrawals_bp = Blueprint('withdrawals', __name__)


@withdrawals_bp.route('', methods=['GET'])
@jwt_required()
def get_withdrawals():
    user_id = int(get_jwt_identity())
    withdrawals = Withdrawal.query.filter_by(user_id=user_id).order_by(Withdrawal.created_at.desc()).all()
    return jsonify([w.to_dict() for w in withdrawals]), 200


@withdrawals_bp.route('', methods=['POST'])
@jwt_required()
def request_withdrawal():
    user_id = int(get_jwt_identity())
    data    = request.get_json()
    user    = User.query.get_or_404(user_id)

    currency = data.get('currency', '').upper()
    if currency not in ('BTC', 'ETH', 'USDT'):
        return jsonify({'message': 'Currency must be BTC, ETH, or USDT'}), 400

    try:
        amount = float(data.get('amount', 0))
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid amount'}), 400

    if amount <= 0:
        return jsonify({'message': 'Amount must be greater than 0'}), 400

    wallet_address = data.get('wallet_address', '').strip()
    if not wallet_address:
        return jsonify({'message': 'Wallet address is required'}), 400

    # Check sufficient balance
    if user.balance < amount:
        return jsonify({'message': f'Insufficient balance. Available: ${user.balance:,.2f}'}), 400

    withdrawal = Withdrawal(
        user_id=user_id,
        currency=currency,
        amount=amount,
        wallet_address=wallet_address,
        network=data.get('network', currency),
        status='pending',
    )
    db.session.add(withdrawal)

    # Deduct from balance and hold pending
    user.balance -= amount

    tx = Transaction(
        user_id=user_id, tx_type='withdrawal',
        method=currency, amount=amount, status='pending',
    )
    db.session.add(tx)
    db.session.commit()

    tx.ref_id = withdrawal.id
    db.session.commit()

    notify_user(user_id, 'Withdrawal Request Received',
                f'Your withdrawal of ${amount:,.2f} {currency} has been submitted and is pending review.',
                notif_type='withdrawal')

    # Send email notification
    try:
        email_withdrawal_received(user, withdrawal)
    except Exception:
        pass

    return jsonify({'message': 'Withdrawal request submitted', 'withdrawal': withdrawal.to_dict()}), 201
