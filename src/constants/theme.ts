/**
 * Design tokens do Easy Us.
 *
 * A paleta e a tipografia vêm da referência de design (o mockup da tela
 * Descobrir). Duas decisões dela que valem registrar, porque não são óbvias:
 *
 * 1. O TEMA É ESCURO, e o escuro não é preto: é `ash`, um cinza puxado pro
 *    violeta, contra `parchment`, um branco amarelado. Preto sobre branco puro
 *    seria mais duro; num app sobre acolhimento, o contraste máximo é agressivo.
 *
 * 2. AS TRÊS CORES DE ACENTO NÃO SÃO INTERCAMBIÁVEIS. Cada uma tem função:
 *      ember  — ação e marca. Botões, links, aba ativa, o que pede um toque.
 *      moss   — calma e progresso. O que já deu certo, o que acalma.
 *      rose   — afeto e vulnerabilidade. Temas sensíveis, presença de gente.
 *    Cada acento tem um par `-dim`, que é a versão de fundo (superfície tingida)
 *    da mesma cor. Texto colorido usa a cor viva; fundo usa a dim.
 */

import '@/global.css';

// ---------------------------------------------------------------------------
// Escalas cruas — nunca usadas direto numa tela, só através dos tokens abaixo.
// ---------------------------------------------------------------------------

const cru = {
  ash: '#211F26',
  ash2: '#2A2732',
  ash3: '#332F3C',
  parchment: '#F3ECDE',
  parchmentDim: '#CFC6B4',
  ember: '#E58A4F',
  emberDim: '#3A2E24',
  emberBorda: '#4A3627',
  emberTexto: '#F2C79E',
  emberClaro: '#E8B48A',
  moss: '#8FA382',
  mossDim: '#28302A',
  mossBorda: '#3C4A38',
  mossTexto: '#C9D6C0',
  rose: '#D6907F',
  roseDim: '#33241F',
  roseBorda: '#4A3229',
  roseTexto: '#EFC8BC',
  line: '#3A3742',
  tinta: '#3A2410', // texto sobre botão ember
} as const;

export const Palette = cru;

// ---------------------------------------------------------------------------
// Tokens semânticos — é isto que as telas consomem.
// ---------------------------------------------------------------------------

const escuro = {
  // superfícies, do fundo pro topo
  background: cru.ash,
  card: cru.ash2,
  cardElevado: cru.ash3,
  backgroundElement: 'rgba(243,236,222,0.05)',
  backgroundSelected: 'rgba(229,138,79,0.16)',
  surfaceSunken: 'rgba(0,0,0,0.18)',

  // texto
  text: cru.parchment,
  textSecondary: cru.parchmentDim,
  textMuted: 'rgba(207,198,180,0.62)',
  onPrimary: cru.tinta,

  // acentos: ver o cabeçalho deste arquivo antes de trocar um pelo outro
  primary: cru.ember,
  primarySoft: cru.emberDim,
  primaryStrong: cru.emberClaro,
  primaryText: cru.emberTexto,
  accent: cru.rose,
  accentSoft: cru.roseDim,
  accentText: cru.roseTexto,
  calm: cru.moss,
  calmSoft: cru.mossDim,
  calmStrong: cru.moss,
  calmText: cru.mossTexto,

  // estrutura
  border: cru.line,
  borderStrong: 'rgba(243,236,222,0.16)',
  borderPrimary: cru.emberBorda,
  borderCalm: cru.mossBorda,
  borderAccent: cru.roseBorda,
  overlay: 'rgba(0,0,0,0.62)',

  // estado
  success: cru.moss,
  warning: cru.ember,
  danger: cru.rose,
  info: cru.parchmentDim,
} as const;

/**
 * O mockup só definiu o modo escuro, e é ele que o app usa. Manter a mesma
 * forma de objeto pros dois esquemas deixa `useTheme()` intacto e permite
 * escrever um tema claro depois sem tocar em nenhuma tela.
 */
export const Colors = { light: escuro, dark: escuro } as const;

export type ThemeColor = keyof typeof escuro;
export type Theme = typeof escuro;

// ---------------------------------------------------------------------------
// Tipografia
// ---------------------------------------------------------------------------

/**
 * Três famílias, cada uma com um trabalho:
 *   Fraunces  — títulos. Serifada, com itálico usado de propósito nos títulos
 *               de destaque (o mockup usa itálico em "Roda de escuta").
 *   Karla     — corpo e botões.
 *   SpaceMono — sobrancelhas, contagens e rótulos de seção, sempre em caixa
 *               alta com bastante entreletra. É o que dá o ar "editorial".
 */
export const Fonts = {
  display: 'Fraunces_600SemiBold',
  displayMedio: 'Fraunces_500Medium',
  displayItalico: 'Fraunces_500Medium_Italic',
  sans: 'Karla_400Regular',
  sansMedio: 'Karla_500Medium',
  sansForte: 'Karla_700Bold',
  mono: 'SpaceMono_400Regular',
  monoForte: 'SpaceMono_700Bold',
} as const;

/** Entreletra dos rótulos em mono — o detalhe que faz parecer editorial. */
export const Tracking = { mono: 1.4, monoLargo: 1.7 } as const;

// ---------------------------------------------------------------------------
// Espaçamento, raio, sombra, movimento
// ---------------------------------------------------------------------------

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/** Raios da referência: cartões 20, campos 14, botões 11, nav 18. */
export const Radius = {
  sm: 11,
  md: 14,
  lg: 18,
  xl: 20,
  xxl: 36,
  pill: 999,
} as const;

/**
 * No escuro, sombra preta some. O que separa as camadas aqui é a BORDA clara
 * de 1px, não a sombra — por isso a elevação é discreta e sempre acompanhada
 * de `borderColor`.
 */
export const Elevation = {
  baixa: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 2,
  },
  media: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 6,
  },
  alta: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 40 },
    shadowOpacity: 0.55,
    shadowRadius: 80,
    elevation: 12,
  },
} as const;

export const Motion = {
  rapido: 180,
  medio: 320,
  lento: 520,
  /** Ciclo do anel que respira atrás do hero — 4,5s, igual ao mockup. */
  respiro: 4500,
  /** Ciclo do ponto "ao vivo" — 2,2s. */
  pulso: 2200,
  escada: 70,
  mola: { damping: 18, stiffness: 160, mass: 0.9 },
  molaSuave: { damping: 22, stiffness: 110, mass: 1 },
} as const;

export const BottomTabInset = 96;
export const MaxContentWidth = 480;
