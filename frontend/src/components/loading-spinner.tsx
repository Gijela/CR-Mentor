import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  className?: string
}

export function LoadingSpinner({ className = "" }: LoadingSpinnerProps) {
  return (
    <div className="flex justify-center p-8">
      <Loader2 className={`h-6 w-6 animate-spin text-muted-foreground ${className}`} />
    </div>
  )
} 