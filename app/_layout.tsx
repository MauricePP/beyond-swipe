import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background.default },
          animation: 'slide_from_right',
        }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/index" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="onboarding/preferences" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="onboarding/wishlist" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="onboarding/photos" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="auth/signup" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="auth/reset-password" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="date/planning" options={{ presentation: 'modal' }} />
          <Stack.Screen name="profile/edit" options={{ presentation: 'modal' }} />
          <Stack.Screen name="safety/contacts" options={{ presentation: 'modal' }} />
          <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
        </Stack>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.default,
  },
  loadingText: {
    fontSize: 18,
    color: Colors.primary.main,
  },
});
