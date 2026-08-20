import {
  Fraunces_500Medium,
  Fraunces_500Medium_Italic,
  Fraunces_600SemiBold,
} from '@expo-google-fonts/fraunces';
import { Karla_400Regular, Karla_500Medium, Karla_700Bold } from '@expo-google-fonts/karla';
import { SpaceMono_400Regular, SpaceMono_700Bold } from '@expo-google-fonts/space-mono';
import { useFonts } from 'expo-font';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

/**
 * Stack raiz. As abas são um grupo (`(tabs)`) porque o app tem telas que não
 * pertencem a nenhuma aba: onboarding, conversa e ajustes.
 *
 * O app é escuro sempre — é o que a referência de design define. Por isso o
 * ThemeProvider recebe DarkTheme fixo em vez de seguir o esquema do sistema:
 * meio app claro e meio escuro seria pior que qualquer um dos dois.
 */
export default function RootLayout() {
  const theme = Colors.dark;

  const [fontesProntas, erroFontes] = useFonts({
    Fraunces_500Medium,
    Fraunces_500Medium_Italic,
    Fraunces_600SemiBold,
    Karla_400Regular,
    Karla_500Medium,
    Karla_700Bold,
    SpaceMono_400Regular,
    SpaceMono_700Bold,
  });

  // A splash só sai quando as fontes carregam — sem isso a tela aparece com a
  // fonte do sistema e "pula" pra serifada um instante depois. Se o
  // carregamento falhar, também soltamos a splash: fonte feia é melhor que
  // tela travada pra sempre.
  useEffect(() => {
    if (fontesProntas || erroFontes) SplashScreen.hideAsync();
  }, [fontesProntas, erroFontes]);

  if (!fontesProntas && !erroFontes) return null;

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        <Stack.Screen name="conversa/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen
          name="configuracoes"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack>
    </ThemeProvider>
  );
}
