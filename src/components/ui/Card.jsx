function Card({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  padding = true,
  hover = false,
  className = '',
  ...props
}) {
  return (
    <div
      className={`
        bg-dark-card border border-dark-border rounded-card
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-start justify-between p-4 border-b border-dark-border">
          <div>
            {title && (
              <h3 className="font-montserrat font-semibold text-text-primary">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-text-muted mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && (
            <div className="flex-shrink-0 ml-4">
              {headerAction}
            </div>
          )}
        </div>
      )}

      <div className={padding ? 'p-4' : ''}>
        {children}
      </div>

      {footer && (
        <div className="px-4 py-3 border-t border-dark-border bg-dark-bg/30">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card
