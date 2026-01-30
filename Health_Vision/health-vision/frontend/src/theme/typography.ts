import { Platform } from 'react-native';

export const typography = {
    fontFamily: {
        // We'll use system fonts for now to ensure native feel and performance.
        // Can replace with 'Inter' or 'Roboto' if we load google fonts later.
        regular: Platform.select({ ios: 'System', android: 'sans-serif' }),
        medium: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
        bold: Platform.select({ ios: 'System', android: 'sans-serif-bold' }),
        semiBold: Platform.select({ ios: 'System', android: 'sans-serif' }), // Android handling might need tweak for explicit weights if custom fonts
    },
    weights: {
        regular: '400',
        medium: '500',
        semiBold: '600',
        bold: '700',
    },
    sizes: {
        h1: 32,
        h2: 24,
        h3: 20,
        bodyLarge: 18,
        body: 16,
        bodySmall: 14,
        caption: 12,
    },
    lineHeights: {
        h1: 40,
        h2: 32,
        h3: 28,
        body: 24,
    }
} as const;
