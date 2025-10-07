import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = "DZD"): string {
  // Pour le Dinar Algérien, on utilise un formatage personnalisé
  if (currency === "DZD" || currency === "DA") {
    return new Intl.NumberFormat("fr-DZ", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + " DA"
  }
  
  return new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("fr-FR").format(num)
}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("fr-DZ", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " DA"
}