const http = require('http');

const ALERTAS_RMR = [
  {
    id: 1,
    bairro: 'Ibura / Lagoa Encantada',
    municipio: 'Recife',
    nivelRisco: 'ALTO',
    linguagemTecnica: 'Precipitação pluviométrica acumulada > 85mm/6h com saturação pedológica crítica em taludes.',
    linguagemSimples: 'Chuva muito forte nas últimas horas. Risco de deslizamento de barreira. Saia de perto do barranco e vá para o ponto de apoio.',
    abrigoMaisProximo: 'Escola Municipal Poeta Jonatas Braga (Rua Rio Tapado, s/n - Ibura)',
    telefoneEmergencia: '199 (Defesa Civil) / 0800 081 3400',
    mareStatus: 'Maré subindo (2.3m às 16h15) - Atenção para alagamentos perto de canais.',
    atualizadoEm: 'Atualizado há 5 min (Fonte: APAC / Defesa Civil do Recife)'
  },
  {
    id: 2,
    bairro: 'Ilha Joana Bezerra / Coque',
    municipio: 'Recife',
    nivelRisco: 'MODERADO',
    linguagemTecnica: 'Preamar de sizígia combinada com defluência da bacia do Capibaribe.',
    linguagemSimples: 'O rio e a maré estão cheios hoje. Ruas mais baixas podem alagar. Levante móveis e evite atravessar água acumulada.',
    abrigoMaisProximo: 'Centro Social Dom João Costa (Av. Central, Joana Bezerra)',
    telefoneEmergencia: '199 (Defesa Civil)',
    mareStatus: 'Maré alta (2.3m) - Evite jogar lixo no canal para a água escoar.',
    atualizadoEm: 'Atualizado há 10 min (Fonte: APAC / Dados Abertos Recife)'
  },
  {
    id: 3,
    bairro: 'Jardim Monte Verde',
    municipio: 'Jaboatão / Recife',
    nivelRisco: 'ALTO',
    linguagemTecnica: 'Índice de instabilidade geotécnica elevado com risco iminente de escorregamento planar.',
    linguagemSimples: 'Perigo na barreira! Se notar rachaduras no chão, água barrenta descendo ou postes inclinados, saia imediatamente com sua família.',
    abrigoMaisProximo: 'Igreja Batista em Monte Verde (Ponto de Apoio Comunitário)',
    telefoneEmergencia: '199 (Defesa Civil) / 193 (Bombeiros)',
    mareStatus: 'Sem influência direta de maré (Área de Morro/Encosta).',
    atualizadoEm: 'Atualizado há 3 min (Fonte: CEMADEN / Defesa Civil)'
  }
];

const pedidosAjuda = [];

function createAppHandler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ status: 'ok', desafio: 'Antena na Lama - RMR Recife' }));
    return;
  }

  if (req.method === 'GET' && req.url.startsWith('/api/alertas')) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ alertas: ALERTAS_RMR }));
    return;
  }

  if (req.method === 'POST' && req.url === '/api/ajuda') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const dados = JSON.parse(body || '{}');
        if (!dados.morador || !dados.bairro || !dados.situacao) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ erro: 'Preencha seu nome, bairro e o que está acontecendo.' }));
          return;
        }
        const novoPedido = {
          protocolo: `REC-${1000 + pedidosAjuda.length + 1}`,
          morador: dados.morador,
          bairro: dados.bairro,
          situacao: dados.situacao,
          criadoEm: new Date().toISOString()
        };
        pedidosAjuda.push(novoPedido);
        res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          mensagem: 'Seu aviso foi enviado para a Defesa Civil e lideranças do bairro!',
          pedido: novoPedido
        }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ erro: 'Formato inválido' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ erro: 'Rota não encontrada' }));
}

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  const server = http.createServer(createAppHandler);
  server.listen(PORT, () => {
    console.log(`API Antena na Lama rodando em http://localhost:${PORT}`);
  });
}

module.exports = { createAppHandler, ALERTAS_RMR };

