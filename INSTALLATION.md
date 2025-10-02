# 📦 Guide d'Installation - FrensChain

## 🖥️ Prérequis Système

### macOS

```bash
# Installer Homebrew (si pas déjà installé)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installer les dépendances
brew install node postgresql redis

# Démarrer les services
brew services start postgresql
brew services start redis
```

### Ubuntu/Debian

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer PostgreSQL
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Installer Redis
sudo apt-get install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### Windows

1. **Node.js** : Télécharger depuis [nodejs.org](https://nodejs.org/)
2. **PostgreSQL** : Télécharger depuis [postgresql.org](https://www.postgresql.org/)
3. **Redis** : Utiliser WSL2 ou Docker Desktop

## 🐳 Alternative avec Docker

Si vous préférez utiliser Docker :

```bash
# Installer Docker Desktop
# macOS: https://docs.docker.com/desktop/mac/install/
# Windows: https://docs.docker.com/desktop/windows/install/
# Ubuntu: https://docs.docker.com/engine/install/ubuntu/

# Démarrer les services avec Docker Compose
docker-compose up -d postgres redis
```

## 🔧 Configuration de la Base de Données

### PostgreSQL

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer un utilisateur et une base de données
CREATE USER frenschain WITH PASSWORD 'frenschain';
CREATE DATABASE frenschain OWNER frenschain;
GRANT ALL PRIVILEGES ON DATABASE frenschain TO frenschain;

# Quitter
\q
```

### Redis

```bash
# Vérifier que Redis fonctionne
redis-cli ping
# Devrait répondre: PONG
```

## 🚀 Installation du Projet

```bash
# Cloner le projet
git clone <repository-url>
cd FrensChain-1

# Installer les dépendances
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Smart contracts
cd ../smart-contracts
npm install
```

## ⚙️ Configuration

### Variables d'Environnement

#### Backend (.env)
```env
DATABASE_URL="postgresql://frenschain:frenschain@localhost:5432/frenschain"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="frenschain-super-secret-jwt-key-for-development"
JWT_EXPIRES_IN="7d"
SOLANA_RPC_URL="https://api.devnet.solana.com"
SOLANA_WS_URL="wss://api.devnet.solana.com"
PROGRAM_ID="Frenschain1111111111111111111111111111111111"
PORT=3001
NODE_ENV="development"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL="info"
```

#### Frontend (.env)
```env
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_SOLANA_NETWORK=devnet
```

## 🗄️ Configuration de la Base de Données

```bash
cd backend

# Générer le client Prisma
npx prisma generate

# Créer les tables
npx prisma db push

# (Optionnel) Seeder des données de test
npx prisma db seed
```

## 🧪 Test de l'Installation

### Vérifier les Services

```bash
# PostgreSQL
pg_isready
# Devrait afficher: /tmp/.s.PGSQL.5432: accept connections

# Redis
redis-cli ping
# Devrait afficher: PONG

# Node.js
node --version
# Devrait afficher: v18.x.x ou plus récent
```

### Test du Backend

```bash
cd backend
npm run dev
# Devrait démarrer sur http://localhost:3001
```

### Test du Frontend

```bash
cd frontend
npm start
# Devrait démarrer sur http://localhost:3000
```

## 🐛 Dépannage

### Erreurs Courantes

#### PostgreSQL
```bash
# Erreur: "database does not exist"
createdb frenschain

# Erreur: "role does not exist"
sudo -u postgres createuser frenschain
sudo -u postgres psql -c "ALTER USER frenschain PASSWORD 'frenschain';"
```

#### Redis
```bash
# Erreur: "Connection refused"
sudo systemctl start redis-server
# ou
brew services start redis
```

#### Node.js
```bash
# Erreur: "command not found"
# Vérifier l'installation
which node
which npm

# Réinstaller si nécessaire
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### Ports Occupés
```bash
# Trouver le processus utilisant le port
lsof -ti:3001
lsof -ti:3000
lsof -ti:5432
lsof -ti:6379

# Tuer le processus
kill -9 <PID>
```

### Logs de Debug

```bash
# Backend
cd backend
DEBUG=* npm run dev

# Frontend
cd frontend
DEBUG=* npm start
```

## 🚀 Démarrage Rapide

Une fois tout installé :

```bash
# Script automatique
./start-local.sh

# Ou manuellement
cd backend && npm run dev &
cd frontend && npm start
```

## 📱 Accès

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3001
- **Health Check** : http://localhost:3001/health

## 🎯 Prochaines Étapes

1. **Tester l'application** : Créer un compte et tester les fonctionnalités
2. **Configurer Solana** : Installer Solana CLI et configurer un wallet
3. **Déployer les smart contracts** : Sur Solana devnet
4. **Tester les paiements** : Avec des SOL de test

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez que tous les prérequis sont installés
2. Vérifiez les logs d'erreur
3. Consultez la documentation complète dans `/docs/`
4. Redémarrez tous les services

Bon développement ! 🚀
