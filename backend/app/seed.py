from app import create_app, db
from app.models import User, Company, MarketAsset, NewsArticle

def seed_database():
    app = create_app()
    with app.app_context():
        # Clean db
        db.drop_all()
        db.create_all()

        print("Seeding database...")

        # 1. Admin User
        admin = User(
            name="Platform Admin",
            email="admin@muskcapital.com",
            username="admin",
            role="admin",
            plan="Enterprise",
            balance=1000000.0,
            is_active=True
        )
        admin.set_password("demo1234")
        db.session.add(admin)

        # 2. Demo User
        demo = User(
            name="Demo User",
            email="user@muskcapital.com",
            username="demo",
            role="user",
            plan="Pro",
            balance=50000.0,
            is_active=True
        )
        demo.set_password("demo1234")
        db.session.add(demo)

        # 3. Companies
        companies = [
            Company(slug='tesla', name='Tesla', industry='Automotive & Energy', status='PUBLIC', ticker='TSLA', ceo='Elon Musk', founded=2003, headquarters='Austin, TX', website='tesla.com', employees='127,855', revenue='$81.46B'),
            Company(slug='spacex', name='SpaceX', industry='Aerospace', status='PRIVATE', ceo='Elon Musk', founded=2002, headquarters='Hawthorne, CA', website='spacex.com', employees='12,000+', revenue='Est. $4.6B'),
            Company(slug='xai', name='xAI', industry='Artificial Intelligence', status='PRIVATE', ceo='Elon Musk', founded=2023, headquarters='San Francisco, CA', website='x.ai', employees='Unknown', revenue='Pre-revenue'),
            Company(slug='neuralink', name='Neuralink', industry='Neurotechnology', status='PRIVATE', ceo='Elon Musk', founded=2016, headquarters='Fremont, CA', website='neuralink.com', employees='~300', revenue='Pre-revenue'),
            Company(slug='boring-company', name='The Boring Company', industry='Infrastructure', status='PRIVATE', ceo='Elon Musk', founded=2016, headquarters='Pflugerville, TX', website='boringcompany.com', employees='~200', revenue='Est. $20M'),
            Company(slug='x-corp', name='X (Twitter)', industry='Social Media', status='PRIVATE', ceo='Linda Yaccarino', founded=2006, headquarters='San Francisco, CA', website='x.com', employees='~1,500', revenue='Est. $3B'),
        ]
        db.session.add_all(companies)
        db.session.commit()

        # 4. Market Assets (Stocks & Crypto)
        assets = [
            MarketAsset(symbol='TSLA', name='Tesla Inc.', asset_type='stock', price=245.89, change_pct=1.45, market_cap='785B', volume='120M', color='#e82127', company_id=companies[0].id),
            MarketAsset(symbol='SPACE', name='SpaceX', asset_type='stock', price=145.20, change_pct=2.1, market_cap='150B', volume='N/A', color='#ffffff', company_id=companies[1].id),
            MarketAsset(symbol='XAI', name='xAI Corp', asset_type='stock', price=42.50, change_pct=8.4, market_cap='24B', volume='N/A', color='#ffffff', company_id=companies[2].id),
            
            MarketAsset(symbol='BTC', name='Bitcoin', asset_type='crypto', price=64230.50, change_pct=-0.8, market_cap='1.2T', volume='32B', color='#F7931A'),
            MarketAsset(symbol='ETH', name='Ethereum', asset_type='crypto', price=3450.75, change_pct=1.2, market_cap='410B', volume='15B', color='#627EEA'),
            MarketAsset(symbol='DOGE', name='Dogecoin', asset_type='crypto', price=0.158, change_pct=5.4, market_cap='22B', volume='2.1B', color='#C2A633'),
            
            MarketAsset(symbol='MUSK', name='Musk Composite Index', asset_type='index', price=1452.80, change_pct=1.8, market_cap='-', volume='-', color='#D4AF37'),
        ]
        db.session.add_all(assets)
        
        # 5. News
        news = [
            NewsArticle(title='Tesla announces next-generation humanoid robot capabilities', category='Tesla', status='published', is_featured=True, read_time='5 min'),
            NewsArticle(title='Starship completes successful orbital test flight', category='SpaceX', status='published', read_time='4 min'),
            NewsArticle(title='xAI launches Grok 2.0 with real-time X data access', category='xAI', status='published', read_time='3 min'),
            NewsArticle(title='Neuralink begins second human patient trial', category='Neuralink', status='published', read_time='6 min'),
        ]
        db.session.add_all(news)
        
        db.session.commit()
        print("Database seeded successfully! Admin: admin@muskcapital.com / demo1234")

if __name__ == '__main__':
    seed_database()
