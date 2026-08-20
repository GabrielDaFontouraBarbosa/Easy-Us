import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { IconeBusca, IconeSeta, IconeSino, Marca } from '@/components/ui/icones';
import { Entrada, Pressavel, useReduzMovimento } from '@/components/ui/motion';
import { CIRCULOS, TEMAS } from '@/constants/mock-data';
import { Fonts, MaxContentWidth, Motion, Radius, Spacing, Tracking } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Tamanhos e deslocamentos do cluster de bolhas, tirados um a um da referência.
 *
 * É a assinatura visual do design: círculos de tamanhos diferentes, empurrados
 * verticalmente uns em relação aos outros, formando uma nuvem em vez de uma
 * grade. O tamanho não é decorativo — quanto maior a bolha, mais círculos o
 * tema tem, então a forma já conta a informação antes de a pessoa ler o número.
 */
const BOLHAS: Record<string, { lado: number; deslocamento: number; tom: 'calma' | 'afeto' | 'marca' }> = {
  ansiedade: { lado: 132, deslocamento: 6, tom: 'calma' },
  solidao: { lado: 104, deslocamento: 26, tom: 'afeto' },
  trabalho: { lado: 118, deslocamento: 0, tom: 'marca' },
  familia: { lado: 98, deslocamento: 18, tom: 'afeto' },
  autoestima: { lado: 126, deslocamento: -4, tom: 'marca' },
  sono: { lado: 92, deslocamento: 20, tom: 'calma' },
};

