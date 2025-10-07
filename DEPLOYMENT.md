# Guide de Déploiement sur Render

Ce guide vous explique comment déployer l'application MicroImport Pro sur Render.

## Prérequis

1. Un compte Render (gratuit)
2. Un compte MongoDB Atlas (gratuit)
3. Le code poussé sur GitHub

## Étape 1: Configuration MongoDB Atlas

### 1.1 Créer un cluster MongoDB Atlas
1. Allez sur [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Créez un compte gratuit
3. Créez un nouveau cluster (choisissez le plan gratuit M0)
4. Attendez que le cluster soit créé (2-3 minutes)

### 1.2 Configurer l'accès réseau
1. Dans "Network Access", ajoutez l'IP `0.0.0.0/0` (accès depuis n'importe où)
2. Ou ajoutez l'IP de Render si vous la connaissez

### 1.3 Créer un utilisateur de base de données
1. Dans "Database Access", créez un nouvel utilisateur
2. Nom d'utilisateur: `microimport-user`
3. Mot de passe: générez un mot de passe sécurisé
4. Rôle: "Read and write to any database"

### 1.4 Obtenir la chaîne de connexion
1. Dans "Database", cliquez sur "Connect"
2. Choisissez "Connect your application"
3. Copiez la chaîne de connexion (remplacez `<password>` par votre mot de passe)

## Étape 2: Déploiement du Backend

### 2.1 Créer un nouveau service Web sur Render
1. Allez sur [Render Dashboard](https://dashboard.render.com)
2. Cliquez sur "New +" puis "Web Service"
3. Connectez votre repository GitHub
4. Sélectionnez le repository `Amirmizou/Import`

### 2.2 Configuration du service Backend
- **Name**: `microimport-backend`
- **Environment**: `Node`
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Plan**: Free

### 2.3 Variables d'environnement
Ajoutez ces variables d'environnement :

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://microimport-user:<password>@cluster0.xxxxx.mongodb.net/microimport?retryWrites=true&w=majority
JWT_SECRET=votre_secret_jwt_tres_long_et_securise
CORS_ORIGIN=https://importf.onrender.com
```

### 2.4 Déployer
1. Cliquez sur "Create Web Service"
2. Attendez que le déploiement se termine (5-10 minutes)
3. Notez l'URL du service (ex: `https://microimport-backend.onrender.com`)

## Étape 3: Déploiement du Frontend

### 3.1 Créer un nouveau service Static Site
1. Dans Render Dashboard, cliquez sur "New +" puis "Static Site"
2. Connectez le même repository GitHub
3. Sélectionnez le repository `Amirmizou/Import`

### 3.2 Configuration du service Frontend
- **Name**: `microimport-frontend`
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`
- **Plan**: Free

### 3.3 Variables d'environnement
Ajoutez cette variable d'environnement :

```
VITE_API_URL=https://microimport-backend.onrender.com
```

### 3.4 Déployer
1. Cliquez sur "Create Static Site"
2. Attendez que le déploiement se termine (5-10 minutes)
3. Notez l'URL du site (ex: `https://microimport-frontend.onrender.com`)

## Étape 4: Configuration finale

### 4.1 Mettre à jour CORS du Backend
1. Retournez au service backend sur Render
2. Allez dans "Environment"
3. Mettez à jour `CORS_ORIGIN` avec l'URL exacte du frontend
4. Redéployez le backend

### 4.2 Tester l'application
1. Allez sur l'URL du frontend
2. Créez un compte utilisateur
3. Testez la création d'un voyage
4. Vérifiez que les données sont sauvegardées

## URLs finales

- **Frontend**: `https://importf.onrender.com`
- **Backend**: `https://microimport-backend.onrender.com`
- **API**: `https://microimport-backend.onrender.com/api`

## Dépannage

### Problèmes courants

1. **Erreur CORS**
   - Vérifiez que `CORS_ORIGIN` pointe vers l'URL exacte du frontend
   - Redéployez le backend après modification

2. **Erreur de connexion MongoDB**
   - Vérifiez que l'IP `0.0.0.0/0` est autorisée dans MongoDB Atlas
   - Vérifiez que le mot de passe dans `MONGODB_URI` est correct

3. **Erreur de build du frontend**
   - Vérifiez que `VITE_API_URL` est correctement configurée
   - Vérifiez que le build command inclut `cd frontend`

4. **Service qui ne démarre pas**
   - Vérifiez les logs dans Render Dashboard
   - Vérifiez que toutes les variables d'environnement sont définies

### Logs et monitoring

- **Backend logs**: Render Dashboard > Service > Logs
- **Frontend logs**: Render Dashboard > Service > Logs
- **MongoDB logs**: MongoDB Atlas > Monitoring

## Coûts

- **Render**: Gratuit (avec limitations)
- **MongoDB Atlas**: Gratuit (plan M0)
- **Total**: 0€/mois

## Limitations du plan gratuit

- **Render**: Services inactifs après 15 minutes d'inactivité
- **MongoDB Atlas**: 512MB de stockage, connexions limitées
- **Domaine**: URL avec `.onrender.com`

## Mise à niveau (optionnel)

Pour un usage professionnel, considérez :
- Plan payant Render pour éviter les timeouts
- Plan payant MongoDB Atlas pour plus de stockage
- Domaine personnalisé
- CDN pour améliorer les performances
