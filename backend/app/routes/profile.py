from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, UserSettings
from app.utils.uploads import save_upload

profile_bp = Blueprint('profile', __name__)


@profile_bp.route('', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    user    = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200


@profile_bp.route('', methods=['PATCH'])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    user    = User.query.get_or_404(user_id)
    data    = request.get_json()

    allowed = ['name', 'country', 'phone', 'bio']
    for field in allowed:
        if field in data:
            setattr(user, field, data[field])

    db.session.commit()
    return jsonify({'message': 'Profile updated', 'user': user.to_dict()}), 200


@profile_bp.route('/avatar', methods=['POST'])
@jwt_required()
def upload_avatar():
    user_id = int(get_jwt_identity())
    user    = User.query.get_or_404(user_id)

    if 'avatar' not in request.files:
        return jsonify({'message': 'No file provided'}), 400

    try:
        path = save_upload(request.files['avatar'], subfolder='avatars')
    except ValueError as e:
        return jsonify({'message': str(e)}), 400

    user.avatar_url = path
    db.session.commit()
    return jsonify({'message': 'Avatar updated', 'avatar_url': path}), 200


@profile_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    user_id = int(get_jwt_identity())
    user    = User.query.get_or_404(user_id)
    data    = request.get_json()

    current  = data.get('current_password', '')
    new_pass = data.get('new_password', '')

    if not user.check_password(current):
        return jsonify({'message': 'Current password is incorrect'}), 401
    if len(new_pass) < 8:
        return jsonify({'message': 'New password must be at least 8 characters'}), 400

    user.set_password(new_pass)
    db.session.commit()
    return jsonify({'message': 'Password changed successfully'}), 200
