import api from './api';

export const notificacoesService = {
  /**
   * Lista notificações do investidor logado
   * @returns {Promise<{dados: array}>}
   */
  async listar() {
    return api.get('/notificacoes');
  },

  /**
   * Marca notificação como lida
   * @param {string} id - ID da notificação
   * @returns {Promise<{success: boolean}>}
   */
  async marcarComoLida(id) {
    return api.put(`/notificacoes/${id}/lida`, {});
  },

  /**
   * Marca todas as notificações como lidas
   * @returns {Promise<{success: boolean}>}
   */
  async marcarTodasComoLidas() {
    return api.put('/notificacoes/marcar-todas-lidas', {});
  },

  /**
   * Obtém contagem de notificações não lidas
   * @returns {Promise<{count: number}>}
   */
  async contarNaoLidas() {
    return api.get('/notificacoes/nao-lidas/count');
  },
};

export default notificacoesService;
