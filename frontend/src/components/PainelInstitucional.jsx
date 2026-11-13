import React, { useState } from 'react';

export default function PainelInstitucional({ apiUrl, chamados, calor, onAceitarChamado }) {
  const [instituicaoId, setInstituicaoId] = useState(1);

  async function despacharFrota(chamadoId) {
    try {
      const resp = await fetch(`${apiUrl}/api/chamados/${chamadoId}/aceitar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instituicao_id: Number(instituicaoId) })
      });
      if (resp.ok) {
        const atualizado = await resp.json();
        onAceitarChamado(atualizado);
        return;
      }
    } catch (_) {}

    // Fallback offline
    onAceitarChamado({
      id: chamadoId,
      status: 'A_Caminho',
      instituicao_nome: 'Corpo de Bombeiros Militar PE'
    });
  }

  return (
    <section className="painel-card">
      <h2>🏛️ Centro de Comando Descentralizado</h2>

      <div className="campo-perfil">
        <label htmlFor="orgao-select">Operando como Instituição:</label>
        <select id="orgao-select" value={instituicaoId} onChange={(e) => setInstituicaoId(e.target.value)}>
          <option value={1}>Corpo de Bombeiros Militar PE (Estadual)</option>
          <option value={2}>Defesa Civil do Recife (Municipal)</option>
          <option value={3}>ONG Resgate Comunitário Ibura (ONG Certificada)</option>
          <option value={4}>Neoenergia Pernambuco (Concessionária)</option>
        </select>
      </div>

      <h3>🚨 Ocorrências em Tempo Real ({chamados.length})</h3>
      {chamados.length === 0 ? (
        <p className="vazio">Nenhum chamado ativo na fila no momento.</p>
      ) : (
        <div className="lista-chamados">
          {chamados.map((c) => (
            <div key={c.id} className={`card-chamado prio-${c.prioridade?.toLowerCase()}`}>
              <div className="chamado-topo">
                <span className="tag-prio">{c.prioridade === 'Alta' ? '🔴 FILA VERMELHA' : `🟡 ${c.prioridade}`}</span>
                <span className="tag-status">{c.status}</span>
              </div>
              <h4>{c.tipo_problema} — {c.vitima?.nome} ({c.vitima?.idade} anos)</h4>
              <p className="saude">Condição: {c.vitima?.condicao_saude}</p>
              <p className="recurso">🚒 Recurso IA: <strong>{c.recurso_sugerido}</strong></p>

              {c.status === 'Pendente' ? (
                <button className="btn-aceitar" onClick={() => despacharFrota(c.id)}>
                  Assumir Ocorrência e Despachar Frota
                </button>
              ) : (
                <p className="assumido-por">Despachado por: <strong>{c.instituicao_nome}</strong></p>
              )}
            </div>
          ))}
        </div>
      )}

      {calor && (
        <div className="box-calor">
          <h3>🌡️ Rede Proativa — Onda de Calor ({calor.temperaturaCelsius}°C)</h3>
          <p>{calor.totalPessoasMonitoradas} pessoas vulneráveis identificadas para visita/hidratação:</p>
          <ul>
            {calor.planoAssistencia?.map((p) => (
              <li key={p.usuario_id}>
                <strong>{p.nome}</strong> ({p.idade}a • {p.condicao_saude}) — <em>{p.acaoRecomendada}</em>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}