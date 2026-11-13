# 🏆 Alerta RMR · Antena na Lama — Plataforma de Resgate Descentralizado & Triagem com IA

> **Desafio:** Antena na Lama (Hackathon APONTI Academy · Devs Criam com IA)  
> **Caminho Escolhido:** Alertar e proteger (durante a crise) + Mobilizar e recuperar (despacho descentralizado de socorro)  
> **Acessibilidade:** 100/100 no Google Lighthouse · WCAG AA (Contraste ≥ 4.5:1, Labels, Teclado e Alvos de Toque ≥ 48px)  
> **Conexão Fraca / Offline:** Arquitetura resiliente com contingência local para conexões 3G lentas ou queda de sinal durante temporais.

---

## 📌 Sumário Executivo do Projeto

Na Região Metropolitana do Recife (RMR), temporais extremos causam deslizamentos críticos em áreas de morro (como Ibura e Jardim Monte Verde) e inundações severas em áreas de bacia hidrográfica e maré alta (como Ilha Joana Bezerra e Coque). Em paralelo, ondas de calor extremo agravam o estresse térmico de idosos e pessoas com comorbidades.

O **Alerta RMR · Antena na Lama** é uma solução completa (Frontend React acessível + Backend REST modular com PostgreSQL/In-Memory + Triagem Inteligente com IA) que resolve três gargalos cruciais:
1. **Linguagem Simples & Acessibilidade Extrema:** Converte boletins meteorológicos técnicos e indecifráveis em instruções diretas e acionáveis para moradores no celular, com contraste reforçado e atalhos de discagem rápida (`tel:199` e `tel:193`).
2. **Triagem Automática por IA & Fila Vermelha:** Avalia instantaneamente a gravidade do sinistro combinada ao perfil de vulnerabilidade do cidadão (idosos, gestantes, cadeirantes, acamados), atribuindo a prioridade e indicando o recurso exato de salvamento.
3. **Despacho Descentralizado de Recursos e Frotas:** Articula a Defesa Civil, Corpo de Bombeiros, ONGs Comunitárias Certificadas e a concessionária de energia elétrica para atendimento ágil e rastreável.

---

## 🗄️ Esquema do Banco de Dados (PostgreSQL & Modelo Relacional)

O banco de dados foi modelado para refletir com fidelidade a realidade operacional de socorro na RMR:

```mermaid
erDiagram
    USUARIOS ||--o{ CHAMADOS : "solicita / vitima"
    INSTITUICOES ||--o{ VEICULOS_RECURSOS : "possui frota"
    INSTITUICOES ||--o{ CHAMADOS : "atende / despacha"

    USUARIOS {
        int id PK
        string nome
        int idade
        string condicao_saude
        double lat
        double lng
        boolean aceitou_rede_protecao
    }

    INSTITUICOES {
        int id PK
        string nome
        string tipo_esfera
        double lat
        double lng
    }

    VEICULOS_RECURSOS {
        int id PK
        int河instituicao_id FK
        string tipo
        boolean disponivel
    }

    CHAMADOS {
        int id PK
        int usuario_id FK
        int instituicao_id FK
        string tipo_problema
        double lat
        double lng
        string prioridade
        string recurso_sugerido
        text justificativa_ia
        string status
        timestamp criado_em
    }
```

### Detalhamento das Entidades:
1. **`usuarios`**: Cadastro dos moradores com mapeamento de condições especiais (hipertensão, gestação, mobilidade reduzida, cadeirantes) e consentimento de monitoramento preventivo.
2. **`instituicoes`**: Órgãos e entidades de pronta resposta atuantes na RMR (Corpo de Bombeiros Militar de Pernambuco, Defesa Civil do Recife, ONGs Comunitárias e Neoenergia).
3. **`veiculos_recursos`**: Frota especializada disponível em tempo real (Barcos Salva-Vidas, Helicópteros, Jipes 4x4 Geotécnicos, Ambulâncias/Vans Adaptadas e Caminhões de Alta Tensão).
4. **`chamados`**: Ocorrências geolocalizadas geradas pela população, enriquecidas pelo motor de triagem de IA com classificação de prioridade, justificativa técnica e ciclo de vida (`Pendente` → `A_Caminho` → `Resgatado`).

---

## 💻 Frontend em React (Mobile-First & Acessibilidade 100)

Localizado na pasta `/frontend`, o app foi desenvolvido em **React 18** com **Vite**, sem bibliotecas pesadas de terceiros para garantir carregamento ultra-rápido mesmo em redes móveis instáveis.

