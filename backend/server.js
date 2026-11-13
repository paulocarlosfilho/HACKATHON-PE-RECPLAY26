require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Server } = require('socket.io');
const resgateRoutes = require('./src/routes/resgateRoutes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.ALLOWED_ORIGIN || '*' }
});

app.set('io', io);

io.on('connection', (socket) => {
  socket.on('registrar_assistencia_calor', (payload) => {
    io.emit('assistencia_calor_atualizada', { ...payload, statusAssistencia: 'Concluida' });
  });
});

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json({ limit: '50kb' }));

app.use('/', resgateRoutes);

app.use((err, req, res, next) => {
  console.error('[ERRO INTERNO]:', err.message);
  res.status(500).json({ erro: 'Erro interno no servidor.' });
});

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Servidor PRD (REST + WebSockets) rodando na porta ${PORT}`);
  });
}

module.exports = app;