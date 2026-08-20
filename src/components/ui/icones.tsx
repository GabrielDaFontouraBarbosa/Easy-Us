/**
 * Ícones do Easy Us, traçados a partir dos SVGs da referência de design.
 *
 * São desenhados à mão em vez de virem de uma biblioteca por dois motivos: o
 * mockup tem um traço próprio (linha de 1,6–1,8, cantos vivos, formas
 * geométricas simples) que nenhum pacote reproduz, e assim o app não carrega
 * um catálogo inteiro de ícones para usar sete.
 *
 * Todos aceitam `cor` e `tamanho` e herdam a espessura da referência.
 */

import Svg, { Circle, Path } from 'react-native-svg';

type Props = { cor: string; tamanho?: number; espessura?: number };

export function IconeSino({ cor, tamanho = 15, espessura = 1.6 }: Props) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3a5 5 0 0 0-5 5v3.5c0 1-.4 2-1.1 2.7L4.5 15.7A1 1 0 0 0 5.2 17.5h13.6a1 1 0 0 0 .7-1.8l-1.4-1.5c-.7-.7-1.1-1.7-1.1-2.7V8a5 5 0 0 0-5-5Z"
        stroke={cor}
        strokeWidth={espessura}
      />
      <Path d="M9.5 20a2.5 2.5 0 0 0 5 0" stroke={cor} strokeWidth={espessura} />
    </Svg>
  );
}

export function IconeBusca({ cor, tamanho = 15, espessura = 1.8 }: Props) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={cor} strokeWidth={espessura} />
      <Path d="M21 21l-4.3-4.3" stroke={cor} strokeWidth={espessura} strokeLinecap="round" />
    </Svg>
  );
}

export function IconeSeta({ cor, tamanho = 12, espessura = 2.5 }: Props) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12h14M13 6l6 6-6 6"
        stroke={cor}
        strokeWidth={espessura}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconeCasa({ cor, tamanho = 18, espessura = 1.7 }: Props) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Path d="M4 11.5 12 4l8 7.5" stroke={cor} strokeWidth={espessura} strokeLinejoin="round" />
      <Path
        d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9"
        stroke={cor}
        strokeWidth={espessura}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Dois círculos que se sobrepõem — os "círculos" de apoio do app. */
export function IconeCirculos({ cor, tamanho = 18, espessura = 1.7 }: Props) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Circle cx="9" cy="10" r="4.2" stroke={cor} strokeWidth={espessura} />
      <Circle cx="15.5" cy="13.5" r="4.2" stroke={cor} strokeWidth={espessura} />
    </Svg>
  );
}

/** Alvo concêntrico — ecoa a marca do app (círculo dentro de círculo). */
export function IconeAlvo({ cor, tamanho = 18, espessura = 1.7 }: Props) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8.2" stroke={cor} strokeWidth={espessura} />
      <Circle cx="12" cy="12" r="2" stroke={cor} strokeWidth={espessura} />
    </Svg>
  );
}

export function IconePessoa({ cor, tamanho = 18, espessura = 1.7 }: Props) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8.5" r="3.3" stroke={cor} strokeWidth={espessura} />
      <Path
        d="M5.5 19.5c1.4-3 4-4.5 6.5-4.5s5.1 1.5 6.5 4.5"
        stroke={cor}
        strokeWidth={espessura}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconeVoltar({ cor, tamanho = 18, espessura = 1.8 }: Props) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14.5 5.5 8 12l6.5 6.5"
        stroke={cor}
        strokeWidth={espessura}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconeFechar({ cor, tamanho = 15, espessura = 2 }: Props) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Path d="M6 6l12 12M18 6 6 18" stroke={cor} strokeWidth={espessura} strokeLinecap="round" />
    </Svg>
  );
}

export function IconeEngrenagem({ cor, tamanho = 18, espessura = 1.7 }: Props) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3.2" stroke={cor} strokeWidth={espessura} />
      <Path
        d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6"
        stroke={cor}
        strokeWidth={espessura}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * A marca: um anel maior com um anel menor deslocado dentro. No mockup ela é
 * feita com dois círculos em CSS; aqui vira SVG pra escalar sem perder a
 * espessura do traço.
 */
export function Marca({ corExterna, corInterna, tamanho = 18 }: {
  corExterna: string;
  corInterna: string;
  tamanho?: number;
}) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 18 18" fill="none">
      <Circle cx="9" cy="9" r="8.25" stroke={corExterna} strokeWidth={1.5} />
      <Circle cx="10.5" cy="7.5" r="4.5" stroke={corInterna} strokeWidth={1.5} />
    </Svg>
  );
}
