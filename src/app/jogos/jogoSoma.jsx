import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { BotaoResposta } from '../../components/jogos/BotaoResposta';
import { CardPergunta } from '../../components/jogos/CardPergunta';
import { HistoricoPartidas } from '../../components/jogos/HistoricoPartidas';
import { ResultadoJogo } from '../../components/jogos/ResultadoJogo';
import { SeletorFases } from '../../components/jogos/SeletorFases';
import { JogosDatabase } from '../../services/jogosDatabase';
import { ProgressoFasesDatabase } from '../../services/progressoFasesDatabase';
import { StorageService } from '../../services/storage';

// Configuração das 5 fases
const FASES = [
  {
    numero: 1,
    titulo: 'Primeiros Passos',
    descricao: 'Soma até 5',
    max: 5,
    termos: 2,
    perguntas: 5,
    pontosPorAcerto: 10
  },
  {
    numero: 2,
    titulo: 'Subindo de Nível',
    descricao: 'Soma até 9',
    max: 9,
    termos: 2,
    perguntas: 5,
    pontosPorAcerto: 15
  },
  {
    numero: 3,
    titulo: 'Chegando aos 10',
    descricao: 'Soma até 10',
    max: 10,
    termos: 2,
    perguntas: 5,
    pontosPorAcerto: 20
  },
  {
    numero: 4,
    titulo: 'Soma Tripla',
    descricao: 'Soma de 3 números até 10',
    max: 10,
    termos: 3,
    perguntas: 5,
    pontosPorAcerto: 25
  },
  {
    numero: 5,
    titulo: 'Desafio 20',
    descricao: 'Soma até 20',
    max: 20,
    termos: 2,
    perguntas: 5,
    pontosPorAcerto: 30
  }
];

const TIPO_JOGO = 'soma';

