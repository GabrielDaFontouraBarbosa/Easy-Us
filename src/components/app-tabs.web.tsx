import { BlurView } from 'expo-blur';
import {
  Tabs,
  TabList,
  TabSlot,
  TabTrigger,
  type TabListProps,
  type TabTriggerSlotProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';

import { IconeAlvo, IconeCasa, IconeCirculos, IconePessoa } from '@/components/ui/icones';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type NomeIcone = 'casa' | 'circulos' | 'alvo' | 'pessoa';

/**
 * Barra de abas do web, desenhada conforme a referência: retângulo arredondado
 * com fundo translúcido e desfoque, ícones de traço (não emoji) e a aba ativa
 * marcada por uma pastilha ember.
 *
 * Os <TabTrigger> são escritos um a um de propósito. Gerá-los com .map() faz o
 * expo-router não enxergar tela nenhuma ("Couldn't find any screens for the
 * navigator") — ele lê os filhos do TabList em tempo de render.
 */
export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <BarraAbas>
          <TabTrigger name="index" href="/" asChild>
            <BotaoAba icone="casa">Início</BotaoAba>
          </TabTrigger>
          <TabTrigger name="circulos" href="/circulos" asChild>
            <BotaoAba icone="circulos">Círculos</BotaoAba>
          </TabTrigger>
          <TabTrigger name="descobrir" href="/descobrir" asChild>
            <BotaoAba icone="alvo">Descobrir</BotaoAba>
          </TabTrigger>
          <TabTrigger name="perfil" href="/perfil" asChild>
            <BotaoAba icone="pessoa">Perfil</BotaoAba>
          </TabTrigger>
        </BarraAbas>
      </TabList>
    </Tabs>
  );
}

function BarraAbas(props: TabListProps) {
  const theme = useTheme();
  return (
    <View {...props} style={styles.envolve}>
      <View style={[styles.barra, { borderColor: theme.border }]}>
        <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.backgroundElement }]} />
        {props.children}
      </View>
    </View>
  );
}

function DesenhaIcone({ nome, cor }: { nome: NomeIcone; cor: string }) {
  if (nome === 'casa') return <IconeCasa cor={cor} />;
  if (nome === 'circulos') return <IconeCirculos cor={cor} />;
  if (nome === 'alvo') return <IconeAlvo cor={cor} />;
  return <IconePessoa cor={cor} />;
}

function BotaoAba({
  children,
  isFocused,
  icone,
  ...props
}: TabTriggerSlotProps & { icone: NomeIcone }) {
  const theme = useTheme();
  const cor = isFocused ? theme.primary : theme.textSecondary;

  return (
    <Pressable {...props} style={({ pressed }) => [styles.botao, pressed && styles.pressed]}>
      <View style={[styles.botaoInterno, isFocused && { backgroundColor: theme.backgroundSelected }]}>
        <DesenhaIcone nome={icone} cor={cor} />
        <ThemedText style={[styles.rotulo, { color: cor }]}>{children}</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: { height: '100%' },
  envolve: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: Spacing.three,
    paddingBottom: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: Radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 10,
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  botao: { borderRadius: Radius.md },
  botaoInterno: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
  },
  rotulo: { fontSize: 10, fontWeight: '500' },
  pressed: { opacity: 0.7 },
});
