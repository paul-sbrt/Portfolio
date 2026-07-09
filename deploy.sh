#!/usr/bin/env bash
#
# Portfolio Paul Sabourault — Déploiement local (branche refonte) → O2switch.
# Calqué sur le workflow EXTRALIMO (SSH + O2switch), en rsync (site 100% statique).
#
# Usage :  ./deploy.sh
#
# Enchaîne, s'arrête à la première erreur (set -e) :
#   1. Régénère les pages détail (python3 build_detail.py)
#   2. SAUVEGARDE le docroot serveur AVANT tout écrasement (filet de sécurité)
#   3. rsync du site vers le docroot (exclut sources, secrets, .git)
#
# ⚠️ NE committe/rsync JAMAIS contact.secret.php (identifiants SMTP) : il est exclu
#    ci-dessous ET gitignored. Il vit uniquement sur le serveur.
#
set -euo pipefail
cd "$(dirname "$0")"

REMOTE="suno5661@suno5661.odns.fr"     # compte O2switch (confirmé, même qu'EXTRALIMO)
SERVER_DIR="~/sites/portfolio-sbrt.com/public"   # docroot RÉEL (vérifié : sert cgi-bin/.well-known)
BRANCH="refonte"
URL="https://portfolio-sbrt.com"
STAMP="$(date +%Y%m%d-%H%M%S)"

# --- Garde-fou : on déploie depuis la bonne branche --------------------------
CUR="$(git rev-parse --abbrev-ref HEAD)"
if [ "$CUR" != "$BRANCH" ]; then
  echo "✋ Tu es sur '$CUR', pas '$BRANCH'. Abandon."
  exit 1
fi

echo "▶ [1/3] Régénération des pages détail (python3 build_detail.py)…"
python3 build_detail.py

echo ""
echo "▶ [2/3] SAUVEGARDE du docroot serveur (AVANT écrasement)…"
ssh -o BatchMode=yes -o ConnectTimeout=15 "$REMOTE" \
  "if [ -d $SERVER_DIR ] && [ -n \"\$(ls -A $SERVER_DIR 2>/dev/null)\" ]; then \
      cp -a $SERVER_DIR ${SERVER_DIR}.backup-$STAMP && echo '   ✓ backup → ${SERVER_DIR}.backup-$STAMP'; \
   else echo '   (docroot vide/absent, rien à sauvegarder)'; fi"

echo ""
echo "▶ [3/3] Synchronisation (rsync) vers $SERVER_DIR…"
rsync -avz --delete \
  --exclude='.git/' \
  --exclude='.gitignore' \
  --exclude='design-samples/' \
  --exclude='__pycache__/' \
  --exclude='.DS_Store' \
  --exclude='.claude/' \
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
echo "✅ EN LIGNE sur $URL   (sauvegarde : ${SERVER_DIR}.backup-$STAMP)"
echo "   Rappel : sur le serveur, contact.secret.php + vendor/ (composer require phpmailer/phpmailer)"
echo "   doivent être en place, et SIMULATE=false dans contact.js."
