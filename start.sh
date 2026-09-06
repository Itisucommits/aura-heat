#!/usr/bin/env bash
# ==============================================================================
# AURA-Heat: Unified 1-Command Startup & Hosting Script
# ==============================================================================
set -e

echo "======================================================================"
echo "    AURA-Heat: Adaptive Urban Risk and Automated Heatwave Advisory"
echo "======================================================================"

# Check if Docker is available
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
    echo "[✔] Docker detected. Starting full container stack (PostGIS + Redis + FastAPI + Celery + Web)..."
    cd docker
    docker compose up -d --build
    echo ""
    echo "======================================================================"
    echo "[✔] AURA-Heat platform is LIVE!"
    echo " -> Web GIS Dashboard:   http://localhost:3000"
    echo " -> FastAPI OpenAPI Docs: http://localhost:8000/docs"
    echo " -> PostGIS Database:    localhost:5432 (user: aura_user)"
    echo "======================================================================"
    echo "To view live logs: cd docker && docker compose logs -f"
    echo "To stop:           cd docker && docker compose down"
else
    echo "[!] Docker not detected or daemon not running."
    echo "[✔] Launching standalone high-performance web dashboard on port 3000..."
    npm install
    npm run dev
fi
