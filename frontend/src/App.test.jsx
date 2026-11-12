import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect } from 'vitest';
import { AlertaChuva } from './AlertaChuva.jsx';

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
