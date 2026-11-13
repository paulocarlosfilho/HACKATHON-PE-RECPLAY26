import React, { useState, useEffect } from 'react';
import { AlertaChuva } from './AlertaChuva.jsx';
import { AlertaChuvaRuim } from './AlertaChuvaRuim.jsx';
import { CentralResgate } from './CentralResgate.jsx';
import { InstituicoesFrota } from './InstituicoesFrota.jsx';
import { RedeVulneraveis } from './RedeVulneraveis.jsx';
import { PainelClimaRMR } from './PainelClimaRMR.jsx';

export const PROMPT_1_RUIM = `Crie um componente React chamado AlertaChuvaRuim de alerta de chuva para o Recife. Use termos bem técnicos de meteorologia, letra pequena cinza-claro (#94a3b8) no fundo branco, uma imagem sem alt, um input só com placeholder (sem label) e uma div clicável amarela (#fde047) com texto branco escrita "Submit Data".`;

export const PROMPT_2_BOM = `Esse componente tem problemas sérios de acessibilidade para moradores do Recife usando celular na chuva. Corrija gerando o componente AlertaChuva:
1. Troque o texto técnico por linguagem simples dizendo o que fazer e qual abrigo procurar (Escola Municipal no Ibura + telefone 199).
2. Use alto contraste nas cores (WCAG AA >= 4.5:1).
3. Coloque atributo alt descritivo na imagem.
4. Adicione um <label htmlFor="campo-bairro"> conectado ao <input id="campo-bairro">.
5. Troque a <div onClick> por um <button type="submit"> nativo com altura de 48px para celular e foco de teclado visível.`;