### 🌟 Módulos da Aplicação:
1. **📢 Alerta Comunitário & Discagem Rápida:**
   - Avisos meteorológicos em linguagem simples ("Chuva muito forte! Saia de perto da barreira e procure a Escola Municipal").
   - Botões de discagem direta nativa (`tel:199` e `tel:193`) que funcionam mesmo sem pacote de dados móveis ativo.
   - Cadastro preventivo de avisos no celular por bairro ou CEP.
2. **🆘 Central de Resgate & Triagem IA em Tempo Real:**
   - Formulário para abertura de chamados com seletor de vítimas prioritárias e tipo de risco.
   - **Preview Instantâneo da IA:** Exibe imediatamente o nível de urgência, recurso sugerido e a justificativa transparente antes mesmo do envio.
   - Painel de ocorrências ativas com filtros por status (`Pendente`, `A Caminho`, `Resgatado`).
   - Botão de despacho institucional para que os socorristas assumam os chamados com 1 clique.
3. **🚒 Rede de Instituições & Frota de Recursos:**
   - Visualização da capacidade operacional de cada entidade (Estadual, Municipal, ONG Certificada e Concessionária).
   - Indicadores visuais de frota pronta (`🟢 Disponível`) versus frota em deslocamento (`🟡 Em Missão`).
4. **🛡️ Rede de Proteção a Cidadãos Vulneráveis:**
   - Mapeamento e cadastro de pessoas da comunidade que demandam atenção redobrada durante tempestades.
   - **Protocolo de Onda de Calor e Estresse Térmico:** Aciona verificação automática da temperatura na RMR e gera escalas domiciliares de hidratação preventiva para idosos.
5. **🌤️ Telemetria Climática & Marés da RMR:**
   - Monitoramento contínuo de temperatura, umidade e da preamar de sizígia (maré alta de 2.3m), essencial para previsão de alagamentos na bacia do Capibaribe.
6. **🤖 Comparativo Antes x Depois da IA (Auditoria Educacional):**
   - Na barra superior, o usuário pode alternar entre:
     - `?modo=ruim`: Exemplo de código gerado por prompt vago de IA (baixo contraste, sem `<label>`, sem `alt`, div clicável).
     - `?modo=acessivel`: Código auditado e refinado pela equipe (WCAG AA, nota 100 no Lighthouse).
   - Painel interativo para inspecionar e copiar os prompts utilizados.

---

## 🌐 Rotas e Endpoints da API Backend (Node.js & Express)

A API REST do backend roda na porta `3001` (ou `3000`) e expõe as seguintes rotas:

| Método | Endpoint | Descrição | Status Retornado |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Health Check da API | `200 OK` |
| `GET` | `/api/health` | Health Check alternativo | `200 OK` |
| `GET` | `/api/clima` | Consulta temperatura, maré e condição climática da RMR | `200 OK` |
| `GET` | `/api/clima/calor` | Dispara protocolo de onda de calor e plano de hidratação | `200 OK` |
| `POST` | `/api/triagem` | Triagem automática por IA baseada no relato | `200 OK` |
| `GET` | `/api/resgates` | Lista chamados legados de resgate | `200 OK` |
| `POST` | `/api/resgates` | Cria chamado simples (valida descrição obrigatória) | `201 Created` / `400` |
| `GET` | `/api/chamados` | Lista todas as ocorrências com status e triagem IA | `200 OK` |
| `POST` | `/api/chamados` | Cria chamado com avaliação completa de prioridade e recurso | `201 Created` / `400` |
| `PATCH`| `/api/chamados/:id/aceitar` | Instituição assume chamado e despacha veículo | `200 OK` / `404` |
| `PATCH`| `/api/chamados/:id/finalizar` | Finaliza ocorrência e libera veículo da frota | `200 OK` / `404` |
| `GET` | `/api/instituicoes` | Lista órgãos de socorro com respectiva frota veicular | `200 OK` |
| `GET` | `/api/usuarios` | Lista usuários da rede (`?vulneravel=true` para filtro) | `200 OK` |
| `POST` | `/api/usuarios` | Cadastra morador na rede de proteção prioritária | `201 Created` / `400` |
| `GET` | `/api/alertas` | Boletins em linguagem simples por bairro da RMR | `200 OK` |
| `POST` | `/api/ajuda` | Registra solicitação direta de apoio com protocolo | `201 Created` / `400` |

---

