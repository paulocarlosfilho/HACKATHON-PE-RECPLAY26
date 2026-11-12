# Guia Rápido de Deploy na Vercel (Front-end no Celular)

> **Meta do Dia 1:** Primeiro deploy até o fim do Dia 1.
> **Meta do Code Freeze (Dia 2, 16h):** Solução funcionando no celular, com link público no `README.md`.

Como o repositório modelo tem duas pastas (`frontend/` e `backend/`), existe **um segredo de 10 segundos** na Vercel para o deploy funcionar de primeira: configurar o **Root Directory** como `frontend`.

---

## Passo a Passo (Leva 2 Minutos)

### 1. Suba o código para o GitHub da equipe
No terminal:
```bash
git add .
git commit -m "feat: tela acessível do fluxo principal e testes smoke"
git push origin main
```

### 2. Importe o repositório na Vercel
1. Acesse [vercel.com](https://vercel.com) e clique em **Continue with GitHub**.
2. Na tela inicial da Vercel, clique em **Add New...** → **Project**.
3. Localize o repositório da sua equipe e clique em **Import**.

### 3. ⚠️ O Segredo: Aponte para a pasta `frontend`
Na tela de configuração do projeto:
1. Procure o campo **Root Directory** (Diretório Raiz).
2. Clique em **Edit** ao lado de Root Directory e selecione a pasta **`frontend`**.
3. **Framework Preset:** A Vercel vai detectar automaticamente `Vite` ou `Next.js` (ou `Create React App`).

### 4. Conecte a URL da API do Back-end (Opcional no 1º Deploy, obrigatório quando a API subir)
Se a equipe de Back-end já publicou a API no Render (ex.: `https://api-equipe.onrender.com`):
1. Clique em **Environment Variables** (Variáveis de Ambiente).
2. Adicione:
   - **Se estiver usando Vite:** Nome `VITE_API_URL` e Valor `https://sua-api.onrender.com`
   - **Se estiver usando Next.js:** Nome `NEXT_PUBLIC_API_URL` e Valor `https://sua-api.onrender.com`
3. Clique em **Deploy**!

---

## 5. Teste no Celular e Cole no README!
1. Em menos de 1 minuto, a Vercel vai gerar o link público (ex.: `https://minha-equipe-recplay26.vercel.app`).
2. **Abra esse link no seu celular** (e mostre para o jovem validador do Movimento Pró-Criança testar no Dia 2!).
3. Copie o link e cole imediatamente no `README.md` do repositório na seção **🌐 Deploy Público**.

