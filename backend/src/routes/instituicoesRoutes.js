const express = require('express');
const router = express.Router();
const store = require('../db/store');

// GET /api/instituicoes - Listar instituições com frota e recursos disponíveis
router.get('/', async (req, res) => {
  try {
    const instituicoes = await store.listarInstituicoesComFrota();
    res.status(200).json(instituicoes);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
