# 🚀 FrensChain - Test Local

## ✅ Ce qui fonctionne MAINTENANT

### 🔧 Backend API
- ✅ **Health Check** : http://localhost:3001/api/health
- ✅ **Test API** : http://localhost:3001/api/test  
- ✅ **Pricing API** : http://localhost:3001/api/pricing
- ✅ **WebSocket** : Chat temps réel fonctionnel
- ✅ **Rate Limiting** : Protection contre le spam
- ✅ **CORS** : Configuration pour le frontend

### 📱 Frontend React Native
- ✅ **Structure complète** : Navigation, écrans, composants
- ✅ **Wallet Integration** : Phantom wallet adapter
- ✅ **UI/UX** : Interface moderne avec React Native Paper
- ✅ **Context API** : Gestion d'état pour auth et chat
- ✅ **Services** : API client configuré

### 🔗 Smart Contracts
- ✅ **Programme Anchor** : Code Rust complet
- ✅ **Paiements** : Gestion des abonnements SOL
- ✅ **Profils** : Création et gestion des utilisateurs
- ✅ **Matching** : Système de likes et matches

## 🚀 Comment Tester MAINTENANT

### 1. Démarrage Rapide
```bash
# Cloner le projet
cd FrensChain-1

# Démarrer en mode simple (sans base de données)
./start-simple.sh
```

### 2. Tests API
```bash
# Health check
curl http://localhost:3001/api/health

# Test complet
curl http://localhost:3001/api/test

# Prix d'abonnement
curl http://localhost:3001/api/pricing
```

### 3. Test WebSocket
```bash
# Le WebSocket fonctionne pour le chat temps réel
# Connectez-vous via le frontend ou un client WebSocket
```

## 📋 Fonctionnalités Implémentées

### ✅ Authentification
- Connexion avec wallet Solana
- Création de profil utilisateur
- Gestion des sessions JWT
- Vérification des signatures

### ✅ Profils Utilisateurs
- Pseudo et intérêts
- Photo de profil
- Support multi-intérêts
- Système de découverte

### ✅ Matching
- Like/dislike des profils
- Création automatique de matches
- Gestion des likes reçus/envoyés
- Interface de matches

### ✅ Chat Temps Réel
- Messages chiffrés
- WebSocket avec Socket.IO
- Indicateurs de frappe
- Notifications en temps réel

### ✅ Système de Paiement
- Abonnement initial : 0.1 SOL (2000 premiers) / 0.2 SOL (3000 suivants)
- Abonnement mensuel : 0.05 SOL/mois
- Smart contract Anchor
- Vérification des transactions

### ✅ Gamification
- Système de badges
- Leaderboard des referrers
- Parrainage avec récompenses
- Missions et achievements

## 🏗️ Architecture Technique

### Frontend (React Native)
```
frontend/
├── src/
│   ├── screens/          # Écrans de l'app
│   ├── navigation/       # Navigation
│   ├── contexts/         # Gestion d'état
│   ├── services/         # API client
│   └── components/       # Composants réutilisables
├── App.tsx              # Point d'entrée
└── package.json         # Dépendances
```

### Backend (Node.js)
```
backend/
├── src/
│   ├── routes/          # Routes API
│   ├── services/        # Services métier
│   ├── middleware/      # Middleware
│   └── utils/           # Utilitaires
├── prisma/              # Schéma base de données
└── package.json         # Dépendances
```

### Smart Contracts (Anchor)
```
smart-contracts/
├── programs/
│   └── frenschain/      # Programme Solana
├── tests/              # Tests
└── Cargo.toml          # Dépendances Rust
```

## 🔧 Configuration Requise

### Pour le Test Simple (ACTUEL)
- ✅ Node.js 18+
- ✅ npm/yarn

### Pour les Fonctionnalités Complètes
- 📦 PostgreSQL (base de données)
- 📦 Redis (cache et sessions)
- 📦 Solana CLI (smart contracts)
- 📦 Anchor CLI (déploiement)

## 📊 Endpoints API Disponibles

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/health` | GET | Statut du serveur |
| `/api/test` | GET | Test des fonctionnalités |
| `/api/pricing` | GET | Prix d'abonnement |
| `/api/auth/*` | POST/GET | Authentification |
| `/api/user/*` | GET/PUT | Gestion des profils |
| `/api/match/*` | GET/POST | Système de matching |
| `/api/chat/*` | GET/POST | Chat et messages |
| `/api/payment/*` | POST/GET | Paiements et abonnements |
| `/api/gamification/*` | GET/POST | Badges et gamification |

## 🌐 WebSocket Events

| Event | Description |
|-------|-------------|
| `join_room` | Rejoindre une conversation |
| `leave_room` | Quitter une conversation |
| `send_message` | Envoyer un message |
| `typing_start` | Commencer à taper |
| `typing_stop` | Arrêter de taper |
| `new_message` | Nouveau message reçu |
| `user_typing` | Utilisateur en train de taper |

## 🎯 Prochaines Étapes

### 1. Test Complet (avec base de données)
```bash
# Installer PostgreSQL et Redis
# Puis lancer le backend complet
cd backend
npm run dev
```

### 2. Test Frontend
```bash
# Démarrer le frontend React Native
cd frontend
npm start
```

### 3. Déploiement Smart Contracts
```bash
# Déployer sur Solana testnet
cd smart-contracts
anchor build
anchor deploy --provider.cluster testnet
```

## 📚 Documentation

- **Test Local** : `TEST-LOCAL.md`
- **Installation** : `INSTALLATION.md`
- **API Docs** : `docs/API.md`
- **Deployment** : `docs/DEPLOYMENT.md`

## 🚀 Démarrage Immédiat

```bash
# 1. Démarrer le backend
./start-simple.sh

# 2. Tester l'API
curl http://localhost:3001/api/health

# 3. Ouvrir dans le navigateur
open http://localhost:3001/api/test
```

**FrensChain est prêt à être testé ! 🎉**
