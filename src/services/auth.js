import api, { setToken, removeToken, getToken } from './api';
import { mockInvestidor, mockAdmin } from '../mocks/data';

// Credenciais mock para desenvolvimento
const MOCK_USERS = {
  'investidor@teste.com': {
    senha: '123456',
    user: mockInvestidor,
  },
  'admin@teste.com': {
    senha: '123456',
    user: mockAdmin,
  },
};

// Ativa modo mock quando API não está configurada ou em desenvolvimento
const USE_MOCK = !import.meta.env.VITE_API_URL || import.meta.env.DEV;

export const authService = {
  /**
   * Realiza login do usuário
   * @param {string} email - Email do usuário
   * @param {string} senha - Senha do usuário
   * @returns {Promise<{token: string, investidor: object}>}
   */
  async login(email, senha) {
    // Modo mock para desenvolvimento
    if (USE_MOCK) {
      const mockUser = MOCK_USERS[email.toLowerCase()];

      if (mockUser && mockUser.senha === senha) {
        const token = 'mock-token-' + Date.now();
        setToken(token);
        localStorage.setItem('mockUser', JSON.stringify(mockUser.user));
        return { token, investidor: mockUser.user };
      }

      throw new Error('Email ou senha inválidos');
    }

    const response = await api.post('/login', { email, senha });

    if (response.token) {
      setToken(response.token);
    }

    return response;
  },

  /**
   * Realiza logout do usuário
   */
  logout() {
    removeToken();
    localStorage.removeItem('mockUser');
  },

  /**
   * Obtém dados do usuário logado
   * @returns {Promise<object>}
   */
  async getMe() {
    // Modo mock para desenvolvimento
    if (USE_MOCK) {
      const mockUser = localStorage.getItem('mockUser');
      if (mockUser) {
        return JSON.parse(mockUser);
      }
      throw new Error('Usuário não autenticado');
    }

    return api.get('/me');
  },

  /**
   * Verifica se há um token válido
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!getToken();
  },

  /**
   * Atualiza senha do usuário
   * @param {string} senhaAtual - Senha atual
   * @param {string} novaSenha - Nova senha
   * @returns {Promise<object>}
   */
  async alterarSenha(senhaAtual, novaSenha) {
    return api.put('/perfil/senha', { senhaAtual, novaSenha });
  },

  /**
   * Solicita recuperação de senha
   * @param {string} email - Email do usuário
   * @returns {Promise<object>}
   */
  async recuperarSenha(email) {
    return api.post('/recuperar-senha', { email });
  },
};

export default authService;
