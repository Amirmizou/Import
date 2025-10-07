import * as React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveTextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'destructive'
  align?: 'left' | 'center' | 'right' | 'justify'
  truncate?: boolean
  children: React.ReactNode
}

const ResponsiveText = React.forwardRef<HTMLElement, ResponsiveTextProps>(
  ({ 
    as: Component = 'p', 
    size = 'base', 
    weight = 'normal', 
    color = 'primary',
    align = 'left',
    truncate = false,
    className, 
    children, 
    ...props 
  }, ref) => {
    const sizeClasses = {
      xs: 'text-xs sm:text-sm',
      sm: 'text-sm sm:text-base',
      base: 'text-sm sm:text-base lg:text-lg',
      lg: 'text-base sm:text-lg lg:text-xl',
      xl: 'text-lg sm:text-xl lg:text-2xl',
      '2xl': 'text-xl sm:text-2xl lg:text-3xl',
      '3xl': 'text-2xl sm:text-3xl lg:text-4xl',
      '4xl': 'text-3xl sm:text-4xl lg:text-5xl',
      '5xl': 'text-4xl sm:text-5xl lg:text-6xl',
      '6xl': 'text-5xl sm:text-6xl lg:text-7xl',
    }

    const weightClasses = {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    }

    const colorClasses = {
      primary: 'text-gray-900 dark:text-gray-100',
      secondary: 'text-gray-600 dark:text-gray-400',
      muted: 'text-gray-500 dark:text-gray-500',
      accent: 'text-blue-600 dark:text-blue-400',
      destructive: 'text-red-600 dark:text-red-400',
    }

    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    }

    return React.createElement(
      Component,
      {
        ref,
        className: cn(
          sizeClasses[size],
          weightClasses[weight],
          colorClasses[color],
          alignClasses[align],
          truncate && 'truncate',
          className
        ),
        ...props,
      },
      children
    )
  }
)
ResponsiveText.displayName = "ResponsiveText"

export { ResponsiveText }
