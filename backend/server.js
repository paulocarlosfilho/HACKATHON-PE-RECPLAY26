const express = require('express');
const app = express();

// Middleware para entender JSON no corpo das requisições
app.use(express.json());

// --- Rota de Health Check ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// --- Importação de Rotas e Serviços ---
const resgateRoutes = require('./src/routes/resgateRoutes');
const climaService = require('./src/services/climaService');
const triagemIAService = require('./src/services/triagemIAService');

// Registrar rota de resgates
app.use('/api/resgates', resgateRoutes);

// --- Rota de Clima ---
app.get('/api/clima', async (req, res) => {
  try {
    const local = req.query.local || 'Recife';
    // Ajuste conforme o método real do seu climaService
    const dadosClima = {
      temperatura: 28,
      condicao: 'Chuvoso',
      local
    };
    res.status(200).json(dadosClima);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// --- Rota de Triagem por IA ---
app.post('/api/triagem', async (req, res) => {
  try {
    const { textoOcorrencia } = req.body;
    
    if (!textoOcorrencia) {
      return res.status(400).json({ erro: 'Texto da ocorrência é obrigatório.' });
    }

    // Lógica simulada ou chamada ao triagemIAService
    res.status(200).json({
      nivelUrgencia: 'Alta',
      recomendacao: 'Enviar equipe de bote imediatamente.'
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Exporta o app para o Jest testar (e evita subir o listen duplo se for importado)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;