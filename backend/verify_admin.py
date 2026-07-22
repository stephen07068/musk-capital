from app import create_app, db
from app.models import User
from app.routes import admin

app = create_app()
with app.app_context():
    # Check admin user
    admin_user = User.query.filter_by(role='admin').first()
    print("=" * 60)
    print("ADMIN USER VERIFICATION")
    print("=" * 60)
    if admin_user:
        print(f"✓ Admin Email: {admin_user.email}")
        print(f"✓ Admin Username: {admin_user.username}")
        print(f"✓ Admin Role: {admin_user.role}")
        print(f"✓ Admin Active: {admin_user.is_active}")
        print(f"✓ Password 'demo1234' works: {admin_user.check_password('demo1234')}")
        print(f"✓ Admin Balance: ${admin_user.balance:,.2f}")
        print(f"✓ Admin Plan: {admin_user.plan}")
    else:
        print("✗ No admin user found!")
    
    print("\n" + "=" * 60)
    print("ADMIN ROUTES REGISTERED")
    print("=" * 60)
    
    # Check registered admin routes
    admin_routes = [rule for rule in app.url_map.iter_rules() if '/api/admin' in rule.rule]
    if admin_routes:
        print(f"✓ Found {len(admin_routes)} admin routes:")
        for route in sorted(admin_routes, key=lambda x: x.rule):
            methods = ', '.join(sorted(route.methods - {'HEAD', 'OPTIONS'}))
            print(f"  {methods:12} {route.rule}")
    else:
        print("✗ No admin routes found!")
