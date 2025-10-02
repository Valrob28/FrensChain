#!/bin/bash

echo "🏠 Lancement de FrensChain - Page d'Accueil"
echo "============================================="

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

# Ouvrir la page d'accueil dans le navigateur
echo ""
echo "🏠 Ouverture de la page d'accueil..."
# Détecter le système d'exploitation pour ouvrir le navigateur
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  open simple-web/home.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux
  xdg-open simple-web/home.html
elif [[ "$OSTYPE" == "cygwin" || "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  # Windows (Git Bash, Cygwin)
  start simple-web/home.html
else
  echo "Impossible d'ouvrir automatiquement le navigateur. Veuillez ouvrir manuellement simple-web/home.html"
fi

echo ""
echo "🎉 FrensChain Accueil est maintenant accessible !"
echo ""
echo "📊 URLs disponibles :"
echo "   🏠 Page d'Accueil: file:///$(pwd)/simple-web/home.html"
echo "   🔥 Interface Tinder: file:///$(pwd)/simple-web/tinder.html"
echo "   🔧 Backend: http://localhost:3001"
echo "   📊 Health: http://localhost:3001/api/health"
echo "   🧪 Test: http://localhost:3001/api/test"
echo "   💰 Pricing: http://localhost:3001/api/pricing"
echo ""
echo "✨ Fonctionnalités de la page d'accueil :"
echo "   - 📱 Création de profil complète"
echo "   - 📍 Géolocalisation et utilisateurs proches"
echo "   - 🎯 Système de matching local"
echo "   - 📊 Statistiques en temps réel"
echo "   - 🎨 Design Solana officiel"
echo "   - 📱 Interface responsive"
echo ""
echo "🎯 Comment utiliser :"
echo "   1. Créez votre profil avec vos intérêts"
echo "   2. Activez la géolocalisation"
echo "   3. Découvrez les utilisateurs à proximité"
echo "   4. Likez et matchez avec vos voisins !"
echo ""
echo "Pour arrêter le backend, appuyez sur Ctrl+C"

# Garder le script en vie pour que le backend continue de tourner
wait $BACKEND_PID
