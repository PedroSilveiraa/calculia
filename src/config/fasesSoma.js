// Configuração das 5 fases do jogo de soma
export const FASES_SOMA = [
  {
    numero: 1,  //id da fase
    titulo: 'Primeiros Passos', //título da fase
    descricao: 'Soma até 5', //descrição da fase
    max: 5,   //número máximo usado nas perguntas
    termos: 2,  //número de termos a serem somados
    perguntas: 5, //número de perguntas
    pontosPorAcerto: 10 // total: 50 pontos
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
