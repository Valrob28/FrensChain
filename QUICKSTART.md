# 🚀 Guide de Démarrage Rapide - FrensChain

## Prérequis

Assurez-vous d'avoir installé :

- **Node.js 18+** : [nodejs.org](https://nodejs.org/)
- **PostgreSQL** : [postgresql.org](https://www.postgresql.org/)
- **Redis** : [redis.io](https://redis.io/)

### Installation des prérequis (macOS)

```bash
# Node.js
brew install node

# PostgreSQL
brew install postgresql
brew services start postgresql

# Redis
brew install redis
brew services start redis
```

### Installation des prérequis (Ubuntu/Debian)

```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Redis
sudo apt-get install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

## 🚀 Démarrage Rapide

### Option 1 : Script Automatique (Recommandé)

```bash
# Cloner et naviguer vers le projet
cd FrensChain-1

# Lancer le script de démarrage
./start-local.sh
```

### Option 2 : Démarrage Manuel

#### 1. Configuration de la Base de Données

```bash
# Créer la base de données
createdb frenschain

# Configurer Prisma
cd backend
npx prisma generate
npx prisma db push
```

#### 2. Démarrer le Backend

```bash
cd backend
npm run dev
```

#### 3. Démarrer le Frontend (nouveau terminal)

```bash
cd frontend
npm start
```

## 📱 Accès à l'Application

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3001
- **API Documentation** : http://localhost:3001/api

## 🔧 Configuration

### Variables d'Environnement

#### Backend (.env)
```env
DATABASE_URL="postgresql://frenschain:frenschain@localhost:5432/frenschain"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="frenschain-super-secret-jwt-key-for-development"
PORT=3001
```

#### Frontend (.env)
```env
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_SOLANA_NETWORK=devnet
```

## 🧪 Test de l'Application

### 1. Créer un Compte

1. Ouvrez http://localhost:3000
2. Connectez votre wallet Phantom
3. Créez un profil avec vos intérêts

### 2. Tester le Matching

1. Découvrez d'autres profils
2. Likez des utilisateurs
3. Créez des matches

### 3. Tester le Chat

1. Une fois un match créé
2. Ouvrez la conversation
3. Envoyez des messages

### 4. Tester les Paiements

1. Accédez à la section Premium
2. Testez l'abonnement (simulation)
3. Vérifiez le statut premium

## 🐛 Dépannage

### Problèmes Courants

#### PostgreSQL ne démarre pas
```bash
# macOS
brew services restart postgresql

# Ubuntu
sudo systemctl restart postgresql
```

#### Redis ne démarre pas
```bash
# macOS
brew services restart redis

# Ubuntu
sudo systemctl restart redis-server
```

#### Port déjà utilisé
```bash
# Trouver le processus utilisant le port
lsof -ti:3001
lsof -ti:3000

# Tuer le processus
kill -9 <PID>
```

#### Erreur de base de données
```bash
# Réinitialiser la base de données
cd backend
npx prisma db push --force-reset
```

## 📊 Monitoring

### Logs Backend
```bash
cd backend
npm run dev
# Les logs s'affichent dans le terminal
```

### Logs Frontend
```bash
cd frontend
npm start
# Ouvrez http://localhost:3000 dans votre navigateur
```

### Base de Données
```bash
# Accéder à PostgreSQL
psql frenschain

# Voir les tables
\dt

# Quitter
\q
```

## 🔄 Redémarrage

Pour redémarrer l'application :

1. Arrêtez les processus (Ctrl+C)
2. Relancez `./start-local.sh`

## 📚 Documentation Complète

- **API Documentation** : `/docs/API.md`
- **Deployment Guide** : `/docs/DEPLOYMENT.md`
- **Smart Contracts** : `/smart-contracts/`

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez que tous les prérequis sont installés
2. Vérifiez que PostgreSQL et Redis sont en cours d'exécution
3. Consultez les logs d'erreur
4. Redémarrez les services

## 🎯 Prochaines Étapes

Une fois l'application lancée :

1. **Testez toutes les fonctionnalités**
2. **Déployez sur Solana testnet**
3. **Configurez un wallet de test**
4. **Testez les paiements réels**

Bon développement ! 🚀
