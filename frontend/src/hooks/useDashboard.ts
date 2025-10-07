import { useState, useEffect, useCallback } from 'react'
import { useVoyageStats } from './useVoyages'

export interface DashboardStats {
  totalVoyages: number
  totalValeur: number
  totalBenefice: number
  moyenneROI: number
  voyagesMoisActuel: number
  beneficeMoisActuel: number
  topDestinations: Array<{ destination: string; count: number; benefice: number }>
  evolutionBenefices: Array<{ mois: string; benefice: number }>
}

export const useDashboard = () => {
  const { stats: voyageStats, loading: statsLoading, error: statsError } = useVoyageStats()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculer les statistiques du dashboard à partir des données des voyages
  const dashboardStats: DashboardStats = {
    totalVoyages: voyageStats?.totalVoyages || 0,
    totalValeur: voyageStats?.totalValeur || 0,
    totalBenefice: voyageStats?.totalBenefice || 0,
    moyenneROI: voyageStats?.moyenneROI || 0,
    voyagesMoisActuel: voyageStats?.statuts?.find(s => s._id === 'en_cours')?.count || 0,
    beneficeMoisActuel: 0, // À calculer selon les besoins
    topDestinations: voyageStats?.destinations?.map(d => ({
      destination: d._id,
      count: d.count,
      benefice: 0 // À calculer selon les besoins
    })) || [],
    evolutionBenefices: [] // À calculer selon les besoins
  }

  return {
    stats: dashboardStats,
    loading: statsLoading || loading,
    error: statsError || error,
    clearError: () => setError(null)
  }
}