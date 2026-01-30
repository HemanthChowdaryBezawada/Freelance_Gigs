
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { supabase } from '../services/supabase'; // Keep for other calls if needed, or remove
import { ManualSupabase } from '../services/ManualSupabase'; // Import Manual Service
import { useUserStore } from '../store/userStore';

const SignupScreen = ({ navigation }: any) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const role = useUserStore((state) => state.role);
    const setUserId = useUserStore((state) => state.setUserId);
    // Default to Job Seeker if not set, or format nicely
    const displayRole = role === 'SEEKER' ? 'Job Seeker' : role === 'EMPLOYER' ? 'Employer' : 'User';

    const handleSignup = async () => {
        if (!name || !email || !password || !phone) {
            Alert.alert("Error", "Please fill all required fields");
            return;
        }

        // Basic validation
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            // Using Manual Supabase Fetch to bypass network library issues
            const { data, error } = await ManualSupabase.signUp(email.trim(), password, {
                full_name: name.trim(),
                phone: phone.trim(),
                role: role ? role.toLowerCase() : 'seeker',
            });

            if (error) {
                Alert.alert("Signup Failed", error.message);
                setLoading(false);
                return;
            }

            if (data && data.user) {
                setUserId(data.user.id);
                // Determine 'role' string for logic (userStore might have uppercase)
                const userRole = role ? role.toUpperCase() : 'SEEKER';

                // Navigate based on role
                if (userRole === 'EMPLOYER') {
                    navigation.navigate('EmployerOnboarding');
                } else {
                    navigation.navigate('Onboarding');
                }
            }

        } catch (err: any) {
            Alert.alert("Error", err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#000" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Account</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Join SkillMatch</Text>
                    <Text style={styles.subtitle}>
                        Register as a  <Text style={styles.roleText}>{displayRole}</Text>
                    </Text>
                </View>

                <View style={styles.formContainer}>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            placeholder="Enter your full name"
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            placeholder="Enter your email"
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            placeholder="Enter your phone number"
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            placeholder="Create a password"
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm Password <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            placeholder="Confirm your password"
                            style={styles.input}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                </View>

                <TouchableOpacity
                    style={styles.signupButton}
                    onPress={handleSignup}
                    disabled={loading}
                >
                    <Text style={styles.signupButtonText}>{loading ? 'Creating...' : 'Create Account'}</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginText}>Login</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.poweredBy}>Powered by SIMATS</Text>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 50,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
    },
    roleText: {
        color: '#6B7280', // As per image, simpler
    },
    formContainer: {
        gap: 20,
        marginBottom: 30,
    },
    inputGroup: {
        gap: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    required: {
        color: '#EF4444',
        paddingLeft: 4,
    },
    input: {
        // Image shows just text "Enter your email". Let's give it a subtle bg.
        height: 50,
        fontSize: 16,
        color: '#111827',
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    signupButton: {
        backgroundColor: '#0066FF', // Bright Blue
        height: 52,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    signupButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#6B7280',
        fontSize: 14,
    },
    loginText: {
        color: '#0066FF',
        fontSize: 14,
        fontWeight: 'bold',
        paddingLeft: 4,
    },
    poweredBy: {
        textAlign: 'center',
        marginTop: 24,
        color: '#9CA3AF',
        fontSize: 12,
    },
});

export default SignupScreen;
