import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSound } from '../../../hooks/useSound';

export const ResultadoJogo = ({ score, totalQuestions, correctAnswers, onPlayAgain, onViewHistory, onGoBack, proximaFaseDesbloqueada = false }) => {
    const { playGanhou, playPerdeu } = useSound();
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    useEffect(() => {
        // Toca som ao exibir resultado
        if (correctAnswers === 0) {
            playPerdeu(); // Errou todas as questões
        } else {
            playGanhou(); // Acertou pelo menos uma questão
        }
    }, []);

    const getMessage = () => {
        if (percentage >= 90) return "Excelente!";
        if (percentage >= 70) return "Muito bem!";
        if (percentage >= 50) return "Bom trabalho!";
        return "Continue praticando!";
    };

    const getEmoji = () => {
        if (percentage >= 90) return "🌟";
        if (percentage >= 70) return "😊";
        if (percentage >= 50) return "👍";
        return "💪";
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {proximaFaseDesbloqueada && (
                <View style={styles.desbloqueioCard}>
                    <Text style={styles.desbloqueioEmoji}>🎉</Text>
                    <Text style={styles.desbloqueioTexto}>Nova Fase Desbloqueada!</Text>
                </View>
            )}

            <View style={styles.resultCard}>
                <Text style={styles.emoji}>{getEmoji()}</Text>
                <Text style={styles.message}>{getMessage()}</Text>

                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreLabel}>Pontuação</Text>
                    <Text style={styles.scoreValue}>{score}</Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Acertos</Text>
                        <Text style={styles.statValue}>
                            {correctAnswers}/{totalQuestions}
                        </Text>
                    </View>

                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Percentual</Text>
                        <Text style={styles.statValue}>{percentage}%</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={onPlayAgain}>
                <Text style={styles.buttonText}>Jogar Novamente</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={onViewHistory}>
                <Text style={styles.buttonText}>Ver Histórico</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.buttonTertiary]} onPress={onGoBack}>
                <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        justifyContent: 'center',
        flexGrow: 1,
    },
    resultCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
        marginBottom: 30,
        borderWidth: 3,
        borderColor: '#137fec',
        alignItems: 'center',
    },
    emoji: {
        fontSize: 80,
        marginBottom: 20,
    },
    message: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#137fec',
        marginBottom: 30,
        textAlign: 'center',
    },
    scoreContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    scoreLabel: {
        fontSize: 18,
        color: '#666',
        marginBottom: 10,
    },
    scoreValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#137fec',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    button: {
        backgroundColor: '#137fec',
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        alignItems: 'center',
    },
    buttonSecondary: {
        backgroundColor: '#10B981',
    },
    buttonTertiary: {
        backgroundColor: '#94A3B8',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    desbloqueioCard: {
        backgroundColor: '#10B981',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    desbloqueioEmoji: {
        fontSize: 48,
        marginBottom: 10,
    },
    desbloqueioTexto: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
