import { useState, useEffect } from 'react'
import { FileText, Download, Calendar, Filter } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Select from '../../components/ui/Select'
import Loader from '../../components/ui/Loader'
import Alert from '../../components/ui/Alert'
import relatoriosService from '../../services/relatorios'
import { RELATORIO_TIPOS } from '../../utils/constants'
import { formatDate } from '../../utils/formatters'

function Relatorios() {
  const [relatorios, setRelatorios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')

  useEffect(() => {
    loadRelatorios()
  }, [filtroTipo])

  const loadRelatorios = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await relatoriosService.listar(
        filtroTipo ? { tipo: filtroTipo } : {}
      )
      setRelatorios(response.dados || [])
    } catch (err) {
      setError(err.message || 'Erro ao carregar relatórios')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (relatorio) => {
    try {
      // Registrar download e abrir arquivo
      await relatoriosService.registrarDownload(relatorio._id)
      window.open(relatorio.arquivoPdf, '_blank')
    } catch (err) {
      // Mesmo com erro, tenta abrir o arquivo
      window.open(relatorio.arquivoPdf, '_blank')
    }
  }

  const getTipoBadgeColor = (tipo) => {
    switch (tipo) {
      case 'Relatório Mensal':
        return 'primary'
      case 'Relatório Trimestral':
        return 'info'
      case 'Relatório Anual':
        return 'success'
      case 'Declaração de Rendimentos':
        return 'warning'
      default:
        return 'default'
    }
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-montserrat text-2xl font-bold text-text-primary">
            Relatórios e Documentos
          </h1>
          <p className="text-text-secondary mt-1">
            Acesse seus relatórios e documentos
          </p>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-3">
          <Filter size={18} className="text-text-muted" />
          <Select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            options={RELATORIO_TIPOS}
            placeholder="Todos os tipos"
            containerClassName="w-48"
          />
        </div>
      </div>

      {error && (
        <Alert variant="error" message={error} className="mb-6" />
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : relatorios.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-text-muted mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Nenhum relatório encontrado
            </h3>
            <p className="text-text-secondary">
              {filtroTipo
                ? 'Não há relatórios deste tipo disponíveis.'
                : 'Você ainda não possui relatórios disponíveis.'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatorios.map((relatorio) => (
            <Card
              key={relatorio._id}
              hover
              className="cursor-pointer"
              onClick={() => handleDownload(relatorio)}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText size={24} className="text-red-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary truncate">
                    {relatorio.titulo}
                  </h3>

                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={getTipoBadgeColor(relatorio.tipo)}
                      size="sm"
                    >
                      {relatorio.tipo}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-sm text-text-muted">
                    <Calendar size={14} />
                    <span>{formatDate(relatorio.dataPublicacao)}</span>
                  </div>

                  {relatorio.descricao && (
                    <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                      {relatorio.descricao}
                    </p>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload(relatorio)
                  }}
                  className="flex-shrink-0 p-2 text-prime-gold hover:text-prime-gold-light hover:bg-prime-gold/10 rounded-md transition-colors"
                  title="Baixar PDF"
                >
                  <Download size={20} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Relatorios
