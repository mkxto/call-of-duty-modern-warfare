import { useColorScheme } from 'react-native';
import { ColorSchemeType, getThemeColors } from './Colors';

export function useTheme() {
    const colorScheme = useColorScheme() as ColorSchemeType;
    const colors = getThemeColors(colorScheme);
    const isDark = colorScheme === 'dark';

    return {
        colorScheme,
        colors,
        isDark,
    };
} 
