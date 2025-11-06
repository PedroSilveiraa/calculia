import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';
import { Alert, BackHandler, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { BotaoResposta } from '../../components/jogos/BotaoResposta';
import { HistoricoPartidas } from '../../components/jogos/HistoricoPartidas';
import { ResultadoJogo } from '../../components/jogos/ResultadoJogo';
import { SeletorFases } from '../../components/jogos/SeletorFases';
import { TelaJogoSoma } from '../../components/jogos/TelaJogoSoma';
import { ModalFeedback } from '../../components/geral/ModalFeedback';
import { JogosDatabase } from '../../services/jogosDatabase';
import { ProgressoFasesDatabase } from '../../services/progressoFasesDatabase';
import { StorageService } from '../../services/storage';
import { ConquistasDatabase } from '../../services/conquistasDatabase';
import { FASES_SOMA, TIPO_JOGO_SOMA } from '../../config/fasesSoma';
import { useSound } from '../../hooks/useSound';

const FASES = FASES_SOMA;
const TIPO_JOGO = TIPO_JOGO_SOMA;

export default function jogoSoma() {
  const { playJogar } = useSound();
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
  const [gameStartTime, setGameStartTime] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadUserName();
      loadProgressoFases();
    }, [])
  );

  // Handler para botão voltar do Android/iOS
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (gameState === 'playing') {
        handleExitGame();
        return true; // Previne comportamento padrão
      }
      return false; // Permite comportamento padrão
    });

    return () => backHandler.remove();
  }, [gameState]);

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
        // Primeiro número: de 1 até (max - número de termos restantes)
        // Garante que sobra espaço para os outros números (mínimo 1 cada)
        const maxPrimeiroNumero = max - (termos - 1);
        num = Math.floor(Math.random() * maxPrimeiroNumero) + 1;
      } else {
        // Próximos números devem garantir que a soma não ultrapasse max
        const restante = max - soma;
        // Calcula quantos termos ainda faltam após este
        const termosRestantes = termos - i - 1;
        // Garante que sobra pelo menos 1 para cada termo restante
        const maxNumero = restante - termosRestantes;

        if (maxNumero >= 1) {
          num = Math.floor(Math.random() * maxNumero) + 1;
        } else {
          // Se não há espaço suficiente, usa 1
          num = 1;
        }
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
    const questionsSet = new Set(); // Para rastrear perguntas já geradas

    let tentativas = 0;
    const maxTentativas = fase.perguntas * 10; // Limite de segurança

    while (newQuestions.length < fase.perguntas && tentativas < maxTentativas) {
      const question = generateQuestionForPhase(fase);

      // Verifica se a pergunta já existe (usando a string da pergunta como chave)
      if (!questionsSet.has(question.question)) {
        questionsSet.add(question.question);
        newQuestions.push(question);
      }

      tentativas++;
    }

    // Se não conseguiu gerar perguntas suficientes únicas, completa com perguntas normais
    while (newQuestions.length < fase.perguntas) {
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

    playJogar(); // Toca som ao selecionar fase
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
    setGameStartTime(Date.now());
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
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < faseAtual.perguntas - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setQuestionStartTime(Date.now());
    } else {
      finishGame();
    }
  };

  const finishGame = async () => {
    // score e correctAnswers já foram atualizados no handleAnswer
    // Garante que não ultrapassa os limites
    const maxScore = faseAtual.perguntas * faseAtual.pontosPorAcerto;
    const finalScore = Math.min(score, maxScore);
    const finalCorrectAnswers = Math.min(correctAnswers, faseAtual.perguntas);
    const allAnswers = answersHistory.slice(0, faseAtual.perguntas); // Garante apenas 5 respostas
    const tempoTotal = Math.round((Date.now() - gameStartTime) / 1000);

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

    // 4. Verifica conquistas
    const resultConquistas = await ConquistasDatabase.verificarConquistas(
      TIPO_JOGO,
      faseAtual.numero,
      finalScore,
      faseAtual.perguntas,
      finalCorrectAnswers,
      tempoTotal
    );

    if (resultConquistas.success && resultConquistas.conquistasDesbloqueadas.length > 0) {
      console.log(`🏆 ${resultConquistas.conquistasDesbloqueadas.length} conquista(s) desbloqueada(s)!`);
    }

    // 5. Recarrega progresso
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

  const handleExitGame = () => {
    Alert.alert(
      'Sair do Jogo?',
      'Você perderá todo o progresso desta partida. Tem certeza?',
      [
        { text: 'Continuar Jogando', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            setGameState('selectPhase');
          }
        }
      ]
    );
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
    return (
      <>
        <TelaJogoSoma
          faseAtual={faseAtual}
          score={score}
          correctAnswers={correctAnswers}
          currentQuestion={questions[currentQuestionIndex]}
          currentQuestionIndex={currentQuestionIndex}
          onAnswer={handleAnswer}
          showFeedback={showFeedback}
          selectedAnswer={selectedAnswer}
          onExit={handleExitGame}
        />
        <ModalFeedback
          visible={showFeedback}
          isCorrect={selectedAnswer === questions[currentQuestionIndex]?.correctAnswer}
          onNext={handleNextQuestion}
        />
      </>
    );
  }

  // Menu principal
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuContainer}>
        <Text style={styles.title}>➕ Jogo de Soma</Text>

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
});
