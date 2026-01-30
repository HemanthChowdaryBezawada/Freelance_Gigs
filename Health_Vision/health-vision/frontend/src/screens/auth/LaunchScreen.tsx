import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';

export const LaunchScreen = () => {
    const navigation = useNavigation<any>();

    return (
        <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.container}
        >
            <View style={styles.content}>
                {/* Placeholder for Logo */}
                <View style={styles.logoPlaceholder}>
                    <Text style={styles.logoText}>HV</Text>
                </View>

                <Text style={styles.title}>HealthVision</Text>
                <Text style={styles.subtitle}>AI Video Analysis for Patient Monitoring</Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => navigation.replace('Login')}
                    activeOpacity={0.8}
                >
                    <ArrowRight size={32} color={colors.primary} />
                </TouchableOpacity>

                <Text style={styles.version}>v1.0.0 Enterprise</Text>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    logoPlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.l,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    logoText: {
        fontFamily: typography.fontFamily.bold,
        fontSize: 40,
        color: colors.text.inverse,
    },
    title: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.sizes.h1,
        color: colors.text.inverse,
        marginBottom: spacing.s,
    },
    subtitle: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.sizes.body,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        maxWidth: 300,
    },
    footer: {
        position: 'absolute',
        bottom: spacing.xxl,
        alignItems: 'center',
        width: '100%',
    },
    arrowButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.text.inverse,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.l,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    version: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.sizes.caption,
        color: 'rgba(255,255,255,0.5)',
    },
});
