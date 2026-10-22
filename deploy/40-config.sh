#!/bin/sh
# Gera /config.js a partir das variáveis do container (roda na subida do nginx).
set -eu
API_URL="${VITE_API_URL:-}"
# Escapa aspas e barras invertidas para o valor caber em uma string JS.
ESC=$(printf '%s' "$API_URL" | sed 's/\\/\\\\/g; s/"/\\"/g')
printf 'window.__APP_CONFIG__ = { API_URL: "%s" };\n' "$ESC" > /usr/share/nginx/html/config.js
