from flask import Blueprint, request, jsonify
from app.models import Company, MarketAsset, NewsArticle

search_bp = Blueprint('search', __name__)


@search_bp.route('', methods=['GET'])
def global_search():
    q = request.args.get('q', '').strip()
    if len(q) < 2:
        return jsonify({'results': [], 'message': 'Query too short'}), 200

    like = f'%{q}%'
    results = []

    # Companies
    companies = Company.query.filter(
        (Company.name.ilike(like)) | (Company.slug.ilike(like))
    ).limit(5).all()
    for c in companies:
        results.append({'type': 'company', 'label': c.name, 'sub': c.industry or '', 'id': c.slug})

    # Market assets
    assets = MarketAsset.query.filter(
        (MarketAsset.symbol.ilike(like)) | (MarketAsset.name.ilike(like))
    ).limit(8).all()
    for a in assets:
        results.append({'type': a.asset_type, 'label': a.symbol, 'sub': a.name,
                        'price': a.price, 'change': a.change_pct, 'id': a.symbol})

    # News
    articles = NewsArticle.query.filter(
        NewsArticle.title.ilike(like)
    ).filter_by(status='published').limit(4).all()
    for n in articles:
        results.append({'type': 'news', 'label': n.title, 'sub': n.category or '', 'id': n.id})

    return jsonify({'results': results, 'query': q}), 200
