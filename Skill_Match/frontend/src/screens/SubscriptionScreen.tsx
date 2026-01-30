import React, { useEffect, useState, Platform } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'; // Removed unused imports
import { LinearGradient } from 'expo-linear-gradient';
import { Zap, Check } from 'lucide-react-native'; // Removed Gem
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants, { ExecutionEnvironment } from 'expo-constants'; // Import Expo Constants

// Define types locally or import type only
import type { SubscriptionPurchase, ProductPurchase, PurchaseError } from 'react-native-iap';

const SubscriptionScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const [realSubscriptionAvailable, setRealSubscriptionAvailable] = useState(false);
    const [testProductAvailable, setTestProductAvailable] = useState(false);
    const [isExpoGo, setIsExpoGo] = useState(false);

    // IAP Module Reference (loaded dynamically)
    const [RNIap, setRNIap] = useState<any>(null);

    // SKUs
    const subscriptionSkus = Platform.select({
        android: ['univault_premium_subscription'],
        default: [],
    });

    const testSkus = Platform.select({
        android: ['android.test.purchased'],
        default: [],
    });

    useEffect(() => {
        // Check if running in Expo Go
        const isGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
        setIsExpoGo(isGo);

        if (isGo) {
            console.log("Running in Expo Go: IAP disabled");
            return;
        }

        let purchaseUpdateSubscription: any = null;
        let purchaseErrorSubscription: any = null;

        const initializeIAP = async () => {
            try {
                // Dynamic Require to avoid crash in Expo Go
                const IAP = require('react-native-iap');
                setRNIap(IAP); // Store reference

                await IAP.initConnection();
                if (Platform.OS === 'android') {
                    await IAP.flushFailedPurchasesCachedAsPendingAndroid();
                }

                // Listeners
                purchaseUpdateSubscription = IAP.purchaseUpdatedListener(async (purchase: SubscriptionPurchase | ProductPurchase) => {
                    const receipt = purchase.transactionReceipt;
                    if (receipt) {
                        try {
                            if (Platform.OS === 'android') {
                                await IAP.acknowledgePurchaseAndroid({ token: purchase.purchaseToken, developerPayload: purchase.developerPayloadAndroid });
                            } else {
                                await IAP.finishTransaction({ purchase, isConsumable: false });
                            }
                            await onSubscriptionSuccess();
                        } catch (ackErr) {
                            console.warn('ackErr', ackErr);
                        }
                    }
                });

                purchaseErrorSubscription = IAP.purchaseErrorListener((error: PurchaseError) => {
                    setLoading(false);
                    console.warn('purchaseErrorListener', error);
                    if (error.responseCode !== 1) { // 1 = User cancelled
                        Alert.alert('Purchase Failed', error.message);
                    }
                });

                // Fetch Products
                if (subscriptionSkus && subscriptionSkus.length > 0) {
                    try {
                        const subs = await IAP.getSubscriptions({ skus: subscriptionSkus });
                        if (subs && subs.length > 0) setRealSubscriptionAvailable(true);
                    } catch (e) { console.log("Sub fetch failed", e); }
                }

                if (testSkus && testSkus.length > 0) {
                    try {
                        const products = await IAP.getProducts({ skus: testSkus });
                        if (products && products.length > 0) setTestProductAvailable(true);
                    } catch (e) { console.log("Prod fetch failed", e); }
                }

            } catch (err) {
                console.warn("IAP Init Failed:", err);
            }
        };

        initializeIAP();

        return () => {
            if (purchaseUpdateSubscription) purchaseUpdateSubscription.remove();
            if (purchaseErrorSubscription) purchaseErrorSubscription.remove();
            // We can't easily call endConnection inside cleanup if IAP variable is local scope, 
            // but in practice unrelated here. 
            const IAP = require('react-native-iap');
            if (IAP) IAP.endConnection();
        };
    }, []);

    const onSubscriptionSuccess = async () => {
        setLoading(false);
        try {
            await AsyncStorage.setItem('is_premium_user', 'true');
            await AsyncStorage.setItem('subscription_time', Date.now().toString());

            Alert.alert(
                "Subscription Successful!",
                "Welcome to Premium!",
                [{ text: "OK", onPress: () => navigation.replace('AddSkills') }]
            );
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubscribe = async () => {
        setLoading(true);

        // Expo Go Mock Flow
        if (isExpoGo) {
            setTimeout(async () => {
                await onSubscriptionSuccess();
            }, 1000);
            return;
        }

        // Native Flow
        try {
            if (!RNIap) {
                Alert.alert("Error", "IAP not initialized");
                setLoading(false);
                return;
            }

            if (realSubscriptionAvailable && subscriptionSkus && subscriptionSkus.length > 0) {
                await RNIap.requestSubscription({ sku: subscriptionSkus[0] });
            } else if (testProductAvailable && testSkus && testSkus.length > 0) {
                await RNIap.requestPurchase({ sku: testSkus[0] });
            } else {
                // Fallback for testing on device without configured products
                if (__DEV__) {
                    await RNIap.requestPurchase({ sku: 'android.test.purchased' });
                } else {
                    setLoading(false);
                    Alert.alert("Setup Required", "No subscription products found.");
                }
            }
        } catch (err: any) {
            setLoading(false);
            if (err.code !== 'E_USER_CANCELLED') {
                Alert.alert("Error", "Could not start subscription.");
            }
        }
    };

    const handleSkip = () => {
        navigation.replace('AddSkills');
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <LinearGradient colors={['#1F2937', '#0A0E27']} style={styles.gradientOverlay} />

                <View style={styles.contentContainer}>
                    <View style={styles.logoCard}>
                        <View style={styles.logoInner}>
                            <Text style={styles.logoText}>SM</Text>
                            <Text style={styles.sparkle}>✨</Text>
                        </View>
                    </View>

                    <Text style={styles.titleText}>SkillMatch Premium</Text>
                    <View style={styles.premiumBadgeContainer}>
                        <Text style={styles.premiumBadgeText}>PREMIUM</Text>
                    </View>

                    {isExpoGo && (
                        <View style={{ backgroundColor: '#eab308', padding: 10, borderRadius: 8, marginTop: 10 }}>
                            <Text style={{ color: 'black', fontWeight: 'bold' }}>Expo Go Mode: Payment is Simulated</Text>
                        </View>
                    )}

                    <Text style={styles.subtitleText}>
                        Unlock unlimited potential with premium features designed for your success
                    </Text>

                    <View style={styles.featuresContainer}>
                        <View style={styles.featureCard}>
                            <Text style={styles.featureIcon}>⚡</Text>
                            <View style={styles.featureTextParams}>
                                <Text style={styles.featureTitle}>Ad-Free Experience</Text>
                                <Text style={styles.featureSubtitle}>Pure learning, no interruptions</Text>
                            </View>
                            <Check size={24} color="#4CAF50" strokeWidth={3} />
                        </View>

                        <View style={styles.featureCard}>
                            <Text style={styles.featureIcon}>💎</Text>
                            <View style={styles.featureTextParams}>
                                <Text style={styles.featureTitle}>Exclusive Tools</Text>
                                <Text style={styles.featureSubtitle}>Advanced analytics, insights</Text>
                            </View>
                            <Check size={24} color="#4CAF50" strokeWidth={3} />
                        </View>
                    </View>

                    <View style={styles.priceCard}>
                        <Text style={styles.priceText}>₹499 / Year</Text>
                        <Text style={styles.priceSubtitle}>Best Value Offer</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.subscribeButton, loading && { opacity: 0.7 }]}
                        onPress={handleSubscribe}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="black" />
                        ) : (
                            <>
                                <Text style={styles.subscribeButtonText}>{isExpoGo ? "Simulate Purchase" : "Start Premium"}</Text>
                                <Zap size={20} color="black" fill="black" />
                            </>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.termsText}>
                        By continuing, you agree to our Terms & Privacy Policy
                    </Text>

                    <View style={{ height: 60 }} />

                    <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                        <Text style={styles.skipButtonText}>Maybe later</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0E27',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 400,
    },
    contentContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    logoCard: {
        width: 120,
        height: 120,
        backgroundColor: 'white',
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 24,
        marginBottom: 24,
    },
    logoInner: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    logoText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#2563EB',
    },
    sparkle: {
        fontSize: 28,
        position: 'absolute',
        top: 10,
        right: 10,
    },
    titleText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    premiumBadgeContainer: {
        marginTop: 8,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 4,
    },
    premiumBadgeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFD700',
        letterSpacing: 1.5,
    },
    subtitleText: {
        fontSize: 16,
        color: '#B8C5D6',
        textAlign: 'center',
        marginTop: 16,
        marginHorizontal: 12,
        lineHeight: 24,
    },
    featuresContainer: {
        width: '100%',
        marginTop: 40,
        gap: 12,
    },
    featureCard: {
        backgroundColor: '#1A1F3A',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    featureIcon: {
        fontSize: 28,
        width: 48,
        textAlign: 'center',
    },
    featureTextParams: {
        flex: 1,
        marginLeft: 16,
    },
    featureTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
    featureSubtitle: {
        fontSize: 14,
        color: '#7C8AA8',
        marginTop: 4,
    },
    priceCard: {
        width: '100%',
        backgroundColor: '#6C5CE7',
        borderRadius: 24,
        padding: 24,
        marginTop: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 12,
    },
    priceText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    priceSubtitle: {
        fontSize: 14,
        color: 'white',
        opacity: 0.8,
        marginTop: 4,
    },
    subscribeButton: {
        width: '100%',
        height: 64,
        backgroundColor: 'white',
        borderRadius: 32,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 12,
        gap: 8,
    },
    subscribeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    termsText: {
        marginTop: 16,
        fontSize: 12,
        color: '#7C8AA8',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    skipButton: {
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
    skipButtonText: {
        fontSize: 14,
        color: '#7C8AA8',
        textTransform: 'lowercase',
    },
});

export default SubscriptionScreen;
