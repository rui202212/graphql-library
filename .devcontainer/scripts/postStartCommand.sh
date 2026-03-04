#!/usr/bin/env bash
set -euo pipefail

echo "    Installing runtimes with Mise..."
mise trust --yes
mise install --yes

echo "    Installing npm deps..."
cd /workspace
npm ci || npm install

echo "    Waiting for MariaDB to be ready..."
# Quick wait loop using nc
for i in {1..60}; do
  if nc -zv db 3306 2>/dev/null; then
    echo "    MariaDB is up."
    break
  fi
  echo "    Waiting... ($i/60)"
  sleep 2
done

echo "    Prisma generate..."
npx prisma generate || true

echo "    Prisma migrate (dev)..."
npx prisma migrate dev --name init || true

echo "    Prisma seed..."
npm run db:seed || true

echo "    Post-start complete."