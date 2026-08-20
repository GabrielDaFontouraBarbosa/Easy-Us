/**
 * Conteúdo de demonstração. Não existe backend neste app — tudo aqui é estático
 * e serve pra dar forma real às telas (nomes, textos e números plausíveis fazem
 * uma UI parecer produto; "Lorem ipsum" faz parecer wireframe).
 */

import { Palette } from '@/constants/theme';

export type Circulo = {
  id: string;
  nome: string;
  tema: string;
  emoji: string;
  membros: number;
  online: number;
  cor: string;
  ultimaMensagem: string;
  quando: string;
  ativo: boolean;
};

export const CIRCULOS: Circulo[] = [
  {
    id: 'respirar',
    nome: 'Respirar Junto',
    tema: 'Ansiedade',
    emoji: '🌬️',
    membros: 128,
    online: 9,
    cor: Palette.moss,
    ultimaMensagem: 'Hoje foi difícil, mas eu consegui sair da cama.',
    quando: 'agora',
    ativo: true,
  },
  {
    id: 'madrugada',
    nome: 'Clube da Madrugada',
    tema: 'Insônia',
    emoji: '🌙',
    membros: 74,
    online: 4,
    cor: Palette.rose,
    ultimaMensagem: 'Alguém acordado? Só queria companhia.',
    quando: '12 min',
    ativo: true,
  },
  {
    id: 'primeiros-passos',
    nome: 'Primeiros Passos',
    tema: 'Recomeços',
    emoji: '🌱',
    membros: 212,
    online: 17,
    cor: Palette.moss,
    ultimaMensagem: 'Comecei a terapia essa semana. Tô orgulhosa de mim.',
    quando: '1 h',
    ativo: true,
  },
  {
    id: 'luto',
    nome: 'Colo pro Luto',
    tema: 'Perdas',
    emoji: '🕯️',
    membros: 56,
    online: 2,
    cor: Palette.rose,
    ultimaMensagem: 'Faz um ano hoje. Obrigada por estarem aqui.',
    quando: '3 h',
    ativo: false,
  },
  {
    id: 'estudos',
    nome: 'Sobrevivendo à Facul',
    tema: 'Estudos',
    emoji: '📚',
    membros: 341,
    online: 23,
    cor: Palette.ember,
    ultimaMensagem: 'Reprovei e o mundo não acabou. Passa.',
    quando: '5 h',
    ativo: true,
  },
];

export type Mensagem = {
  id: string;
  autor: string;
  texto: string;
  hora: string;
  euMesmo?: boolean;
  cor?: string;
  reacoes?: { emoji: string; total: number }[];
};

export const CONVERSA: Mensagem[] = [
  {
    id: '1',
    autor: 'Mariana',
    texto: 'Boa noite, gente. Hoje o dia pesou mais que o normal.',
    hora: '21:04',
    cor: Palette.ember,
    reacoes: [{ emoji: '🫂', total: 4 }],
  },
  {
    id: '2',
    autor: 'Téo',
    texto: 'Tô aqui. Quer contar o que aconteceu ou prefere só companhia?',
    hora: '21:06',
    cor: Palette.moss,
  },
  {
    id: '3',
    autor: 'Mariana',
    texto: 'Só companhia por enquanto, acho.',
    hora: '21:07',
    cor: Palette.ember,
  },
  {
    id: '4',
    autor: 'Você',
    texto: 'Então a gente fica. Sem pressa nenhuma.',
    hora: '21:09',
    euMesmo: true,
    reacoes: [
      { emoji: '❤️', total: 6 },
      { emoji: '🌻', total: 2 },
    ],
  },
  {
    id: '5',
    autor: 'Júlia',
    texto: 'Cheguei agora. Também tive um dia desses. Não tá sozinha, Mari.',
    hora: '21:12',
    cor: Palette.moss,
  },
];

export type Tema = { id: string; titulo: string; emoji: string; total: number; cor: string };

export const TEMAS: Tema[] = [
  { id: 'ansiedade', titulo: 'Ansiedade', emoji: '🌊', total: 14, cor: Palette.moss },
  { id: 'solidao', titulo: 'Solidão', emoji: '🪟', total: 9, cor: Palette.ember },
  { id: 'trabalho', titulo: 'Trabalho', emoji: '💼', total: 11, cor: Palette.ember },
  { id: 'familia', titulo: 'Família', emoji: '🏠', total: 8, cor: Palette.moss },
  { id: 'autoestima', titulo: 'Autoestima', emoji: '🪞', total: 12, cor: Palette.ember },
  { id: 'sono', titulo: 'Sono', emoji: '🌙', total: 6, cor: Palette.moss },
];

export const HUMORES = [
  { id: 'otimo', emoji: '🌻', rotulo: 'Leve' },
  { id: 'bem', emoji: '🙂', rotulo: 'Bem' },
  { id: 'assim', emoji: '😐', rotulo: 'Assim' },
  { id: 'baixo', emoji: '🌧️', rotulo: 'Baixo' },
  { id: 'dificil', emoji: '🫥', rotulo: 'Difícil' },
] as const;

export const CONQUISTAS = [
  { id: 'presenca', emoji: '🕯️', titulo: '7 dias seguidos', descricao: 'Você apareceu toda noite.' },
  { id: 'escuta', emoji: '👂', titulo: 'Bom ouvinte', descricao: '30 conversas acolhidas.' },
  { id: 'coragem', emoji: '🌱', titulo: 'Primeiro desabafo', descricao: 'O passo mais difícil.' },
  { id: 'ponte', emoji: '🌉', titulo: 'Ponte', descricao: 'Você acolheu alguém novo.' },
];

export const PASSOS_ONBOARDING = [
  {
    emoji: '🫂',
    titulo: 'Você não está sozinho',
    texto: 'Aqui tem gente real disposta a ouvir — sem julgamento, sem pressa, sem conselho que ninguém pediu.',
  },
  {
    emoji: '👥',
    titulo: 'Encontre seu círculo',
    texto: 'Grupos pequenos, por tema, com gente passando pelo que você passa. Entre e saia quando quiser.',
  },
  {
    emoji: '🕯️',
    titulo: 'No seu tempo',
    texto: 'Fale quando der vontade, fique quieto quando precisar. Só estar presente já conta.',
  },
];
