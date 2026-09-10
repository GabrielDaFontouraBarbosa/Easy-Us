import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/kit';
import { Pressavel, useReduzMovimento } from '@/components/ui/motion';
import { type Mensagem } from '@/constants/mock-data';
import { Elevation, Motion, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Message } from "../../../shared/types.ts";
import { socket } from './socket';

export default function Conversa() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { id } = useLocalSearchParams<{ id: string }>();

  const [rascunho, setRascunho] = useState('');
  const [mensagens, setMensagens] = useState<Message[]>([]);

  useEffect(() => {
  const handleMessage = (msg: Message) => {
    setMensagens((oldMessages) => [
      ...oldMessages,
      msg,
    ]);
  };

  socket.on('message', handleMessage);

  return () => {
        socket.off('message', handleMessage);
    };
  }, []);
  
  function enviarMensagem() {
    const texto = rascunho.trim();

    if (!texto) return;

    const mensagem = {
        autor: "user.username",
        texto: texto,
        image: "user.avatar",
        id: socket.id ?? "indefinido",
        hora: Date.now().toString()
    } satisfies Message;

    console.log('Mensagem para enviar:', mensagem);
    socket.emit('message', mensagem);

    /*
     * Futuramente:
     *
     * socket.send(JSON.stringify(mensagem));
     *
     * ou, dependendo da sua implementação:
     *
     * socket.emit('mensagem', mensagem);
     */

    setRascunho('');
  }

  return (
    <KeyboardAvoidingView
      style={[styles.tela, { backgroundColor: theme.background }]}
      behavior={Platform.select({
        ios: 'padding',
        default: undefined,
      })}
      keyboardVerticalOffset={insets.top}
    >
      {/* ---- cabeçalho ---- */}

      <Animated.View
        entering={FadeInUp.duration(Motion.medio)}
        style={[
          styles.cabecalho,
          {
            paddingTop: insets.top + Spacing.two,
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Pressavel
          onPress={() => router.back()}
          accessibilityLabel="Voltar"
          style={[
            styles.voltar,
            { backgroundColor: theme.backgroundElement },
          ]}
        >
          <ThemedText style={styles.voltarGlifo}>‹</ThemedText>
        </Pressavel>

        <View
          style={[
            styles.cabecalhoEmoji,
            { backgroundColor: theme.primary },
          ]}
        >
          <ThemedText style={styles.cabecalhoEmojiGlifo}>
            💬
          </ThemedText>
        </View>

        <View style={styles.cabecalhoTexto}>
          <ThemedText type="forte" numberOfLines={1}>
            Conversa
          </ThemedText>

          <View style={styles.presenca}>
            <View
              style={[
                styles.pontoVivo,
                { backgroundColor: theme.calm },
              ]}
            />

            <ThemedText
              type="corpo"
              themeColor="textSecondary"
            >
              Conectado
            </ThemedText>
          </View>
        </View>
      </Animated.View>

      {/* ---- mensagens ---- */}

      <ScrollView
        style={styles.rolagem}
        contentContainerStyle={[
          styles.conteudo,
          { paddingBottom: Spacing.four },
        ]}
        showsVerticalScrollIndicator={false}
      >
        
        {mensagens.map((mensagem, i) => (
        <Balao
           key={i}
           mensagem={mensagem}
           indice={i}
          />
        ))}
         
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
        ]}
      >
        <View
          style={[
            styles.campo,
            { backgroundColor: theme.surfaceSunken },
          ]}
        >
          <TextInput
            value={rascunho}
            onChangeText={setRascunho}
            placeholder="Escreva no seu tempo..."
            placeholderTextColor={theme.textMuted}
            multiline
            onSubmitEditing={enviarMensagem}
            style={[
              styles.entrada,
              { color: theme.text },
            ]}
          />
        </View>

        <Pressavel
          escala={0.9}
          accessibilityLabel="Enviar"
          onPress={enviarMensagem}
          style={[
            styles.enviar,
            {
              backgroundColor: rascunho.trim()
                ? theme.primary
                : theme.backgroundElement,
            },
          ]}
        >
          <ThemedText style={styles.enviarGlifo}>
            {rascunho.trim() ? '↑' : '🫂'}
          </ThemedText>
        </Pressavel>
      </View>
    </KeyboardAvoidingView>
  );
}


