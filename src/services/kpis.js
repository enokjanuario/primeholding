import api from './api';

export const kpisService = {
  // =====================================
  // ROTAS DO INVESTIDOR
  // =====================================

  /**
   * Obtém KPIs do dashboard do investidor
   * @returns {Promise<object>} KPIs do investidor
   */
  async getDashboard() {
    return api.get('/dashboard');
  },

  /**
   * Obtém dados para gráfico de evolução do patrimônio
   * @returns {Promise<{dados: array}>}
   */
  async getEvolucaoPatrimonio() {
    return api.get('/evolucaoPatrimonio');
  },

  /**
   * Obtém dados para gráfico de rentabilidade mensal
   * @returns {Promise<{dados: array}>}
   */
  async getRentabilidadeMensal() {
    return api.get('/rentabilidadeMensal');
  },

  /**
   * Obtém movimentações recentes
   * @param {number} [limit=5] - Limite de movimentações
   * @returns {Promise<{dados: array}>}
   */
  async getMovimentacoes(limit = 50) {
    return api.get(`/movimentacoes?limit=${limit}`);
  },

  // =====================================
  // ROTAS DO ADMIN
  // =====================================

  /**
   * Obtém KPIs do dashboard administrativo
   * @returns {Promise<object>} KPIs administrativos
   */
  async getAdminDashboard() {
    return api.get('/adminDashboard');
  },

  /**
   * Registra rentabilidade mensal (admin)
   * @param {object} dados - Dados da rentabilidade
   * @param {number} dados.mes - Mês (1-12)
   * @param {number} dados.ano - Ano
   * @param {string} dados.scp - SCP
   * @param {number} dados.rentabilidadePercent - Percentual de rentabilidade
   * @param {boolean} [dados.aplicarParaTodos] - Aplicar para todos investidores da SCP
   * @param {string[]} [dados.investidoresIds] - IDs específicos de investidores
   * @returns {Promise<{success: boolean}>}
   */
  async registrarRentabilidade(dados) {
    return api.put('/adminRentabilidade', dados);
  },

  /**
   * Lista rentabilidades registradas (admin)
   * @param {object} [filtros] - Filtros opcionais
   * @returns {Promise<{dados: array}>}
   */
  async listarRentabilidades(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    const endpoint = params ? `/adminRentabilidade?${params}` : '/adminRentabilidade';
    return api.get(endpoint);
  },

  /**
   * Obtém logs de auditoria (admin)
   * @param {object} [filtros] - Filtros opcionais
   * @returns {Promise<{dados: array}>}
   */
  async getAuditoria(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    const endpoint = params ? `/adminAuditoria?${params}` : '/adminAuditoria';
    return api.get(endpoint);
  },
};

export default kpisService;
