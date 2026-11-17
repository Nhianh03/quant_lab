#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export HOST="${HOST:-127.0.0.1}"
export PORT="${PORT:-8686}"
URL="http://${HOST}:${PORT}"

if ! command -v python3 >/dev/null 2>&1; then
  echo "Lỗi: Không tìm thấy python3 trên hệ thống." >&2
  exit 1
fi

echo "Đang khởi động Quant Research Academy tại ${URL} ..."

if [[ "${NO_BROWSER:-0}" != "1" ]] && command -v open >/dev/null 2>&1; then
  (
    sleep 0.6
    open "${URL}" >/dev/null 2>&1 || true
  ) &
fi

exec python3 "${SCRIPT_DIR}/server.py" --host "${HOST}" --port "${PORT}"
