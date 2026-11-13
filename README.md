# Antena na Lama — Plataforma de Resgate Descentralizado (RMR)

> **Rede descentralizada de resposta a emergências climáticas com triagem automatizada por IA e despacho simultâneo para múltiplas instituições na Região Metropolitana do Recife (RMR).**

---

## 1. Visão Geral do Problema e da Solução

Em desastres climáticos severos na RMR (alagamentos, deslizamentos de barreiras e ondas de calor extremo), depender de uma única central telefônica (como o 199) cria um gargalo crítico[cite: 4]. As linhas congestionam e os centros de comando enfrentam dificuldades para triar simultaneamente milhares de pedidos[cite: 4].

A **Plataforma de Resgate Descentralizado** resolve esse problema em duas frentes[cite: 4]:

1. **Resposta Reativa (Zero Digitação — 1 Clique):** O cidadão aciona o socorro pelo celular com um toque[cite: 4]. A IA no backend cruza o tipo de ocorrência com o perfil de vulnerabilidade pré-cadastrado (idade e condição de saúde), classifica a severidade e despacha o alerta em tempo real via WebSockets para a **"Fila Vermelha"** de múltiplas instituições (Corpo de Bombeiros, Defesa Civil, ONGs certificadas e concessionárias)[cite: 4, 5].
2. **Rede Proativa (Ondas de Calor Extremo):** O sistema monitora a temperatura da RMR e, ao detectar exposição crítica (>= 33°C), cruza os dados meteorológicos com moradores vulneráveis que aceitaram participar da rede (idosos, cadeirantes, gestantes), organizando visitas domiciliares de hidratação e encaminhamento para pontos de acolhimento[cite: 5, 7].

---

## 2. Arquitetura Modular do Sistema

O projeto adota uma arquitetura desacoplada orientada a eventos em tempo real, com tolerância a falhas e contingência offline:

    [ Dispositivo Cidadão (Mobile Web App) ] <──(WebSockets / REST)──> [ API Central Node.js + Express + Socket.io ]
    [ Painel Institucional (Centro de Comando) ]                                  │
                                                                     ┌────────────┴────────────┐
                                                                     ▼                         ▼
                                                          [ Motor de Triagem IA ]   [ Repositório Híbrido ]
                                                          (LLM + Regras Fallback)   (PostgreSQL + Seed RMR)

### Estrutura de Pastas do Repositório

    HACKATHON-PE-RECPLAY26/
    ├── .github/
    │   └── workflows/          # Esteira CI/CD e DevSecOps
    ├── backend/
    │   ├── src/
    │   │   ├── db/             # Schema PostgreSQL e camada de dados híbrida
    │   │   ├── routes/         # Endpoints REST e eventos Socket.io
    │   │   └── services/       # Triagem por IA e monitoramento de onda de calor
    │   └── tests/              # Testes automatizados da API (Jest + Supertest)
    ├── frontend/
    │   ├── public/             # Contingência estática offline (alerta.json)
    │   └── src/
    │       ├── components/     # Visão Cidadão (SOS) e Visão Instituições
    │       └── tests/          # Testes automatizados de interface (Vitest)
    └── README.md               # Documentação técnica, validação e auditoria de IA

---

## 3. Modelagem de Dados (PostgreSQL)

O banco relacional (`backend/src/db/schema.sql`) garante a integridade entre vítimas, órgãos de resposta e frotas[cite: 5]:

| Tabela | Principais Campos | Finalidade |
| :--- | :--- | :--- |
| **usuarios** | `id`, `nome`, `idade`, `condicao_saude`, `lat`, `lng`, `aceitou_rede_protecao` | Perfil pré-cadastrado do cidadão para triagem prioritária e monitoramento de calor[cite: 5, 7]. |
| **instituicoes** | `id`, `nome`, `tipo_esfera`, `lat`, `lng` | Órgãos oficiais, concessionárias e ONGs certificadas habilitadas para despacho[cite: 4, 5]. |
| **veiculos_recursos** | `id`, `instituicao_id`, `tipo`, `disponivel` | Frota operacional (Barco Salva-Vidas, Helicóptero, Jipe 4x4, Van Adaptada, Caminhão Elétrico)[cite: 4, 6]. |
| **chamados** | `id`, `usuario_id`, `instituicao_id`, `tipo_problema`, `prioridade`, `recurso_sugerido`, `status` | Registro oficial da ocorrência (`Pendente` -> `A_Caminho` -> `Resgatado`)[cite: 6]. |

*Nota: Caso a variável `DATABASE_URL` não esteja configurada, o `store.js` opera automaticamente com persistência em memória pré-populada com dados reais da RMR, garantindo continuidade operacional.*

---

## 4. Onde e Como a Inteligência Artificial é Utilizada

### A. Na Arquitetura do Produto (`backend/src/services/triagemIAService.js`)
A IA atua no núcleo de decisão do backend no momento em que um chamado é aberto[cite: 4]:

