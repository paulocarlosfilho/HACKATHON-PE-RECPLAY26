CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  idade INT NOT NULL,
  condicao_saude VARCHAR(150) NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  aceitou_rede_protecao BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS instituicoes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  tipo_esfera VARCHAR(50) NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL
);

CREATE TABLE IF NOT EXISTS veiculos_recursos (
  id SERIAL PRIMARY KEY,
  instituicao_id INT REFERENCES instituicoes(id) ON DELETE CASCADE,
  tipo VARCHAR(80) NOT NULL,
  disponivel BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS chamados (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  instituicao_id INT REFERENCES instituicoes(id) NULL,
  tipo_problema VARCHAR(80) NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  prioridade VARCHAR(20) NOT NULL,
  recurso_sugerido VARCHAR(80) NOT NULL,
  justificativa_ia TEXT,
  status VARCHAR(30) DEFAULT 'Pendente',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);