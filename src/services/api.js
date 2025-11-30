const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://www.primeholdinginvest.com.br/_functions';

// Token management
const getToken = () => localStorage.getItem('prime_token');
const setToken = (token) => localStorage.setItem('prime_token', token);
const removeToken = () => localStorage.removeItem('prime_token');

// Headers padrão
const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Classe de erro customizada
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Função base para fazer requisições
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: getHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);

    // Tentar parsear como JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Se não for sucesso, lançar erro
    if (!response.ok) {
      const errorMessage = data?.error || data?.message || 'Erro na requisição';
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Erro de rede ou outros
    throw new ApiError(
      error.message || 'Erro de conexão com o servidor',
      0
    );
  }
}

// Métodos HTTP
export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),

  post: (endpoint, data) => request(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  put: (endpoint, data) => request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

// Exportar funções de token
export { getToken, setToken, removeToken };

export default api;
