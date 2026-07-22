from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Transaction
from app.utils.pagination import paginate_query

transactions_bp = Blueprint('transactions', __name__)


@transactions_bp.route('', methods=['GET'])
@jwt_required()
def get_transactions():
    user_id  = int(get_jwt_identity())
    tx_type  = request.args.get('type')     # deposit | withdrawal | gift_card
    status   = request.args.get('status')   # pending | approved | rejected

    query = Transaction.query.filter_by(user_id=user_id)
    if tx_type:
        query = query.filter_by(tx_type=tx_type)
    if status:
        query = query.filter_by(status=status)

    query = query.order_by(Transaction.created_at.desc())
    items, meta = paginate_query(query, default_per_page=20)

    return jsonify({'transactions': [t.to_dict() for t in items], **meta}), 200
