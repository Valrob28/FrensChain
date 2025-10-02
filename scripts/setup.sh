#!/bin/bash

# Script de configuration pour FrensChain
echo "🚀 Configuration de FrensChain..."

# Vérifier les prérequis
echo "📋 Vérification des prérequis..."

# Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+"
    exit 1
fi

# npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

# Solana CLI
if ! command -v solana &> /dev/null; then
    echo "📦 Installation de Solana CLI..."
    sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
fi

# Anchor CLI
if ! command -v anchor &> /dev/null; then
    echo "📦 Installation d'Anchor CLI..."
    npm install -g @coral-xyz/anchor-cli
fi

# Rust
if ! command -v rustc &> /dev/null; then
    echo "📦 Installation de Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    source $HOME/.cargo/env
fi

# PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL n'est pas installé. Veuillez installer PostgreSQL"
    exit 1
fi

# Redis
if ! command -v redis-server &> /dev/null; then
    echo "❌ Redis n'est pas installé. Veuillez installer Redis"
    exit 1
fi

echo "✅ Tous les prérequis sont installés"

# Configuration des variables d'environnement
echo "🔧 Configuration des variables d'environnement..."

# Backend
if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo "📝 Fichier .env créé pour le backend"
fi

# Frontend
if [ ! -f "frontend/.env" ]; then
    cat > frontend/.env << EOF
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_SOLANA_NETWORK=devnet
EOF
    echo "📝 Fichier .env créé pour le frontend"
fi

# Installation des dépendances
echo "📦 Installation des dépendances..."

# Backend
echo "📦 Installation des dépendances backend..."
cd backend
npm install
cd ..

# Frontend
echo "📦 Installation des dépendances frontend..."
cd frontend
npm install
cd ..

# Smart contracts
echo "📦 Installation des dépendances smart contracts..."
cd smart-contracts
npm install
cd ..

# Configuration de la base de données
echo "🗄️ Configuration de la base de données..."

# Créer la base de données
createdb frenschain 2>/dev/null || echo "Base de données déjà existante"

# Exécuter les migrations
cd backend
npx prisma generate
npx prisma db push
cd ..

echo "✅ Configuration terminée !"
echo ""
echo "🚀 Pour démarrer l'application :"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm start"
echo "3. Smart contracts: cd smart-contracts && anchor build && anchor deploy"
echo ""
echo "📚 Documentation complète dans le dossier docs/"
