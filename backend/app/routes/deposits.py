import os
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Deposit, Transaction, User
from app.middleware.auth import notify_user
from app.utils.uploads import save_upload
from app.services.email_service import email_deposit_received, email_gift_card_received
from datetime import datetime

deposits_bp = Blueprint('deposits', __name__)


@deposits_bp.route('', methods=['GET'])
@jwt_required()
def get_deposits():
    user_id = int(get_jwt_identity())
    deposits = Deposit.query.filter_by(user_id=user_id).order_by(Deposit.created_at.desc()).all()
    return jsonify([d.to_dict() for d in deposits]), 200


@deposits_bp.route('/crypto', methods=['POST'])
@jwt_required()
def submit_crypto_deposit():
    user_id = int(get_jwt_identity())
    data    = request.get_json()

    currency = data.get('currency', '').upper()
    if currency not in ('BTC', 'ETH', 'USDT'):
        return jsonify({'message': 'Currency must be BTC, ETH, or USDT'}), 400

    amount = float(data.get('amount', 0))
    if amount <= 0:
        return jsonify({'message': 'Amount must be greater than 0'}), 400

    deposit = Deposit(
        user_id=user_id,
        currency=currency,
        network=data.get('network', currency),
        amount=amount,
        wallet_address=data.get('wallet_address', ''),
        tx_hash=data.get('tx_hash', ''),
        status='pending',
    )
    db.session.add(deposit)

    # Mirror in unified transactions table
    tx = Transaction(
        user_id=user_id, tx_type='deposit',
        method=currency, amount=amount, status='pending', ref_id=None,
    )
    db.session.add(tx)
    db.session.commit()

    # Update ref_id now that deposit has an id
    tx.ref_id = deposit.id
    db.session.commit()

    notify_user(user_id, 'Deposit Received',
                f'Your {currency} deposit of ${amount:,.2f} has been received and is pending review.',
                notif_type='deposit')

    # Send email notification
    user = User.query.get(user_id)
    if user:
        try:
            email_deposit_received(user, deposit)
        except Exception:
            pass

    return jsonify({'message': 'Deposit submitted successfully', 'deposit': deposit.to_dict()}), 201


@deposits_bp.route('/gift-card', methods=['POST'])
@jwt_required()
def submit_gift_card_deposit():
    """Multipart form: card_type, value, country, card_code, notes + optional image"""
    from app.models import GiftCard
    user_id = int(get_jwt_identity())

    card_type = request.form.get('card_type', '').strip()
    value_str = request.form.get('value', '0')

    ALLOWED_BRANDS = ['Steam', 'Razer Gold', 'Apple']
    if not card_type or card_type not in ALLOWED_BRANDS:
        return jsonify({'message': f'Invalid card type. Allowed: {", ".join(ALLOWED_BRANDS)}'}), 400
    try:
        value = float(value_str)
    except ValueError:
        return jsonify({'message': 'Invalid value'}), 400

    image_path = None
    if 'image' in request.files:
        try:
            image_path = save_upload(request.files['image'], subfolder='gift_cards')
        except ValueError as e:
            return jsonify({'message': str(e)}), 400

    card = GiftCard(
        user_id=user_id,
        card_type=card_type,
        value=value,
        country=request.form.get('country', ''),
        card_code=request.form.get('card_code', ''),
        notes=request.form.get('notes', ''),
        image_path=image_path,
        status='pending',
    )
    db.session.add(card)

    tx = Transaction(
        user_id=user_id, tx_type='gift_card',
        method=card_type, amount=value, status='pending',
    )
    db.session.add(tx)
    db.session.commit()

    notify_user(user_id, 'Gift Card Received',
                f'Your {card_type} gift card worth ${value:,.2f} has been received and is under review.',
                notif_type='deposit')

    # Send email notification to user & send email with attachment to admin
    user_obj = User.query.get(user_id)
    if user_obj:
        try:
            email_gift_card_received(user_obj, card)
            full_img_path = None
            if image_path:
                full_img_path = os.path.join(current_app.config['UPLOAD_FOLDER'], '..', image_path)
                full_img_path = os.path.normpath(full_img_path)
            from app.services.email_service import email_gift_card_to_admin
            email_gift_card_to_admin(user_obj, card, full_image_path=full_img_path)
        except Exception as err:
            print(f'[GiftCard Email Error] {err}')

    return jsonify({'message': 'Gift card submitted successfully', 'gift_card': card.to_dict()}), 201


@deposits_bp.route('/addresses', methods=['GET'])
def get_wallet_addresses():
    """Return platform deposit wallet addresses (public)."""
    cfg = current_app.config
    return jsonify({
        'BTC':  cfg.get('WALLET_BTC', ''),
        'ETH':  cfg.get('WALLET_ETH', ''),
        'USDT': cfg.get('WALLET_USDT', ''),
    }), 200
