import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import {Pill, Tela, TituloSecao, Cartao } from '@/components/ui/kit';
import { Entrada, Pressavel, useReduzMovimento } from '@/components/ui/motion';
import { CIRCULOS, type Circulo } from '@/constants/mock-data';
import { Elevation, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const FILTROS = ['Todos', 'Ativos agora', 'Meus'] as const;

export default function Circulos() {
  const theme = useTheme();
  const router = useRouter();
  const reduz = useReduzMovimento();
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]>('Todos');

  const lista = useMemo(() => {
    if (filtro === 'Ativos agora') return CIRCULOS.filter((c) => c.ativo);
    if (filtro === 'Meus') return CIRCULOS.slice(0, 3);
    return CIRCULOS;
  }, [filtro]);

  return (
    <Tela>
      <Entrada indice={0}>
        <View style={styles.topo}>
          <ThemedText style={styles.titulo}>Círculos</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitulo}>
            Grupos pequenos, por tema. Entre e saia quando quiser.
          </ThemedText>
        </View>
      </Entrada>

      {/* filtros */}
      <Entrada indice={1}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtros}>
          {FILTROS.map((item) => {
            const ativo = filtro === item;
            return (
              <Pressavel
                key={item}
                escala={0.94}
                onPress={() => setFiltro(item)}
                accessibilityRole="button"
                accessibilityState={{ selected: ativo }}
                style={[
                  styles.filtro,
                  {
                    backgroundColor: ativo ? theme.primary : theme.backgroundElement,
                  },
                ]}>
                <ThemedText
                  type="corpo"
                  style={[styles.filtroTexto, { color: ativo ? theme.onPrimary : theme.textSecondary }]}>
                  {item}
                </ThemedText>
              </Pressavel>
            );
          })}
        </ScrollView>
      </Entrada>

      {/* lista — LinearTransition faz os cartões deslizarem quando o filtro muda,
          em vez de a lista piscar e trocar de conteúdo do nada */}
      <View style={styles.lista}>
        {lista.map((circulo, i) => (
          <Animated.View
            key={circulo.id}
            layout={reduz ? undefined : LinearTransition.springify().damping(20)}>
            <Entrada indice={i + 2}>
              <CartaoCirculo
                circulo={circulo}
                onPress={() => router.push(`/conversa/${circulo.id}`)}
              />
            </Entrada>
          </Animated.View>
        ))}
      </View>

      <TituloSecao indice={lista.length + 2}>Criar o seu</TituloSecao>

      <Entrada indice={lista.length + 3}>
        <Cartao tom="marca">
          <ThemedText type="forte">Não achou um lugar seu?</ThemedText>
          <ThemedText type="corpo" themeColor="textSecondary" style={styles.criarTexto}>
            Círculos nascem de uma pessoa só. Comece o seu e deixe que quem precisa te encontre.
          </ThemedText>
          <Pressavel style={[styles.criarBotao, { borderColor: theme.primary }]}>
            <ThemedText type="forte" themeColor="primary">
              + Criar um círculo
            </ThemedText>
          </Pressavel>
        </Cartao>
      </Entrada>
    </Tela>
  );
}

function CartaoCirculo({ circulo, onPress }: { circulo: Circulo; onPress: () => void }) {
  const theme = useTheme();

  return (
    <Pressavel
      onPress={onPress}
      accessibilityRole="button"
      style={[
        styles.cartao,
        { backgroundColor: theme.card, borderColor: theme.border },
        Elevation.baixa,
      ]}>
      <View style={[styles.emoji, { backgroundColor: circulo.cor }]}>
        <ThemedText style={styles.emojiGlifo}>{circulo.emoji}</ThemedText>
      </View>

      <View style={styles.corpo}>
        <View style={styles.linhaTitulo}>
          <ThemedText type="forte" numberOfLines={1} style={styles.nome}>
            {circulo.nome}
          </ThemedText>
          <ThemedText type="corpo" themeColor="textMuted">
            {circulo.quando}
          </ThemedText>
        </View>

        <ThemedText type="corpo" themeColor="textSecondary" numberOfLines={1}>
          {circulo.ultimaMensagem}
        </ThemedText>

        <View style={styles.meta}>
          <Pill tom={circulo.ativo ? 'calma' : 'neutro'}>
            {circulo.ativo ? `${circulo.online} online` : 'quieto agora'}
          </Pill>
          <ThemedText type="corpo" themeColor="textMuted">
            {circulo.membros} membros · {circulo.tema}
          </ThemedText>
        </View>
      </View>
    </Pressavel>
  );
}

const styles = StyleSheet.create({
  topo: { gap: Spacing.two },
  titulo: { fontSize: 32, lineHeight: 38, fontWeight: '800' },
  subtitulo: { fontSize: 15, lineHeight: 22 },
  filtros: { gap: Spacing.two, paddingVertical: Spacing.half },
  filtro: { paddingVertical: Spacing.two, paddingHorizontal: Spacing.three, borderRadius: Radius.pill },
  filtroTexto: { fontWeight: '700' },
  lista: { gap: Spacing.three },
  cartao: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  emoji: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  emojiGlifo: { fontSize: 24 },
  corpo: { flex: 1, gap: Spacing.one + 2 },
  linhaTitulo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  nome: { flex: 1, fontSize: 15 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, flexWrap: 'wrap' },
  criarTexto: { lineHeight: 20 },
  criarBotao: {
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
});
