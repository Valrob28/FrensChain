#!/bin/bash

echo "🚀 Démarrage de FrensChain en mode simple..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+"
    exit 1
fi

echo "✅ Node.js est installé"

# Démarrer le backend en arrière-plan
echo "🔧 Démarrage du backend..."
cd backend
npm run dev:simple &
BACKEND_PID=$!

# Attendre que le backend démarre
echo "⏳ Attente du démarrage du backend..."
sleep 5

# Vérifier que le backend fonctionne
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend démarré avec succès sur http://localhost:3001"
else
    echo "❌ Erreur lors du démarrage du backend"
    kill $BACKEND_PID
    exit 1
fi

echo ""
echo "🎉 FrensChain est maintenant en cours d'exécution !"
echo ""
echo "📊 Backend API: http://localhost:3001"
echo "🔍 Health Check: http://localhost:3001/api/health"
echo "🧪 Test API: http://localhost:3001/api/test"
echo "💰 Pricing: http://localhost:3001/api/pricing"
echo ""
echo "Pour tester l'API, vous pouvez utiliser :"
echo "curl http://localhost:3001/api/health"
echo "curl http://localhost:3001/api/test"
echo "curl http://localhost:3001/api/pricing"
echo ""
echo "Pour arrêter le backend, appuyez sur Ctrl+C"

# Attendre que l'utilisateur arrête le service
wait
