import { Stack } from 'expo-router';

export default function JogosLayout() {
  

  

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="jogoQuiz" />
      {/* Adicione outros jogos aqui */}
    </Stack>
  );
}
