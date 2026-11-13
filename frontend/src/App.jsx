import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import PainelCidadao from './components/PainelCidadao';
import PainelInstitucional from './components/PainelInstitucional';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function App() {
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
  );
}