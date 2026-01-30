import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import * as Linking from 'expo-linking';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Handle the deep link to extract the session
        const handleDeepLink = async (url: string) => {
            try {
                // Supabase sends tokens in the hash parameters (after #)
                // e.g. lifeflow://reset-password#access_token=...&refresh_token=...&type=recovery
                if (url && url.includes('access_token')) {
                    const params = new URLSearchParams(url.split('#')[1]);
                    const accessToken = params.get('access_token');
                    const refreshToken = params.get('refresh_token');

                    if (accessToken && refreshToken) {
                        const { error } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        });
                        if (error) {
                            Alert.alert("Error", "Invalid link or expired.");
                        }
                    }
                }
            } catch (e) {
                console.error("Deep link parsing error", e);
            }
        };

        Linking.getInitialURL().then((url) => {
            if (url) handleDeepLink(url);
        });

        const subscription = Linking.addEventListener('url', ({ url }) => {
            handleDeepLink(url);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const updatePassword = async () => {
        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password: password });
        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('Success', 'Password updated successfully!');
            router.replace('/(auth)/login');
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Enter your new password below.</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="••••••••••"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={updatePassword}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? "Updating..." : "Update Password"}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        paddingTop: 60,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 32,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        color: '#1F2937',
        backgroundColor: '#FAFAFA',
    },
    button: {
        backgroundColor: '#4A6CF7',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
