import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StorageService } from '../services/storage';

export default function RootLayout() {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    const firstTime = await StorageService.isFirstTime();

    // Debug - mostra dados do storage ANTES de atualizar o último acesso
    await StorageService.debugStorage();

    if (!firstTime) {
      // Atualiza o último acesso DEPOIS de mostrar os dados
      await StorageService.updateLastAccess();
    }

    setIsChecking(false);
  };

  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E0F2FE' }}>
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
