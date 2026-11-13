import React, { useState, useEffect } from 'react';

export function RedeVulneraveis() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [apenasVulneraveis, setApenasVulneraveis] = useState(false);

  // Formulário para cadastrar novo morador na rede
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [condicaoSaude, setCondicaoSaude] = useState('');
  const [comunidade, setComunidade] = useState('Ibura');
  const [sucessoMsg, setSucessoMsg] = useState('');
  const [cadastrando, setCadastrando] = useState(false);

  // Estado do plano preventivo de onda de calor
  const [planoCalor, setPlanoCalor] = useState(null);
  const [verificandoCalor, setVerificandoCalor] = useState(false);

  useEffect(() => {
    carregarUsuarios();
  }, [apenasVulneraveis]);

  async function carregarUsuarios() {
    setCarregando(true);
    try {
      const url = apenasVulneraveis ? '/api/usuarios?vulneravel=true' : '/api/usuarios';
      const res = await fetch(url);
      if (res.ok) {
        const dados = await res.json();
        setUsuarios(dados);
      } else {
        throw new Error();
      }
    } catch (_) {
      // Fallback local
      const fallback = [
        { id: 1, nome: 'Dona Maria Clarice', idade: 78, condicao_saude: 'Mobilidade reduzida / Hipertensa', lat: -8.1189, lng: -34.9458, aceitou_rede_protecao: true },
        { id: 2, nome: 'Seu Severino', idade: 82, condicao_saude: 'Cadeirante', lat: -8.0476, lng: -34.8770, aceitou_rede_protecao: true },
        { id: 3, nome: 'Ana Paula', idade: 29, condicao_saude: 'Gestante (8 meses)', lat: -8.0089, lng: -34.8553, aceitou_rede_protecao: true },
        { id: 4, nome: 'Carlos Eduardo', idade: 34, condicao_saude: 'Sem comorbidades', lat: -8.1128, lng: -35.0147, aceitou_rede_protecao: false }
      ];
      setUsuarios(
        apenasVulneraveis
          ? fallback.filter((u) => u.aceitou_rede_protecao && (u.idade >= 60 || u.condicao_saude !== 'Sem comorbidades'))
          : fallback
      );
    } finally {
      setCarregando(false);
    }
  }

  async function handleCadastrar(e) {
    e.preventDefault();
    setSucessoMsg('');
    setCadastrando(true);

    try {
      const payload = {
        nome,
        idade: Number(idade),
        condicao_saude: condicaoSaude,
        lat: -8.05 + (Math.random() - 0.5) * 0.1,
        lng: -34.88 + (Math.random() - 0.5) * 0.1,
        aceitou_rede_protecao: true
      };

      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const novo = await res.json();
        setUsuarios((ant) => [novo, ...ant]);
        setSucessoMsg(`✅ ${nome} cadastrado(a) com sucesso na Rede de Proteção!`);
      } else {
        throw new Error();
      }
    } catch (_) {
      const novoLocal = {
        id: usuarios.length + 1,
        nome,
        idade: Number(idade),
        condicao_saude: condicaoSaude,
        lat: -8.1189,
        lng: -34.9458,
        aceitou_rede_protecao: true
      };
      setUsuarios((ant) => [novoLocal, ...ant]);
      setSucessoMsg(`✅ [Modo Contingência] ${nome} registrado(a) localmente.`);
    } finally {
      setNome('');
      setIdade('');
      setCondicaoSaude('');
      setCadastrando(false);
    }
  }

  async function verificarOndaDeCalor() {
    setVerificandoCalor(true);
    try {
      const res = await fetch('/api/clima/calor?temp=33.8');
      if (res.ok) {
        const dados = await res.json();
        setPlanoCalor(dados);
      } else {
        throw new Error();
      }
    } catch (_) {
      // Fallback
      setPlanoCalor({
        regiao: 'Região Metropolitana do Recife (RMR)',
        temperaturaCelsius: 33.8,
        alertaOndaCalor: true,
        totalPessoasMonitoradas: usuarios.filter((u) => u.idade >= 60 || u.condicao_saude !== 'Sem comorbidades').length,
        planoAssistencia: [
          {
            nome: 'Dona Maria Clarice',
            idade: 78,
            acaoRecomendada: 'Visita domiciliar de hidratação e verificação de pressão arterial',
            statusAssistencia: 'Pendente_Visita'
          },
          {
            nome: 'Seu Severino',
            idade: 82,
            acaoRecomendada: 'Transporte adaptado para ponto de apoio climatizado',
            statusAssistencia: 'Pendente_Visita'
          }
        ]
      });
    } finally {
      setVerificandoCalor(false);
    }
  }

  return (
    <section className="secao-vulneraveis" aria-labelledby="titulo-vulneraveis">
      <header className="cabecalho-secao">
        <h2 id="titulo-vulneraveis">🛡️ Rede de Proteção a Cidadãos Vulneráveis</h2>
        <p className="subtitulo-secao">
          Mapeamento preventivo de idosos, gestantes, cadeirantes e pessoas acamadas da RMR para proteção prioritária em emergências climáticas.
        </p>
      </header>

      {/* Disparo de Protocolo de Onda de Calor */}
      <div className="card-protocolo-calor" role="region" aria-label="Protocolo Preventivo de Onda de Calor">
        <div className="topo-protocolo">
          <div>
            <h3>☀️ Protocolo Preventivo de Onda de Calor & Estresse Térmico</h3>
            <p>
              Em dias com temperatura superior a 33°C, a Defesa Civil e Agentes Comunitários de Saúde realizam visitas domiciliares aos vulneráveis.
            </p>
          </div>
          <button
            type="button"
            className="btn-verificar-calor"
            disabled={verificandoCalor}
            onClick={verificarOndaDeCalor}
          >
            {verificandoCalor ? 'Verificando...' : '🌡️ Verificar Alerta de Calor'}
          </button>
        </div>

        {planoCalor && (
          <div className="resultado-plano-calor">
            <p className="tag-calor-ativa">
              🚨 <strong>Alerta Térmico Ativo:</strong> {planoCalor.temperaturaCelsius}°C na RMR | {planoCalor.totalPessoasMonitoradas} pessoas vulneráveis na escala prioritária.
            </p>
            <div className="lista-plano-calor">
              {planoCalor.planoAssistencia?.map((item, idx) => (
                <div key={idx} className="item-plano-calor">
                  <strong>👤 {item.nome}</strong> ({item.idade} anos): {item.acaoRecomendada}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grade-conteudo-vulneraveis">
        {/* Formulário de Cadastro */}
        <div className="card-form-vulneravel">
          <h3>➕ Cadastrar Cidadão na Rede de Proteção</h3>
          <p className="dica-formulario">
            Cadastre idosos ou pessoas com mobilidade reduzida da sua comunidade para que recebam socorro prioritário.
          </p>

          <form onSubmit={handleCadastrar} className="form-vulneravel">
            <div className="grupo-campo">
              <label htmlFor="campo-nome-cad" className="label-forte">
                Nome completo ou apelido: *
              </label>
              <input
                id="campo-nome-cad"
                type="text"
                required
                placeholder="Ex: Seu Antônio da Ladeira"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="input-acessivel"
              />
            </div>

            <div className="grade-dupla">
              <div className="grupo-campo">
                <label htmlFor="campo-idade-cad" className="label-forte">
                  Idade: *
                </label>
                <input
                  id="campo-idade-cad"
                  type="number"
                  required
                  min="0"
                  max="120"
                  placeholder="Ex: 80"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  className="input-acessivel"
                />
              </div>

              <div className="grupo-campo">
                <label htmlFor="campo-bairro-cad" className="label-forte">
                  Comunidade / Bairro:
                </label>
                <select
                  id="campo-bairro-cad"
                  value={comunidade}
                  onChange={(e) => setComunidade(e.target.value)}
                  className="select-acessivel"
                >
                  <option value="Ibura">Ibura / Lagoa Encantada</option>
                  <option value="Joana Bezerra">Ilha Joana Bezerra / Coque</option>
                  <option value="Monte Verde">Jardim Monte Verde</option>
                  <option value="Casa Amarela">Casa Amarela / Morro</option>
                  <option value="Outro">Outro bairro da RMR</option>
                </select>
              </div>
            </div>

            <div className="grupo-campo">
              <label htmlFor="campo-condicao-cad" className="label-forte">
                Condição de saúde / Necessidade especial: *
              </label>
              <input
                id="campo-condicao-cad"
                type="text"
                required
                placeholder="Ex: Cadeirante, Gestante, Acamado, Hipertenso..."
                value={condicaoSaude}
                onChange={(e) => setCondicaoSaude(e.target.value)}
                className="input-acessivel"
              />
            </div>

            <button
              type="submit"
              disabled={cadastrando}
              className="botao-acessivel"
            >
              {cadastrando ? 'Salvando...' : '🛡️ Cadastrar na Rede de Proteção'}
            </button>
          </form>

          {sucessoMsg && (
            <p role="status" className="msg-sucesso">
              {sucessoMsg}
            </p>
          )}
        </div>

        {/* Lista de Cidadãos Cadastrados */}
        <div className="painel-lista-vulneraveis">
          <div className="topo-lista-vulneraveis">
            <h3>👥 Pessoas Monitoradas ({usuarios.length})</h3>
            <label className="checkbox-acessivel">
              <input
                type="checkbox"
                checked={apenasVulneraveis}
                onChange={(e) => setApenasVulneraveis(e.target.checked)}
              />
              <span>Apenas Alta Vulnerabilidade</span>
            </label>
          </div>

          {carregando ? (
            <p className="carregando">Carregando cidadãos cadastrados...</p>
          ) : usuarios.length === 0 ? (
            <p className="msg-vazia">Nenhum cidadão cadastrado nesta categoria.</p>
          ) : (
            <div className="grade-cards-usuarios">
              {usuarios.map((u) => {
                const ehVulneravel =
                  u.idade >= 60 ||
                  /cadeirante|gestante|mobilidade|acamado|hipertens/i.test(u.condicao_saude);

                return (
                  <article key={u.id} className={`card-usuario ${ehVulneravel ? 'vulneravel-destaque' : ''}`}>
                    <div className="topo-card-user">
                      <span className="icone-avatar">
                        {u.idade >= 60 ? '👵' : /gestante/i.test(u.condicao_saude) ? '🤰' : '👤'}
                      </span>
                      <span className={`tag-prioridade ${ehVulneravel ? 'tag-alta' : 'tag-geral'}`}>
                        {ehVulneravel ? '🚨 Fila Prioritária' : 'Monitoramento Regular'}
                      </span>
                    </div>

                    <h4 className="nome-usuario">{u.nome}</h4>
                    <p className="detalhes-usuario">
                      <strong>Idade:</strong> {u.idade} anos
                    </p>
                    <p className="detalhes-usuario">
                      <strong>Condição:</strong> {u.condicao_saude}
                    </p>
                    <p className="status-protecao">
                      {u.aceitou_rede_protecao ? '✅ Rede de Proteção Ativa' : '⚠️ Consentimento Pendente'}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
