import { forwardRef } from 'react'

const variants = {
  primary:
    'bg-accent-teal text-ocean-950 hover:bg-accent-teal/90 font-semibold shadow-[0_0_20px_rgba(0,212,170,0.15)] hover:shadow-[0_0_30px_rgba(0,212,170,0.3)]',
  secondary:
    'bg-ocean-700 text-text-primary hover:bg-ocean-600 border border-white/8',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5',
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
      className={`inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})

export default Button
