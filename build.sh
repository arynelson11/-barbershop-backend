#!/usr/bin/env bash
# Script de build para Render.com

set -e

echo "📦 Instalando dependências..."
npm install

echo "🔨 Gerando cliente Prisma..."
npx prisma generate

echo "🗄️ Executando migrations..."
npx prisma migrate deploy

echo "✅ Build concluído!"
