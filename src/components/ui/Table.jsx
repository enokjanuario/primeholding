import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import Loader from './Loader'

function Table({
  columns,
  data,
  loading = false,
  emptyMessage = 'Nenhum registro encontrado',
  onRowClick,
  selectedRows = [],
  onSelectRow,
  selectable = false,
  className = '',
}) {
  const handleSelectAll = (e) => {
    if (!onSelectRow) return
    if (e.target.checked) {
      onSelectRow(data.map(row => row.id || row._id))
    } else {
      onSelectRow([])
    }
  }

  const handleSelectRow = (id) => {
    if (!onSelectRow) return
    if (selectedRows.includes(id)) {
      onSelectRow(selectedRows.filter(rowId => rowId !== id))
    } else {
      onSelectRow([...selectedRows, id])
    }
  }

  const allSelected = data.length > 0 && selectedRows.length === data.length

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-dark-border">
            {selectable && (
              <th className="px-4 py-3 text-left w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-dark-border bg-dark-input text-prime-gold focus:ring-prime-gold focus:ring-offset-dark-bg"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  px-4 py-3 text-left text-sm font-semibold text-text-secondary uppercase tracking-wider
                  ${column.className || ''}
                `}
                style={{ width: column.width }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-border">
          {loading ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-12 text-center">
                <Loader size="lg" />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-12 text-center text-text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const rowId = row.id || row._id
              const isSelected = selectedRows.includes(rowId)

              return (
                <tr
                  key={rowId || rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`
                    transition-colors
                    ${onRowClick ? 'cursor-pointer hover:bg-dark-border/50' : ''}
                    ${isSelected ? 'bg-prime-gold/10' : ''}
                  `}
                >
                  {selectable && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(rowId)}
                        className="w-4 h-4 rounded border-dark-border bg-dark-input text-prime-gold focus:ring-prime-gold focus:ring-offset-dark-bg"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-3 text-sm text-text-primary ${column.cellClassName || ''}`}
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

// Componente de paginação
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = '',
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className={`flex items-center justify-between px-4 py-3 border-t border-dark-border ${className}`}>
      <div className="text-sm text-text-muted">
        Mostrando <span className="font-medium text-text-primary">{startItem}</span> a{' '}
        <span className="font-medium text-text-primary">{endItem}</span> de{' '}
        <span className="font-medium text-text-primary">{totalItems}</span> resultados
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Primeira página"
        >
          <ChevronsLeft size={18} />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="px-3 py-1 text-sm text-text-primary">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Próxima página"
        >
          <ChevronRight size={18} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Última página"
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  )
}

export default Table
