import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  error?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-8 text-sm px-3',
  md: 'h-10 text-sm px-3',
  lg: 'h-12 text-base px-4'
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Sélectionner...',
  disabled = false,
  className,
  error = false,
  size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === value)

  // Fermer le select quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div ref={selectRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          sizeClasses[size],
          error && 'border-red-500 focus:ring-red-500',
          isOpen && 'ring-2 ring-ring ring-offset-2'
        )}
      >
        <span className={cn(
          'truncate',
          !selectedOption && 'text-muted-foreground'
        )}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 opacity-50" />
        </motion.div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                Aucune option disponible
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  disabled={option.disabled}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                    option.disabled && 'opacity-50 cursor-not-allowed',
                    value === option.value && 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {value === option.value && (
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  )}
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Composant SelectGroup pour grouper les options
export const SelectGroup: React.FC<{
  label: string
  children: React.ReactNode
}> = ({ label, children }) => (
  <div className="px-3 py-2">
    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
      {label}
    </div>
    <div className="space-y-1">
      {children}
    </div>
  </div>
)

// Composant SelectItem pour les options individuelles
export const SelectItem: React.FC<{
  value: string
  children: React.ReactNode
  disabled?: boolean
}> = ({ value, children, disabled = false }) => (
  <button
    type="button"
    disabled={disabled}
    className={cn(
      'w-full flex items-center px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded',
      disabled && 'opacity-50 cursor-not-allowed'
    )}
  >
    {children}
  </button>
)

