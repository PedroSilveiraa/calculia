import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BotaoResposta } from '../BotaoResposta';

export function TelaJogoComparacao({
  faseAtual,
  score,
  correctAnswers,
  currentQuestion,
  currentQuestionIndex,
  onAnswer,
  showFeedback,
  selectedAnswer,
}) {
  const renderQuestao = () => {
    if (currentQuestion.tipo === 'numero_maior' || currentQuestion.tipo === 'numero_menor') {
      return (
        <View style={styles.numerosContainer}>
          <View style={styles.numeroBox}>
            <Text style={styles.numeroTexto}>{currentQuestion.numero1}</Text>
          </View>
          <Text style={styles.vsTexto}>VS</Text>
          <View style={styles.numeroBox}>
            <Text style={styles.numeroTexto}>{currentQuestion.numero2}</Text>
          </View>
        </View>
      );
    } else {
      // Questão de objetos
      return (
        <View style={styles.objetosMainContainer}>
          <View style={styles.grupoObjetos}>
            <Text style={styles.labelGrupo}>{currentQuestion.nomeObjeto1}</Text>
            <View style={styles.objetosGrid}>
              {Array(currentQuestion.quantidade1)
                .fill(0)
                .map((_, index) => (
                  <Text key={index} style={styles.emojiObjeto}>
                    {currentQuestion.emoji1}
                  </Text>
                ))}
            </View>
          </View>

          <View style={styles.vsContainer}>
            <Text style={styles.vsTexto}>VS</Text>
          </View>

          <View style={styles.grupoObjetos}>
            <Text style={styles.labelGrupo}>{currentQuestion.nomeObjeto2}</Text>
            <View style={styles.objetosGrid}>
              {Array(currentQuestion.quantidade2)
                .fill(0)
                .map((_, index) => (
                  <Text key={index} style={styles.emojiObjeto}>
                    {currentQuestion.emoji2}
                  </Text>
                ))}
            </View>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.faseInfo}>
            <Text style={styles.faseLabel}>Fase {faseAtual.numero}</Text>
            <Text style={styles.faseTitulo}>{faseAtual.titulo}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Pontuação</Text>
              <Text style={styles.scoreValue}>{score}</Text>
            </View>

            <View style={styles.questionNumberContainer}>
              <Text style={styles.questionNumber}>
                {currentQuestionIndex + 1} de {faseAtual.perguntas}
              </Text>
            </View>

            <View style={styles.correctContainer}>
              <Text style={styles.correctLabel}>Acertos</Text>
              <Text style={styles.correctValue}>{correctAnswers}</Text>
            </View>
          </View>
        </View>

        <View style={styles.perguntaContainer}>
          <Text style={styles.perguntaTitulo}>{currentQuestion.pergunta}</Text>
        </View>

        {renderQuestao()}

        <View style={styles.alternativasContainer}>
          {currentQuestion.alternativas.map((alternativa, index) => (
            <BotaoResposta
              key={index}
              text={alternativa.texto}
              onPress={() => onAnswer(alternativa)}
              disabled={showFeedback}
              isCorrect={showFeedback && alternativa.correta}
              isWrong={showFeedback && selectedAnswer?.texto === alternativa.texto && !alternativa.correta}
              isSelected={selectedAnswer?.texto === alternativa.texto}
            />
          ))}
        </View>

        {showFeedback && (
          <View style={styles.feedbackContainer}>
            <Text
              style={[
                styles.feedbackText,
                selectedAnswer?.correta ? styles.feedbackCorrect : styles.feedbackWrong,
              ]}
            >
              {selectedAnswer?.correta ? '✓ Correto!' : '✗ Errado!'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0F2FE',
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 2,
    borderBottomColor: '#F59E0B',
  },
  faseInfo: {
    alignItems: 'center',
    marginBottom: 15,
  },
  faseLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  faseTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    flex: 1,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  questionNumberContainer: {
    flex: 1,
    alignItems: 'center',
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  correctContainer: {
    alignItems: 'center',
    flex: 1,
  },
  correctLabel: {
    fontSize: 12,
    color: '#666',
  },
  correctValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
  },
  perguntaContainer: {
    padding: 20,
    alignItems: 'center',
  },
  perguntaTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  numerosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    marginVertical: 10,
  },
  numeroBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#F59E0B',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  numeroTexto: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  vsTexto: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#64748B',
  },
  vsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  objetosMainContainer: {
    padding: 20,
    gap: 15,
  },
  grupoObjetos: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  labelGrupo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 10,
  },
  objetosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  emojiObjeto: {
    fontSize: 32,
  },
  alternativasContainer: {
    padding: 20,
    gap: 12,
  },
  feedbackContainer: {
    padding: 20,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  feedbackCorrect: {
    color: '#10B981',
  },
  feedbackWrong: {
    color: '#EF4444',
  },
});