export default function jogoSoma() {
  const [gameState, setGameState] = useState('menu'); // menu, selectPhase, playing, result, history
  const [faseAtual, setFaseAtual] = useState(null);
  const [fasesDisponiveis, setFasesDisponiveis] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userName, setUserName] = useState('Jogador');
  const [showFeedback, setShowFeedback] = useState(false);
  const [answersHistory, setAnswersHistory] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [proximaFaseDesbloqueada, setProximaFaseDesbloqueada] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadUserName();
      loadProgressoFases();
    }, [])
  );

  const loadUserName = async () => {
    const userData = await StorageService.getUserData();
    if (userData && userData.name) {
      setUserName(userData.name);
    }
  };

  const loadProgressoFases = async () => {
    const { fases } = await ProgressoFasesDatabase.getProgressoFases(TIPO_JOGO);

    // Monta array de fases com dados combinados
    const fasesComDados = FASES.map(faseConfig => {
      const progressoFase = fases.find(f => f.numero_fase === faseConfig.numero);
      return {
        numero: faseConfig.numero,
        titulo: faseConfig.titulo,
        descricao: faseConfig.descricao,
        config: faseConfig,
        desbloqueada: progressoFase?.desbloqueada === 1,
        concluida: progressoFase?.concluida === 1,
        melhorPontuacao: progressoFase?.melhor_pontuacao || 0,
        acertos: progressoFase?.acertos || 0,
        totalPerguntas: progressoFase?.total_perguntas || 0
      };
    });

    setFasesDisponiveis(fasesComDados);
  };

  const generateQuestionForPhase = (fase) => {
    const { max, termos } = fase;
    const numeros = [];
    let soma = 0;

    // Gera números aleatórios baseado na configuração da fase
    for (let i = 0; i < termos; i++) {
      let num;
      if (i === 0) {
        // Primeiro número pode ser qualquer um até max
        num = Math.floor(Math.random() * (max + 1));
      } else {
        // Próximos números devem garantir que a soma não ultrapasse max
        const restante = max - soma;
        num = Math.floor(Math.random() * (restante + 1));
      }
      numeros.push(num);
      soma += num;
    }

    const question = numeros.join(' + ');
    const correctAnswer = soma;

    // Gera 3 respostas erradas
    const wrongAnswers = [];
    while (wrongAnswers.length < 3) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const wrongAnswer = correctAnswer + (offset === 0 ? (Math.random() > 0.5 ? 1 : -1) : offset);

      if (wrongAnswer !== correctAnswer && !wrongAnswers.includes(wrongAnswer) && wrongAnswer >= 0 && wrongAnswer <= max * 2) {
        wrongAnswers.push(wrongAnswer);
      }
    }

    const allAnswers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

    return {
      question,
      correctAnswer: correctAnswer.toString(),
      answers: allAnswers.map(a => a.toString())
    };
  };

  const generateQuestions = (fase) => {
    const newQuestions = [];
    for (let i = 0; i < fase.perguntas; i++) {
      newQuestions.push(generateQuestionForPhase(fase));
    }
    return newQuestions;
  };

  const selecionarFase = (numeroFase) => {
    const fase = FASES.find(f => f.numero === numeroFase);
    if (!fase) return;

    const faseDisponivel = fasesDisponiveis.find(f => f.numero === numeroFase);
    if (!faseDisponivel || !faseDisponivel.desbloqueada) {
      Alert.alert('Fase bloqueada', 'Complete a fase anterior para desbloquear esta fase!');
      return;
    }

    setFaseAtual(fase);
    startGame(fase);
  };

  const startGame = (fase) => {
    const newQuestions = generateQuestions(fase);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAnswersHistory([]);
    setQuestionStartTime(Date.now());
    setProximaFaseDesbloqueada(false);
    setGameState('playing');
  };

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null || showFeedback) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    const tempoGastoSegundos = Math.round((Date.now() - questionStartTime) / 1000);

    setSelectedAnswer(answer);
    setShowFeedback(true);

    if (isCorrect) {
      setScore(score + faseAtual.pontosPorAcerto);
      setCorrectAnswers(correctAnswers + 1);
    }

    const answerData = {
      pergunta: currentQuestion.question,
      resposta_usuario: answer,
      resposta_correta: currentQuestion.correctAnswer,
      esta_correto: isCorrect,
      tempo_gasto: tempoGastoSegundos
    };

    setAnswersHistory(prev => [...prev, answerData]);

    setTimeout(() => {
      if (currentQuestionIndex < faseAtual.perguntas - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setQuestionStartTime(Date.now());
      } else {
        finishGame(isCorrect, answerData);
      }
    }, 1500);
  };

  const finishGame = async (lastCorrect, lastAnswer) => {
    const finalScore = lastCorrect ? score + faseAtual.pontosPorAcerto : score;
    const finalCorrectAnswers = lastCorrect ? correctAnswers + 1 : correctAnswers;
    const allAnswers = [...answersHistory, lastAnswer];

    // 1. Salva no histórico de jogos
    const resultJogo = await JogosDatabase.saveCompletedGame(
      TIPO_JOGO,
      userName,
      finalScore,
      faseAtual.perguntas,
      finalCorrectAnswers,
      allAnswers,
      faseAtual.numero
    );

    if (resultJogo.success) {
      console.log('✅ Jogo de soma salvo com sucesso!');
    } else {
      console.error('❌ Erro ao salvar jogo:', resultJogo.error);
    }

    // 2. Atualiza progresso da fase
    const resultProgresso = await ProgressoFasesDatabase.saveProgressoFase(
      TIPO_JOGO,
      faseAtual.numero,
      finalScore,
      faseAtual.perguntas,
      finalCorrectAnswers
    );

    if (resultProgresso.success && resultProgresso.isNovoRecorde) {
      console.log('🎉 Novo recorde na fase!');
    }

    // 3. Desbloqueia próxima fase
    const resultDesbloqueio = await ProgressoFasesDatabase.desbloquearProximaFase(
      TIPO_JOGO,
      faseAtual.numero
    );

    if (resultDesbloqueio.success && resultDesbloqueio.faseDesbloqueada) {
      setProximaFaseDesbloqueada(true);
      console.log(`🔓 Fase ${resultDesbloqueio.numeroFase} desbloqueada!`);
    }

    // 4. Recarrega progresso
    await loadProgressoFases();

    setGameState('result');
  };

  const viewHistory = () => {
    setGameState('history');
  };

  const goBackToMenu = () => {
    setGameState('menu');
  };

  const goToSelectPhase = () => {
    loadProgressoFases();
    setGameState('selectPhase');
  };

  const goBackToGames = () => {
    router.back();
  };

  const playAgain = () => {
    if (faseAtual) {
      startGame(faseAtual);
    } else {
      goToSelectPhase();
    }
  };

  // Tela de histórico
  if (gameState === 'history') {
    return (
      <SafeAreaView style={styles.container}>
        <HistoricoPartidas onGoBack={goBackToMenu} tipoJogo={TIPO_JOGO} />
      </SafeAreaView>
    );
  }

  // Tela de resultado
  if (gameState === 'result') {
    return (
      <SafeAreaView style={styles.container}>
        <ResultadoJogo
          score={score}
          totalQuestions={faseAtual.perguntas}
          correctAnswers={correctAnswers}
          onPlayAgain={playAgain}
          onViewHistory={viewHistory}
          onGoBack={goToSelectPhase}
          proximaFaseDesbloqueada={proximaFaseDesbloqueada}
        />
      </SafeAreaView>
    );
  }

  // Tela de seleção de fases
  if (gameState === 'selectPhase') {
    return (
      <SafeAreaView style={styles.container}>
        <SeletorFases
          fases={fasesDisponiveis}
          onSelecionarFase={selecionarFase}
          onVoltar={goBackToMenu}
        />
      </SafeAreaView>
    );
  }

  // Tela de jogo
  if (gameState === 'playing') {
    const currentQuestion = questions[currentQuestionIndex];

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
              onPress={() => handleAnswer(answer)}
              disabled={showFeedback}
              isCorrect={showFeedback && answer === currentQuestion.correctAnswer}
              isWrong={showFeedback && answer !== currentQuestion.correctAnswer}
              isSelected={answer === selectedAnswer}
            />
          ))}
        </View>

        {showFeedback && (
          <View style={styles.feedbackContainer}>
            <Text style={[
              styles.feedbackText,
              selectedAnswer === currentQuestion.correctAnswer ? styles.feedbackCorrect : styles.feedbackWrong
            ]}>
              {selectedAnswer === currentQuestion.correctAnswer ? '✓ Correto!' : '✗ Errado!'}
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // Menu principal
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuContainer}>
        <Text style={styles.title}>🧮 Jogo de Soma</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Como jogar:</Text>
          <Text style={styles.infoText}>• 5 fases progressivas de soma</Text>
          <Text style={styles.infoText}>• Desbloqueie fases completando a anterior</Text>
          <Text style={styles.infoText}>• Melhore sua pontuação rejogando</Text>
          <Text style={styles.infoText}>• Apenas somas, números positivos</Text>
        </View>

        <BotaoResposta
          text="⭐ Jogar"
          onPress={goToSelectPhase}
        />

        <View style={styles.menuSpacing} />

        <BotaoResposta
          text="📊 Ver Histórico"
          onPress={viewHistory}
        />

        <View style={styles.menuSpacing} />

        <BotaoResposta
          text="← Voltar"
          onPress={goBackToGames}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0F2FE',
    flex: 1,
  },
  menuContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0EA5E9',
    textAlign: 'center',
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#0EA5E9',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0EA5E9',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  menuSpacing: {
    height: 10,
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
