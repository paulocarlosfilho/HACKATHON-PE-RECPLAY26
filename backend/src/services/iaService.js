async function gerarOrientacaoIA(bairro, riscos) {
  const alertasAtivos = Object.entries(riscos)
    .filter(([, nivel]) => nivel === 'ALTO' || nivel === 'MODERADO')
    .map(([tipo, nivel]) => `${tipo}: ${nivel}`);

  if (process.env.LLM_API_KEY) {
    try {
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.LLM_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Você é um agente da Defesa Civil do Recife. Dê orientações curtas, diretas e acessíveis em português para moradores em área de risco.'
            },
            {
              role: 'user',
              content: `Bairro: ${bairro}. Níveis de risco atuais: ${JSON.stringify(riscos)}. O que o morador deve fazer agora?`
            }
          ],
          max_tokens: 150
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        return data.choices[0].message.content.trim();
      }
    } catch (_) {
      // Cai no gerador local se a API de IA falhar
    }
  }

  // Contingência inteligente local
  if (riscos.deslizamentoBarreiras === 'ALTO') {
    return `ATENÇÃO (${bairro}): Risco ALTO de deslizamento de barreira. Saia imediatamente de perto do talude, desligue a energia elétrica e procure abrigo seguro. Ligue Defesa Civil: 199.`;
  }
  if (riscos.alagamentos === 'ALTO' || riscos.chuvasFortes === 'ALTO') {
    return `ALERTA (${bairro}): Chuva forte e risco de alagamento. Evite transitar em vias alagadas, proteja documentos em sacos plásticos e acompanhe os canais da Defesa Civil (199).`;
  }
  if (riscos.calorIntenso === 'ALTO') {
    return `AVISO DE CALOR (${bairro}): Temperatura elevada. Beba água regularmente, evite exposição direta ao sol entre 10h e 16h e redobre a atenção com crianças e idosos.`;
  }

  return alertasAtivos.length > 0
    ? `Monitoramento ativo em ${bairro} (${alertasAtivos.join(', ')}). Mantenha-se atento às atualizações meteorológicas.`
    : `Situação normal em ${bairro}. Nenhum risco climático crítico detectado no momento.`;
}

module.exports = { gerarOrientacaoIA };