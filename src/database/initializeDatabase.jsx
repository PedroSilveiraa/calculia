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

    CREATE TABLE IF NOT EXISTS conquistas (
      id TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      descricao TEXT NOT NULL,
      icone TEXT NOT NULL,
      categoria TEXT NOT NULL,
      desbloqueada INTEGER DEFAULT 0,
      data_desbloqueio TEXT,
      visualizada INTEGER DEFAULT 0
    );
  `);

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

  // Inicializa as 5 fases do jogo de comparação (primeira fase desbloqueada)
  const fasesExistentesComparacao = await db.getFirstAsync(
    'SELECT COUNT(*) as count FROM progresso_fases WHERE tipo_jogo = ?',
    ['comparacao']
  );

  if (fasesExistentesComparacao.count === 0) {
    await db.execAsync(`
      INSERT INTO progresso_fases (tipo_jogo, numero_fase, desbloqueada) VALUES
        ('comparacao', 1, 1),
        ('comparacao', 2, 0),
        ('comparacao', 3, 0),
        ('comparacao', 4, 0),
        ('comparacao', 5, 0);
    `);
    console.log('✅ Fases do jogo de comparação inicializadas');
  }

  // Inicializa as conquistas (apenas se não existirem)
  const conquistasExistentes = await db.getFirstAsync(
    'SELECT COUNT(*) as count FROM conquistas'
  );

  if (conquistasExistentes.count === 0) {
    await db.execAsync(`
      INSERT INTO conquistas (id, titulo, descricao, icone, categoria) VALUES
        ('primeira_vitoria', 'Primeira Vitória', 'Complete seu primeiro jogo', '🎯', 'geral'),
        ('perfeccionista', 'Perfeccionista', 'Acerte todas as perguntas em um jogo', '💯', 'geral'),
        ('persistente', 'Persistente', 'Jogue 10 partidas', '🔥', 'geral'),
        ('veterano', 'Veterano', 'Jogue 50 partidas', '⭐', 'geral'),
        ('mestre_soma', 'Mestre da Soma', 'Complete todas as fases do jogo de soma', '➕', 'soma'),
        ('soma_fase1', 'Primeiros Passos', 'Complete a Fase 1 do jogo de soma', '🥉', 'soma'),
        ('soma_fase3', 'Chegando aos 10', 'Complete a Fase 3 do jogo de soma', '🥈', 'soma'),
        ('soma_fase5', 'Desafio Vencido', 'Complete a Fase 5 do jogo de soma', '🥇', 'soma'),
        ('mestre_contagem', 'Mestre da Contagem', 'Complete todas as fases do jogo de contagem', '🔢', 'contagem'),
        ('contagem_fase1', 'Contador Iniciante', 'Complete a Fase 1 do jogo de contagem', '🥉', 'contagem'),
        ('contagem_fase3', 'Contador Experiente', 'Complete a Fase 3 do jogo de contagem', '🥈', 'contagem'),
        ('contagem_fase5', 'Contador Mestre', 'Complete a Fase 5 do jogo de contagem', '🥇', 'contagem'),
        ('mestre_comparacao', 'Mestre da Comparação', 'Complete todas as fases do jogo de comparação', '⚖️', 'comparacao'),
        ('comparacao_fase1', 'Comparador Iniciante', 'Complete a Fase 1 do jogo de comparação', '🥉', 'comparacao'),
        ('comparacao_fase3', 'Comparador Experiente', 'Complete a Fase 3 do jogo de comparação', '🥈', 'comparacao'),
        ('comparacao_fase5', 'Comparador Mestre', 'Complete a Fase 5 do jogo de comparação', '🥇', 'comparacao'),
        ('pontuador', 'Pontuador', 'Alcance 100 pontos em uma partida', '💰', 'geral'),
        ('high_scorer', 'High Scorer', 'Alcance 200 pontos em uma partida', '💎', 'geral'),
        ('estudioso', 'Estudioso', 'Complete 5 etapas de estudo', '📚', 'geral');
    `);
    console.log('✅ Conquistas inicializadas');
  }

  console.log('✅ Banco de dados inicializado');
}

export { db };
