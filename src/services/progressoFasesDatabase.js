import { db } from '../database/initializeDatabase';

export class ProgressoFasesDatabase {
  /**
   * Busca o progresso de todas as fases de um tipo de jogo
   * @param {string} tipoJogo - 'soma', 'subtracao', etc
   */
  static async getProgressoFases(tipoJogo) {
    try {
      const fases = await db.getAllAsync(
        'SELECT * FROM progresso_fases WHERE tipo_jogo = ? ORDER BY numero_fase ASC',
        [tipoJogo]
      );
      return { success: true, fases };
    } catch (error) {
      console.error('Erro ao buscar progresso de fases:', error);
      return { success: false, error: error.message, fases: [] };
    }
  }

  /**
   * Busca o progresso de uma fase específica
   * @param {string} tipoJogo
   * @param {number} numeroFase
   */
  static async getProgressoFase(tipoJogo, numeroFase) {
    try {
      const fase = await db.getFirstAsync(
        'SELECT * FROM progresso_fases WHERE tipo_jogo = ? AND numero_fase = ?',
        [tipoJogo, numeroFase]
      );
      return { success: true, fase };
    } catch (error) {
      console.error('Erro ao buscar progresso da fase:', error);
      return { success: false, error: error.message, fase: null };
    }
  }

  /**
   * Salva o progresso de uma fase (mantém sempre a melhor pontuação)
   * @param {string} tipoJogo
   * @param {number} numeroFase
   * @param {number} pontuacao
   * @param {number} totalPerguntas
   * @param {number} acertos
   */
  static async saveProgressoFase(tipoJogo, numeroFase, pontuacao, totalPerguntas, acertos) {
    try {
      // Busca progresso atual
      const { fase: faseAtual } = await this.getProgressoFase(tipoJogo, numeroFase);

      // Verifica se é um novo recorde
      const isNovoRecorde = !faseAtual || pontuacao > faseAtual.melhor_pontuacao;
      const novaPontuacao = isNovoRecorde ? pontuacao : faseAtual.melhor_pontuacao;
      const novosAcertos = isNovoRecorde ? acertos : faseAtual.acertos;

      // Atualiza o progresso
      await db.runAsync(
        `UPDATE progresso_fases
         SET melhor_pontuacao = ?,
             total_perguntas = ?,
             acertos = ?,
             concluida = 1,
             data_conclusao = ?
         WHERE tipo_jogo = ? AND numero_fase = ?`,
        [novaPontuacao, totalPerguntas, novosAcertos, new Date().toISOString(), tipoJogo, numeroFase]
      );

      console.log(`✅ Progresso da fase ${numeroFase} atualizado!`, { isNovoRecorde, pontuacao: novaPontuacao });
      return { success: true, isNovoRecorde, pontuacaoAnterior: faseAtual?.melhor_pontuacao || 0 };
    } catch (error) {
      console.error('Erro ao salvar progresso da fase:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Desbloqueia a próxima fase
   * @param {string} tipoJogo
   * @param {number} numeroFaseAtual
   */
  static async desbloquearProximaFase(tipoJogo, numeroFaseAtual) {
    try {
      const proximaFase = numeroFaseAtual + 1;

      // Verifica se existe próxima fase
      const { fase } = await this.getProgressoFase(tipoJogo, proximaFase);
      if (!fase) {
        console.log('Não há próxima fase para desbloquear');
        return { success: true, faseDesbloqueada: false };
      }

      // Desbloqueia se ainda estiver bloqueada
      if (!fase.desbloqueada) {
        await db.runAsync(
          'UPDATE progresso_fases SET desbloqueada = 1 WHERE tipo_jogo = ? AND numero_fase = ?',
          [tipoJogo, proximaFase]
        );
        console.log(`🔓 Fase ${proximaFase} desbloqueada!`);
        return { success: true, faseDesbloqueada: true, numeroFase: proximaFase };
      }

      return { success: true, faseDesbloqueada: false };
    } catch (error) {
      console.error('Erro ao desbloquear próxima fase:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verifica se uma fase está desbloqueada
   * @param {string} tipoJogo
   * @param {number} numeroFase
   */
  static async verificarFaseDesbloqueada(tipoJogo, numeroFase) {
    try {
      const { fase } = await this.getProgressoFase(tipoJogo, numeroFase);
      return { success: true, desbloqueada: fase?.desbloqueada === 1 };
    } catch (error) {
      console.error('Erro ao verificar se fase está desbloqueada:', error);
      return { success: false, desbloqueada: false };
    }
  }

  /**
   * Calcula o progresso total do jogo (0-100%)
   * Baseado na pontuação obtida vs pontuação máxima possível
   * @param {string} tipoJogo
   * @param {number} pontuacaoMaximaPossivel - Soma de todas as pontuações máximas das fases
   */
  static async calcularProgressoTotal(tipoJogo, pontuacaoMaximaPossivel) {
    try {
      const { fases } = await this.getProgressoFases(tipoJogo);

      const pontuacaoTotal = fases.reduce((total, fase) => {
        return total + (fase.melhor_pontuacao || 0);
      }, 0);

      const porcentagem = Math.round((pontuacaoTotal / pontuacaoMaximaPossivel) * 100);

      return {
        success: true,
        pontuacaoTotal,
        pontuacaoMaximaPossivel,
        porcentagem,
        fasesCompletas: fases.filter(f => f.concluida === 1).length,
        totalFases: fases.length
      };
    } catch (error) {
      console.error('Erro ao calcular progresso total:', error);
      return {
        success: false,
        error: error.message,
        pontuacaoTotal: 0,
        porcentagem: 0
      };
    }
  }

  /**
   * Reseta o progresso de um jogo (útil para testes)
   * @param {string} tipoJogo
   */
  static async resetarProgresso(tipoJogo) {
    try {
      await db.runAsync(
        `UPDATE progresso_fases
         SET melhor_pontuacao = 0,
             acertos = 0,
             concluida = 0,
             desbloqueada = CASE WHEN numero_fase = 1 THEN 1 ELSE 0 END,
             data_conclusao = NULL
         WHERE tipo_jogo = ?`,
        [tipoJogo]
      );
      console.log(`🔄 Progresso de ${tipoJogo} resetado!`);
      return { success: true };
    } catch (error) {
      console.error('Erro ao resetar progresso:', error);
      return { success: false, error: error.message };
    }
  }
}
