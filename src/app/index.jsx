import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { Botao } from "../components/geral/Botao";
import { MensagemTelaInicial } from "../components/geral/MensagemTelaInicial";
import { StorageService } from "../services/storage";



export default function Index() {
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkFirstTime();
  }, []);

  const checkFirstTime = async () => {
    const firstTime = await StorageService.isFirstTime();
    setIsFirstTime(firstTime);
    setLoading(false);
  };

  const handleComecar = async () => {
    if (isFirstTime) {
      if (!nome.trim() || !idade.trim()) {
        Alert.alert('Atenção', 'Por favor, preencha seu nome e idade');
        return;
      }

      const ageNumber = parseInt(idade);
      if (isNaN(ageNumber) || ageNumber <= 5 || ageNumber > 10) {
        Alert.alert('Atenção', 'Por favor, digite uma idade válida entre 6 e 10 anos');
        return;
      }

      const result = await StorageService.saveUserData(nome, ageNumber);
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Erro', 'Não foi possível salvar seus dados');
      }
    } else {
      // Não atualiza o último acesso aqui, pois o _layout.jsx já faz isso
      router.replace('/(tabs)');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (

    



    <View style={styles.container}>
      <Image source={require('../assets/images/calculia/logo.png')} style={styles.logo} />

      <MensagemTelaInicial />

      <Image source={require('../assets/images/calculia/avatar-robo.png')} style={styles.logo} />

      {isFirstTime && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            placeholderTextColor="#666"
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            style={styles.input}
            placeholder="Digite sua idade"
            placeholderTextColor="#666"
            value={idade}
            onChangeText={setIdade}
            keyboardType="numeric"
          />
        </View>
      )}

      <Botao title="Começar" onPress={handleComecar} />


    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0F2FE',
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
  formContainer: {
    width: '80%',
    marginVertical: 20,
    gap: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#137fec',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  loadingText: {
    fontSize: 18,
    color: '#137fec',
    fontWeight: 'bold',
  },
});
