import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  PieChart,
  Table,
  Filter,
  RefreshCw,
  Trash2,
  Eye
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select, SelectOption } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Badge, BadgeGroup } from '@/components/ui/Badge'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useVoyages } from '@/hooks/useVoyages'
import { useConfiguration } from '@/hooks/useConfiguration'

interface ReportData {
  id: string
  title: string
  type: 'financial' | 'performance' | 'inventory' | 'custom'
  period: string
  generatedAt: string
  status: 'ready' | 'generating' | 'error'
  size: string
  data?: any
  summary?: {
    totalVoyages: number
    totalRevenue: number
    averageProfit: number
    topDestination: string
  }
}

interface ReportsPanelProps {
  className?: string
}

const reportTypes: SelectOption[] = [
  { value: 'financial', label: 'Rapport financier' },
  { value: 'performance', label: 'Rapport de performance' },
  { value: 'inventory', label: 'Rapport d\'inventaire' },
  { value: 'custom', label: 'Rapport personnalisé' }
]

const periodOptions: SelectOption[] = [
  { value: 'today', label: 'Aujourd\'hui' },
  { value: 'week', label: 'Cette semaine' },
  { value: 'month', label: 'Ce mois' },
  { value: 'quarter', label: 'Ce trimestre' },
  { value: 'year', label: 'Cette année' },
  { value: 'custom', label: 'Période personnalisée' }
]

