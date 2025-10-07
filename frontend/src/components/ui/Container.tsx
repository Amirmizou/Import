import * as React from "react"
import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full"
  padding?: "none" | "sm" | "md" | "lg"
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "lg", padding = "md", ...props }, ref) => {
    const containerSizes = {
      sm: "max-w-2xl",
      md: "max-w-4xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      full: "max-w-full",
    }

    const containerPadding = {
      none: "",
      sm: "px-3 sm:px-4",
      md: "px-4 sm:px-6 lg:px-8",
      lg: "px-6 sm:px-8 lg:px-12",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full",
          containerSizes[size],
          containerPadding[padding],
          className
        )}
        {...props}
      />
    )
  }
)
Container.displayName = "Container"

export { Container }
