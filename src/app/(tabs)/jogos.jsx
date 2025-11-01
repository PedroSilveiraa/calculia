import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const jogosDisponiveis = [
  {
    id: 'soma',
    titulo: 'Jogo de Soma',
    emoji: '➕',
    descricao: 'Pratique adições e melhore sua velocidade de cálculo',
    cor: '#10B981',
    rota: '/jogos/jogoSoma',
  },
  {
    id: 'contagem',
    titulo: 'Jogo de Contagem',
    emoji: '🔢',
    descricao: 'Conte objetos e desenvolva suas habilidades numéricas',
    cor: '#3B82F6',
    rota: '/jogos/jogoContagem',
  },
  {
    id: 'comparacao',
    titulo: 'Jogo de Comparação',
    emoji: '⚖️',
    descricao: 'Compare números e objetos para descobrir qual é maior ou menor',
    cor: '#F59E0B',
    rota: '/jogos/jogoComparacao',
  },
];

export default function jogos() {
  const navegarParaJogo = (rota) => {
    router.navigate(rota);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.titulo}>🎮 Jogos</Text>
          <Text style={styles.subtitulo}>
            Escolha um jogo para praticar e se divertir!
          </Text>
        </View>

        <View style={styles.jogosGrid}>
          {jogosDisponiveis.map((jogo) => (
            <TouchableOpacity
              key={jogo.id}
              style={[styles.jogoCard, { borderLeftColor: jogo.cor }]}
              onPress={() => navegarParaJogo(jogo.rota)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.jogoEmoji}>{jogo.emoji}</Text>
                <View style={[styles.badge, { backgroundColor: jogo.cor }]}>
                  <Text style={styles.badgeText}>Jogar</Text>
                </View>
              </View>
              <Text style={styles.jogoTitulo}>{jogo.titulo}</Text>
              <Text style={styles.jogoDescricao}>{jogo.descricao}</Text>
            </TouchableOpacity>
          ))}
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  jogosGrid: {
    gap: 16,
  },
  jogoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jogoEmoji: {
    fontSize: 40,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  jogoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  jogoDescricao: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  }
});
