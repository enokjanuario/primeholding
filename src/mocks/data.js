// Mock data para desenvolvimento
// Estes dados serão usados quando a API do Wix não estiver disponível

export const mockInvestidor = {
  id: '1',
  _id: '1',
  nome: 'João Silva',
  email: 'joao@email.com',
  cpf: '123.456.789-00',
  telefone: '(11) 99999-9999',
  scpsVinculadas: ['SCP 1', 'SCP 2'],
  status: 'Ativo',
  isAdmin: false,
  patrimonioAtual: 150000,
  banco: 'Itaú',
  agencia: '1234',
  conta: '12345-6',
  tipoConta: 'Corrente',
  titularConta: 'João Silva',
}

export const mockAdmin = {
  id: '0',
  _id: '0',
  nome: 'Administrador Prime',
  email: 'admin@primeholding.com.br',
  isAdmin: true,
}

export const mockKPIs = {
  patrimonioAtual: 150000,
  aportesAcumulados: 120000,
  resgatesAcumulados: 20000,
  rentabilidadeTotal: 41.67,
  rentabilidadeAno: 12.5,
  rentabilidadeMes: 2.8,
}

export const mockAdminKPIs = {
  totalInvestidores: 45,
  patrimonioTotal: 5678000,
  aportesPendentes: 3,
  resgatesPendentes: 2,
  ultimosAportes: [],
  ultimosResgates: [],
}

export const mockEvolucaoPatrimonio = [
  { mesAno: '02/2024', patrimonio: 100000 },
  { mesAno: '03/2024', patrimonio: 102500 },
  { mesAno: '04/2024', patrimonio: 105000 },
  { mesAno: '05/2024', patrimonio: 108000 },
  { mesAno: '06/2024', patrimonio: 110000 },
  { mesAno: '07/2024', patrimonio: 115000 },
  { mesAno: '08/2024', patrimonio: 118000 },
  { mesAno: '09/2024', patrimonio: 125000 },
  { mesAno: '10/2024', patrimonio: 130000 },
  { mesAno: '11/2024', patrimonio: 140000 },
  { mesAno: '12/2024', patrimonio: 145000 },
  { mesAno: '01/2025', patrimonio: 150000 },
]

export const mockRentabilidadeMensal = [
  { mesAno: '02/2024', rentabilidade: 2.5 },
  { mesAno: '03/2024', rentabilidade: 2.8 },
  { mesAno: '04/2024', rentabilidade: -0.5 },
  { mesAno: '05/2024', rentabilidade: 3.2 },
  { mesAno: '06/2024', rentabilidade: 2.1 },
  { mesAno: '07/2024', rentabilidade: 4.5 },
  { mesAno: '08/2024', rentabilidade: 2.6 },
  { mesAno: '09/2024', rentabilidade: 5.9 },
  { mesAno: '10/2024', rentabilidade: 4.0 },
  { mesAno: '11/2024', rentabilidade: 7.7 },
  { mesAno: '12/2024', rentabilidade: 3.6 },
  { mesAno: '01/2025', rentabilidade: 2.8 },
]

export const mockDistribuicaoSCP = [
  { scp: 'SCP 1', valor: 80000, percentual: 53.33 },
  { scp: 'SCP 2', valor: 50000, percentual: 33.33 },
  { scp: 'SCP 3', valor: 20000, percentual: 13.34 },
]

export const mockMovimentacoes = [
  {
    _id: '1',
    data: '2025-01-15',
    tipo: 'Aporte',
    scp: 'SCP 1',
    valor: 10000,
    status: 'Aprovado',
    descricao: 'Aporte aprovado',
  },
  {
    _id: '2',
    data: '2025-01-10',
    tipo: 'Lucro',
    scp: 'SCP 1',
    valor: 1500,
    status: 'Concluído',
    descricao: 'Rendimento mensal',
  },
  {
    _id: '3',
    data: '2024-12-20',
    tipo: 'Resgate',
    scp: 'SCP 2',
    valor: -5000,
    status: 'Concluído',
    descricao: 'Resgate concluído',
  },
  {
    _id: '4',
    data: '2024-12-15',
    tipo: 'Aporte',
    scp: 'SCP 2',
    valor: 20000,
    status: 'Aprovado',
    descricao: 'Aporte aprovado',
  },
  {
    _id: '5',
    data: '2024-12-01',
    tipo: 'Lucro',
    scp: 'SCP 1',
    valor: 2000,
    status: 'Concluído',
    descricao: 'Rendimento mensal',
  },
]

export const mockAportes = [
  {
    _id: '1',
    investidorId: '1',
    investidorNome: 'João Silva',
    investidorEmail: 'joao@email.com',
    scp: 'SCP 1',
    valorSolicitado: 10000,
    valorAprovado: 10000,
    dataDeposito: '2025-01-15',
    status: 'Aprovado',
    _createdDate: '2025-01-15T10:00:00Z',
  },
  {
    _id: '2',
    investidorId: '2',
    investidorNome: 'Maria Santos',
    investidorEmail: 'maria@email.com',
    scp: 'SCP 2',
    valorSolicitado: 25000,
    valorAprovado: null,
    dataDeposito: '2025-01-20',
    status: 'Em análise',
    _createdDate: '2025-01-20T14:30:00Z',
  },
  {
    _id: '3',
    investidorId: '3',
    investidorNome: 'Carlos Oliveira',
    investidorEmail: 'carlos@email.com',
    scp: 'SCP 1',
    valorSolicitado: 50000,
    valorAprovado: null,
    dataDeposito: '2025-01-22',
    status: 'Em análise',
    _createdDate: '2025-01-22T09:15:00Z',
  },
]

