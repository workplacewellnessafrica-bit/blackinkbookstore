import React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'danger'
  size?: 'default' | 'sm' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    let classes = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 '
    
    if (variant === 'default') classes += 'bg-accent text-background hover:bg-accent/90 '
    if (variant === 'outline') classes += 'border border-border bg-transparent hover:bg-black/5 '
    if (variant === 'ghost') classes += 'hover:bg-black/5 hover:text-accent '
    if (variant === 'danger') classes += 'bg-error text-white hover:bg-error/90 '

    if (size === 'default') classes += 'h-10 px-4 py-2 '
    if (size === 'sm') classes += 'h-9 rounded-md px-3 '
    if (size === 'lg') classes += 'h-12 rounded-md px-8 text-lg '

    return (
      <button ref={ref} className={classes + className} {...props} />
    )
  }
)
Button.displayName = "Button"
