import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { ArrowLeft } from 'lucide-react-native'; // Assuming Lucide icons are available

import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
    title: string;
    showBack?: boolean;
    onBack?: () => void;
    rightElement?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    showBack,
    onBack,
    rightElement,
}) => {
    const navigation = useNavigation();
    const handleBack = onBack || (() => navigation.goBack());

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <View style={styles.content}>
                <View style={styles.left}>
                    {showBack && (
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <ArrowLeft size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                    )}
                </View>

                <Text style={styles.title} numberOfLines={1}>{title}</Text>

                <View style={styles.right}>
                    {rightElement}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceVariant,
    },
    content: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.m,
    },
    left: {
        width: 48,
        alignItems: 'flex-start',
    },
    right: {
        width: 48,
        alignItems: 'flex-end',
    },
    backButton: {
        padding: spacing.xs,
        marginLeft: -spacing.xs,
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.sizes.h3,
        color: colors.text.primary,
    },
});
