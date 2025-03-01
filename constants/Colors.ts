/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#FF8C00';
const tintColorDark = '#FFA500';

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#666',
    textTertiary: '#999',
    background: '#fff',
    backgroundSecondary: '#f9f9f9',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    border: '#ddd',
    borderSecondary: '#eee',
    divider: '#ddd',
    cardBackground: '#fff',
    cardBorder: '#ddd',
    heartActive: '#e74c3c',
    success: '#2E7D32',
    error: '#d32f2f',
    warning: '#f57c00',
    info: '#0288d1',
    overlay: 'rgba(0,0,0,0.5)',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#bbb',
    textTertiary: '#999',
    background: '#000',
    backgroundSecondary: '#121212',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#333',
    borderSecondary: '#222',
    divider: '#333',
    cardBackground: '#121212',
    cardBorder: '#333',
    heartActive: '#e74c3c',
    success: '#4CAF50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#29b6f6',
    overlay: 'rgba(0,0,0,0.7)',
  },
};

export type ColorSchemeType = 'light' | 'dark';

export const getThemeColors = (colorScheme: ColorSchemeType | null | undefined) => {
  return Colors[colorScheme ?? 'light'];
};
