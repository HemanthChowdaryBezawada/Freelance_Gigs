import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

import { authService } from '../../services/AuthService';

export const LoginScreen = () => {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        setLoading(true);
        try {
            const success = await authService.signIn(email, password);
            if (success) {
                // Check if user is admin (Simple logic for now - check email)
                // In a real app we would fetch the profile from the 'profiles' table
                if (email.toLowerCase().includes('admin')) {
                    navigation.replace('Admin');
                } else {
                    navigation.replace('Main');
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    <View style={styles.header}>
                        <Text style={styles.welcomeText}>Welcome Back</Text>
                        <Text style={styles.instructionText}>Sign in to continue monitoring</Text>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Email Address"
                            placeholder="doctor@hospital.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            leftIcon={<Mail size={20} color={colors.text.tertiary} />}
                        />
                        <Input
                            label="Password"
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            leftIcon={<Lock size={20} color={colors.text.tertiary} />}
                            rightIcon={
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    {showPassword ?
                                        <EyeOff size={20} color={colors.text.tertiary} /> :
                                        <Eye size={20} color={colors.text.tertiary} />
                                    }
                                </TouchableOpacity>
                            }
                        />

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <Button
                            title={loading ? "Signing In..." : "Sign In"}
                            onPress={handleLogin}
                            disabled={loading}
                            style={styles.loginButton}
                        />
                    </View>

                </ScrollView>

                {/* Footer / Copyright */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Secure Enterprise Login</Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: spacing.l,
    },
    header: {
        marginBottom: spacing.xl,
        marginTop: spacing.xl,
    },
    welcomeText: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.sizes.h1,
        color: colors.primary,
        marginBottom: spacing.xs,
    },
    instructionText: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.sizes.body,
        color: colors.text.secondary,
    },
    sectionTitle: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.sizes.bodySmall,
        color: colors.text.tertiary,
        marginBottom: spacing.m,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
    },
    roleCard: {
        flex: 1,
        backgroundColor: colors.surface,
        padding: spacing.m,
        borderRadius: layout.borderRadius.m,
        alignItems: 'center',
        marginHorizontal: spacing.xs,
        borderWidth: 1,
        borderColor: colors.border,
    },
    roleCardSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.surface, // Or a very light tint
        borderWidth: 2,
    },
    iconContainer: {
        marginBottom: spacing.s,
        opacity: 0.5,
    },
    iconContainerSelected: {
        opacity: 1,
    },
    roleLabel: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.sizes.caption,
        color: colors.text.secondary,
    },
    roleLabelSelected: {
        color: colors.primary,
        fontFamily: typography.fontFamily.bold,
    },
    form: {
        marginBottom: spacing.xl,
    },
    loginButton: {
        marginTop: spacing.l,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: spacing.xs,
    },
    forgotPasswordText: {
        fontFamily: typography.fontFamily.medium,
        color: colors.primary,
        fontSize: typography.sizes.bodySmall,
    },
    footer: {
        padding: spacing.m,
        alignItems: 'center',
    },
    footerText: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.sizes.caption,
        color: colors.text.tertiary,
    },
});
