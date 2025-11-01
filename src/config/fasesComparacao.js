// Configuração das 5 fases do jogo de comparação
export const FASES_COMPARACAO = [
  {
    numero: 1,
    titulo: 'Primeiros Números',
    descricao: 'Compare números de 1 a 5',
    minNumero: 1,
    maxNumero: 5,
    tiposPermitidos: ['numero_maior', 'numero_menor'],
    perguntas: 5,
    pontosPorAcerto: 10
  },
  {
    numero: 2,
    titulo: 'Subindo o Nível',
    descricao: 'Compare números de 1 a 10',
    minNumero: 1,
    maxNumero: 10,
    tiposPermitidos: ['numero_maior', 'numero_menor'],
    perguntas: 6,
    pontosPorAcerto: 15
  },
  {
    numero: 3,
    titulo: 'Números e Objetos',
    descricao: 'Compare números e quantidades até 10',
    minNumero: 1,
    maxNumero: 10,
    tiposPermitidos: ['numero_maior', 'numero_menor', 'objeto_mais', 'objeto_menos'],
    perguntas: 8,
    pontosPorAcerto: 20
  },
  {
    numero: 4,
    titulo: 'Contando Objetos',
    descricao: 'Compare números e quantidades até 15',
    minNumero: 5,
    maxNumero: 15,
    tiposPermitidos: ['numero_maior', 'numero_menor', 'objeto_mais', 'objeto_menos'],
    perguntas: 8,
    pontosPorAcerto: 25
  },
  {
    numero: 5,
    titulo: 'Mestre dos Objetos',
    descricao: 'Compare somente quantidades de objetos',
    minNumero: 5,
    maxNumero: 20,
    tiposPermitidos: ['objeto_mais', 'objeto_menos'],
    perguntas: 10,
    pontosPorAcerto: 30
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
