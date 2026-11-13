async function avaliarTriagemIA(tipoProblema, vitima) {
  const problemaNorm = tipoProblema.toLowerCase();
  const ehVulneravel =
    vitima.idade >= 60 ||
    /cadeirante|gestante|mobilidade|acamado|hipertens/i.test(vitima.condicao_saude);

  // Integração real com LLM se LLM_API_KEY estiver configurada
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
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content:
                'Você é o motor de triagem de emergência da RMR. Retorne estritamente um JSON com as chaves: "prioridade" ("Alta", "Média" ou "Baixa"), "recurso_sugerido" (ex: "Barco Salva-Vidas", "Jipe 4x4", "Helicóptero Resgate", "Ambulância / Van Adaptada", "Caminhão Rede Elétrica") e "justificativa_ia" (1 frase curta).'
            },
            {
              role: 'user',
              content: `Ocorrência: ${tipoProblema}. Vítima: ${vitima.nome}, ${vitima.idade} anos, condição: ${vitima.condicao_saude}.`
            }
          ],
          max_tokens: 140
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        const parsed = JSON.parse(data.choices[0].message.content);
        if (parsed.prioridade && parsed.recurso_sugerido) return parsed;
      }
    } catch (_) {
      // Fallback determinístico abaixo
    }
  }

  // Motor de decisão determinístico (Contingência garantida)
  if (problemaNorm.includes('deslizamento') || problemaNorm.includes('barreira')) {
    return {
      prioridade: 'Alta',
      recurso_sugerido: ehVulneravel ? 'Helicóptero Resgate / Jipe 4x4' : 'Jipe 4x4 Geotécnico',
      justificativa_ia: `Fila Vermelha: Risco geotécnico crítico combinado com perfil (${vitima.idade} anos, ${vitima.condicao_saude}).`
    };
  }

  if (problemaNorm.includes('alagamento') || problemaNorm.includes('enchente')) {
    return {
      prioridade: ehVulneravel ? 'Alta' : 'Média',
      recurso_sugerido: 'Barco Salva-Vidas',
      justificativa_ia: ehVulneravel
        ? `Fila Vermelha: Vítima vulnerável (${vitima.condicao_saude}) ilhada em área alagada.`
        : 'Área alagada com necessidade de resgate aquático.'
    };
  }

  if (problemaNorm.includes('fio') || problemaNorm.includes('eletric') || problemaNorm.includes('poste')) {
    return {
      prioridade: 'Alta',
      recurso_sugerido: 'Caminhão Rede Elétrica',
      justificativa_ia: 'Risco iminente de choque elétrico em via pública.'
    };
  }

  if (problemaNorm.includes('calor') || problemaNorm.includes('desidrat')) {
    return {
      prioridade: ehVulneravel ? 'Alta' : 'Média',
      recurso_sugerido: 'Ambulância / Van Adaptada',
      justificativa_ia: `Encaminhamento prioritário para ponto de hidratação e acolhimento (${vitima.condicao_saude}).`
    };
  }

  return {
    prioridade: ehVulneravel ? 'Alta' : 'Baixa',
    recurso_sugerido: 'Viatura de Resgate Rápido',
    justificativa_ia: `Triagem automatizada para ${vitima.nome} (${vitima.idade} anos).`
  };
}

module.exports = { avaliarTriagemIA };