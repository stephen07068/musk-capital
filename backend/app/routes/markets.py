from flask import Blueprint, request, jsonify
from app.models import MarketAsset

markets_bp = Blueprint('markets', __name__)


@markets_bp.route('', methods=['GET'])
def get_all_markets():
    asset_type = request.args.get('type')
    query      = MarketAsset.query
    if asset_type:
        query = query.filter_by(asset_type=asset_type)
    assets = query.order_by(MarketAsset.symbol).all()
    return jsonify([a.to_dict() for a in assets]), 200


@markets_bp.route('/stocks', methods=['GET'])
def get_stocks():
    stocks = MarketAsset.query.filter_by(asset_type='stock').order_by(MarketAsset.symbol).all()
    return jsonify([s.to_dict() for s in stocks]), 200


@markets_bp.route('/crypto', methods=['GET'])
def get_crypto():
    crypto = MarketAsset.query.filter_by(asset_type='crypto').order_by(MarketAsset.symbol).all()
    return jsonify([c.to_dict() for c in crypto]), 200


@markets_bp.route('/indices', methods=['GET'])
def get_indices():
    indices = MarketAsset.query.filter_by(asset_type='index').order_by(MarketAsset.symbol).all()
    return jsonify([i.to_dict() for i in indices]), 200


@markets_bp.route('/<symbol>', methods=['GET'])
def get_asset(symbol):
    asset = MarketAsset.query.filter_by(symbol=symbol.upper()).first_or_404()
    return jsonify(asset.to_dict()), 200
