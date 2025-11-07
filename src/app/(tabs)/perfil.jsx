import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TelaAutenticacao from '../../components/TelaAutenticacao';
import {
  debugDatabase,
  editarDados,
  excluirTodosDados,
  reiniciarApp,
  visualizarDados
} from '../../helpers/perfilHelpers';
import { ConquistasDatabase } from '../../services/conquistasDatabase';
import { StorageService } from '../../services/storage';

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

  const resetarEstado = () => {
    setIsAuthenticated(false);
    setUserData(null);
    setLastAccess(null);
    setConquistas([]);
    setEstatisticas(null);
  };

  const handleVisualizarDados = () => visualizarDados();
  const handleEditarDados = () => editarDados(router);
  const handleExcluirDados = () => excluirTodosDados(resetarEstado);
  const handleReiniciarApp = () => reiniciarApp();
  const handleDebugDatabase = () => debugDatabase(router);

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
          {/* <TouchableOpacity style={styles.button} onPress={handleVisualizarDados}>
            <Text style={styles.buttonText}>Visualizar Dados no Log</Text>
          </TouchableOpacity>*/}

          <TouchableOpacity style={[styles.button, styles.buttonEdit]} onPress={handleEditarDados}>
            <Text style={styles.buttonText}>Editar Dados</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonDelete]} onPress={handleExcluirDados}>
            <Text style={styles.buttonText}>Excluir TODOS os Dados</Text>
          </TouchableOpacity>

          {/*<TouchableOpacity style={[styles.button, styles.buttonReload]} onPress={handleReiniciarApp}>
            <Text style={styles.buttonText}>Reiniciar App</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonDebug]} onPress={handleDebugDatabase}>
            <Text style={styles.buttonText}>Debug - Banco de Dados</Text>
          </TouchableOpacity>*/}
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
