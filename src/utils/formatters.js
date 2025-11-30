import { format, parseISO, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Formata valor monetário para Real brasileiro
 * @param {number} valor - Valor a ser formatado
 * @param {boolean} showSign - Mostrar sinal + ou -
 * @returns {string} Valor formatado (ex: R$ 1.234,56)
 */
export function formatCurrency(valor, showSign = false) {
  if (valor === null || valor === undefined) return 'R$ 0,00'

  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Math.abs(valor))

  if (showSign && valor !== 0) {
    return valor > 0 ? `+${formatted}` : `-${formatted}`
  }

  return valor < 0 ? `-${formatted.replace('-', '')}` : formatted
}

/**
 * Formata valor como porcentagem
 * @param {number} valor - Valor a ser formatado
 * @param {number} decimals - Casas decimais
 * @param {boolean} showSign - Mostrar sinal + ou -
 * @returns {string} Valor formatado (ex: 12,5%)
 */
export function formatPercent(valor, decimals = 2, showSign = false) {
  if (valor === null || valor === undefined) return '0%'

  const formatted = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(valor))

  const sign = showSign && valor !== 0 ? (valor > 0 ? '+' : '-') : (valor < 0 ? '-' : '')

  return `${sign}${formatted}%`
}

/**
 * Formata data para exibição
 * @param {string|Date} data - Data a ser formatada
 * @param {string} formato - Formato da data (padrão: dd/MM/yyyy)
 * @returns {string} Data formatada
 */
export function formatDate(data, formato = 'dd/MM/yyyy') {
  if (!data) return '-'

  try {
    const date = typeof data === 'string' ? parseISO(data) : data
    if (!isValid(date)) return '-'
    return format(date, formato, { locale: ptBR })
  } catch {
    return '-'
  }
}

/**
 * Formata data e hora para exibição
 * @param {string|Date} data - Data a ser formatada
 * @returns {string} Data e hora formatadas
 */
export function formatDateTime(data) {
  return formatDate(data, "dd/MM/yyyy 'às' HH:mm")
}

/**
 * Formata data relativa (ex: "há 2 dias")
 * @param {string|Date} data - Data a ser formatada
 * @returns {string} Data relativa
 */
export function formatRelativeDate(data) {
  if (!data) return '-'

  try {
    const date = typeof data === 'string' ? parseISO(data) : data
    if (!isValid(date)) return '-'

    const now = new Date()
    const diffInMs = now - date
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) return 'Agora'
    if (diffInMinutes < 60) return `Há ${diffInMinutes} min`
    if (diffInHours < 24) return `Há ${diffInHours}h`
    if (diffInDays === 1) return 'Ontem'
    if (diffInDays < 7) return `Há ${diffInDays} dias`

    return formatDate(date)
  } catch {
    return '-'
  }
}

/**
 * Formata CPF
 * @param {string} cpf - CPF a ser formatado
 * @returns {string} CPF formatado (ex: 123.456.789-00)
 */
export function formatCPF(cpf) {
  if (!cpf) return ''
  const cleaned = cpf.replace(/\D/g, '')
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Formata CNPJ
 * @param {string} cnpj - CNPJ a ser formatado
 * @returns {string} CNPJ formatado (ex: 12.345.678/0001-90)
 */
export function formatCNPJ(cnpj) {
  if (!cnpj) return ''
  const cleaned = cnpj.replace(/\D/g, '')
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

/**
 * Formata telefone
 * @param {string} telefone - Telefone a ser formatado
 * @returns {string} Telefone formatado (ex: (11) 99999-9999)
 */
export function formatPhone(telefone) {
  if (!telefone) return ''
  const cleaned = telefone.replace(/\D/g, '')

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }

  return telefone
}

/**
 * Formata número de conta bancária
 * @param {string} conta - Número da conta
 * @returns {string} Conta formatada
 */
export function formatBankAccount(conta) {
  if (!conta) return ''
  const cleaned = conta.replace(/\D/g, '')
  if (cleaned.length > 1) {
    return cleaned.slice(0, -1) + '-' + cleaned.slice(-1)
  }
  return cleaned
}

/**
 * Trunca texto com ellipsis
 * @param {string} text - Texto a ser truncado
 * @param {number} maxLength - Tamanho máximo
 * @returns {string} Texto truncado
 */
export function truncate(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Capitaliza primeira letra de cada palavra
 * @param {string} text - Texto a ser capitalizado
 * @returns {string} Texto capitalizado
 */
export function capitalize(text) {
  if (!text) return ''
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
