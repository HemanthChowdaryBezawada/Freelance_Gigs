import React from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, layout } from '../theme/spacing';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    containerStyle,
    style,
    leftIcon,
    rightIcon,
    ...props
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputWrapper,
            error ? styles.inputError : null,
            { backgroundColor: (style as any)?.backgroundColor || colors.surface }
            ]}>
                {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
                <TextInput
                    style={[
                        styles.input,
                        style,
                        // Override background since wrapper handles it
                        { backgroundColor: 'transparent', borderWidth: 0, flex: 1 }
                    ]}
                    placeholderTextColor={colors.text.tertiary}
                    {...props}
                />
                {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.m,
    },
    label: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.sizes.bodySmall,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: layout.borderRadius.m,
        paddingHorizontal: spacing.s,
    },
    input: {
        flex: 1,
        paddingVertical: spacing.m, // Changed from padding to paddingVertical
        paddingHorizontal: 0, // Added paddingHorizontal
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.sizes.body,
        color: colors.text.primary,
    },
    inputError: {
        borderColor: colors.error,
    },
    leftIcon: {
        marginRight: spacing.xs,
        marginLeft: spacing.xs,
    },
    rightIcon: {
        marginLeft: spacing.xs,
        marginRight: spacing.xs,
    },
    error: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.sizes.caption,
        color: colors.error,
        marginTop: spacing.xs,
    },
});