export const mockResgates = [
  {
    _id: '1',
    investidorId: '1',
    investidorNome: 'João Silva',
    investidorEmail: 'joao@email.com',
    scp: 'SCP 2',
    valorSolicitado: 5000,
    valorAprovado: 5000,
    dataDesejada: '2025-01-25',
    status: 'Concluído',
    banco: 'Itaú',
    agencia: '1234',
    conta: '12345-6',
    _createdDate: '2025-01-10T11:00:00Z',
  },
  {
    _id: '2',
    investidorId: '4',
    investidorNome: 'Ana Paula',
    investidorEmail: 'ana@email.com',
    scp: 'SCP 1',
    valorSolicitado: 15000,
    valorAprovado: null,
    dataDesejada: '2025-02-01',
    status: 'Em análise',
    banco: 'Bradesco',
    agencia: '5678',
    conta: '98765-4',
    _createdDate: '2025-01-23T16:45:00Z',
  },
]

export const mockInvestidores = [
  {
    _id: '1',
    nome: 'João Silva',
    email: 'joao@email.com',
    cpf: '123.456.789-00',
    telefone: '(11) 99999-9999',
    scpsVinculadas: ['SCP 1', 'SCP 2'],
    status: 'Ativo',
    patrimonioAtual: 150000,
  },
  {
    _id: '2',
    nome: 'Maria Santos',
    email: 'maria@email.com',
    cpf: '987.654.321-00',
    telefone: '(21) 88888-8888',
    scpsVinculadas: ['SCP 2'],
    status: 'Ativo',
    patrimonioAtual: 75000,
  },
  {
    _id: '3',
    nome: 'Carlos Oliveira',
    email: 'carlos@email.com',
    cpf: '456.789.123-00',
    telefone: '(31) 77777-7777',
    scpsVinculadas: ['SCP 1', 'SCP 3'],
    status: 'Ativo',
    patrimonioAtual: 200000,
  },
  {
    _id: '4',
    nome: 'Ana Paula',
    email: 'ana@email.com',
    cpf: '789.123.456-00',
    telefone: '(41) 66666-6666',
    scpsVinculadas: ['SCP 1'],
    status: 'Pendente',
    patrimonioAtual: 0,
  },
]

export const mockRelatorios = [
  {
    _id: '1',
    titulo: 'Relatório Mensal - Janeiro 2025',
    tipo: 'Relatório Mensal',
    descricao: 'Relatório de performance do mês de janeiro de 2025',
    dataPublicacao: '2025-01-31T12:00:00Z',
    mesAnoReferencia: '01/2025',
    arquivoPdf: 'https://example.com/relatorio-jan-2025.pdf',
    visibilidade: 'Todos',
  },
  {
    _id: '2',
    titulo: 'Relatório Trimestral - Q4 2024',
    tipo: 'Relatório Trimestral',
    descricao: 'Relatório trimestral do quarto trimestre de 2024',
    dataPublicacao: '2025-01-15T10:00:00Z',
    mesAnoReferencia: '12/2024',
    arquivoPdf: 'https://example.com/relatorio-q4-2024.pdf',
    visibilidade: 'Todos',
  },
  {
    _id: '3',
    titulo: 'Contrato de Adesão - SCP 1',
    tipo: 'Contrato de Adesão',
    descricao: 'Contrato de adesão à SCP 1',
    dataPublicacao: '2024-06-01T09:00:00Z',
    arquivoPdf: 'https://example.com/contrato-scp1.pdf',
    visibilidade: 'Selecionados',
  },
]

export const mockNotificacoes = [
  {
    _id: '1',
    titulo: 'Aporte Aprovado',
    mensagem: 'Seu aporte de R$ 10.000,00 foi aprovado e creditado em sua conta.',
    tipo: 'aporte',
    lida: false,
    _createdDate: '2025-01-15T10:30:00Z',
  },
  {
    _id: '2',
    titulo: 'Novo Relatório Disponível',
    mensagem: 'O Relatório Mensal de Janeiro 2025 já está disponível para download.',
    tipo: 'relatorio',
    lida: false,
    _createdDate: '2025-01-31T12:00:00Z',
  },
  {
    _id: '3',
    titulo: 'Resgate Concluído',
    mensagem: 'Seu resgate de R$ 5.000,00 foi transferido para sua conta bancária.',
    tipo: 'resgate',
    lida: true,
    _createdDate: '2025-01-10T15:00:00Z',
  },
]

export const mockAuditoria = [
  {
    _id: '1',
    acao: 'LOGIN',
    entidade: 'Investidores',
    entidadeId: '1',
    usuarioId: '1',
    usuarioNome: 'João Silva',
    usuarioEmail: 'joao@email.com',
    detalhes: '{"ip": "192.168.1.1"}',
    _createdDate: '2025-01-25T10:00:00Z',
  },
  {
    _id: '2',
    acao: 'APROVAR_APORTE',
    entidade: 'Aportes',
    entidadeId: '1',
    usuarioId: '0',
    usuarioNome: 'Administrador',
    usuarioEmail: 'admin@primeholding.com.br',
    detalhes: '{"valorAprovado": 10000}',
    _createdDate: '2025-01-15T10:30:00Z',
  },
]
