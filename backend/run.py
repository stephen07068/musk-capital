import sys
from app import create_app, db

app = create_app()

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'seed':
        from app.seed import seed_database
        seed_database()
    else:
        with app.app_context():
            db.create_all()
            print("Database tables ensured.")
        app.run(debug=True, port=5000)
