# 🧪 Test Local - FrensChain

## 🚀 Démarrage Rapide

### Option 1 : Script Automatique (Recommandé)

```bash
# Démarrer FrensChain en mode simple
./start-simple.sh
```

### Option 2 : Démarrage Manuel

```bash
# Terminal 1 - Backend
cd backend
npm run dev:simple

# Terminal 2 - Frontend (optionnel)
cd frontend
npm start
```

## 🔍 Tests de l'API

### 1. Health Check
```bash
curl http://localhost:3001/api/health
```

**Réponse attendue :**
```json
{
  "status": "OK",
  "timestamp": "2025-10-01T19:17:14.250Z",
  "message": "FrensChain Backend is running!"
}
```

### 2. Test API
```bash
curl http://localhost:3001/api/test
```

**Réponse attendue :**
```json
{
  "message": "FrensChain API is working!",
  "features": [
    "Authentication with Solana wallets",
    "User profiles and interests",
    "Matching system",
    "Real-time chat",
    "Premium subscriptions",
    "Gamification and badges"
  ],
  "endpoints": {
    "health": "/api/health",
    "test": "/api/test",
    "pricing": "/api/pricing"
  }
}
```

### 3. Pricing API
```bash
curl http://localhost:3001/api/pricing
```

**Réponse attendue :**
```json
{
  "earlyBird": {
    "price": 0.1,
    "currency": "SOL",
    "description": "Abonnement initial (2000 premiers utilisateurs)",
    "duration": "6 mois",
    "features": [
      "Accès premium complet",
      "Chat illimité",
      "Profils étendus",
      "Badges exclusifs"
    ]
  },
  "regular": {
    "price": 0.2,
    "currency": "SOL",
    "description": "Abonnement initial (3000 utilisateurs suivants)",
    "duration": "6 mois",
    "features": [
      "Accès premium complet",
      "Chat illimité",
      "Profils étendus",
      "Badges exclusifs"
    ]
  },
  "monthly": {
    "price": 0.05,
    "currency": "SOL",
    "description": "Abonnement mensuel récurrent",
    "duration": "1 mois",
    "features": [
      "Accès premium complet",
      "Chat illimité",
      "Profils étendus",
      "Badges exclusifs"
    ]
  }
}
```

## 🌐 Test avec le Navigateur

Ouvrez votre navigateur et visitez :

- **Health Check** : http://localhost:3001/api/health
- **Test API** : http://localhost:3001/api/test
- **Pricing** : http://localhost:3001/api/pricing

## 🔌 Test WebSocket

Pour tester les WebSockets, vous pouvez utiliser un client WebSocket ou créer un script de test :

```javascript
// Test WebSocket avec Node.js
const io = require('socket.io-client');

const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('Connecté au serveur WebSocket');
  
  // Rejoindre une room de test
  socket.emit('join_room', { matchId: 'test-match', userId: 'test-user' });
  
  // Envoyer un message de test
  socket.emit('send_message', {
    matchId: 'test-match',
    senderId: 'test-user',
    content: 'Message de test',
    messageType: 'text'
  });
});

socket.on('new_message', (message) => {
  console.log('Message reçu:', message);
});

socket.on('disconnect', () => {
  console.log('Déconnecté du serveur');
});
```

## 📱 Test Frontend (Optionnel)

Si vous voulez tester le frontend React Native :

```bash
# Installer Expo CLI globalement
npm install -g @expo/cli

# Démarrer le frontend
cd frontend
npm start
```

Puis ouvrez http://localhost:3000 dans votre navigateur.

## 🐛 Dépannage

### Port déjà utilisé
```bash
# Trouver le processus utilisant le port 3001
lsof -ti:3001

# Tuer le processus
kill -9 <PID>
```

### Erreur de connexion
```bash
# Vérifier que le backend fonctionne
curl http://localhost:3001/api/health

# Vérifier les logs du backend
# Les logs s'affichent dans le terminal où vous avez lancé npm run dev:simple
```

### Redémarrage
```bash
# Arrêter le backend (Ctrl+C)
# Puis relancer
cd backend
npm run dev:simple
```

## ✅ Checklist de Test

- [ ] Backend démarre sans erreur
- [ ] Health check répond correctement
- [ ] Test API retourne les fonctionnalités
- [ ] Pricing API retourne les prix
- [ ] WebSocket se connecte
- [ ] Messages WebSocket fonctionnent
- [ ] Frontend se connecte au backend (si testé)

## 🎯 Prochaines Étapes

Une fois les tests locaux réussis :

1. **Installer PostgreSQL et Redis** pour les fonctionnalités complètes
2. **Configurer la base de données** avec Prisma
3. **Tester l'authentification** avec des wallets Solana
4. **Déployer sur Solana testnet** pour les paiements réels

## 📚 Documentation Complète

- **Installation** : `INSTALLATION.md`
- **API Documentation** : `docs/API.md`
- **Deployment** : `docs/DEPLOYMENT.md`

Bon test ! 🚀
