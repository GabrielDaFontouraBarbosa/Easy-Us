import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import {Avatar, Pill, Progresso, Tela, TituloSecao, Cartao } from '@/components/ui/kit';
import { Entrada, Pousa, Pressavel } from '@/components/ui/motion';
import { CONQUISTAS } from '@/constants/mock-data';
import { Elevation, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const NUMEROS = [
  { valor: '7', rotulo: 'dias seguidos' },
  { valor: '34', rotulo: 'conversas' },
  { valor: '3', rotulo: 'círculos' },
];

/** Últimos 14 dias de presença — só um traço, sem números nem cobrança. */
const PRESENCA = [1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1];

export default function Perfil() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Tela>
      {/* ---- identidade ---- */}
      <Entrada indice={0}>
        <View style={styles.topo}>
          <View style={styles.identidade}>
            <Avatar nome="Gabriel" tamanho={68} online />
            <View style={styles.identidadeTexto}>
              <ThemedText style={styles.nome}>Gabriel</ThemedText>
              <ThemedText type="corpo" themeColor="textSecondary">
                por aqui desde março
              </ThemedText>
              <Pill tom="calma">🌱 presença constante</Pill>
            </View>
          </View>

          <Pressavel
            onPress={() => router.push('/configuracoes')}
            accessibilityLabel="Configurações"
            style={[styles.engrenagem, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText style={styles.engrenagemGlifo}>⚙️</ThemedText>
          </Pressavel>
        </View>
      </Entrada>

      {/* ---- números ---- */}
      <Entrada indice={1}>
        <View style={styles.numeros}>
          {NUMEROS.map((item, i) => (
            <Pousa key={item.rotulo} indice={i}>
              <View style={[styles.numero, { backgroundColor: theme.card, borderColor: theme.border }, Elevation.baixa]}>
                <ThemedText themeColor="primary" style={styles.numeroValor}>
                  {item.valor}
                </ThemedText>
                <ThemedText type="corpo" themeColor="textSecondary" style={styles.numeroRotulo}>
                  {item.rotulo}
                </ThemedText>
              </View>
            </Pousa>
          ))}
        </View>
      </Entrada>

      {/* ---- jornada ---- */}
      <Entrada indice={2}>
        <Cartao>
          <View style={styles.jornadaTopo}>
            <ThemedText type="forte">Sua presença</ThemedText>
            <ThemedText type="corpo" themeColor="textMuted">
              últimos 14 dias
            </ThemedText>
          </View>

          <View style={styles.trilha}>
            {PRESENCA.map((dia, i) => (
              <View
                key={i}
                style={[
                  styles.dia,
                  { backgroundColor: dia ? theme.calm : theme.surfaceSunken },
                ]}
              />
            ))}
          </View>

          <ThemedText type="corpo" themeColor="textSecondary" style={styles.jornadaTexto}>
            Faltar não apaga nada. O traço continua de onde parou.
          </ThemedText>

          <View style={styles.metaLinha}>
            <ThemedText type="corpo" themeColor="textSecondary">
              Meta gentil da semana
            </ThemedText>
            <ThemedText type="corpo" themeColor="calm" style={styles.metaValor}>
              4 de 5
            </ThemedText>
          </View>
          <Progresso valor={0.8} />
        </Cartao>
      </Entrada>

      {/* ---- conquistas ---- */}
      <TituloSecao indice={3}>Marcos</TituloSecao>

      <Entrada indice={4}>
        <View style={styles.conquistas}>
          {CONQUISTAS.map((item) => (
            <View
              key={item.id}
              style={[styles.conquista, { backgroundColor: theme.card, borderColor: theme.border }, Elevation.baixa]}>
              <View style={[styles.conquistaEmoji, { backgroundColor: theme.calmSoft }]}>
                <ThemedText style={styles.conquistaGlifo}>{item.emoji}</ThemedText>
              </View>
              <ThemedText type="forte" numberOfLines={1}>
                {item.titulo}
              </ThemedText>
              <ThemedText type="corpo" themeColor="textSecondary" numberOfLines={2} style={styles.conquistaDesc}>
                {item.descricao}
              </ThemedText>
            </View>
          ))}
        </View>
      </Entrada>

      {/* ---- despedida ---- */}
      <Entrada indice={5}>
        <Cartao tom="marca" style={styles.recado}>
          <ThemedText style={styles.recadoEmoji}>🫂</ThemedText>
          <ThemedText type="corpo" style={[styles.recadoTexto, { color: theme.primaryStrong }]}>
            Você apareceu 7 dias seguidos. Alguém aqui teve um dia melhor por causa disso.
          </ThemedText>
        </Cartao>
      </Entrada>
    </Tela>
  );
}

const styles = StyleSheet.create({
  topo: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Spacing.three },
  identidade: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, flex: 1 },
  identidadeTexto: { gap: Spacing.one, flex: 1, alignItems: 'flex-start' },
  nome: { fontSize: 24, lineHeight: 30, fontWeight: '800' },
  engrenagem: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  engrenagemGlifo: { fontSize: 18 },
  numeros: { flexDirection: 'row', gap: Spacing.three },
  numero: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    minWidth: 96,
  },
  numeroValor: { fontSize: 26, lineHeight: 32, fontWeight: '800' },
  numeroRotulo: { textAlign: 'center' },
  jornadaTopo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  trilha: { flexDirection: 'row', gap: Spacing.one + 2 },
  dia: { flex: 1, height: 34, borderRadius: Radius.sm },
  jornadaTexto: { lineHeight: 20 },
  metaLinha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  metaValor: { fontWeight: '700' },
  conquistas: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  conquista: {
    flexBasis: '46%',
    flexGrow: 1,
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  conquistaEmoji: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  conquistaGlifo: { fontSize: 20 },
  conquistaDesc: { lineHeight: 18 },
  recado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
  },
  recadoEmoji: { fontSize: 24 },
  recadoTexto: { flex: 1, lineHeight: 20, fontWeight: '600' },
});
