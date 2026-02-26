import { cn } from '@/lib/cn'
import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'destructive'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'font-display uppercase tracking-widest text-h3 px-6 py-3 transition-colors duration-150 select-none',
        'rounded-none border-0',
        {
          // primary
          'bg-ink text-parchment border-2 border-ink hover:bg-parchment hover:text-ink':
            variant === 'primary',
          // secondary
          'bg-transparent text-ink border border-ink hover:bg-surface':
            variant === 'secondary',
          // destructive
          'bg-transparent text-sienna border border-sienna hover:bg-surface':
            variant === 'destructive',
        },
        fullWidth && 'w-full',
        'disabled:opacity-40 disabled:pointer-events-none',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
