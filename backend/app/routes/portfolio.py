from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Portfolio, Holding

portfolio_bp = Blueprint('portfolio', __name__)


def _get_or_create_portfolio(user_id):
    from app import db
    portfolio = Portfolio.query.filter_by(user_id=user_id).first()
    if not portfolio:
        portfolio = Portfolio(user_id=user_id)
        db.session.add(portfolio)
        db.session.commit()
    return portfolio


@portfolio_bp.route('', methods=['GET'])
@jwt_required()
def get_portfolio():
    user_id   = int(get_jwt_identity())
    portfolio = _get_or_create_portfolio(user_id)

    # Calculate live value
    holdings_value = sum(h.shares * h.current_price for h in portfolio.holdings)
    portfolio.total_value = portfolio.cash_balance + holdings_value

    from app import db
    db.session.commit()

    return jsonify(portfolio.to_dict()), 200


@portfolio_bp.route('/history', methods=['GET'])
@jwt_required()
def get_portfolio_history():
    """Returns mock historical data for the area chart."""
    import random
    from datetime import datetime, timedelta

    user_id   = int(get_jwt_identity())
    portfolio = _get_or_create_portfolio(user_id)

    base_val = portfolio.total_value or 10000
    points   = 30
    history  = []
    now      = datetime.utcnow()

    for i in range(points, -1, -1):
        dt  = now - timedelta(days=i)
        val = base_val * (1 + random.uniform(-0.05, 0.05))
        history.append({
            'date': dt.strftime('%b %d'),
            'value': round(val, 2)
        })

    return jsonify(history), 200
