const express = require('express');
const router = express.Router();
const store = require('../db/store');
const { avaliarTriagemIA } = require('../services/triagemIAService');

// GET /api/chamados - Listar todos os chamados
router.get('/', async (req, res) => {
  try {
    const chamados = await store.listarChamados();
    res.status(200).json(chamados);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// POST /api/chamados - Criar novo chamado com Triagem IA automatizada
router.post('/', async (req, res) => {
  try {
    const { usuario_id, tipo_problema, vitima_nome, vitima_idade, vitima_condicao, lat, lng } = req.body;

    if (!tipo_problema) {
      return res.status(400).json({ erro: 'O tipo do problema é obrigatório para registrar o chamado.' });
    }

    let vitima = {
      nome: vitima_nome || 'Morador Solicitante',
      idade: Number(vitima_idade) || 35,
      condicao_saude: vitima_condicao || 'Sem comorbidades'
    };

    if (usuario_id) {
      const userCadastrado = await store.buscarUsuarioPorId(usuario_id);
      if (userCadastrado) {
        vitima = {
          nome: userCadastrado.nome,
          idade: userCadastrado.idade,
          condicao_saude: userCadastrado.condicao_saude
        };
      }
    }

    // Processamento do motor de triagem por IA
    const avaliacaoIA = await avaliarTriagemIA(tipo_problema, vitima);

    const novoChamado = await store.criarChamado({
      usuario_id: usuario_id || null,
      vitima: `${vitima.nome} (${vitima.idade} anos, ${vitima.condicao_saude})`,
      tipo_problema,
      lat: lat !== undefined ? lat : -8.05,
      lng: lng !== undefined ? lng : -34.88,
      prioridade: avaliacaoIA.prioridade || 'Média',
      recurso_sugerido: avaliacaoIA.recurso_sugerido || 'Viatura de Apoio Comunitário',
      justificativa_ia: avaliacaoIA.justificativa_ia || 'Avaliação determinística de contingência.'
    });

    res.status(201).json(novoChamado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// PATCH /api/chamados/:id/aceitar - Instituição aceita chamado e despacha frota
router.patch('/:id/aceitar', async (req, res) => {
  try {
    const { id } = req.params;
    const { instituicao_id } = req.body;

    if (!instituicao_id) {
      return res.status(400).json({ erro: 'O ID da instituição é obrigatório para despacho.' });
    }

    const chamadoAtualizado = await store.aceitarChamado(id, instituicao_id);
    if (!chamadoAtualizado) {
      return res.status(404).json({ erro: 'Chamado não encontrado.' });
    }

    res.status(200).json(chamadoAtualizado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// PATCH /api/chamados/:id/finalizar - Conclui e resgata
router.patch('/:id/finalizar', async (req, res) => {
  try {
    const { id } = req.params;
    const chamadoFinalizado = await store.finalizarChamado(id);
    if (!chamadoFinalizado) {
      return res.status(404).json({ erro: 'Chamado não encontrado.' });
    }

    res.status(200).json(chamadoFinalizado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
