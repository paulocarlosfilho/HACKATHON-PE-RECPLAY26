import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import App from './App.jsx';
import { AlertaChuva } from './AlertaChuva.jsx';
import { CentralResgate } from './CentralResgate.jsx';
import { InstituicoesFrota } from './InstituicoesFrota.jsx';
import { RedeVulneraveis } from './RedeVulneraveis.jsx';

describe('Testes Smoke e Acessibilidade - AlertaChuva', () => {
  // TESTE 1: Smoke Test - Confirma que a tela principal renderiza sem quebrar
  test('1. renderiza a tela principal de alerta em linguagem simples', () => {
    render(<AlertaChuva />);
    const titulo = screen.getByText(/Receber Alerta de Chuva/i);
    expect(titulo).toBeInTheDocument();
  });

  // TESTE 2: Confirma que o campo tem <label> conectado e a imagem tem alt
  test('2. possui campo com label acessível e imagem com texto alternativo (alt)', () => {
    render(<AlertaChuva />);
    const input = screen.getByLabelText(/Digite seu bairro ou CEP/i);
    const imagem = screen.getByRole('img', { name: /Nuvem com chuva forte/i });

    expect(input).toBeInTheDocument();
    expect(imagem).toBeInTheDocument();
  });

  // TESTE 3: Confirma que o botão funciona ao cadastrar um bairro
  test('3. permite digitar o bairro e cadastrar o alerta pelo botão', async () => {
    const user = userEvent.setup();
    render(<AlertaChuva />);

    await user.type(screen.getByLabelText(/Digite seu bairro ou CEP/i), 'Ibura');
    await user.click(screen.getByRole('button', { name: /Cadastrar Alerta no Celular/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/Ibura/i);
  });
});

describe('Testes de Integração e Navegação - App Completo', () => {
  beforeEach(() => {
    // Mock global fetch para evitar falhas de rede nos testes de componentes
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/chamados')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: 1,
                vitima: 'Dona Maria Clarice (78 anos)',
                tipo_problema: 'Deslizamento de Barreira',
                prioridade: 'Alta',
                recurso_sugerido: 'Jipe 4x4 Geotécnico',
                justificativa_ia: 'Fila Vermelha: Vítima idosa em encosta.',
                status: 'Pendente'
              }
            ])
        });
      }
      if (url.includes('/api/instituicoes')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: 1,
                nome: 'Corpo de Bombeiros Militar PE',
                tipo_esfera: 'Estadual',
                recursos: [{ id: 1, tipo: 'Barco Salva-Vidas', disponivel: true }]
              }
            ])
        });
      }
      if (url.includes('/api/usuarios')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: 1,
                nome: 'Dona Maria Clarice',
                idade: 78,
                condicao_saude: 'Hipertensa',
                aceitou_rede_protecao: true
              }
            ])
        });
      }
      if (url.includes('/api/clima/calor')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              alertaOndaCalor: true,
              temperaturaCelsius: 34,
              totalPessoasMonitoradas: 1,
              planoAssistencia: [{ nome: 'Dona Maria Clarice', acaoRecomendada: 'Hidratação' }]
            })
        });
      }
      if (url.includes('/api/clima')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              temperatura: 28,
              condicao: 'Chuvoso',
              mare: '2.3m'
            })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({})
      });
    });
  });

  test('4. renderiza o aplicativo completo com barra superior, abas e rodapé', () => {
    render(<App />);
    expect(screen.getByText(/Alerta RMR · Antena na Lama/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Alerta Comunitário/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Central de Resgate & IA/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Frota & Instituições/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Rede de Vulneráveis/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Telemetria & Marés/i })).toBeInTheDocument();
  });

  test('5. alterna entre as abas ao clicar', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Clica na aba Central de Resgate & IA
    await user.click(screen.getByRole('tab', { name: /Central de Resgate & IA/i }));
    expect(screen.getByText(/Central de Resgate & Triagem por IA/i)).toBeInTheDocument();

    // Clica na aba Frota & Instituições
    await user.click(screen.getByRole('tab', { name: /Frota & Instituições/i }));
    expect(screen.getByText(/Rede de Instituições & Frota de Resgate/i)).toBeInTheDocument();

    // Clica na aba Rede de Vulneráveis
    await user.click(screen.getByRole('tab', { name: /Rede de Vulneráveis/i }));
    expect(screen.getByText(/Rede de Proteção a Cidadãos Vulneráveis/i)).toBeInTheDocument();

    // Clica na aba Telemetria & Marés
    await user.click(screen.getByRole('tab', { name: /Telemetria & Marés/i }));
    expect(screen.getByText(/Telemetria Climática & Marés da RMR/i)).toBeInTheDocument();
  });

  test('6. CentralResgate: exibe preview da triagem IA ao selecionar o tipo de problema', async () => {
    const user = userEvent.setup();
    render(<CentralResgate modoOffline={false} />);

    // Seleciona tipo de problema
    const selectProblema = screen.getByLabelText(/Qual é a emergência no local\?/i);
    await user.selectOptions(selectProblema, 'Deslizamento de Barreira / Risco Geotécnico');

    // Verifica que o box da IA apareceu com prioridade Alta e recurso Jipe/Helicóptero
    await waitFor(() => {
      expect(screen.getByText(/Triagem Preliminar da IA/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Jipe 4x4 Geotécnico/i).length).toBeGreaterThan(0);
    });
  });

  test('7. RedeVulneraveis: dispara o protocolo de onda de calor e exibe plano de ação', async () => {
    const user = userEvent.setup();
    render(<RedeVulneraveis />);

    const botaoCalor = screen.getByRole('button', { name: /Verificar Alerta de Calor/i });
    await user.click(botaoCalor);

    await waitFor(() => {
      expect(screen.getByText(/Alerta Térmico Ativo/i)).toBeInTheDocument();
    });
  });

  test('8. InstituicoesFrota: renderiza instituições e métricas de frota', async () => {
    render(<InstituicoesFrota />);

    await waitFor(() => {
      expect(screen.getByText(/Instituições Ativas/i)).toBeInTheDocument();
      expect(screen.getByText(/Corpo de Bombeiros Militar PE/i)).toBeInTheDocument();
    });
  });
});
