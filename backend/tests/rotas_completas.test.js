const request = require('supertest');
const app = require('../server');

describe('Suíte de Testes de Integração - Rotas do Esquema de Banco de Dados e Serviços', () => {

  test('1. Deve listar instituições com a respectiva frota de recursos veiculares', async () => {
    const res = await request(app).get('/api/instituicoes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('nome');
    expect(res.body[0]).toHaveProperty('recursos');
    expect(Array.isArray(res.body[0].recursos)).toBe(true);
  });

  test('2. Deve listar usuários da rede de proteção e filtrar vulneráveis', async () => {
    const resTodos = await request(app).get('/api/usuarios');
    expect(resTodos.status).toBe(200);
    expect(resTodos.body.length).toBeGreaterThan(0);

    const resVulneraveis = await request(app).get('/api/usuarios?vulneravel=true');
    expect(resVulneraveis.status).toBe(200);
    resVulneraveis.body.forEach((u) => {
      expect(u.aceitou_rede_protecao).toBe(true);
      expect(u.idade >= 60 || u.condicao_saude !== 'Sem comorbidades').toBe(true);
    });
  });

  test('3. Deve cadastrar novo usuário na rede de proteção', async () => {
    const novoUsuario = {
      nome: 'José da Silva - Morro da Conceição',
      idade: 71,
      condicao_saude: 'Hipertenso / Dificuldade de locomoção',
      lat: -8.0210,
      lng: -34.8980,
      aceitou_rede_protecao: true
    };

    const res = await request(app).post('/api/usuarios').send(novoUsuario);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe(novoUsuario.nome);
  });

  test('4. Deve criar um chamado de emergência acionando o motor de triagem por IA', async () => {
    const chamadoPayload = {
      usuario_id: 1, // Dona Maria Clarice
      tipo_problema: 'Barreira deslizando atrás da casa após chuva torrencial',
      lat: -8.1189,
      lng: -34.9458
    };

    const res = await request(app).post('/api/chamados').send(chamadoPayload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.prioridade).toBe('Alta');
    expect(res.body).toHaveProperty('recurso_sugerido');
    expect(res.body).toHaveProperty('justificativa_ia');
    expect(res.body.status).toBe('Pendente');
  });

  test('5. Deve permitir que uma instituição aceite o chamado e despache seu recurso', async () => {
    // 1º Cria chamado
    const criarRes = await request(app).post('/api/chamados').send({
      tipo_problema: 'Alagamento severo no canal',
      vitima_nome: 'Família Ilhada',
      vitima_idade: 40,
      vitima_condicao: 'Gestante ilhada'
    });
    const chamadoId = criarRes.body.id;

    // 2º Bombeiros (instituicao_id: 1) aceita o chamado
    const aceitarRes = await request(app)
      .patch(`/api/chamados/${chamadoId}/aceitar`)
      .send({ instituicao_id: 1 });

    expect(aceitarRes.status).toBe(200);
    expect(aceitarRes.body.status).toBe('A_Caminho');
    expect(aceitarRes.body.instituicao_id).toBe(1);

    // 3º Finaliza o chamado
    const finalizarRes = await request(app)
      .patch(`/api/chamados/${chamadoId}/finalizar`);

    expect(finalizarRes.status).toBe(200);
    expect(finalizarRes.body.status).toBe('Resgatado');
  });

  test('6. Deve consultar alertas meteorológicos e registrar pedido de ajuda simplificado', async () => {
    const resAlertas = await request(app).get('/api/alertas');
    expect(resAlertas.status).toBe(200);
    expect(resAlertas.body).toHaveProperty('alertas');
    expect(resAlertas.body.alertas.length).toBeGreaterThan(0);

    const pedidoAjuda = {
      morador: 'Cláudio Silva',
      bairro: 'Ibura',
      situacao: 'Água entrando pelo portão, preciso de abrigo',
      telefone: '81 99999-0000'
    };

    const resAjuda = await request(app).post('/api/ajuda').send(pedidoAjuda);
    expect(resAjuda.status).toBe(201);
    expect(resAjuda.body).toHaveProperty('pedido');
    expect(resAjuda.body.pedido.protocolo).toMatch(/^REC-\d+/);
  });

  test('7. Deve verificar plano de ação preventiva contra onda de calor', async () => {
    const resCalor = await request(app).get('/api/clima/calor?temp=34.5');
    expect(resCalor.status).toBe(200);
    expect(resCalor.body.alertaOndaCalor).toBe(true);
    expect(resCalor.body).toHaveProperty('planoAssistencia');
    expect(Array.isArray(resCalor.body.planoAssistencia)).toBe(true);
  });

  test('8. Deve validar rotas complementares: /api/health, /api/resgates (GET) e /api/chamados (GET)', async () => {
    const resHealth = await request(app).get('/api/health');
    expect(resHealth.status).toBe(200);
    expect(resHealth.body.status).toBe('ok');

    const resResgates = await request(app).get('/api/resgates');
    expect(resResgates.status).toBe(200);
    expect(Array.isArray(resResgates.body)).toBe(true);

    const resChamados = await request(app).get('/api/chamados');
    expect(resChamados.status).toBe(200);
    expect(Array.isArray(resChamados.body)).toBe(true);
    expect(resChamados.body.length).toBeGreaterThan(0);
  });

});
