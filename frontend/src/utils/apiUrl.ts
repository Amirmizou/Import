// Configuration centralisée de l'URL de l'API
export const getApiBaseUrl = () => {
  // Si on est en production (Render), utiliser l'URL de production
  if (import.meta.env.PROD) {
    return 'https://importb.onrender.com/api'
  }
  
  // Si une variable d'environnement est définie, l'utiliser
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}/api`
  }
  
  // Par défaut, utiliser localhost pour le développement
  return 'http://localhost:5000/api'
}

// Log pour debug (toujours afficher pour diagnostiquer)
console.log('🔧 Configuration API (utils):', {
  environment: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  apiUrl: getApiBaseUrl(),
  viteApiUrl: import.meta.env.VITE_API_URL,
  location: typeof window !== 'undefined' ? window.location.href : 'server'
})
