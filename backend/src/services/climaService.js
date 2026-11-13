const BAIRROS_RMR = {
  recife: { lat: -8.0476, lon: -34.877, tipoSolo: 'plano_alagavel' },
  ibura: { lat: -8.1189, lon: -34.9458, tipoSolo: 'encosta' },
  olinda: { lat: -8.0089, lon: -34.8553, tipoSolo: 'encosta' },
  jaboatao: { lat: -8.1128, lon: -35.0147, tipoSolo: 'encosta' },
  camaragibe: { lat: -8.0235, lon: -34.9782, tipoSolo: 'encosta' }
};

async function obterRiscosPorBairro(bairroInput) {
  const chave = bairroInput.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const local = BAIRROS_RMR[chave] || BAIRROS_RMR.recife;

  let temperatura = 31.0;
  let precipitacao = 2.5;
  let fonte = 'fallback_local';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${local.lat}&longitude=${local.lon}&current=temperature_2m,precipitation`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (response.ok) {
      const json = await response.json();
      temperatura = json.current?.temperature_2m ?? temperatura;
      precipitacao = json.current?.precipitation ?? precipitacao;
      fonte = 'open-meteo-live';
    }
  } catch (_) {
    // Mantém valores de fallback silenciosamente em caso de falha na rede
  }

  return {
    bairro: bairroInput,
    fonte,
    metricas: {
      temperaturaCelsius: temperatura,
      chuvaMmHora: precipitacao
    },
    riscos: {
      chuvasFortes: precipitacao > 15 ? 'ALTO' : precipitacao > 5 ? 'MODERADO' : 'BAIXO',
      alagamentos: precipitacao > 10 && local.tipoSolo === 'plano_alagavel' ? 'ALTO' : precipitacao > 5 ? 'MODERADO' : 'BAIXO',
      deslizamentoBarreiras: precipitacao > 12 && local.tipoSolo === 'encosta' ? 'ALTO' : precipitacao > 4 ? 'MODERADO' : 'BAIXO',
      calorIntenso: temperatura >= 34 ? 'ALTO' : temperatura >= 31 ? 'MODERADO' : 'BAIXO'
    }
  };
}

module.exports = { obterRiscosPorBairro };