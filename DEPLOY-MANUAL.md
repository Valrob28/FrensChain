# 🚀 Déploiement Manuel FrensChain

## 📋 Étapes de Déploiement

### **1. 🐙 Créer un Repository GitHub**

1. **Aller sur GitHub** : https://github.com/new
2. **Nom du repository** : `frenschain`
3. **Description** : `FrensChain - Solana Dating App with Geolocation`
4. **Visibilité** : Public (recommandé)
5. **Créer le repository**

### **2. 📤 Pousser le Code**

```bash
# Dans le dossier FrensChain-1
git remote add origin https://github.com/VOTRE-USERNAME/frenschain.git
git push -u origin main
```

### **3. 🌐 Déployer sur Vercel**

#### **Option A: Interface Web (Recommandée)**
1. **Aller sur Vercel** : https://vercel.com
2. **Se connecter** avec GitHub
3. **"New Project"**
4. **Importer** le repository `frenschain`
5. **Configurer** :
   - **Framework Preset** : Other
   - **Root Directory** : `./`
   - **Build Command** : `npm run vercel-build`
   - **Output Directory** : `simple-web`
6. **Deploy**

#### **Option B: CLI Vercel**
```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Production
vercel --prod
```

## 🔧 Configuration Vercel

### **Build Settings**
```json
{
  "buildCommand": "npm run vercel-build",
  "outputDirectory": "simple-web",
  "installCommand": "npm install"
}
```

### **Environment Variables**
```bash
NODE_ENV=production
PORT=3001
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### **Routes Configuration**
```json
{
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

## 📱 URLs de Production

Une fois déployé, votre application sera accessible à :

### **🌐 URLs Principales**
- **Accueil** : `https://frenschain.vercel.app/`
- **Création Profil** : `https://frenschain.vercel.app/home`
- **Interface Tinder** : `https://frenschain.vercel.app/tinder`

### **🔧 API Endpoints**
- **Health Check** : `https://frenschain.vercel.app/api/health`
- **Test API** : `https://frenschain.vercel.app/api/test`
- **Pricing** : `https://frenschain.vercel.app/api/pricing`

## ✨ Fonctionnalités Déployées

### **📱 Frontend**
- ✅ **Page d'accueil** avec création de profil
- ✅ **Géolocalisation** intégrée
- ✅ **Interface Tinder** responsive
- ✅ **Design Solana** officiel
- ✅ **Mobile-first** design

### **🔧 Backend**
- ✅ **API REST** complète
- ✅ **WebSocket** temps réel
- ✅ **Intégration Solana**
- ✅ **Paiements SOL**
- ✅ **Analytics** intégrées

### **🔗 Blockchain**
- ✅ **Wallet Connect** (Phantom/Solflare)
- ✅ **Smart Contracts** Anchor
- ✅ **Paiements SOL** sécurisés
- ✅ **Authentification** blockchain

## 🎯 Test du Déploiement

### **1. Vérifier l'Accueil**
```bash
curl https://frenschain.vercel.app/
```

### **2. Tester l'API**
```bash
curl https://frenschain.vercel.app/api/health
```

### **3. Vérifier les Pages**
- Ouvrir `https://frenschain.vercel.app/home`
- Ouvrir `https://frenschain.vercel.app/tinder`

## 🔧 Maintenance

### **Mises à Jour**
```bash
# Modifier le code localement
# Pousser vers GitHub
git add .
git commit -m "Update: New features"
git push origin main

# Vercel redéploie automatiquement
```

### **Monitoring**
- **Vercel Dashboard** : https://vercel.com/dashboard
- **Analytics** : Métriques de performance
- **Logs** : Logs d'erreurs et debug

## 🚨 Dépannage

### **Problèmes Courants**

#### **1. Build Failed**
- Vérifier les logs dans Vercel Dashboard
- S'assurer que `package.json` est correct
- Vérifier les dépendances

#### **2. 404 Errors**
- Vérifier la configuration des routes
- S'assurer que les fichiers existent
- Vérifier `vercel.json`

#### **3. API Errors**
- Vérifier les variables d'environnement
- Tester les endpoints localement
- Vérifier les logs

### **Support**
- 📧 **Email** : support@frenschain.com
- 💬 **Discord** : [FrensChain Community](https://discord.gg/frenschain)
- 📖 **Documentation** : [GitHub Wiki](https://github.com/VOTRE-USERNAME/frenschain/wiki)

## 🎉 Félicitations !

Votre application **FrensChain** est maintenant déployée et accessible au monde entier ! 🌍

### **Prochaines Étapes**
1. 🔗 **Partager** l'URL avec vos utilisateurs
2. 📊 **Monitorer** les métriques de performance
3. 🚀 **Itérer** basé sur les retours utilisateurs
4. 💰 **Monétiser** avec le système premium

---

**FrensChain** - Trouvez vos âmes sœurs crypto dans votre région ! 🔥💜

