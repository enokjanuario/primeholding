// SCPs disponíveis
export const SCPS = [
  { value: 'SCP 1', label: 'SCP 1' },
  { value: 'SCP 2', label: 'SCP 2' },
  { value: 'SCP 3', label: 'SCP 3' },
]

// Status de aportes
export const APORTE_STATUS = {
  EM_ANALISE: 'Em análise',
  APROVADO: 'Aprovado',
  PARCIALMENTE_APROVADO: 'Parcialmente aprovado',
  NEGADO: 'Negado',
}

// Status de resgates
export const RESGATE_STATUS = {
  EM_ANALISE: 'Em análise',
  APROVADO: 'Aprovado',
  NEGADO: 'Negado',
  CONCLUIDO: 'Concluído',
}

// Status de investidores
export const INVESTIDOR_STATUS = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
  PENDENTE: 'Pendente',
}

// Tipos de movimentação
export const MOVIMENTACAO_TIPOS = {
  APORTE: 'Aporte',
  RESGATE: 'Resgate',
  LUCRO: 'Lucro',
  TRANSFERENCIA: 'Transferência',
}

// Tipos de relatório
export const RELATORIO_TIPOS = [
  { value: 'Relatório Mensal', label: 'Relatório Mensal' },
  { value: 'Relatório Trimestral', label: 'Relatório Trimestral' },
  { value: 'Relatório Anual', label: 'Relatório Anual' },
  { value: 'Declaração de Rendimentos', label: 'Declaração de Rendimentos' },
  { value: 'Contrato de Adesão', label: 'Contrato de Adesão' },
  { value: 'Termos de Uso', label: 'Termos de Uso' },
]

// Tipos de conta bancária
export const TIPOS_CONTA = [
  { value: 'Corrente', label: 'Conta Corrente' },
  { value: 'Poupança', label: 'Conta Poupança' },
]

// Bancos brasileiros principais
export const BANCOS = [
  { value: '001', label: 'Banco do Brasil' },
  { value: '033', label: 'Santander' },
  { value: '104', label: 'Caixa Econômica Federal' },
  { value: '237', label: 'Bradesco' },
  { value: '341', label: 'Itaú' },
  { value: '260', label: 'Nubank' },
  { value: '077', label: 'Inter' },
  { value: '336', label: 'C6 Bank' },
  { value: '212', label: 'Banco Original' },
  { value: '290', label: 'PagBank' },
  { value: '380', label: 'PicPay' },
  { value: '756', label: 'Sicoob' },
  { value: '748', label: 'Sicredi' },
  { value: 'Outro', label: 'Outro' },
]

// Meses do ano
export const MESES = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
]

// Configurações do sistema
export const CONFIG = {
  DIAS_MIN_RESGATE: 7,
  ITEMS_PER_PAGE: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
}

// Mensagens de erro padrão
export const ERROR_MESSAGES = {
  REQUIRED: 'Campo obrigatório',
  INVALID_EMAIL: 'Email inválido',
  INVALID_CPF: 'CPF inválido',
  INVALID_CNPJ: 'CNPJ inválido',
  INVALID_PHONE: 'Telefone inválido',
  INVALID_PASSWORD: 'Senha inválida',
  PASSWORDS_DONT_MATCH: 'Senhas não conferem',
  INVALID_VALUE: 'Valor inválido',
  VALUE_EXCEEDS_BALANCE: 'Valor excede o saldo disponível',
  INVALID_DATE: 'Data inválida',
  DATE_TOO_EARLY: 'Data deve ser no mínimo D+7',
  TERMS_REQUIRED: 'Você deve concordar com os termos',
  SERVER_ERROR: 'Erro interno do servidor',
  NETWORK_ERROR: 'Erro de conexão com o servidor',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
}

// Mensagens de sucesso padrão
export const SUCCESS_MESSAGES = {
  APORTE_REGISTRADO: 'Aviso de depósito registrado com sucesso!',
  RESGATE_SOLICITADO: 'Resgate solicitado com sucesso!',
  PERFIL_ATUALIZADO: 'Perfil atualizado com sucesso!',
  SENHA_ALTERADA: 'Senha alterada com sucesso!',
  APORTE_APROVADO: 'Aporte aprovado com sucesso!',
  APORTE_NEGADO: 'Aporte negado.',
  RESGATE_APROVADO: 'Resgate aprovado com sucesso!',
  RESGATE_NEGADO: 'Resgate negado.',
  RESGATE_CONCLUIDO: 'Resgate concluído com sucesso!',
  INVESTIDOR_CRIADO: 'Investidor cadastrado com sucesso!',
  INVESTIDOR_ATUALIZADO: 'Investidor atualizado com sucesso!',
  RELATORIO_PUBLICADO: 'Relatório publicado com sucesso!',
  RENTABILIDADE_REGISTRADA: 'Rentabilidade registrada com sucesso!',
}
