
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { supabase } from '../services/supabase';
import { ManualSupabase } from '../services/ManualSupabase'; // Import Manual Service
import { useUserStore } from '../store/userStore';

const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);


    const role = useUserStore((state) => state.role);
    const userId = useUserStore((state) => state.userId);
    const setRole = useUserStore((state) => state.setRole); // Add this line
    const setUserId = useUserStore((state) => state.setUserId);
    const displayRole = role === 'SEEKER' ? 'Job Seeker' : role === 'EMPLOYER' ? 'Employer' : 'User';

    const setUserRole = useUserStore((state) => state.setRole);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter email and password");
            return;
        }

        setLoading(true);

        try {
            // Use ManualSupabase to bypass network library issues
            const { data, error } = await ManualSupabase.signIn(email, password);

            if (error) {
                Alert.alert("Login Failed", error.message);
                setLoading(false);
                return;
            }

            if (data && data.session) {
                const { access_token, refresh_token } = data.session;
                await supabase.auth.setSession({ access_token, refresh_token });
            }

            if (data && data.user) {
                setUserId(data.user.id);
                // Fetch profile to get role
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', data.user.id)
                    .single();

                if (profileError) {
                    // Fallback using metadata if profile fetch fails (e.g. RLS issue or trigger delay)
                    const metaRole = data.user.user_metadata?.role;
                    if (metaRole) {
                        const appRole = metaRole.toUpperCase() === 'EMPLOYER' ? 'EMPLOYER' : 'SEEKER';
                        setUserRole(appRole);
                        if (appRole === 'EMPLOYER') {
                            navigation.replace('EmployerMain');
                        } else {
                            navigation.replace('Main');
                        }
                    } else {
                        // Default to Seeker if unknown
                        setUserRole('SEEKER');
                        navigation.replace('Main');
                    }
                } else {
                    const rawRole = (profile.role || '').toUpperCase();
                    const appRole = rawRole === 'EMPLOYER' ? 'EMPLOYER' : 'SEEKER';
                    setUserRole(appRole);

                    // Navigate based on role
                    if (appRole === 'EMPLOYER') {
                        navigation.replace('EmployerMain'); // Go to Employer Dashboard
                    } else {
                        navigation.replace('Main'); // Go to Seeker Home
                    }
                }
            }

        } catch (err: any) {
            Alert.alert("Error", err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert("Input Required", "Please enter your email address to reset your password.");
            return;
        }

        setLoading(true);
        try {
            const { error } = await ManualSupabase.resetPasswordForEmail(email);
            if (error) {
                Alert.alert("Error", error.message);
            } else {
                Alert.alert("Success", "Password reset instructions have been sent to your email.");
            }
        } catch (err) {
            Alert.alert("Error", "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Welcome')} style={styles.backButton}>
                    <ChevronLeft color="#000" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Login</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>
                    Login as a  <Text style={styles.roleText}>{displayRole}</Text>
                </Text>

                {/* Toggle Button */}


                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email Address <Text style={styles.required}>*</Text></Text>
                    <View style={styles.inputWrapper}>
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

                    <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder="Enter your password"
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.loginButtonText}>{loading ? 'Logging In...' : 'Login'}</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.createAccountText}>Create Account</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.poweredBy}>Powered by SIMATS</Text>

            </KeyboardAvoidingView>
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
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 30,
        textAlign: 'center',
    },
    roleText: {
        color: '#6B7280',
        fontWeight: 'normal',
    },

    inputContainer: {
        gap: 8,
        marginBottom: 30,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 4,
    },
    required: {
        color: '#EF4444',
    },
    inputWrapper: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
    },
    input: {
        borderRadius: 8,
        paddingHorizontal: 16,
        height: 50,
        fontSize: 16,
        color: '#111827',
        backgroundColor: '#F9FAFB', // Keeping it light grey for contrast
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: -8,
    },
    forgotPasswordText: {
        color: '#2563EB',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#2563EB', // Blue-600 match image
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    loginButtonText: {
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
    createAccountText: {
        color: '#2563EB',
        fontSize: 14,
        fontWeight: 'bold',
    },
    poweredBy: {
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 10,
        color: '#9CA3AF',
        fontSize: 12,
    },
});

export default LoginScreen;
