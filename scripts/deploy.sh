#!/bin/bash

# Script de déploiement pour FrensChain
echo "🚀 Déploiement de FrensChain..."

# Vérifier les variables d'environnement
if [ -z "$SOLANA_NETWORK" ]; then
    echo "❌ Variable SOLANA_NETWORK non définie. Utilisation de devnet par défaut"
    export SOLANA_NETWORK=devnet
fi

# Configuration du réseau Solana
echo "🔧 Configuration du réseau Solana ($SOLANA_NETWORK)..."
solana config set --url https://api.$SOLANA_NETWORK.solana.com

# Vérifier le solde du wallet
echo "💰 Vérification du solde du wallet..."
BALANCE=$(solana balance)
echo "Solde actuel: $BALANCE SOL"

if [ "$SOLANA_NETWORK" = "devnet" ]; then
    echo "🪙 Demande d'airdrop pour devnet..."
    solana airdrop 2
fi

# Déploiement des smart contracts
echo "📦 Déploiement des smart contracts..."
cd smart-contracts

# Build du programme
echo "🔨 Compilation du programme..."
anchor build

# Déploiement
echo "🚀 Déploiement sur $SOLANA_NETWORK..."
anchor deploy --provider.cluster $SOLANA_NETWORK

# Récupérer l'ID du programme déployé
PROGRAM_ID=$(solana address -k target/deploy/frenschain-keypair.json)
echo "✅ Programme déployé avec l'ID: $PROGRAM_ID"

cd ..

# Configuration des variables d'environnement pour le déploiement
echo "🔧 Configuration des variables d'environnement..."

# Mettre à jour le fichier .env du backend
if [ -f "backend/.env" ]; then
    sed -i.bak "s/PROGRAM_ID=.*/PROGRAM_ID=$PROGRAM_ID/" backend/.env
    sed -i.bak "s/SOLANA_RPC_URL=.*/SOLANA_RPC_URL=https:\/\/api.$SOLANA_NETWORK.solana.com/" backend/.env
    echo "✅ Variables d'environnement backend mises à jour"
fi

# Mettre à jour le fichier .env du frontend
if [ -f "frontend/.env" ]; then
    sed -i.bak "s/EXPO_PUBLIC_SOLANA_NETWORK=.*/EXPO_PUBLIC_SOLANA_NETWORK=$SOLANA_NETWORK/" frontend/.env
    echo "✅ Variables d'environnement frontend mises à jour"
fi

# Build de l'application
echo "🔨 Build de l'application..."

# Backend
echo "📦 Build du backend..."
cd backend
npm run build
cd ..

# Frontend
echo "📦 Build du frontend..."
cd frontend
npm run build
cd ..

echo "✅ Déploiement terminé !"
echo ""
echo "📋 Informations de déploiement :"
echo "- Réseau: $SOLANA_NETWORK"
echo "- Programme ID: $PROGRAM_ID"
echo "- Backend: Prêt pour le déploiement"
echo "- Frontend: Prêt pour le déploiement"
echo ""
echo "🚀 Pour démarrer l'application en production :"
echo "1. Backend: cd backend && npm start"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "📚 Consultez la documentation pour plus d'informations sur le déploiement en production"
