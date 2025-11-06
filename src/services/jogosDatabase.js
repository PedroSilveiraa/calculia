import { db } from '../database/initializeDatabase';

export class JogosDatabase {
  /**
   * Cria uma sessão completa de jogo (APENAS QUANDO O JOGO TERMINA)
   * @param {string} tipoJogo - 'quiz', 'contagem', 'soma', etc
   * @param {string} userName - Nome do usuário
   * @param {number} totalScore - Pontuação total
   * @param {number} totalQuestions - Total de perguntas
   * @param {number} correctAnswers - Total de acertos
   * @param {Array} answers - Array com todas as respostas [{pergunta, resposta_usuario, resposta_correta, esta_correto}]
   * @param {number} numeroFase - Número da fase (opcional, padrão 1)
   */
  static async saveCompletedGame(tipoJogo, userName, totalScore, totalQuestions, correctAnswers, answers, numeroFase = 1) {
    try {
      // Cria data/hora no horário local
      const now = new Date();
      const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();

      // 1. Cria a sessão
      const sessionResult = await db.runAsync(
        'INSERT INTO sessoes_jogo (tipo_jogo, nome_usuario, hora_inicio, hora_fim, pontuacao_total, total_perguntas, respostas_corretas, numero_fase) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [tipoJogo, userName, localDate, localDate, totalScore, totalQuestions, correctAnswers, numeroFase]
      );

      const sessionId = sessionResult.lastInsertRowId;

      // 2. Salva todas as respostas
      for (const answer of answers) {
        await db.runAsync(
          'INSERT INTO respostas_jogo (sessao_id, sessao_tipo_jogo, pergunta, resposta_usuario, resposta_correta, esta_correto, tempo_gasto) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            sessionId,
            tipoJogo,
            answer.pergunta,
            answer.resposta_usuario,
            answer.resposta_correta,
            answer.esta_correto ? 1 : 0,
            answer.tempo_gasto || 0
          ]
        );
      }

      console.log(`✅ Jogo ${tipoJogo} salvo com sucesso! ID: ${sessionId}`);
      return { success: true, sessionId };
    } catch (error) {
      console.error('❌ Erro ao salvar jogo completo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Busca histórico de jogos (pode filtrar por tipo)
   */
  static async getHistory(limit = 20, tipoJogo = null) {
    try {
      let query = 'SELECT * FROM sessoes_jogo ORDER BY hora_inicio DESC LIMIT ?';
      let params = [limit];

      if (tipoJogo) {
        query = 'SELECT * FROM sessoes_jogo WHERE tipo_jogo = ? ORDER BY hora_inicio DESC LIMIT ?';
        params = [tipoJogo, limit];
      }

      const sessions = await db.getAllAsync(query, params);
      return { success: true, sessions };
    } catch (error) {
      console.error('Erro ao obter histórico:', error);
      return { success: false, error: error.message, sessions: [] };
    }
  }

  /**
   * Busca detalhes de uma sessão específica
   */
  static async getSessionDetails(sessionId) {
    try {
      const session = await db.getFirstAsync(
        'SELECT * FROM sessoes_jogo WHERE id = ?',
        [sessionId]
      );

      const answers = await db.getAllAsync(
        'SELECT * FROM respostas_jogo WHERE sessao_id = ?',
        [sessionId]
      );

      return { success: true, session, answers };
    } catch (error) {
      console.error('Erro ao obter detalhes da sessão:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Busca estatísticas gerais (pode filtrar por tipo de jogo)
   */
  static async getStats(tipoJogo = null) {
    try {
      let query = `
        SELECT
          COUNT(*) as total_jogos,
          SUM(respostas_corretas) as total_corretas,
          SUM(total_perguntas) as total_perguntas,
          MAX(pontuacao_total) as melhor_pontuacao,
          AVG(pontuacao_total) as pontuacao_media
        FROM sessoes_jogo
      `;

      if (tipoJogo) {
        query += ' WHERE tipo_jogo = ?';
        const stats = await db.getFirstAsync(query, [tipoJogo]);
        return { success: true, stats };
      } else {
        const stats = await db.getFirstAsync(query);
        return { success: true, stats };
      }
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Limpa todo o histórico
   */
  static async clearHistory() {
    try {
      await db.execAsync('DELETE FROM respostas_jogo');
      await db.execAsync('DELETE FROM sessoes_jogo');
      console.log('🗑️ Histórico limpo com sucesso!');
      return { success: true };
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Remove uma sessão específica
   */
  static async deleteSession(sessionId) {
    try {
      await db.runAsync('DELETE FROM respostas_jogo WHERE sessao_id = ?', [sessionId]);
      await db.runAsync('DELETE FROM sessoes_jogo WHERE id = ?', [sessionId]);
      console.log(`🗑️ Sessão ${sessionId} removida com sucesso!`);
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar sessão:', error);
      return { success: false, error: error.message };
    }
  }
}
