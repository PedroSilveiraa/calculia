import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from 'expo-router';
import { JogosDatabase } from '../../../services/jogosDatabase';

export const HistoricoPartidas = ({ onGoBack, tipoJogo }) => {
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [tipoJogo])
    );

    const loadHistory = async () => {
        setLoading(true);
        const historyResult = await JogosDatabase.getHistory(20, tipoJogo);
        const statsResult = await JogosDatabase.getStats(tipoJogo);

        if (historyResult.success) {
            setHistory(historyResult.sessions);
        }

        if (statsResult.success) {
            setStats(statsResult.stats);
        }

        setLoading(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderItem = ({ item }) => {
        const percentage = Math.round((item.respostas_corretas / item.total_perguntas) * 100);

        return (
            <View style={styles.historyItem}>
                <View style={styles.historyHeader}>
                    <View style={styles.historyHeaderRow}>
                        <Text style={styles.historyName}>{item.nome_usuario}</Text>
                        {item.numero_fase && (
                            <View style={styles.faseBadge}>
                                <Text style={styles.faseText}>Fase {item.numero_fase}</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.historyDate}>{formatDate(item.hora_inicio)}</Text>
                </View>

                <View style={styles.historyStats}>
                    <View style={styles.historyStat}>
                        <Text style={styles.historyStatLabel}>Pontos</Text>
                        <Text style={styles.historyStatValue}>{item.pontuacao_total}</Text>
                    </View>

                    <View style={styles.historyStat}>
                        <Text style={styles.historyStatLabel}>Acertos</Text>
                        <Text style={styles.historyStatValue}>
                            {item.respostas_corretas}/{item.total_perguntas}
                        </Text>
                    </View>

                    <View style={styles.historyStat}>
                        <Text style={styles.historyStatLabel}>%</Text>
                        <Text style={styles.historyStatValue}>{percentage}%</Text>
                    </View>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Carregando histórico...</Text>
                <TouchableOpacity style={styles.buttonBack} onPress={onGoBack}>
                    <Text style={styles.buttonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const getTituloJogo = () => {
        const titulos = {
            'soma': 'Histórico - Jogo de Soma',
            'contagem': 'Histórico - Jogo de Contagem',
            'comparacao': 'Histórico - Jogo de Comparação'
        };
        return titulos[tipoJogo] || 'Histórico de Partidas';
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{getTituloJogo()}</Text>

            {stats && stats.total_jogos > 0 && (
                <View style={styles.statsCard}>
                    <Text style={styles.statsTitle}>Estatísticas Gerais</Text>

                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Total de Jogos</Text>
                            <Text style={styles.statValue}>{stats.total_jogos}</Text>
                        </View>

                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Melhor Pontuação</Text>
                            <Text style={styles.statValue}>{stats.melhor_pontuacao}</Text>
                        </View>

                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Média de Pontos</Text>
                            <Text style={styles.statValue}>{Math.round(stats.pontuacao_media)}</Text>
                        </View>

                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Taxa de Acerto</Text>
                            <Text style={styles.statValue}>
                                {Math.round((stats.total_corretas / stats.total_perguntas) * 100)}%
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            {history.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhuma partida jogada ainda</Text>
                    <Text style={styles.emptySubtext}>Jogue sua primeira partida para ver o histórico</Text>
                </View>
            ) : (
                <FlatList
                    data={history}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            <TouchableOpacity style={styles.buttonBack} onPress={onGoBack}>
                <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#137fec',
        marginBottom: 20,
        textAlign: 'center',
    },
    statsCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#137fec',
    },
    statsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#137fec',
        marginBottom: 15,
        textAlign: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
        width: '45%',
        marginBottom: 15,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
        textAlign: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    listContainer: {
        paddingBottom: 20,
    },
    historyItem: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#E0F2FE',
    },
    historyHeader: {
        marginBottom: 10,
    },
    historyHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    historyName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    faseBadge: {
        backgroundColor: '#0EA5E9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 10,
    },
    faseText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    historyDate: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    historyStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    historyStat: {
        alignItems: 'center',
    },
    historyStatLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    historyStatValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#137fec',
    },
    buttonBack: {
        backgroundColor: '#137fec',
        borderRadius: 16,
        padding: 16,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingText: {
        fontSize: 18,
        color: '#137fec',
        textAlign: 'center',
        marginTop: 50,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 10,
    },
    emptySubtext: {
        fontSize: 16,
        color: '#999',
    },
});
