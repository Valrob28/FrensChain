#!/bin/bash

echo "🚀 Démarrage de FrensChain en local..."

# Vérifier si PostgreSQL est en cours d'exécution
if ! pg_isready -q; then
    echo "❌ PostgreSQL n'est pas en cours d'exécution. Veuillez démarrer PostgreSQL."
    echo "   Sur macOS: brew services start postgresql"
    echo "   Sur Ubuntu: sudo systemctl start postgresql"
    exit 1
fi

# Vérifier si Redis est en cours d'exécution
if ! redis-cli ping > /dev/null 2>&1; then
    echo "❌ Redis n'est pas en cours d'exécution. Veuillez démarrer Redis."
    echo "   Sur macOS: brew services start redis"
    echo "   Sur Ubuntu: sudo systemctl start redis"
    exit 1
fi

echo "✅ PostgreSQL et Redis sont en cours d'exécution"

# Créer la base de données si elle n'existe pas
echo "📦 Configuration de la base de données..."
createdb frenschain 2>/dev/null || echo "Base de données déjà existante"

# Configurer la base de données
cd backend
echo "🔧 Configuration de Prisma..."
npx prisma generate
npx prisma db push

echo "✅ Base de données configurée"

# Démarrer le backend
echo "🚀 Démarrage du backend..."
npm run dev &
BACKEND_PID=$!

# Attendre que le backend démarre
sleep 5

# Démarrer le frontend
echo "🚀 Démarrage du frontend..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ FrensChain est maintenant en cours d'exécution !"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001"
echo "📊 Base de données: PostgreSQL sur localhost:5432"
echo "💾 Cache: Redis sur localhost:6379"
echo ""
echo "Pour arrêter les services, appuyez sur Ctrl+C"

# Attendre que l'utilisateur arrête les services
wait
