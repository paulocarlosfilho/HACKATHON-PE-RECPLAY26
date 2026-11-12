# Exemplo de Teste Automatizado (Smoke Test & Acessibilidade)

> **Regra 7 do Desafio:** *"Software funcionando: deploy público, pelo menos 3 testes automatizados no CI e README."*

Um **Smoke Test** (teste de fumaça) garante que a tela principal da sua solução abre sem quebrar e exibe as informações essenciais para o morador da RMR.

Usando **Testing Library** (`@testing-library/react`), você testa a tela **do mesmo jeito que o usuário e os leitores de tela enxergam**: procurando por títulos (`getByRole('heading')`), labels de formulário (`getByLabelText`) e botões (`getByRole('button')`). Se o teste passar por `getByLabelText`, você já provou que a acessibilidade do seu `<label>` está funcionando!

---

## 1. Exemplo Prático (`frontend/src/App.test.jsx`)

```jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect } from 'vitest'; // ou @jest/globals
import App from './App.jsx';

describe('Testes da Tela Principal - Antena na Lama', () => {
  // TESTE 1: Smoke Test (A tela principal renderiza sem quebrar?)
  test('1. Renderiza o título principal e o alerta em linguagem simples', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /Alerta RMR · Antena na Lama/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Chuva muito forte nas últimas horas/i)
    ).toBeInTheDocument();
  });

  // TESTE 2: Acessibilidade dos Campos (Todos os inputs têm <label>?)
  test('2. Campos do formulário possuem labels associadas corretamente', () => {
    render(<App />);

    // Se o <input> não tiver id conectado ao htmlFor do <label>, este teste falha!
    const inputMorador = screen.getByLabelText(/Seu nome ou como é conhecido na rua/i);
    expect(inputMorador).toBeInTheDocument();
  });

  // TESTE 3: Interação do Fluxo Principal
  test('3. Permite preencher o nome e enviar um alerta comunitário', async () => {
    const user = userEvent.setup();
    render(<App />);

    const inputMorador = screen.getByLabelText(/Seu nome ou como é conhecido na rua/i);
    await user.type(inputMorador, 'Dona Maria');

    const botaoEnviar = screen.getByRole('button', { name: /Enviar Alerta da Minha Rua/i });
    await user.click(botaoEnviar);

    // Verifica se o aviso de confirmação (role="status") apareceu
    const confirmacao = await screen.findByRole('status');
    expect(confirmacao).toHaveTextContent(/Protocolo:/i);
  });
});
```

---

## 2. Como Rodar Localmente no Terminal

Dentro da pasta `frontend`:

```bash
cd frontend
npm install
npm test
```

---

## 3. Como Garantir que Roda no GitHub Actions (CI Verde ✓)

No arquivo `.github/workflows/ci.yml` do repositório da sua equipe, confira se o job `build-frontend` executa o comando de teste antes do build:

```yaml
  build-frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: './frontend/package-lock.json'
    - run: npm install
    - run: npm test
    - run: npm run build
```

Assim que você fizer `git push`, abra a aba **Actions** no GitHub da equipe e confirme o selo verde ✓!
