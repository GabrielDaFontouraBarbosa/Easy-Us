/**
 * Kit de UI do Easy Us, alinhado à referência de design.
 *
 * Estes componentes são compartilhados por todas as telas, então é aqui que a
 * linguagem visual se impõe: superfície plana tingida com borda de 1px (nada de
 * vidro fosco nem degradê — a referência não usa nenhum dos dois), raio 20 nos
 * cartões e 11 nos botões, rótulos em mono caixa-alta.
 */

import { type PropsWithChildren, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconeSeta, IconeSino, Marca } from '@/components/ui/icones';
import { Entrada, Pressavel } from '@/components/ui/motion';
import {
  Fonts,
  MaxContentWidth,
  Radius,
  Spacing,
  Tracking,
  type ThemeColor,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// ---------------------------------------------------------------------------

/** Casca de tela: fundo, respiro lateral de 22px e coluna centralizada. */
export function Tela({
  children,
  semTabBar = false,
}: PropsWithChildren<{ semTabBar?: boolean }>) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollConteudo,
        {
          paddingTop: insets.top + Spacing.four,
          paddingBottom: insets.bottom + (semTabBar ? Spacing.five : 120),
        },
      ]}>
      <View style={styles.coluna}>{children}</View>
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------

/**
 * Barra de topo com a marca e o sino. Repetida em todas as telas de aba, então
 * mora aqui — a marca é o anel-dentro-de-anel e o nome vai em mono minúsculo,
 * com bastante entreletra.
 */
export function CabecalhoMarca({ onSino }: { onSino?: () => void }) {
  const theme = useTheme();

  return (
    <View style={styles.topo}>
      <View style={styles.marca}>
        <Marca corExterna={theme.primary} corInterna={theme.textSecondary} />
        <ThemedText style={styles.marcaTexto}>easy us</ThemedText>
      </View>

      <Pressavel
        onPress={onSino}
        accessibilityLabel="Notificações"
        style={[styles.sino, { borderColor: theme.border }]}>
        <IconeSino cor={theme.textSecondary} />
      </Pressavel>
    </View>
  );
}

// ---------------------------------------------------------------------------

/**
 * Cartão. `tom` tinge a superfície com um dos três acentos — e a borda vem
 * junto, porque no escuro é a borda, não a sombra, que separa as camadas.
 */
export function Cartao({
  children,
  style,
  tom = 'neutro',
}: PropsWithChildren<{ style?: ViewStyle | ViewStyle[]; tom?: 'neutro' | 'marca' | 'calma' | 'afeto' }>) {
  const theme = useTheme();

  const cores =
    tom === 'marca'
      ? { fundo: theme.primarySoft, borda: theme.borderPrimary }
      : tom === 'calma'
        ? { fundo: theme.calmSoft, borda: theme.borderCalm }
        : tom === 'afeto'
          ? { fundo: theme.accentSoft, borda: theme.borderAccent }
          : { fundo: theme.card, borda: theme.border };

  return (
    <View style={[styles.cartao, { backgroundColor: cores.fundo, borderColor: cores.borda }, style]}>
      {children}
    </View>
  );
}

// ---------------------------------------------------------------------------

