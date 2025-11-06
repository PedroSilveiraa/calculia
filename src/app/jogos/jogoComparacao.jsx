import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';
import { Alert, BackHandler, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { BotaoResposta } from '../../components/jogos/BotaoResposta';
import { HistoricoPartidas } from '../../components/jogos/HistoricoPartidas';
import { ResultadoJogo } from '../../components/jogos/ResultadoJogo';
import { SeletorFases } from '../../components/jogos/SeletorFases';
import { TelaJogoComparacao } from '../../components/jogos/TelaJogoComparacao';
import { ModalFeedback } from '../../components/geral/ModalFeedback';
import { JogosDatabase } from '../../services/jogosDatabase';
import { ProgressoFasesDatabase } from '../../services/progressoFasesDatabase';
import { StorageService } from '../../services/storage';
import { ConquistasDatabase } from '../../services/conquistasDatabase';
import { FASES_COMPARACAO, TIPO_JOGO_COMPARACAO, EMOJIS_COMPARACAO } from '../../config/fasesComparacao';
import { useSound } from '../../hooks/useSound';

const FASES = FASES_COMPARACAO;
const TIPO_JOGO = TIPO_JOGO_COMPARACAO;

export default function jogoComparacao() {
  const { playJogar } = useSound();
  const [gameState, setGameState] = useState('menu');
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
        return true;
      }
      return false;
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
    const tiposDisponiveis = fase.tiposPermitidos;
    const tipoEscolhido = tiposDisponiveis[Math.floor(Math.random() * tiposDisponiveis.length)];

    if (tipoEscolhido === 'numero_maior') {
      return generateNumeroMaiorQuestion(fase);
    } else if (tipoEscolhido === 'numero_menor') {
      return generateNumeroMenorQuestion(fase);
    } else if (tipoEscolhido === 'objeto_mais') {
      return generateObjetoMaisQuestion(fase);
    } else {
      return generateObjetoMenosQuestion(fase);
    }
  };

  const generateNumeroMaiorQuestion = (fase) => {
    const num1 = Math.floor(Math.random() * (fase.maxNumero - fase.minNumero + 1)) + fase.minNumero;
    let num2;
    do {
      num2 = Math.floor(Math.random() * (fase.maxNumero - fase.minNumero + 1)) + fase.minNumero;
    } while (num2 === num1);

    const respostaCorreta = num1 > num2 ? num1 : num2;
    const respostaErrada = num1 > num2 ? num2 : num1;

    return {
      tipo: 'numero_maior',
      pergunta: 'Qual número é MAIOR?',
      numero1: num1,
      numero2: num2,
      alternativas: [
        { texto: respostaCorreta.toString(), correta: true, valor: respostaCorreta },
        { texto: respostaErrada.toString(), correta: false, valor: respostaErrada }
      ].sort(() => Math.random() - 0.5)
    };
  };

  const generateNumeroMenorQuestion = (fase) => {
    const num1 = Math.floor(Math.random() * (fase.maxNumero - fase.minNumero + 1)) + fase.minNumero;
    let num2;
    do {
      num2 = Math.floor(Math.random() * (fase.maxNumero - fase.minNumero + 1)) + fase.minNumero;
    } while (num2 === num1);

    const respostaCorreta = num1 < num2 ? num1 : num2;
    const respostaErrada = num1 < num2 ? num2 : num1;

    return {
      tipo: 'numero_menor',
      pergunta: 'Qual número é MENOR?',
      numero1: num1,
      numero2: num2,
      alternativas: [
        { texto: respostaCorreta.toString(), correta: true, valor: respostaCorreta },
        { texto: respostaErrada.toString(), correta: false, valor: respostaErrada }
      ].sort(() => Math.random() - 0.5)
    };
  };

  const generateObjetoMaisQuestion = (fase) => {
    const emoji1 = EMOJIS_COMPARACAO[Math.floor(Math.random() * EMOJIS_COMPARACAO.length)];
    let emoji2;
    do {
      emoji2 = EMOJIS_COMPARACAO[Math.floor(Math.random() * EMOJIS_COMPARACAO.length)];
    } while (emoji2.emoji === emoji1.emoji);

    const qtd1 = Math.floor(Math.random() * (Math.min(10, fase.maxNumero) - fase.minNumero + 1)) + fase.minNumero;
    let qtd2;
    do {
      qtd2 = Math.floor(Math.random() * (Math.min(10, fase.maxNumero) - fase.minNumero + 1)) + fase.minNumero;
    } while (qtd2 === qtd1);

    const maisObjetos = qtd1 > qtd2 ? emoji1.nome : emoji2.nome;
    const menosObjetos = qtd1 > qtd2 ? emoji2.nome : emoji1.nome;

    return {
      tipo: 'objeto_mais',
      pergunta: 'Qual tem MAIS objetos?',
      emoji1: emoji1.emoji,
      emoji2: emoji2.emoji,
      nomeObjeto1: emoji1.nome,
      nomeObjeto2: emoji2.nome,
      quantidade1: qtd1,
      quantidade2: qtd2,
      alternativas: [
        { texto: maisObjetos, correta: true },
        { texto: menosObjetos, correta: false }
      ].sort(() => Math.random() - 0.5)
    };
  };

  const generateObjetoMenosQuestion = (fase) => {
    const emoji1 = EMOJIS_COMPARACAO[Math.floor(Math.random() * EMOJIS_COMPARACAO.length)];
    let emoji2;
    do {
      emoji2 = EMOJIS_COMPARACAO[Math.floor(Math.random() * EMOJIS_COMPARACAO.length)];
    } while (emoji2.emoji === emoji1.emoji);

    const qtd1 = Math.floor(Math.random() * (Math.min(10, fase.maxNumero) - fase.minNumero + 1)) + fase.minNumero;
    let qtd2;
    do {
      qtd2 = Math.floor(Math.random() * (Math.min(10, fase.maxNumero) - fase.minNumero + 1)) + fase.minNumero;
    } while (qtd2 === qtd1);

    const menosObjetos = qtd1 < qtd2 ? emoji1.nome : emoji2.nome;
    const maisObjetos = qtd1 < qtd2 ? emoji2.nome : emoji1.nome;

    return {
      tipo: 'objeto_menos',
      pergunta: 'Qual tem MENOS objetos?',
      emoji1: emoji1.emoji,
      emoji2: emoji2.emoji,
      nomeObjeto1: emoji1.nome,
      nomeObjeto2: emoji2.nome,
      quantidade1: qtd1,
      quantidade2: qtd2,
      alternativas: [
        { texto: menosObjetos, correta: true },
        { texto: maisObjetos, correta: false }
      ].sort(() => Math.random() - 0.5)
    };
  };

  const generateQuestions = (fase) => {
    const newQuestions = [];
    const usedPairs = new Set(); // Track used number pairs
    const maxAttempts = fase.perguntas * 20; // Safety limit
    let attempts = 0;

    while (newQuestions.length < fase.perguntas && attempts < maxAttempts) {
      const question = generateQuestionForPhase(fase);

      // For number questions, check if pair was used
      if (question.tipo === 'numero_maior' || question.tipo === 'numero_menor') {
        const pairKey = [question.numero1, question.numero2].sort().join('-');
        if (!usedPairs.has(pairKey)) {
          usedPairs.add(pairKey);
          newQuestions.push(question);
        }
      } else {
        // For object questions, always add (different emojis guaranteed by generation)
        newQuestions.push(question);
      }

      attempts++;
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
    const isCorrect = answer.correta;
    const tempoGastoSegundos = Math.round((Date.now() - questionStartTime) / 1000);

    setSelectedAnswer(answer);
    setShowFeedback(true);

    if (isCorrect) {
      setScore(score + faseAtual.pontosPorAcerto);
      setCorrectAnswers(correctAnswers + 1);
    }

    const answerData = {
      pergunta: currentQuestion.pergunta,
      resposta_usuario: answer.texto,
      resposta_correta: currentQuestion.alternativas.find(alt => alt.correta).texto,
      esta_correto: isCorrect,
      tempo_gasto: tempoGastoSegundos
    };

    setAnswersHistory(prev => [...prev, answerData]);
  };

  const handleNextQuestionComparacao = () => {
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
      console.log('✅ Jogo de comparação salvo com sucesso!');
    } else {
      console.error('❌ Erro ao salvar jogo:', resultJogo.error);
    }

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

    const resultDesbloqueio = await ProgressoFasesDatabase.desbloquearProximaFase(
      TIPO_JOGO,
      faseAtual.numero
    );

    if (resultDesbloqueio.success && resultDesbloqueio.faseDesbloqueada) {
      setProximaFaseDesbloqueada(true);
      console.log(`🔓 Fase ${resultDesbloqueio.numeroFase} desbloqueada!`);
    }

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

  if (gameState === 'history') {
    return (
      <SafeAreaView style={styles.container}>
        <HistoricoPartidas onGoBack={goBackToMenu} tipoJogo={TIPO_JOGO} />
      </SafeAreaView>
    );
  }

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

  if (gameState === 'playing') {
    return (
      <>
        <TelaJogoComparacao
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
          isCorrect={selectedAnswer?.correta === true}
          onNext={handleNextQuestionComparacao}
        />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuContainer}>
        <Text style={styles.title}>⚖️ Jogo de Comparação</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Como jogar:</Text>
          <Text style={styles.infoText}>• Compare números e descubra qual é maior ou menor</Text>
          <Text style={styles.infoText}>• Compare quantidades de objetos</Text>
          <Text style={styles.infoText}>• 5 fases progressivas de dificuldade</Text>
          <Text style={styles.infoText}>• Desenvolva o raciocínio lógico</Text>
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
    color: '#F59E0B',
    textAlign: 'center',
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F59E0B',
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
