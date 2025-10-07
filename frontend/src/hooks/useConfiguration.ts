import { useState, useEffect, useCallback } from 'react'

// Types from API
export interface Configuration {
  _id: string
  nom: string
  valeur: number
  type: string
  description?: string
  user: string
  createdAt: string
}

export const useConfiguration = () => {
  const [configurations, setConfigurations] = useState<Configuration[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConfigurations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('http://localhost:5000/api/configurations', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des configurations')
      }

      const data = await response.json()
      if (data.success) {
        setConfigurations(data.data)
      } else {
        throw new Error(data.message || 'Erreur lors du chargement des configurations')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des configurations')
    } finally {
      setLoading(false)
    }
  }, [])

  const createConfiguration = useCallback(async (configData: Omit<Configuration, '_id' | 'user' | 'createdAt'>) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('http://localhost:5000/api/configurations', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configData),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la configuration')
      }

      const data = await response.json()
      if (data.success) {
        setConfigurations(prev => [...prev, data.data])
        return data.data
      } else {
        throw new Error(data.message || 'Erreur lors de la création de la configuration')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la configuration')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateConfiguration = useCallback(async (id: string, configData: Partial<Configuration>) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`http://localhost:5000/api/configurations/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configData),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la configuration')
      }

      const data = await response.json()
      if (data.success) {
        setConfigurations(prev => prev.map(c => c._id === id ? data.data : c))
        return data.data
      } else {
        throw new Error(data.message || 'Erreur lors de la mise à jour de la configuration')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la configuration')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteConfiguration = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`http://localhost:5000/api/configurations/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la configuration')
      }

      const data = await response.json()
      if (data.success) {
        setConfigurations(prev => prev.filter(c => c._id !== id))
      } else {
        throw new Error(data.message || 'Erreur lors de la suppression de la configuration')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de la configuration')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  useEffect(() => {
    fetchConfigurations()
  }, [fetchConfigurations])

  return {
    configurations,
    loading,
    error,
    createConfiguration,
    updateConfiguration,
    deleteConfiguration,
    clearError,
    refetch: fetchConfigurations
  }
}