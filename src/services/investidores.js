import api from './api';

export const investidoresService = {
  // =====================================
  // ROTAS DO INVESTIDOR
  // =====================================

  /**
   * Obtém perfil do investidor logado
   * @returns {Promise<object>}
   */
  async getPerfil() {
    return api.get('/perfil');
  },

  /**
   * Atualiza perfil do investidor logado
   * @param {object} dados - Dados a serem atualizados
   * @returns {Promise<object>}
   */
  async atualizarPerfil(dados) {
    return api.put('/perfil', dados);
  },

  // =====================================
  // ROTAS DO ADMIN
  // =====================================

  /**
   * Lista todos os investidores (admin)
   * @returns {Promise<{dados: array}>}
   */
  async listar() {
    return api.get('/admin/investidores');
  },

  /**
   * Obtém investidor por ID (admin)
   * @param {string} id - ID do investidor
   * @returns {Promise<object>}
   */
  async obter(id) {
    return api.get(`/admin/investidores/${id}`);
  },

  /**
   * Cria novo investidor (admin)
   * @param {object} dados - Dados do investidor
   * @returns {Promise<{success: boolean, id: string}>}
   */
  async criar(dados) {
    return api.post('/admin/investidores', dados);
  },

  /**
   * Atualiza investidor (admin)
   * @param {string} id - ID do investidor
   * @param {object} dados - Dados a serem atualizados
   * @returns {Promise<object>}
   */
  async atualizar(id, dados) {
    return api.put(`/admin/investidores/${id}`, dados);
  },

  /**
   * Desativa investidor (admin)
   * @param {string} id - ID do investidor
   * @returns {Promise<object>}
   */
  async desativar(id) {
    return api.put(`/admin/investidores/${id}`, { status: 'Inativo' });
  },

  /**
   * Ativa investidor (admin)
   * @param {string} id - ID do investidor
   * @returns {Promise<object>}
   */
  async ativar(id) {
    return api.put(`/admin/investidores/${id}`, { status: 'Ativo' });
  },

  /**
   * Reenvia convite para investidor (admin)
   * @param {string} id - ID do investidor
   * @returns {Promise<object>}
   */
  async reenviarConvite(id) {
    return api.post(`/admin/investidores/${id}/reenviar-convite`, {});
  },
};

export default investidoresService;
