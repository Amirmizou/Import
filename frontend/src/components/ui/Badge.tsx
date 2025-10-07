import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const variantClasses = {
  default: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  destructive: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  outline: 'border border-gray-200 text-gray-800 dark:border-gray-700 dark:text-gray-300',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400'
}

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1.5 text-sm',
  lg: 'px-3 py-2 text-base'
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  )
}

// Composant BadgeGroup pour grouper plusieurs badges
export const BadgeGroup: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <div className={cn('flex flex-wrap gap-2', className)}>
    {children}
  </div>
)

