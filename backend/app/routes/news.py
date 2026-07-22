from flask import Blueprint, request, jsonify
from app import db
from app.models import NewsArticle

news_bp = Blueprint('news', __name__)


@news_bp.route('', methods=['GET'])
def get_news():
    category = request.args.get('category')
    featured = request.args.get('featured')

    query = NewsArticle.query.filter_by(status='published')

    if category:
        query = query.filter(NewsArticle.category.ilike(category))
    if featured == 'true':
        query = query.filter_by(is_featured=True)

    articles = query.order_by(NewsArticle.published.desc()).all()
    return jsonify([a.to_dict() for a in articles]), 200


@news_bp.route('/<int:nid>', methods=['GET'])
def get_article(nid):
    article = NewsArticle.query.filter_by(id=nid, status='published').first_or_404()
    # Increment views
    article.views = (article.views or 0) + 1
    db.session.commit()
    return jsonify(article.to_dict()), 200


@news_bp.route('/<int:nid>/bookmark', methods=['POST'])
def bookmark_article(nid):
    # Just a stub for frontend compatibility
    return jsonify({'message': 'Article bookmarked'}), 200
