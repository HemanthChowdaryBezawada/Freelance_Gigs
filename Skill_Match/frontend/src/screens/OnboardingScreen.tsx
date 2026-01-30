
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, ChevronRight, ChevronLeft, MapPin, DollarSign } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }: any) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = [
        {
            id: '1',
            title: 'Welcome to SkillMatch',
            description: 'Your intelligent job-finding companion. We use AI to match you with the perfect opportunities based on your skills and preferences.',
            icon: <Box size={80} color="#3B82F6" strokeWidth={1} />
        },
        {
            id: '2',
            title: 'Find Jobs Nearby',
            description: 'Discover opportunities close to home with our interactive map view. See job locations, commute times, and apply with one tap.',
            icon: <MapPin size={80} color="#10B981" strokeWidth={1} /> // Greenish for map
        },
        {
            id: '3',
            title: 'AI-Powered Matching',
            description: 'Our smart algorithm analyzes your skills, experience, and preferences to recommend jobs with the highest match percentage.',
            icon: <DollarSign size={80} color="#3B82F6" strokeWidth={1} /> // Used DollarSign to match the visual 'S' shape in User's screenshot
        },
        {
            id: '4',
            title: 'Easy Applications',
            description: 'Apply to multiple jobs with a single profile. Track your application status in real-time.',
            icon: <Box size={80} color="#3B82F6" strokeWidth={1} />
        }
    ];

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            navigation.navigate('Subscription');
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleSkip = () => {
        navigation.navigate('Subscription');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>

                {/* Illustration Area */}
                <View style={[styles.illustrationContainer]}>
                    <View style={[styles.iconCircle, currentIndex === 1 && { backgroundColor: '#D1FAE5' }]}>
                        {/* Dynamic background color for 2nd slide to match screenshot green tint */}
                        {slides[currentIndex].icon}
                    </View>
                </View>

                {/* Text Content */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{slides[currentIndex].title}</Text>
                    <Text style={styles.description}>
                        {slides[currentIndex].description}
                    </Text>
                </View>

                {/* Pagination Dots */}
                <View style={styles.pagination}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                { backgroundColor: index === currentIndex ? '#2563EB' : '#D1D5DB' }
                            ]}
                        />
                    ))}
                </View>

            </View>

            {/* Footer Navigation */}
            <View style={styles.footer}>
                {currentIndex === 0 ? (
                    <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <ChevronLeft size={24} color="#111827" />
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
                    <Text style={styles.nextText}>{currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}</Text>
                    <ChevronRight size={20} color="white" />
                </TouchableOpacity>
            </View>
            <Text style={styles.poweredBy}>Powered by SIMATS</Text>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    illustrationContainer: {
        marginBottom: 40,
    },
    iconCircle: {
        width: width * 0.7,
        height: width * 0.7,
        borderRadius: 40,
        backgroundColor: '#E0F2FE', // Default Light blue
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    pagination: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        paddingBottom: 40,
        width: '100%',
    },
    skipButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    skipText: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },
    backButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    nextButton: {
        backgroundColor: '#0066FF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 12,
        gap: 8,
        shadowColor: '#0066FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    nextText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    poweredBy: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#9CA3AF',
        fontSize: 12,
    },
});

export default OnboardingScreen;
