import React, { useState } from 'react';

const BOTOES_EMERGENCIA = [
  { tipo: 'Alagamento', icone: '🌊', cor: '#0284c7' },
  { tipo: 'Deslizamento de Barreira', icone: '⛰️', cor: '#dc2626' },
  { tipo: 'Fio Elétrico Caído', icone: '⚡', cor: '#d97706' },
  { tipo: 'Calor Extenso / Desidratação', icone: '☀️', cor: '#ea580c' }
];

export default function PainelCidadao({ apiUrl, chamadoAtivo, onNovoChamado }) {
  const [usuarioId, setUsuarioId] = useState(1);
  const [enviando, setEnviando] = useState(false);

  async function acionarSocorro(tipoProblema) {
    setEnviando(true);
    try {
      const resp = await fetch(`${apiUrl}/api/chamados`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: Number(usuarioId),
          tipo_problema: tipoProblema,
          lat: -8.1189,
          lng: -34.9458
        })
      });
      if (!resp.ok) throw new Error('Falha ao enviar');
      const data = await resp.json();
      onNovoChamado(data);
    } catch (_) {
      // Fallback visual imediato para demonstração offline
      onNovoChamado({
        id: Date.now(),
        vitima: { nome: 'Dona Maria Clarice', idade: 78, condicao_saude: 'Mobilidade reduzida' },
        tipo_problema: tipoProblema,
        prioridade: 'Alta',
        recurso_sugerido: 'Jipe 4x4 / Barco Salva-Vidas',
        justificativa_ia: 'Triagem local de contingência acionada.',
        status: 'Pendente'
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="painel-card">
      <h2>🚨 Acionar Socorro (Zero Digitação)</h2>
      <p className="subtexto">GPS ativo • Perfil pré-cadastrado vinculado</p>

      <div className="campo-perfil">
        <label htmlFor="perfil-cidadao">Simular Perfil Cidadão:</label>
        <select id="perfil-cidadao" value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)}>
          <option value={1}>Dona Maria Clarice (78 anos • Mobilidade reduzida)</option>
          <option value={2}>Seu Severino (82 anos • Cadeirante)</option>
          <option value={3}>Ana Paula (29 anos • Gestante)</option>
          <option value={4}>Carlos Eduardo (34 anos • Sem comorbidades)</option>
        </select>
      </div>

      <div className="grid-botoes">
        {BOTOES_EMERGENCIA.map((btn) => (
          <button
            key={btn.tipo}
            className="btn-sos"
            style={{ backgroundColor: btn.cor }}
            disabled={enviando}
            onClick={() => acionarSocorro(btn.tipo)}
          >
            <span className="icone-sos" aria-hidden="true">{btn.icone}</span>
            <span>{btn.tipo}</span>
          </button>
        ))}
      </div>

      {chamadoAtivo && (
        <div className={`status-box status-${chamadoAtivo.status.toLowerCase()}`} role="status">
          <strong>Status do Chamado #{chamadoAtivo.id}: {chamadoAtivo.status.replace('_', ' ')}</strong>
          <p>Prioridade IA: <b>{chamadoAtivo.prioridade}</b> | Recurso: <b>{chamadoAtivo.recurso_sugerido}</b></p>
          <p className="justificativa">{chamadoAtivo.justificativa_ia}</p>
          {chamadoAtivo.instituicao_nome && (
            <p className="equipe-caminho">✅ Equipe despachada: <b>{chamadoAtivo.instituicao_nome}</b></p>
          )}
        </div>
      )}
    </section>
  );
}