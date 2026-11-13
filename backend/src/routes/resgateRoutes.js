const express = require('express');
const router = express.Router();
const store = require('../db/store');
const { avaliarTriagemIA } = require('../services/triagemIAService');
const { verificarOndaDeCalor } = require('../services/climaService');

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    servico: 'plataforma-resgate-descentralizado',
    timestamp: new Date().toISOString()
  });
});

// Lista instituições e frotas disponíveis
router.get('/api/instituicoes', async (req, res, next) => {
  try {
    const lista = await store.listarInstituicoesComFrota();
    res.status(200).json(lista);
  } catch (err) {
    next(err);
  }
});

// Lista chamados ativos (Painel Institucional)
router.get('/api/chamados', async (req, res, next) => {
  try {
    const chamados = await store.listarChamados();
    res.status(200).json(chamados);
  } catch (err) {
    next(err);
  }
});

// Fluxo 1-Clique do Cidadão: Cria chamado -> IA faz triagem -> Emite via WebSocket
router.post('/api/chamados', async (req, res, next) => {
  try {
    const { usuario_id = 1, tipo_problema, lat = -8.1189, lng = -34.9458 } = req.body;
    if (!tipo_problema) {
      return res.status(400).json({ erro: 'O campo "tipo_problema" é obrigatório.' });
    }

    const vitima = await store.buscarUsuarioPorId(usuario_id);
    const triagem = await avaliarTriagemIA(tipo_problema, vitima);

    const chamado = await store.criarChamado({
      usuario_id: vitima.id,
      vitima: { nome: vitima.nome, idade: vitima.idade, condicao_saude: vitima.condicao_saude },
      tipo_problema,
      lat,
      lng,
      prioridade: triagem.prioridade,
      recurso_sugerido: triagem.recurso_sugerido,
      justificativa_ia: triagem.justificativa_ia
    });

    // Notifica todos os centros de comando conectados em tempo real
    const io = req.app.get('io');
    if (io) io.emit('novo_chamado', chamado);

    res.status(201).json(chamado);
  } catch (err) {
    next(err);
  }
});

// Instituição aceita a ocorrência e despacha frota (Fila Vermelha -> A_Caminho)
router.patch('/api/chamados/:id/aceitar', async (req, res, next) => {
  try {
    const { instituicao_id } = req.body;
    if (!instituicao_id) {
      return res.status(400).json({ erro: 'O campo "instituicao_id" é obrigatório.' });
    }

    const atualizado = await store.aceitarChamado(req.params.id, instituicao_id);
    if (!atualizado) {
      return res.status(404).json({ erro: 'Chamado não encontrado.' });
    }

    // Notifica o cidadão e os demais painéis que a equipe já assumiu
    const io = req.app.get('io');
    if (io) io.emit('chamado_atualizado', atualizado);

    res.status(200).json(atualizado);
  } catch (err) {
    next(err);
  }
});

// Fluxo Proativo: Onda de Calor Extremo cruzada com vulneráveis da RMR
router.get('/api/calor-extremo', async (req, res, next) => {
  try {
    const resultado = await verificarOndaDeCalor(req.query.temp);
    res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
});

module.exports = router;