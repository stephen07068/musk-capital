from app import create_app, db
from app.models import User

app = create_app()
with app.app_context():
    admin = User.query.filter_by(username='admin').first()
    print(f'Admin user: {admin.email}')
    print(f'Password check for "demo1234": {admin.check_password("demo1234")}')
    print(f'Password hash: {admin.password_hash[:50]}...')
