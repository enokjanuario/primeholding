import { useState } from 'react'
import { Bell, Check, CheckCheck, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Loader from '../../components/ui/Loader'
import Alert from '../../components/ui/Alert'
import { useNotificacoes } from '../../hooks/useNotificacoes'
import { formatRelativeDate } from '../../utils/formatters'

function Notificacoes() {
  const {
    notificacoes,
    loading,
    error,
    marcarComoLida,
    marcarTodasComoLidas,
    refresh,
  } = useNotificacoes()

  const [actionLoading, setActionLoading] = useState(false)

  const handleMarcarComoLida = async (id) => {
    try {
      await marcarComoLida(id)
    } catch (err) {
      console.error('Erro ao marcar como lida:', err)
    }
  }

  const handleMarcarTodasComoLidas = async () => {
    setActionLoading(true)
    try {
      await marcarTodasComoLidas()
    } catch (err) {
      console.error('Erro ao marcar todas como lidas:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const getNotificacaoIcon = (tipo) => {
    switch (tipo) {
      case 'aporte':
        return '💰'
      case 'resgate':
        return '💸'
      case 'relatorio':
        return '📄'
      default:
        return '🔔'
    }
  }

  const getNotificacaoLink = (notificacao) => {
    switch (notificacao.tipo) {
      case 'aporte':
        return '/historico'
      case 'resgate':
        return '/historico'
      case 'relatorio':
        return '/relatorios'
      default:
        return null
    }
  }

  const naoLidas = notificacoes.filter(n => !n.lida)

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-montserrat text-2xl font-bold text-text-primary">
            Notificações
          </h1>
          <p className="text-text-secondary mt-1">
            {naoLidas.length > 0
              ? `Você tem ${naoLidas.length} notificação(ões) não lida(s)`
              : 'Todas as notificações foram lidas'}
          </p>
        </div>

        {naoLidas.length > 0 && (
          <Button
            variant="outline"
            leftIcon={<CheckCheck size={18} />}
            onClick={handleMarcarTodasComoLidas}
            loading={actionLoading}
          >
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="error" message={error} className="mb-6" />
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : notificacoes.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Bell size={48} className="mx-auto text-text-muted mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Nenhuma notificação
            </h3>
            <p className="text-text-secondary">
              Você não possui notificações no momento.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {notificacoes.map((notificacao) => {
            const link = getNotificacaoLink(notificacao)

            return (
              <Card
                key={notificacao._id}
                className={`
                  transition-all duration-200
                  ${!notificacao.lida ? 'border-l-4 border-l-prime-gold' : ''}
                `}
                hover
              >
                <div
                  className="flex items-start gap-4 cursor-pointer"
                  onClick={() => {
                    if (!notificacao.lida) {
                      handleMarcarComoLida(notificacao._id)
                    }
                  }}
                >
                  <div className="text-2xl flex-shrink-0">
                    {getNotificacaoIcon(notificacao.tipo)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={`font-semibold ${
                          notificacao.lida ? 'text-text-secondary' : 'text-text-primary'
                        }`}>
                          {notificacao.titulo}
                        </h3>
                        <p className={`text-sm mt-1 ${
                          notificacao.lida ? 'text-text-muted' : 'text-text-secondary'
                        }`}>
                          {notificacao.mensagem}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notificacao.lida && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMarcarComoLida(notificacao._id)
                            }}
                            className="p-1.5 text-text-muted hover:text-prime-gold hover:bg-prime-gold/10 rounded-md transition-colors"
                            title="Marcar como lida"
                          >
                            <Check size={16} />
                          </button>
                        )}

                        {link && (
                          <Link
                            to={link}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (!notificacao.lida) {
                                handleMarcarComoLida(notificacao._id)
                              }
                            }}
                            className="p-1.5 text-text-muted hover:text-prime-gold hover:bg-prime-gold/10 rounded-md transition-colors"
                            title="Ver detalhes"
                          >
                            <ExternalLink size={16} />
                          </Link>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-text-muted mt-2">
                      {formatRelativeDate(notificacao._createdDate)}
                    </p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Notificacoes
