import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, X, Calendar, MapPin, DollarSign } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select, SelectOption } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge, BadgeGroup } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

export interface VoyageFilters {
  search: string
  destination: string
  status: string
  dateFrom: string
  dateTo: string
  minBenefice: string
  maxBenefice: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

interface VoyageFiltersProps {
  filters: VoyageFilters
  onFiltersChange: (filters: VoyageFilters) => void
  onClearFilters: () => void
  className?: string
}

const statusOptions: SelectOption[] = [
  { value: '', label: 'Tous les statuts' },
  { value: 'planifie', label: 'Planifié' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'termine', label: 'Terminé' },
  { value: 'annule', label: 'Annulé' }
]

const sortOptions: SelectOption[] = [
  { value: 'date', label: 'Date' },
  { value: 'destination', label: 'Destination' },
  { value: 'benefice', label: 'Bénéfice' },
  { value: 'roi', label: 'ROI' },
  { value: 'createdAt', label: 'Date de création' }
]

export const VoyageFilters: React.FC<VoyageFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: keyof VoyageFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== 'date' && value !== 'desc'
  )

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.destination) count++
    if (filters.status) count++
    if (filters.dateFrom || filters.dateTo) count++
    if (filters.minBenefice || filters.maxBenefice) count++
    return count
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et recherche
            {hasActiveFilters && (
              <Badge variant="secondary">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                <X className="h-4 w-4 mr-2" />
                Effacer
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Réduire' : 'Étendre'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Recherche principale */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par destination, marchandise..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtres de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Destination
            </label>
            <Input
              placeholder="Dubaï, Istanbul..."
              value={filters.destination}
              onChange={(e) => updateFilter('destination', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Statut
            </label>
            <Select
              options={statusOptions}
              value={filters.status}
              onChange={(value) => updateFilter('status', value)}
              placeholder="Sélectionner un statut"
            />
          </div>
        </div>

        {/* Filtres avancés */}
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Filtres par date */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Période
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Date de début
                  </label>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => updateFilter('dateFrom', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Date de fin
                  </label>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => updateFilter('dateTo', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Filtres par bénéfice */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Bénéfice
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Bénéfice minimum (DA)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minBenefice}
                    onChange={(e) => updateFilter('minBenefice', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Bénéfice maximum (DA)
                  </label>
                  <Input
                    type="number"
                    placeholder="∞"
                    value={filters.maxBenefice}
                    onChange={(e) => updateFilter('maxBenefice', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Tri */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Tri
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Trier par
                  </label>
                  <Select
                    options={sortOptions}
                    value={filters.sortBy}
                    onChange={(value) => updateFilter('sortBy', value)}
                    placeholder="Sélectionner un critère"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Ordre
                  </label>
                  <Select
                    options={[
                      { value: 'desc', label: 'Décroissant' },
                      { value: 'asc', label: 'Croissant' }
                    ]}
                    value={filters.sortOrder}
                    onChange={(value) => updateFilter('sortOrder', value as 'asc' | 'desc')}
                    placeholder="Sélectionner un ordre"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filtres actifs */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filtres actifs
            </h4>
            <BadgeGroup>
              {filters.search && (
                <Badge variant="info" className="flex items-center gap-1">
                  Recherche: {filters.search}
                  <button
                    onClick={() => updateFilter('search', '')}
                    className="ml-1 hover:bg-current/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.destination && (
                <Badge variant="info" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {filters.destination}
                  <button
                    onClick={() => updateFilter('destination', '')}
                    className="ml-1 hover:bg-current/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.status && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {statusOptions.find(s => s.value === filters.status)?.label}
                  <button
                    onClick={() => updateFilter('status', '')}
                    className="ml-1 hover:bg-current/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {(filters.dateFrom || filters.dateTo) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {filters.dateFrom && formatDate(new Date(filters.dateFrom))}
                  {filters.dateFrom && filters.dateTo && ' - '}
                  {filters.dateTo && formatDate(new Date(filters.dateTo))}
                  <button
                    onClick={() => {
                      updateFilter('dateFrom', '')
                      updateFilter('dateTo', '')
                    }}
                    className="ml-1 hover:bg-current/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </BadgeGroup>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
