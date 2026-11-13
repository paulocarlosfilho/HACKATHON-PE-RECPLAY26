import '@testing-library/jest-dom';
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock do fetch antes de montar o App (evita erro de URL relativa /alerta.json no Node)
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        chamados: [],
        calor: {
          temperaturaCelsius: 34.8,
          alertaOndaCalor: true,
          totalPessoasMonitoradas: 0,
          planoAssistencia: []
        }
      })
  })
);

import App from '../App';

describe('Testes da Plataforma de Resgate Descentralizado (Frontend)', () => {
  test('Renderiza o cabeçalho e as abas Visão Cidadão e Visão Instituições', () => {
    render(<App />);
    expect(screen.getByText(/Antena na Lama • Resgate RMR/i)).toBeInTheDocument();
    expect(screen.getByText(/Visão Cidadão/i)).toBeInTheDocument();
    expect(screen.getByText(/Visão Instituições/i)).toBeInTheDocument();
  });
});