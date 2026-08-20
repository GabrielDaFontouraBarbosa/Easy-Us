import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import {Tela, Cartao } from '@/components/ui/kit';
import { Entrada, Pressavel } from '@/components/ui/motion';
import { Motion, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Chave = 'silencioso' | 'presenca' | 'convites' | 'anonimo' | 'reduzirMovimento';

const GRUPOS: { titulo: string; itens: { chave: Chave; icone: string; nome: string; nota: string }[] }[] = [
  {
    titulo: 'Notificações',
    itens: [
      {
        chave: 'silencioso',
        icone: '🌙',
        nome: 'Modo silencioso',
        nota: 'Nada vibra entre 22h e 8h.',
      },
      {
        chave: 'convites',
        icone: '✉️',
        nome: 'Convites de círculos',
        nota: 'Avisar quando alguém te chamar.',
      },
    ],
  },
  {
    titulo: 'Privacidade',
    itens: [
      {
        chave: 'presenca',
        icone: '👁️',
        nome: 'Mostrar que estou online',
        nota: 'Desligado, você entra sem avisar ninguém.',
      },
      {
        chave: 'anonimo',
        icone: '🎭',
        nome: 'Entrar como anônimo',
        nota: 'Seu nome vira um apelido nos círculos novos.',
      },
    ],
  },
  {
    titulo: 'Acessibilidade',
    itens: [
      {
        chave: 'reduzirMovimento',
        icone: '🍃',
        nome: 'Reduzir movimento',
        nota: 'Menos animação, tudo aparece direto.',
      },
    ],
  },
];

export default function Configuracoes() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [valores, setValores] = useState<Record<Chave, boolean>>({
    silencioso: true,
    presenca: true,
    convites: false,
    anonimo: false,
    reduzirMovimento: false,
  });

  function alternar(chave: Chave) {
    setValores((atual) => ({ ...atual, [chave]: !atual[chave] }));
  }

  return (
    <View style={[styles.tela, { backgroundColor: theme.background }]}>
      <Animated.View
        entering={FadeIn.duration(Motion.medio)}
        style={[styles.puxador, { paddingTop: insets.top + Spacing.two }]}>
        <View style={[styles.barrinha, { backgroundColor: theme.borderStrong }]} />
        <View style={styles.cabecalho}>
          <ThemedText style={styles.titulo}>Ajustes</ThemedText>
          <Pressavel
            onPress={() => router.back()}
            accessibilityLabel="Fechar"
            style={[styles.fechar, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText style={styles.fecharGlifo}>✕</ThemedText>
          </Pressavel>
        </View>
      </Animated.View>

      <Tela semTabBar>
        {GRUPOS.map((grupo, g) => (
          <Entrada key={grupo.titulo} indice={g}>
            <View style={styles.grupo}>
              <ThemedText type="corpo" themeColor="textMuted" style={styles.grupoTitulo}>
                {grupo.titulo.toUpperCase()}
              </ThemedText>

              <Cartao style={styles.grupoCartao}>
                {grupo.itens.map((item, i) => (
                  <View key={item.chave}>
                    {i > 0 && <View style={[styles.divisor, { backgroundColor: theme.border }]} />}
                    <View style={styles.linha}>
                      <View style={[styles.icone, { backgroundColor: theme.backgroundElement }]}>
                        <ThemedText style={styles.iconeGlifo}>{item.icone}</ThemedText>
                      </View>

                      <View style={styles.linhaTexto}>
                        <ThemedText type="forte">{item.nome}</ThemedText>
                        <ThemedText type="corpo" themeColor="textSecondary" style={styles.nota}>
                          {item.nota}
                        </ThemedText>
                      </View>

                      <Switch
                        value={valores[item.chave]}
                        onValueChange={() => alternar(item.chave)}
                        trackColor={{ false: theme.surfaceSunken, true: theme.calm }}
                        thumbColor={theme.card}
                      />
                    </View>
                  </View>
                ))}
              </Cartao>
            </View>
          </Entrada>
        ))}

        <Entrada indice={GRUPOS.length}>
          <Cartao tom="calma">
            <ThemedText type="forte">Sobre o Easy Us</ThemedText>
            <ThemedText type="corpo" themeColor="textSecondary" style={styles.sobre}>
              Este app é apoio entre pessoas — não substitui psicólogo, psiquiatra nem serviço de
              emergência. Se você está em risco, procure o CVV (188) ou o serviço de saúde mais
              próximo.
            </ThemedText>
            <ThemedText type="corpo" themeColor="textMuted">
              versão 1.0.0
            </ThemedText>
          </Cartao>
        </Entrada>

        <Entrada indice={GRUPOS.length + 1}>
          <Pressavel style={[styles.sair, { borderColor: theme.danger }]}>
            <ThemedText type="forte" style={{ color: theme.danger }}>
              Sair da conta
            </ThemedText>
          </Pressavel>
        </Entrada>
      </Tela>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1 },
  puxador: { paddingHorizontal: Spacing.four, paddingBottom: Spacing.two, gap: Spacing.three },
  barrinha: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center' },
  cabecalho: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titulo: { fontSize: 28, lineHeight: 34, fontWeight: '800' },
  fechar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  fecharGlifo: { fontSize: 15, fontWeight: '700' },
  grupo: { gap: Spacing.two },
  grupoTitulo: { letterSpacing: 0.8, fontWeight: '700', marginLeft: Spacing.one },
  grupoCartao: { gap: 0, paddingVertical: Spacing.one },
  divisor: { height: StyleSheet.hairlineWidth, marginLeft: 52 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, paddingVertical: Spacing.three },
  icone: { width: 36, height: 36, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  iconeGlifo: { fontSize: 17 },
  linhaTexto: { flex: 1, gap: 1 },
  nota: { lineHeight: 18 },
  sobre: { lineHeight: 20 },
  sair: {
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
  },
});
