-- create

CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  idade INTEGER NOT NULL
);

-- insert
INSERT INTO usuarios (nome, email, idade) VALUES (
  'nome',
  'nome@teste.com',
  18
);

-- listar dados
SELECT * FROM usuarios;

-- consulta específica
SELECT * FROM usuarios WHERE idade = 18;
--
SELECT * FROM usuarios WHERE nome = 'nome';
-- 
SELECT * FROM usuarios WHERE nome = 'nome' AND idade = 18;
--
SELECT * FROM usuarios WHERE idade >= 18;

-- exclusão
DELETE FROM usuarios WHERE idade = 18;

DELETE FROM usuarios WHERE nome = 'nomeTeste';

-- alteração
UPDATE usuarios SET nome = 'nomeTeste' WHERE idade = 18;
--                    nome a ser definido <-- nome atual na tabela, para:
UPDATE usuarios SET nome = 'TesteNome' WHERE nome = 'nomeTeste'