- **Entrada:** Tipo de ocorrência acionada pelo cidadão + perfil da vítima (`idade` e `condicao_saude`)[cite: 4, 5].
- **Processamento:** Integração via API de LLM (`gpt-4o-mini` com saída estruturada em JSON) apoiada por um motor determinístico de contingência caso a API externa sofra latência ou queda de rede[cite: 5].
- **Saída:** Define automaticamente a **prioridade** (`Alta` / Fila Vermelha, `Média` ou `Baixa`), recomenda o **recurso_sugerido** adequado ao cenário (ex.: *Barco Salva-Vidas* para alagamento com mobilidade reduzida; *Jipe 4x4* ou *Helicóptero* para deslizamento de barreira) e gera uma **justificativa_ia** objetiva para o operador do centro de comando[cite: 4, 6].

### B. Transparência e Auditoria do Uso de IA no Desenvolvimento
Em conformidade com as diretrizes de transparência do hackathon, ferramentas de IA generativa foram utilizadas como **copiloto de engenharia**, sob revisão, refatoração e validação integral da equipe:

- **Arquitetura e Scaffolding:** Apoio na estruturação modular do servidor híbrido Express + Socket.io, modelagem DDL PostgreSQL e organização dos componentes React.
- **Revisão de Segurança e DevSecOps:** Auxílio na configuração de *Dockerfiles* multi-stage com execução não-privilegiada (`USER node` e `nginx-unprivileged`), sanitização de entradas e criação de mocks para testes automatizados.
- **Validação Humana:** Toda regra de negócio de triagem, limites meteorológicos (33°C para onda de calor), fluxos de contingência offline e suítes de testes foram auditados, ajustados e validados localmente e em contêiner pela equipe.

---

## 5. Como Executar, Testar e Validar Localmente

### Pré-requisitos
- **Node.js** v20+ e **npm**
- **Docker** (opcional, para validação de contêineres)

### Passo 1: Subir e Testar o Backend

    cd backend
    npm install
    npm test      # Executa os 5 testes automatizados (Jest + Supertest)
    npm start     # Inicia a API REST + WebSockets na porta 3001

### Passo 2: Subir e Testar o Frontend
Em um novo terminal:

    cd frontend
    npm install
    npm test      # Executa os testes de interface (Vitest + React Testing Library)
    npm run dev   # Inicia o Web App na porta 5173

### Passo 3: Roteiro de Validação End-to-End (E2E)
1. **Disparo SOS (Visão Cidadão):** Acesse `http://localhost:5173`, selecione o perfil *"Dona Maria Clarice (78 anos • Mobilidade reduzida)"* e clique em **Deslizamento de Barreira**. Verifique a classificação automática como **Prioridade Alta** e sugestão de **Helicóptero Resgate / Jipe 4x4**[cite: 4, 6].
2. **Despacho em Tempo Real (Visão Instituições):** Alterne para a aba **Visão Instituições**, localize o chamado na **Fila Vermelha** e clique em **Assumir Ocorrência e Despachar Frota**[cite: 4, 5].
3. **Confirmação ao Cidadão:** Retorne à aba **Visão Cidadão** e confirme a atualização instantânea via WebSocket para o status **A Caminho** com a identificação do órgão responsável[cite: 4, 5].
4. **Monitoramento de Onda de Calor:** Na **Visão Instituições**, verifique o painel **Rede Proativa — Onda de Calor**, listando os cidadãos vulneráveis da RMR elegíveis para visita de hidratação[cite: 7].
5. **Contingência Offline:** Interrompa o processo do backend (`Ctrl + C`) e recarregue o navegador (`F5`). O sistema deve carregar automaticamente os dados de contingência a partir de `frontend/public/alerta.json`.

### Passo 4: Validação via Contêineres Docker

    # Build e verificação de saúde do Backend
    docker build -t antena-backend:local ./backend
    docker run -d --name api-check -p 3001:3001 antena-backend:local
    curl http://localhost:3001/health
    docker rm -f api-check

    # Build do Frontend (Nginx Non-Root)
    docker build -t antena-frontend:local ./frontend

---

## 6. Principais Endpoints da API

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/health` | Verifica disponibilidade e status operacional da API. |
| `GET` | `/api/instituicoes` | Lista instituições cadastradas e disponibilidade de frotas. |
| `GET` | `/api/chamados` | Retorna o histórico e a fila ativa de ocorrências. |
| `POST` | `/api/chamados` | Registra novo pedido SOS, executa triagem por IA e emite evento `novo_chamado` via Socket.io. |
| `PATCH` | `/api/chamados/:id/aceitar` | Vincula uma instituição ao chamado (`status: A_Caminho`) e notifica via Socket.io[cite: 5, 6]. |
| `GET` | `/api/calor-extremo` | Consulta temperatura da RMR e retorna lista de vulneráveis para assistência preventiva[cite: 7]. |