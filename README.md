# 🔥 FrensChain

Application de rencontre et communautés multi-intérêts basée sur Solana avec géolocalisation.

## ✨ Fonctionnalités

### 🎯 **Système de Matching**
- **Swipe Tinder-like** - Interface intuitive
- **Géolocalisation** - Utilisateurs à proximité
- **Chat en temps réel** - Messages chiffrés
- **Système freemium/premium** - Paiements en SOL

### 🔗 **Blockchain Solana**
- **Wallet Connect** - Phantom, Solflare
- **Paiements SOL** - Smart contracts Anchor
- **NFTs** - Profils uniques
- **DeFi** - Intégration DeFi

### 📱 **Interface Moderne**
- **Design Solana** - Couleurs officielles
- **Responsive** - Mobile/Desktop
- **PWA** - Application progressive
- **Offline** - Fonctionnement hors ligne

## 🚀 Déploiement

### **Vercel (Recommandé)**
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Déploiement de production
vercel --prod
```

### **Local Development**
```bash
# Cloner le projet
git clone <repository-url>
cd frenschain

# Installer les dépendances
npm install

# Démarrer le backend
cd backend && npm install && npm run dev:simple

# Ouvrir l'interface
open simple-web/home.html
```

## 📁 Structure du Projet

```
frenschain/
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── index-simple.ts # Serveur Express
│   │   └── routes/         # Routes API
│   └── package.json
├── simple-web/             # Frontend Web
│   ├── home.html          # Page d'accueil
│   ├── tinder.html        # Interface Tinder
│   └── index.html         # Interface simple
├── smart-contracts/        # Smart contracts Anchor
├── scripts/               # Scripts de déploiement
└── docs/                  # Documentation
```

## 🛠️ Technologies

### **Frontend**
- **HTML5/CSS3** - Interface moderne
- **JavaScript ES6+** - Logique client
- **Tailwind CSS** - Framework CSS
- **PWA** - Application progressive

### **Backend**
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Socket.IO** - WebSocket temps réel
- **TypeScript** - Typage statique

### **Blockchain**
- **Solana** - Blockchain principale
- **Anchor** - Framework Rust
- **Web3.js** - Interactions blockchain
- **Phantom/Solflare** - Wallets

## 📊 API Endpoints

### **Health & Status**
- `GET /api/health` - Statut du serveur
- `GET /api/test` - Test de l'API
- `GET /api/pricing` - Tarifs premium

### **User Management**
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/user/profile` - Profil utilisateur

### **Matching System**
- `GET /api/matches` - Liste des matches
- `POST /api/matches/like` - Liker un profil
- `POST /api/matches/pass` - Passer un profil

### **Chat System**
- `GET /api/chat/:matchId` - Messages d'un match
- `POST /api/chat/send` - Envoyer un message
- `WebSocket /chat` - Chat temps réel

## 🔧 Configuration

### **Variables d'Environnement**
```env
# Backend
PORT=3001
NODE_ENV=production

# Solana
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_NETWORK=mainnet-beta

# Database (optionnel)
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

### **Vercel Configuration**
```json
{
  "version": 2,
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
    }
  ]
}
```

## 🎯 Utilisation

### **1. Création de Profil**
- Accédez à la page d'accueil
- Remplissez vos informations
- Sélectionnez vos intérêts
- Activez la géolocalisation

### **2. Découverte**
- Parcourez les profils à proximité
- Swipez pour liker ou passer
- Géolocalisation automatique
- Filtres par intérêts

### **3. Matching**
- Système de matching intelligent
- Chat en temps réel
- Notifications push
- Système premium

### **4. Premium**
- Likes illimités
- Super Likes
- Filtres avancés
- Profils prioritaires

## 📱 PWA Features

### **Installation**
- Ajout à l'écran d'accueil
- Icône personnalisée
- Splash screen
- Mode hors ligne

### **Notifications**
- Nouvelles matches
- Messages reçus
- Rappels premium
- Notifications push

## 🔒 Sécurité

### **Données**
- Chiffrement des messages
- Protection des données personnelles
- Conformité RGPD
- Authentification sécurisée

### **Blockchain**
- Smart contracts audités
- Paiements sécurisés
- Wallet integration
- Transactions vérifiées

## 📈 Analytics

### **Métriques**
- Utilisateurs actifs
- Taux de matching
- Engagement chat
- Conversions premium

### **Monitoring**
- Performance API
- Erreurs système
- Utilisation blockchain
- Statistiques utilisateurs

## 🤝 Contribution

### **Développement**
1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

### **Tests**
```bash
# Tests unitaires
npm test

# Tests d'intégration
npm run test:integration

# Tests E2E
npm run test:e2e
```

## 📄 Licence

MIT License - Voir [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

### **Documentation**
- [Guide d'utilisation](docs/USER_GUIDE.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

### **Contact**
- **Email**: support@frenschain.com
- **Discord**: [FrensChain Community](https://discord.gg/frenschain)
- **Twitter**: [@FrensChain](https://twitter.com/frenschain)

---

**FrensChain** - Trouvez vos âmes sœurs crypto dans votre région ! 🔥💜