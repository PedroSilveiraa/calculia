import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function SeletorFases({ fases, onSelecionarFase, onVoltar }) {
  const renderEstrelas = (acertos, totalPerguntas) => {
    if (totalPerguntas === 0) return null;

    const porcentagem = (acertos / totalPerguntas) * 100;
    let numEstrelas = 0;

    if (porcentagem >= 90) numEstrelas = 3;
    else if (porcentagem >= 70) numEstrelas = 2;
    else if (porcentagem >= 50) numEstrelas = 1;

    return (
      <View style={styles.estrelas}>
        {[1, 2, 3].map((i) => (
          <Text key={i} style={styles.estrela}>
            {i <= numEstrelas ? '⭐' : '☆'}
          </Text>
        ))}
      </View>
    );
  };

  const renderStatusBadge = (fase) => {
    if (!fase.desbloqueada) {
      return <Text style={styles.badge}>🔒 Bloqueada</Text>;
    }
    if (fase.concluida) {
      return <Text style={[styles.badge, styles.badgeConcluida]}>✓ Concluída</Text>;
    }
    return <Text style={[styles.badge, styles.badgeDisponivel]}>▶ Disponível</Text>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Selecione a Fase</Text>
        <Text style={styles.subtitulo}>Complete para desbloquear as próximas!</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {fases.map((fase) => (
          <TouchableOpacity
            key={fase.numero}
            style={[
              styles.cardFase,
              !fase.desbloqueada && styles.cardBloqueada,
              fase.concluida && styles.cardConcluida
            ]}
            onPress={() => fase.desbloqueada && onSelecionarFase(fase.numero)}
            disabled={!fase.desbloqueada}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <View style={styles.numeroContainer}>
                <Text style={styles.numeroFase}>{fase.numero}</Text>
              </View>

              <View style={styles.infoContainer}>
                <Text style={[styles.tituloFase, !fase.desbloqueada && styles.textoDesabilitado]}>
                  {fase.titulo}
                </Text>
                <Text style={[styles.descricaoFase, !fase.desbloqueada && styles.textoDesabilitado]}>
                  {fase.descricao}
                </Text>
              </View>

              {renderStatusBadge(fase)}
            </View>

            {fase.concluida && (
              <View style={styles.progressoContainer}>
                {renderEstrelas(fase.acertos, fase.totalPerguntas)}
                <View style={styles.pontuacaoContainer}>
                  <Text style={styles.labelPontuacao}>Melhor Pontuação</Text>
                  <Text style={styles.valorPontuacao}>{fase.melhorPontuacao} pts</Text>
                </View>
              </View>
            )}

            {!fase.desbloqueada && (
              <View style={styles.mensagemBloqueio}>
                <Text style={styles.textoBloqueio}>
                  Complete a fase anterior para desbloquear
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={onVoltar}>
          <Text style={styles.textoBotao}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2FE',
  },
  header: {
    padding: 20,
    backgroundColor: '#0EA5E9',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 14,
    color: '#F0F9FF',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  cardFase: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardBloqueada: {
    backgroundColor: '#F1F5F9',
    opacity: 0.6,
  },
  cardConcluida: {
    borderColor: '#10B981',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numeroContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0EA5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numeroFase: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoContainer: {
    flex: 1,
  },
  tituloFase: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  descricaoFase: {
    fontSize: 14,
    color: '#64748B',
  },
  textoDesabilitado: {
    color: '#94A3B8',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: '#E2E8F0',
    color: '#64748B',
    marginLeft: 8,
  },
  badgeConcluida: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  badgeDisponivel: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
  },
  progressoContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  estrelas: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  estrela: {
    fontSize: 24,
    marginHorizontal: 4,
  },
  pontuacaoContainer: {
    alignItems: 'center',
  },
  labelPontuacao: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  valorPontuacao: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0EA5E9',
  },
  mensagemBloqueio: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
  },
  textoBloqueio: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  botaoVoltar: {
    backgroundColor: '#64748B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
