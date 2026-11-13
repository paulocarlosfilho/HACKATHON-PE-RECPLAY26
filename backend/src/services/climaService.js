const { listarUsuariosVulneraveis } = require('../db/store');

async function verificarOndaDeCalor(temperaturaSimulada) {
  let temperaturaAtual = temperaturaSimulada !== undefined ? Number(temperaturaSimulada) : 33.5;
  let fonte = temperaturaSimulada !== undefined ? 'simulacao_painel' : 'fallback_rmr';

  if (temperaturaSimulada === undefined) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=-8.0476&longitude=-34.8770&current=temperature_2m';
      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (resp.ok) {
        const json = await resp.json();
        temperaturaAtual = json.current?.temperature_2m ?? temperaturaAtual;
        fonte = 'open-meteo-live';
      }
    } catch (_) {
      // Mantém fallback
    }
  }

  const alertaOndaCalor = temperaturaAtual >= 33.0;
  const vulneraveis = alertaOndaCalor ? await listarUsuariosVulneraveis() : [];

  return {
    regiao: 'Região Metropolitana do Recife (RMR)',
    temperaturaCelsius: temperaturaAtual,
    fonte,
    alertaOndaCalor,
    totalPessoasMonitoradas: vulneraveis.length,
    planoAssistencia: vulneraveis.map((pessoa) => ({
      usuario_id: pessoa.id,
      nome: pessoa.nome,
      idade: pessoa.idade,
      condicao_saude: pessoa.condicao_saude,
      coordenadas: { lat: pessoa.lat, lng: pessoa.lng },
      acaoRecomendada: 'Visita domiciliar de hidratação e encaminhamento para Ponto de Acolhimento climatizado',
      statusAssistencia: 'Pendente_Visita'
    }))
  };
}

module.exports = { verificarOndaDeCalor };