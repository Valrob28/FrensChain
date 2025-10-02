#!/bin/bash

echo "🚀 Déploiement FrensChain sur Vercel"
echo "====================================="

# Vérifier si Git est configuré
if ! git config user.name > /dev/null 2>&1; then
    echo "⚠️  Configuration Git requise"
    echo "Veuillez configurer Git avec vos informations :"
    echo "git config --global user.name 'Votre Nom'"
    echo "git config --global user.email 'votre@email.com'"
    exit 1
fi

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "📦 Installation de Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🔧 Préparation du déploiement..."

# Créer un repository GitHub si nécessaire
if ! git remote -v | grep -q origin; then
    echo ""
    echo "📝 Création du repository GitHub..."
    echo "1. Allez sur https://github.com/new"
    echo "2. Créez un nouveau repository nommé 'frenschain'"
    echo "3. Copiez l'URL du repository"
    echo ""
    read -p "Entrez l'URL de votre repository GitHub: " REPO_URL
    
    if [ ! -z "$REPO_URL" ]; then
        git remote add origin $REPO_URL
        echo "✅ Repository GitHub configuré"
    else
        echo "⚠️  Pas de repository GitHub configuré"
    fi
fi

# Pousser vers GitHub
echo ""
echo "📤 Push vers GitHub..."
git add .
git commit -m "🚀 Deploy: FrensChain ready for Vercel deployment

✨ Production-ready features:
- 📱 Complete profile creation with geolocation
- 🎯 Tinder-like swipe interface
- 💬 Real-time chat system
- 💰 SOL payment integration
- 🔗 Solana wallet support
- 📊 Analytics and debug tools
- 🎨 Official Solana design
- 📱 Mobile-responsive

🛠️ Tech Stack:
- Frontend: HTML5/CSS3/JavaScript
- Backend: Node.js/Express/TypeScript
- Blockchain: Solana/Anchor
- Real-time: Socket.IO
- Deployment: Vercel-ready

🎯 Ready for production!"
git push -u origin main

echo ""
echo "🌐 Déploiement sur Vercel..."

# Déployer sur Vercel
vercel --prod

echo ""
echo "🎉 Déploiement terminé !"
echo ""
echo "📊 URLs disponibles :"
echo "   🌐 Production: https://frenschain.vercel.app"
echo "   🏠 Homepage: https://frenschain.vercel.app/home"
echo "   🔥 Tinder: https://frenschain.vercel.app/tinder"
echo "   🔧 API: https://frenschain.vercel.app/api"
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
echo "   vercel logs          # Voir les logs"
echo "   vercel domains       # Gérer les domaines"
echo "   vercel env           # Variables d'environnement"
echo ""
echo "🎯 Votre application FrensChain est maintenant en ligne !"

