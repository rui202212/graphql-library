#!/usr/bin/env bash
set -euo pipefail

echo "Post-start command running..."
echo "Post-start    Installing runtimes with Mise..."
mise trust --yes
mise install --yes

echo "Post-start    Installing npm deps..."
cd /workspace
npm ci || npm install

echo "Post-start    Waiting for MariaDB to be ready..."
# Quick wait loop using nc
for i in {1..60}; do
  if nc -zv db 3306 2>/dev/null; then
    echo "Post-start    MariaDB is up."
    break
  fi
  echo "Post-start    Waiting... ($i/60)"
  sleep 2
done

echo "Post-start    Prisma generate..."
npx prisma generate || true

echo "Post-start    Prisma migrate (dev)..."
npx prisma migrate dev --name init || true

echo "Post-start    Prisma seed..."
npm run db:seed || true

echo "Post-start    Post-start complete."