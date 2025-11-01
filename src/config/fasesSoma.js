// Configuração das 5 fases do jogo de soma
export const FASES_SOMA = [
  {
    numero: 1,
    titulo: 'Primeiros Passos',
    descricao: 'Soma até 5',
    max: 5,
    termos: 2,
    perguntas: 5,
    pontosPorAcerto: 10
  },
  {
    numero: 2,
    titulo: 'Subindo de Nível',
    descricao: 'Soma até 9',
    max: 9,
    termos: 2,
    perguntas: 5,
    pontosPorAcerto: 15
  },
  {
    numero: 3,
    titulo: 'Chegando aos 10',
    descricao: 'Soma até 10',
    max: 10,
    termos: 2,
    perguntas: 5,
    pontosPorAcerto: 20
  },
  {
    numero: 4,
    titulo: 'Soma Tripla',
    descricao: 'Soma de 3 números até 10',
    max: 10,
    termos: 3,
    perguntas: 5,
    pontosPorAcerto: 25
  },
  {
    numero: 5,
    titulo: 'Desafio 20',
    descricao: 'Soma até 20',
    max: 20,
    termos: 2,
    perguntas: 5,
    pontosPorAcerto: 30
  }
];

export const TIPO_JOGO_SOMA = 'soma';
