import React, { useState, useEffect } from 'react';

export function InstituicoesFrota() {
  const [instituicoes, setInstituicoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch('/api/instituicoes')
      .then((res) => (res.ok ? res.json() : []))
      .then((dados) => {
        if (dados && dados.length > 0) {
          setInstituicoes(dados);
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
    setInstituicoes([
      {
        id: 1,
        nome: 'Corpo de Bombeiros Militar PE',
        tipo_esfera: 'Estadual',
        lat: -8.0522,
        lng: -34.8811,
        recursos: [
          { id: 1, tipo: 'Barco Salva-Vidas', disponivel: true },
          { id: 2, tipo: 'Helicóptero Resgate', disponivel: true }
        ]
      },
      {
        id: 2,
        nome: 'Defesa Civil do Recife',
        tipo_esfera: 'Municipal',
        lat: -8.0631,
        lng: -34.8711,
        recursos: [
          { id: 3, tipo: 'Jipe 4x4 Geotécnico', disponivel: false }
        ]
      },
      {
        id: 3,
        nome: 'ONG Resgate Comunitário Ibura',
        tipo_esfera: 'ONG Certificada',
        lat: -8.1201,
        lng: -34.9480,
        recursos: [
          { id: 4, tipo: 'Ambulância / Van Adaptada', disponivel: true }
        ]
      },
      {
        id: 4,
        nome: 'Neoenergia Pernambuco (Emergência)',
        tipo_esfera: 'Concessionária',
        lat: -8.055,
        lng: -34.89,
        recursos: [
          { id: 5, tipo: 'Caminhão Rede Elétrica', disponivel: true }
        ]
      }
    ]);
  }

  const totalRecursos = instituicoes.reduce((acc, inst) => acc + (inst.recursos?.length || 0), 0);
  const recursosDisponiveis = instituicoes.reduce(
    (acc, inst) => acc + (inst.recursos?.filter((r) => r.disponivel).length || 0),
    0
  );

  return (
    <section className="secao-instituicoes" aria-labelledby="titulo-instituicoes">
      <header className="cabecalho-secao">
        <h2 id="titulo-instituicoes">🏢 Rede de Instituições & Frota de Resgate</h2>
        <p className="subtitulo-secao">
          Mapeamento das forças públicas, comunitárias e concessionárias da RMR com disponibilidade de veículos e equipamentos especializados.
        </p>

        {/* Painel de Métricas Rápidas */}
        <div className="painel-metricas-frota">
          <div className="card-metrica">
            <span className="numero-metrica">{instituicoes.length}</span>
            <span className="legenda-metrica">Instituições Ativas</span>
          </div>
          <div className="card-metrica">
            <span className="numero-metrica">{totalRecursos}</span>
            <span className="legenda-metrica">Total de Recursos</span>
          </div>
          <div className="card-metrica destaque-verde">
            <span className="numero-metrica">{recursosDisponiveis}</span>
            <span className="legenda-metrica">Recursos Prontos</span>
          </div>
          <div className="card-metrica destaque-amarelo">
            <span className="numero-metrica">{totalRecursos - recursosDisponiveis}</span>
            <span className="legenda-metrica">Em Deslocamento</span>
          </div>
        </div>
      </header>

      {carregando ? (
        <p className="carregando">Carregando dados da frota...</p>
      ) : (
        <div className="grade-instituicoes">
          {instituicoes.map((inst) => (
            <article key={inst.id} className="card-instituicao">
              <div className="topo-card-inst">
                <span className={`badge-esfera esfera-${inst.tipo_esfera.toLowerCase().replace(/\s+/g, '-')}`}>
                  {inst.tipo_esfera}
                </span>
                <span className="coords-inst">
                  📍 {inst.lat?.toFixed(4)}, {inst.lng?.toFixed(4)}
                </span>
              </div>

              <h3 className="nome-instituicao">{inst.nome}</h3>

              <div className="bloco-frota">
                <h4>Frota & Recursos Especializados ({inst.recursos?.length || 0}):</h4>
                {inst.recursos && inst.recursos.length > 0 ? (
                  <ul className="lista-recursos">
                    {inst.recursos.map((rec) => (
                      <li key={rec.id} className={`item-recurso ${rec.disponivel ? 'disponivel' : 'ocupado'}`}>
                        <span className="icone-recurso">
                          {rec.tipo.toLowerCase().includes('barco') && '🚤'}
                          {rec.tipo.toLowerCase().includes('helicóptero') && '🚁'}
                          {rec.tipo.toLowerCase().includes('jipe') && '🚙'}
                          {rec.tipo.toLowerCase().includes('ambulância') && '🚑'}
                          {rec.tipo.toLowerCase().includes('caminhão') && '🚛'}
                          {!/barco|helicóptero|jipe|ambulância|caminhão/i.test(rec.tipo) && '🛠️'}
                        </span>
                        <span className="nome-recurso">{rec.tipo}</span>
                        <span className={`status-badge-recurso ${rec.disponivel ? 'tag-disponivel' : 'tag-ocupado'}`}>
                          {rec.disponivel ? '🟢 Disponível' : '🟡 Em Missão'}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="sem-recursos">Nenhum recurso cadastrado no momento.</p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
