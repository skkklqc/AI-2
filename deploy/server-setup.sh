#!/bin/bash
set -euo pipefail

APP_DIR="/home/ubuntu/salary-calculator"
APP_NAME="salary-calculator"
PORT=3001

echo "==> Installing Node.js..."
if ! command -v node >/dev/null 2>&1; then
  if command -v apt-get >/dev/null 2>&1; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y -qq nodejs
  elif command -v yum >/dev/null 2>&1; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo yum install -y -q nodejs
  fi
fi

echo "Node: $(node -v)"
echo "NPM:  $(npm -v)"

echo "==> Installing app dependencies..."
cd "$APP_DIR"
npm install --prefix backend --omit=dev
npm install --prefix frontend --include=dev
npm run build

echo "==> Installing PM2..."
npm install -g pm2 >/dev/null 2>&1 || sudo npm install -g pm2

echo "==> Starting app on port ${PORT}..."
pm2 delete "$APP_NAME" >/dev/null 2>&1 || true
pm2 start "$APP_DIR/deploy/ecosystem.config.cjs"
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu | tail -1 | sudo bash || true

echo ""
echo "==> Deployment complete!"
echo "Visit: http://1.117.70.56:${PORT}"
pm2 status
