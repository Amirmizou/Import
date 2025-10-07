import { useState, useEffect, useCallback } from 'react'
import { 
  TAUX_CHANGE_DEFAUT, 
  MARGES_SUGGEREES_DEFAUT,
  type TauxChange,
  type MargesSuggerees
} from '@/services/businessLogic'
import { getApiBaseUrl } from '@/utils/apiUrl'

export const useBusinessConfig = () => {
  const [tauxChange, setTauxChange] = useState<TauxChange>(TAUX_CHANGE_DEFAUT)
  const [margesSuggerees, setMargesSuggerees] = useState<MargesSuggerees>(MARGES_SUGGEREES_DEFAUT)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Charger la configuration depuis l'API
  const loadConfig = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Charger les taux de change
      const tauxResponse = await fetch(`${getApiBaseUrl()}/configurations?type=taux_change`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (tauxResponse.ok) {
        const tauxData = await tauxResponse.json()
        if (tauxData.success && tauxData.data.length > 0) {
          const tauxConfig: Partial<TauxChange> = {}
          tauxData.data.forEach((config: any) => {
            tauxConfig[config.nom as keyof TauxChange] = config.valeur
          })
          setTauxChange(prev => ({ ...prev, ...tauxConfig }))
        }
      } else if (tauxResponse.status === 401) {
        // Utilisateur non connecté, utiliser les valeurs par défaut
        console.log('Utilisateur non connecté, utilisation des valeurs par défaut')
      }

      // Charger les marges suggérées
      const margesResponse = await fetch(`${getApiBaseUrl()}/configurations?type=marges`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (margesResponse.ok) {
        const margesData = await margesResponse.json()
        if (margesData.success && margesData.data.length > 0) {
          const margesConfig: Partial<MargesSuggerees> = {}
          margesData.data.forEach((config: any) => {
            margesConfig[config.nom as keyof MargesSuggerees] = config.valeur
          })
          setMargesSuggerees(prev => ({ ...prev, ...margesConfig }))
        }
      } else if (margesResponse.status === 401) {
        // Utilisateur non connecté, utiliser les valeurs par défaut
        console.log('Utilisateur non connecté, utilisation des valeurs par défaut')
      }

    } catch (err) {
      // En cas d'erreur, utiliser les valeurs par défaut
      console.log('Erreur lors du chargement de la configuration, utilisation des valeurs par défaut:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Sauvegarder les taux de change
  const saveTauxChange = useCallback(async (newTauxChange: TauxChange) => {
    try {
      setLoading(true)
      setError(null)

      const promises = Object.entries(newTauxChange).map(([key, value]) => 
        fetch(`${getApiBaseUrl()}/configurations`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nom: key,
            valeur: value,
            type: 'taux_change',
            description: `Taux de change: 1 ${key} = ${value} DA`
          })
        })
      )

      await Promise.all(promises)
      setTauxChange(newTauxChange)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde des taux de change')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Sauvegarder les marges suggérées
  const saveMargesSuggerees = useCallback(async (newMarges: MargesSuggerees) => {
    try {
      setLoading(true)
      setError(null)

      const promises = Object.entries(newMarges).map(([key, value]) => 
        fetch(`${getApiBaseUrl()}/configurations`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nom: key,
            valeur: value,
            type: 'marges',
            description: `Marge suggérée: ${key} = ${value}%`
          })
        })
      )

      await Promise.all(promises)
      setMargesSuggerees(newMarges)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde des marges')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  useEffect(() => {
    loadConfig()
  }, [loadConfig])

  return {
    tauxChange,
    margesSuggerees,
    loading,
    error,
    setTauxChange,
    setMargesSuggerees,
    saveTauxChange,
    saveMargesSuggerees,
    clearError,
    refetch: loadConfig
  }
}
