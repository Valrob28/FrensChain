#!/bin/bash

echo "🚀 Lancement de FrensChain - Version Simple"
echo "============================================="
echo ""

# Vérifier si le backend fonctionne
echo "🔍 Vérification du backend..."
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Backend opérationnel sur http://localhost:3001"
else
    echo "❌ Backend non disponible. Démarrage du backend..."
    cd backend
    npm run dev:simple &
    BACKEND_PID=$!
    echo "⏳ Attente du démarrage du backend..."
    sleep 5
    
    if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
        echo "✅ Backend démarré avec succès"
    else
        echo "❌ Impossible de démarrer le backend"
        exit 1
    fi
fi

echo ""
echo "🌐 Ouverture de l'interface web..."
echo ""

# Ouvrir le fichier HTML dans le navigateur
if command -v open &> /dev/null; then
    # macOS
    open simple-web/index.html
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open simple-web/index.html
elif command -v start &> /dev/null; then
    # Windows
    start simple-web/index.html
else
    echo "📱 Ouvrez manuellement le fichier :"
    echo "   file://$(pwd)/simple-web/index.html"
fi

echo ""
echo "🎉 FrensChain est maintenant accessible !"
echo ""
echo "📊 URLs disponibles :"
echo "   🌐 Interface: file://$(pwd)/simple-web/index.html"
echo "   🔧 Backend: http://localhost:3001"
echo "   📊 Health: http://localhost:3001/api/health"
echo "   🧪 Test: http://localhost:3001/api/test"
echo "   💰 Pricing: http://localhost:3001/api/pricing"
echo ""
echo "✨ Fonctionnalités disponibles :"
echo "   - Interface web moderne et responsive"
echo "   - Vérification automatique du backend"
echo "   - Test des APIs en temps réel"
echo "   - Interface pour les paiements SOL"
echo "   - Design mobile-friendly"
echo ""
echo "Pour arrêter le backend, appuyez sur Ctrl+C"
