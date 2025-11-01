import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BotaoResposta } from '../BotaoResposta';
import { CardPergunta } from '../CardPergunta';

export function TelaJogoSoma({
  faseAtual,
  score,
  correctAnswers,
  currentQuestion,
  currentQuestionIndex,
  onAnswer,
  showFeedback,
  selectedAnswer,
}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.faseInfo}>
          <Text style={styles.faseLabel}>Fase {faseAtual.numero}</Text>
          <Text style={styles.faseTitulo}>{faseAtual.titulo}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Pontuação</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>

          <View style={styles.correctContainer}>
            <Text style={styles.correctLabel}>Acertos</Text>
            <Text style={styles.correctValue}>{correctAnswers}</Text>
          </View>
        </View>
      </View>

      <CardPergunta
        question={currentQuestion.question}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={faseAtual.perguntas}
      />

      <View style={styles.answersContainer}>
        {currentQuestion.answers.map((answer, index) => (
          <BotaoResposta
            key={index}
            text={answer}
            onPress={() => onAnswer(answer)}
            disabled={showFeedback}
            isCorrect={showFeedback && answer === currentQuestion.correctAnswer}
            isWrong={showFeedback && answer !== currentQuestion.correctAnswer}
            isSelected={answer === selectedAnswer}
          />
        ))}
      </View>

      {showFeedback && (
        <View style={styles.feedbackContainer}>
          <Text
            style={[
              styles.feedbackText,
              selectedAnswer === currentQuestion.correctAnswer
                ? styles.feedbackCorrect
                : styles.feedbackWrong,
            ]}
          >
            {selectedAnswer === currentQuestion.correctAnswer ? '✓ Correto!' : '✗ Errado!'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0F2FE',
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 2,
    borderBottomColor: '#0EA5E9',
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
    color: '#0EA5E9',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0EA5E9',
  },
  correctContainer: {
    alignItems: 'center',
  },
  correctLabel: {
    fontSize: 14,
    color: '#666',
  },
  correctValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
  },
  answersContainer: {
    padding: 20,
  },
  feedbackContainer: {
    padding: 20,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  feedbackCorrect: {
    color: '#10B981',
  },
  feedbackWrong: {
    color: '#EF4444',
  },
});
