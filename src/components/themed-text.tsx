import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor, Tracking } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Escala tipográfica tirada da referência de design.
 *
 * Os nomes descrevem o PAPEL, não o tamanho: `titulo` continua sendo o título
 * mesmo se um dia encolher. Trocar `type` por um estilo solto é o caminho mais
 * curto pra tela ficar fora do sistema.
 */
export type ThemedTextProps = TextProps & {
  type?:
    | 'corpo' // Karla 13.5 — texto padrão
    | 'lede' // Karla 14.5 — o parágrafo de abertura, logo abaixo do título
    | 'titulo' // Fraunces 600 34 — título de tela
    | 'destaque' // Fraunces 500 itálico 23 — título de cartão em evidência
    | 'subtitulo' // Fraunces 500 itálico 19 — divisor de seção com voz
    | 'forte' // Karla 700 — botões e ênfase
    | 'rotulo' // Space Mono caixa alta — sobrancelhas e rótulos de seção
    | 'contagem' // Space Mono pequeno — números ao lado de rótulos
    | 'nota'; // Karla 11.5 — legendas e apoios
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'corpo', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        styles[type],
        // Cor padrão por papel: rótulo e nota nascem apagados, porque quase
        // sempre é isso que se quer — e ainda dá pra sobrescrever com themeColor.
        (type === 'rotulo' || type === 'nota' || type === 'lede') &&
          !themeColor && { color: theme.textSecondary },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  corpo: { fontFamily: Fonts.sans, fontSize: 13.5, lineHeight: 21 },
  lede: { fontFamily: Fonts.sans, fontSize: 14.5, lineHeight: 22 },
  titulo: { fontFamily: Fonts.display, fontSize: 34, lineHeight: 40, letterSpacing: -0.34 },
  destaque: { fontFamily: Fonts.displayItalico, fontSize: 23, lineHeight: 29 },
  subtitulo: { fontFamily: Fonts.displayItalico, fontSize: 19, lineHeight: 25 },
  forte: { fontFamily: Fonts.sansForte, fontSize: 12.5, lineHeight: 17 },
  rotulo: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: Tracking.mono,
    textTransform: 'uppercase',
  },
  contagem: { fontFamily: Fonts.mono, fontSize: 10, lineHeight: 14 },
  nota: { fontFamily: Fonts.sans, fontSize: 11.5, lineHeight: 15 },
});
