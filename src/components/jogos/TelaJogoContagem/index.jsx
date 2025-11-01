import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BotoesAlternativas } from '../BotoesAlternativas';
import { PainelObjetos } from '../PainelObjetos';

export function TelaJogoContagem({
  faseAtual,
  score,
  correctAnswers,
  currentQuestion,
  currentQuestionIndex,
  objetos,
  onObjetoPress,
  onResposta,
  respostaSelecionada,
  showFeedback,
}) {
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

        <View style={styles.instructionContainer}>
          <Text style={styles.instructionTitle}>
            Quantos {currentQuestion.emoji} você vê?
          </Text>
          <Text style={styles.instructionText}>Toque nos objetos para contá-los!</Text>
          <PainelObjetos objetos={objetos} onObjetoPress={onObjetoPress} />
        </View>

        <View style={styles.alternativasSection}>
          <Text style={styles.alternativasTitle}>Escolha a resposta:</Text>
          <BotoesAlternativas
            alternativas={currentQuestion.alternativas}
            onSelect={onResposta}
            respostaSelecionada={respostaSelecionada}
            respostaCorreta={currentQuestion.quantidade}
            showFeedback={showFeedback}
          />
        </View>

        {showFeedback && (
          <View style={styles.feedbackContainer}>
            <Text
              style={[
                styles.feedbackText,
                respostaSelecionada === currentQuestion.quantidade
                  ? styles.feedbackCorrect
                  : styles.feedbackWrong,
              ]}
            >
              {respostaSelecionada === currentQuestion.quantidade
                ? '✓ Correto!'
                : `✗ Errado! A resposta era ${currentQuestion.quantidade}`}
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
    borderBottomColor: '#3B82F6',
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
    color: '#3B82F6',
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
    color: '#3B82F6',
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
  instructionContainer: {
    padding: 20,
    alignItems: 'center',
  },
  instructionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 10,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 20,
    textAlign: 'center',
  },
  alternativasSection: {
    padding: 20,
  },
  alternativasTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 15,
    textAlign: 'center',
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
