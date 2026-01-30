
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useUserStore } from '../store/userStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Briefcase } from 'lucide-react-native';

const WelcomeScreen = ({ navigation }: any) => {
    const setRole = useUserStore((state) => state.setRole);

    const handleRoleSelect = (role: 'SEEKER' | 'EMPLOYER') => {
        setRole(role);
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>SM</Text>
                </View>
                <Text style={styles.brandName}>SkillMatch</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Welcome to SkillMatch</Text>
                <Text style={styles.subtitle}>
                    Connect with the perfect job opportunities that match your skills and preferences.
                </Text>

                <Text style={styles.prompt}>I am a:</Text>

                <View style={styles.cardContainer}>
                    <TouchableOpacity
                        style={[styles.card, styles.seekerCard]}
                        onPress={() => handleRoleSelect('SEEKER')}
                    >
                        <View style={[styles.iconCircle, styles.seekerIconCircle]}>
                            <Settings color="white" size={32} />
                        </View>
                        <Text style={[styles.cardText, styles.seekerText]}>Job Seeker</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.card, styles.employerCard]}
                        onPress={() => handleRoleSelect('EMPLOYER')}
                    >
                        <View style={[styles.iconCircle, styles.employerIconCircle]}>
                            <Briefcase color="white" size={32} />
                        </View>
                        <Text style={[styles.cardText, styles.employerText]}>Employer</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.poweredBy}>Powered by SIMATS</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Black background for top part as seen in image
    },
    header: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 40,
        backgroundColor: 'black',
    },
    logoContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    logoText: {
        color: '#007AFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    brandName: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
        lineHeight: 20,
    },
    prompt: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 20,
        color: '#333',
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 15,
    },
    card: {
        flex: 1,
        height: 150,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    seekerCard: {
        borderColor: '#007AFF', // Blue border
        backgroundColor: '#F0F8FF', // Light blue bg
    },
    employerCard: {
        borderColor: '#00C853', // Green border
        backgroundColor: '#E8F5E9', // Light green bg
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    seekerIconCircle: {
        backgroundColor: '#007AFF',
    },
    employerIconCircle: {
        backgroundColor: '#00C853',
    },
    cardText: {
        fontWeight: '600',
    },
    seekerText: {
        color: '#007AFF',
    },
    employerText: {
        color: '#00C853',
    },
    loginLink: {
        marginTop: 'auto',
        marginBottom: 20,
    },
    loginLinkText: {
        color: '#2563EB',
        fontWeight: '600',
    },
    poweredBy: {
        textAlign: 'center',
        marginTop: 'auto',
        color: '#9CA3AF',
        fontSize: 12,
        paddingBottom: 10
    },
});

export default WelcomeScreen;
