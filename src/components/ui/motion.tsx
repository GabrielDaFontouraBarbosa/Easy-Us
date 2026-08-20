/**
 * Primitivas de movimento do Easy Us.
 *
 * Regra que vale pra tudo aqui: toda animação respeita "reduzir movimento" do
 * sistema. Num app cujo público pode estar ansioso ou em crise, movimento não
 * é enfeite neutro — pra parte das pessoas ele atrapalha de verdade. Quando a
 * pessoa pede menos movimento, os componentes não caem num fallback quebrado:
 * eles simplesmente aparecem, já no estado final.
 */

import { useEffect, useState, type PropsWithChildren } from 'react';
import { AccessibilityInfo, Pressable, type PressableProps, type ViewStyle } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Motion } from '@/constants/theme';

/** Escuta a preferência de acessibilidade e reage se ela mudar em tempo real. */
export function useReduzMovimento() {
  const [reduz, setReduz] = useState(false);

  useEffect(() => {
    let vivo = true;
    AccessibilityInfo.isReduceMotionEnabled().then((valor) => {
      if (vivo) setReduz(valor);
    });
    const inscricao = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduz);
    return () => {
      vivo = false;
      inscricao.remove();
    };
  }, []);

  return reduz;
}

// ---------------------------------------------------------------------------

type EntradaProps = PropsWithChildren<{
  /** Posição na escada: 0 entra primeiro, 1 logo depois, e assim por diante. */
  indice?: number;
  /** Atraso extra, em ms, antes da escada começar. */
  atraso?: number;
  style?: ViewStyle | ViewStyle[];
}>;

/**
 * Entrada em escada. Em vez de a tela inteira aparecer de uma vez, os blocos
 * sobem em sequência — o olho tem tempo de acompanhar e a tela parece montada,
 * não despejada.
 */
export function Entrada({ children, indice = 0, atraso = 0, style }: EntradaProps) {
  const reduz = useReduzMovimento();
  const espera = atraso + indice * Motion.escada;

  return (
    <Animated.View
      style={style}
      entering={
        reduz
          ? FadeIn.duration(Motion.rapido)
          : FadeInDown.delay(espera).duration(Motion.medio).springify().damping(18)
      }>
      {children}
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------

type PressavelProps = PressableProps &
  PropsWithChildren<{
    /** Quanto encolhe ao toque. 1 = não encolhe. */
    escala?: number;
    style?: ViewStyle | ViewStyle[];
  }>;

const PressableAnimado = Animated.createAnimatedComponent(Pressable);

/**
 * Botão que responde ao toque com uma mola curta em vez de um piscar de
 * opacidade. É a diferença entre um app que parece papel e um que parece
 * material — e custa três linhas.
 */
export function Pressavel({ children, escala = 0.96, style, ...resto }: PressavelProps) {
  const reduz = useReduzMovimento();
  const pressionado = useSharedValue(0);

  const estilo = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressionado.value * (1 - escala) }],
    opacity: 1 - pressionado.value * 0.12,
  }));

  return (
    <PressableAnimado
      {...resto}
      onPressIn={(e) => {
        pressionado.value = withSpring(1, Motion.mola);
        resto.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        pressionado.value = withSpring(0, Motion.mola);
        resto.onPressOut?.(e);
      }}
      style={[style, reduz ? undefined : estilo]}>
      {children}
    </PressableAnimado>
  );
}

// ---------------------------------------------------------------------------

/**
 * Respiração contínua. Usado no orbe da tela inicial: um pulso lento de 3,2s
 * que imita o ritmo de uma respiração calma — é a única animação do app que
 * nunca para, e por isso é a mais lenta de todas.
 */
export function Respiro({
  children,
  amplitude = 0.04,
  style,
}: PropsWithChildren<{ amplitude?: number; style?: ViewStyle | ViewStyle[] }>) {
  const reduz = useReduzMovimento();
  const fase = useSharedValue(0);

  useEffect(() => {
    if (reduz) {
      fase.value = 0;
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
    transform: [{ scale: 1 + fase.value * amplitude }],
  }));

  return <Animated.View style={[style, estilo]}>{children}</Animated.View>;
}

// ---------------------------------------------------------------------------

/**
 * Contador que "pousa": entra crescendo e assenta com mola. Usado nos números
 * do perfil, onde um número que aparece seco parece dado de planilha.
 */
export function Pousa({ children, indice = 0 }: PropsWithChildren<{ indice?: number }>) {
  const reduz = useReduzMovimento();
  const escala = useSharedValue(reduz ? 1 : 0.8);
  const opacidade = useSharedValue(reduz ? 1 : 0);

  useEffect(() => {
    if (reduz) {
      escala.value = 1;
      opacidade.value = 1;
      return;
    }
    const espera = indice * Motion.escada;
    escala.value = withDelay(espera, withSpring(1, { ...Motion.molaSuave, mass: 1.1 }));
    opacidade.value = withDelay(espera, withTiming(1, { duration: Motion.medio }));
  }, [reduz, indice, escala, opacidade]);

  const estilo = useAnimatedStyle(() => ({
    opacity: opacidade.value,
    transform: [{ scale: escala.value }],
  }));

  return <Animated.View style={estilo}>{children}</Animated.View>;
}

export { Animated };
