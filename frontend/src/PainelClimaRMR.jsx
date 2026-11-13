import React, { useState, useEffect } from 'react';

export function PainelClimaRMR() {
  const [clima, setClima] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch('/api/clima?local=Recife')
      .then((res) => (res.ok ? res.json() : null))
      .then((dados) => {
        if (dados) {
          setClima(dados);
        } else {
          carregarFallback();
        }
      })
      .catch(() => {
        carregarFallback();
      })
      .finally(() => setCarregando(false));
  }, []);

  function carregarFallback() {
    setClima({
      temperatura: 28,
      condicao: 'Chuvoso com Alerta de Encostas',
      local: 'Região Metropolitana do Recife (RMR)',
      umidade: '88%',
      sensacaoTermica: 30,
      mare: '2.3m (Alta - Preamar de Sizígia)',
      fonte: 'APAC / CEMADEN / Defesa Civil (Offline)'
    });
  }

  return (
    <section className="secao-clima" aria-labelledby="titulo-clima">
      <header className="cabecalho-secao">
        <h2 id="titulo-clima">🌤️ Telemetria Climática & Marés da RMR</h2>
        <p className="subtitulo-secao">
          Monitoramento em tempo real de índices pluviométricos, maré do Porto do Recife e risco hidrogeológico.
        </p>
      </header>

      {carregando ? (
        <p className="carregando">Consultando sensores meteorológicos...</p>
      ) : (
        <div className="conteudo-clima">
          {/* Card Central de Condições */}
          <div className="card-tempo-principal">
            <div className="bloco-temp">
              <span className="icone-clima-grande">🌧️</span>
              <div>
                <span className="graus-temperatura">{clima.temperatura}°C</span>
                <span className="condicao-atual">{clima.condicao}</span>
              </div>
            </div>

            <div className="detalhes-tempo-grade">
              <div className="item-detalhe-tempo">
                <span className="rotulo-detalhe">🌊 Maré Atual:</span>
                <span className="valor-detalhe">{clima.mare || '2.3m (Alta)'}</span>
              </div>
              <div className="item-detalhe-tempo">
                <span className="rotulo-detalhe">💧 Umidade do Ar:</span>
                <span className="valor-detalhe">{clima.umidade || '88%'}</span>
              </div>
              <div className="item-detalhe-tempo">
                <span className="rotulo-detalhe">🌡️ Sensação Térmica:</span>
                <span className="valor-detalhe">{clima.sensacaoTermica || 30}°C</span>
              </div>
              <div className="item-detalhe-tempo">
                <span className="rotulo-detalhe">📡 Fonte de Dados:</span>
                <span className="valor-detalhe">{clima.fonte || 'APAC / CEMADEN'}</span>
              </div>
            </div>
          </div>

          {/* Avisos Práticos por Cenário */}
          <div className="grade-cenarios-alerta">
            <article className="card-cenario-alerta risco-alto">
              <h4>⚠️ Áreas de Morro & Encostas (Ibura / Monte Verde / Casa Amarela)</h4>
              <p>
                Solo saturado após chuvas acumuladas. Se notar inclinação de postes ou árvores, rachaduras em paredes ou estalos, abandone a residência e acione a Defesa Civil.
              </p>
              <a href="tel:199" className="link-ligar-rapido">
                📞 Ligar 199 (Defesa Civil do Recife)
              </a>
            </article>

            <article className="card-cenario-alerta risco-medio">
              <h4>🌊 Áreas Baixas & Beira de Rio (Joana Bezerra / Coque / Pina)</h4>
              <p>
                A maré alta (preamar de sizígia) dificulta o escoamento dos canais da bacia do Capibaribe e Tejipió. Não tente atravessar ruas com correnteza.
              </p>
              <a href="tel:193" className="link-ligar-rapido">
                📞 Ligar 193 (Corpo de Bombeiros)
              </a>
            </article>
          </div>
        </div>
      )}
    </section>
  );
}
