import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Avatar, Botao, CabecalhoMarca, Cartao, Pill, Tela, TituloSecao } from '@/components/ui/kit';
import { Aura } from '@/components/ui/aura';
import { Entrada, Pressavel, Respiro } from '@/components/ui/motion';
import { CIRCULOS, HUMORES } from '@/constants/mock-data';
import { Elevation, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function Inicio() {
  const theme = useTheme();
  const router = useRouter();
  const [humor, setHumor] = useState<string | null>(null);

  return (
    <Tela>
      {/* ---- cabeçalho ---- */}
      <Entrada indice={0}>
        <CabecalhoMarca onSino={() => router.push('/configuracoes')} />
      </Entrada>

      {/* ---- saudação ---- */}
      <Entrada indice={1}>
        <View style={styles.hero}>
          <Pill tom="calma">Boa noite, Gabriel</Pill>
          {/* O título é a única serifada da tela e o único trecho com ember no
              texto — é o que faz o olho pousar aqui primeiro. */}
          <ThemedText type="titulo">
            Você{' '}
            <ThemedText type="titulo" themeColor="primary">
              não está sozinho
            </ThemedText>
            .
          </ThemedText>
          <ThemedText type="lede">
            Tem 33 pessoas por aqui agora, sentindo coisas parecidas com você.
          </ThemedText>
        </View>
      </Entrada>

      {/* ---- humor de hoje ---- */}
      <Entrada indice={2}>
        <Cartao>
          <View style={styles.humorTopo}>
            <ThemedText type="forte">Como você está hoje?</ThemedText>
            {humor && <Pill tom="calma">registrado ✓</Pill>}
          </View>

          <View style={styles.humores}>
            {HUMORES.map((item) => {
              const ativo = humor === item.id;
              return (
                <Pressavel
                  key={item.id}
                  escala={0.9}
                  onPress={() => setHumor(ativo ? null : item.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: ativo }}
                  style={[
                    styles.humor,
                    {
                      backgroundColor: ativo ? theme.primarySoft : theme.surfaceSunken,
                      borderColor: ativo ? theme.primary : 'transparent',
                    },
                  ]}>
                  <ThemedText style={styles.humorEmoji}>{item.emoji}</ThemedText>
                  <ThemedText
                    type="corpo"
                    style={{ color: ativo ? theme.primaryStrong : theme.textSecondary }}>
                    {item.rotulo}
                  </ThemedText>
                </Pressavel>
              );
            })}
          </View>

          {humor && (
            <Entrada>
              <ThemedText type="corpo" themeColor="textSecondary" style={styles.humorResposta}>
                Obrigado por dizer. Isso já é um passo — e ninguém aqui vai cobrar mais que isso.
              </ThemedText>
            </Entrada>
          )}
        </Cartao>
      </Entrada>

      {/* ---- respiro guiado ---- */}
      <Entrada indice={3}>
        <Pressavel>
          <Cartao tom="calma" style={styles.respiro}>
            {/* A aura fica atrás do orbe e respira junto: o brilho cresce e
                encolhe com ele, como uma luz difusa em vez de um disco chapado. */}
            <View style={styles.respiroOrbeArea}>
              <Respiro amplitude={0.08}>
                <Aura cor={theme.calm} tamanho={96} intensidade={0.9} />
                <View style={[styles.respiroOrbe, { backgroundColor: theme.calm }]} />
              </Respiro>
            </View>
            <View style={styles.respiroTexto}>
              <ThemedText type="forte" style={{ color: theme.calmStrong }}>
                Um minuto de respiro
              </ThemedText>
              <ThemedText type="corpo" themeColor="textSecondary">
                Siga o círculo. Inspire quando cresce, solte quando encolhe.
              </ThemedText>
            </View>
          </Cartao>
        </Pressavel>
      </Entrada>

      {/* ---- círculos ---- */}
      <TituloSecao
        indice={4}
        acao={
          <Pressavel onPress={() => router.push('/circulos')}>
            <ThemedText type="corpo" themeColor="primary" style={styles.verTodos}>
              Ver todos
            </ThemedText>
          </Pressavel>
        }>
        Seus círculos
      </TituloSecao>

      <Entrada indice={5}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trilhaCirculos}>
          {CIRCULOS.slice(0, 3).map((circulo) => (
            <Pressavel
              key={circulo.id}
              onPress={() => router.push(`/conversa/${circulo.id}`)}
              style={[
                styles.cartaoCirculo,
                { backgroundColor: theme.card, borderColor: theme.border },
                Elevation.baixa,
              ]}>
              <View style={[styles.circuloEmoji, { backgroundColor: circulo.cor }]}>
                <ThemedText style={styles.circuloEmojiGlifo}>{circulo.emoji}</ThemedText>
              </View>
              <ThemedText type="forte" numberOfLines={1}>
                {circulo.nome}
              </ThemedText>
              <View style={styles.circuloRodape}>
                <View style={[styles.pontoOnline, { backgroundColor: theme.calm }]} />
                <ThemedText type="corpo" themeColor="textSecondary">
                  {circulo.online} online
                </ThemedText>
              </View>
            </Pressavel>
          ))}
        </ScrollView>
      </Entrada>

      {/* ---- atividade ---- */}
      <Entrada indice={6}>
        <Cartao>
          <View style={styles.linhaAtividade}>
            <Avatar nome="Mariana" online />
            <View style={styles.atividadeTexto}>
              <ThemedText type="forte">Mariana</ThemedText>
              <ThemedText type="corpo" themeColor="textSecondary">
                abriu uma conversa em Respirar Junto.
              </ThemedText>
            </View>
            <ThemedText type="corpo" themeColor="textMuted">
              agora
            </ThemedText>
          </View>

          <Botao
            largura="cheia"
            comSeta
            onPress={() => router.push('/conversa/respirar')}>
            Entrar na conversa
          </Botao>
        </Cartao>
      </Entrada>

      {/* ---- rodapé ---- */}
      <Entrada indice={7}>
        <View style={styles.rodape}>
          <ThemedText type="forte" themeColor="primary" style={styles.rodapeTexto}>
            Você importa. Você não está sozinho. ♡
          </ThemedText>
        </View>
      </Entrada>
    </Tela>
  );
}

