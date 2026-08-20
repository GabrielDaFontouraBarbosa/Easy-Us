/**
 * Aura: um brilho radial suave atrás de um elemento.
 *
 * O plano original era desenhar isto com o Skia, que faz degradê radial de
 * verdade. Ele foi descartado: o script de pós-instalação do
 * @shopify/react-native-skia trava no Windows (código 0xC0000409) tentando
 * montar bibliotecas de iOS/macOS, e uma dependência que quebra o `npm install`
 * da máquina não vale um brilho.
 *
 * A aproximação aqui são três círculos concêntricos com opacidade decrescente.
 * Não é um degradê radial matematicamente correto — de perto e sobre fundo liso
 * dá pra notar os degraus. Atrás de um orbe, com opacidades baixas, ninguém vê
 * a diferença. E funciona igual em iOS, Android e web, sem WASM, sem código
 * nativo e sem arquivo pra baixar.
 */

import { StyleSheet, View } from 'react-native';

/**
 * Camadas do falso degradê. São 7 em vez de 3 porque com poucas as bordas de
 * cada círculo aparecem como anéis — visível sobretudo em auras grandes, como a
 * do onboarding. Cada camada é pouco opaca e elas se somam: o acúmulo no centro
 * imita a curva de um degradê radial.
 */
const CAMADAS = Array.from({ length: 7 }, (_, i) => {
  const t = i / 6; // 0 = maior e mais fraca, 1 = menor e mais forte
  return { escala: 1 - t * 0.78, peso: 0.06 + t * 0.1 };
});

export function Aura({
  cor,
  tamanho,
  intensidade = 0.5,
}: {
  cor: string;
  tamanho: number;
  intensidade?: number;
}) {
  return (
    <View
      pointerEvents="none"
      // Ancorada no CENTRO do elemento pai, não no canto: `position:absolute`
      // sozinho gruda em top/left e joga o brilho pra fora do orbe. O 50% leva
      // ao centro do pai e as margens negativas recuam metade da própria aura.
      style={[
        styles.envolve,
        { width: tamanho, height: tamanho, marginTop: -tamanho / 2, marginLeft: -tamanho / 2 },
      ]}>
      {CAMADAS.map((camada) => {
        const lado = tamanho * camada.escala;
        return (
          <View
            key={camada.escala.toFixed(3)}
            style={[
              styles.camada,
              {
                width: lado,
                height: lado,
                borderRadius: lado / 2,
                backgroundColor: aplicarOpacidade(cor, intensidade * camada.peso),
              },
            ]}
          />
        );
      })}
    </View>
  );
}

/**
 * Converte qualquer cor do theme.ts (#RGB, #RRGGBB ou rgba(...)) para rgba com
 * o alfa pedido. É a única maneira de derivar transparência de um token sem
 * duplicar a cor no tema.
 */
export function aplicarOpacidade(cor: string, alfa: number) {
  if (cor.startsWith('rgba')) return cor.replace(/[\d.]+\)$/, `${alfa})`);
  if (cor.startsWith('rgb(')) return cor.replace('rgb(', 'rgba(').replace(')', `, ${alfa})`);
  const hex = cor.replace('#', '');
  const completo = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
  const n = parseInt(completo, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alfa})`;
}

const styles = StyleSheet.create({
  envolve: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camada: { position: 'absolute' },
});
