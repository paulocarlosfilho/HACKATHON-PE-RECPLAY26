const request = require('supertest');
const app = require('./server');

describe('Suíte de Testes Automatizados - Backend de Resgate', () => {

  // Teste 1: Health Check
  test('1. Deve verificar se o servidor está online e saudável', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });

  // Teste 2: Criação de Resgate com Sucesso
  test('2. Deve registrar um novo pedido de resgate com sucesso (Status 201)', async () => {
    const payload = {
      localizacao: 'Rua Principal, 100',
      descricao: 'Água subindo rapidamente na residência',
      prioridade: 'alta'
    };
    
    const response = await request(app)
      .post('/api/resgates')
      .send(payload);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.descricao).toBe(payload.descricao);
  });

  // Teste 3: Validação de Erro ao Enviar Dados Incompletos
  test('3. Deve retornar erro 400 ao tentar criar resgate sem descrição', async () => {
    const payloadIncompleto = {
      localizacao: 'Avenida Central',
      prioridade: 'media'
    };
    
    const response = await request(app)
      .post('/api/resgates')
      .send(payloadIncompleto);
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('erro');
  });

  // Teste 4: Integração com Serviço de Clima
  test('4. Deve retornar os dados climáticos atuais da região monitorada', async () => {
    const response = await request(app).get('/api/clima?local=Recife');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('temperatura');
    expect(response.body).toHaveProperty('condicao');
  });

  // Teste 5: Triagem Automatizada por IA
  test('5. Deve classificar corretamente o nível de urgência do resgate via IA', async () => {
    const payload = {
      textoOcorrencia: 'Idoso acamado isolado devido a enchente severa na rua.'
    };
    
    const response = await request(app)
      .post('/api/triagem')
      .send(payload);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('nivelUrgencia');
    expect(['Baixa', 'Media', 'Alta', 'Critica']).toContain(response.body.nivelUrgencia);
  });

});