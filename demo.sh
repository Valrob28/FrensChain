#!/bin/bash

echo "🎬 Démonstration de FrensChain"
echo "================================"
echo ""

# Vérifier que le backend fonctionne
echo "🔍 Vérification du backend..."
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend opérationnel"
else
    echo "❌ Backend non disponible. Lancez d'abord : ./start-simple.sh"
    exit 1
fi

echo ""
echo "📊 Test des endpoints API :"
echo ""

# Health Check
echo "1. Health Check :"
curl -s http://localhost:3001/api/health | jq .
echo ""

# Test API
echo "2. Test API :"
curl -s http://localhost:3001/api/test | jq .
echo ""

# Pricing
echo "3. Pricing API :"
curl -s http://localhost:3001/api/pricing | jq .
echo ""

echo "🎉 Démonstration terminée !"
echo ""
echo "📱 Pour tester le frontend :"
echo "   cd frontend && npm start"
echo ""
echo "🔧 Pour les fonctionnalités complètes :"
echo "   1. Installer PostgreSQL et Redis"
echo "   2. cd backend && npm run dev"
echo "   3. cd frontend && npm start"
echo ""
echo "📚 Documentation :"
echo "   - TEST-LOCAL.md : Tests détaillés"
echo "   - INSTALLATION.md : Installation complète"
echo "   - docs/API.md : Documentation API"
