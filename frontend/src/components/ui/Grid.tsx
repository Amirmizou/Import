import * as React from "react"
import { cn } from "@/lib/utils"

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: "sm" | "md" | "lg" | "xl"
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap = "md", ...props }, ref) => {
    const gridCols = {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
      6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
    }

    const gridGap = {
      sm: "gap-2 sm:gap-3",
      md: "gap-3 sm:gap-4 lg:gap-6",
      lg: "gap-4 sm:gap-6 lg:gap-8",
      xl: "gap-6 sm:gap-8 lg:gap-10",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          gridCols[cols],
          gridGap[gap],
          className
        )}
        {...props}
      />
    )
  }
)
Grid.displayName = "Grid"

export { Grid }
