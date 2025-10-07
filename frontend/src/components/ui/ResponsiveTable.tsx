import * as React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveTableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const ResponsiveTable = React.forwardRef<HTMLDivElement, ResponsiveTableProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700",
          className
        )}
        {...props}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            {children}
          </table>
        </div>
      </div>
    )
  }
)
ResponsiveTable.displayName = "ResponsiveTable"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700",
      className
    )}
    {...props}
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-gray-200 dark:divide-gray-700", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "px-3 sm:px-4 lg:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-900 dark:text-gray-100",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

// Mobile Card View Component
interface MobileCardProps {
  data: Record<string, any>
  columns: Array<{
    key: string
    label: string
    render?: (value: any, row: any) => React.ReactNode
  }>
  className?: string
}

const MobileCard = React.forwardRef<HTMLDivElement, MobileCardProps>(
  ({ data, columns, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2",
          className
        )}
        {...props}
      >
        {columns.map((column) => (
          <div key={column.key} className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {column.label}:
            </span>
            <span className="text-sm text-gray-900 dark:text-gray-100 text-right">
              {column.render ? column.render(data[column.key], data) : data[column.key]}
            </span>
          </div>
        ))}
      </div>
    )
  }
)
MobileCard.displayName = "MobileCard"

export {
  ResponsiveTable,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  MobileCard,
}
