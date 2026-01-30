import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Dimensions, StatusBar } from 'react-native';
import { useScanStore } from '@/store/scanStore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResultLowScreen() {
    const router = useRouter();
    const { capturedImage, predictions, resetScan } = useScanStore();

    // Use real predictions from store
    const topPrediction = predictions && predictions.length > 0 ? predictions[0] : { breed: 'Unknown', confidence: 0 };

    const result = {
        confidence: topPrediction.confidence || 0,
    };

    // Use other predictions as possible matches if available, otherwise mock for UI layout if needed
    const possibleMatches = predictions && predictions.length > 1
        ? predictions.slice(1).map(p => ({
            breed: p.breed,
            score: p.confidence,
            image: 'https://via.placeholder.com/150' // WE don't have images for other breeds yet
        }))
        : [
            // Fallback if only 1 prediction comes back (often model returns top 3-5, but depends on backend)
            { breed: 'Jersey', score: 0.45, image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=200&q=80' },
            { breed: 'Brown Swiss', score: 0.30, image: 'https://images.unsplash.com/photo-1596733430284-f74377bc21c5?w=200&q=80' }
        ];

    const handleRetake = () => {
        resetScan();
        router.back();
    };

    const handleConfirm = () => {
        // Proceed with current prediction or manual override
        router.push('/(stack)/manual-select' as any);
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

                    {/* Main Image Card */}
                    <View style={styles.imageCard}>
                        <Image
                            source={{ uri: capturedImage || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' }}
                            style={styles.mainImage}
                        />
                    </View>

                    {/* Low Confidence Warning Card */}
                    <View style={styles.warningCard}>
                        <View style={styles.warningHeader}>
                            <Ionicons name="warning" size={24} color="#FFF" style={styles.warningIcon} />
                            <View>
                                <Text style={styles.warningTitle}>Low Confidence</Text>
                                <Text style={styles.warningSubtitle}>Manual verification recommended</Text>
                            </View>
                        </View>

                        <View style={styles.confidenceRow}>
                            <Text style={styles.confidenceLabel}>Confidence Level</Text>
                            <Text style={styles.confidenceValue}>58%</Text>
                        </View>

                        {/* Progress Bar */}
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: '58%' }]} />
                        </View>
                    </View>

                    {/* Possible Matches */}
                    <Text style={styles.sectionTitle}>Possible Matches</Text>

                    {possibleMatches.map((match, index) => (
                        <TouchableOpacity key={index} style={styles.matchCard}>
                            <Image source={{ uri: match.image }} style={styles.matchImage} />
                            <View style={styles.matchInfo}>
                                <Text style={styles.matchName}>{match.breed}</Text>
                                <Text style={styles.matchScore}>{(match.score * 100).toFixed(0)}% Match Probability</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    ))}

                </ScrollView>

                {/* Footer Actions */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
                        <Text style={styles.retakeButtonText}>Retake Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                        <Text style={styles.confirmButtonText}>Confirm</Text>
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
    imageCard: {
        borderRadius: 20,
        overflow: 'hidden',
        height: 250,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    mainImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    warningCard: {
        backgroundColor: '#FF8F00', // Warning Orange
        borderRadius: 16,
        padding: 20,
        marginBottom: 25,
        elevation: 3,
        shadowColor: '#FF8F00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    warningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    warningIcon: {
        marginRight: 12,
    },
    warningTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    warningSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
    },
    confidenceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    confidenceLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
    },
    confidenceValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 4,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FFF',
        borderRadius: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
    },
    matchCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    matchImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12,
    },
    matchInfo: {
        flex: 1,
    },
    matchName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    matchScore: {
        fontSize: 12,
        color: '#6B7280',
    },
    footer: {
        padding: 20,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        flexDirection: 'row',
        gap: 15,
    },
    retakeButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#1B4332',
        alignItems: 'center',
        justifyContent: 'center',
    },
    retakeButtonText: {
        color: '#1B4332', // Dark Green Text
        fontWeight: 'bold',
        fontSize: 16,
    },
    confirmButton: {
        flex: 1,
        backgroundColor: '#1B4332',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
