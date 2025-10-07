import React, { useState } from 'react'
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
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select, SelectOption } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Badge, BadgeGroup } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'

interface ReportData {
  id: string
  title: string
  type: 'financial' | 'performance' | 'inventory' | 'custom'
  period: string
  generatedAt: string
  status: 'ready' | 'generating' | 'error'
  size: string
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

const mockReports: ReportData[] = [
  {
    id: '1',
    title: 'Rapport financier - Janvier 2024',
    type: 'financial',
    period: '2024-01-01 to 2024-01-31',
    generatedAt: '2024-01-31T10:30:00Z',
    status: 'ready',
    size: '2.3 MB'
  },
  {
    id: '2',
    title: 'Performance des voyages - Q4 2023',
    type: 'performance',
    period: '2023-10-01 to 2023-12-31',
    generatedAt: '2024-01-01T14:15:00Z',
    status: 'ready',
    size: '1.8 MB'
  },
  {
    id: '3',
    title: 'Rapport d\'inventaire - Décembre 2023',
    type: 'inventory',
    period: '2023-12-01 to 2023-12-31',
    generatedAt: '2023-12-31T16:45:00Z',
    status: 'ready',
    size: '3.1 MB'
  }
]

export const ReportsPanel: React.FC<ReportsPanelProps> = ({ className }) => {
  const [selectedType, setSelectedType] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('')
  const [customDateFrom, setCustomDateFrom] = useState('')
  const [customDateTo, setCustomDateTo] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [reports] = useState<ReportData[]>(mockReports)

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    // Simuler la génération du rapport
    setTimeout(() => {
      setIsGenerating(false)
      // Ici, vous pourriez ajouter le nouveau rapport à la liste
    }, 3000)
  }

  const handleDownloadReport = (reportId: string) => {
    // Simuler le téléchargement
    console.log(`Téléchargement du rapport ${reportId}`)
  }

  const getReportTypeIcon = (type: string) => {
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

  const getReportTypeLabel = (type: string) => {
    return reportTypes.find(t => t.value === type)?.label || type
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge variant="success">Prêt</Badge>
      case 'generating':
        return <Badge variant="warning">Génération...</Badge>
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Génération de rapport */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Générer un rapport
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type de rapport
                </label>
                <Select
                  options={reportTypes}
                  value={selectedType}
                  onChange={setSelectedType}
                  placeholder="Sélectionner un type"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Période
                </label>
                <Select
                  options={periodOptions}
                  value={selectedPeriod}
                  onChange={setSelectedPeriod}
                  placeholder="Sélectionner une période"
                />
              </div>

              {selectedPeriod === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Date de début
                    </label>
                    <Input
                      type="date"
                      value={customDateFrom}
                      onChange={(e) => setCustomDateFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Date de fin
                    </label>
                    <Input
                      type="date"
                      value={customDateTo}
                      onChange={(e) => setCustomDateTo(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleGenerateReport}
                disabled={!selectedType || !selectedPeriod || isGenerating}
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
        </motion.div>

        {/* Rapports disponibles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table className="h-5 w-5" />
                Rapports disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Aucun rapport disponible
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          {getReportTypeIcon(report.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            {report.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="h-3 w-3" />
                            {formatDate(new Date(report.generatedAt))}
                            <span>•</span>
                            {report.size}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(report.status)}
                        {report.status === 'ready' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadReport(report.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Types de rapports disponibles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Types de rapports disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Rapport financier
                  </h4>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Revenus, bénéfices, coûts et analyses financières détaillées.
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h4 className="font-medium text-green-900 dark:text-green-100">
                    Performance
                  </h4>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  ROI, marges, tendances et indicateurs de performance.
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h4 className="font-medium text-purple-900 dark:text-purple-100">
                    Inventaire
                  </h4>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Stock, mouvements et analyses des marchandises.
                </p>
              </div>

              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Filter className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <h4 className="font-medium text-orange-900 dark:text-orange-100">
                    Personnalisé
                  </h4>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Créez vos propres rapports avec des critères spécifiques.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
