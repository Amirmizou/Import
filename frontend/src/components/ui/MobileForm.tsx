import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./Input"
import { Button } from "./Button"

interface MobileFormProps extends React.HTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent) => void
  className?: string
}

const MobileForm = React.forwardRef<HTMLFormElement, MobileFormProps>(
  ({ className, children, onSubmit, ...props }, ref) => {
    return (
      <form
        ref={ref}
        onSubmit={onSubmit}
        className={cn(
          "space-y-6 p-6 sm:p-8",
          className
        )}
        {...props}
      >
        {children}
      </form>
    )
  }
)
MobileForm.displayName = "MobileForm"

interface MobileFormFieldProps {
  label: string
  children: React.ReactNode
  error?: string
  required?: boolean
  className?: string
}

const MobileFormField = React.forwardRef<HTMLDivElement, MobileFormFieldProps>(
  ({ label, children, error, required, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-2", className)}
        {...props}
      >
        <label className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="space-y-1">
          {children}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
      </div>
    )
  }
)
MobileFormField.displayName = "MobileFormField"

interface MobileFormActionsProps {
  children: React.ReactNode
  className?: string
}

const MobileFormActions = React.forwardRef<HTMLDivElement, MobileFormActionsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
MobileFormActions.displayName = "MobileFormActions"

// Composant Input mobile optimisé
interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  required?: boolean
}

const MobileInput = React.forwardRef<HTMLInputElement, MobileInputProps>(
  ({ label, error, required, className, ...props }, ref) => {
    return (
      <MobileFormField label={label || ""} error={error} required={required}>
        <Input
          ref={ref}
          className={cn("mobile-input", className)}
          {...props}
        />
      </MobileFormField>
    )
  }
)
MobileInput.displayName = "MobileInput"

// Composant Button mobile optimisé
interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  fullWidth?: boolean
}

const MobileButton = React.forwardRef<HTMLButtonElement, MobileButtonProps>(
  ({ variant = "default", size = "default", fullWidth = false, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "mobile-button",
          fullWidth && "w-full",
          className
        )}
        {...props}
      />
    )
  }
)
MobileButton.displayName = "MobileButton"

export {
  MobileForm,
  MobileFormField,
  MobileFormActions,
  MobileInput,
  MobileButton,
}
