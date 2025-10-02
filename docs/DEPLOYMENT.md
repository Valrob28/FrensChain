# Guide de Déploiement - FrensChain

Ce guide vous explique comment déployer FrensChain en production.

## Prérequis

- Node.js 18+
- Solana CLI
- Anchor CLI
- PostgreSQL
- Redis
- Docker (optionnel)

## Déploiement Local

### 1. Configuration Initiale

```bash
# Cloner le repository
git clone <repository-url>
cd FrensChain-1

# Exécuter le script de configuration
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Configuration des Variables d'Environnement

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/frenschain"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
SOLANA_RPC_URL="https://api.devnet.solana.com"
SOLANA_WS_URL="wss://api.devnet.solana.com"
PROGRAM_ID="Frenschain1111111111111111111111111111111111"
PORT=3001
NODE_ENV="production"
```

#### Frontend (.env)
```env
EXPO_PUBLIC_API_URL="http://localhost:3001"
EXPO_PUBLIC_SOLANA_NETWORK="devnet"
```

### 3. Déploiement des Smart Contracts

```bash
cd smart-contracts

# Build et déploiement
anchor build
anchor deploy --provider.cluster devnet

# Récupérer l'ID du programme
solana address -k target/deploy/frenschain-keypair.json
```

### 4. Configuration de la Base de Données

```bash
cd backend

# Générer le client Prisma
npx prisma generate

# Exécuter les migrations
npx prisma db push

# (Optionnel) Seeder les données initiales
npx prisma db seed
```

### 5. Démarrage des Services

```bash
# Backend
cd backend
npm run dev

# Frontend (dans un autre terminal)
cd frontend
npm start
```

## Déploiement avec Docker

### 1. Configuration Docker Compose

```bash
# Démarrer tous les services
docker-compose up -d

# Vérifier les logs
docker-compose logs -f
```

### 2. Configuration des Volumes

Les volumes Docker sont configurés pour :
- `postgres_data` : Données PostgreSQL
- `redis_data` : Données Redis
- `./backend/uploads` : Images de profil

## Déploiement en Production

### 1. Configuration du Serveur

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation des dépendances
sudo apt install -y nodejs npm postgresql redis-server nginx

# Configuration de PostgreSQL
sudo -u postgres createdb frenschain
sudo -u postgres createuser frenschain
sudo -u postgres psql -c "ALTER USER frenschain PASSWORD 'your_password';"
```

### 2. Configuration Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Configuration SSL (Let's Encrypt)

```bash
# Installation de Certbot
sudo apt install certbot python3-certbot-nginx

# Génération du certificat SSL
sudo certbot --nginx -d your-domain.com
```

### 4. Configuration PM2 (Process Manager)

```bash
# Installation de PM2
npm install -g pm2

# Configuration PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'frenschain-backend',
      script: './backend/dist/index.js',
      cwd: '/path/to/frenschain',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
};
EOF

# Démarrage avec PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Monitoring et Logs

### 1. Logs d'Application

```bash
# Logs PM2
pm2 logs

# Logs Docker
docker-compose logs -f backend

# Logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. Monitoring des Performances

```bash
# Monitoring PM2
pm2 monit

# Monitoring système
htop
iostat -x 1
```

## Sauvegarde et Restauration

### 1. Sauvegarde de la Base de Données

```bash
# Sauvegarde PostgreSQL
pg_dump -h localhost -U frenschain frenschain > backup_$(date +%Y%m%d_%H%M%S).sql

# Sauvegarde Redis
redis-cli --rdb backup_redis_$(date +%Y%m%d_%H%M%S).rdb
```

### 2. Restauration

```bash
# Restauration PostgreSQL
psql -h localhost -U frenschain frenschain < backup_file.sql

# Restauration Redis
redis-cli --pipe < backup_file.rdb
```

## Sécurité

### 1. Configuration du Firewall

```bash
# Configuration UFW
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Configuration SSL/TLS

- Utiliser des certificats SSL valides
- Configurer HTTPS uniquement
- Implémenter HSTS

### 3. Sécurité de l'Application

- Changer tous les mots de passe par défaut
- Utiliser des clés JWT fortes
- Configurer les CORS correctement
- Implémenter la limitation de taux

## Maintenance

### 1. Mises à Jour

```bash
# Mise à jour des dépendances
npm update

# Mise à jour de la base de données
npx prisma migrate deploy
```

### 2. Nettoyage

```bash
# Nettoyage des logs
pm2 flush

# Nettoyage Docker
docker system prune -a
```

## Dépannage

### Problèmes Courants

1. **Erreur de connexion à la base de données**
   - Vérifier les variables d'environnement
   - Vérifier que PostgreSQL est démarré

2. **Erreur de connexion Redis**
   - Vérifier que Redis est démarré
   - Vérifier la configuration Redis

3. **Erreur de déploiement des smart contracts**
   - Vérifier le solde du wallet
   - Vérifier la configuration Solana

### Logs de Debug

```bash
# Logs détaillés
DEBUG=* npm start

# Logs Prisma
DEBUG=prisma:* npm start
```

## Support

Pour plus d'aide, consultez :
- Documentation Solana : https://docs.solana.com/
- Documentation Anchor : https://www.anchor-lang.com/
- Documentation Prisma : https://www.prisma.io/docs/