const styles = StyleSheet.create({
  cabecalho: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  marca: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  logo: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  logoGlifo: { fontSize: 20 },
  marcaNome: { fontSize: 20, lineHeight: 24, fontWeight: '800' },
  sino: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  sinoGlifo: { fontSize: 18 },
  sinoPonto: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 2,
  },
  hero: { gap: Spacing.two, alignItems: 'flex-start' },
  heroTitulo: { fontSize: 34, lineHeight: 41, fontWeight: '800' },
  heroSub: { fontSize: 16, lineHeight: 23 },
  humorTopo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  humores: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.one },
  humor: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.half,
    borderRadius: Radius.md,
    borderWidth: 1.5,
  },
  humorEmoji: { fontSize: 24, lineHeight: 30 },
  humorResposta: { lineHeight: 20 },
  respiro: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  respiroOrbeArea: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  respiroOrbe: { width: 44, height: 44, borderRadius: 22, opacity: 0.9 },
  respiroTexto: { flex: 1, gap: 2 },
  verTodos: { fontWeight: '700' },
  trilhaCirculos: { gap: Spacing.three, paddingRight: Spacing.four, paddingVertical: Spacing.half },
  cartaoCirculo: {
    width: 150,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.two,
  },
  circuloEmoji: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  circuloEmojiGlifo: { fontSize: 22 },
  circuloRodape: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one + 2 },
  pontoOnline: { width: 7, height: 7, borderRadius: 4 },
  linhaAtividade: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  atividadeTexto: { flex: 1, gap: 2 },
  rodape: { alignItems: 'center', paddingBottom: Spacing.three },
  rodapeTexto: { textAlign: 'center' },
});