export default function Descobrir() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollConteudo,
        { paddingTop: insets.top + Spacing.four, paddingBottom: insets.bottom + 120 },
      ]}>
      <View style={styles.coluna}>
        {/* ---- barra de topo ---- */}
        <Entrada indice={0}>
          <View style={styles.topo}>
            <View style={styles.marca}>
              <Marca corExterna={theme.primary} corInterna={theme.textSecondary} />
              <ThemedText style={styles.marcaTexto}>easy us</ThemedText>
            </View>

            <Pressavel
              onPress={() => router.push('/configuracoes')}
              accessibilityLabel="Notificações"
              style={[styles.sino, { borderColor: theme.border }]}>
              <IconeSino cor={theme.textSecondary} />
            </Pressavel>
          </View>
        </Entrada>

        {/* ---- cabeçalho ---- */}
        <Entrada indice={1}>
          <ThemedText type="titulo" style={styles.titulo}>
            Descobrir
          </ThemedText>
          <ThemedText type="lede" style={styles.lede}>
            Comece por onde dói, ou por onde dá vontade.
          </ThemedText>
        </Entrada>

        {/* ---- busca ---- */}
        <Entrada indice={2}>
          <View
            style={[
              styles.busca,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            ]}>
            <IconeBusca cor={theme.textSecondary} />
            <TextInput
              placeholder="Buscar um tema ou círculo"
              placeholderTextColor={theme.textSecondary}
              underlineColorAndroid="transparent"
              style={[styles.buscaEntrada, { color: theme.text }]}
            />
          </View>
        </Entrada>

        {/* ---- hero: encontro de hoje ---- */}
        <Entrada indice={3}>
          <HeroEncontro />
        </Entrada>

        {/* ---- por tema ---- */}
        <Entrada indice={4}>
          <ThemedText type="rotulo" style={styles.rotuloSecao}>
            Por tema
          </ThemedText>
        </Entrada>

        <Entrada indice={5}>
          <View style={styles.cluster}>
            {TEMAS.map((tema) => (
              <Bolha key={tema.id} id={tema.id} titulo={tema.titulo} total={tema.total} />
            ))}
          </View>
        </Entrada>

        {/* ---- sugeridos ---- */}
        <Entrada indice={6}>
          <ThemedText type="subtitulo" style={styles.talvez}>
            Talvez pra você
          </ThemedText>
        </Entrada>

        <View style={styles.sugeridos}>
          {CIRCULOS.slice(2, 5).map((circulo, i) => (
            <Entrada key={circulo.id} indice={i + 7}>
              <Pressavel
                onPress={() => router.push(`/conversa/${circulo.id}`)}
                style={[styles.sugerido, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.sugeridoTexto}>
                  <ThemedText type="forte" style={styles.sugeridoNome}>
                    {circulo.nome}
                  </ThemedText>
                  <ThemedText type="nota" numberOfLines={1}>
                    {circulo.membros} membros · {circulo.tema}
                  </ThemedText>
                </View>
                <IconeSeta cor={theme.primary} tamanho={14} espessura={2} />
              </Pressavel>
            </Entrada>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------

function HeroEncontro() {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.hero,
        { backgroundColor: theme.primarySoft, borderColor: theme.borderPrimary },
      ]}>
      <AnelQueRespira />

      <View style={styles.heroSobrancelha}>
        <PontoAoVivo />
        <ThemedText type="rotulo" style={{ color: theme.primaryStrong }}>
          Ao vivo · hoje às 21h
        </ThemedText>
      </View>

      <ThemedText type="destaque" style={styles.heroTitulo}>
        Roda de escuta
      </ThemedText>
      <ThemedText type="corpo" themeColor="textSecondary" style={styles.heroTexto}>
        Sem câmera, sem obrigação de falar. Só estar já vale.
      </ThemedText>

      <View style={styles.heroRodape}>
        <View style={styles.presenca}>
          <View style={styles.avatares}>
            {[theme.calm, theme.accent, theme.primary, theme.textSecondary].map((cor, i) => (
              <View
                key={cor}
                style={[
                  styles.avatar,
                  { backgroundColor: cor, borderColor: theme.card },
                  i > 0 && styles.avatarSobreposto,
                ]}
              />
            ))}
          </View>
          <View>
            <ThemedText type="nota">12 já</ThemedText>
            <ThemedText type="nota" themeColor="text" style={styles.confirmaram}>
              confirmaram
            </ThemedText>
          </View>
        </View>

        <Pressavel style={[styles.cta, { backgroundColor: theme.primary }]}>
          <ThemedText type="forte" style={{ color: theme.onPrimary }}>
            Entrar na roda
          </ThemedText>
          <IconeSeta cor={theme.onPrimary} />
        </Pressavel>
      </View>
    </View>
  );
}

/** Anel que cresce e encolhe no canto do hero — 4,5s, igual à referência. */
function AnelQueRespira() {
  const reduz = useReduzMovimento();
  const fase = useSharedValue(0);

  useEffect(() => {
    if (reduz) {
      fase.value = 0.5;
      return;
    }
    fase.value = withRepeat(
      withSequence(
        withTiming(1, { duration: Motion.respiro / 2 }),
        withTiming(0, { duration: Motion.respiro / 2 })
      ),
      -1,
      false
    );
  }, [reduz, fase]);

  const estilo = useAnimatedStyle(() => ({
    transform: [{ scale: 0.92 + fase.value * 0.13 }],
    opacity: 0.5 + fase.value * 0.4,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.anel, { borderColor: 'rgba(229,138,79,0.35)' }, estilo]}
    />
  );
}

/** Ponto que pisca devagar — o sinal de "está acontecendo agora". */
function PontoAoVivo() {
  const theme = useTheme();
  const reduz = useReduzMovimento();
  const fase = useSharedValue(1);

  useEffect(() => {
    if (reduz) {
      fase.value = 1;
      return;
    }
    fase.value = withRepeat(
      withSequence(
        withTiming(0, { duration: Motion.pulso / 2 }),
        withTiming(1, { duration: Motion.pulso / 2 })
      ),
      -1,
      false
    );
  }, [reduz, fase]);

  const estilo = useAnimatedStyle(() => ({
    opacity: 0.4 + fase.value * 0.6,
    transform: [{ scale: 0.7 + fase.value * 0.3 }],
  }));

  return <Animated.View style={[styles.pontoVivo, { backgroundColor: theme.primary }, estilo]} />;
}

// ---------------------------------------------------------------------------

function Bolha({ id, titulo, total }: { id: string; titulo: string; total: number }) {
  const theme = useTheme();
  const forma = BOLHAS[id] ?? { lado: 110, deslocamento: 8, tom: 'calma' as const };

  const cores =
    forma.tom === 'calma'
      ? { fundo: theme.calmSoft, texto: theme.calmText, borda: theme.borderCalm }
      : forma.tom === 'afeto'
        ? { fundo: theme.accentSoft, texto: theme.accentText, borda: theme.borderAccent }
        : { fundo: theme.primarySoft, texto: theme.primaryText, borda: theme.borderPrimary };

  return (
    <Pressavel
      escala={0.94}
      accessibilityRole="button"
      accessibilityLabel={`${titulo}, ${total} círculos`}
      style={[
        styles.bolha,
        {
          width: forma.lado,
          height: forma.lado,
          borderRadius: forma.lado / 2,
          marginTop: forma.deslocamento,
          backgroundColor: cores.fundo,
          borderColor: cores.borda,
        },
      ]}>
      <ThemedText type="forte" style={[styles.bolhaTitulo, { color: cores.texto }]}>
        {titulo}
      </ThemedText>
      <ThemedText type="contagem" style={[styles.bolhaContagem, { color: cores.texto }]}>
        {total} círculos
      </ThemedText>
    </Pressavel>
  );
}

// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollConteudo: { flexDirection: 'row', justifyContent: 'center' },
  coluna: { flexGrow: 1, flexShrink: 1, maxWidth: MaxContentWidth, paddingHorizontal: 22 },

  topo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
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

  titulo: { marginBottom: Spacing.two },
  lede: { marginBottom: 22, maxWidth: 300 },

  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    marginBottom: 28,
  },
  buscaEntrada: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 13.5,
    paddingVertical: 13,
  },

  hero: {
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: Radius.xl,
    padding: 20,
    marginBottom: 34,
  },
  anel: { position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: 90, borderWidth: 1 },
  heroSobrancelha: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginBottom: 14 },
  pontoVivo: { width: 6, height: 6, borderRadius: 3 },
  heroTitulo: { marginBottom: Spacing.two },
  heroTexto: { marginBottom: 20, maxWidth: 300, lineHeight: 21 },
  heroRodape: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  presenca: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatares: { flexDirection: 'row' },
  avatar: { width: 24, height: 24, borderRadius: 12, borderWidth: 2 },
  avatarSobreposto: { marginLeft: -8 },
  confirmaram: { fontFamily: Fonts.sansMedio },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 11,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.sm,
  },

  rotuloSecao: { marginBottom: 18 },
  cluster: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  bolha: { alignItems: 'center', justifyContent: 'center', borderWidth: 1, paddingHorizontal: Spacing.two },
  bolhaTitulo: { textAlign: 'center' },
  bolhaContagem: { marginTop: 3, opacity: 0.75, textAlign: 'center' },

  talvez: { marginTop: 32, marginBottom: Spacing.three },
  sugeridos: { gap: 10 },
  sugerido: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingVertical: 14,
    paddingHorizontal: Spacing.three,
  },
  sugeridoTexto: { flex: 1, gap: 3 },
  sugeridoNome: { fontSize: 13.5 },
});
