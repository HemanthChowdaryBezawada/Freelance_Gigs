import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SubscriptionModule from '@/modules/SubscriptionModule';

export default function OnboardingPermissions() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <SafeAreaView style={styles.safeArea}>

                <View style={styles.content}>
                    <Text style={styles.headline}>App Permissions</Text>
                    <Text style={styles.bodyText}>
                        We need these permissions to provide the best experience
                    </Text>

                    <View style={styles.permissionsList}>
                        {/* Camera Item */}
                        <View style={styles.itemRow}>
                            <View style={styles.iconBox}>
                                <Ionicons name="camera" size={24} color="#1B4332" />
                            </View>
                            <View style={styles.textColumn}>
                                <Text style={styles.itemTitle}>Camera Access</Text>
                                <Text style={styles.itemDesc}>Required to capture cattle photos for breed identification</Text>
                            </View>
                        </View>

                        {/* Photo Library Item */}
                        <View style={styles.itemRow}>
                            <View style={styles.iconBox}>
                                <Ionicons name="images" size={24} color="#1B4332" />
                            </View>
                            <View style={styles.textColumn}>
                                <Text style={styles.itemTitle}>Photo Library</Text>
                                <Text style={styles.itemDesc}>Access to select existing photos from your gallery</Text>
                            </View>
                        </View>

                        {/* Location Item */}
                        <View style={styles.itemRow}>
                            <View style={styles.iconBox}>
                                <Ionicons name="location" size={24} color="#1B4332" />
                            </View>
                            <View style={styles.textColumn}>
                                <Text style={styles.itemTitle}>Location</Text>
                                <Text style={styles.itemDesc}>Tag records with location for better tracking</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            router.replace('/(tabs)');
                            // Open subscription screen after a short delay to ensure navigation handles
                            setTimeout(() => {
                                try {
                                    SubscriptionModule?.openSubscriptionScreen();
                                } catch (e) {
                                    console.log("Subscription module not found (dev client required)");
                                }
                            }, 500);
                        }}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Allow All</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        router.replace('/(tabs)');
                        setTimeout(() => {
                            try {
                                SubscriptionModule?.openSubscriptionScreen();
                            } catch (e) {
                                console.log("Subscription module not found (dev client required)");
                            }
                        }, 500);
                    }} style={styles.skipButton}>
                        <Text style={styles.skipText}>Skip for Now</Text>
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
        paddingHorizontal: 24,
        paddingVertical: 20,
        justifyContent: 'space-between',
    },
    content: {
        marginTop: 40,
    },
    headline: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#004D40', // Dark Green
        marginBottom: 10,
    },
    bodyText: {
        fontSize: 16,
        color: '#5B6B7C',
        lineHeight: 22,
        marginBottom: 40,
    },
    permissionsList: {
        gap: 24,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconBox: {
        width: 50,
        height: 50,
        backgroundColor: '#E8F5E9', // Light green background matching screenshot
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textColumn: {
        flex: 1,
        paddingTop: 2,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#002E25', // Very dark green/black
        marginBottom: 4,
    },
    itemDesc: {
        fontSize: 14,
        color: '#5B6B7C',
        lineHeight: 20,
    },
    footer: {
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#1B4332', // Dark Green
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    skipButton: {
        alignItems: 'center',
        padding: 8,
    },
    skipText: {
        color: '#004D40',
        fontSize: 16,
        fontWeight: '600',
    },
});
