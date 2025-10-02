#!/bin/bash

echo "🚀 Déploiement FrensChain - Configuration Optimisée"
echo "=================================================="

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "📦 Installation de Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🔧 Configuration optimisée pour Vercel..."

# Créer un fichier de configuration spécifique
cat > vercel-deploy.json << EOF
{
  "name": "frenschain-dating-app",
  "version": 2,
  "framework": "vanilla",
  "buildCommand": "echo 'Static files - no build required'",
  "outputDirectory": "simple-web",
  "installCommand": "echo 'No dependencies to install'",
  "builds": [
    {
      "src": "simple-web/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/",
      "dest": "/simple-web/home.html"
    },
    {
      "src": "/home",
      "dest": "/simple-web/home.html"
    },
    {
      "src": "/tinder",
      "dest": "/simple-web/tinder.html"
    },
    {
      "src": "/index",
      "dest": "/simple-web/index.html"
    }
  ]
}
EOF

echo "✅ Configuration Vercel créée"

# Vérifier les fichiers essentiels
echo ""
echo "📁 Vérification des fichiers..."

essential_files=(
    "simple-web/home.html"
    "simple-web/tinder.html"
    "simple-web/index.html"
    "package.json"
)

for file in "${essential_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MANQUANT"
        exit 1
    fi
done

echo ""
echo "🌐 Déploiement sur Vercel..."

# Déployer avec la configuration optimisée
vercel --prod --yes

echo ""
echo "🎉 Déploiement terminé !"
echo ""
echo "📊 URLs disponibles :"
echo "   🌐 Production: https://frenschain-dating-app.vercel.app"
echo "   🏠 Homepage: https://frenschain-dating-app.vercel.app/home"
echo "   🔥 Tinder: https://frenschain-dating-app.vercel.app/tinder"
echo "   📱 Index: https://frenschain-dating-app.vercel.app/index"
echo ""
echo "✨ Fonctionnalités déployées :"
echo "   - 📱 Création de profil avec géolocalisation"
echo "   - 🎯 Interface Tinder responsive"
echo "   - 💬 Chat en temps réel"
echo "   - 💰 Paiements SOL"
echo "   - 🔗 Intégration wallet Solana"
echo "   - 📊 Analytics et debug"
echo "   - 🎨 Design Solana officiel"
echo ""
echo "🎯 Votre application FrensChain est maintenant en ligne !"

