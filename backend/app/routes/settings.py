from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, UserSettings

settings_bp = Blueprint('settings', __name__)


def _get_or_create_settings(user_id):
    settings = UserSettings.query.filter_by(user_id=user_id).first()
    if not settings:
        settings = UserSettings(user_id=user_id)
        db.session.add(settings)
        db.session.commit()
    return settings


@settings_bp.route('', methods=['GET'])
@jwt_required()
def get_settings():
    user_id  = int(get_jwt_identity())
    settings = _get_or_create_settings(user_id)
    return jsonify(settings.to_dict()), 200


@settings_bp.route('', methods=['PATCH'])
@jwt_required()
def update_settings():
    user_id  = int(get_jwt_identity())
    settings = _get_or_create_settings(user_id)
    data     = request.get_json()

    allowed = ['email_deposits', 'email_withdrawals', 'email_news',
               'two_factor_enabled', 'dark_mode', 'currency']
    for field in allowed:
        if field in data:
            setattr(settings, field, data[field])

    db.session.commit()
    return jsonify({'message': 'Settings updated', 'settings': settings.to_dict()}), 200
