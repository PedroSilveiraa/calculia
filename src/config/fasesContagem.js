// Configuração das 5 fases do jogo de contagem
export const FASES_CONTAGEM = [
  {
    numero: 1,
    titulo: 'Primeiras Contagens',
    descricao: 'Conte de 2 a 5 objetos',
    min: 2,
    max: 5,
    perguntas: 5,
    pontosPorAcerto: 10
  },
  {
    numero: 2,
    titulo: 'Avançando',
    descricao: 'Conte de 3 a 7 objetos',
    min: 3,
    max: 7,
    perguntas: 5,
    pontosPorAcerto: 15
  },
  {
    numero: 3,
    titulo: 'Ficando Expert',
    descricao: 'Conte de 5 a 10 objetos',
    min: 5,
    max: 10,
    perguntas: 5,
    pontosPorAcerto: 20
  },
  {
    numero: 4,
    titulo: 'Números Maiores',
    descricao: 'Conte de 8 a 15 objetos',
    min: 8,
    max: 15,
    perguntas: 5,
    pontosPorAcerto: 25
  },
  {
    numero: 5,
    titulo: 'Mestre da Contagem',
    descricao: 'Conte de 10 a 20 objetos',
    min: 10,
    max: 20,
    perguntas: 5,
    pontosPorAcerto: 30
  },
   {
    numero: 6,
    titulo: 'Teste Final',
    descricao: 'teste',
    min: 15,
    max: 30,
    perguntas: 5,
    pontosPorAcerto: 40
  },
];

export const TIPO_JOGO_CONTAGEM = 'contagem';
