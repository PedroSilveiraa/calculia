import { db } from '../database/initializeDatabase';

export class ConquistasDatabase {
  /**
   * Busca todas as conquistas
   */
  static async getTodasConquistas() {
    try {
      const conquistas = await db.getAllAsync(
        'SELECT * FROM conquistas ORDER BY desbloqueada DESC, categoria, id'
      );
      return { success: true, conquistas };
    } catch (error) {
      console.error('Erro ao buscar conquistas:', error);
      return { success: false, error: error.message, conquistas: [] };
    }
  }

  /**
   * Busca conquistas por categoria
   */
  static async getConquistasPorCategoria(categoria) {
    try {
      const conquistas = await db.getAllAsync(
        'SELECT * FROM conquistas WHERE categoria = ? ORDER BY desbloqueada DESC, id',
        [categoria]
      );
      return { success: true, conquistas };
    } catch (error) {
      console.error('Erro ao buscar conquistas por categoria:', error);
      return { success: false, error: error.message, conquistas: [] };
    }
  }

  /**
   * Busca conquistas desbloqueadas
   */
  static async getConquistasDesbloqueadas() {
    try {
      const conquistas = await db.getAllAsync(
        'SELECT * FROM conquistas WHERE desbloqueada = 1 ORDER BY data_desbloqueio DESC'
      );
      return { success: true, conquistas };
    } catch (error) {
      console.error('Erro ao buscar conquistas desbloqueadas:', error);
      return { success: false, error: error.message, conquistas: [] };
    }
  }

  /**
   * Busca conquistas não visualizadas (para mostrar modal)
   */
  static async getConquistasNaoVisualizadas() {
    try {
      const conquistas = await db.getAllAsync(
        'SELECT * FROM conquistas WHERE desbloqueada = 1 AND visualizada = 0 ORDER BY data_desbloqueio ASC'
      );
      return { success: true, conquistas };
    } catch (error) {
      console.error('Erro ao buscar conquistas não visualizadas:', error);
      return { success: false, error: error.message, conquistas: [] };
    }
  }

  /**
   * Desbloqueia uma conquista
   */
  static async desbloquearConquista(conquistaId) {
    try {
      // Verifica se já está desbloqueada
      const conquista = await db.getFirstAsync(
        'SELECT * FROM conquistas WHERE id = ?',
        [conquistaId]
      );

      if (!conquista) {
        return { success: false, error: 'Conquista não encontrada', jaDesbloqueada: false };
      }

      if (conquista.desbloqueada === 1) {
        return { success: true, jaDesbloqueada: true, conquista };
      }

      // Desbloqueia a conquista
      const now = new Date();
      const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();

      await db.runAsync(
        'UPDATE conquistas SET desbloqueada = 1, data_desbloqueio = ?, visualizada = 0 WHERE id = ?',
        [localDate, conquistaId]
      );

      const conquistaAtualizada = await db.getFirstAsync(
        'SELECT * FROM conquistas WHERE id = ?',
        [conquistaId]
      );

      console.log(`🏆 Conquista desbloqueada: ${conquistaAtualizada.titulo}`);
      return { success: true, jaDesbloqueada: false, conquista: conquistaAtualizada };
    } catch (error) {
      console.error('Erro ao desbloquear conquista:', error);
      return { success: false, error: error.message, jaDesbloqueada: false };
    }
  }

