import React, { useState, useEffect } from 'react';
import { AlertaChuva } from './AlertaChuva.jsx';
import { AlertaChuvaRuim } from './AlertaChuvaRuim.jsx';

export const PROMPT_1_RUIM = `Crie um componente React chamado AlertaChuvaRuim de alerta de chuva para o Recife. Use termos bem técnicos de meteorologia, letra pequena cinza-claro (#94a3b8) no fundo branco, uma imagem sem alt, um input só com placeholder (sem label) e uma div clicável amarela (#fde047) com texto branco escrita "Submit Data".`;

export const PROMPT_2_BOM = `Esse componente tem problemas sérios de acessibilidade para moradores do Recife usando celular na chuva. Corrija gerando o componente AlertaChuva:
1. Troque o texto técnico por linguagem simples dizendo o que fazer e qual abrigo procurar (Escola Municipal no Ibura + telefone 199).
2. Use alto contraste nas cores (WCAG AA >= 4.5:1).
3. Coloque atributo alt descritivo na imagem.
4. Adicione um <label htmlFor="campo-bairro"> conectado ao <input id="campo-bairro">.
5. Troque a <div onClick> por um <button type="submit"> nativo com altura de 48px para celular e foco de teclado visível.`;

export default function App() {
  // Alterna entre a versão com problemas (gerada por prompt vago) e a versão corrigida/acessível
  const [aba, setAba] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('modo') === 'ruim' ? 'ruim' : 'acessivel';
  });
  const [mostrarPrompts, setMostrarPrompts] = useState(false);
  const [copiado, setCopiado] = useState('');

  // Atualiza a URL (?modo=ruim ou ?modo=acessivel) para testar no Lighthouse sem perder a aba no reload
  function trocarModo(novoModo) {
    setAba(novoModo);
    const novaUrl = `${window.location.pathname}?modo=${novoModo}`;
    window.history.replaceState({}, '', novaUrl);
  }

  useEffect(() => {
    if (!window.location.search.includes('modo=')) {
      window.history.replaceState({}, '', `${window.location.pathname}?modo=${aba}`);
    }
  }, [aba]);

  function copiar(texto, id) {
    navigator.clipboard?.writeText(texto);
    setCopiado(id);
    setTimeout(() => setCopiado(''), 2000);
  }

  return (
    <div>
      {/* Barra superior para comparar o Antes x Depois da IA e testar no Lighthouse */}
      <nav className="barra-topo" aria-label="Alternar versões do componente">
        <span className="titulo-barra">🌧️ Alerta RMR · Antena na Lama</span>
        <div className="botoes-barra">
          <button
            type="button"
            className="btn-topo"
            onClick={() => setMostrarPrompts(!mostrarPrompts)}
          >
            🤖 Ver Prompts de IA {mostrarPrompts ? '▲' : '▼'}
          </button>
          <button
            type="button"
            className={`btn-topo ${aba === 'ruim' ? 'ativo' : ''}`}
            onClick={() => trocarModo('ruim')}
          >
            1. Antes (IA sem revisão)
          </button>
          <button
            type="button"
            className={`btn-topo ${aba === 'acessivel' ? 'ativo' : ''}`}
            onClick={() => trocarModo('acessivel')}
          >
            2. Depois (Acessível · AlertaChuva.jsx)
          </button>
        </div>
      </nav>

      {mostrarPrompts && (
        <aside className="painel-prompts">
          <div className="caixa-prompt">
            <strong>1️⃣ Prompt Vago (Gera a &quot;Caquinha&quot;):</strong>
            <code>{PROMPT_1_RUIM}</code>
            <button type="button" onClick={() => copiar(PROMPT_1_RUIM, 'p1')}>
              {copiado === 'p1' ? '✅ Copiado!' : '📋 Copiar Prompt 1'}
            </button>
          </div>
          <div className="caixa-prompt">
            <strong>2️⃣ Prompt Refinado (Pede Acessibilidade e Mobile):</strong>
            <code>{PROMPT_2_BOM}</code>
            <button type="button" onClick={() => copiar(PROMPT_2_BOM, 'p2')}>
              {copiado === 'p2' ? '✅ Copiado!' : '📋 Copiar Prompt 2'}
            </button>
          </div>
        </aside>
      )}

      <div className="container-pagina">
        {aba === 'ruim' ? <AlertaChuvaRuim /> : <AlertaChuva />}
      </div>
    </div>
  );
}
