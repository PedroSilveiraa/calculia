import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { ConquistasDatabase } from '../../../services/conquistasDatabase';

export const Conquistas = () => {
  const [conquistas, setConquistas] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadConquistas();
    }, [])
  );

  const loadConquistas = async () => {
    setLoading(true);
    const { conquistas } = await ConquistasDatabase.getTodasConquistas();
    const { stats } = await ConquistasDatabase.getEstatisticas();

    setConquistas(conquistas);
    setStats(stats);
    setLoading(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getCategoriaTexto = (categoria) => {
    const categorias = {
      geral: 'Geral',
      soma: 'Soma',
      contagem: 'Contagem',
    };
    return categorias[categoria] || categoria;
  };

  const renderItem = ({ item }) => {
    const isDesbloqueada = item.desbloqueada === 1;

    return (
      <View style={[styles.conquistaItem, !isDesbloqueada && styles.conquistaBloqueada]}>
        <View style={styles.conquistaIconContainer}>
          <Text style={[styles.conquistaIcon, !isDesbloqueada && styles.iconBloqueado]}>
            {isDesbloqueada ? item.icone : '🔒'}
          </Text>
        </View>

        <View style={styles.conquistaInfo}>
          <Text style={[styles.conquistaTitulo, !isDesbloqueada && styles.textoBloqueado]}>
            {item.titulo}
          </Text>
          <Text style={[styles.conquistaDescricao, !isDesbloqueada && styles.textoBloqueado]}>
            {item.descricao}
          </Text>
          <View style={styles.conquistaFooter}>
            <Text style={styles.conquistaCategoria}>{getCategoriaTexto(item.categoria)}</Text>
            {isDesbloqueada && item.data_desbloqueio && (
              <Text style={styles.conquistaData}>{formatDate(item.data_desbloqueio)}</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando conquistas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Conquistas</Text>

      {stats && (
        <View style={styles.statsCard}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${stats.porcentagem}%` }]} />
          </View>
          <Text style={styles.statsText}>
            {stats.desbloqueadas}/{stats.total} conquistas ({stats.porcentagem}%)
          </Text>
        </View>
      )}

      {conquistas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma conquista disponível</Text>
        </View>
      ) : (
        <FlatList
          data={conquistas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#137fec',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#137fec',
  },
  progressBar: {
    height: 20,
    backgroundColor: '#E0F2FE',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#137fec',
    borderRadius: 10,
  },
  statsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#137fec',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  conquistaItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#137fec',
    flexDirection: 'row',
    alignItems: 'center',
  },
  conquistaBloqueada: {
    backgroundColor: '#F5F5F5',
    borderColor: '#D1D5DB',
    opacity: 0.7,
  },
  conquistaIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  conquistaIcon: {
    fontSize: 32,
  },
  iconBloqueado: {
    opacity: 0.5,
  },
  conquistaInfo: {
    flex: 1,
  },
  conquistaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  conquistaDescricao: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  textoBloqueado: {
    color: '#9CA3AF',
  },
  conquistaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conquistaCategoria: {
    fontSize: 12,
    fontWeight: '600',
    color: '#137fec',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  conquistaData: {
    fontSize: 12,
    color: '#999',
  },
  loadingText: {
    fontSize: 18,
    color: '#137fec',
    textAlign: 'center',
    marginTop: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
});
