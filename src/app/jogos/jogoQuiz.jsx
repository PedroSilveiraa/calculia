import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { BotaoResposta } from '../../components/jogos/BotaoResposta';
import { CardPergunta } from '../../components/jogos/CardPergunta';
import { HistoricoPartidas } from '../../components/jogos/HistoricoPartidas';
import { ResultadoJogo } from '../../components/jogos/ResultadoJogo';
import { JogosDatabase } from '../../services/jogosDatabase';
import { StorageService } from '../../services/storage';

const TOTAL_QUESTIONS = 5;
const POINTS_PER_CORRECT = 10;

export default function jogoQuiz() {
    const [gameState, setGameState] = useState('menu');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [userName, setUserName] = useState('Jogador');
    const [showFeedback, setShowFeedback] = useState(false);
    const [answersHistory, setAnswersHistory] = useState([]); // Armazena todas as respostas temporariamente
    const [questionStartTime, setQuestionStartTime] = useState(null); // Tempo de início da pergunta

    useFocusEffect(
        useCallback(() => {
            loadUserName();
        }, [])
    );

    const loadUserName = async () => {
        const userData = await StorageService.getUserData();
        if (userData && userData.name) {
            setUserName(userData.name);
        }
    };

    const generateQuestion = () => {
        const operations = ['+', '-'];
        const operation = operations[Math.floor(Math.random() * operations.length)];

        let num1, num2, correctAnswer;

        if (operation === '+') {
            num1 = Math.floor(Math.random() * 21);
            num2 = Math.floor(Math.random() * 21);
            correctAnswer = num1 + num2;
        } else {
            num1 = Math.floor(Math.random() * 21);
            num2 = Math.floor(Math.random() * (num1 + 1));
            correctAnswer = num1 - num2;
        }

        const question = `${num1} ${operation} ${num2}`;

        const wrongAnswers = [];
        while (wrongAnswers.length < 3) {
            const offset = Math.floor(Math.random() * 10) - 5;
            const wrongAnswer = correctAnswer + (offset === 0 ? (Math.random() > 0.5 ? 1 : -1) : offset);

            if (wrongAnswer !== correctAnswer && !wrongAnswers.includes(wrongAnswer) && wrongAnswer >= 0) {
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

    const generateQuestions = () => {
        const newQuestions = [];
        for (let i = 0; i < TOTAL_QUESTIONS; i++) {
            newQuestions.push(generateQuestion());
        }
        return newQuestions;
    };

    const startGame = () => {
        const newQuestions = generateQuestions();
        setQuestions(newQuestions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setCorrectAnswers(0);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setAnswersHistory([]); // Limpa o histórico de respostas
        setQuestionStartTime(Date.now()); // Inicia o contador de tempo
        setGameState('playing');
    };

    const handleAnswer = (answer) => {
        if (selectedAnswer !== null || showFeedback) return;

        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = answer === currentQuestion.correctAnswer;

        // Calcula o tempo gasto em segundos
        const tempoGastoSegundos = Math.round((Date.now() - questionStartTime) / 1000);

        setSelectedAnswer(answer);
        setShowFeedback(true);

        if (isCorrect) {
            setScore(score + POINTS_PER_CORRECT);
            setCorrectAnswers(correctAnswers + 1);
        }

        // Armazena a resposta no histórico temporário
        const answerData = {
            pergunta: currentQuestion.question,
            resposta_usuario: answer,
            resposta_correta: currentQuestion.correctAnswer,
            esta_correto: isCorrect,
            tempo_gasto: tempoGastoSegundos
        };

        setAnswersHistory(prev => [...prev, answerData]);

        setTimeout(() => {
            if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedAnswer(null);
                setShowFeedback(false);
                setQuestionStartTime(Date.now()); // Reinicia o contador para a próxima pergunta
            } else {
                finishGame(isCorrect, answerData);
            }
        }, 1500);
    };

    const finishGame = async (lastCorrect, lastAnswer) => {
        const finalScore = lastCorrect ? score + POINTS_PER_CORRECT : score;
        const finalCorrectAnswers = lastCorrect ? correctAnswers + 1 : correctAnswers;

        // Monta o array completo de respostas incluindo a última
        const allAnswers = [...answersHistory, lastAnswer];

        // Salva tudo de uma vez no banco
        const result = await JogosDatabase.saveCompletedGame(
            'quiz',
            userName,
            finalScore,
            TOTAL_QUESTIONS,
            finalCorrectAnswers,
            allAnswers
        );

        if (result.success) {
            console.log('✅ Quiz salvo com sucesso!');
        } else {
            console.error('❌ Erro ao salvar quiz:', result.error);
            Alert.alert('Aviso', 'Jogo concluído mas não foi possível salvar no histórico');
        }

        setGameState('result');
    };

    const viewHistory = () => {
        setGameState('history');
    };

    const goBackToMenu = () => {
        setGameState('menu');
    };

    const goBackToGames = () => {
        router.back();
    };

    if (gameState === 'history') {
        return (
            <SafeAreaView style={styles.container}>
                <HistoricoPartidas onGoBack={goBackToMenu} tipoJogo="quiz" />
            </SafeAreaView>
        );
    }

    if (gameState === 'result') {
        return (
            <SafeAreaView style={styles.container}>
                <ResultadoJogo
                    score={score}
                    totalQuestions={TOTAL_QUESTIONS}
                    correctAnswers={correctAnswers}
                    onPlayAgain={startGame}
                    onViewHistory={viewHistory}
                    onGoBack={goBackToGames}
                />
            </SafeAreaView>
        );
    }

    if (gameState === 'playing') {
        const currentQuestion = questions[currentQuestionIndex];

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreLabel}>Pontuação</Text>
                        <Text style={styles.scoreValue}>{score}</Text>
                    </View>

                    <View style={styles.correctContainer}>
                        <Text style={styles.correctLabel}>Acertos</Text>
                        <Text style={styles.correctValue}>{correctAnswers}</Text>
                    </View>
                </View>

                <CardPergunta
                    question={currentQuestion.question}
                    currentQuestion={currentQuestionIndex + 1}
                    totalQuestions={TOTAL_QUESTIONS}
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.menuContainer}>
                <Text style={styles.title}>Quiz de Matemática</Text>

                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Como jogar:</Text>
                    <Text style={styles.infoText}>• {TOTAL_QUESTIONS} perguntas de matemática</Text>
                    <Text style={styles.infoText}>• Soma e subtração</Text>
                    <Text style={styles.infoText}>• {POINTS_PER_CORRECT} pontos por acerto</Text>
                    <Text style={styles.infoText}>• Escolha a resposta correta</Text>
                </View>

                <BotaoResposta
                    text="Começar a Jogar"
                    onPress={startGame}
                />

                <View style={styles.menuSpacing} />

                <BotaoResposta
                    text="Ver Histórico"
                    onPress={viewHistory}
                />

                <View style={styles.menuSpacing} />

                <BotaoResposta
                    text="Voltar"
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
        color: '#137fec',
        textAlign: 'center',
        marginBottom: 30,
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 30,
        borderWidth: 2,
        borderColor: '#137fec',
    },
    infoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#137fec',
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
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: 'white',
        borderBottomWidth: 2,
        borderBottomColor: '#137fec',
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
        color: '#137fec',
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
