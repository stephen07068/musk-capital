from flask import request, jsonify


def paginate_query(query, default_per_page=20):
    """
    Paginate a SQLAlchemy query using ?page= and ?per_page= request args.
    Returns (items, meta_dict).
    """
    page     = max(1, int(request.args.get('page', 1)))
    per_page = min(100, int(request.args.get('per_page', default_per_page)))
    result   = query.paginate(page=page, per_page=per_page, error_out=False)
    meta = {
        'page': page,
        'per_page': per_page,
        'total': result.total,
        'pages': result.pages,
        'has_next': result.has_next,
        'has_prev': result.has_prev,
    }
    return result.items, meta
