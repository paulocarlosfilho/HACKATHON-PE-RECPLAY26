const request = require('supertest');
const app = require('../server');

describe('Testes da API Antena na Lama', () => {
  test('1. GET /health deve retornar status 200 e ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('2. GET /api/riscos deve retornar os 4 indicadores climáticos para um bairro da RMR', async () => {
    const res = await request(app).get('/api/riscos?bairro=Ibura');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('riscos.chuvasFortes');
    expect(res.body).toHaveProperty('riscos.alagamentos');
    expect(res.body).toHaveProperty('riscos.deslizamentoBarreiras');
    expect(res.body).toHaveProperty('riscos.calorIntenso');
  });

  test('3. POST /api/ia/orientacao deve retornar 400 se faltar payload', async () => {
    const res = await request(app).post('/api/ia/orientacao').send({});
    expect(res.statusCode).toBe(400);
  });

  test('4. POST /api/ia/orientacao deve gerar alerta de emergência para risco ALTO em barreira', async () => {
    const res = await request(app)
      .post('/api/ia/orientacao')
      .send({
        bairro: 'Ibura',
        riscos: {
          chuvasFortes: 'ALTO',
          alagamentos: 'MODERADO',
          deslizamentoBarreiras: 'ALTO',
          calorIntenso: 'BAIXO'
        }
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.orientacao).toContain('199');
  });
});