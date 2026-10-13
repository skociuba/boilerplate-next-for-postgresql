#!/usr/bin/env bash
set -euo pipefail

# Szybki powrót do WCZEŚNIEJSZEGO, znanego-dobrego obrazu frontendu — na
# wypadek, gdy właśnie wypchnięty deploy jest zepsuty.
#
# DZIAŁA, bo .github/workflows/main.yml wypycha na Docker Hub DWA tagi na
# każdy build: :latest ORAZ :<pełny sha commita>. docker-compose.prod.yml
# czyta tag ze zmiennej IMAGE_TAG (${IMAGE_TAG:-latest}), więc nie trzeba
# niczego edytować w pliku — tylko na chwilę nadpisać zmienną.
#
# Skąd wziąć <sha>: GitHub → zakładka Actions → poprzedni UDANY run →
# krok "Build and push frontend image" → w logu widać dokładny tag. Albo:
# `git log --oneline` na branchu `master` — każdy commit tam = jeden obraz.
#
# FE nie ma własnej bazy danych, więc (w odróżnieniu od backendu) tu nie
# ma czego cofać poza samym obrazem — żadnego backupu przed tym krokiem.
#
# Użycie: ./scripts/rollback.sh <sha> [katalog-z-docker-compose.prod.yml]

if [ -z "${1:-}" ]; then
  echo "Użycie: $0 <sha-obrazu-do-przywrócenia> [katalog]" >&2
  echo "Sha znajdziesz w GitHub Actions (poprzedni udany run) albo w 'git log'." >&2
  exit 1
fi

SHA="$1"
TARGET_DIR="${2:-$(dirname "$0")/..}"
IMAGE="sebastiankociuba/node-frontend:${SHA}"

echo "=== Rollback do obrazu: ${IMAGE} ==="

cd "$TARGET_DIR"

if sudo docker compose version >/dev/null 2>&1; then
  DC="sudo docker compose"
else
  DC="sudo docker-compose"
fi

IMAGE_TAG="$SHA" $DC -f docker-compose.prod.yml pull
IMAGE_TAG="$SHA" $DC -f docker-compose.prod.yml up -d

echo "=== Gotowe. Sprawdź: docker ps / docker logs VPS-2-FE ==="
echo "Obraz działa teraz na ${IMAGE} — NIE na :latest. Następny normalny"
echo "deploy (push na branch 'master') wróci do :latest automatycznie."
