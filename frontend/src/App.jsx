import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { AlertaChuva } from './AlertaChuva.jsx';
import { AlertaChuvaRuim } from './AlertaChuvaRuim.jsx';
import { CentralResgate } from './CentralResgate.jsx';
import { InstituicoesFrota } from './InstituicoesFrota.jsx';
import { RedeVulneraveis } from './RedeVulneraveis.jsx';
import { PainelClimaRMR } from './PainelClimaRMR.jsx';
=======
import { io } from 'socket.io-client';
import PainelCidadao from './components/PainelCidadao';
import PainelInstitucional from './components/PainelInstitucional';
import './styles.css';
>>>>>>> ad37457469eac9c2ed94c361a4496fbd16612845

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function App() {
<<<<<<< HEAD
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
=======
  const [aba, setAba] = useState('cidadao');
  const [chamados, setChamados] = useState([]);
  const [chamadoAtivo, setChamadoAtivo] = useState(null);
  const [calor, setCalor] = useState(null);

  useEffect(() => {
    async function inicializar() {
      try {
        const [respChamados, respCalor] = await Promise.all([
          fetch(`${API_URL}/api/chamados`),
          fetch(`${API_URL}/api/calor-extremo?temp=35.0`)
        ]);
        if (respChamados.ok && respCalor.ok) {
          setChamados(await respChamados.json());
          setCalor(await respCalor.json());
          return;
        }
        throw new Error('Fallback');
      } catch (_) {
        const fb = await fetch('/alerta.json').then((r) => r.json());
        setChamados(fb.chamados);
        setCalor(fb.calor);
      }
    }
>>>>>>> ad37457469eac9c2ed94c361a4496fbd16612845

    inicializar();

    const socket = io(API_URL, { transports: ['websocket', 'polling'] });
    socket.on('novo_chamado', (novo) => {
      setChamados((prev) => [novo, ...prev.filter((c) => c.id !== novo.id)]);
    });
    socket.on('chamado_atualizado', (atualizado) => {
      setChamados((prev) => prev.map((c) => (c.id === atualizado.id ? { ...c, ...atualizado } : c)));
      setChamadoAtivo((prev) => (prev && prev.id === atualizado.id ? { ...prev, ...atualizado } : prev));
    });

    return () => socket.disconnect();
  }, []);

  function handleNovoChamado(novo) {
    setChamadoAtivo(novo);
    setChamados((prev) => [novo, ...prev.filter((c) => c.id !== novo.id)]);
  }

  function handleAceitarChamado(atualizado) {
    setChamados((prev) => prev.map((c) => (c.id === atualizado.id ? { ...c, ...atualizado } : c)));
    setChamadoAtivo((prev) => (prev && prev.id === atualizado.id ? { ...prev, ...atualizado } : prev));
  }

  return (
<<<<<<< HEAD
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
=======
    <main className="container">
      <header className="topo">
        <h1>Antena na Lama • Resgate RMR</h1>
        <p>Triagem por IA & Despacho Descentralizado em Tempo Real</p>
      </header>

      <nav className="tabs" aria-label="Alternar visão do sistema">
        <button
          className={aba === 'cidadao' ? 'tab ativa' : 'tab'}
          onClick={() => setAba('cidadao')}
        >
          📱 Visão Cidadão (SOS)
        </button>
        <button
          className={aba === 'instituicao' ? 'tab ativa' : 'tab'}
          onClick={() => setAba('instituicao')}
        >
          🏛️ Visão Instituições ({chamados.filter((c) => c.status === 'Pendente').length})
        </button>
      </nav>

      {aba === 'cidadao' ? (
        <PainelCidadao
          apiUrl={API_URL}
          chamadoAtivo={chamadoAtivo}
          onNovoChamado={handleNovoChamado}
        />
      ) : (
        <PainelInstitucional
          apiUrl={API_URL}
          chamados={chamados}
          calor={calor}
          onAceitarChamado={handleAceitarChamado}
        />
      )}
    </main>
>>>>>>> ad37457469eac9c2ed94c361a4496fbd16612845
  );
}