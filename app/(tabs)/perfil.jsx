import { router, useFocusEffect } from 'expo-router';
import * as Updates from 'expo-updates';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../../services/storage';

export default function perfil() {
  const [userData, setUserData] = useState(null);
  const [lastAccess, setLastAccess] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useFocusEffect(
    useCallback(() => {
      // Reseta a autenticação quando volta para a tela
      setIsAuthenticated(false);
      setPassword('');
    }, [])
  );

  const checkPassword = () => {
    if (password === '123') {
      setIsAuthenticated(true);
      loadUserData();
    } else {
      Alert.alert('Senha Incorreta', 'A senha está incorreta. Tente novamente.');
      setPassword('');
    }
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
      'Excluir Dados',
      'Tem certeza que deseja excluir todos os seus dados? O app será reiniciado.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const result = await StorageService.clearAll();
            if (result.success) {
              // Reinicia o app
              await Updates.reloadAsync();
            } else {
              Alert.alert('Erro', 'Não foi possível excluir os dados');
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

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}> Acesso Restrito</Text>
          <Text style={styles.subtitle}>Digite a senha para acessar o perfil</Text>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Digite a senha"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              keyboardType="numeric"
              maxLength={3}
            />

            <TouchableOpacity style={styles.buttonUnlock} onPress={checkPassword}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.buttonUnlock, styles.buttonCancel]} onPress={() => router.back()}>
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
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
          <Text style={styles.buttonText}>🗑️ Excluir Dados</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonReload]} onPress={handleReiniciarApp}>
          <Text style={styles.buttonText}>🔄 Reiniciar App</Text>
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#137fec',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  passwordContainer: {
    width: '100%',
    maxWidth: 300,
  },
  passwordInput: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#137fec',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonUnlock: {
    backgroundColor: '#137fec',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#94A3B8',
  },
});
