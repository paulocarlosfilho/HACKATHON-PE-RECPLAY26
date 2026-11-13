require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const alertasRoutes = require('./src/routes/alertasRoutes');

const app = express();

// Segurança de Headers HTTP (Mitiga alertas do OWASP ZAP)
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json({ limit: '50kb' }));

// Rotas da aplicação
app.use('/', alertasRoutes);

// Tratamento global de erros
app.use((err, req, res, next) => {
  console.error('[ERRO INTERNO]:', err.message);
  res.status(500).json({ erro: 'Erro interno no servidor.' });
});

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;