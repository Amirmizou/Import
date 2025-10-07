# Déploiement du Frontend sur Render

Votre backend est maintenant déployé ! Voici comment déployer le frontend.

## URL de votre Backend
Votre backend est accessible sur : `https://votre-backend.onrender.com`

## Étapes pour déployer le Frontend

### 1. Créer un nouveau service Static Site
1. Allez sur [Render Dashboard](https://dashboard.render.com)
2. Cliquez sur "New +" puis "Static Site"
3. Connectez votre repository GitHub `Amirmizou/Import`

### 2. Configuration du Frontend
- **Name**: `microimport-frontend`
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`
- **Plan**: Free

### 3. Variables d'environnement
Ajoutez cette variable d'environnement :

```
VITE_API_URL=https://votre-backend.onrender.com
```

**Remplacez `votre-backend` par le nom exact de votre service backend sur Render.**

### 4. Déployer
1. Cliquez sur "Create Static Site"
2. Attendez que le déploiement se termine (5-10 minutes)

### 5. Mettre à jour CORS du Backend
1. Retournez au service backend sur Render
2. Allez dans "Environment"
3. Mettez à jour `CORS_ORIGIN` avec l'URL exacte du frontend
4. Redéployez le backend

## URLs finales
- **Frontend**: `https://microimport-frontend.onrender.com`
- **Backend**: `https://votre-backend.onrender.com`
- **API**: `https://votre-backend.onrender.com/api`

## Test
1. Allez sur l'URL du frontend
2. Créez un compte utilisateur
3. Testez la création d'un voyage
4. Vérifiez que les données sont sauvegardées

## Dépannage
- **Erreur CORS**: Vérifiez que `CORS_ORIGIN` pointe vers l'URL exacte du frontend
- **Erreur de build**: Vérifiez que `VITE_API_URL` est correctement configurée
- **Service qui ne démarre pas**: Vérifiez les logs dans Render Dashboard
