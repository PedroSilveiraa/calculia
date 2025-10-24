import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../services/storage';

export default function EditarPerfil() {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentData();
  }, []);

  const loadCurrentData = async () => {
    const userData = await StorageService.getUserData();
    if (userData) {
      setNome(userData.name);
      setIdade(userData.age.toString());
    }
    setLoading(false);
  };

  const handleSalvar = async () => {
    if (!nome.trim() || !idade.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos');
      return;
    }

    const ageNumber = parseInt(idade);
    if (isNaN(ageNumber) || ageNumber <= 0 || ageNumber > 120) {
      Alert.alert('Atenção', 'Por favor, digite uma idade válida');
      return;
    }

    const result = await StorageService.saveUserData(nome, ageNumber);
    if (result.success) {
      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
      router.back();
    } else {
      Alert.alert('Erro', 'Não foi possível atualizar seus dados');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Editar Perfil</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            placeholderTextColor="#666"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Idade</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua idade"
            placeholderTextColor="#666"
            value={idade}
            onChangeText={setIdade}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSalvar}>
          <Text style={styles.buttonText}>💾 Salvar Alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>❌ Cancelar</Text>
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0EA5E9',
    marginBottom: 30,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0EA5E9',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#0EA5E9',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#0EA5E9',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#94A3B8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#0EA5E9',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  },
});
