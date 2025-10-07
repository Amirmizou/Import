import * as React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveSpacingProps extends React.HTMLAttributes<HTMLDivElement> {
  p?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  m?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  py?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  px?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  my?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  mx?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  children: React.ReactNode
}

const ResponsiveSpacing = React.forwardRef<HTMLDivElement, ResponsiveSpacingProps>(
  ({ 
    className, 
    p, 
    m, 
    py, 
    px, 
    my, 
    mx, 
    children, 
    ...props 
  }, ref) => {
    const getSpacingClasses = (spacing: any, prefix: string) => {
      if (!spacing) return ''
      
      const classes = []
      if (spacing.default) classes.push(`${prefix}-${spacing.default}`)
      if (spacing.sm) classes.push(`sm:${prefix}-${spacing.sm}`)
      if (spacing.md) classes.push(`md:${prefix}-${spacing.md}`)
      if (spacing.lg) classes.push(`lg:${prefix}-${spacing.lg}`)
      if (spacing.xl) classes.push(`xl:${prefix}-${spacing.xl}`)
      
      return classes.join(' ')
    }

    const spacingClasses = [
      getSpacingClasses(p, 'p'),
      getSpacingClasses(m, 'm'),
      getSpacingClasses(py, 'py'),
      getSpacingClasses(px, 'px'),
      getSpacingClasses(my, 'my'),
      getSpacingClasses(mx, 'mx'),
    ].filter(Boolean).join(' ')

    return (
      <div
        ref={ref}
        className={cn(spacingClasses, className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ResponsiveSpacing.displayName = "ResponsiveSpacing"

export { ResponsiveSpacing }
