import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1A2A3A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>About App</Text>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.logoSection}>
                        <Ionicons name="scan-circle" size={80} color="#FF8008" />
                        <Text style={styles.appName}>Cattle Sense</Text>
                        <Text style={styles.version}>Version 1.0.0 (Beta)</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Overview</Text>
                        <Text style={styles.text}>
                            Cattle Sense is an AI-powered breed identification tool designed to assist Front Line Workers in accurately registering indigenous cattle and buffalo breeds in the Bharat Pashudhan application.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>AI Model Info</Text>
                        <Text style={styles.text}>
                            Trained on 8,500+ verified images across 50 Indian breeds.
                            Optimized for field conditions including low light, side profiles, and rural backgrounds.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Credits</Text>
                        <Text style={styles.text}>
                            Developed by: Vivek Team{'\n'}
                            Dataset: Indian Buffalo & Cattle Dataset (Kaggle){'\n'}
                            Framework: React Native + FastAPI
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A2A3A',
    },
    content: {
        padding: 24,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 16,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A2A3A',
        marginTop: 16,
    },
    version: {
        fontSize: 14,
        color: '#5B6B7C',
        marginTop: 4,
    },
    section: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A2A3A',
        marginBottom: 8,
    },
    text: {
        fontSize: 14,
        color: '#5B6B7C',
        lineHeight: 22,
    },
});
