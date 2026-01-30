import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, layout } from '../theme/spacing';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    style,
    leftIcon,
}) => {
    const getBackgroundColor = () => {
        if (disabled) return colors.surfaceVariant;
        switch (variant) {
            case 'primary': return colors.primary;
            case 'secondary': return colors.secondary;
            case 'outline': return 'transparent';
            case 'ghost': return 'transparent';
            default: return colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return colors.text.tertiary;
        switch (variant) {
            case 'primary': return colors.text.inverse;
            case 'secondary': return colors.text.primary;
            case 'outline': return colors.primary;
            case 'ghost': return colors.primary;
            default: return colors.text.inverse;
        }
    };

    const getBorder = () => {
        if (variant === 'outline' && !disabled) {
            return { borderWidth: 1, borderColor: colors.primary };
        }
        return {};
    };

    const getPadding = () => {
        switch (size) {
            case 'small': return { paddingVertical: spacing.xs, paddingHorizontal: spacing.m };
            case 'large': return { paddingVertical: spacing.m, paddingHorizontal: spacing.l };
            default: return { paddingVertical: spacing.s + 2, paddingHorizontal: spacing.l };
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.container,
                { backgroundColor: getBackgroundColor() },
                getBorder(),
                getPadding(),
                style,
            ]}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <>
                    {leftIcon && <View style={{ marginRight: spacing.s }}>{leftIcon}</View>}
                    <Text style={[styles.text, { color: getTextColor() }]}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: layout.borderRadius.round,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    text: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.sizes.body,
        fontWeight: typography.weights.medium as any,
    },
});
