import React, { useState } from 'react';

// ❌ COMPONENTE "RUIM" GERADO PELA IA (Reprova bonito no Lighthouse!)
// Erros que o Lighthouse pega na hora:
// 1. Baixo contraste (#94a3b8 no branco e texto branco no amarelo #fde047)
// 2. Imagem <img> sem atributo alt
// 3. Campos <input> e <select> SEM <label> associado
// 4. Botão sem texto acessível / feito com <div onClick> (não funciona no Tab!)
// 5. Hierarquia de título quebrada (começa em <h4> sem ter <h1>) e sem tag <main>

export function AlertaChuvaRuim() {
  const [cep, setCep] = useState('');
  const [enviado, setEnviado] = useState(false);

  const iconeNuvemSvg =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 24 24' fill='%2394a3b8'><path d='M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z'/></svg>";

  return (
    <div style={{ padding: '24px', color: '#94a3b8', background: '#ffffff', fontSize: '12px' }}>
      {/* ERRO: Pulou de h1 direto para h4 */}
      <h4 style={{ color: '#94a3b8', marginTop: 0 }}>
        TELEMETRIA HIDROLÓGICA RMR - APAC
      </h4>

      {/* ERRO: Imagem sem atributo alt */}
      <img src={iconeNuvemSvg} width="44" height="44" />

      {/* ERRO: Linguagem técnica difícil + contraste 2.5:1 */}
      <p style={{ color: '#94a3b8' }}>
        STATUS: Precipitação pluviométrica acumulada &gt; 85mm/6h com saturação pedológica crítica em taludes.
      </p>

      {/* ERRO: Select sem <label> */}
      <select
        style={{ width: '100%', padding: '4px', marginBottom: '8px', color: '#94a3b8', border: '1px solid #e2e8f0' }}
      >
        <option>Selecione a microbacia...</option>
        <option>Ibura</option>
      </select>

      {/* ERRO: Input sem <label> (só placeholder) e com outline: none */}
      <input
        type="text"
        placeholder="Insira o CEP ou identificador do logradouro..."
        value={cep}
        onChange={(e) => setCep(e.target.value)}
        style={{ width: '100%', padding: '4px', border: '1px solid #e2e8f0', color: '#94a3b8', outline: 'none' }}
      />

      {/* ERRO: Botão de ícone vazio sem nome acessível (aria-label) + div onClick sem teclado */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
        <button
          type="button"
          style={{ width: '20px', height: '20px', background: '#e2e8f0', border: 'none' }}
        />
        <div
          onClick={() => setEnviado(true)}
          style={{
            flex: 1,
            background: '#fde047',
            color: '#ffffff',
            padding: '5px',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          Submit Data
        </div>
      </div>

      {enviado && <p>200 OK - Payload registrado.</p>}
    </div>
  );
}
