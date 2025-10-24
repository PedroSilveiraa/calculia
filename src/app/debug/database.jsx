import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../database/initializeDatabase';
import { JogosDatabase } from '../../services/jogosDatabase';
import { ProgressoFasesDatabase } from '../../services/progressoFasesDatabase';

export default function DatabaseDebug() {
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [sqlQuery, setSqlQuery] = useState('SELECT * FROM sessoes_jogo LIMIT 10');
    const [queryResult, setQueryResult] = useState(null);

    useFocusEffect(
        useCallback(() => {
            loadAllSessions();
        }, [])
    );

    const loadAllSessions = async () => {
        try {
            const result = await db.getAllAsync('SELECT * FROM sessoes_jogo ORDER BY hora_inicio DESC');
            setSessions(result);
        } catch (error) {
            Alert.alert('Erro', error.message);
        }
    };

    const loadSessionAnswers = async (sessionId) => {
        try {
            const result = await db.getAllAsync('SELECT * FROM respostas_jogo WHERE sessao_id = ?', [sessionId]);
            setAnswers(result);
            setSelectedSession(sessionId);
        } catch (error) {
            Alert.alert('Erro', error.message);
        }
    };

    const executeQuery = async () => {
        try {
            const result = await db.getAllAsync(sqlQuery);
            setQueryResult(JSON.stringify(result, null, 2));
            Alert.alert('Sucesso', `${result.length} registros retornados`);
        } catch (error) {
            Alert.alert('Erro', error.message);
            setQueryResult(`Erro: ${error.message}`);
        }
    };

    const deleteSession = (sessionId) => {
        Alert.alert(
            'Confirmar Exclusão',
            'Tem certeza que deseja excluir esta sessão?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await db.runAsync('DELETE FROM respostas_jogo WHERE sessao_id = ?', [sessionId]);
                            await db.runAsync('DELETE FROM sessoes_jogo WHERE id = ?', [sessionId]);
                            Alert.alert('Sucesso', 'Sessão excluída');
                            loadAllSessions();
                            if (selectedSession === sessionId) {
                                setSelectedSession(null);
                                setAnswers([]);
                            }
                        } catch (error) {
                            Alert.alert('Erro', error.message);
                        }
                    }
                }
            ]
        );
    };

    const clearAllData = () => {
        Alert.alert(
            'ATENÇÃO',
            'Isso vai apagar TODOS os dados dos jogos. Tem certeza?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Apagar Tudo',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await JogosDatabase.clearHistory();
                        if (result.success) {
                            Alert.alert('Sucesso', 'Todos os dados foram apagados');
                            setSessions([]);
                            setAnswers([]);
                            setSelectedSession(null);
                        } else {
                            Alert.alert('Erro', result.error);
                        }
                    }
                }
            ]
        );
    };

    const resetProgressoFases = () => {
        Alert.alert(
            'Resetar Progresso das Fases',
            'Isso vai resetar TODO o progresso de TODOS os jogos com fases (Soma e Contagem). Tem certeza?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Resetar Tudo',
                    style: 'destructive',
                    onPress: async () => {
                        const resultSoma = await ProgressoFasesDatabase.resetarProgresso('soma');
                        const resultContagem = await ProgressoFasesDatabase.resetarProgresso('contagem');

                        if (resultSoma.success && resultContagem.success) {
                            Alert.alert('Sucesso', 'Progresso de todos os jogos resetado! Apenas as Fases 1 estão desbloqueadas.');
                        } else {
                            Alert.alert('Erro', 'Houve um erro ao resetar o progresso.');
                        }
                    }
                }
            ]
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const exportData = async () => {
        try {
            const allSessoes = await db.getAllAsync('SELECT * FROM sessoes_jogo');
            const allRespostas = await db.getAllAsync('SELECT * FROM respostas_jogo');

            const data = {
                sessoes: allSessoes,
                respostas: allRespostas,
                exportDate: new Date().toISOString()
            };

            console.log('=== DADOS EXPORTADOS ===');
            console.log(JSON.stringify(data, null, 2));
            Alert.alert('Exportado', 'Dados foram exportados para o console. Verifique o terminal.');
        } catch (error) {
            Alert.alert('Erro', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.title}>Debug - Banco de Dados</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Voltar</Text>
                    </TouchableOpacity>
                </View>

                {/* Ações Gerais */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ações Gerais</Text>

                    <TouchableOpacity style={styles.button} onPress={loadAllSessions}>
                        <Text style={styles.buttonText}>🔄 Recarregar Sessões</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.buttonExport]} onPress={exportData}>
                        <Text style={styles.buttonText}>📤 Exportar Dados (Console)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.buttonDanger]} onPress={clearAllData}>
                        <Text style={styles.buttonText}>🗑️ Apagar Todos os Dados</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.buttonWarning]} onPress={resetProgressoFases}>
                        <Text style={styles.buttonText}>🔄 Resetar Progresso das Fases</Text>
                    </TouchableOpacity>
                </View>

                {/* Query SQL Customizada */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Executar SQL</Text>

                    <TextInput
                        style={styles.sqlInput}
                        value={sqlQuery}
                        onChangeText={setSqlQuery}
                        placeholder="Digite sua query SQL"
                        multiline
                        numberOfLines={3}
                    />

                    <TouchableOpacity style={styles.button} onPress={executeQuery}>
                        <Text style={styles.buttonText}>▶️ Executar Query</Text>
                    </TouchableOpacity>

                    {queryResult && (
                        <ScrollView style={styles.queryResult} horizontal>
                            <Text style={styles.queryResultText}>{queryResult}</Text>
                        </ScrollView>
                    )}
                </View>

                {/* Lista de Sessões */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sessões ({sessions.length})</Text>

                    {sessions.map((session) => (
                        <View key={session.id} style={styles.sessionCard}>
                            <View style={styles.sessionHeader}>
                                <Text style={styles.sessionId}>ID: {session.id}</Text>
                                <View style={styles.sessionGameType}>
                                    <Text style={session.tipo_jogo === 'quiz' ? styles.gameTypeQuiz : styles.gameTypeContagem}>
                                        {session.tipo_jogo === 'quiz' ? '📝 Quiz' : '🔢 Contagem'}
                                    </Text>
                                </View>
                                <Text style={styles.sessionName}>{session.nome_usuario}</Text>
                            </View>

                            <Text style={styles.sessionInfo}>
                                Início: {formatDate(session.hora_inicio)}
                            </Text>
                            <Text style={styles.sessionInfo}>
                                Fim: {formatDate(session.hora_fim)}
                            </Text>
                            <Text style={styles.sessionInfo}>
                                Score: {session.pontuacao_total} | Acertos: {session.respostas_corretas}/{session.total_perguntas}
                            </Text>

                            <View style={styles.sessionActions}>
                                <TouchableOpacity
                                    style={styles.smallButton}
                                    onPress={() => loadSessionAnswers(session.id)}
                                >
                                    <Text style={styles.smallButtonText}>Ver Respostas</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.smallButton, styles.smallButtonDanger]}
                                    onPress={() => deleteSession(session.id)}
                                >
                                    <Text style={styles.smallButtonText}>Excluir</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    {sessions.length === 0 && (
                        <Text style={styles.emptyText}>Nenhuma sessão encontrada</Text>
                    )}
                </View>

                {/* Respostas da Sessão Selecionada */}
                {selectedSession && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Respostas da Sessão {selectedSession}</Text>

                        {answers.map((answer) => (
                            <View key={answer.id} style={styles.answerCard}>
                                <Text style={styles.answerQuestion}>
                                    {answer.pergunta} = ?
                                </Text>
                                <View style={styles.answerDetails}>
                                    <Text style={styles.answerInfo}>
                                        Resposta: {answer.resposta_usuario}
                                    </Text>
                                    <Text style={styles.answerInfo}>
                                        Correto: {answer.resposta_correta}
                                    </Text>
                                    <Text style={[
                                        styles.answerStatus,
                                        answer.esta_correto ? styles.answerCorrect : styles.answerWrong
                                    ]}>
                                        {answer.esta_correto ? '✓ CERTO' : '✗ ERRADO'}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0F2FE',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        borderBottomWidth: 2,
        borderBottomColor: '#137fec',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#137fec',
    },
    backButton: {
        backgroundColor: '#137fec',
        padding: 10,
        borderRadius: 8,
    },
    backButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#137fec',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    buttonExport: {
        backgroundColor: '#10B981',
    },
    buttonDanger: {
        backgroundColor: '#EF4444',
    },
    buttonWarning: {
        backgroundColor: '#F59E0B',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sqlInput: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#137fec',
        borderRadius: 10,
        padding: 15,
        fontSize: 14,
        fontFamily: 'monospace',
        marginBottom: 10,
        minHeight: 80,
    },
    queryResult: {
        backgroundColor: '#1e1e1e',
        borderRadius: 10,
        padding: 15,
        marginTop: 10,
        maxHeight: 300,
    },
    queryResultText: {
        color: '#00ff00',
        fontFamily: 'monospace',
        fontSize: 12,
    },
    sessionCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#137fec',
    },
    sessionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        flexWrap: 'wrap',
    },
    sessionId: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
    },
    sessionGameType: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    gameTypeQuiz: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#137fec',
        backgroundColor: '#E0F2FE',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    gameTypeContagem: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#10B981',
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    sessionName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#137fec',
    },
    sessionInfo: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    sessionActions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
    },
    smallButton: {
        backgroundColor: '#137fec',
        padding: 8,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
    },
    smallButtonDanger: {
        backgroundColor: '#EF4444',
    },
    smallButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    answerCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    answerQuestion: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    answerDetails: {
        gap: 5,
    },
    answerInfo: {
        fontSize: 14,
        color: '#666',
    },
    answerStatus: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    answerCorrect: {
        color: '#10B981',
    },
    answerWrong: {
        color: '#EF4444',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
});
