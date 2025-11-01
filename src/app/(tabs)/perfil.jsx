import { router, useFocusEffect } from 'expo-router';
import * as Updates from 'expo-updates';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  useFocusEffect(
    useCallback(() => {
      // Reseta a autenticação quando volta para a tela
      setIsAuthenticated(false);
    }, [])
  );

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    loadUserData();
  };

  const loadUserData = async () => {
    const data = await StorageService.getUserData();
    const access = await StorageService.getLastAccess();
    setUserData(data);
    setLastAccess(access);
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
      'Isso vai apagar:\n• Dados do perfil (AsyncStorage)\n• Histórico de jogos (SQLite)\n• Progresso das fases (SQLite)\n• Conquistas (SQLite)\n\nO app será reiniciado. Tem certeza?',
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
                // Reinicia o app
                await Updates.reloadAsync();
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

  if (!isAuthenticated) {
    return <TelaAutenticacao onAuthenticated={handleAuthenticated} senhaCorreta="123" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
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

        <TouchableOpacity style={styles.button} onPress={handleVisualizarDados}>
          <Text style={styles.buttonText}>📊 Visualizar Dados no Log</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonEdit]} onPress={handleEditarDados}>
          <Text style={styles.buttonText}>✏️ Editar Dados</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonDelete]} onPress={handleExcluirDados}>
          <Text style={styles.buttonText}>🗑️ Excluir TODOS os Dados</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonReload]} onPress={handleReiniciarApp}>
          <Text style={styles.buttonText}>🔄 Reiniciar App</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonDebug]} onPress={handleDebugDatabase}>
          <Text style={styles.buttonText}>🔧 Debug - Banco de Dados</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0F2FE',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#137fec',
    marginBottom: 30,
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
