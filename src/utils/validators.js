/**
 * Valida email
 * @param {string} email - Email a ser validado
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email) return false
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Valida CPF
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean}
 */
export function isValidCPF(cpf) {
  if (!cpf) return false

  const cleaned = cpf.replace(/\D/g, '')

  if (cleaned.length !== 11) return false
  if (/^(\d)\1+$/.test(cleaned)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i)
  }
  let digit = (sum * 10) % 11
  if (digit === 10) digit = 0
  if (digit !== parseInt(cleaned[9])) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i)
  }
  digit = (sum * 10) % 11
  if (digit === 10) digit = 0
  if (digit !== parseInt(cleaned[10])) return false

  return true
}

/**
 * Valida CNPJ
 * @param {string} cnpj - CNPJ a ser validado
 * @returns {boolean}
 */
export function isValidCNPJ(cnpj) {
  if (!cnpj) return false

  const cleaned = cnpj.replace(/\D/g, '')

  if (cleaned.length !== 14) return false
  if (/^(\d)\1+$/.test(cleaned)) return false

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned[i]) * weights1[i]
  }
  let digit = sum % 11
  digit = digit < 2 ? 0 : 11 - digit
  if (digit !== parseInt(cleaned[12])) return false

  sum = 0
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned[i]) * weights2[i]
  }
  digit = sum % 11
  digit = digit < 2 ? 0 : 11 - digit
  if (digit !== parseInt(cleaned[13])) return false

  return true
}

/**
 * Valida CPF ou CNPJ
 * @param {string} value - CPF ou CNPJ a ser validado
 * @returns {boolean}
 */
export function isValidCPFOrCNPJ(value) {
  if (!value) return false
  const cleaned = value.replace(/\D/g, '')
  return cleaned.length === 11 ? isValidCPF(value) : isValidCNPJ(value)
}

/**
 * Valida telefone brasileiro
 * @param {string} phone - Telefone a ser validado
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  if (!phone) return false
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 10 || cleaned.length === 11
}

/**
 * Valida senha forte
 * @param {string} password - Senha a ser validada
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validatePassword(password) {
  const errors = []

  if (!password) {
    errors.push('Senha é obrigatória')
    return { valid: false, errors }
  }

  if (password.length < 8) {
    errors.push('Mínimo de 8 caracteres')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Pelo menos uma letra maiúscula')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Pelo menos uma letra minúscula')
  }

  if (!/\d/.test(password)) {
    errors.push('Pelo menos um número')
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Pelo menos um caractere especial')
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Valida valor monetário
 * @param {number} value - Valor a ser validado
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean}
 */
export function isValidMoney(value, min = 0, max = Infinity) {
  if (value === null || value === undefined || isNaN(value)) return false
  return value >= min && value <= max
}

/**
 * Valida data futura (mínimo de dias)
 * @param {Date|string} date - Data a ser validada
 * @param {number} minDays - Mínimo de dias a partir de hoje
 * @returns {boolean}
 */
export function isValidFutureDate(date, minDays = 0) {
  if (!date) return false

  const inputDate = typeof date === 'string' ? new Date(date) : date
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + minDays)
  minDate.setHours(0, 0, 0, 0)

  return inputDate >= minDate
}

/**
 * Remove máscara de valor
 * @param {string} value - Valor com máscara
 * @returns {number}
 */
export function unmaskMoney(value) {
  if (!value) return 0
  if (typeof value === 'number') return value

  const cleaned = value
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.')

  return parseFloat(cleaned) || 0
}

/**
 * Aplica máscara de dinheiro
 * @param {string|number} value - Valor a ser mascarado
 * @returns {string}
 */
export function maskMoney(value) {
  if (!value) return ''

  const numericValue = typeof value === 'string'
    ? parseFloat(value.replace(/\D/g, '')) / 100
    : value

  return numericValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
