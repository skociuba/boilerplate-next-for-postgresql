#!/usr/bin/env bash
set -euo pipefail

# Szybki powrót do WCZEŚNIEJSZEGO, znanego-dobrego obrazu frontendu — na
# wypadek, gdy właśnie wypchnięty deploy jest zepsuty.
#
# Normalnie rollback robi się z GitHuba: Actions → "Deploy Frontend" →
# Run workflow → numer starszej wersji (deploy.yml). Ten skrypt jest na
# sytuację, gdy GitHub Actions nie działa albo trzeba wrócić do obrazu,
# który nie jest wydaniem.
#
# Każde wydanie ma na Docker Hubie obraz :X.Y.Z (release.yml), a każdy
# commit na master obraz :<pełny sha> (ci.yml). docker-compose.prod.yml
# czyta tag ze zmiennej IMAGE_TAG (${IMAGE_TAG:-latest}), więc nie trzeba
# niczego edytować w pliku.
#
# FE nie ma własnej bazy danych, więc (w odróżnieniu od backendu) tu nie
# ma czego cofać poza samym obrazem — żadnego backupu przed tym krokiem.
#
# Lista wersji: zakładka Releases na GitHubie albo CHANGELOG.md, np.
# ./scripts/rollback.sh 1.1.0
# Sha: `git log --first-parent --oneline master`.
#
# Użycie: ./scripts/rollback.sh <sha-albo-wersja> [katalog-z-docker-compose.prod.yml]

if [ -z "${1:-}" ]; then
  echo "Użycie: $0 <wersja-albo-sha> [katalog]" >&2
  echo "Wersje: zakładka Releases albo CHANGELOG.md; sha: 'git log'." >&2
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
echo "Obraz działa teraz na ${IMAGE}. Następne wydanie (merge release"
echo "PR-a) wdroży nową wersję automatycznie."
