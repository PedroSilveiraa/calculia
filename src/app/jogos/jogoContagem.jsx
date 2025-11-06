import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';
import { Alert, BackHandler, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { BotaoResposta } from '../../components/jogos/BotaoResposta';
import { HistoricoPartidas } from '../../components/jogos/HistoricoPartidas';
import { ResultadoJogo } from '../../components/jogos/ResultadoJogo';
import { SeletorFases } from '../../components/jogos/SeletorFases';
import { TelaJogoContagem } from '../../components/jogos/TelaJogoContagem';
import { ModalFeedback } from '../../components/geral/ModalFeedback';
import { JogosDatabase } from '../../services/jogosDatabase';
import { ProgressoFasesDatabase } from '../../services/progressoFasesDatabase';
import { StorageService } from '../../services/storage';
import { ConquistasDatabase } from '../../services/conquistasDatabase';
import { FASES_CONTAGEM, TIPO_JOGO_CONTAGEM } from '../../config/fasesContagem';
import { useSound } from '../../hooks/useSound';

// Emojis disponíveis para os objetos
const EMOJIS = ['🍎', '🚗', '⭐', '⚽', '🎈', '🌻', '🐱', '🍕', '🎮', '🌈', '🦋', '🌙', '🎨', '🍓', '🐶'];

const FASES = FASES_CONTAGEM;
const TIPO_JOGO = TIPO_JOGO_CONTAGEM;

export default function jogoContagem() {
    const { playJogar } = useSound();
    const [gameState, setGameState] = useState('menu');
    const [faseAtual, setFaseAtual] = useState(null);
    const [fasesDisponiveis, setFasesDisponiveis] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [objetos, setObjetos] = useState([]);
    const [contagemAtual, setContagemAtual] = useState(0);
    const [respostaSelecionada, setRespostaSelecionada] = useState(null);
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

    // Gera uma pergunta baseada na configuração da fase
    const generateQuestionForPhase = (fase, usedEmojis) => {
        const { min, max } = fase;
        const quantidade = Math.floor(Math.random() * (max - min + 1)) + min;

        const availableEmojis = EMOJIS.filter(e => !usedEmojis.includes(e));
        const emoji = availableEmojis[Math.floor(Math.random() * availableEmojis.length)];

        const objetosArray = Array.from({ length: quantidade }, (_, i) => ({
            id: i,
            emoji: emoji,
            isContado: false,
            numero: null,
        }));

        // Gera alternativas: correta ± variações
        const alternativas = new Set([quantidade]);
        const maxAlternativas = Math.min(4, max - min + 1); // Máximo de alternativas possíveis no intervalo
        let tentativas = 0;
        const maxTentativas = 50; // Evita loop infinito

        while (alternativas.size < maxAlternativas && tentativas < maxTentativas) {
            tentativas++;
            const offset = Math.floor(Math.random() * 5) - 2;
            const alt = quantidade + offset;
            if (alt >= min && alt <= max) {
                alternativas.add(alt);
            }
        }

        // Se ainda não tiver alternativas suficientes, adiciona números aleatórios válidos
        while (alternativas.size < maxAlternativas) {
            const alt = Math.floor(Math.random() * (max - min + 1)) + min;
            alternativas.add(alt);
        }

        return {
            quantidade,
            emoji,
            objetos: objetosArray,
            alternativas: Array.from(alternativas).sort((a, b) => a - b),
        };
    };

    const generateQuestions = (fase) => {
        const newQuestions = [];
        const usedEmojis = [];

        for (let i = 0; i < fase.perguntas; i++) {
            const question = generateQuestionForPhase(fase, usedEmojis);
            usedEmojis.push(question.emoji);
            newQuestions.push(question);
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
        setShowFeedback(false);
        setAnswersHistory([]);
        setObjetos(newQuestions[0].objetos);
        setContagemAtual(0);
        setRespostaSelecionada(null);
        setQuestionStartTime(Date.now());
        setGameStartTime(Date.now());
        setProximaFaseDesbloqueada(false);
        setGameState('playing');
    };

    const handleObjetoPress = useCallback((objetoId) => {
        if (showFeedback) return;

        setObjetos(prevObjetos => {
            const objeto = prevObjetos.find(obj => obj.id === objetoId);

            if (objeto.isContado) {
                setContagemAtual(prev => prev - 1);
                return prevObjetos.map(obj => {
                    if (obj.id === objetoId) {
                        return { ...obj, isContado: false, numero: null };
                    }
                    if (obj.isContado && obj.numero > objeto.numero) {
                        return { ...obj, numero: obj.numero - 1 };
                    }
                    return obj;
                });
            } else {
                setContagemAtual(prev => {
                    const novoNumero = prev + 1;
                    return novoNumero;
                });
                return prevObjetos.map(obj =>
                    obj.id === objetoId
                        ? { ...obj, isContado: true, numero: contagemAtual + 1 }
                        : obj
                );
            }
        });
    }, [showFeedback, contagemAtual]);

    const handleResposta = (resposta) => {
        if (showFeedback || respostaSelecionada !== null) return;

        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = resposta === currentQuestion.quantidade;
        const tempoGastoSegundos = Math.round((Date.now() - questionStartTime) / 1000);

        setRespostaSelecionada(resposta);
        setShowFeedback(true);

        if (isCorrect) {
            setScore(score + faseAtual.pontosPorAcerto);
            setCorrectAnswers(correctAnswers + 1);
        }

        const answerData = {
            pergunta: `Contar ${currentQuestion.emoji}`,
            resposta_usuario: resposta.toString(),
            resposta_correta: currentQuestion.quantidade.toString(),
            esta_correto: isCorrect,
            tempo_gasto: tempoGastoSegundos
        };

        setAnswersHistory(prev => [...prev, answerData]);
    };

    const handleNextQuestionContagem = () => {
        if (currentQuestionIndex < faseAtual.perguntas - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            setObjetos(questions[nextIndex].objetos);
            setContagemAtual(0);
            setRespostaSelecionada(null);
            setShowFeedback(false);
            setQuestionStartTime(Date.now());
        } else {
            finishGame();
        }
    };

    const finishGame = async () => {
        // score e correctAnswers já foram atualizados no handleResposta
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
            console.log('✅ Jogo de contagem salvo com sucesso!');
        }

        // 2. Atualiza progresso da fase
        await ProgressoFasesDatabase.saveProgressoFase(
            TIPO_JOGO,
            faseAtual.numero,
            finalScore,
            faseAtual.perguntas,
            finalCorrectAnswers
        );

        // 3. Desbloqueia próxima fase
        const resultDesbloqueio = await ProgressoFasesDatabase.desbloquearProximaFase(
            TIPO_JOGO,
            faseAtual.numero
        );

        if (resultDesbloqueio.success && resultDesbloqueio.faseDesbloqueada) {
            setProximaFaseDesbloqueada(true);
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

    const goToSelectPhase = async () => {
        await loadProgressoFases();
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
                <TelaJogoContagem
                    faseAtual={faseAtual}
                    score={score}
                    correctAnswers={correctAnswers}
                    currentQuestion={questions[currentQuestionIndex]}
                    currentQuestionIndex={currentQuestionIndex}
                    objetos={objetos}
                    onObjetoPress={handleObjetoPress}
                    onResposta={handleResposta}
                    respostaSelecionada={respostaSelecionada}
                    showFeedback={showFeedback}
                    onExit={handleExitGame}
                />
                <ModalFeedback
                    visible={showFeedback}
                    isCorrect={respostaSelecionada === questions[currentQuestionIndex]?.quantidade}
                    onNext={handleNextQuestionContagem}
                />
            </>
        );
    }

    // Menu principal
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.menuContainer}>
                <Text style={styles.title}>🔢 Jogo de Contagem</Text>

                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Como jogar:</Text>
                    <Text style={styles.infoText}>• 5 fases progressivas de contagem</Text>
                    <Text style={styles.infoText}>• Toque nos objetos para contá-los</Text>
                    <Text style={styles.infoText}>• Números aparecem na ordem que clica</Text>
                    <Text style={styles.infoText}>• Desbloqueie fases completando anteriores</Text>
                    <Text style={styles.infoText}>• Melhore sua pontuação rejogando</Text>
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
        color: '#10B981',
        textAlign: 'center',
        marginBottom: 30,
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 30,
        borderWidth: 2,
        borderColor: '#10B981',
    },
    infoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#10B981',
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
