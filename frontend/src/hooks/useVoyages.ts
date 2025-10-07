import { useState, useEffect, useCallback } from 'react'

// Types from API
export interface Voyage {
  _id: string
  destination: string
  date: string
  deviseVoyage: string
  fraisDouane: number
  fraisTransport: number
  fraisFixes: number
  fraisFixesDetail: {
    transportAller: number
    transportRetour: number
    hebergement: number
    repas: number
    visa: number
    assurance: number
    taxiTransport: number
    autres: number
  }
  marchandises: Array<{
    id: number
    nom: string
    quantite: number
    prixAchatUnitaire: number
    prixVenteUnitaire: number
    poids: number
    volume: number
  }>
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

export const useVoyages = () => {
  const [voyages, setVoyages] = useState<Voyage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchVoyages = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('http://localhost:5000/api/voyages', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des voyages')
      }

      const data = await response.json()
      if (data.success) {
        setVoyages(data.data)
      } else {
        throw new Error(data.message || 'Erreur lors du chargement des voyages')
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('401')) {
        // Utilisateur non connecté, ne pas afficher d'erreur
        console.log('Utilisateur non connecté')
      } else {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des voyages')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const createVoyage = useCallback(async (voyageData: Omit<Voyage, '_id' | 'user' | 'createdAt'>) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('http://localhost:5000/api/voyages', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voyageData),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du voyage')
      }

      const data = await response.json()
      if (data.success) {
        setVoyages(prev => [...prev, data.data])
        return data.data
      } else {
        throw new Error(data.message || 'Erreur lors de la création du voyage')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du voyage')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateVoyage = useCallback(async (id: string, voyageData: Partial<Voyage>) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`http://localhost:5000/api/voyages/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voyageData),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du voyage')
      }

      const data = await response.json()
      if (data.success) {
        setVoyages(prev => prev.map(v => v._id === id ? data.data : v))
        return data.data
      } else {
        throw new Error(data.message || 'Erreur lors de la mise à jour du voyage')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du voyage')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteVoyage = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`http://localhost:5000/api/voyages/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du voyage')
      }

      const data = await response.json()
      if (data.success) {
        setVoyages(prev => prev.filter(v => v._id !== id))
      } else {
        throw new Error(data.message || 'Erreur lors de la suppression du voyage')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du voyage')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  useEffect(() => {
    fetchVoyages()
  }, [fetchVoyages])

  return {
    voyages,
    loading,
    error,
    createVoyage,
    updateVoyage,
    deleteVoyage,
    clearError,
    refetch: fetchVoyages
  }
}

export const useVoyageStats = () => {
  const [stats, setStats] = useState<VoyageStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('http://localhost:5000/api/voyages/stats', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des statistiques')
      }

      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      } else {
        throw new Error(data.message || 'Erreur lors du chargement des statistiques')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}