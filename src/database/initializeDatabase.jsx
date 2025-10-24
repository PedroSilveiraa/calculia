import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('calculia.db');

export async function initializeDatabase() {
  // Cria as tabelas se não existirem
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sessoes_jogo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_usuario TEXT NOT NULL,
      hora_inicio TEXT NOT NULL,
      hora_fim TEXT,
      pontuacao_total INTEGER DEFAULT 0,
      total_perguntas INTEGER DEFAULT 0,
      respostas_corretas INTEGER DEFAULT 0,
      tipo_jogo TEXT DEFAULT "quiz",
      numero_fase INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS respostas_jogo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sessao_id INTEGER NOT NULL,
      sessao_tipo_jogo TEXT NOT NULL,
      pergunta TEXT NOT NULL,
      resposta_usuario TEXT NOT NULL,
      resposta_correta TEXT NOT NULL,
      esta_correto INTEGER NOT NULL,
      tempo_gasto INTEGER,
      FOREIGN KEY (sessao_id, sessao_tipo_jogo) REFERENCES sessoes_jogo (id, tipo_jogo)
    );

    CREATE TABLE IF NOT EXISTS progresso_fases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo_jogo TEXT NOT NULL,
      numero_fase INTEGER NOT NULL,
      melhor_pontuacao INTEGER DEFAULT 0,
      total_perguntas INTEGER DEFAULT 0,
      acertos INTEGER DEFAULT 0,
      concluida INTEGER DEFAULT 0,
      desbloqueada INTEGER DEFAULT 0,
      data_conclusao TEXT,
      UNIQUE(tipo_jogo, numero_fase)
    );
  `);

  // Migração: Adiciona coluna numero_fase se não existir (para bancos antigos)
  try {
    // Verifica se a coluna existe tentando selecioná-la
    await db.getFirstAsync('SELECT numero_fase FROM sessoes_jogo LIMIT 1');
  } catch (error) {
    // Se der erro, a coluna não existe, então adiciona
    console.log('🔄 Adicionando coluna numero_fase na tabela sessoes_jogo...');
    await db.execAsync('ALTER TABLE sessoes_jogo ADD COLUMN numero_fase INTEGER DEFAULT 1');
    console.log('✅ Coluna numero_fase adicionada com sucesso!');
  }

  // Inicializa as 5 fases do jogo de soma (primeira fase desbloqueada)
  const fasesExistentesSoma = await db.getFirstAsync(
    'SELECT COUNT(*) as count FROM progresso_fases WHERE tipo_jogo = ?',
    ['soma']
  );

  if (fasesExistentesSoma.count === 0) {
    await db.execAsync(`
      INSERT INTO progresso_fases (tipo_jogo, numero_fase, desbloqueada) VALUES
        ('soma', 1, 1),
        ('soma', 2, 0),
        ('soma', 3, 0),
        ('soma', 4, 0),
        ('soma', 5, 0);
    `);
    console.log('✅ Fases do jogo de soma inicializadas');
  }

  // Inicializa as 5 fases do jogo de contagem (primeira fase desbloqueada)
  const fasesExistentesContagem = await db.getFirstAsync(
    'SELECT COUNT(*) as count FROM progresso_fases WHERE tipo_jogo = ?',
    ['contagem']
  );

  if (fasesExistentesContagem.count === 0) {
    await db.execAsync(`
      INSERT INTO progresso_fases (tipo_jogo, numero_fase, desbloqueada) VALUES
        ('contagem', 1, 1),
        ('contagem', 2, 0),
        ('contagem', 3, 0),
        ('contagem', 4, 0),
        ('contagem', 5, 0);
    `);
    console.log('✅ Fases do jogo de contagem inicializadas');
  }

  console.log('✅ Banco de dados inicializado');
}

export { db };
