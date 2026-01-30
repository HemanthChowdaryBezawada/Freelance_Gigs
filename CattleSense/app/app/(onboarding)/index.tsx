import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function OnboardingIntro() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <SafeAreaView style={styles.safeArea}>

                {/* Illustration Area */}
                <View style={styles.imageSection}>
                    <View style={styles.greenCircle}>
                        {/* Placeholder for the Cow Illustration - Using a high quality stock vector URL if available or matching style */}
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2395/2395796.png' }}
                            style={styles.cowImage}
                        />
                    </View>
                </View>

                {/* Content Area */}
                <View style={styles.textSection}>
                    <Text style={styles.title}>AI-Powered Breed Identification</Text>

                    <Text style={styles.description}>
                        Instantly identify cattle breeds using advanced AI technology. Accurate, fast, and reliable identification in the field.
                    </Text>

                    {/* Pagination Dots */}
                    <View style={styles.pagination}>
                        <View style={styles.activeDot} />
                        <View style={styles.inactiveDot} />
                    </View>

                    {/* Button */}
                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.8}
                        onPress={() => router.push('/(onboarding)/field-guide')}
                    >
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    safeArea: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    imageSection: {
        flex: 0.55,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    greenCircle: {
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: (width * 0.8) / 2,
        backgroundColor: '#2D5A45', // Dark green background circle
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    cowImage: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    textSection: {
        flex: 0.45,
        paddingHorizontal: 30, // Tighter padding for text
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#0F3D2E', // Dark Green Text
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 34,
    },
    description: {
        fontSize: 16,
        color: '#556960', // Muted green-grey
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    activeDot: {
        width: 32,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#1B4332', // Active Dark Green
        marginRight: 6,
    },
    inactiveDot: {
        width: 32,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#E0E0E0', // Inactive Grey
    },
    button: {
        backgroundColor: '#1B4332', // Dark Green Button
        width: '100%',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#1B4332',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