export function Avatar({
  nome,
  tamanho = 36,
  cor,
  online = false,
}: {
  nome: string;
  tamanho?: number;
  cor?: string;
  online?: boolean;
}) {
  const theme = useTheme();
  const ponto = Math.max(8, tamanho * 0.26);

  return (
    <View>
      <View
        style={[
          styles.avatar,
          { width: tamanho, height: tamanho, borderRadius: tamanho / 2, backgroundColor: cor ?? theme.accent },
        ]}>
        <ThemedText style={[styles.avatarInicial, { fontSize: tamanho * 0.38, color: theme.background }]}>
          {nome.trim().charAt(0).toUpperCase()}
        </ThemedText>
      </View>
      {online && (
        <View
          style={[
            styles.pontoOnline,
            {
              width: ponto,
              height: ponto,
              borderRadius: ponto / 2,
              backgroundColor: theme.calm,
              borderColor: theme.background,
            },
          ]}
        />
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------

/** Etiqueta em mono caixa-alta — o rótulo pequeno da referência. */
export function Pill({
  children,
  tom = 'neutro',
}: PropsWithChildren<{ tom?: 'neutro' | 'marca' | 'calma' | 'afeto' }>) {
  const theme = useTheme();

  const cores =
    tom === 'marca'
      ? { fundo: theme.primarySoft, texto: theme.primaryText, borda: theme.borderPrimary }
      : tom === 'calma'
        ? { fundo: theme.calmSoft, texto: theme.calmText, borda: theme.borderCalm }
        : tom === 'afeto'
          ? { fundo: theme.accentSoft, texto: theme.accentText, borda: theme.borderAccent }
          : { fundo: theme.backgroundElement, texto: theme.textSecondary, borda: theme.border };

  return (
    <View style={[styles.pill, { backgroundColor: cores.fundo, borderColor: cores.borda }]}>
      <ThemedText type="contagem" style={{ color: cores.texto }}>
        {children}
      </ThemedText>
    </View>
  );
}

// ---------------------------------------------------------------------------

export function TituloSecao({
  children,
  acao,
  indice = 0,
}: PropsWithChildren<{ acao?: ReactNode; indice?: number }>) {
  return (
    <Entrada indice={indice}>
      <View style={styles.tituloSecao}>
        <ThemedText type="rotulo">{children}</ThemedText>
        {acao}
      </View>
    </Entrada>
  );
}

// ---------------------------------------------------------------------------

/**
 * Botão. O da referência é retangular de canto suave (raio 11), não pílula, e
 * o texto vai em Karla 700 sobre `tinta` — um marrom escuro, não preto.
 */
export function Botao({
  children,
  onPress,
  tom = 'marca',
  comSeta = false,
  largura = 'auto',
}: PropsWithChildren<{
  onPress?: () => void;
  tom?: 'marca' | 'calma' | 'fantasma';
  comSeta?: boolean;
  largura?: 'auto' | 'cheia';
}>) {
  const theme = useTheme();
  const fantasma = tom === 'fantasma';
  const fundo = fantasma ? 'transparent' : tom === 'marca' ? theme.primary : theme.calm;
  const corTexto = fantasma ? theme.text : theme.onPrimary;

  return (
    <Pressavel
      onPress={onPress}
      accessibilityRole="button"
      style={[
        styles.botao,
        { backgroundColor: fundo },
        fantasma && { borderWidth: 1, borderColor: theme.borderStrong },
        largura === 'cheia' && styles.botaoCheio,
      ]}>
      <ThemedText type="forte" style={{ color: corTexto }}>
        {children}
      </ThemedText>
      {comSeta && <IconeSeta cor={corTexto} />}
    </Pressavel>
  );
}

// ---------------------------------------------------------------------------

/** Barra de progresso fina. Sempre em moss: progresso é acolhimento. */
export function Progresso({ valor }: { valor: number }) {
  const theme = useTheme();
  const pct = Math.max(0, Math.min(1, valor)) * 100;
  return (
    <View style={[styles.trilho, { backgroundColor: theme.surfaceSunken }]}>
      <View style={[styles.preenchimento, { width: `${pct}%`, backgroundColor: theme.calm }]} />
    </View>
  );
}

// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollConteudo: { flexDirection: 'row', justifyContent: 'center' },
  coluna: {
    flexGrow: 1,
    flexShrink: 1,
    maxWidth: MaxContentWidth,
    paddingHorizontal: 22,
    gap: Spacing.four,
  },

  topo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  marca: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  marcaTexto: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: Tracking.monoLargo,
    textTransform: 'lowercase',
  },
  sino: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cartao: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: 20,
    gap: Spacing.three,
  },

  avatar: { alignItems: 'center', justifyContent: 'center' },
  avatarInicial: { fontFamily: Fonts.sansForte },
  pontoOnline: { position: 'absolute', right: -1, bottom: -1, borderWidth: 2 },

  pill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  tituloSecao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },

  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.sm,
  },
  botaoCheio: { width: '100%' },

  trilho: { height: 6, borderRadius: Radius.pill, overflow: 'hidden' },
  preenchimento: { height: '100%', borderRadius: Radius.pill },
});
