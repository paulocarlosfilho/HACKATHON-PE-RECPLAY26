# Checklist de Acessibilidade Básica — Desafio Antena na Lama (RMR)

> **Regra 6 do Desafio:** *"Acessível de verdade: funciona bem no celular, usa linguagem simples e segue a acessibilidade básica (contraste, labels, teclado)."*

No Hackathon APONTI Academy, a nossa solução precisa funcionar para **qualquer morador da Região Metropolitana do Recife (RMR)** — especialmente em momentos de chuva forte, falta de energia ou estresse, usando celular com tela molhada ou sol forte.

Use este checklist de **5 pontos** antes de entregar o seu protótipo e antes do **Code Freeze (Dia 2, 16h)**:

---

## 1. Linguagem Simples (Sem "tecniquês")
A IA adora escrever frases como *"Precipitação pluviométrica acumulada > 80mm com saturação pedológica"*. Na hora da emergência, isso não salva vidas.

- [ ] **Troque termos técnicos por ação direta:**
  - ❌ *Ruim (IA sem filtro):* `"Anomalia hidrológica severa detectada na microbacia."`
  - ✅ *Bom (Corrigido pela equipe):* `"Risco de alagamento na sua rua. Levante os móveis e vá para a Escola Municipal."`
- [ ] **Destaque o que fazer agora:** Quem lê a tela em 5 segundos sabe para onde ir e para qual número ligar (`199` Defesa Civil)?

---

## 2. Contraste de Cores (Mínimo 4.5:1 para textos e 3:1 para bordas/ícones)
Telas com cinza claro sobre branco ou texto branco sobre amarelo somem no sol ou em celulares com brilho baixo (economizando bateria).

- [ ] **Texto normal:** Contraste mínimo de **4.5:1** contra o fundo (ex.: texto `#0f172a` sobre fundo `#ffffff`).
- [ ] **Bordas de campos (`input`/`select`):** Use bordas visíveis (ex.: `#475569` ou mais escuro sobre fundo branco).
- [ ] **Não use apenas cor para indicar perigo:** Sempre acompanhe o vermelho/amarelo com um **ícone** (`🚨`, `⚠️`) e **texto claro** (`RISCO ALTO`, `ATENÇÃO`).

---

## 3. Labels em Todos os Campos de Formulário (`<label htmlFor>`)
**Nunca use `placeholder` como substituto de `<label>`!** Quando o usuário começa a digitar, o `placeholder` some, tem baixo contraste e não é lido corretamente por leitores de tela (TalkBack / VoiceOver).

- [ ] Todo `<input>`, `<select>` e `<textarea>` possui um `<label htmlFor="id-do-campo">` visível logo acima dele:
```jsx
<label htmlFor="campo-bairro">Qual é o seu bairro ou comunidade?</label>
<input
  id="campo-bairro"
  name="bairro"
  type="text"
  required
/>
```
- [ ] Se houver texto de ajuda/exemplo, conecte-o com `aria-describedby`:
```jsx
<label htmlFor="campo-nome">Seu nome ou apelido:</label>
<span id="dica-nome">Ex: Dona Maria da Ladeira</span>
<input id="campo-nome" aria-describedby="dica-nome" required />
```

---

## 4. Navegação por Teclado e Tamanho de Toque no Celular
Muita gente navega com teclado ou tecnologias assistivas, e no celular ninguém consegue acertar um botão minúsculo.

- [ ] **Use elementos HTML nativos:** Use `<button type="submit">` para botões (nunca `<div onClick={...}>`). O `<button>` já funciona com `Tab`, `Enter` e `Espaço` gratuitamente!
- [ ] **Nunca apague o foco (`outline: none`) sem colocar outro:** Use `:focus-visible` com borda nítida:
```css
:where(button, input, select, textarea, a):focus-visible {
  outline: 3px solid #0b57d0;
  outline-offset: 2px;
}
```
- [ ] **Alvo de toque no celular:** Botões e campos têm pelo menos **48px de altura** (`min-block-size: 48px`) e fonte de pelo menos `16px` (`1rem`) para evitar zoom forçado no celular.

---

## 5. Texto Alternativo em Imagens e Ícones (`alt`)
- [ ] **Imagens que trazem informação (mapas, alertas, fotos):** Têm atributo `alt` descrevendo a informação:
```jsx
<img src="/alerta-alto.svg" alt="Risco alto de deslizamento no Ibura" />
```
- [ ] **Ícones ou emojis apenas decorativos (ao lado de um texto que já diz tudo):** Esconda do leitor de tela para não repetir ou confundir:
```jsx
<button type="submit">
  <span aria-hidden="true">✅</span> Enviar Alerta
</button>
```

---

## 🔍 Como Auditar em 30 Segundos (Antes e Depois)
1. Abra a sua tela no Chrome/Edge.
2. Aperte `F12` (DevTools) → aba **Lighthouse** (ou **axe DevTools**).
3. Marque a opção **Accessibility (Acessibilidade)** + **Mobile** e clique em **Analyze page load**.
4. Corrija os itens apontados e anote no `README.md` na seção **🤖 Uso Ético de IA** o que a sua equipe corrigiu!

