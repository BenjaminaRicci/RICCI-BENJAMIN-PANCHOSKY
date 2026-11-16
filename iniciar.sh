#!/bin/sh

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

if ! command -v npm >/dev/null 2>&1; then
    echo "Error: se requiere Node.js con npm instalado para iniciar el proyecto." >&2
    exit 1
fi

echo "Iniciando backend (http://localhost:3000) y frontend (http://localhost:5173)..."

npm --prefix "$ROOT_DIR/backend" run dev &
BACKEND_PID=$!

npm --prefix "$ROOT_DIR/frontend" run dev &
FRONTEND_PID=$!

stop_servers() {
    kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
}

trap stop_servers EXIT INT TERM

wait "$BACKEND_PID"
wait "$FRONTEND_PID"