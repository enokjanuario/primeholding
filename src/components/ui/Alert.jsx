import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

const variants = {
  success: {
    bg: 'bg-green-500/10 border-green-500/30',
    icon: CheckCircle,
    iconColor: 'text-green-400',
  },
  error: {
    bg: 'bg-red-500/10 border-red-500/30',
    icon: AlertCircle,
    iconColor: 'text-red-400',
  },
  warning: {
    bg: 'bg-yellow-500/10 border-yellow-500/30',
    icon: AlertTriangle,
    iconColor: 'text-yellow-400',
  },
  info: {
    bg: 'bg-blue-500/10 border-blue-500/30',
    icon: Info,
    iconColor: 'text-blue-400',
  },
}

function Alert({
  variant = 'info',
  title,
  message,
  onClose,
  autoClose = false,
  autoCloseDelay = 3000,
  showIcon = true,
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(true)
  const config = variants[variant]
  const Icon = config.icon

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, autoCloseDelay)
      return () => clearTimeout(timer)
    }
  }, [autoClose, autoCloseDelay, onClose])

  if (!isVisible) return null

  return (
    <div
      className={`
        flex items-start gap-3 p-4 border rounded-card
        animate-slideIn
        ${config.bg}
        ${className}
      `}
      role="alert"
    >
      {showIcon && (
        <Icon className={`flex-shrink-0 w-5 h-5 mt-0.5 ${config.iconColor}`} />
      )}
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-semibold text-text-primary mb-1">{title}</h4>
        )}
        <p className="text-sm text-text-secondary">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={() => {
            setIsVisible(false)
            onClose()
          }}
          className="flex-shrink-0 p-1 rounded hover:bg-white/10 text-text-muted hover:text-text-primary transition-colors"
          aria-label="Fechar"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}

// Toast notification container
export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <Alert
          key={toast.id}
          variant={toast.variant}
          title={toast.title}
          message={toast.message}
          onClose={() => onDismiss(toast.id)}
          autoClose={toast.autoClose !== false}
          autoCloseDelay={toast.duration || 3000}
        />
      ))}
    </div>
  )
}

export default Alert
