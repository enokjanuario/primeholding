const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-3',
  xl: 'w-14 h-14 border-4',
}

function Loader({ size = 'md', className = '' }) {
  return (
    <div
      className={`
        ${sizes[size]}
        rounded-full
        border-prime-gold-dark
        border-t-prime-gold
        animate-spin
        ${className}
      `}
      role="status"
      aria-label="Carregando"
    />
  )
}

// Loader de tela cheia
export function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-dark-bg flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <Loader size="xl" />
        <p className="text-text-secondary">Carregando...</p>
      </div>
    </div>
  )
}

// Skeleton para loading de cards
export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-dark-card border border-dark-border rounded-card p-4 ${className}`}>
      <div className="skeleton h-4 w-1/3 rounded mb-3" />
      <div className="skeleton h-8 w-1/2 rounded mb-2" />
      <div className="skeleton h-3 w-2/3 rounded" />
    </div>
  )
}

// Skeleton para loading de tabelas
export function SkeletonTable({ rows = 5, columns = 4 }) {
  return (
    <div className="overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 p-4 border-b border-dark-border">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="skeleton h-4 flex-1 rounded" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4 border-b border-dark-border">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="skeleton h-4 flex-1 rounded" />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Loader
