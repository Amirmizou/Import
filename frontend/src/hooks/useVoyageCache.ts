import { useState, useEffect, useCallback } from 'react'
import { type VoyageData } from '@/services/businessLogic'

const CACHE_KEY = 'voyage_form_cache'
const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24 heures

interface CachedVoyageData extends VoyageData {
  _cachedAt: number
  _isDraft: boolean
}

export const useVoyageCache = (voyageId?: string) => {
  const [cachedData, setCachedData] = useState<VoyageData | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Générer une clé de cache unique
  const getCacheKey = useCallback(() => {
    return voyageId ? `${CACHE_KEY}_${voyageId}` : `${CACHE_KEY}_new`
  }, [voyageId])

  // Charger les données depuis le cache
  const loadFromCache = useCallback(() => {
    try {
      const cacheKey = getCacheKey()
      const cached = localStorage.getItem(cacheKey)
      
      if (cached) {
        const parsedData: CachedVoyageData = JSON.parse(cached)
        
        // Vérifier si le cache n'est pas expiré
        if (Date.now() - parsedData._cachedAt < CACHE_EXPIRY) {
          const { _cachedAt, _isDraft, ...voyageData } = parsedData
          setCachedData(voyageData)
          setHasUnsavedChanges(_isDraft)
          return voyageData
        } else {
          // Supprimer le cache expiré
          localStorage.removeItem(cacheKey)
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du cache:', error)
    }
    return null
  }, [getCacheKey])

  // Sauvegarder dans le cache
  const saveToCache = useCallback((data: VoyageData, isDraft: boolean = true) => {
    try {
      const cacheKey = getCacheKey()
      const dataToCache: CachedVoyageData = {
        ...data,
        _cachedAt: Date.now(),
        _isDraft: isDraft
      }
      
      localStorage.setItem(cacheKey, JSON.stringify(dataToCache))
      setHasUnsavedChanges(isDraft)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du cache:', error)
    }
  }, [getCacheKey])

  // Supprimer le cache
  const clearCache = useCallback(() => {
    try {
      const cacheKey = getCacheKey()
      localStorage.removeItem(cacheKey)
      setCachedData(null)
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Erreur lors de la suppression du cache:', error)
    }
  }, [getCacheKey])

  // Auto-sauvegarde avec debounce
  const autoSave = useCallback((data: VoyageData) => {
    const timeoutId = setTimeout(() => {
      saveToCache(data, true)
    }, 1000) // Sauvegarde après 1 seconde d'inactivité

    return () => clearTimeout(timeoutId)
  }, [saveToCache])

  // Charger le cache au montage
  useEffect(() => {
    loadFromCache()
  }, [loadFromCache])

  // Avertir avant de quitter si il y a des changements non sauvegardés
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = 'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter ?'
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  return {
    cachedData,
    hasUnsavedChanges,
    loadFromCache,
    saveToCache,
    clearCache,
    autoSave
  }
}

