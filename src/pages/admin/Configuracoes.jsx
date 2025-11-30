import { useState } from 'react'
import { Save, Mail, Settings, Bell, Shield } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Alert from '../../components/ui/Alert'

function Configuracoes() {
  const [activeTab, setActiveTab] = useState('sistema')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Configurações de Sistema
  const [configSistema, setConfigSistema] = useState({
    diasMinResgate: '7',
    scpsDisponiveis: 'SCP 1, SCP 2, SCP 3',
    valorMinimoAporte: '1000',
    valorMinimoResgate: '500',
  })

  // Configurações de Email
  const [configEmail, setConfigEmail] = useState({
    emailAdmin: 'admin@primeholding.com.br',
    emailSuporte: 'suporte@primeholding.com.br',
    nomeRemetente: 'Prime Holding Investimentos',
  })

  // Configurações de Notificações
  const [configNotificacoes, setConfigNotificacoes] = useState({
    notificarNovoAporte: true,
    notificarNovoResgate: true,
    notificarAporteAprovado: true,
    notificarResgateAprovado: true,
    notificarNovoRelatorio: true,
  })

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // TODO: Implementar chamada à API para salvar configurações
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess('Configurações salvas com sucesso!')
    } catch (err) {
      setError(err.message || 'Erro ao salvar configurações')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'sistema', label: 'Sistema', icon: Settings },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
  ]

  return (
    <div className="animate-fadeIn">
      <h1 className="font-montserrat text-2xl font-bold text-text-primary mb-6">
        Configurações
      </h1>

      {error && (
        <Alert variant="error" message={error} onClose={() => setError('')} className="mb-4" />
      )}
      {success && (
        <Alert variant="success" message={success} onClose={() => setSuccess('')} autoClose className="mb-4" />
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md whitespace-nowrap transition-colors
              ${activeTab === tab.id
                ? 'bg-prime-gold/10 text-prime-gold border border-prime-gold/30'
                : 'text-text-secondary hover:text-text-primary hover:bg-dark-card'
              }
            `}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Configurações de Sistema */}
      {activeTab === 'sistema' && (
        <Card>
          <h3 className="font-semibold text-text-primary mb-4">Configurações do Sistema</h3>
          <div className="space-y-4 max-w-md">
            <Input
              label="Dias Mínimos para Resgate"
              type="number"
              value={configSistema.diasMinResgate}
              onChange={(e) => setConfigSistema(prev => ({ ...prev, diasMinResgate: e.target.value }))}
              helperText="Prazo mínimo (D+X) para solicitações de resgate"
            />
            <Input
              label="SCPs Disponíveis"
              value={configSistema.scpsDisponiveis}
              onChange={(e) => setConfigSistema(prev => ({ ...prev, scpsDisponiveis: e.target.value }))}
              helperText="Separe por vírgula"
            />
            <Input
              label="Valor Mínimo para Aporte (R$)"
              type="number"
              value={configSistema.valorMinimoAporte}
              onChange={(e) => setConfigSistema(prev => ({ ...prev, valorMinimoAporte: e.target.value }))}
            />
            <Input
              label="Valor Mínimo para Resgate (R$)"
              type="number"
              value={configSistema.valorMinimoResgate}
              onChange={(e) => setConfigSistema(prev => ({ ...prev, valorMinimoResgate: e.target.value }))}
            />
          </div>
          <div className="mt-6">
            <Button leftIcon={<Save size={18} />} onClick={handleSave} loading={loading}>
              Salvar Configurações
            </Button>
          </div>
        </Card>
      )}

      {/* Configurações de Email */}
      {activeTab === 'email' && (
        <Card>
          <h3 className="font-semibold text-text-primary mb-4">Configurações de Email</h3>
          <div className="space-y-4 max-w-md">
            <Input
              label="Email do Administrador"
              type="email"
              value={configEmail.emailAdmin}
              onChange={(e) => setConfigEmail(prev => ({ ...prev, emailAdmin: e.target.value }))}
              helperText="Recebe notificações administrativas"
            />
            <Input
              label="Email de Suporte"
              type="email"
              value={configEmail.emailSuporte}
              onChange={(e) => setConfigEmail(prev => ({ ...prev, emailSuporte: e.target.value }))}
              helperText="Email exibido para contato"
            />
            <Input
              label="Nome do Remetente"
              value={configEmail.nomeRemetente}
              onChange={(e) => setConfigEmail(prev => ({ ...prev, nomeRemetente: e.target.value }))}
              helperText="Nome exibido nos emails enviados"
            />
          </div>
          <div className="mt-6">
            <Button leftIcon={<Save size={18} />} onClick={handleSave} loading={loading}>
              Salvar Configurações
            </Button>
          </div>
        </Card>
      )}

      {/* Configurações de Notificações */}
      {activeTab === 'notificacoes' && (
        <Card>
          <h3 className="font-semibold text-text-primary mb-4">Configurações de Notificações</h3>
          <p className="text-sm text-text-muted mb-4">
            Configure quais eventos devem gerar notificações automáticas para os investidores.
          </p>
          <div className="space-y-3 max-w-md">
            {[
              { key: 'notificarNovoAporte', label: 'Novo aporte registrado' },
              { key: 'notificarNovoResgate', label: 'Novo resgate solicitado' },
              { key: 'notificarAporteAprovado', label: 'Aporte aprovado/negado' },
              { key: 'notificarResgateAprovado', label: 'Resgate aprovado/concluído' },
              { key: 'notificarNovoRelatorio', label: 'Novo relatório publicado' },
            ].map((item) => (
              <label key={item.key} className="flex items-center gap-3 cursor-pointer p-3 rounded-md hover:bg-dark-bg transition-colors">
                <input
                  type="checkbox"
                  checked={configNotificacoes[item.key]}
                  onChange={(e) => setConfigNotificacoes(prev => ({
                    ...prev,
                    [item.key]: e.target.checked,
                  }))}
                  className="w-4 h-4 rounded border-dark-border bg-dark-input text-prime-gold focus:ring-prime-gold"
                />
                <span className="text-text-primary">{item.label}</span>
              </label>
            ))}
          </div>
          <div className="mt-6">
            <Button leftIcon={<Save size={18} />} onClick={handleSave} loading={loading}>
              Salvar Configurações
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Configuracoes
