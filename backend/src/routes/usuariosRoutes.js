const express = require('express');
const router = express.Router();
const store = require('../db/store');

// GET /api/usuarios - Listar todos os usuários da rede de proteção
router.get('/', async (req, res) => {
  try {
    const apenasVulneraveis = req.query.vulneravel === 'true';
    const usuarios = apenasVulneraveis
      ? await store.listarUsuariosVulneraveis()
      : await store.listarTodosUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// POST /api/usuarios - Cadastrar novo cidadão na Rede de Proteção
router.post('/', async (req, res) => {
  try {
    const { nome, idade, condicao_saude, lat, lng, aceitou_rede_protecao } = req.body;
    if (!nome) {
      return res.status(400).json({ erro: 'O nome do cidadão é obrigatório.' });
    }

    const novo = await store.cadastrarUsuario({
      nome,
      idade: Number(idade) || 30,
      condicao_saude: condicao_saude || 'Sem comorbidades',
      lat,
      lng,
      aceitou_rede_protecao: aceitou_rede_protecao !== false
    });

    res.status(201).json(novo);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