export default function App() {
  const [modoComparativo, setModoComparativo] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('modo') === 'ruim' ? 'ruim' : 'acessivel';
  });

  const [abaAtiva, setAbaAtiva] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('aba') || 'alertas';
  });

  const [mostrarPrompts, setMostrarPrompts] = useState(false);
  const [copiado, setCopiado] = useState('');
  const [modoOffline, setModoOffline] = useState(false);

  // Testa conectividade com a API do backend
  useEffect(() => {
    fetch('/health')
      .then((res) => {
        if (!res.ok) setModoOffline(true);
        else setModoOffline(false);
      })
      .catch(() => setModoOffline(true));
  }, []);

  function trocarModoComparativo(novoModo) {
    setModoComparativo(novoModo);
    const params = new URLSearchParams(window.location.search);
    params.set('modo', novoModo);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }

  function trocarAba(novaAba) {
    setAbaAtiva(novaAba);
    const params = new URLSearchParams(window.location.search);
    params.set('aba', novaAba);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }

  function copiar(texto, id) {
    navigator.clipboard?.writeText(texto);
    setCopiado(id);
    setTimeout(() => setCopiado(''), 2000);
  }

  return (
    <div className="app-layout">
      {/* Barra superior de status e comparação de IA */}
      <nav className="barra-topo" aria-label="Controles da aplicação e modo de IA">
        <div className="lado-esquerdo-topo">
          <span className="titulo-barra">🌧️ Alerta RMR · Antena na Lama</span>
          <span className={`badge-conexao ${modoOffline ? 'conexao-offline' : 'conexao-online'}`}>
            {modoOffline ? '⚠️ Modo Contingência (Offline / 3G)' : '🟢 Backend Online'}
          </span>
        </div>

        <div className="botoes-barra">
          <button
            type="button"
            className="btn-topo"
            onClick={() => setMostrarPrompts(!mostrarPrompts)}
            aria-expanded={mostrarPrompts}
          >
            🤖 Prompts IA {mostrarPrompts ? '▲' : '▼'}
          </button>

          <button
            type="button"
            className={`btn-topo ${modoComparativo === 'ruim' ? 'ativo' : ''}`}
            onClick={() => trocarModoComparativo('ruim')}
          >
            1. Antes (IA sem revisão)
          </button>

          <button
            type="button"
            className={`btn-topo ${modoComparativo === 'acessivel' ? 'ativo' : ''}`}
            onClick={() => trocarModoComparativo('acessivel')}
          >
            2. Depois (Acessível)
          </button>

          <a href="tel:199" className="btn-ligar-topo" title="Ligar 199 grátis">
            📞 199
          </a>
        </div>
      </nav>

      {/* Painel expansível de prompts éticos de IA */}
      {mostrarPrompts && (
        <aside className="painel-prompts" aria-label="Painel de Auditoria de Prompts de IA">
          <div className="caixa-prompt">
            <strong>1️⃣ Prompt Vago (Gera código com problemas de acessibilidade):</strong>
            <code>{PROMPT_1_RUIM}</code>
            <button type="button" onClick={() => copiar(PROMPT_1_RUIM, 'p1')}>
              {copiado === 'p1' ? '✅ Copiado!' : '📋 Copiar Prompt 1'}
            </button>
          </div>
          <div className="caixa-prompt">
            <strong>2️⃣ Prompt Refinado (Acessibilidade WCAG AA, Mobile-First e Linguagem Simples):</strong>
            <code>{PROMPT_2_BOM}</code>
            <button type="button" onClick={() => copiar(PROMPT_2_BOM, 'p2')}>
              {copiado === 'p2' ? '✅ Copiado!' : '📋 Copiar Prompt 2'}
            </button>
          </div>
        </aside>
      )}

      {/* Se o usuário selecionou o modo "ruim", exibe a versão sem acessibilidade para demonstrar no Lighthouse */}
      {modoComparativo === 'ruim' ? (
        <div className="container-pagina">
          <AlertaChuvaRuim />
        </div>
      ) : (
        <>
          {/* Navegação principal em abas acessíveis */}
          <header className="cabecalho-principal">
            <nav className="navegacao-abas" role="tablist" aria-label="Módulos da Plataforma">
              <button
                type="button"
                role="tab"
                id="tab-alertas"
                aria-selected={abaAtiva === 'alertas'}
                aria-controls="panel-alertas"
                className={`btn-aba ${abaAtiva === 'alertas' ? 'ativa' : ''}`}
                onClick={() => trocarAba('alertas')}
              >
                📢 Alerta Comunitário
              </button>

              <button
                type="button"
                role="tab"
                id="tab-resgates"
                aria-selected={abaAtiva === 'resgates'}
                aria-controls="panel-resgates"
                className={`btn-aba ${abaAtiva === 'resgates' ? 'ativa' : ''}`}
                onClick={() => trocarAba('resgates')}
              >
                🆘 Central de Resgate & IA
              </button>

              <button
                type="button"
                role="tab"
                id="tab-frota"
                aria-selected={abaAtiva === 'frota'}
                aria-controls="panel-frota"
                className={`btn-aba ${abaAtiva === 'frota' ? 'ativa' : ''}`}
                onClick={() => trocarAba('frota')}
              >
                🚒 Frota & Instituições
              </button>

              <button
                type="button"
                role="tab"
                id="tab-vulneraveis"
                aria-selected={abaAtiva === 'vulneraveis'}
                aria-controls="panel-vulneraveis"
                className={`btn-aba ${abaAtiva === 'vulneraveis' ? 'ativa' : ''}`}
                onClick={() => trocarAba('vulneraveis')}
              >
                🛡️ Rede de Vulneráveis
              </button>

              <button
                type="button"
                role="tab"
                id="tab-clima"
                aria-selected={abaAtiva === 'clima'}
                aria-controls="panel-clima"
                className={`btn-aba ${abaAtiva === 'clima' ? 'ativa' : ''}`}
                onClick={() => trocarAba('clima')}
              >
                🌤️ Telemetria & Marés
              </button>
            </nav>
          </header>

          {/* Painéis de Conteúdo das Abas */}
          <main className="container-conteudo-principal">
            {abaAtiva === 'alertas' && (
              <div
                id="panel-alertas"
                role="tabpanel"
                aria-labelledby="tab-alertas"
                className="painel-aba-conteudo"
              >
                <div className="container-pagina">
                  <AlertaChuva />
                </div>
              </div>
            )}

            {abaAtiva === 'resgates' && (
              <div
                id="panel-resgates"
                role="tabpanel"
                aria-labelledby="tab-resgates"
                className="painel-aba-conteudo"
              >
                <CentralResgate modoOffline={modoOffline} />
              </div>
            )}

            {abaAtiva === 'frota' && (
              <div
                id="panel-frota"
                role="tabpanel"
                aria-labelledby="tab-frota"
                className="painel-aba-conteudo"
              >
                <InstituicoesFrota />
              </div>
            )}

            {abaAtiva === 'vulneraveis' && (
              <div
                id="panel-vulneraveis"
                role="tabpanel"
                aria-labelledby="tab-vulneraveis"
                className="painel-aba-conteudo"
              >
                <RedeVulneraveis />
              </div>
            )}

            {abaAtiva === 'clima' && (
              <div
                id="panel-clima"
                role="tabpanel"
                aria-labelledby="tab-clima"
                className="painel-aba-conteudo"
              >
                <PainelClimaRMR />
              </div>
            )}
          </main>
        </>
      )}

      {/* Rodapé acessível com informações de emergência */}
      <footer className="rodape-emergencia">
        <div className="container-rodape">
          <p className="texto-rodape">
            <strong>Antena na Lama · Hackathon APONTI Academy</strong> | Desenvolvido com IA Responsável para a Região Metropolitana do Recife.
          </p>
          <div className="telefones-uteis">
            <span>🚨 Defesa Civil: <strong>199</strong></span>
            <span>🚒 Bombeiros: <strong>193</strong></span>
            <span>🚑 SAMU: <strong>192</strong></span>
            <span>⚡ Neoenergia: <strong>116</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
