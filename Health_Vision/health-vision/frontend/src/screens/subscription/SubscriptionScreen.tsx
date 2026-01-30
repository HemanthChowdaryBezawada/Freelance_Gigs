import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BillingService } from '../../services/billing/BillingService';

export const SubscriptionScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        const success = await BillingService.purchasePremium();
        setLoading(false);

        if (success) {
            Alert.alert("Welcome to Premium! ✨", "Your subscription is now active.", [
                { text: "Awesome", onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert("Purchase Failed", "Please try again.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} bounces={false}>
            {/* Background */}
            <LinearGradient
                colors={['#0A0E27', '#1A1F3A']}
                style={styles.background}
            />

            {/* Gradient Overlay */}
            <LinearGradient
                colors={['rgba(108, 92, 231, 0.2)', 'transparent']}
                style={styles.gradientOverlay}
            />

            {/* Floating Logo Card */}
            <View style={styles.logoCardContainer}>
                <View style={styles.logoCard}>
                    <Image
                        source={require('../../../assets/icon.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.floatingBadge}>✨</Text>
                </View>
            </View>

            {/* Title Section */}
            <Text style={styles.title}>HealthVision</Text>
            <View style={styles.premiumBadgeContainer}>
                <Text style={styles.premiumBadgeText}>PREMIUM</Text>
            </View>

            <Text style={styles.subtitle}>
                Unlock unlimited potential with premium features designed for your success
            </Text>

            {/* Features Container */}
            <View style={styles.featuresContainer}>
                {/* Ad-Free Feature */}
                <View style={styles.featureCard}>
                    <Text style={styles.featureEmoji}>⚡</Text>
                    <View style={styles.featureTextContainer}>
                        <Text style={styles.featureTitle}>Ad-Free Experience</Text>
                        <Text style={styles.featureDesc}>Pure learning, no interruptions</Text>
                    </View>
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                </View>

                {/* Exclusive Tools Feature */}
                <View style={styles.featureCard}>
                    <Text style={styles.featureEmoji}>💎</Text>
                    <View style={styles.featureTextContainer}>
                        <Text style={styles.featureTitle}>Exclusive Tools</Text>
                        <Text style={styles.featureDesc}>Advanced analytics, insights</Text>
                    </View>
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                </View>

                {/* AI Analysis Feature */}
                <View style={styles.featureCard}>
                    <Text style={styles.featureEmoji}>🧠</Text>
                    <View style={styles.featureTextContainer}>
                        <Text style={styles.featureTitle}>Unlimited AI Scans</Text>
                        <Text style={styles.featureDesc}>Real-time fall detection monitoring</Text>
                    </View>
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                </View>
            </View>

            {/* Price Card Placeholder (from XML layout logic) */}
            <View style={styles.priceCard}>
                <Text style={styles.priceTitle}>Monthly Plan</Text>
                <Text style={styles.priceAmount}>$9.99<Text style={styles.pricePeriod}>/mo</Text></Text>
            </View>

            {/* Subscribe Button */}
            <TouchableOpacity
                style={styles.subscribeButton}
                onPress={handleSubscribe}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="black" />
                ) : (
                    <Text style={styles.subscribeButtonText}>Start Premium</Text>
                )}
            </TouchableOpacity>

            <Text style={styles.termsText}>
                By continuing, you agree to our Terms & Privacy Policy
            </Text>

            <View style={{ height: 80 }} />

            {/* Skip Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.skipButton}>
                <Text style={styles.skipText}>Maybe later</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: '#0A0E27',
        paddingBottom: 40,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    gradientOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 400,
    },
    logoCardContainer: {
        marginTop: 80,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 24,
    },
    logoCard: {
        width: 120,
        height: 120,
        backgroundColor: 'white',
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    logo: {
        width: 70,
        height: 70,
    },
    floatingBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        fontSize: 28,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 24,
        letterSpacing: 1,
    },
    premiumBadgeContainer: {
        marginTop: 8,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    premiumBadgeText: {
        color: '#FFD700',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1.5,
    },
    subtitle: {
        color: '#B8C5D6',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 16,
        marginHorizontal: 32,
        lineHeight: 24,
    },
    featuresContainer: {
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 40,
    },
    featureCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1F3A',
        padding: 20,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    featureEmoji: {
        fontSize: 28,
        width: 48,
        textAlign: 'center',
    },
    featureTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    featureTitle: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },
    featureDesc: {
        color: '#7C8AA8',
        fontSize: 14,
        marginTop: 4,
    },
    priceCard: {
        width: '90%',
        backgroundColor: '#6C5CE7',
        borderRadius: 24,
        padding: 24,
        marginTop: 20,
        alignItems: 'center',
    },
    priceTitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    priceAmount: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
    },
    pricePeriod: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
    },
    subscribeButton: {
        width: '90%',
        height: 64,
        backgroundColor: 'white',
        borderRadius: 32,
        marginTop: 24,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    },
    subscribeButtonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
    termsText: {
        color: '#7C8AA8',
        fontSize: 12,
        marginTop: 16,
        textAlign: 'center',
    },
    skipButton: {
        padding: 16,
    },
    skipText: {
        color: '#7C8AA8',
        fontSize: 14,
    }
});
