from functools import wraps
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db


def admin_required(fn):
    """Decorator: requires valid JWT AND role == 'admin'."""
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        from app.models import User
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.role != 'admin':
            return jsonify({'message': 'Admin access required', 'error': 'forbidden'}), 403
        return fn(*args, **kwargs)
    return wrapper


def log_audit(admin, action, details=None, log_type='system'):
    """Write an audit log entry. Call inside a request context."""
    from app.models import AuditLog
    try:
        log = AuditLog(
            admin_id=admin.id if admin else None,
            admin_name=admin.name if admin else 'System',
            action=action,
            details=details,
            log_type=log_type,
            ip_address=request.remote_addr,
        )
        db.session.add(log)
        db.session.commit()
    except Exception:
        pass  # Never let audit logging crash the main request


def notify_user(user_id, title, message, notif_type='system'):
    """Create an in-app notification for a user."""
    from app.models import Notification
    try:
        notif = Notification(
            user_id=user_id,
            title=title,
            message=message,
            notif_type=notif_type,
        )
        db.session.add(notif)
        db.session.commit()
        return notif
    except Exception:
        return None
