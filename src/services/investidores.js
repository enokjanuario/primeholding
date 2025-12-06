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
    return api.get('/adminInvestidores');
  },

  /**
   * Obtém investidor por ID (admin)
   * @param {string} id - ID do investidor
   * @returns {Promise<object>}
   */
  async obter(id) {
    return api.get(`/adminInvestidores/${id}`);
  },

  /**
   * Cria novo investidor (admin)
   * @param {object} dados - Dados do investidor
   * @returns {Promise<{success: boolean, id: string}>}
   */
  async criar(dados) {
    return api.post('/adminInvestidores', dados);
  },

  /**
   * Atualiza investidor (admin)
   * @param {string} id - ID do investidor
   * @param {object} dados - Dados a serem atualizados
   * @returns {Promise<object>}
   */
  async atualizar(id, dados) {
    return api.put(`/adminInvestidores/${id}`, dados);
  },

  /**
   * Desativa investidor (admin)
   * @param {string} id - ID do investidor
   * @returns {Promise<object>}
   */
  async desativar(id) {
    return api.put(`/adminInvestidores/${id}`, { status: 'Inativo' });
  },

  /**
   * Ativa investidor (admin)
   * @param {string} id - ID do investidor
   * @returns {Promise<object>}
   */
  async ativar(id) {
    return api.put(`/adminInvestidores/${id}`, { status: 'Ativo' });
  },

  /**
   * Reenvia convite para investidor (admin)
   * @param {string} id - ID do investidor
   * @returns {Promise<object>}
   */
  async reenviarConvite(id) {
    return api.post(`/adminInvestidores/${id}/reenviar-convite`, {});
  },
};

export default investidoresService;