## 🧪 Testes Automatizados (100% de Aprovação)

O projeto conta com suítes de testes automatizados cobrindo tanto o backend quanto o frontend:

```
========================= RESULTADO DOS TESTES =========================
 Backend (Node.js - Jest & Supertest):  13 testes passaram (2 suítes)
 Backend (Python - Pytest):              3 testes passaram
 Frontend (React - Vitest & RTL):        8 testes passaram (1 suíte)
------------------------------------------------------------------------
 Total de Testes Automatizados:         24 testes 100% aprovados ✅
========================================================================
```

1. **Backend Node.js (`backend/tests/`):**
   - `server.test.js`: Health check, criação de resgate, validação de erro 400, consulta de clima e triagem IA.
   - `rotas_completas.test.js`: Listagem de instituições com frota, cadastro e filtro de vulneráveis, ciclo de vida do chamado com IA (`Pendente` → `A_Caminho` → `Resgatado`), protocolo de onda de calor e pedidos de ajuda.
2. **Backend Python (`backend/test_api.py`):**
   - Validação da estrutura dos alertas, cálculo de prioridade pluviométrica (limiar de 80mm) e presença de linguagem simples.
3. **Frontend React (`frontend/src/App.test.jsx`):**
   - Smoke tests, formulários com labels acessíveis, imagens com atributos `alt`, alternância de abas de navegação, preview reativo da triagem IA, protocolo de calor e renderização de frotas.

---

## 🤖 Uso Ético de IA (Declaração Obrigatória do Edital)

*   **Onde a IA foi utilizada no projeto:**
    - Geração inicial de modelos de dados, rotas de teste e layout inicial de componentes meteorológicos.
    - Motor de triagem (`triagemIAService.js`), classificando incidentes por gravidade e vulnerabilidade do cidadão com fallback determinístico de contingência.
*   **O que foi auditado e corrigido pela equipe humana:**
    1. **Eliminação de Jargões ("Tecniquês"):** A IA gerou alertas herméticos (*"Anomalia pluviométrica > 85mm com saturação pedológica"*). Reescrevemos para instruções práticas de salvamento (*"Chuva muito forte! Vá para a Escola Municipal Poeta Jonatas Braga no Ibura ou ligue 199"*).
    2. **Contraste e Legibilidade (WCAG AA):** Substituímos paletas com baixo contraste geradas pela IA (`#94a3b8` sobre branco) por contrastes superiores a `4.5:1` (`#0f172a` sobre branco) e botões visíveis sob sol forte ou tela molhada.
    3. **Acessibilidade para Tecnologias Assistivas:** Substituímos tags `div` com `onClick` por elementos semânticos (`<button type="submit">`, `<nav>`, `<article>`, `<main>`), adicionamos `<label htmlFor="...">` obrigatórios em todos os inputs e indicadores visuais claros de teclado (`:focus-visible`).
    4. **Prevenção de Alucinações:** O motor de triagem por IA conta com matriz de contingência determinística baseada em regras geológicas e hidrológicas da Defesa Civil do Recife, garantindo que mesmo sem internet ou crédito em API externa, o socorro correto seja recomendado.

---

## 🛠️ Como Rodar o Projeto Localmente

### Pré-requisitos
- Node.js 18+ (testado e compatível até Node 24)
- Python 3.10+ (opcional para os testes em Python)
- Git

### 1. Clonar e Acessar o Repositório
```bash
git clone https://github.com/apontiacademy/HACKATHON-PE-RECPLAY26.git
cd HACKATHON-PE-RECPLAY26
```

### 2. Rodar o Backend (API REST)
```bash
cd backend
npm install
npm run dev # ou: node server.js
# Servidor disponível em http://localhost:3001
```

### 3. Rodar o Frontend (React + Vite)
Em um novo terminal:
```bash
cd frontend
npm install
npm run dev
# Aplicação disponível em http://localhost:5173
```

### 4. Executar os Testes Automatizados
```bash
# Testes do Backend (Node.js)
cd backend
npm test

# Testes do Backend (Python)
cd backend
pytest -v

# Testes do Frontend (Vitest)
cd frontend
npm test

# Build de Produção do Frontend
cd frontend
npm run build
```

---

## 👥 Equipe
*   **Desenvolvedores:** Equipe de Inovação e Resiliência Urbana da RMR
*   **Validação Comunitária:** Jovem Validador(a) (Movimento Pró-Criança)
*   **Hackathon:** APONTI Academy · Devs Criam com IA (Recife/PE)
