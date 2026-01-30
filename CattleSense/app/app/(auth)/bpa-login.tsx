import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function BPALoginScreen() {
    const router = useRouter();
    const [bpaId, setBpaId] = useState('');
    const [password, setPassword] = useState('');

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" backgroundColor="#1A237E" />
            <View style={styles.headerBackground}>
                <SafeAreaView>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Bharat Pashudhan</Text>
                    <Text style={styles.headerSubtitle}>Official Integration Portal</Text>
                </SafeAreaView>
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.loginTitle}>BPA Authorization</Text>
                    <Text style={styles.loginDesc}>
                        Login using your government issued BPA ID and Password.
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>BPA Agent ID</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: BPA-2024-XXXX"
                            value={bpaId}
                            onChangeText={setBpaId}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            placeholder="Enter password"
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => router.replace('/(tabs)')}
                    >
                        <Text style={styles.loginButtonText}>Secure Login</Text>
                        <Ionicons name="lock-closed" size={18} color="#FFF" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Ionicons name="shield-checkmark" size={20} color="#5B6B7C" />
                    <Text style={styles.footerText}>Secure Government Gateway</Text>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    headerBackground: {
        backgroundColor: '#1A237E', // Government Blue
        paddingHorizontal: 24,
        paddingBottom: 60,
        paddingTop: 10,
    },
    backButton: {
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 4,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        marginTop: -40,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    loginTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A2A3A',
        marginBottom: 8,
    },
    loginDesc: {
        fontSize: 14,
        color: '#5B6B7C',
        marginBottom: 24,
        lineHeight: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#5B6B7C',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E6ED',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1A2A3A',
        backgroundColor: '#FAFBFC',
    },
    loginButton: {
        backgroundColor: '#1A237E',
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#5B6B7C',
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
    },
});