  /**
   * Marca conquistas como visualizadas
   */
  static async marcarComoVisualizadas(conquistaIds) {
    try {
      if (!Array.isArray(conquistaIds) || conquistaIds.length === 0) {
        return { success: true };
      }

      const placeholders = conquistaIds.map(() => '?').join(',');
      await db.runAsync(
        `UPDATE conquistas SET visualizada = 1 WHERE id IN (${placeholders})`,
        conquistaIds
      );

      console.log(`✅ ${conquistaIds.length} conquista(s) marcada(s) como visualizada(s)`);
      return { success: true };
    } catch (error) {
      console.error('Erro ao marcar conquistas como visualizadas:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Calcula estatísticas de conquistas
   */
  static async getEstatisticas() {
    try {
      const stats = await db.getFirstAsync(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN desbloqueada = 1 THEN 1 ELSE 0 END) as desbloqueadas,
          ROUND(CAST(SUM(CASE WHEN desbloqueada = 1 THEN 1 ELSE 0 END) AS FLOAT) / COUNT(*) * 100) as porcentagem
        FROM conquistas
      `);

      return { success: true, stats };
    } catch (error) {
      console.error('Erro ao calcular estatísticas de conquistas:', error);
      return { success: false, error: error.message, stats: null };
    }
  }

  /**
   * Verifica e desbloqueia conquistas baseadas no estado atual do jogo
   */
  static async verificarConquistas(tipoJogo, numeroFase, pontuacao, totalPerguntas, acertos, tempoTotal) {
    const conquistasDesbloqueadas = [];

    try {
      // Primeira vitória
      const totalJogos = await db.getFirstAsync(
        'SELECT COUNT(*) as count FROM sessoes_jogo'
      );
      if (totalJogos.count === 1) {
        const result = await this.desbloquearConquista('primeira_vitoria');
        if (result.success && !result.jaDesbloqueada) {
          conquistasDesbloqueadas.push(result.conquista);
        }
      }

      // Perfeccionista (100% de acerto)
      if (acertos === totalPerguntas) {
        const result = await this.desbloquearConquista('perfeccionista');
        if (result.success && !result.jaDesbloqueada) {
          conquistasDesbloqueadas.push(result.conquista);
        }
      }

      // Persistente (10 partidas)
      if (totalJogos.count === 10) {
        const result = await this.desbloquearConquista('persistente');
        if (result.success && !result.jaDesbloqueada) {
          conquistasDesbloqueadas.push(result.conquista);
        }
      }

      // Veterano (50 partidas)
      if (totalJogos.count === 50) {
        const result = await this.desbloquearConquista('veterano');
        if (result.success && !result.jaDesbloqueada) {
          conquistasDesbloqueadas.push(result.conquista);
        }
      }

      // Pontuador (100 pontos)
      if (pontuacao >= 100) {
        const result = await this.desbloquearConquista('pontuador');
        if (result.success && !result.jaDesbloqueada) {
          conquistasDesbloqueadas.push(result.conquista);
        }
      }

      // High Scorer (200 pontos)
      if (pontuacao >= 200) {
        const result = await this.desbloquearConquista('high_scorer');
        if (result.success && !result.jaDesbloqueada) {
          conquistasDesbloqueadas.push(result.conquista);
        }
      }

      // Velocista (menos de 30 segundos)
      if (tempoTotal && tempoTotal < 30) {
        const result = await this.desbloquearConquista('rapido');
        if (result.success && !result.jaDesbloqueada) {
          conquistasDesbloqueadas.push(result.conquista);
        }
      }

      // Conquistas específicas do jogo de soma
      if (tipoJogo === 'soma') {
        if (numeroFase === 1) {
          const result = await this.desbloquearConquista('soma_fase1');
          if (result.success && !result.jaDesbloqueada) {
            conquistasDesbloqueadas.push(result.conquista);
          }
        }
        if (numeroFase === 3) {
          const result = await this.desbloquearConquista('soma_fase3');
          if (result.success && !result.jaDesbloqueada) {
            conquistasDesbloqueadas.push(result.conquista);
          }
        }
        if (numeroFase === 5) {
          const result = await this.desbloquearConquista('soma_fase5');
          if (result.success && !result.jaDesbloqueada) {
            conquistasDesbloqueadas.push(result.conquista);
          }
        }

        // Mestre da Soma (todas as 5 fases completas)
        const fasesSoma = await db.getFirstAsync(
          'SELECT COUNT(*) as count FROM progresso_fases WHERE tipo_jogo = ? AND concluida = 1',
          ['soma']
        );
        if (fasesSoma.count === 5) {
          const result = await this.desbloquearConquista('mestre_soma');
          if (result.success && !result.jaDesbloqueada) {
            conquistasDesbloqueadas.push(result.conquista);
          }
        }
      }

      // Conquistas específicas do jogo de contagem
      if (tipoJogo === 'contagem') {
        if (numeroFase === 1) {
          const result = await this.desbloquearConquista('contagem_fase1');
          if (result.success && !result.jaDesbloqueada) {
            conquistasDesbloqueadas.push(result.conquista);
          }
        }
        if (numeroFase === 3) {
          const result = await this.desbloquearConquista('contagem_fase3');
          if (result.success && !result.jaDesbloqueada) {
            conquistasDesbloqueadas.push(result.conquista);
          }
        }
        if (numeroFase === 5) {
          const result = await this.desbloquearConquista('contagem_fase5');
          if (result.success && !result.jaDesbloqueada) {
            conquistasDesbloqueadas.push(result.conquista);
          }
        }

        // Mestre da Contagem (todas as 5 fases completas)
        const fasesContagem = await db.getFirstAsync(
          'SELECT COUNT(*) as count FROM progresso_fases WHERE tipo_jogo = ? AND concluida = 1',
          ['contagem']
        );
        if (fasesContagem.count === 5) {
          const result = await this.desbloquearConquista('mestre_contagem');
          if (result.success && !result.jaDesbloqueada) {
            conquistasDesbloqueadas.push(result.conquista);
          }
        }
      }

      // Conquistas específicas do jogo de comparação
      if (tipoJogo === 'comparacao') {
        if (numeroFase === 1) {
          const result = await this.desbloquearConquista('comparacao_fase1');
          if (result.success && !result.jaDesbloqueada) {
            conquistasDesbloqueadas.push(result.conquista);
          }
        }
        if (numeroFase === 3) {
          const result = await this.desbloquearConquista('comparacao_fase3');
          if (result.success && !result.jaDesbloqueada) {
            conquistasDesbloqueadas.push(result.conquista);
          }
        }
        if (numeroFase === 5) {
          const result = await this.desbloquearConquista('comparacao_fase5');
          if (result.success && !result.jaDesbloqueada) {
            conquistasDesbloqueadas.push(result.conquista);
          }
        }

        // Mestre da Comparação (todas as 5 fases completas)
        const fasesComparacao = await db.getFirstAsync(
          'SELECT COUNT(*) as count FROM progresso_fases WHERE tipo_jogo = ? AND concluida = 1',
          ['comparacao']
        );
        if (fasesComparacao.count === 5) {
          const result = await this.desbloquearConquista('mestre_comparacao');
          if (result.success && !result.jaDesbloqueada) {
            conquistasDesbloqueadas.push(result.conquista);
          }
        }
      }

      return { success: true, conquistasDesbloqueadas };
    } catch (error) {
      console.error('Erro ao verificar conquistas:', error);
      return { success: false, error: error.message, conquistasDesbloqueadas };
    }
  }

  /**
   * Reseta todas as conquistas (útil para limpar dados)
   */
  static async resetarConquistas() {
    try {
      await db.runAsync(
        'UPDATE conquistas SET desbloqueada = 0, data_desbloqueio = NULL, visualizada = 0'
      );
      console.log('🔄 Todas as conquistas resetadas!');
      return { success: true };
    } catch (error) {
      console.error('Erro ao resetar conquistas:', error);
      return { success: false, error: error.message };
    }
  }
}
