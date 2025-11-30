import api from './api';

export const aportesService = {
  // =====================================
  // ROTAS DO INVESTIDOR
  // =====================================

  /**
   * Lista aportes do investidor logado
   * @returns {Promise<{dados: array}>}
   */
  async listar() {
    return api.get('/aportes');
  },

  /**
   * Registra aviso de depósito
   * @param {object} dados - Dados do aporte
   * @param {string} dados.scp - SCP selecionada
   * @param {number} dados.valor - Valor do depósito
   * @param {string} dados.dataDeposito - Data do depósito
   * @param {string} [dados.descricao] - Descrição opcional
   * @param {string} [dados.comprovante] - URL do comprovante
   * @returns {Promise<{success: boolean, id: string}>}
   */
  async registrar(dados) {
    return api.post('/aportes', dados);
  },

  // =====================================
  // ROTAS DO ADMIN
  // =====================================

  /**
   * Lista todos os aportes (admin)
   * @param {object} [filtros] - Filtros opcionais
   * @returns {Promise<{dados: array}>}
   */
  async listarTodos(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    const endpoint = params ? `/admin/aportes?${params}` : '/admin/aportes';
    return api.get(endpoint);
  },

  /**
   * Processa aporte (aprovar/negar) - admin
   * @param {string} id - ID do aporte
   * @param {object} dados - Dados do processamento
   * @param {string} dados.status - 'Aprovado', 'Parcialmente aprovado' ou 'Negado'
   * @param {number} [dados.valorAprovado] - Valor aprovado (obrigatório se aprovado)
   * @param {string} [dados.observacaoInterna] - Nota interna
   * @param {string} [dados.mensagemCliente] - Mensagem para o cliente
   * @returns {Promise<{success: boolean}>}
   */
  async processar(id, dados) {
    return api.put(`/admin/aportes/${id}`, dados);
  },

  /**
   * Aprova aporte (admin) - atalho
   * @param {string} id - ID do aporte
   * @param {number} valorAprovado - Valor a aprovar
   * @param {string} [mensagem] - Mensagem para o cliente
   * @returns {Promise<{success: boolean}>}
   */
  async aprovar(id, valorAprovado, mensagem = '') {
    return this.processar(id, {
      status: 'Aprovado',
      valorAprovado,
      mensagemCliente: mensagem,
    });
  },

  /**
   * Nega aporte (admin) - atalho
   * @param {string} id - ID do aporte
   * @param {string} motivo - Motivo da negação
   * @returns {Promise<{success: boolean}>}
   */
  async negar(id, motivo) {
    return this.processar(id, {
      status: 'Negado',
      mensagemCliente: motivo,
    });
  },
};

export default aportesService;
