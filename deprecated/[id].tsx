import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Avatar, Pill } from '@/components/ui/kit';
import { Pressavel, useReduzMovimento } from '@/components/ui/motion';
import { CIRCULOS, CONVERSA, type Mensagem } from '@/constants/mock-data';
import { Elevation, Motion, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function Conversa() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [rascunho, setRascunho] = useState('');

  const circulo = CIRCULOS.find((c) => c.id === id) ?? CIRCULOS[0];

  return (
    <KeyboardAvoidingView
      style={[styles.tela, { backgroundColor: theme.background }]}
      behavior={Platform.select({ ios: 'padding', default: undefined })}
      keyboardVerticalOffset={insets.top}>
      {/* ---- cabeçalho ---- */}
      <Animated.View
        entering={FadeInUp.duration(Motion.medio)}
        style={[
          styles.cabecalho,
          { paddingTop: insets.top + Spacing.two, backgroundColor: theme.card, borderColor: theme.border },
        ]}>
        <Pressavel
          onPress={() => router.back()}
          accessibilityLabel="Voltar"
          style={[styles.voltar, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText style={styles.voltarGlifo}>‹</ThemedText>
        </Pressavel>

        <View style={[styles.cabecalhoEmoji, { backgroundColor: circulo.cor }]}>
          <ThemedText style={styles.cabecalhoEmojiGlifo}>{circulo.emoji}</ThemedText>
        </View>

        <View style={styles.cabecalhoTexto}>
          <ThemedText type="forte" numberOfLines={1}>
            {circulo.nome}
          </ThemedText>
          <View style={styles.presenca}>
            <View style={[styles.pontoVivo, { backgroundColor: theme.calm }]} />
            <ThemedText type="corpo" themeColor="textSecondary">
              {circulo.online} pessoas aqui agora
            </ThemedText>
          </View>
        </View>
      </Animated.View>

      {/* ---- aviso de acolhimento ---- */}
      <ScrollView
        style={styles.rolagem}
        contentContainerStyle={[styles.conteudo, { paddingBottom: Spacing.four }]}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.delay(120).duration(Motion.lento)}>
          <View style={[styles.avisoAcolhimento, { backgroundColor: theme.calmSoft }]}>
            <ThemedText style={styles.avisoEmoji}>🕯️</ThemedText>
            <ThemedText type="corpo" style={[styles.avisoTexto, { color: theme.calmStrong }]}>
              Este é um espaço de escuta. Sem conselho não pedido, sem julgamento, sem pressa.
            </ThemedText>
          </View>
        </Animated.View>

        <View style={styles.separadorDia}>
          <View style={[styles.linha, { backgroundColor: theme.border }]} />
          <ThemedText type="corpo" themeColor="textMuted">
            hoje
          </ThemedText>
          <View style={[styles.linha, { backgroundColor: theme.border }]} />
        </View>

        {CONVERSA.map((mensagem, i) => (
          <Balao key={mensagem.id} mensagem={mensagem} indice={i} />
        ))}

        <DigitandoAgora />
      </ScrollView>

      {/* ---- composição ---- */}
      <View
        style={[
          styles.compositor,
          {
            paddingBottom: insets.bottom + Spacing.three,
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}>
        <View style={[styles.campo, { backgroundColor: theme.surfaceSunken }]}>
          <TextInput
            value={rascunho}
            onChangeText={setRascunho}
            placeholder="Escreva no seu tempo..."
            placeholderTextColor={theme.textMuted}
            multiline
            style={[styles.entrada, { color: theme.text }]}
          />
        </View>

        <Pressavel
          escala={0.9}
          accessibilityLabel="Enviar"
          style={[
            styles.enviar,
            { backgroundColor: rascunho.trim() ? theme.primary : theme.backgroundElement },
          ]}>
          <ThemedText style={styles.enviarGlifo}>{rascunho.trim() ? '↑' : '🫂'}</ThemedText>
        </Pressavel>
      </View>
    </KeyboardAvoidingView>
  );
}

// ---------------------------------------------------------------------------

function Balao({ mensagem, indice }: { mensagem: Mensagem; indice: number }) {
  const theme = useTheme();
  const reduz = useReduzMovimento();
  const meu = !!mensagem.euMesmo;

  return (
    <Animated.View
      entering={
        reduz
          ? FadeIn.duration(Motion.rapido)
          : FadeInDown.delay(indice * Motion.escada + 160).duration(Motion.medio).springify().damping(20)
      }
      style={[styles.baoLinha, meu && styles.baoLinhaMinha]}>
      {!meu && <Avatar nome={mensagem.autor} tamanho={34} cor={mensagem.cor} />}

      <View style={[styles.baoBloco, meu && styles.baoBlocoMeu]}>
        {!meu && (
          <ThemedText type="corpo" themeColor="textMuted" style={styles.autor}>
            {mensagem.autor}
          </ThemedText>
        )}

        <View
          style={[
            styles.balao,
            meu
              ? { backgroundColor: theme.primary, borderBottomRightRadius: Radius.sm }
              : { backgroundColor: theme.card, borderBottomLeftRadius: Radius.sm, borderColor: theme.border, borderWidth: StyleSheet.hairlineWidth },
            Elevation.baixa,
          ]}>
          <ThemedText style={[styles.baoTexto, { color: meu ? theme.onPrimary : theme.text }]}>
            {mensagem.texto}
          </ThemedText>
        </View>

        <View style={[styles.baoRodape, meu && styles.baoRodapeMeu]}>
          {mensagem.reacoes?.map((reacao) => (
            <View
              key={reacao.emoji}
              style={[styles.reacao, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText type="corpo">{reacao.emoji}</ThemedText>
              <ThemedText type="corpo" themeColor="textSecondary">
                {reacao.total}
              </ThemedText>
            </View>
          ))}
          <ThemedText type="corpo" themeColor="textMuted">
            {mensagem.hora}
          </ThemedText>
        </View>
      </View>
    </Animated.View>
  );
}

/** Três pontinhos respirando em sequência — o sinal universal de "tem alguém aí". */
function DigitandoAgora() {
  const theme = useTheme();
  const reduz = useReduzMovimento();

  return (
    <Animated.View entering={FadeIn.delay(700)} style={styles.digitando}>
      <Avatar nome="Téo" tamanho={26} cor={theme.calm} />
      <View style={[styles.digitandoBalao, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            entering={reduz ? undefined : FadeIn.delay(800 + i * 160).duration(400)}
            style={[styles.pontinho, { backgroundColor: theme.textMuted }]}
          />
        ))}
      </View>
      <ThemedText type="corpo" themeColor="textMuted">
        Téo está escrevendo
      </ThemedText>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  tela: { flex: 1 },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  voltar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  voltarGlifo: { fontSize: 26, lineHeight: 30, fontWeight: '700', marginTop: -3 },
  cabecalhoEmoji: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  cabecalhoEmojiGlifo: { fontSize: 18 },
  cabecalhoTexto: { flex: 1, gap: 1 },
  presenca: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one + 2 },
  pontoVivo: { width: 7, height: 7, borderRadius: 4 },
  rolagem: { flex: 1 },
  conteudo: { padding: Spacing.three, gap: Spacing.three },
  avisoAcolhimento: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
  },
  avisoEmoji: { fontSize: 18 },
  avisoTexto: { flex: 1, lineHeight: 19 },
  separadorDia: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  linha: { flex: 1, height: StyleSheet.hairlineWidth },
  baoLinha: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.two },
  baoLinhaMinha: { justifyContent: 'flex-end' },
  baoBloco: { flexShrink: 1, maxWidth: '82%', gap: Spacing.half },
  baoBlocoMeu: { alignItems: 'flex-end' },
  autor: { marginLeft: Spacing.two, fontWeight: '600' },
  balao: {
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.lg,
  },
  baoTexto: { fontSize: 15, lineHeight: 21 },
  baoRodape: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one + 2, marginLeft: Spacing.two },
  baoRodapeMeu: { justifyContent: 'flex-end', marginRight: Spacing.two },
  reacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  digitando: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  digitandoBalao: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pontinho: { width: 6, height: 6, borderRadius: 3 },
  compositor: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  campo: { flex: 1, borderRadius: Radius.lg, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one },
  entrada: { fontSize: 15, lineHeight: 21, maxHeight: 110, paddingVertical: Spacing.two },
  enviar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  enviarGlifo: { fontSize: 19, fontWeight: '700' },
});
