const variants = {
  default: 'bg-dark-border text-text-secondary',
  primary: 'bg-prime-gold/20 text-prime-gold border border-prime-gold/30',
  success: 'bg-green-500/20 text-green-400 border border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}

function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          variant === 'success' ? 'bg-green-400' :
          variant === 'warning' ? 'bg-yellow-400' :
          variant === 'danger' ? 'bg-red-400' :
          variant === 'info' ? 'bg-blue-400' :
          variant === 'primary' ? 'bg-prime-gold' :
          'bg-text-muted'
        }`} />
      )}
      {children}
    </span>
  )
}

// Helper para mapear status do backend para variants
export function getStatusVariant(status) {
  const statusMap = {
    'Ativo': 'success',
    'Inativo': 'danger',
    'Pendente': 'warning',
    'Em análise': 'warning',
    'Aprovado': 'success',
    'Parcialmente aprovado': 'info',
    'Negado': 'danger',
    'Concluído': 'success',
  }
  return statusMap[status] || 'default'
}

export default Badge
