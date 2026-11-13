const { Pool } = require('pg');

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : null;

// Seed inicial para operação instantânea e testes sem dependência externa
const state = {
  usuarios: [
    { id: 1, nome: 'Dona Maria Clarice', idade: 78, condicao_saude: 'Mobilidade reduzida / Hipertensa', lat: -8.1189, lng: -34.9458, aceitou_rede_protecao: true },
    { id: 2, nome: 'Seu Severino', idade: 82, condicao_saude: 'Cadeirante', lat: -8.0476, lng: -34.8770, aceitou_rede_protecao: true },
    { id: 3, nome: 'Ana Paula', idade: 29, condicao_saude: 'Gestante (8 meses)', lat: -8.0089, lng: -34.8553, aceitou_rede_protecao: true },
    { id: 4, nome: 'Carlos Eduardo', idade: 34, condicao_saude: 'Sem comorbidades', lat: -8.1128, lng: -35.0147, aceitou_rede_protecao: false }
  ],
  instituicoes: [
    { id: 1, nome: 'Corpo de Bombeiros Militar PE', tipo_esfera: 'Estadual', lat: -8.0522, lng: -34.8811 },
    { id: 2, nome: 'Defesa Civil do Recife', tipo_esfera: 'Municipal', lat: -8.0631, lng: -34.8711 },
    { id: 3, nome: 'ONG Resgate Comunitário Ibura', tipo_esfera: 'ONG Certificada', lat: -8.1201, lng: -34.9480 },
    { id: 4, nome: 'Neoenergia Pernambuco (Emergência)', tipo_esfera: 'Concessionária', lat: -8.0550, lng: -34.8900 }
  ],
  veiculos_recursos: [
    { id: 1, instituicao_id: 1, tipo: 'Barco Salva-Vidas', disponivel: true },
    { id: 2, instituicao_id: 1, tipo: 'Helicóptero Resgate', disponivel: true },
    { id: 3, instituicao_id: 2, tipo: 'Jipe 4x4 Geotécnico', disponivel: true },
    { id: 4, instituicao_id: 3, tipo: 'Ambulância / Van Adaptada', disponivel: true },
    { id: 5, instituicao_id: 4, tipo: 'Caminhão Rede Elétrica', disponivel: true }
  ],
  chamados: []
};

async function buscarUsuarioPorId(id) {
  return state.usuarios.find((u) => u.id === Number(id)) || state.usuarios[0];
}

async function listarUsuariosVulneraveis() {
  return state.usuarios.filter(
    (u) => u.aceitou_rede_protecao && (u.idade >= 60 || u.condicao_saude !== 'Sem comorbidades')
  );
}

async function listarInstituicoesComFrota() {
  return state.instituicoes.map((inst) => ({
    ...inst,
    recursos: state.veiculos_recursos.filter((v) => v.instituicao_id === inst.id)
  }));
}

async function criarChamado(dados) {
  const novoChamado = {
    id: state.chamados.length + 1,
    usuario_id: dados.usuario_id,
    vitima: dados.vitima,
    instituicao_id: null,
    instituicao_nome: null,
    tipo_problema: dados.tipo_problema,
    lat: dados.lat,
    lng: dados.lng,
    prioridade: dados.prioridade,
    recurso_sugerido: dados.recurso_sugerido,
    justificativa_ia: dados.justificativa_ia,
    status: 'Pendente',
    criado_em: new Date().toISOString()
  };

  if (pool) {
    try {
      await pool.query(
        `INSERT INTO chamados (usuario_id, tipo_problema, lat, lng, prioridade, recurso_sugerido, justificativa_ia, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [dados.usuario_id, dados.tipo_problema, dados.lat, dados.lng, dados.prioridade, dados.recurso_sugerido, dados.justificativa_ia, 'Pendente']
      );
    } catch (_) {
      // Mantém continuidade em memória se o banco externo oscilar
    }
  }

  state.chamados.unshift(novoChamado);
  return novoChamado;
}

async function listarChamados() {
  return state.chamados;
}

async function aceitarChamado(chamadoId, instituicaoId) {
  const chamado = state.chamados.find((c) => c.id === Number(chamadoId));
  if (!chamado) return null;

  const inst = state.instituicoes.find((i) => i.id === Number(instituicaoId));
  chamado.instituicao_id = inst ? inst.id : Number(instituicaoId);
  chamado.instituicao_nome = inst ? inst.nome : 'Órgão Oficial';
  chamado.status = 'A_Caminho';

  // Marca o recurso sugerido como em deslocamento, se disponível
  const recurso = state.veiculos_recursos.find(
    (v) => v.instituicao_id === chamado.instituicao_id && v.disponivel
  );
  if (recurso) recurso.disponivel = false;

  return chamado;
}

async function finalizarChamado(chamadoId) {
  const chamado = state.chamados.find((c) => c.id === Number(chamadoId));
  if (!chamado) return null;
  chamado.status = 'Resgatado';
  return chamado;
}

module.exports = {
  buscarUsuarioPorId,
  listarUsuariosVulneraveis,
  listarInstituicoesComFrota,
  criarChamado,
  listarChamados,
  aceitarChamado,
  finalizarChamado
};