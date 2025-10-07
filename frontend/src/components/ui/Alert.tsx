import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

interface AlertProps {
  children: React.ReactNode
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  className?: string
  dismissible?: boolean
  onDismiss?: () => void
  showIcon?: boolean
}

const variantClasses = {
  default: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400',
  destructive: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400',
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400',
  info: 'bg-cyan-50 border-cyan-200 text-cyan-800 dark:bg-cyan-900/20 dark:border-cyan-800 dark:text-cyan-400'
}

const iconMap = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'default',
  className,
  dismissible = false,
  onDismiss,
  showIcon = true
}) => {
  const Icon = iconMap[variant]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative flex items-start gap-3 rounded-lg border p-4',
        variantClasses[variant],
        className
      )}
    >
      {showIcon && (
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      )}
      
      <div className="flex-1">
        {children}
      </div>

      {dismissible && onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="h-6 w-6 flex-shrink-0 text-current hover:bg-current/10"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </motion.div>
  )
}

// Composant AlertTitle pour le titre de l'alerte
export const AlertTitle: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <h5 className={cn('mb-1 font-medium leading-none tracking-tight', className)}>
    {children}
  </h5>
)

// Composant AlertDescription pour la description de l'alerte
export const AlertDescription: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <div className={cn('text-sm [&_p]:leading-relaxed', className)}>
    {children}
  </div>
)

