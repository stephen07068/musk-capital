import os
import uuid
from flask import current_app
from werkzeug.utils import secure_filename


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'pdf'}
MAX_SIZE_BYTES = 10 * 1024 * 1024   # 10 MB


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def save_upload(file, subfolder='general'):
    """
    Validate and save an uploaded file.
    Returns the relative path string or raises ValueError.
    """
    if not file or file.filename == '':
        raise ValueError('No file provided')
    if not allowed_file(file.filename):
        raise ValueError(f'File type not allowed. Accepted: {", ".join(ALLOWED_EXTENSIONS)}')

    # Read content and check size
    content = file.read()
    if len(content) > MAX_SIZE_BYTES:
        raise ValueError('File size exceeds 10 MB limit')
    file.seek(0)

    upload_root = current_app.config.get('UPLOAD_FOLDER', 'uploads')
    folder = os.path.join(upload_root, subfolder)
    os.makedirs(folder, exist_ok=True)

    ext      = secure_filename(file.filename).rsplit('.', 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    path     = os.path.join(folder, filename)
    file.save(path)

    return f"/uploads/{subfolder}/{filename}"
