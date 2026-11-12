# 🏆 Alerta RMR · Antena na Lama — Kit Prático (Frontend & Mobile com IA)

> **Desafio:** Antena na Lama (Hackathon APONTI Academy · Devs Criam com IA)  
> **Caminho escolhido:** Alertar e proteger (durante a crise) + Mobilizar e recuperar

---

## 📌 Repositório Template Oficial vs. Este Repositório Base

Este repositório é uma **versão com exemplo prático, testes automatizados e guias de bolso** baseada no template oficial do Hackathon:

* 🔗 **Repositório Template Oficial da APONTI (em branco para iniciar do zero):**  
  👉 **[https://github.com/apontiacademy/HACKATHON-PE-RECPLAY26](https://github.com/apontiacademy/HACKATHON-PE-RECPLAY26)**
* 🛠️ **Este Repositório (`alisonmelo/HACKATHON-PE-RECPLAY26`):**  
  Contém a estrutura oficial + um exemplo completo de **Frontend React Acessível (`AlertaChuva.jsx`)**, comparativo de **Antes x Depois da IA**, **3 Testes Automatizados (Smoke + Acessibilidade)** já configurados no GitHub Actions (CI) e a pasta **`/guias`** com passo a passo de Acessibilidade, Testes, Deploy na Vercel e Telas Leves para 3G.

---

## 📖 Sobre o Projeto de Exemplo
**Alerta RMR · Antena na Lama** é uma aplicação web mobile-first e acessível que traduz boletins meteorológicos técnicos (APAC, CEMADEN e Defesa Civil do Recife) para **linguagem simples e acionável** para moradores das áreas de morro, encostas e alagamentos da Região Metropolitana do Recife (como Ibura, Ilha Joana Bezerra e Jardim Monte Verde).

O projeto demonstra na prática como resolver dois gargalos críticos do desafio:
1. **Linguagem e Acessibilidade:** Transforma alertas técnicos difíceis de ler em avisos claros com alto contraste (WCAG AA), textos alternativos (`alt`), campos com `<label>` e navegação por teclado/toque (`48px`).
2. **Conexão Fraca / Offline:** Tela super leve (`< 50 KB`), sem bibliotecas pesadas e com fallback local caso o sinal 3G caia durante a chuva.

---

## 📚 Guias de Bolso para as Equipes (Pasta `/guias`)
Consulte os guias rápidos criados especialmente para ajudar sua equipe a garantir os pontos de **Qualidade Técnica**, **Acessibilidade**, **Testes** e **Deploy**:

1. ♿ **[01 - Checklist de Acessibilidade Básica (5 Pontos + Lighthouse)](./guias/01-checklist-acessibilidade.md)**
2. 🧪 **[02 - Exemplo de Teste Automatizado (Vitest / Jest + Testing Library)](./guias/02-exemplo-teste-jest-testing-library.md)**
3. 🚀 **[03 - Guia Passo a Passo de Deploy na Vercel](./guias/03-guia-deploy-vercel.md)**
4. 📱 **[04 - Dicas para Telas Leves no Celular e com Internet Fraca (3G)](./guias/04-dicas-telas-leves-celular-internet-fraca.md)**

---

## 👥 Equipe (Modelo para preencher no README da sua equipe)
*   **Desenvolvedores:**
    *   [Nome 1] - Front-end & Acessibilidade
    *   [Nome 2] - Back-end & Integração de Dados
    *   [Nome 3] - Dados / DevOps & CI/CD
    *   [Nome 4] - Mobile / UX & Testes Automatizados
*   **Validador(a) (Movimento Pró-Criança):**
    *   [Nome do(a) Jovem Validador(a)]

---

## 🚀 Tecnologias Utilizadas
*   **Front-end:** React 18, Vite, CSS Mobile-First Acessível (Nota 100 em Acessibilidade no Lighthouse)
*   **Back-end:** Node.js (API REST `/api/alertas` e `/api/ajuda`) + exemplo em Python
*   **Dados Abertos / Referência:** APAC, CEMADEN e Dados Abertos da Prefeitura do Recife (Pontos de apoio e alertas por bairro)
*   **Deploy:** Vercel (Front-end) / Render (Back-end)
*   **Testes Automatizados:** Vitest + React Testing Library (Front-end) e Node Test Runner (Back-end)

---

## 🤖 Uso Ético de IA (Modelo exigido pelo Edital)
*Exemplo de preenchimento obrigatório demonstrando onde a IA foi usada e o que a equipe humana auditou e corrigiu:*

*   **Onde a IA foi usada:** Geração inicial do componente de alerta meteorológico e formulário de cadastro por bairro/CEP.
*   **O que foi corrigido/validado pela equipe humana:**
    1. **Linguagem Simples:** A IA gerou jargões técnicos (*"Precipitação pluviométrica > 85mm com saturação pedológica"*). Reescrevemos para linguagem direta (*"Chuva muito forte! Procure a Escola Municipal Poeta Jonatas Braga ou ligue 199"*).
    2. **Contraste e Visibilidade no Celular:** A IA usou texto cinza claro (`#94a3b8`) sobre fundo branco e botão amarelo com letra branca (reprovado no Lighthouse). Ajustamos todas as cores para contraste superior a `4.5:1` (WCAG AA) e adicionamos ícones junto às cores.
    3. **Acessibilidade de Formulário e Teclado:** A IA criou inputs apenas com `placeholder` (sem `<label>`) e usou `<div onClick>` no lugar de botão. Substituímos por `<label htmlFor="campo-bairro">`, `<button type="submit">` nativo com área de toque mínima de `48px` e indicador `:focus-visible` para teclado.
    4. **Texto Alternativo (`alt`):** Adicionamos descrições `alt` nas imagens de risco.
*   **Ferramentas usadas:** ChatGPT / Gemini / GitHub Copilot + Auditoria com Google Lighthouse e React Testing Library.

---

## 🛠️ Como rodar o projeto localmente

### Pré-requisitos
*   Node.js 18+

### 1. Rodar o Front-end (React + Vite)
```bash
cd frontend
npm install
npm run dev
# Abra no navegador: http://localhost:5173
```
> 💡 **Dica:** Na barra superior do projeto você pode alternar entre **`?modo=ruim`** (código gerado por prompt vago de IA, nota 72 no Lighthouse) e **`?modo=acessivel`** (código revisado e acessível, nota **100** no Lighthouse).

### 2. Rodar os Testes Automatizados (Front-end)
```bash
cd frontend
npm test
```

### 3. Rodar o Back-end (Opcional)
```bash
cd backend
npm install
npm run dev
# API disponível em http://localhost:3001/api/alertas
```

---

## 🌐 Deploy Público (Para preencher na entrega)
*   **Link do Front-end (Vercel):** [Cole aqui o link da Vercel após o deploy]
*   **Link da API Back-end (Render):** [Cole aqui o link do Render após o deploy]
