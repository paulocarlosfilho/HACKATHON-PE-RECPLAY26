const express = require('express');
const router = express.Router();

// Banco de dados em memória temporário para os testes
let resgates = [];

// Rota POST para criar um novo resgate (/api/resgates)
router.post('/', (req, res) => {
  const { localizacao, descricao, prioridade } = req.body;

  // Validação: Se não houver descrição, retorna erro 400 (atende ao Teste 3)
  if (!descricao) {
    return res.status(400).json({ erro: 'A descrição da ocorrência é obrigatória.' });
  }

  // Criação do objeto de resgate (atende ao Teste 2)
  const novoResgate = {
    id: Date.now().toString(),
    localizacao: localizacao || 'Localização não especificada',
    descricao,
    prioridade: prioridade || 'media',
    criadoEm: new Date().toISOString()
  };

  resgates.push(novoResgate);
  
  // Correção feita aqui: mudou de 'return.status' para 'res.status'
  return res.status(201).json(novoResgate);
});

// Rota GET opcional para listar os resgates cadastrados
router.get('/', (req, res) => {
  return res.status(200).json(resgates);
});

module.exports = router;