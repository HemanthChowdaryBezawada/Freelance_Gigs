import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { layout, spacing } from '../theme/spacing';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    variant?: 'elevated' | 'outlined' | 'filled';
}

export const Card: React.FC<CardProps> = ({ children, style, variant = 'elevated' }) => {
    const getStyle = () => {
        switch (variant) {
            case 'outlined':
                return styles.outlined;
            case 'filled':
                return styles.filled;
            default:
                return styles.elevated;
        }
    };

    return (
        <View style={[styles.base, getStyle(), style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    base: {
        padding: spacing.m,
        borderRadius: layout.borderRadius.l,
        backgroundColor: colors.surface,
    },
    elevated: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    outlined: {
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: 'transparent',
    },
    filled: {
        backgroundColor: colors.surfaceVariant,
    },
});
