// Configuração das 5 fases do jogo de comparação
// Total de pontos possíveis: 500 pontos (5 perguntas por fase)
export const FASES_COMPARACAO = [
  {
    numero: 1, //id da fase
    titulo: 'Primeiros Números', //título da fase
    descricao: 'Compare números de 1 a 5', //descrição da fase
    minNumero: 1, //número mínimo usado nas perguntas
    maxNumero: 5, //número máximo usado nas perguntas
    tiposPermitidos: ['numero_maior', 'numero_menor'], //tipos de comparação permitidos
    perguntas: 5, //número de perguntas
    pontosPorAcerto: 10  // total: 50 pontos
  },
  {
    numero: 2,
    titulo: 'Subindo o Nível',
    descricao: 'Compare números de 1 a 10',
    minNumero: 1,
    maxNumero: 10,
    tiposPermitidos: ['numero_maior', 'numero_menor'],
    perguntas: 5,
    pontosPorAcerto: 15  // 75 pontos
  },
  {
    numero: 3,
    titulo: 'Números e Objetos',
    descricao: 'Compare números e quantidades até 10',
    minNumero: 1,
    maxNumero: 10,
    tiposPermitidos: ['numero_maior', 'numero_menor', 'objeto_mais', 'objeto_menos'],
    perguntas: 5,
    pontosPorAcerto: 20  // 100 pontos
  },
  {
    numero: 4,
    titulo: 'Contando Objetos',
    descricao: 'Compare números e quantidades até 15',
    minNumero: 5,
    maxNumero: 15,
    tiposPermitidos: ['numero_maior', 'numero_menor', 'objeto_mais', 'objeto_menos'],
    perguntas: 5,
    pontosPorAcerto: 25  // 125 pontos
  },
  {
    numero: 5,
    titulo: 'Mestre dos Objetos',
    descricao: 'Compare somente quantidades de objetos',
    minNumero: 5,
    maxNumero: 20,
    tiposPermitidos: ['objeto_mais', 'objeto_menos'],
    perguntas: 5,
    pontosPorAcerto: 30  // 150 pontos
  }
];

export const TIPO_JOGO_COMPARACAO = 'comparacao';

// Emojis para as questões de objetos
export const EMOJIS_COMPARACAO = [
  { emoji: '🍎', nome: 'maçã' },
  { emoji: '⚽', nome: 'bola' },
  { emoji: '⭐', nome: 'estrela' },
  { emoji: '🌻', nome: 'flor' },
  { emoji: '🚗', nome: 'carro' },
  { emoji: '🎈', nome: 'balão' },
  { emoji: '🍕', nome: 'pizza' },
  { emoji: '🐱', nome: 'gato' },
  { emoji: '🎮', nome: 'controle' },
  { emoji: '🌈', nome: 'arco-íris' },
  { emoji: '🦋', nome: 'borboleta' },
  { emoji: '🌙', nome: 'lua' },
  { emoji: '🎨', nome: 'paleta' },
  { emoji: '🍓', nome: 'morango' },
  { emoji: '🐶', nome: 'cachorro' }
];
