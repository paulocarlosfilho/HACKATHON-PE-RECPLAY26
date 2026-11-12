# Dicas para Telas Leves no Celular e com Internet Fraca (3G / Chuva)

Quando chove forte na Região Metropolitana do Recife (RMR), duas coisas acontecem ao mesmo tempo: **a energia oscila** e **o sinal de internet móvel (3G/4G) fica congestionado ou cai**.

Se a sua tela depender de baixar 10 MB de imagens pesadas ou travar com uma tela em branco quando a API demorar, o morador na encosta ou na área alagada não consegue usar.

Aqui estão 4 práticas simples para deixar seu Front-end à prova de chuva forte:

---

## 1. Sempre tenha Dados de Segurança Locais (Fallback / Offline-First)
Quando fizer o `fetch()` para a API do back-end, **nunca deixe a tela vazia se a requisição falhar**. Guarde os telefones de emergência (`199` Defesa Civil, `193` Bombeiros) e os pontos de apoio principais direto no código como fallback:

```javascript
useEffect(() => {
  async function buscarAlertas() {
    try {
      const resposta = await fetch(`${API_URL}/api/alertas`);
      if (!resposta.ok) throw new Error('Erro na rede');
      const dados = await resposta.json();
      setAlertas(dados.alertas);
    } catch (erro) {
      // A internet caiu? O app continua funcionando com os dados de segurança!
      setModoOffline(true);
      setAlertas(DADOS_LOCAIS_DE_SEGURANCA_RMR);
    }
  }
  buscarAlertas();
}, []);
```

---

## 2. Troque Imagens Pesadas por SVGs Leves ou Ícones Nativos
- Uma foto `.png` de 2 MB demora mais de 15 segundos para abrir no 3G fraco.
- Um ícone em **SVG inline** ou texto estilizado com CSS pesa **menos de 1 KB** e carrega instantaneamente.
- Se precisar exibir fotos (ex.: guia de descarte de resíduos ou foto de barreira), comprima antes e defina `width`, `height` e `loading="lazy"`.

---

## 3. Botão de Ligação Direta (`tel:199`)
No celular, o protocolo `tel:` funciona **mesmo quando os dados móveis (internet) acabam**! Coloque sempre um botão de emergência que abre o discador direto para a Defesa Civil:

```jsx
<a href="tel:199" className="btn-emergency">
  📞 Ligar grátis para Defesa Civil (199)
</a>
```

---

## 4. Layout de Uma Coluna e Toque Fácil (Mão Molhada / Pressa)
- **Uma coluna só:** No celular (`320px` a `420px` de largura), nunca esprema duas colunas lado a lado. Empilhe os cartões um embaixo do outro.
- **Botões grandes (`min-height: 48px`):** Sob estresse ou chuva, a precisão do toque cai. Deixe botões largos (`width: 100%`) e bem espaçados.
- **Fontes legíveis (`>= 16px`):** Evita que o navegador do celular dê zoom automático quando o morador toca para digitar em um `<input>`.

