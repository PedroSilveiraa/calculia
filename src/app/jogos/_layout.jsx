import { Stack } from 'expo-router';

export default function JogosLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="jogoContagem" />
      <Stack.Screen name="jogoSoma" />
      <Stack.Screen name="jogoComparacao" />
    </Stack>
  );
}
