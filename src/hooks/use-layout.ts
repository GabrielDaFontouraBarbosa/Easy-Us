/**
 * Breakpoints do Easy Us.
 *
 * O app nasceu desenhado pra celular, e sem isto ele "funciona" no tablet e no
 * navegador do jeito errado: uma coluna de 800px de largura com linhas de texto
 * longas demais pra ler e cartões esticados. Responsivo aqui não é encolher —
 * é decidir quantas colunas cabem e até onde o texto pode crescer.
 */

import { useWindowDimensions } from 'react-native';

export type Tamanho = 'compacto' | 'medio' | 'amplo';

/** Larguras de corte em pixels independentes de densidade. */
const CORTES = { medio: 600, amplo: 900 } as const;

export function useLayout() {
  const { width } = useWindowDimensions();

  const tamanho: Tamanho = width >= CORTES.amplo ? 'amplo' : width >= CORTES.medio ? 'medio' : 'compacto';

  return {
    largura: width,
    tamanho,
    ehCompacto: tamanho === 'compacto',
    /**
     * Largura máxima da coluna de leitura. No amplo ela NÃO acompanha a tela:
     * linha de texto boa tem 60-75 caracteres, e passar disso cansa a leitura
     * mesmo sobrando espaço.
     */
    larguraColuna: tamanho === 'compacto' ? 560 : tamanho === 'medio' ? 640 : 720,
    /** Colunas para grades (temas, conquistas, círculos). */
    colunas: tamanho === 'compacto' ? 2 : tamanho === 'medio' ? 3 : 4,
    /** Respiro lateral: telas maiores merecem margem maior. */
    margem: tamanho === 'compacto' ? 20 : 32,
  };
}
