import { forwardRef } from 'react'

const variants = {
  primary:
    'bg-accent-teal text-white hover:bg-accent-teal/90 font-semibold shadow-sm',
  secondary:
    'bg-white text-text-primary hover:bg-ocean-900 border border-ocean-700 shadow-sm',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-ocean-800',
  danger:
    'bg-accent-danger/10 text-accent-danger hover:bg-accent-danger/20 border border-accent-danger/20',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-base rounded-xl',
  lg: 'px-7 py-3.5 text-lg rounded-xl',
}

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className = '', children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-1.5 font-body font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})

export default Button
