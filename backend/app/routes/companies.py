from flask import Blueprint, request, jsonify
from app.models import Company

companies_bp = Blueprint('companies', __name__)


@companies_bp.route('', methods=['GET'])
def get_companies():
    status = request.args.get('status')
    q      = request.args.get('q', '').lower()

    query = Company.query
    if status:
        query = query.filter_by(status=status.upper())
    if q:
        query = query.filter(Company.name.ilike(f'%{q}%'))

    companies = query.order_by(Company.name).all()
    return jsonify([c.to_dict() for c in companies]), 200


@companies_bp.route('/<slug>', methods=['GET'])
def get_company(slug):
    company = Company.query.filter_by(slug=slug.lower()).first_or_404()
    return jsonify(company.to_dict()), 200
