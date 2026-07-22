from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from app import db
from app.models import WatchlistItem, MarketAsset

watchlist_bp = Blueprint('watchlist', __name__)


@watchlist_bp.route('', methods=['GET'])
@jwt_required()
def get_watchlist():
    user_id = int(get_jwt_identity())
    items   = WatchlistItem.query.filter_by(user_id=user_id).order_by(WatchlistItem.added_at.desc()).all()
    symbols = [i.symbol for i in items]

    # Enrich with live market data if available
    assets = {a.symbol: a.to_dict() for a in MarketAsset.query.filter(MarketAsset.symbol.in_(symbols)).all()}
    result = []
    for item in items:
        entry = assets.get(item.symbol, {'symbol': item.symbol})
        entry['added_at'] = item.added_at.isoformat()
        result.append(entry)

    return jsonify(result), 200


@watchlist_bp.route('', methods=['POST'])
@jwt_required()
def add_to_watchlist():
    user_id = int(get_jwt_identity())
    data    = request.get_json()
    symbol  = data.get('symbol', '').upper().strip()

    if not symbol:
        return jsonify({'message': 'Symbol is required'}), 400

    item = WatchlistItem(user_id=user_id, symbol=symbol)
    try:
        db.session.add(item)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': f'{symbol} is already in your watchlist'}), 409

    return jsonify({'message': f'{symbol} added to watchlist'}), 201


@watchlist_bp.route('/<symbol>', methods=['DELETE'])
@jwt_required()
def remove_from_watchlist(symbol):
    user_id = int(get_jwt_identity())
    item    = WatchlistItem.query.filter_by(user_id=user_id, symbol=symbol.upper()).first_or_404()
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': f'{symbol} removed from watchlist'}), 200
