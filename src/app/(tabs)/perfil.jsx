import { router, useFocusEffect } from 'expo-router';
import * as Updates from 'expo-updates';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TelaAutenticacao from '../../components/TelaAutenticacao';
import { StorageService } from '../../services/storage';
import { JogosDatabase } from '../../services/jogosDatabase';
import { ProgressoFasesDatabase } from '../../services/progressoFasesDatabase';
import { ConquistasDatabase } from '../../services/conquistasDatabase';

export default function perfil() {
  const [userData, setUserData] = useState(null);
  const [lastAccess, setLastAccess] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [conquistas, setConquistas] = useState([]);
  const [estatisticas, setEstatisticas] = useState(null);

  useFocusEffect(
    useCallback(() => {
      // Reseta a autenticação quando volta para a tela
      setIsAuthenticated(false);
    }, [])
  );

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    loadUserData();
    loadConquistas();
  };

  const loadUserData = async () => {
    const data = await StorageService.getUserData();
    const access = await StorageService.getLastAccess();
    setUserData(data);
    setLastAccess(access);
  };

  const loadConquistas = async () => {
    const result = await ConquistasDatabase.getTodasConquistas();
    const stats = await ConquistasDatabase.getEstatisticas();

    if (result.success) {
      setConquistas(result.conquistas);
    }

    if (stats.success) {
      setEstatisticas(stats.stats);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleVisualizarDados = async () => {
    await StorageService.debugStorage();
    Alert.alert('Dados no Console', 'Verifique o terminal para ver os dados!');
  };

  const handleEditarDados = () => {
    router.push('/editarPerfil');
  };

  const handleExcluirDados = () => {
    Alert.alert(
      'Excluir TODOS os Dados',
      'Isso vai apagar:\n• Dados do perfil (AsyncStorage)\n• Histórico de jogos (SQLite)\n• Progresso das fases (SQLite)\n• Conquistas (SQLite)\n\nTem certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir Tudo',
          style: 'destructive',
          onPress: async () => {
            try {
              // Limpa AsyncStorage
              const resultStorage = await StorageService.clearAll();

              // Limpa histórico de jogos do SQLite
              const resultJogos = await JogosDatabase.clearHistory();

              // Reseta progresso das fases (todos os jogos)
              const resultSoma = await ProgressoFasesDatabase.resetarProgresso('soma');
              const resultContagem = await ProgressoFasesDatabase.resetarProgresso('contagem');
              const resultComparacao = await ProgressoFasesDatabase.resetarProgresso('comparacao');

              // Reseta conquistas
              const resultConquistas = await ConquistasDatabase.resetarConquistas();

              // Verifica se todas as operações foram bem-sucedidas
              if (resultStorage.success && resultJogos.success && resultSoma.success && resultContagem.success && resultComparacao.success && resultConquistas.success) {
                Alert.alert(
                  'Sucesso',
                  'Todos os dados foram excluídos com sucesso!',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        // Reseta o estado de autenticação para voltar à tela de login
                        setIsAuthenticated(false);
                        setUserData(null);
                        setLastAccess(null);
                        setConquistas([]);
                        setEstatisticas(null);
                      }
                    }
                  ]
                );
              } else {
                Alert.alert('Erro', 'Não foi possível excluir todos os dados. Verifique o console.');
                console.error('Erros na exclusão:', {
                  storage: !resultStorage.success,
                  jogos: !resultJogos.success,
                  soma: !resultSoma.success,
                  contagem: !resultContagem.success,
                  comparacao: !resultComparacao.success,
                  conquistas: !resultConquistas.success
                });
              }
            } catch (error) {
              Alert.alert('Erro', `Erro ao excluir dados: ${error.message}`);
              console.error('Erro na exclusão completa:', error);
            }
          }
        }
      ]
    );
  };

  const handleReiniciarApp = () => {
    Alert.alert(
      'Reiniciar App',
      'Deseja reiniciar o aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reiniciar',
          onPress: async () => {
            await Updates.reloadAsync();
          }
        }
      ]
    );
  };

  const handleDebugDatabase = () => {
    router.push('/debug/database');
  };

  const renderConquista = (conquista) => {
    const isDesbloqueada = conquista.desbloqueada === 1;

    return (
      <View
        key={conquista.id}
        style={[
          styles.conquistaCard,
          isDesbloqueada ? styles.conquistaDesbloqueada : styles.conquistaBloqueada
        ]}
      >
        <Text style={styles.conquistaEmoji}>{conquista.icone}</Text>
        <View style={styles.conquistaInfo}>
          <Text style={[
            styles.conquistaTitulo,
            !isDesbloqueada && styles.conquistaTituloBloqueada
          ]}>
            {conquista.titulo}
          </Text>
          <Text style={[
            styles.conquistaDescricao,
            !isDesbloqueada && styles.conquistaDescricaoBloqueada
          ]}>
            {conquista.descricao}
          </Text>
          {isDesbloqueada && conquista.data_desbloqueio && (
            <Text style={styles.conquistaData}>
              Desbloqueada em: {new Date(conquista.data_desbloqueio).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
            </Text>
          )}
        </View>
        {!isDesbloqueada && (
          <View style={styles.conquistaCadeado}>
            <Text style={styles.cadeadoIcon}>🔒</Text>
          </View>
        )}
      </View>
    );
  };

  if (!isAuthenticated) {
    return <TelaAutenticacao onAuthenticated={handleAuthenticated} senhaCorreta="123" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Meu Perfil</Text>

        {userData && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Nome: {userData.name}</Text>
            <Text style={styles.infoText}>Idade: {userData.age} anos</Text>
            <Text style={styles.infoText}>
              Cadastrado em: {new Date(userData.createdAt).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
            </Text>
            {userData.updatedAt && (
              <Text style={styles.infoText}>
                Perfil atualizado: {formatDateTime(userData.updatedAt)}
              </Text>
            )}
            {lastAccess && (
              <Text style={styles.infoText}>
                Último acesso: {formatDateTime(lastAccess)}
              </Text>
            )}
          </View>
        )}

        {/* Seção de Conquistas */}
        <View style={styles.conquistasSection}>
          <Text style={styles.conquistasTitle}>Conquistas</Text>

          {estatisticas && (
            <View style={styles.estatisticasContainer}>
              <Text style={styles.estatisticasText}>
                {estatisticas.desbloqueadas} de {estatisticas.total} desbloqueadas ({estatisticas.porcentagem}%)
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${estatisticas.porcentagem}%` }]} />
              </View>
            </View>
          )}

          <View style={styles.conquistasList}>
            {conquistas.map(renderConquista)}
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleVisualizarDados}>
            <Text style={styles.buttonText}>Visualizar Dados no Log</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonEdit]} onPress={handleEditarDados}>
            <Text style={styles.buttonText}>Editar Dados</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonDelete]} onPress={handleExcluirDados}>
            <Text style={styles.buttonText}>Excluir TODOS os Dados</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonReload]} onPress={handleReiniciarApp}>
            <Text style={styles.buttonText}>Reiniciar App</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonDebug]} onPress={handleDebugDatabase}>
            <Text style={styles.buttonText}>Debug - Banco de Dados</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0F2FE',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#137fec',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#137fec',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: '500',
  },
  conquistasSection: {
    width: '100%',
    marginBottom: 30,
  },
  conquistasTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#137fec',
    marginBottom: 15,
    textAlign: 'center',
  },
  estatisticasContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#137fec',
  },
  estatisticasText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  progressBar: {
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 10,
  },
  conquistasList: {
    width: '100%',
  },
  conquistaCard: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  conquistaDesbloqueada: {
    backgroundColor: '#fff',
    borderColor: '#10B981',
  },
  conquistaBloqueada: {
    backgroundColor: '#F3F4F6',
    borderColor: '#9CA3AF',
    opacity: 0.7,
  },
  conquistaEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  conquistaInfo: {
    flex: 1,
  },
  conquistaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  conquistaTituloBloqueada: {
    color: '#6B7280',
  },
  conquistaDescricao: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  conquistaDescricaoBloqueada: {
    color: '#9CA3AF',
  },
  conquistaData: {
    fontSize: 12,
    color: '#10B981',
    fontStyle: 'italic',
    marginTop: 4,
  },
  conquistaCadeado: {
    marginLeft: 10,
  },
  cadeadoIcon: {
    fontSize: 24,
  },
  buttonsContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#137fec',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonEdit: {
    backgroundColor: '#10B981',
  },
  buttonDelete: {
    backgroundColor: '#EF4444',
  },
  buttonReload: {
    backgroundColor: '#F59E0B',
  },
  buttonDebug: {
    backgroundColor: '#8B5CF6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
