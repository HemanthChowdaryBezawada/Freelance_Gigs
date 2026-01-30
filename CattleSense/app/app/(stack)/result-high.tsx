import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Dimensions, StatusBar } from 'react-native';
import { useScanStore } from '@/store/scanStore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResultHighScreen() {
    const router = useRouter();
    const { capturedImage, predictions, resetScan } = useScanStore();

    // Use real predictions from store
    const topPrediction = predictions && predictions.length > 0 ? predictions[0] : { breed: 'Unknown', confidence: 0 };

    const result = {
        breed: topPrediction.breed || 'Unknown',
        category: 'Dairy Cattle', // Placeholder until we have a breed-info map
        type: 'High Yield',       // Placeholder
        confidence: topPrediction.confidence || 0,
    };

    if (!capturedImage) {
        // Fallback or dev testing without image
        // return null; 
    }

    const handleSave = () => {
        // Mock save logic
        alert("Record Saved!");
        resetScan();
        router.replace('/(tabs)/records' as any);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <SafeAreaView style={styles.safeArea}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1B4332" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Analysis Result</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Main Card */}
                    <View style={styles.card}>

                        {/* Image Section */}
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: capturedImage || 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' }}
                                style={styles.resultImage}
                            />
                        </View>

                        {/* Title Section */}
                        <View style={styles.infoSection}>
                            <View style={styles.titleRow}>
                                <View>
                                    <Text style={styles.breedName}>{result.breed}</Text>
                                    <Text style={styles.breedSubtitle}>{result.category} • {result.type}</Text>
                                </View>
                                <TouchableOpacity style={styles.bookmarkButton}>
                                    <Ionicons name="bookmark" size={20} color="#1B4332" />
                                </TouchableOpacity>
                            </View>

                            {/* Confidence Card */}
                            <View style={styles.confidenceCard}>
                                <View style={styles.confidenceHeader}>
                                    <Text style={styles.confidenceLabel}>Confidence Level</Text>
                                    <Text style={styles.confidenceValue}>{(result.confidence * 100).toFixed(0)}%</Text>
                                </View>

                                {/* Progress Bar */}
                                <View style={styles.progressBarBg}>
                                    <View style={[styles.progressBarFill, { width: `${result.confidence * 100}%` }]} />
                                </View>

                                <View style={styles.confidenceNote}>
                                    <Ionicons name="checkmark-circle" size={16} color="#FFF" style={styles.checkIcon} />
                                    <Text style={styles.noteText}>High confidence - Reliable identification</Text>
                                </View>

                            </View>

                        </View>
                    </View>

                </ScrollView>

                {/* Footer Save Button */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Record</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    imageContainer: {
        width: '100%',
        height: 250,
        backgroundColor: '#E5E7EB',
    },
    resultImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    infoSection: {
        padding: 24,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    breedName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    breedSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    bookmarkButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confidenceCard: {
        backgroundColor: '#10B981', // Green matching screenshot
        borderRadius: 16,
        padding: 20,
    },
    confidenceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    confidenceLabel: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        fontWeight: '600',
    },
    confidenceValue: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 3,
        marginBottom: 16,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FFF',
        borderRadius: 3,
    },
    confidenceNote: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkIcon: {
        marginRight: 8,
    },
    noteText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    footer: {
        padding: 20,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    saveButton: {
        backgroundColor: '#1B4332',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
