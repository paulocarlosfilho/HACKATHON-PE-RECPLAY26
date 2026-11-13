const express = require('express');
const router = express.Router();
const { obterRiscosPorBairro } = require('../services/climaService');
const { gerarOrientacaoIA } = require('../services/iaService');

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    servico: 'antena-na-lama-api',
    timestamp: new Date().toISOString()
  });
});

router.get('/api/riscos', async (req, res, next) => {
  try {
    const bairro = (req.query.bairro || 'Recife').trim();
    const dados = await obterRiscosPorBairro(bairro);
    res.status(200).json(dados);
  } catch (error) {
    next(error);
  }
});

router.post('/api/ia/orientacao', async (req, res, next) => {
  try {
    const { bairro, riscos } = req.body;
    if (!bairro || !riscos) {
      return res.status(400).json({ erro: 'Os campos "bairro" e "riscos" são obrigatórios.' });
    }
    const orientacao = await gerarOrientacaoIA(bairro, riscos);
    res.status(200).json({ bairro, orientacao });
  } catch (error) {
    next(error);
  }
});

module.exports = router;