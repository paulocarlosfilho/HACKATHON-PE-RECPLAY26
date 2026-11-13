const express = require('express');
const router = express.Router();

const ALERTAS_RMR = [
  {
    id: 1,
    bairro: 'Ibura / Lagoa Encantada',
    municipio: 'Recife',
    nivelRisco: 'ALTO',
    tipo: 'Deslizamento de Barreira',
    linguagemTecnica: 'Precipitação pluviométrica acumulada > 85mm/6h com saturação pedológica crítica em taludes.',
    linguagemSimples: 'Chuva muito forte nas últimas horas! Risco de deslizamento de barreira. Saia de perto do barranco e vá para o ponto de apoio.',
    abrigoMaisProximo: 'Escola Municipal Poeta Jonatas Braga (Rua Rio Tapado, s/n - Ibura)',
    telefoneEmergencia: '199 (Defesa Civil) / 193 (Bombeiros)',
    mareStatus: 'Maré subindo (2.3m às 16h15) - Atenção para alagamentos perto de canais.',
    atualizadoEm: 'Atualizado há 5 min (Fonte: APAC / Defesa Civil do Recife)'
  },
  {
    id: 2,
    bairro: 'Ilha Joana Bezerra / Coque',
    municipio: 'Recife',
    nivelRisco: 'MODERADO',
    tipo: 'Alagamento e Preamar',
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
    tipo: 'Deslizamento e Instabilidade Geotécnica',
    linguagemTecnica: 'Índice de instabilidade geotécnica elevado com risco iminente de escorregamento planar.',
    linguagemSimples: 'Perigo na barreira! Se notar rachaduras no chão, água barrenta descendo ou postes inclinados, saia imediatamente com sua família.',
    abrigoMaisProximo: 'Igreja Batista em Monte Verde (Ponto de Apoio Comunitário)',
    telefoneEmergencia: '199 (Defesa Civil) / 193 (Bombeiros)',
    mareStatus: 'Sem influência direta de maré (Área de Morro/Encosta).',
    atualizadoEm: 'Atualizado há 3 min (Fonte: CEMADEN / Defesa Civil)'
  }
];

const pedidosAjuda = [];

router.get('/', (req, res) => {
  res.status(200).json({ alertas: ALERTAS_RMR });
});

router.post('/ajuda', (req, res) => {
  const { morador, bairro, situacao, telefone } = req.body;
  if (!morador || !bairro || !situacao) {
    return res.status(400).json({ erro: 'Preencha seu nome, bairro e o que está acontecendo.' });
  }

  const novoPedido = {
    protocolo: `REC-${1000 + pedidosAjuda.length + 1}`,
    morador,
    bairro,
    situacao,
    telefone: telefone || 'Não informado',
    criadoEm: new Date().toISOString()
  };
  pedidosAjuda.push(novoPedido);

  res.status(201).json({
    mensagem: 'Seu aviso foi enviado para a Defesa Civil e lideranças comunitárias do bairro!',
    pedido: novoPedido
  });
});

module.exports = { router, ALERTAS_RMR };
