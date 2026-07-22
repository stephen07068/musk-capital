#!/bin/bash
# Build script for Pxxl: builds React frontend then installs Python deps
set -e

echo "=== Building React Frontend ==="
cd ..
npm install --legacy-peer-deps
npm run build
echo "✓ Frontend built to dist/"

echo "=== Installing Python Backend ==="
cd backend
pip install -r requirements.txt
echo "✓ Backend dependencies installed"

echo "=== Build Complete ==="
ls -la ../dist/
