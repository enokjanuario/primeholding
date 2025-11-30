import { forwardRef } from 'react'
import Loader from './Loader'

const variants = {
  primary: 'bg-prime-gold hover:bg-prime-gold-light text-dark-bg font-semibold',
  secondary: 'bg-dark-card hover:bg-dark-border text-text-primary border border-dark-border',
  outline: 'bg-transparent hover:bg-dark-card text-prime-gold border border-prime-gold hover:border-prime-gold-light',
  ghost: 'bg-transparent hover:bg-dark-card text-text-secondary hover:text-text-primary',
  danger: 'bg-red-600 hover:bg-red-700 text-white font-semibold',
  success: 'bg-green-600 hover:bg-green-700 text-white font-semibold',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-input transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-prime-gold focus:ring-offset-2 focus:ring-offset-dark-bg
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader size="sm" />
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
