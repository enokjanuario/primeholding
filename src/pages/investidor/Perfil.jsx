import { useState, useEffect } from 'react'
import { User, CreditCard, Shield, Save } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Alert from '../../components/ui/Alert'
import { useAuth } from '../../hooks/useAuth'
import investidoresService from '../../services/investidores'
import authService from '../../services/auth'
import { TIPOS_CONTA, BANCOS, SUCCESS_MESSAGES } from '../../utils/constants'
import { formatCPF, formatPhone } from '../../utils/formatters'
import { validatePassword } from '../../utils/validators'

function Perfil() {
  const { user, refreshUser } = useAuth()

  const [activeTab, setActiveTab] = useState('pessoais')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Dados pessoais
  const [dadosPessoais, setDadosPessoais] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
  })

  // Dados bancários
  const [dadosBancarios, setDadosBancarios] = useState({
    banco: '',
    agencia: '',
    conta: '',
    tipoConta: '',
    titularConta: '',
  })

  // Alterar senha
  const [senhas, setSenhas] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
  })
  const [senhaErrors, setSenhaErrors] = useState({})

  useEffect(() => {
    if (user) {
      setDadosPessoais({
        nome: user.nome || '',
        email: user.email || '',
        cpf: user.cpf || '',
        telefone: user.telefone || '',
      })
      setDadosBancarios({
        banco: user.banco || '',
        agencia: user.agencia || '',
        conta: user.conta || '',
        tipoConta: user.tipoConta || '',
        titularConta: user.titularConta || '',
      })
    }
  }, [user])

  const handleSaveDadosPessoais = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await investidoresService.atualizarPerfil({
        telefone: dadosPessoais.telefone,
      })
      await refreshUser()
      setSuccess(SUCCESS_MESSAGES.PERFIL_ATUALIZADO)
    } catch (err) {
      setError(err.message || 'Erro ao atualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDadosBancarios = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await investidoresService.atualizarPerfil(dadosBancarios)
      await refreshUser()
      setSuccess(SUCCESS_MESSAGES.PERFIL_ATUALIZADO)
    } catch (err) {
      setError(err.message || 'Erro ao atualizar dados bancários')
    } finally {
      setLoading(false)
    }
  }

  const handleAlterarSenha = async () => {
    setSenhaErrors({})

    const { valid, errors } = validatePassword(senhas.novaSenha)
    if (!valid) {
      setSenhaErrors({ novaSenha: errors.join(', ') })
      return
    }

    if (senhas.novaSenha !== senhas.confirmarSenha) {
      setSenhaErrors({ confirmarSenha: 'As senhas não conferem' })
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await authService.alterarSenha(senhas.senhaAtual, senhas.novaSenha)
      setSuccess(SUCCESS_MESSAGES.SENHA_ALTERADA)
      setSenhas({ senhaAtual: '', novaSenha: '', confirmarSenha: '' })
    } catch (err) {
      setError(err.message || 'Erro ao alterar senha')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'pessoais', label: 'Dados Pessoais', icon: User },
    { id: 'bancarios', label: 'Dados Bancários', icon: CreditCard },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
  ]

  return (
    <div className="animate-fadeIn">
      <h1 className="font-montserrat text-2xl font-bold text-text-primary mb-6">
        Meu Perfil
      </h1>

      {/* Avatar e info básica */}
      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-prime-gold/20 flex items-center justify-center">
            <User size={32} className="text-prime-gold" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">{user?.nome}</h2>
            <p className="text-text-secondary">{user?.email}</p>
            <p className="text-sm text-text-muted mt-1">
              CPF: {formatCPF(user?.cpf)}
            </p>
          </div>
        </div>
      </Card>

      {/* Alertas */}
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

      {/* Dados Pessoais */}
      {activeTab === 'pessoais' && (
        <Card>
          <h3 className="font-semibold text-text-primary mb-4">Dados Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome Completo"
              value={dadosPessoais.nome}
              disabled
              helperText="Para alterar, entre em contato com o suporte"
            />
            <Input
              label="Email"
              value={dadosPessoais.email}
              disabled
              helperText="Para alterar, entre em contato com o suporte"
            />
            <Input
              label="CPF"
              value={formatCPF(dadosPessoais.cpf)}
              disabled
            />
            <Input
              label="Telefone"
              value={dadosPessoais.telefone}
              onChange={(e) => setDadosPessoais(prev => ({
                ...prev,
                telefone: e.target.value,
              }))}
              placeholder="(00) 00000-0000"
            />
          </div>
          <div className="mt-6">
            <Button
              leftIcon={<Save size={18} />}
              onClick={handleSaveDadosPessoais}
              loading={loading}
            >
              Salvar Alterações
            </Button>
          </div>
        </Card>
      )}

      {/* Dados Bancários */}
      {activeTab === 'bancarios' && (
        <Card>
          <h3 className="font-semibold text-text-primary mb-4">Dados Bancários</h3>
          <p className="text-sm text-text-muted mb-4">
            Estes dados serão utilizados como padrão para resgates.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Banco"
              value={dadosBancarios.banco}
              onChange={(e) => setDadosBancarios(prev => ({
                ...prev,
                banco: e.target.value,
              }))}
              options={BANCOS}
              placeholder="Selecione o banco"
            />
            <Select
              label="Tipo de Conta"
              value={dadosBancarios.tipoConta}
              onChange={(e) => setDadosBancarios(prev => ({
                ...prev,
                tipoConta: e.target.value,
              }))}
              options={TIPOS_CONTA}
              placeholder="Selecione o tipo"
            />
            <Input
              label="Agência"
              value={dadosBancarios.agencia}
              onChange={(e) => setDadosBancarios(prev => ({
                ...prev,
                agencia: e.target.value,
              }))}
              placeholder="0000"
            />
            <Input
              label="Conta"
              value={dadosBancarios.conta}
              onChange={(e) => setDadosBancarios(prev => ({
                ...prev,
                conta: e.target.value,
              }))}
              placeholder="00000-0"
            />
            <Input
              label="Titular da Conta"
              value={dadosBancarios.titularConta}
              onChange={(e) => setDadosBancarios(prev => ({
                ...prev,
                titularConta: e.target.value,
              }))}
              placeholder="Nome completo"
              containerClassName="md:col-span-2"
            />
          </div>
          <div className="mt-6">
            <Button
              leftIcon={<Save size={18} />}
              onClick={handleSaveDadosBancarios}
              loading={loading}
            >
              Salvar Dados Bancários
            </Button>
          </div>
        </Card>
      )}

      {/* Segurança */}
      {activeTab === 'seguranca' && (
        <Card>
          <h3 className="font-semibold text-text-primary mb-4">Alterar Senha</h3>
          <div className="max-w-md space-y-4">
            <Input
              label="Senha Atual"
              type="password"
              value={senhas.senhaAtual}
              onChange={(e) => setSenhas(prev => ({
                ...prev,
                senhaAtual: e.target.value,
              }))}
              placeholder="Digite sua senha atual"
            />
            <Input
              label="Nova Senha"
              type="password"
              value={senhas.novaSenha}
              onChange={(e) => setSenhas(prev => ({
                ...prev,
                novaSenha: e.target.value,
              }))}
              error={senhaErrors.novaSenha}
              placeholder="Digite a nova senha"
              helperText="Mínimo 8 caracteres, com maiúscula, minúscula, número e símbolo"
            />
            <Input
              label="Confirmar Nova Senha"
              type="password"
              value={senhas.confirmarSenha}
              onChange={(e) => setSenhas(prev => ({
                ...prev,
                confirmarSenha: e.target.value,
              }))}
              error={senhaErrors.confirmarSenha}
              placeholder="Confirme a nova senha"
            />
          </div>
          <div className="mt-6">
            <Button
              leftIcon={<Shield size={18} />}
              onClick={handleAlterarSenha}
              loading={loading}
            >
              Alterar Senha
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Perfil
