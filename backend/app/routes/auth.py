from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models import User
from app.services.email_service import email_welcome, email_password_reset

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    required = ['name', 'email', 'username', 'password']
    for field in required:
        if not data.get(field):
            return jsonify({'message': f'{field} is required'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 409
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already taken'}), 409

    user = User(
        name=data['name'],
        email=data['email'].lower(),
        username=data['username'].lower(),
        role='user',
        plan='Free',
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()

    # Send welcome email
    try:
        email_welcome(user)
    except Exception:
        pass

    token = create_access_token(identity=str(user.id))
    return jsonify({'access_token': token, 'user': user.to_dict()}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('email', '').lower()
    password   = data.get('password', '')

    user = (User.query.filter_by(email=identifier).first()
            or User.query.filter_by(username=identifier).first())

    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid credentials'}), 401
    if not user.is_active:
        return jsonify({'message': 'Account is deactivated'}), 403

    token = create_access_token(identity=str(user.id))
    return jsonify({'access_token': token, 'user': user.to_dict()}), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200


@auth_bp.route('/google', methods=['POST'])
def google_auth():
    data = request.get_json() or {}
    email = data.get('email', 'alex.investor@gmail.com').lower()
    name = data.get('name', 'Alex Mercer')
    username = email.split('@')[0]

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(
            name=name,
            email=email,
            username=username,
            role='user',
            plan='Pro',
        )
        user.set_password('google_auth_oauth_pass')
        db.session.add(user)
        db.session.commit()

        # Send welcome email for new Google users
        try:
            email_welcome(user)
        except Exception:
            pass

    token = create_access_token(identity=str(user.id))
    return jsonify({'access_token': token, 'user': user.to_dict()}), 200


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data  = request.get_json()
    email = data.get('email', '').lower()
    user  = User.query.filter_by(email=email).first()

    if user:
        import os
        platform_url = os.getenv('PLATFORM_URL', 'http://localhost:5173')
        reset_link   = f"{platform_url}/reset-password?email={email}"
        try:
            email_password_reset(user, reset_link)
        except Exception:
            pass

    # Always return success to prevent email enumeration
    return jsonify({'message': 'If that email exists, a reset link has been sent.'}), 200
