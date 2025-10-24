import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TelaAutenticacao({ onAuthenticated, senhaCorreta = '123' }) {
  const [password, setPassword] = useState('');

  const checkPassword = () => {
    if (password === senhaCorreta) {
      setPassword('');
      onAuthenticated();
    } else {
      Alert.alert('Senha Incorreta', 'A senha está incorreta. Tente novamente.');
      setPassword('');
    }
  };

  const handleVoltar = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🔒</Text>
        <Text style={styles.title}>Acesso Restrito</Text>
        <Text style={styles.subtitle}>
          Digite a senha para acessar esta área
        </Text>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Digite a senha"
            placeholderTextColor="#94A3B8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            keyboardType="numeric"
            maxLength={3}
            onSubmitEditing={checkPassword}
            returnKeyType="done"
          />

          <TouchableOpacity
            style={styles.buttonUnlock}
            onPress={checkPassword}
            disabled={password.length === 0}
          >
            <Text style={styles.buttonText}>🔓 Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonUnlock, styles.buttonCancel]}
            onPress={handleVoltar}
          >
            <Text style={styles.buttonText}>← Voltar</Text>
          </TouchableOpacity>
        </View>
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
  icon: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0EA5E9',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 40,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  passwordContainer: {
    width: '100%',
    maxWidth: 350,
  },
  passwordInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0EA5E9',
    borderRadius: 12,
    padding: 16,
    fontSize: 20,
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
    letterSpacing: 8,
  },
  buttonUnlock: {
    backgroundColor: '#0EA5E9',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonCancel: {
    backgroundColor: '#64748B',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
