import api from './api';

export const resgatesService = {
  // =====================================
  // ROTAS DO INVESTIDOR
  // =====================================

  /**
   * Lista resgates do investidor logado
   * @returns {Promise<{dados: array}>}
   */
  async listar() {
    return api.get('/resgates');
  },

  /**
   * Solicita resgate
   * @param {object} dados - Dados do resgate
   * @param {string} dados.scp - SCP selecionada
   * @param {number} dados.valor - Valor do resgate
   * @param {string} [dados.dataDesejada] - Data desejada para resgate
   * @param {string} dados.banco - Banco para depósito
   * @param {string} dados.agencia - Agência
   * @param {string} dados.conta - Conta
   * @param {string} dados.tipoConta - 'Corrente' ou 'Poupança'
   * @param {string} dados.titularConta - Nome do titular
   * @param {string} dados.cpfCnpjConta - CPF ou CNPJ do titular
   * @param {boolean} dados.concordouTermos - Concordou com os termos
   * @param {string} [dados.descricao] - Descrição opcional
   * @returns {Promise<{success: boolean, id: string}>}
   */
  async solicitar(dados) {
    return api.post('/resgates', dados);
  },

  // =====================================
  // ROTAS DO ADMIN
  // =====================================

  /**
   * Lista todos os resgates (admin)
   * @param {object} [filtros] - Filtros opcionais
   * @returns {Promise<{dados: array}>}
   */
  async listarTodos(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    const endpoint = params ? `/admin/resgates?${params}` : '/admin/resgates';
    return api.get(endpoint);
  },

  /**
   * Processa resgate (aprovar/negar/concluir) - admin
   * @param {string} id - ID do resgate
   * @param {object} dados - Dados do processamento
   * @param {string} dados.status - 'Aprovado', 'Negado' ou 'Concluído'
   * @param {number} [dados.valorAprovado] - Valor aprovado
   * @param {string} [dados.dataEfetiva] - Data efetiva da transferência (para concluir)
   * @param {string} [dados.observacaoInterna] - Nota interna
   * @param {string} [dados.mensagemCliente] - Mensagem para o cliente
   * @returns {Promise<{success: boolean}>}
   */
  async processar(id, dados) {
    return api.put(`/admin/resgates/${id}`, dados);
  },

  /**
   * Aprova resgate (admin) - atalho
   * @param {string} id - ID do resgate
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
   * Nega resgate (admin) - atalho
   * @param {string} id - ID do resgate
   * @param {string} motivo - Motivo da negação
   * @returns {Promise<{success: boolean}>}
   */
  async negar(id, motivo) {
    return this.processar(id, {
      status: 'Negado',
      mensagemCliente: motivo,
    });
  },

  /**
   * Conclui resgate (admin) - atalho
   * @param {string} id - ID do resgate
   * @param {string} dataEfetiva - Data efetiva da transferência
   * @returns {Promise<{success: boolean}>}
   */
  async concluir(id, dataEfetiva) {
    return this.processar(id, {
      status: 'Concluído',
      dataEfetiva,
    });
  },
};

export default resgatesService;
