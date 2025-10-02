# 🚀 Guide de Déploiement FrensChain

## 📋 Prérequis

### **1. Comptes Requis**
- ✅ **GitHub** - Repository pour le code
- ✅ **Vercel** - Hébergement et déploiement
- ✅ **Solana** - Blockchain (optionnel pour le test)

### **2. Outils Locaux**
```bash
# Node.js (v18+)
node --version

# Git
git --version

# Vercel CLI
npm install -g vercel
```

## 🚀 Déploiement Rapide

### **Option 1: Script Automatique**
```bash
# Exécuter le script de déploiement
./deploy-vercel.sh
```

### **Option 2: Déploiement Manuel**

#### **1. Préparer le Repository**
```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "🚀 Initial commit: FrensChain ready for deployment"

# Créer un repository sur GitHub
# Puis pousser
git remote add origin https://github.com/votre-username/frenschain.git
git push -u origin main
```

#### **2. Déployer sur Vercel**
```bash
# Se connecter à Vercel
vercel login

# Déployer le projet
vercel

# Déploiement de production
vercel --prod
```

## 🔧 Configuration Vercel

### **Fichier vercel.json**
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
    },
    {
      "src": "/home",
      "dest": "/simple-web/home.html"
    },
    {
      "src": "/tinder",
      "dest": "/simple-web/tinder.html"
    }
  ]
}
```

### **Variables d'Environnement**
```bash
# Configurer les variables d'environnement
vercel env add NODE_ENV production
vercel env add PORT 3001
vercel env add SOLANA_RPC_URL https://api.mainnet-beta.solana.com
```

## 📱 URLs de Production

### **Pages Principales**
- **🏠 Accueil**: `https://frenschain.vercel.app/`
- **📱 Création Profil**: `https://frenschain.vercel.app/home`
- **🎯 Interface Tinder**: `https://frenschain.vercel.app/tinder`

### **API Endpoints**
- **🔧 Health Check**: `https://frenschain.vercel.app/api/health`
- **🧪 Test API**: `https://frenschain.vercel.app/api/test`
- **💰 Pricing**: `https://frenschain.vercel.app/api/pricing`

## 🎯 Fonctionnalités Déployées

### **✅ Frontend**
- 📱 **Page d'accueil** avec création de profil
- 🎯 **Interface Tinder** responsive
- 📍 **Géolocalisation** intégrée
- 🎨 **Design Solana** officiel
- 📱 **Mobile-first** design

### **✅ Backend**
- 🔧 **API REST** complète
- 💬 **WebSocket** temps réel
- 🔗 **Intégration Solana**
- 💰 **Paiements SOL**
- 📊 **Analytics** intégrées

### **✅ Blockchain**
- 🔗 **Wallet Connect** (Phantom/Solflare)
- 💰 **Smart Contracts** Anchor
- 🪙 **Paiements SOL** sécurisés
- 🔐 **Authentification** blockchain

## 🔧 Commandes Vercel

### **Gestion du Déploiement**
```bash
# Voir les déploiements
vercel ls

# Logs en temps réel
vercel logs

# Redéployer
vercel --prod

# Rollback
vercel rollback
```

### **Gestion des Domaines**
```bash
# Ajouter un domaine personnalisé
vercel domains add frenschain.com

# Configurer DNS
vercel domains inspect frenschain.com
```

### **Variables d'Environnement**
```bash
# Lister les variables
vercel env ls

# Ajouter une variable
vercel env add VARIABLE_NAME

# Supprimer une variable
vercel env rm VARIABLE_NAME
```

## 📊 Monitoring

### **Analytics Vercel**
- 📈 **Traffic** - Visiteurs et pages vues
- ⚡ **Performance** - Temps de chargement
- 🔍 **Erreurs** - Logs d'erreurs
- 📱 **Devices** - Mobile/Desktop

### **Métriques Personnalisées**
- 👥 **Utilisateurs actifs**
- 💕 **Taux de matching**
- 💬 **Messages échangés**
- 💰 **Conversions premium**

## 🛠️ Maintenance

### **Mises à Jour**
```bash
# Récupérer les dernières modifications
git pull origin main

# Redéployer
vercel --prod
```

### **Backup**
```bash
# Sauvegarder la base de données
# (Si vous utilisez une DB externe)

# Sauvegarder les fichiers
git archive -o frenschain-backup.zip HEAD
```

### **Monitoring**
```bash
# Vérifier le statut
curl https://frenschain.vercel.app/api/health

# Logs d'erreurs
vercel logs --follow
```

## 🚨 Dépannage

### **Problèmes Courants**

#### **1. Erreur de Build**
```bash
# Vérifier les logs
vercel logs

# Rebuild local
npm run build
```

#### **2. Variables d'Environnement**
```bash
# Vérifier les variables
vercel env ls

# Redéployer après modification
vercel --prod
```

#### **3. Performance**
```bash
# Optimiser les images
# Utiliser WebP
# Minifier le CSS/JS
```

### **Support**
- 📧 **Email**: support@frenschain.com
- 💬 **Discord**: [FrensChain Community](https://discord.gg/frenschain)
- 📖 **Docs**: [Documentation](https://frenschain.vercel.app/docs)

## 🎉 Félicitations !

Votre application **FrensChain** est maintenant déployée et accessible au monde entier ! 🌍

### **Prochaines Étapes**
1. 🔗 **Partager** l'URL avec vos utilisateurs
2. 📊 **Monitorer** les métriques de performance
3. 🚀 **Itérer** basé sur les retours utilisateurs
4. 💰 **Monétiser** avec le système premium

---

**FrensChain** - Trouvez vos âmes sœurs crypto dans votre région ! 🔥💜

