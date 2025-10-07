import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  children: React.ReactNode
  error?: string
  success?: string
  hint?: string
  required?: boolean
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  error,
  success,
  hint,
  required = false,
  className
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('space-y-2', className)}
    >
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {children}
        
        {/* Icônes de statut */}
        {error && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <AlertCircle className="h-4 w-4 text-red-500" />
          </motion.div>
        )}
        
        {success && !error && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <CheckCircle className="h-4 w-4 text-green-500" />
          </motion.div>
        )}
      </div>

      {/* Messages d'aide */}
      {hint && !error && !success && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"
        >
          <Info className="h-3 w-3" />
          {hint}
        </motion.p>
      )}

      {/* Messages d'erreur */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
        >
          <AlertCircle className="h-3 w-3" />
          {error}
        </motion.p>
      )}

      {/* Messages de succès */}
      {success && !error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1"
        >
          <CheckCircle className="h-3 w-3" />
          {success}
        </motion.p>
      )}
    </motion.div>
  )
}

// Composant Input amélioré
interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  hint?: string
  required?: boolean
  icon?: React.ReactNode
  onIconClick?: () => void
}

export const EnhancedInput: React.FC<EnhancedInputProps> = ({
  label,
  error,
  success,
  hint,
  required,
  icon,
  onIconClick,
  className,
  ...props
}) => {
  const inputElement = (
    <input
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
        error && 'border-red-500 focus-visible:ring-red-500',
        success && !error && 'border-green-500 focus-visible:ring-green-500',
        icon && 'pr-10',
        className
      )}
      {...props}
    />
  )

  if (label) {
    return (
      <FormField
        label={label}
        error={error}
        success={success}
        hint={hint}
        required={required}
      >
        <div className="relative">
          {inputElement}
          {icon && (
            <button
              type="button"
              onClick={onIconClick}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {icon}
            </button>
          )}
        </div>
      </FormField>
    )
  }

  return (
    <div className="relative">
      {inputElement}
      {icon && (
        <button
          type="button"
          onClick={onIconClick}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          {icon}
        </button>
      )}
    </div>
  )
}

// Composant Textarea amélioré
interface EnhancedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  success?: string
  hint?: string
  required?: boolean
  autoResize?: boolean
}

export const EnhancedTextarea: React.FC<EnhancedTextareaProps> = ({
  label,
  error,
  success,
  hint,
  required,
  autoResize = true,
  className,
  ...props
}) => {
  const textareaElement = (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none',
        error && 'border-red-500 focus-visible:ring-red-500',
        success && !error && 'border-green-500 focus-visible:ring-green-500',
        className
      )}
      onInput={(e) => {
        if (autoResize) {
          const target = e.target as HTMLTextAreaElement
          target.style.height = 'auto'
          target.style.height = target.scrollHeight + 'px'
        }
      }}
      {...props}
    />
  )

  if (label) {
    return (
      <FormField
        label={label}
        error={error}
        success={success}
        hint={hint}
        required={required}
      >
        {textareaElement}
      </FormField>
    )
  }

  return textareaElement
}

