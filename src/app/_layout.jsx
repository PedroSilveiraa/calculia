// app/_layout.js
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { initializeDatabase } from '../database/initializeDatabase';
import { StorageService } from '../services/storage';

export default function RootLayout() {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    prepararApp();
  }, []);

  const prepararApp = async () => {
    try {
      // 1️⃣ PRIMEIRO: Inicializa o banco de dados
      console.log('🔄 Inicializando banco de dados...');
      await initializeDatabase();
      console.log('✅ Banco pronto!');

      // 2️⃣ DEPOIS: Verifica status do usuário
      const firstTime = await StorageService.isFirstTime();

      // Debug - mostra dados do storage ANTES de atualizar o último acesso
      await StorageService.debugStorage();

      if (!firstTime) {
        // Atualiza o último acesso DEPOIS de mostrar os dados
        await StorageService.updateLastAccess();
      }

      // 3️⃣ Libera o app para uso
      setIsChecking(false);
      
    } catch (error) {
      console.error('❌ Erro ao preparar app:', error);
      // Mesmo com erro, libera o app (você pode mudar isso se quiser)
      setIsChecking(false);
    }
  };

  // Tela de loading enquanto prepara tudo
  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E0F2FE' }}>
        <ActivityIndicator size="large" color="#137fec" />
      </View>
    );
  }

  // Quando tudo estiver pronto, mostra o app
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="jogos" options={{ headerShown: false }} />
    </Stack>
  );
}