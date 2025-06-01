import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Stack, useRouter, useSegments } from 'expo-router';
import { Pressable } from 'react-native';

import { colors } from '@/utils/twconfig';

export default function AppLayout() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const segments = useSegments();
  const inAuth = segments[1] === '(auth)';

  if (isSignedIn && inAuth) {
    return <Redirect href={'/projects'} />;
  }

  return (
    <Stack>
      <Stack.Protected guard={!!isSignedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modal)/create"
          options={{
            presentation: 'formSheet',
            animation: 'slide_from_bottom',
            sheetAllowedDetents: [0.3],
            contentStyle: {
              backgroundColor: colors.dark,
            },
            sheetGrabberVisible: false,
            sheetCornerRadius: 20,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(modal)/filelist"
          options={{
            headerTitle: 'Library',
            headerStyle: {
              backgroundColor: colors.dark,
            },
            headerTitleStyle: {
              color: colors.white,
              fontSize: 20,
              fontFamily: 'Poppins_600SemiBold',
            },
            presentation: 'fullScreenModal',
            headerLeft: () => (
              <Pressable onPress={() => router.dismissAll()}>
                <Ionicons name="close-outline" size={24} color="white" />
              </Pressable>
            ),
          }}
        />
        <Stack.Screen
          name="(modal)/project/[id]"
          options={{
            headerStyle: {
              backgroundColor: colors.dark,
            },
            headerTitleStyle: {
              color: colors.white,
              fontFamily: 'Poppins_600SemiBold',
            },
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
            headerLeft: () => (
              <Pressable onPress={() => router.dismissAll()}>
                <Ionicons name="close-outline" size={28} color="white" />
              </Pressable>
            ),
          }}
        />
      </Stack.Protected>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}
