import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Aura } from '@/components/ui/aura';
import { Botao } from '@/components/ui/kit';
import { Pressavel, Respiro, useReduzMovimento } from '@/components/ui/motion';
import { PASSOS_ONBOARDING } from '@/constants/mock-data';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function Onboarding() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const reduz = useReduzMovimento();
  const scrollRef = useRef<ScrollView>(null);
  const [passo, setPasso] = useState(0);

  // useWindowDimensions e não Dimensions.get() no topo do arquivo: no web o
  // valor de módulo é lido antes do layout existir e volta 0, o que colapsa os
  // slides uns por cima dos outros e ainda degenera o interpolate (domínio
  // [0,0,0]), apagando o texto. O hook também acompanha rotação e resize.
  const { width: LARGURA } = useWindowDimensions();

  // O deslocamento do scroll vira a fonte de todas as animações da tela: o
  // orbe, os pontinhos e o texto derivam dele em vez de cada um ter seu próprio
  // estado. Uma verdade só, e nada dessincroniza.
  const deslocamento = useSharedValue(0);
  const aoRolar = useAnimatedScrollHandler({
    onScroll: (evento) => {
      deslocamento.value = evento.contentOffset.x;
    },
  });

  const ultimo = passo === PASSOS_ONBOARDING.length - 1;

  function irPara(indice: number) {
    scrollRef.current?.scrollTo({ x: indice * LARGURA, animated: !reduz });
    setPasso(indice);
  }

  function avancar() {
    if (ultimo) {
      router.replace('/');
      return;
    }
    irPara(passo + 1);
  }

  function aoTerminarRolagem(e: NativeSyntheticEvent<NativeScrollEvent>) {
    setPasso(Math.round(e.nativeEvent.contentOffset.x / LARGURA));
  }

  return (
    <View style={[styles.tela, { backgroundColor: theme.background }]}>
      <View style={[styles.topo, { paddingTop: insets.top }]}>
        <Pressavel onPress={() => router.replace('/')} style={styles.pular}>
          <ThemedText type="corpo" themeColor="textSecondary" style={styles.pularTexto}>
            Pular
          </ThemedText>
        </Pressavel>
      </View>

      <Animated.ScrollView
        ref={scrollRef as never}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={aoRolar}
        onMomentumScrollEnd={aoTerminarRolagem}
        scrollEventThrottle={16}>
        {PASSOS_ONBOARDING.map((item, i) => (
          <Slide key={item.titulo} item={item} indice={i} deslocamento={deslocamento} largura={LARGURA} />
        ))}
      </Animated.ScrollView>

      <View style={[styles.rodape, { paddingBottom: insets.bottom + Spacing.four }]}>
        <View style={styles.pontos}>
          {PASSOS_ONBOARDING.map((item, i) => (
            <Ponto key={item.titulo} indice={i} deslocamento={deslocamento} largura={LARGURA} />
          ))}
        </View>

        <Botao onPress={avancar} largura="cheia" comSeta>
          {ultimo ? 'Entrar no Easy Us' : 'Continuar'}
        </Botao>

        <ThemedText type="corpo" themeColor="textMuted" style={styles.aviso}>
          O Easy Us não substitui atendimento profissional.
        </ThemedText>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------

function Slide({
  item,
  indice,
  deslocamento,
  largura,
}: {
  item: (typeof PASSOS_ONBOARDING)[number];
  indice: number;
  deslocamento: SharedValue<number>;
  largura: number;
}) {
  const theme = useTheme();

  // Paralaxe: o orbe anda mais devagar que o dedo e encolhe ao sair de cena.
  const estiloOrbe = useAnimatedStyle(() => {
    const entrada = [(indice - 1) * largura, indice * largura, (indice + 1) * largura];
    return {
      transform: [
        { translateX: interpolate(deslocamento.value, entrada, [largura * 0.3, 0, -largura * 0.3], Extrapolation.CLAMP) },
        { scale: interpolate(deslocamento.value, entrada, [0.7, 1, 0.7], Extrapolation.CLAMP) },
      ],
      opacity: interpolate(deslocamento.value, entrada, [0.3, 1, 0.3], Extrapolation.CLAMP),
    };
  });

  const estiloTexto = useAnimatedStyle(() => {
    const entrada = [(indice - 1) * largura, indice * largura, (indice + 1) * largura];
    return {
      opacity: interpolate(deslocamento.value, entrada, [0, 1, 0], Extrapolation.CLAMP),
      transform: [{ translateY: interpolate(deslocamento.value, entrada, [24, 0, 24], Extrapolation.CLAMP) }],
    };
  });

  return (
    <View style={[styles.slide, { width: largura }]}>
      <Animated.View style={estiloOrbe}>
        <Respiro amplitude={0.05}>
          {/* Aura maior que o orbe: o brilho vaza pra fora da borda e tira o
              aspecto de "adesivo colado no fundo". */}
          <Aura cor={theme.calm} tamanho={340} intensidade={0.55} />
          <View style={[styles.orbeExterno, { backgroundColor: theme.calmSoft }]}>
            <View style={[styles.orbeInterno, { backgroundColor: theme.primarySoft }]}>
              <ThemedText style={styles.orbeEmoji}>{item.emoji}</ThemedText>
            </View>
          </View>
        </Respiro>
      </Animated.View>

      <Animated.View style={[styles.slideTexto, estiloTexto]}>
        <ThemedText style={styles.slideTitulo}>{item.titulo}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.slideDescricao}>
          {item.texto}
        </ThemedText>
      </Animated.View>
    </View>
  );
}

/** Ponto que vira cápsula quando é a página atual. */
function Ponto({
  indice,
  deslocamento,
  largura,
}: {
  indice: number;
  deslocamento: SharedValue<number>;
  largura: number;
}) {
  const theme = useTheme();

  const estilo = useAnimatedStyle(() => {
    const entrada = [(indice - 1) * largura, indice * largura, (indice + 1) * largura];
    return {
      width: interpolate(deslocamento.value, entrada, [8, 26, 8], Extrapolation.CLAMP),
      opacity: interpolate(deslocamento.value, entrada, [0.35, 1, 0.35], Extrapolation.CLAMP),
    };
  });

  return <Animated.View style={[styles.ponto, { backgroundColor: theme.primary }, estilo]} />;
}

// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  tela: { flex: 1 },
  topo: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: Spacing.four },
  pular: { paddingVertical: Spacing.two, paddingHorizontal: Spacing.three },
  pularTexto: { fontWeight: '700' },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
    gap: Spacing.six,
  },
  orbeExterno: {
    width: 232,
    height: 232,
    borderRadius: 116,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbeInterno: {
    width: 164,
    height: 164,
    borderRadius: 82,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbeEmoji: { fontSize: 68, lineHeight: 78 },
  slideTexto: { gap: Spacing.three, alignItems: 'center' },
  slideTitulo: { fontSize: 30, lineHeight: 38, fontWeight: '800', textAlign: 'center' },
  slideDescricao: { fontSize: 16, lineHeight: 24, textAlign: 'center' },
  rodape: { paddingHorizontal: Spacing.four, gap: Spacing.four },
  pontos: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.two, height: 8 },
  ponto: { height: 8, borderRadius: Radius.pill },
  aviso: { textAlign: 'center' },
});
