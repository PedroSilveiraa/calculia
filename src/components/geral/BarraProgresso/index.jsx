import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export function BarraProgresso({
  progresso = 0,
  titulo = 'Progresso',
  mostrarPorcentagem = true,
  mostrarTextoDetalhes = null,
  corFundo = '#E2E8F0',
  corBarra = '#0EA5E9',
  altura = 24
}) {
  const animacaoLargura = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animacaoLargura, {
      toValue: progresso,
      friction: 8,
      tension: 40,
      useNativeDriver: false
    }).start();
  }, [progresso]);

  const larguraInterpolada = animacaoLargura.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp'
  });

  const corBarraInterpolada = animacaoLargura.interpolate({
    inputRange: [0, 50, 100],
    outputRange: ['#EF4444', '#F59E0B', '#10B981'],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>{titulo}</Text>
        {mostrarPorcentagem && (
          <Text style={styles.porcentagem}>{Math.round(progresso)}%</Text>
        )}
      </View>

      <View style={[styles.barraFundo, { backgroundColor: corFundo, height: altura }]}>
        <Animated.View
          style={[
            styles.barraPreenchida,
            {
              width: larguraInterpolada,
              backgroundColor: progresso === 100 ? '#10B981' : corBarra,
              height: altura
            }
          ]}
        >
          {progresso === 100 && (
            <View style={styles.trofeuContainer}>
              <Text style={styles.trofeu}>🏆</Text>
            </View>
          )}
        </Animated.View>
      </View>

      {mostrarTextoDetalhes && (
        <Text style={styles.detalhes}>{mostrarTextoDetalhes}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  porcentagem: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0EA5E9',
  },
  barraFundo: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  barraPreenchida: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  trofeuContainer: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  trofeu: {
    fontSize: 16,
  },
  detalhes: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
  },
});
