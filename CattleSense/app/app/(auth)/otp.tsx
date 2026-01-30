import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { verifyOtp, sendOtp } from '@/services/api';
import { useAuthStore } from '../../store/authStore';

export default function OTPScreen() {
    const router = useRouter();
    const { mobile } = useLocalSearchParams<{ mobile: string }>();
    const { login } = useAuthStore();
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputs = useRef<Array<TextInput | null>>([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text.length === 1 && index < 3) {
            inputs.current[index + 1]?.focus();
        }

        if (text.length === 0 && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpString = otp.join('');
        if (otpString.length === 4) {
            setLoading(true);
            try {
                const response = await verifyOtp(mobile || '', otpString);
                if (response.success) {
                    login(mobile || ''); // Save session
                    router.replace('/(onboarding)/permissions');
                } else {
                    alert('Invalid OTP. Please try again.');
                }
            } catch (error) {
                alert('Verification failed. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleResend = async () => {
        try {
            await sendOtp(mobile || '');
            alert('OTP resent successfully!');
        } catch (error) {
            alert('Failed to resend OTP');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <SafeAreaView style={styles.safeArea}>

                {/* Header Area */}
                <View>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#004D40" />
                    </TouchableOpacity>

                    <Text style={styles.headline}>Enter OTP</Text>
                    <Text style={styles.subhead}>
                        We've sent a code to +91 {mobile || '...'}
                    </Text>

                    {/* OTP Inputs */}
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref: TextInput | null) => { inputs.current[index] = ref; }}
                                style={[styles.otpBox, digit ? styles.otpBoxActive : null]}
                                keyboardType="number-pad"
                                maxLength={1}
                                value={digit}
                                onChangeText={(text) => handleChange(text, index)}
                                autoFocus={index === 0}
                                selectionColor="#1B4332"
                            />
                        ))}
                    </View>

                    {/* Resend Link */}
                    <View style={styles.resendContainer}>
                        <Text style={styles.resendText}>Didn't receive code? </Text>
                        <TouchableOpacity onPress={handleResend}>
                            <Text style={styles.resendLink}>Resend OTP</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer Button */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.button, { opacity: otp.every(d => d) ? 1 : 0.7 }]}
                        onPress={handleVerify}
                        disabled={!otp.every(d => d)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>{loading ? "Verifying..." : "Verify"}</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    safeArea: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 20,
        justifyContent: 'space-between',
    },
    backButton: {
        marginBottom: 30,
        alignSelf: 'flex-start',
    },
    headline: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#004D40', // Matches Login, Dark Teal/Green
        marginBottom: 10,
    },
    subhead: {
        fontSize: 16,
        color: '#5B6B7C',
        lineHeight: 22,
        marginBottom: 40,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    otpBox: {
        width: 65,
        height: 65,
        backgroundColor: '#F7FAFC', // Light grey bg like mockup
        borderRadius: 12,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1A2A3A',
        // Slight elevation or border if needed, mockup looks very flat/grey
    },
    otpBoxActive: {
        borderWidth: 1,
        borderColor: '#1B4332',
        backgroundColor: '#FFF',
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    resendText: {
        fontSize: 14,
        color: '#5B6B7C',
    },
    resendLink: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#004D40', // Dark Green
    },
    footer: {
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#1B4332', // Dark Green
        width: '100%',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