export const ReportsPanel: React.FC<ReportsPanelProps> = ({ className }) => {
  const [reportType, setReportType] = useState<string>('financial')
  const [period, setPeriod] = useState<string>('month')
  const [customDateFrom, setCustomDateFrom] = useState<string>('')
  const [customDateTo, setCustomDateTo] = useState<string>('')
  const [reports, setReports] = useState<ReportData[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { voyages, loading: voyagesLoading } = useVoyages()
  const { configurations, loading: configLoading } = useConfiguration()

  // Fonction pour calculer les statistiques
  const calculateStats = (data: any[]) => {
    if (!data || data.length === 0) {
      return {
        totalVoyages: 0,
        totalRevenue: 0,
        averageProfit: 0,
        topDestination: 'Aucune'
      }
    }

    const totalVoyages = data.length
    const totalRevenue = data.reduce((sum, voyage) => {
      // Utiliser les calculs réels du voyage si disponibles
      if (voyage.calculs) {
        return sum + voyage.calculs.venteTotal
      }
      // Sinon calculer à partir des marchandises
      const revenue = voyage.marchandises?.reduce((mSum: number, marchandise: any) => 
        mSum + (marchandise.prixVenteUnitaire * marchandise.quantite), 0) || 0
      return sum + revenue
    }, 0)
    
    // Calculer le profit moyen basé sur les calculs réels
    const totalProfit = data.reduce((sum, voyage) => {
      if (voyage.calculs) {
        return sum + voyage.calculs.beneficeNet
      }
      return sum
    }, 0)
    const averageProfit = totalVoyages > 0 ? totalProfit / totalVoyages : 0
    
    // Trouver la destination la plus fréquente
    const destinations = data.map(v => v.destination).filter(Boolean)
    const destinationCounts = destinations.reduce((acc: any, dest) => {
      acc[dest] = (acc[dest] || 0) + 1
      return acc
    }, {})
    const topDestination = Object.keys(destinationCounts).reduce((a, b) => 
      destinationCounts[a] > destinationCounts[b] ? a : b, 'Aucune'
    )

    return {
      totalVoyages,
      totalRevenue,
      averageProfit,
      topDestination
    }
  }

  // Fonction pour générer un rapport
  const generateReport = async () => {
    if (period === 'custom' && (!customDateFrom || !customDateTo)) {
      setError('Veuillez sélectionner une période personnalisée')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const reportId = Date.now().toString()
      const reportTitle = `Rapport ${reportType} - ${new Date().toLocaleDateString('fr-FR')}`
      
      // Créer le rapport
      const newReport: ReportData = {
        id: reportId,
        title: reportTitle,
        type: reportType as any,
        period: period === 'custom' ? `${customDateFrom} to ${customDateTo}` : period,
        generatedAt: new Date().toISOString(),
        status: 'generating',
        size: '0 MB',
        data: getReportData(),
        summary: calculateStats(getReportData())
      }

      setReports(prev => [newReport, ...prev])

      // Simuler la génération
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mettre à jour le rapport
      setReports(prev => prev.map(r => 
        r.id === reportId 
          ? { 
              ...r, 
              status: 'ready', 
              size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
              summary: calculateStats(getReportData())
            }
          : r
      ))

    } catch (err) {
      setError('Erreur lors de la génération du rapport')
      setReports(prev => prev.map(r => 
        r.id === reportId 
          ? { ...r, status: 'error' }
          : r
      ))
    } finally {
      setIsGenerating(false)
    }
  }

  // Fonction pour récupérer les données du rapport
  const getReportData = () => {
    let data = voyages || []
    
    // Filtrer par période si nécessaire
    if (period === 'custom' && customDateFrom && customDateTo) {
      data = data.filter(voyage => {
        const voyageDate = new Date(voyage.date)
        return voyageDate >= new Date(customDateFrom) && voyageDate <= new Date(customDateTo)
      })
    } else if (period !== 'custom') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (period) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3)
          break
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1)
          break
      }
      
      data = data.filter(voyage => new Date(voyage.date) >= filterDate)
    }
    
    return data
  }

  // Fonction pour télécharger un rapport
  const handleDownload = (report: ReportData) => {
    const dataStr = JSON.stringify(report.data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${report.title}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  // Fonction pour supprimer un rapport
  const handleDeleteReport = (reportId: string) => {
    setReports(prev => prev.filter(report => report.id !== reportId))
  }

  // Fonction pour obtenir l'icône du type de rapport
  const getReportIcon = (type: string) => {
    switch (type) {
      case 'financial':
        return <DollarSign className="h-4 w-4" />
      case 'performance':
        return <TrendingUp className="h-4 w-4" />
      case 'inventory':
        return <BarChart3 className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // Fonction pour obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge variant="success">Prêt</Badge>
      case 'generating':
        return <Badge variant="warning">Génération...</Badge>
      case 'error':
        return <Badge variant="error">Erreur</Badge>
      default:
        return <Badge variant="secondary">En attente</Badge>
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Configuration du rapport */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Générer un rapport
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="error">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de rapport</label>
              <Select
                value={reportType}
                onValueChange={setReportType}
                options={reportTypes}
                placeholder="Choisissez un type de rapport"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Période</label>
              <Select
                value={period}
                onValueChange={setPeriod}
                options={periodOptions}
                placeholder="Choisissez une période"
              />
            </div>
          </div>
          
          {period === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date de début</label>
                <Input
                  type="date"
                  value={customDateFrom}
                  onChange={(e) => setCustomDateFrom(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Date de fin</label>
                <Input
                  type="date"
                  value={customDateTo}
                  onChange={(e) => setCustomDateTo(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <Button
            onClick={generateReport}
            disabled={isGenerating || (period === 'custom' && (!customDateFrom || !customDateTo))}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Générer le rapport
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Historique des rapports */}
      {reports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Table className="h-5 w-5" />
              Historique des rapports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getReportIcon(report.type)}
                      <div>
                        <h4 className="font-medium">{report.title}</h4>
                        <p className="text-sm text-gray-500">
                          Généré le {formatDate(report.generatedAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(report.status)}
                      
                      {report.status === 'ready' && (
                        <Button
                          size="sm"
                          onClick={() => handleDownload(report)}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          Télécharger
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteReport(report.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {report.summary && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{report.summary.totalVoyages}</p>
                        <p className="text-xs text-gray-500">Voyages</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(report.summary.totalRevenue)}</p>
                        <p className="text-xs text-gray-500">Revenus</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{formatCurrency(report.summary.averageProfit)}</p>
                        <p className="text-xs text-gray-500">Profit moyen</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-orange-600">{report.summary.topDestination}</p>
                        <p className="text-xs text-gray-500">Top destination</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}