// ---------------------------------------------------------------------------
// Balão de mensagem
// ---------------------------------------------------------------------------

function Balao({
  mensagem,
  indice,
}: {
  mensagem: Mensagem;
  indice: number;
}) {
  const theme = useTheme();
  const reduz = useReduzMovimento();
  const meu = mensagem.id === socket.id;
  const hora = new Date(parseInt(mensagem.hora)).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Animated.View
      entering={
        reduz
          ? FadeIn.duration(Motion.rapido)
          : FadeInDown
              .delay(
                indice * Motion.escada + 160
              )
              .duration(Motion.medio)
              .springify()
              .damping(20)
      }
      style={[
        styles.baoLinha,
        meu && styles.baoLinhaMinha,
      ]}
    >
      {!meu && (
        <Avatar
          nome={mensagem.autor}
          tamanho={34}
          cor={mensagem.cor}
        />
      )}

      <View
        style={[
          styles.baoBloco,
          meu && styles.baoBlocoMeu,
        ]}
      >
        {!meu && (
          <ThemedText
            type="corpo"
            themeColor="textMuted"
            style={styles.autor}
          >
            {mensagem.autor}
          </ThemedText>
        )}

        <View
          style={[
            styles.balao,
            meu
              ? {
                  backgroundColor: theme.primary,
                  borderBottomRightRadius: Radius.sm,
                }
              : {
                  backgroundColor: theme.card,
                  borderBottomLeftRadius: Radius.sm,
                  borderColor: theme.border,
                  borderWidth: StyleSheet.hairlineWidth,
                },
            Elevation.baixa,
          ]}
        >
          <ThemedText
            style={[
              styles.baoTexto,
              {
                color: meu
                  ? theme.onPrimary
                  : theme.text,
              },
            ]}
          >
            {mensagem.texto}
          </ThemedText>
        </View>

        <View
          style={[
            styles.baoRodape,
            meu && styles.baoRodapeMeu,
          ]}
        >
          {mensagem.reacoes?.map((reacao) => (
            <View
              key={reacao.emoji}
              style={[
                styles.reacao,
                {
                  backgroundColor:
                    theme.backgroundElement,
                },
              ]}
            >
              <ThemedText type="corpo">
                {reacao.emoji}
              </ThemedText>

              <ThemedText
                type="corpo"
                themeColor="textSecondary"
              >
                {reacao.total}
              </ThemedText>
            </View>
          ))}

          <ThemedText
            type="corpo"
            themeColor="textMuted"
          >
            {hora}
          </ThemedText>
        </View>
      </View>
    </Animated.View>
  );
}


// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  voltar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  voltarGlifo: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '700',
    marginTop: -3,
  },

  cabecalhoEmoji: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cabecalhoEmojiGlifo: {
    fontSize: 18,
  },

  cabecalhoTexto: {
    flex: 1,
    gap: 1,
  },

  presenca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + 2,
  },

  pontoVivo: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  rolagem: {
    flex: 1,
  },

  conteudo: {
    padding: Spacing.three,
    gap: Spacing.three,
  },

  baoLinha: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
  },

  baoLinhaMinha: {
    justifyContent: 'flex-end',
  },

  baoBloco: {
    flexShrink: 1,
    maxWidth: '82%',
    gap: Spacing.half,
  },

  baoBlocoMeu: {
    alignItems: 'flex-end',
  },

  autor: {
    marginLeft: Spacing.two,
    fontWeight: '600',
  },

  balao: {
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.lg,
  },

  baoTexto: {
    fontSize: 15,
    lineHeight: 21,
  },

  baoRodape: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + 2,
    marginLeft: Spacing.two,
  },

  baoRodapeMeu: {
    justifyContent: 'flex-end',
    marginRight: Spacing.two,
  },

  reacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },

  compositor: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  campo: {
    flex: 1,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },

  entrada: {
    fontSize: 15,
    lineHeight: 21,
    maxHeight: 110,
    paddingVertical: Spacing.two,
  },

  enviar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  enviarGlifo: {
    fontSize: 19,
    fontWeight: '700',
  },
});