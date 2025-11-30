import api from './api';

export const relatoriosService = {
  // =====================================
  // ROTAS DO INVESTIDOR
  // =====================================

  /**
   * Lista relatórios disponíveis para o investidor logado
   * @param {object} [filtros] - Filtros opcionais
   * @param {string} [filtros.tipo] - Tipo de relatório
   * @param {string} [filtros.periodo] - Período (ex: '2025-01')
   * @returns {Promise<{dados: array}>}
   */
  async listar(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    const endpoint = params ? `/relatorios?${params}` : '/relatorios';
    return api.get(endpoint);
  },

  /**
   * Registra download de relatório
   * @param {string} id - ID do relatório
   * @returns {Promise<object>}
   */
  async registrarDownload(id) {
    return api.post(`/relatorios/${id}/download`, {});
  },

  // =====================================
  // ROTAS DO ADMIN
  // =====================================

  /**
   * Lista todos os relatórios (admin)
   * @returns {Promise<{dados: array}>}
   */
  async listarTodos() {
    return api.get('/admin/relatorios');
  },

  /**
   * Publica novo relatório (admin)
   * @param {object} dados - Dados do relatório
   * @param {string} dados.titulo - Título do relatório
   * @param {string} dados.tipo - Tipo do relatório
   * @param {string} [dados.descricao] - Descrição
   * @param {string} dados.arquivoPdf - URL do arquivo PDF
   * @param {string} [dados.mesAnoReferencia] - Mês/ano de referência
   * @param {string} [dados.scp] - SCP específica ou vazio para todas
   * @param {string[]} [dados.investidoresIds] - IDs de investidores específicos
   * @param {string} dados.visibilidade - 'Todos' ou 'Selecionados'
   * @param {boolean} [dados.notificarEmail] - Notificar por email
   * @returns {Promise<{success: boolean, id: string}>}
   */
  async publicar(dados) {
    return api.post('/admin/relatorios', dados);
  },

  /**
   * Atualiza relatório (admin)
   * @param {string} id - ID do relatório
   * @param {object} dados - Dados a serem atualizados
   * @returns {Promise<object>}
   */
  async atualizar(id, dados) {
    return api.put(`/admin/relatorios/${id}`, dados);
  },

  /**
   * Remove relatório (admin)
   * @param {string} id - ID do relatório
   * @returns {Promise<object>}
   */
  async remover(id) {
    return api.delete(`/admin/relatorios/${id}`);
  },
};

export default relatoriosService;
