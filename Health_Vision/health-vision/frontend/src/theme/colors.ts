export const colors = {
    // Brand Colors (Teal/Blue based for trust/health)
    primary: '#006D77', // Deep Teal
    primaryLight: '#83C5BE',
    primaryDark: '#004D54',

    secondary: '#FFDDD2', // Soft Peach/Warmth
    secondaryDark: '#E29578',

    // Semantic Colors
    error: '#BA1A1A',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',

    success: '#2E7D32',
    warning: '#FBC02D',
    info: '#0288D1',

    // Neutral Colors
    background: '#FFFFFF',
    surface: '#F8F9FA', // Very light gray for cards
    surfaceVariant: '#E0E2EC',

    text: {
        primary: '#191C1C', // Almost Black
        secondary: '#3F4948', // Dark Gray
        tertiary: '#6F7978', // Medium Gray
        inverse: '#FFFFFF',
    },

    border: '#CAC4D0',
    transparent: 'transparent',
} as const;

export type Colors = typeof colors;
