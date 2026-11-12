const test = require('node:test');
const assert = require('node:assert');
const { ALERTAS_RMR } = require('./server');

test('1. Lista de alertas da RMR possui bairros do Grande Recife', () => {
  assert.ok(ALERTAS_RMR.length >= 3);
  assert.ok(ALERTAS_RMR[0].bairro.includes('Ibura'));
});

test('2. Todos os alertas possuem tradução em linguagem simples e abrigo próximo', () => {
  for (const alerta of ALERTAS_RMR) {
    assert.ok(alerta.linguagemSimples && alerta.linguagemSimples.length > 10);
    assert.ok(alerta.abrigoMaisProximo && alerta.abrigoMaisProximo.length > 5);
  }
});

test('3. Telefone da Defesa Civil (199) está presente nas orientações', () => {
  assert.ok(ALERTAS_RMR[0].telefoneEmergencia.includes('199'));
});

