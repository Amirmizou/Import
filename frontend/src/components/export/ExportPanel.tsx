import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileJson, 
  Database,
  Calendar,
  Filter,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select, SelectOption } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Badge, BadgeGroup } from '@/components/ui/Badge'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { formatDate } from '@/lib/utils'

interface ExportOptions {
  format: 'csv' | 'excel' | 'json' | 'pdf'
  dataType: 'voyages' | 'configurations' | 'all'
  dateFrom: string
  dateTo: string
  includeCalculations: boolean
  includeImages: boolean
}

interface ExportJob {
  id: string
  name: string
  format: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  createdAt: string
  completedAt?: string
  downloadUrl?: string
  error?: string
}

interface ExportPanelProps {
  className?: string
}

const formatOptions: SelectOption[] = [
  { value: 'csv', label: 'CSV (Excel compatible)' },
  { value: 'excel', label: 'Excel (.xlsx)' },
  { value: 'json', label: 'JSON' },
  { value: 'pdf', label: 'PDF' }
]

const dataTypeOptions: SelectOption[] = [
  { value: 'voyages', label: 'Voyages uniquement' },
  { value: 'configurations', label: 'Configurations uniquement' },
  { value: 'all', label: 'Toutes les données' }
]

const mockExportJobs: ExportJob[] = [
  {
    id: '1',
    name: 'Export voyages - Janvier 2024',
    format: 'excel',
    status: 'completed',
    progress: 100,
    createdAt: '2024-01-31T10:30:00Z',
    completedAt: '2024-01-31T10:32:00Z',
    downloadUrl: '/downloads/voyages-janvier-2024.xlsx'
  },
  {
    id: '2',
    name: 'Export complet - Q4 2023',
    format: 'csv',
    status: 'processing',
    progress: 65,
    createdAt: '2024-01-31T11:00:00Z'
  },
  {
    id: '3',
    name: 'Export configurations',
    format: 'json',
    status: 'error',
    progress: 0,
    createdAt: '2024-01-31T11:15:00Z',
    error: 'Erreur de connexion à la base de données'
  }
]

export const ExportPanel: React.FC<ExportPanelProps> = ({ className }) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dataType: 'voyages',
    dateFrom: '',
    dateTo: '',
    includeCalculations: true,
    includeImages: false
  })
  
  const [isExporting, setIsExporting] = useState(false)
  const [exportJobs] = useState<ExportJob[]>(mockExportJobs)

  const updateExportOption = (key: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({ ...prev, [key]: value }))
  }

  const handleExport = async () => {
    setIsExporting(true)
    
    // Simuler l'export
    setTimeout(() => {
      setIsExporting(false)
      // Ici, vous pourriez déclencher l'export réel
    }, 3000)
  }

  const handleDownload = (jobId: string) => {
    const job = exportJobs.find(j => j.id === jobId)
    if (job?.downloadUrl) {
      // Simuler le téléchargement
      console.log(`Téléchargement: ${job.downloadUrl}`)
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv':
      case 'excel':
        return <FileSpreadsheet className="h-4 w-4" />
      case 'json':
        return <FileJson className="h-4 w-4" />
      case 'pdf':
        return <FileText className="h-4 w-4" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Terminé</Badge>
      case 'processing':
        return <Badge variant="warning">En cours</Badge>
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>
      default:
        return <Badge variant="secondary">En attente</Badge>
    }
  }

  const getDataTypeLabel = (type: string) => {
    return dataTypeOptions.find(t => t.value === type)?.label || type
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration d'export */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Exporter les données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Format d'export
                </label>
                <Select
                  options={formatOptions}
                  value={exportOptions.format}
                  onChange={(value) => updateExportOption('format', value)}
                  placeholder="Sélectionner un format"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type de données
                </label>
                <Select
                  options={dataTypeOptions}
                  value={exportOptions.dataType}
                  onChange={(value) => updateExportOption('dataType', value)}
                  placeholder="Sélectionner le type de données"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Période
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Date de début
                    </label>
                    <Input
                      type="date"
                      value={exportOptions.dateFrom}
                      onChange={(e) => updateExportOption('dateFrom', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Date de fin
                    </label>
                    <Input
                      type="date"
                      value={exportOptions.dateTo}
                      onChange={(e) => updateExportOption('dateTo', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Inclure les calculs
                  </label>
                  <input
                    type="checkbox"
                    checked={exportOptions.includeCalculations}
                    onChange={(e) => updateExportOption('includeCalculations', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Inclure les images
                  </label>
                  <input
                    type="checkbox"
                    checked={exportOptions.includeImages}
                    onChange={(e) => updateExportOption('includeImages', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>

              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Export en cours...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Historique des exports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Historique des exports
              </CardTitle>
            </CardHeader>
            <CardContent>
              {exportJobs.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Aucun export disponible
                </div>
              ) : (
                <div className="space-y-3">
                  {exportJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getFormatIcon(job.format)}
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            {job.name}
                          </h4>
                        </div>
                        {getStatusBadge(job.status)}
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {formatDate(new Date(job.createdAt))}
                        {job.completedAt && (
                          <>
                            <span className="mx-2">•</span>
                            Terminé: {formatDate(new Date(job.completedAt))}
                          </>
                        )}
                      </div>

                      {job.status === 'processing' && (
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                            <span>Progression</span>
                            <span>{job.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {job.status === 'error' && job.error && (
                        <Alert variant="destructive" className="mb-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            {job.error}
                          </AlertDescription>
                        </Alert>
                      )}

                      {job.status === 'completed' && job.downloadUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(job.id)}
                          className="w-full"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Informations sur les formats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Formats d'export disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FileSpreadsheet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    CSV/Excel
                  </h4>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Compatible avec Excel, Google Sheets et autres tableurs.
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FileJson className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h4 className="font-medium text-green-900 dark:text-green-100">
                    JSON
                  </h4>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Format structuré pour l'intégration avec d'autres systèmes.
                </p>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <h4 className="font-medium text-red-900 dark:text-red-100">
                    PDF
                  </h4>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Rapports formatés pour l'impression et le partage.
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h4 className="font-medium text-purple-900 dark:text-purple-100">
                    Sauvegarde
                  </h4>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Sauvegarde complète de toutes vos données.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

