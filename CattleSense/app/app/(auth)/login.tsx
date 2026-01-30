import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, StatusBar, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const { sendOtp } = require('@/services/api'); // Dynamic require to avoid circular dependency issues if any, or just clean import up top

    const handleSendOTP = async () => {
        if (phoneNumber.length === 10) {
            setLoading(true);
            try {
                const response = await sendOtp(phoneNumber);
                if (response.success) {
                    // Navigate to OTP with phone number
                    router.push({ pathname: '/(auth)/otp', params: { mobile: phoneNumber } });
                } else {
                    alert('Error: ' + response.message);
                }
            } catch (error) {
                alert('Failed to send OTP. Please check backend.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <SafeAreaView style={styles.safeArea}>

                <View style={styles.content}>
                    {/* Logo Section */}
                    <View style={styles.logoContainer}>
                        <View style={styles.logoBox}>
                            <MaterialCommunityIcons name="cow" size={40} color="#FFF" />
                            {/* Ideally use a Cow icon if available in the set or an image */}
                        </View>
                    </View>

                    {/* Title Section */}
                    <View style={styles.titleSection}>
                        <Text style={styles.headline}>Welcome to Cattle Sense</Text>
                        <Text style={styles.subHeadline}>Enter your mobile number to continue</Text>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formSection}>
                        <Text style={styles.label}>Mobile Number</Text>
                        <View style={styles.inputRow}>
                            <View style={styles.prefixContainer}>
                                <Text style={styles.prefixText}>+91</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter mobile number"
                                placeholderTextColor="#A0AEC0"
                                keyboardType="number-pad"
                                maxLength={10}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                selectionColor="#1B4332"
                            />
                        </View>

                        <Text style={styles.termsText}>
                            By continuing, you agree to our <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>
                        </Text>
                    </View>
                </View>

                {/* Footer Button */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.button, { opacity: phoneNumber.length === 10 ? 1 : 0.7 }]}
                        onPress={handleSendOTP}
                        disabled={phoneNumber.length !== 10}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>{loading ? "Sending..." : "Send OTP"}</Text>
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
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    content: {
        flex: 1,
        marginTop: 60,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoBox: {
        width: 80,
        height: 80,
        backgroundColor: '#1B4332', // Dark Green
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleSection: {
        marginBottom: 40,
    },
    headline: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#004D40', // Deep Teal/Green
        marginBottom: 10,
    },
    subHeadline: {
        fontSize: 16,
        color: '#5B6B7C',
    },
    formSection: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A2A3A',
        marginBottom: 10,
    },
    inputRow: {
        flexDirection: 'row',
        height: 56,
        marginBottom: 20,
    },
    prefixContainer: {
        width: 60,
        backgroundColor: '#F7FAFC',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    prefixText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A2A3A',
    },
    input: {
        flex: 1,
        backgroundColor: '#F7FAFC',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#1A2A3A',
    },
    termsText: {
        fontSize: 13,
        color: '#718096',
        lineHeight: 20,
    },
    link: {
        color: '#718096', // Matching the design which looks standard text color for links often in minimal designs, or let's double check if blue/green. Screenshot text looks greyish.
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
