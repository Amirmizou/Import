import * as React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
  gap?: "sm" | "md" | "lg" | "xl"
  autoFit?: boolean
  minWidth?: string
}

const ResponsiveGrid = React.forwardRef<HTMLDivElement, ResponsiveGridProps>(
  ({ 
    className, 
    cols = { default: 1, sm: 2, lg: 3 }, 
    gap = "md", 
    autoFit = false,
    minWidth = "280px",
    ...props 
  }, ref) => {
    const gridGap = {
      sm: "gap-2 sm:gap-3",
      md: "gap-3 sm:gap-4 lg:gap-6",
      lg: "gap-4 sm:gap-6 lg:gap-8",
      xl: "gap-6 sm:gap-8 lg:gap-10",
    }

    if (autoFit) {
      return (
        <div
          ref={ref}
          className={cn(
            "grid",
            gridGap[gap],
            className
          )}
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))`
          }}
          {...props}
        />
      )
    }

    const getGridCols = () => {
      const classes = []
      
      if (cols.default) classes.push(`grid-cols-${cols.default}`)
      if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`)
      if (cols.md) classes.push(`md:grid-cols-${cols.md}`)
      if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`)
      if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`)
      if (cols['2xl']) classes.push(`2xl:grid-cols-${cols['2xl']}`)
      
      return classes.join(' ')
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          getGridCols(),
          gridGap[gap],
          className
        )}
        {...props}
      />
    )
  }
)
ResponsiveGrid.displayName = "ResponsiveGrid"

export { ResponsiveGrid }
