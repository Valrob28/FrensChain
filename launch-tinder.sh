#!/bin/bash

echo "🔥 Lancement de FrensChain Tinder - Version Complète"
echo "====================================================="

# Démarrer le backend simplifié en arrière-plan
echo ""
echo "🔍 Vérification du backend..."
cd backend && npm run dev:simple &
BACKEND_PID=$!
cd ..

# Attendre que le backend soit prêt
echo "Attente du démarrage du backend..."
until curl -s http://localhost:3001/api/health > /dev/null; do
  sleep 1
done
echo "✅ Backend opérationnel sur http://localhost:3001"

# Ouvrir l'interface Tinder dans le navigateur
echo ""
echo "🔥 Ouverture de FrensChain Tinder..."
# Détecter le système d'exploitation pour ouvrir le navigateur
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  open simple-web/tinder.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux
  xdg-open simple-web/tinder.html
elif [[ "$OSTYPE" == "cygwin" || "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  # Windows (Git Bash, Cygwin)
  start simple-web/tinder.html
else
  echo "Impossible d'ouvrir automatiquement le navigateur. Veuillez ouvrir manuellement simple-web/tinder.html"
fi

echo ""
echo "🎉 FrensChain Tinder est maintenant accessible !"
echo ""
echo "📊 URLs disponibles :"
echo "   🔥 Interface Tinder: file:///$(pwd)/simple-web/tinder.html"
echo "   🔧 Backend: http://localhost:3001"
echo "   📊 Health: http://localhost:3001/api/health"
echo "   🧪 Test: http://localhost:3001/api/test"
echo "   💰 Pricing: http://localhost:3001/api/pricing"
echo ""
echo "✨ Fonctionnalités Tinder disponibles :"
echo "   - 🔗 Connexion wallet Phantom/Solflare"
echo "   - 🎯 Swipe avec gestes tactiles"
echo "   - 💕 Système de matching"
echo "   - 💬 Chat en temps réel"
echo "   - ✨ Fonctionnalités Premium"
echo "   - 📱 Interface mobile-first"
echo "   - 🎨 Animations fluides"
echo ""
echo "🎯 Comment utiliser :"
echo "   1. Connectez votre wallet"
echo "   2. Swipez à droite pour liker ❤️"
echo "   3. Swipez à gauche pour passer ❌"
echo "   4. Utilisez ⭐ pour Super Like"
echo "   5. Chattez avec vos matches !"
echo ""
echo "Pour arrêter le backend, appuyez sur Ctrl+C"

# Garder le script en vie pour que le backend continue de tourner
wait $BACKEND_PID
