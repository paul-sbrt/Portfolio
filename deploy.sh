#!/usr/bin/env bash
#
# Portfolio Paul Sabourault - Deploiement local (branche refonte) -> O2switch.
# Meme compte que EXTRALIMO (SSH), en rsync (site 100% statique).
#
# Usage :  ./deploy.sh
#
# 1. Regenere les pages detail (python3 build_detail.py)
# 2. SAUVEGARDE le docroot serveur AVANT tout ecrasement
# 3. rsync du site vers le docroot (exclut sources, secrets, .git, .well-known, cgi-bin)
#
# Ne rsync JAMAIS contact.secret.php (identifiants SMTP) : exclu ci-dessous + gitignored.
# contact.secret.php + vendor/ (composer require phpmailer) vivent uniquement sur le serveur.
#
set -euo pipefail
cd "$(dirname "$0")"

REMOTE="suno5661@suno5661.odns.fr"
SERVER_DIR="/home/suno5661/sites/portfolio-sbrt.com/public"   # docroot reel (verifie)
BRANCH="refonte"
URL="https://portfolio-sbrt.com"
STAMP="$(date +%Y%m%d-%H%M%S)"

CUR="$(git rev-parse --abbrev-ref HEAD)"
if [ "$CUR" != "$BRANCH" ]; then
  echo "Abandon : tu es sur '$CUR', pas '$BRANCH'."
  exit 1
fi

echo "[1/3] Regeneration des pages detail (python3 build_detail.py)..."
python3 build_detail.py

echo "[2/3] SAUVEGARDE du docroot serveur (AVANT ecrasement)..."
ssh -o BatchMode=yes -o ConnectTimeout=15 "$REMOTE" \
  "if [ -d $SERVER_DIR ] && [ -n \"\$(ls -A $SERVER_DIR 2>/dev/null)\" ]; then cp -a $SERVER_DIR ${SERVER_DIR}.backup-$STAMP && echo '   backup -> ${SERVER_DIR}.backup-$STAMP'; else echo '   (docroot vide/absent)'; fi"

echo "[3/3] Synchronisation (rsync)..."
rsync -az --delete \
  --exclude='.git/' \
  --exclude='.gitignore' \
  --exclude='.vscode/' \
  --exclude='.claude/' \
  --exclude='design-samples/' \
  --exclude='__pycache__/' \
  --exclude='.DS_Store' \
  --exclude='build_detail.py' \
  --exclude='deploy.sh' \
  --exclude='*.md' \
  --exclude='contact.secret.example.php' \
  --exclude='contact.secret.php' \
  --exclude='vendor/' \
  --exclude='composer.json' \
  --exclude='composer.lock' \
  --exclude='cgi-bin/' \
  --exclude='.well-known/' \
  ./ "$REMOTE:$SERVER_DIR/"

echo ""
echo "EN LIGNE sur $URL   (sauvegarde : ${SERVER_DIR}.backup-$STAMP)"
