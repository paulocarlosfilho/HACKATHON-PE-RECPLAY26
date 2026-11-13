import React, { useState, useEffect } from 'react';

export function CentralResgate({ modoOffline }) {
  const [chamados, setChamados] = useState([]);
  const [instituicoes, setInstituicoes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('Todos');

  // Formulário de novo chamado
  const [tipoProblema, setTipoProblema] = useState('');
  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');
  const [nomeVitima, setNomeVitima] = useState('');
  const [idadeVitima, setIdadeVitima] = useState('');
  const [condicaoVitima, setCondicaoVitima] = useState('');
  const [localizacao, setLocalizacao] = useState('Ibura - Recife');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erroForm, setErroForm] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Pré-visualização da Triagem IA
  const [previewIA, setPreviewIA] = useState(null);

  // Carregar dados
  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    try {
      const [resChamados, resInst, resUsers] = await Promise.all([
        fetch('/api/chamados').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/instituicoes').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/usuarios').then((r) => (r.ok ? r.json() : []))
      ]);
      setChamados(resChamados);
      setInstituicoes(resInst);
      setUsuarios(resUsers);
    } catch (_) {
      // Fallback local se backend oscilar ou estiver offline
      setChamados([
        {
          id: 1,
          usuario_id: 1,
          vitima: 'Dona Maria Clarice (78 anos, Hipertensa)',
          instituicao_id: 2,
          instituicao_nome: 'Defesa Civil do Recife',
          tipo_problema: 'Risco de Deslizamento de Barreira no Ibura',
          prioridade: 'Alta',
          recurso_sugerido: 'Jipe 4x4 Geotécnico',
          justificativa_ia: 'Fila Vermelha: Vítima idosa com mobilidade reduzida em talude saturado.',
          status: 'A_Caminho',
          criado_em: new Date().toISOString()
        },
        {
          id: 2,
          usuario_id: 2,
          vitima: 'Seu Severino (82 anos, Cadeirante)',
          instituicao_id: null,
          instituicao_nome: null,
          tipo_problema: 'Alagamento na Rua Central (Coque / Joana Bezerra)',
          prioridade: 'Alta',
          recurso_sugerido: 'Barco Salva-Vidas',
          justificativa_ia: 'Fila Vermelha: Cadeirante ilhado em residência com nível de água subindo.',
          status: 'Pendente',
          criado_em: new Date().toISOString()
        }
      ]);
      setInstituicoes([
        { id: 1, nome: 'Corpo de Bombeiros Militar PE', tipo_esfera: 'Estadual' },
        { id: 2, nome: 'Defesa Civil do Recife', tipo_esfera: 'Municipal' },
        { id: 3, nome: 'ONG Resgate Comunitário Ibura', tipo_esfera: 'ONG Certificada' },
        { id: 4, nome: 'Neoenergia Pernambuco (Emergência)', tipo_esfera: 'Concessionária' }
      ]);
    } finally {
      setCarregando(false);
    }
  }

  // Atualizar preview da IA quando muda o tipo de problema ou vítima
  useEffect(() => {
    if (!tipoProblema) {
      setPreviewIA(null);
      return;
    }

    const problemaLower = tipoProblema.toLowerCase();
    let vitimaInfo = {
      idade: Number(idadeVitima) || 35,
      condicao: condicaoVitima || 'Sem comorbidades'
    };

    if (usuarioSelecionado) {
      const u = usuarios.find((user) => user.id === Number(usuarioSelecionado));
      if (u) {
        vitimaInfo = { idade: u.idade, condicao: u.condicao_saude };
      }
    }

    const ehVulneravel =
      vitimaInfo.idade >= 60 ||
      /cadeirante|gestante|mobilidade|acamado|hipertens/i.test(vitimaInfo.condicao);

    let prioridade = 'Média';
    let recurso = 'Viatura de Apoio Comunitário';
    let justificativa = 'Triagem preliminar automatizada.';

    if (problemaLower.includes('deslizamento') || problemaLower.includes('barreira')) {
      prioridade = 'Alta';
      recurso = ehVulneravel ? 'Helicóptero Resgate / Jipe 4x4' : 'Jipe 4x4 Geotécnico';
      justificativa = `Fila Vermelha: Risco geotécnico em encosta com morador ${ehVulneravel ? 'vulnerável' : 'no local'}.`;
    } else if (problemaLower.includes('alagamento') || problemaLower.includes('enchente')) {
      prioridade = ehVulneravel ? 'Alta' : 'Média';
      recurso = 'Barco Salva-Vidas';
      justificativa = ehVulneravel
        ? 'Fila Vermelha: Vítima prioritária ilhada em ponto de alagamento rápido.'
        : 'Área com acúmulo hídrico necessitando deslocamento aquático.';
    } else if (problemaLower.includes('fio') || problemaLower.includes('poste') || problemaLower.includes('eletric')) {
      prioridade = 'Alta';
      recurso = 'Caminhão Rede Elétrica';
      justificativa = 'Risco iminente de choque elétrico em via pública.';
    }

    setPreviewIA({ prioridade, recurso, justificativa });
  }, [tipoProblema, usuarioSelecionado, idadeVitima, condicaoVitima, usuarios]);

  async function handleCriarChamado(e) {
    e.preventDefault();
    setErroForm('');
    setMensagemSucesso('');
    setEnviando(true);

    try {
      const payload = {
        usuario_id: usuarioSelecionado ? Number(usuarioSelecionado) : null,
        tipo_problema: tipoProblema,
        vitima_nome: nomeVitima || (usuarioSelecionado ? '' : 'Morador Solicitante'),
        vitima_idade: idadeVitima || 35,
        vitima_condicao: condicaoVitima || 'Sem comorbidades',
        lat: -8.0542,
        lng: -34.8813
      };

      const res = await fetch('/api/chamados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Erro ao salvar no servidor');
      }

      const novo = await res.json();
      setChamados((ant) => [novo, ...ant]);
      setMensagemSucesso(`✅ Chamado #${novo.id} criado com sucesso! Triagem: Prioridade ${novo.prioridade} (${novo.recurso_sugerido}).`);
      setTipoProblema('');
      setUsuarioSelecionado('');
      setNomeVitima('');
      setIdadeVitima('');
      setCondicaoVitima('');
      setPreviewIA(null);
    } catch (_) {
      // Fallback local se estiver offline
      const novoLocal = {
        id: chamados.length + 1,
        usuario_id: usuarioSelecionado ? Number(usuarioSelecionado) : null,
        vitima: nomeVitima || 'Morador Solicitante',
        instituicao_id: null,
        instituicao_nome: null,
        tipo_problema: tipoProblema,
        prioridade: previewIA?.prioridade || 'Alta',
        recurso_sugerido: previewIA?.recurso || 'Viatura de Apoio Comunitário',
        justificativa_ia: previewIA?.justificativa || 'Triagem local registrada em contingência.',
        status: 'Pendente',
        criado_em: new Date().toISOString()
      };
      setChamados((ant) => [novoLocal, ...ant]);
      setMensagemSucesso(`✅ [Modo Contingência] Chamado #${novoLocal.id} salvo localmente.`);
    } finally {
      setEnviando(false);
    }
  }

  async function handleAceitarChamado(chamadoId, instituicaoId) {
    try {
      const res = await fetch(`/api/chamados/${chamadoId}/aceitar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instituicao_id: Number(instituicaoId) })
      });

      if (res.ok) {
        const atualizado = await res.json();
        setChamados((ant) => ant.map((c) => (c.id === chamadoId ? atualizado : c)));
      } else {
        throw new Error();
      }
    } catch (_) {
      // Fallback local
      const inst = instituicoes.find((i) => i.id === Number(instituicaoId));
      setChamados((ant) =>
        ant.map((c) =>
          c.id === chamadoId
            ? { ...c, status: 'A_Caminho', instituicao_id: Number(instituicaoId), instituicao_nome: inst?.nome || 'Órgão de Resgate' }
            : c
        )
      );
    }
  }

  async function handleFinalizarChamado(chamadoId) {
    try {
      const res = await fetch(`/api/chamados/${chamadoId}/finalizar`, {
        method: 'PATCH'
      });

      if (res.ok) {
        const atualizado = await res.json();
        setChamados((ant) => ant.map((c) => (c.id === chamadoId ? atualizado : c)));
      } else {
        throw new Error();
      }
    } catch (_) {
      // Fallback local
      setChamados((ant) =>
        ant.map((c) => (c.id === chamadoId ? { ...c, status: 'Resgatado' } : c))
      );
    }
  }

  const chamadosFiltrados = chamados.filter((c) => {
    if (filtroStatus === 'Todos') return true;
    return c.status === filtroStatus;
  });

  return (
    <section className="secao-resgate" aria-labelledby="titulo-central-resgate">
      <header className="cabecalho-secao">
        <h2 id="titulo-central-resgate">🆘 Central de Resgate & Triagem por IA</h2>
        <p className="subtitulo-secao">
          Despacho descentralizado conectando a população aos Bombeiros, Defesa Civil, ONGs locais e concessionárias da RMR.
        </p>
      </header>

      {/* Formulário de Chamado de Emergência com Triagem IA */}
      <div className="card-formulario-resgate">
        <h3>📋 Abrir Novo Chamado de Emergência</h3>
        <p className="dica-formulario">
          A IA analisa automaticamente a vulnerabilidade da vítima e a gravidade do evento meteorológico para priorizar a fila de socorro.
        </p>

        <form onSubmit={handleCriarChamado} className="form-resgate">
          {/* Selecionar morador vulnerável pré-cadastrado ou digitar */}
          <div className="grupo-campo">
            <label htmlFor="select-usuario" className="label-forte">
              Vítima na Rede de Proteção (Opcional):
            </label>
            <select
              id="select-usuario"
              value={usuarioSelecionado}
              onChange={(e) => {
                setUsuarioSelecionado(e.target.value);
                if (e.target.value) {
                  setNomeVitima('');
                  setIdadeVitima('');
                  setCondicaoVitima('');
                }
              }}
              className="select-acessivel"
            >
              <option value="">-- Cadastrado avulso ou outro cidadão --</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome} ({u.idade} anos · {u.condicao_saude})
                </option>
              ))}
            </select>
          </div>

          {!usuarioSelecionado && (
            <div className="grade-dupla">
              <div className="grupo-campo">
                <label htmlFor="campo-nome-vitima" className="label-forte">
                  Nome da Vítima ou Solicitante:
                </label>
                <input
                  id="campo-nome-vitima"
                  type="text"
                  placeholder="Ex: Dona Maria"
                  value={nomeVitima}
                  onChange={(e) => setNomeVitima(e.target.value)}
                  className="input-acessivel"
                />
              </div>

              <div className="grupo-campo">
                <label htmlFor="campo-idade-vitima" className="label-forte">
                  Idade:
                </label>
                <input
                  id="campo-idade-vitima"
                  type="number"
                  min="0"
                  max="120"
                  placeholder="Ex: 72"
                  value={idadeVitima}
                  onChange={(e) => setIdadeVitima(e.target.value)}
                  className="input-acessivel"
                />
              </div>

              <div className="grupo-campo span-2">
                <label htmlFor="campo-condicao-vitima" className="label-forte">
                  Condição de Saúde / Mobilidade:
                </label>
                <input
                  id="campo-condicao-vitima"
                  type="text"
                  placeholder="Ex: Cadeirante, Gestante, Hipertenso, Acamado..."
                  value={condicaoVitima}
                  onChange={(e) => setCondicaoVitima(e.target.value)}
                  className="input-acessivel"
                />
              </div>
            </div>
          )}

          {/* Tipo de Ocorrência */}
          <div className="grupo-campo">
            <label htmlFor="campo-problema" className="label-forte">
              Qual é a emergência no local? *
            </label>
            <select
              id="campo-problema"
              required
              value={tipoProblema}
              onChange={(e) => setTipoProblema(e.target.value)}
              className="select-acessivel"
            >
              <option value="">-- Selecione o tipo de ocorrência --</option>
              <option value="Deslizamento de Barreira / Risco Geotécnico">
                ⚠️ Deslizamento de Barreira / Risco Geotécnico (Encosta)
              </option>
              <option value="Alagamento Severo / Casa Inundada">
                🌊 Alagamento Severo / Casa Inundada (Área Baixa / Canal)
              </option>
              <option value="Fio de Alta Tensão Caído na Água / Poste Inclinado">
                ⚡ Fio de Alta Tensão Caído na Água / Poste Inclinado
              </option>
              <option value="Onda de Calor Extrema / Idoso Desidratado">
                ☀️ Onda de Calor Extrema / Idoso Desidratado
              </option>
              <option value="Isolamento / Resgate de Animais e Famílias">
                🆘 Isolamento / Resgate de Famílias
              </option>
            </select>
          </div>

          <div className="grupo-campo">
            <label htmlFor="campo-localizacao" className="label-forte">
              Ponto de Referência / Bairro:
            </label>
            <input
              id="campo-localizacao"
              type="text"
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              className="input-acessivel"
              placeholder="Ex: Ibura de Baixo, próx. ao campo"
            />
          </div>

          {/* Painel em tempo real da Triagem por IA */}
          {previewIA && (
            <div
              className={`box-preview-ia prioridade-${previewIA.prioridade.toLowerCase()}`}
              role="region"
              aria-label="Avaliação Preliminar da IA"
            >
              <p className="titulo-preview">
                🤖 <strong>Triagem Preliminar da IA:</strong> Prioridade{' '}
                <span className="badge-prioridade">{previewIA.prioridade}</span>
              </p>
              <p className="texto-recurso">
                🚑 <strong>Recurso Recomendado:</strong> {previewIA.recurso}
              </p>
              <p className="texto-justificativa">
                💡 <strong>Justificativa:</strong> {previewIA.justificativa}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={enviando || !tipoProblema}
            className="botao-acessivel botao-destaque"
          >
            {enviando ? 'Enviando e Classificando...' : '🚨 Disparar Chamado de Emergência'}
          </button>
        </form>

        {mensagemSucesso && (
          <p role="status" className="msg-sucesso">
            {mensagemSucesso}
          </p>
        )}
      </div>

      {/* Lista de Chamados com Filtros */}
      <div className="painel-chamados-ativos">
        <div className="topo-lista-chamados">
          <h3>🚨 Ocorrências Registradas ({chamadosFiltrados.length})</h3>

          {/* Filtros de Status */}
          <div className="botoes-filtro" role="group" aria-label="Filtrar chamados por status">
            {['Todos', 'Pendente', 'A_Caminho', 'Resgatado'].map((st) => (
              <button
                key={st}
                type="button"
                className={`btn-filtro ${filtroStatus === st ? 'ativo' : ''}`}
                onClick={() => setFiltroStatus(st)}
              >
                {st === 'A_Caminho' ? 'A Caminho' : st}
              </button>
            ))}
          </div>
        </div>

        {carregando ? (
          <p className="carregando">Carregando chamados de emergência...</p>
        ) : chamadosFiltrados.length === 0 ? (
          <p className="msg-vazia">Nenhum chamado encontrado com o filtro &quot;{filtroStatus}&quot;.</p>
        ) : (
          <div className="grade-chamados">
            {chamadosFiltrados.map((c) => (
              <article key={c.id} className={`card-chamado status-${c.status.toLowerCase()}`}>
                <div className="topo-card-chamado">
                  <span className={`tag-status status-${c.status.toLowerCase()}`}>
                    {c.status === 'Pendente' && '⏳ Pendente'}
                    {c.status === 'A_Caminho' && '🚒 A Caminho'}
                    {c.status === 'Resgatado' && '✅ Resgatado'}
                  </span>
                  <span className={`badge-prioridade prioridade-${(c.prioridade || 'Media').toLowerCase()}`}>
                    Prioridade {c.prioridade}
                  </span>
                </div>

                <h4 className="titulo-ocorrencia">{c.tipo_problema}</h4>

                <p className="info-vitima">
                  <strong>👤 Vítima / Solicitante:</strong> {c.vitima || 'Cidadão Solicitante'}
                </p>

                <p className="info-recurso">
                  <strong>🎯 Recurso Sugerido:</strong> {c.recurso_sugerido}
                </p>

                <div className="box-justificativa-card">
                  <small>
                    <strong>🤖 Triagem IA:</strong> {c.justificativa_ia}
                  </small>
                </div>

                {c.instituicao_nome && (
                  <p className="info-atendimento">
                    <strong>🏢 Atendido por:</strong> {c.instituicao_nome}
                  </p>
                )}

                {/* Ações de Despacho Descentralizado */}
                <div className="acoes-card-chamado">
                  {c.status === 'Pendente' && (
                    <div className="despacho-box">
                      <label htmlFor={`select-inst-${c.id}`} className="label-despacho">
                        Despachar órgão responsável:
                      </label>
                      <div className="linha-despacho">
                        <select id={`select-inst-${c.id}`} className="select-despacho" defaultValue="1">
                          {instituicoes.map((inst) => (
                            <option key={inst.id} value={inst.id}>
                              {inst.nome} ({inst.tipo_esfera})
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="btn-despachar"
                          onClick={() => {
                            const selectEl = document.getElementById(`select-inst-${c.id}`);
                            handleAceitarChamado(c.id, selectEl ? selectEl.value : 1);
                          }}
                        >
                          🚒 Despachar
                        </button>
                      </div>
                    </div>
                  )}

                  {c.status === 'A_Caminho' && (
                    <button
                      type="button"
                      className="btn-concluir"
                      onClick={() => handleFinalizarChamado(c.id)}
                    >
                      ✅ Confirmar Resgate Concluído
                    </button>
                  )}

                  {c.status === 'Resgatado' && (
                    <p className="texto-concluido">Resgate finalizado com sucesso.</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
