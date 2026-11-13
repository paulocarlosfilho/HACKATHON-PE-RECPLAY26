const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- Rota de Health Check ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Plataforma Resgate Descentralizado RMR' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', desafio: 'Antena na Lama - RMR Recife' });
});

// --- Importação de Rotas e Serviços ---
const resgateRoutes = require('./src/routes/resgateRoutes');
const chamadosRoutes = require('./src/routes/chamadosRoutes');
const instituicoesRoutes = require('./src/routes/instituicoesRoutes');
const usuariosRoutes = require('./src/routes/usuariosRoutes');
const { router: alertasRoutes } = require('./src/routes/alertasRoutes');
const climaService = require('./src/services/climaService');
const triagemIAService = require('./src/services/triagemIAService');

// Registrar rotas modulares
app.use('/api/resgates', resgateRoutes);
app.use('/api/chamados', chamadosRoutes);
app.use('/api/instituicoes', instituicoesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/alertas', alertasRoutes);
app.use('/api/ajuda', (req, res) => {
  // Redireciona /api/ajuda para o handler do alertasRoutes
  req.url = '/ajuda';
  alertasRoutes(req, res);
});

// --- Rota de Clima (Compatibilidade com Teste 4) ---
app.get('/api/clima', async (req, res) => {
  try {
    const local = req.query.local || 'Recife';
    const dadosClima = {
      temperatura: 28,
      condicao: 'Chuvoso',
      local,
      umidade: '88%',
      sensacaoTermica: 30,
      mare: '2.3m (Alta - Preamar de Sizígia)',
      fonte: 'APAC / CEMADEN / Open-Meteo'
    };
    res.status(200).json(dadosClima);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// --- Rota de Monitoramento de Onda de Calor (Integração com ClimaService e Usuários Vulneráveis) ---
app.get('/api/clima/calor', async (req, res) => {
  try {
    const relatorioCalor = await climaService.verificarOndaDeCalor(req.query.temp);
    res.status(200).json(relatorioCalor);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// --- Rota de Triagem por IA (Compatibilidade com Teste 5) ---
app.post('/api/triagem', async (req, res) => {
  try {
    const { textoOcorrencia, vitima } = req.body;
    
    if (!textoOcorrencia) {
      return res.status(400).json({ erro: 'Texto da ocorrência é obrigatório.' });
    }

    const vitimaObj = vitima || { nome: 'Morador', idade: 65, condicao_saude: 'Comorbidade' };
    const resultadoIA = await triagemIAService.avaliarTriagemIA(textoOcorrencia, vitimaObj);

    res.status(200).json({
      nivelUrgencia: resultadoIA.prioridade || 'Alta',
      recomendacao: `Recurso indicado: ${resultadoIA.recurso_sugerido}. ${resultadoIA.justificativa_ia}`,
      prioridade: resultadoIA.prioridade,
      recurso_sugerido: resultadoIA.recurso_sugerido,
      justificativa_ia: resultadoIA.justificativa_ia
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Exporta o app para o Jest testar (e evita subir o listen duplo se for importado)
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;
