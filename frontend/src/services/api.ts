import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

// Types
export interface User {
  _id: string
  name: string
  email: string
  createdAt: string
}

export interface Marchandise {
  id: number
  nom: string
  quantite: number
  prixAchatUnitaire: number
  prixVenteUnitaire: number
  poids: number
  volume: number
}

export interface FraisFixesVoyage {
  transportAller: number
  transportRetour: number
  hebergement: number
  repas: number
  visa: number
  assurance: number
  taxiTransport: number
  autres: number
}

export interface Voyage {
  _id: string
  destination: string
  date: string
  deviseVoyage: string
  fraisDouane: number
  fraisTransport: number
  fraisFixes: number
  fraisFixesDetail: FraisFixesVoyage
  marchandises: Marchandise[]
  tauxChange: Record<string, number>
  statut: string
  calculs: {
    coutTotalAchat: number
    fraisDouaneTotal: number
    fraisFixesTotal: number
    fraisSupp: number
    coutTotal: number
    venteTotal: number
    beneficeNet: number
    margeBrute: number
    margePercent: number
    roiPercent: number
    valeurDouane: number
    detailsMarchandises: any[]
  }
  user: string
  createdAt: string
}

export interface VoyageStats {
  totalVoyages: number
  totalValeur: number
  totalBenefice: number
  moyenneROI: number
  statuts: Array<{ _id: string; count: number }>
  destinations: Array<{ _id: string; count: number }>
}

export interface Configuration {
  _id: string
  nom: string
  valeur: number
  type: string
  description?: string
  user: string
  createdAt: string
}

// API instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password })
    return response.data
  },
  
  register: async (name: string, email: string, password: string) => {
    const response = await apiClient.post('/auth/register', { name, email, password })
    return response.data
  },
  
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile')
    return response.data
  }
}

// Voyages API
export const voyageApi = {
  getVoyages: async (): Promise<Voyage[]> => {
    const response = await apiClient.get('/voyages')
    return response.data
  },
  
  getVoyage: async (id: string): Promise<Voyage> => {
    const response = await apiClient.get(`/voyages/${id}`)
    return response.data
  },
  
  createVoyage: async (voyageData: Omit<Voyage, '_id' | 'user' | 'createdAt'>): Promise<Voyage> => {
    const response = await apiClient.post('/voyages', voyageData)
    return response.data
  },
  
  updateVoyage: async (id: string, voyageData: Partial<Voyage>): Promise<Voyage> => {
    const response = await apiClient.put(`/voyages/${id}`, voyageData)
    return response.data
  },
  
  deleteVoyage: async (id: string): Promise<void> => {
    await apiClient.delete(`/voyages/${id}`)
  },
  
  getVoyageStats: async (): Promise<VoyageStats> => {
    const response = await apiClient.get('/voyages/stats')
    return response.data
  }
}

// Configuration API
export const configurationApi = {
  getConfigurations: async (): Promise<Configuration[]> => {
    const response = await apiClient.get('/configurations')
    return response.data
  },
  
  createConfiguration: async (configData: Omit<Configuration, '_id' | 'user' | 'createdAt'>): Promise<Configuration> => {
    const response = await apiClient.post('/configurations', configData)
    return response.data
  },
  
  updateConfiguration: async (id: string, configData: Partial<Configuration>): Promise<Configuration> => {
    const response = await apiClient.put(`/configurations/${id}`, configData)
    return response.data
  },
  
  deleteConfiguration: async (id: string): Promise<void> => {
    await apiClient.delete(`/configurations/${id}`)
  }
}

// Main API object
export const api = {
  ...authApi,
  ...voyageApi,
  ...configurationApi,
  
  // Health check
  health: async () => {
    const response = await apiClient.get('/health')
    return response.data
  }
}

export default api