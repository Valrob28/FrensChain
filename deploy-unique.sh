#!/bin/bash

echo "🚀 Déploiement FrensChain avec nom unique"
echo "======================================="

# Générer un nom unique basé sur la date
TIMESTAMP=$(date +%Y%m%d%H%M%S)
PROJECT_NAME="frenschain-dating-${TIMESTAMP}"

echo "📝 Nom du projet: $PROJECT_NAME"

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "📦 Installation de Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🔧 Préparation du déploiement..."

# Créer un fichier .vercelignore si nécessaire
if [ ! -f ".vercelignore" ]; then
    cat > .vercelignore << EOF
node_modules
.git
.env
*.log
coverage
.nyc_output
EOF
    echo "✅ .vercelignore créé"
fi

# Vérifier que tous les fichiers sont présents
echo ""
echo "📁 Vérification des fichiers essentiels..."

essential_files=(
    "simple-web/home.html"
    "simple-web/tinder.html"
    "simple-web/index.html"
    "backend/src/index-simple.ts"
    "package.json"
    "vercel.json"
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

# Déployer avec un nom de projet unique
vercel --name "$PROJECT_NAME" --yes

echo ""
echo "🎉 Déploiement terminé !"
echo ""
echo "📊 URLs disponibles :"
echo "   🌐 Production: https://$PROJECT_NAME.vercel.app"
echo "   🏠 Homepage: https://$PROJECT_NAME.vercel.app/home"
echo "   🔥 Tinder: https://$PROJECT_NAME.vercel.app/tinder"
echo "   🔧 API: https://$PROJECT_NAME.vercel.app/api"
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
echo "🔧 Commandes utiles :"
echo "   vercel ls                    # Voir tous les projets"
echo "   vercel logs                   # Voir les logs"
echo "   vercel domains               # Gérer les domaines"
echo "   vercel env                    # Variables d'environnement"
echo ""
echo "🎯 Votre application FrensChain est maintenant en ligne !"
echo "🔗 URL: https://$PROJECT_NAME.vercel.app"

