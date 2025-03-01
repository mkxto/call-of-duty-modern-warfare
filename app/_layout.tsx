import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColorScheme, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/useTheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();

  const [loaded] = useFonts({
    // Using require is necessary for Expo font loading
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      try {
        SplashScreen.hideAsync();
      } catch (error) {
        console.error('Error hiding splash screen:', error);
      }
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="annonce/[id]"
          options={{
            title: "Annonce Details",
            // Use a simple string for the back button
            headerBackTitle: "Back"
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Annonces',
          tabBarIcon: ({ color }) => <FontAwesome name="list" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <FontAwesome name="heart" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
});
