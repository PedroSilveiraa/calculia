import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { BotaoResposta } from '../../components/jogos/BotaoResposta';
import { BotoesAlternativas } from '../../components/jogos/BotoesAlternativas';
import { HistoricoPartidas } from '../../components/jogos/HistoricoPartidas';
import { PainelObjetos } from '../../components/jogos/PainelObjetos';
import { ResultadoJogo } from '../../components/jogos/ResultadoJogo';
import { SeletorFases } from '../../components/jogos/SeletorFases';
import { JogosDatabase } from '../../services/jogosDatabase';
import { ProgressoFasesDatabase } from '../../services/progressoFasesDatabase';
import { StorageService } from '../../services/storage';

// Emojis disponíveis para os objetos
const EMOJIS = ['🍎', '🚗', '⭐', '⚽', '🎈', '🌻', '🐱', '🍕', '🎮', '🌈', '🦋', '🌙', '🎨', '🍓', '🐶'];

// Configuração das 5 fases
const FASES = [
  {
    numero: 1,
    titulo: 'Primeiras Contagens',
    descricao: 'Conte de 2 a 5 objetos',
    min: 2,
    max: 5,
    perguntas: 5,
    pontosPorAcerto: 10
  },
  {
    numero: 2,
    titulo: 'Avançando',
    descricao: 'Conte de 3 a 7 objetos',
    min: 3,
    max: 7,
    perguntas: 5,
    pontosPorAcerto: 15
  },
  {
    numero: 3,
    titulo: 'Ficando Expert',
    descricao: 'Conte de 5 a 10 objetos',
    min: 5,
    max: 10,
    perguntas: 5,
    pontosPorAcerto: 20
  },
  {
    numero: 4,
    titulo: 'Números Maiores',
    descricao: 'Conte de 8 a 15 objetos',
    min: 8,
    max: 15,
    perguntas: 5,
    pontosPorAcerto: 25
  },
  {
    numero: 5,
    titulo: 'Mestre da Contagem',
    descricao: 'Conte de 10 a 20 objetos',
    min: 10,
    max: 20,
    perguntas: 5,
    pontosPorAcerto: 30
  }
];

const TIPO_JOGO = 'contagem';

export default function jogoContagem() {
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

        setTimeout(() => {
            if (currentQuestionIndex < faseAtual.perguntas - 1) {
                const nextIndex = currentQuestionIndex + 1;
                setCurrentQuestionIndex(nextIndex);
                setObjetos(questions[nextIndex].objetos);
                setContagemAtual(0);
                setRespostaSelecionada(null);
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
                        <Text style={styles.instructionTitle}>Quantos {currentQuestion.emoji} você vê?</Text>
                        <Text style={styles.instructionText}>
                            Toque nos objetos para contá-los!
                        </Text>
                        <PainelObjetos
                            objetos={objetos}
                            onObjetoPress={handleObjetoPress}
                        />
                    </View>

                    <View style={styles.alternativasSection}>
                        <Text style={styles.alternativasTitle}>Escolha a resposta:</Text>
                        <BotoesAlternativas
                            alternativas={currentQuestion.alternativas}
                            onSelect={handleResposta}
                            respostaSelecionada={respostaSelecionada}
                            respostaCorreta={currentQuestion.quantidade}
                            showFeedback={showFeedback}
                        />
                    </View>

                    {showFeedback && (
                        <View style={styles.feedbackContainer}>
                            <Text style={[
                                styles.feedbackText,
                                respostaSelecionada === currentQuestion.quantidade
                                    ? styles.feedbackCorrect
                                    : styles.feedbackWrong
                            ]}>
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
    scrollContent: {
        padding: 20,
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
    header: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#10B981',
        marginBottom: 20,
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
        color: '#10B981',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    scoreContainer: {
        alignItems: 'center',
    },
    scoreLabel: {
        fontSize: 12,
        color: '#666',
    },
    scoreValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#10B981',
    },
    questionNumberContainer: {
        alignItems: 'center',
    },
    questionNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#10B981',
    },
    correctContainer: {
        alignItems: 'center',
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
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#10B981',
    },
    instructionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#10B981',
        textAlign: 'center',
        marginBottom: 10,
    },
    instructionText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 15,
    },
    alternativasSection: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginTop: 10,
        borderWidth: 2,
        borderColor: '#10B981',
    },
    alternativasTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#10B981',
        textAlign: 'center',
        marginBottom: 10,
    },
    feedbackContainer: {
        padding: 20,
        alignItems: 'center',
        marginTop: 10,
    },
    feedbackText: {
        fontSize: 22,
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
