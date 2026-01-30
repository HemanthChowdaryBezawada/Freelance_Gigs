import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RecordExportScreen() {
    const router = useRouter();
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleExport = (format: 'PDF' | 'CSV') => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);
        }, 1500);
    };

    const handleShare = () => {
        console.log("Sharing...");
    };

    if (success) {
        return (
            <View style={styles.container}>
                <View style={styles.centerCard}>
                    <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
                    <Text style={styles.successTitle}>Export Successful!</Text>
                    <Text style={styles.successDesc}>Your records have been exported.</Text>

                    <TouchableOpacity style={styles.primaryButton} onPress={handleShare}>
                        <Ionicons name="share-social" size={20} color="#FFF" />
                        <Text style={styles.primaryButtonText}>Share File</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
                        <Text style={styles.secondaryText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={24} color="#1A2A3A" />
                </TouchableOpacity>
                <Text style={styles.title}>Export Records</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.illustration}>
                    <Ionicons name="document-text-outline" size={80} color="#FF8008" />
                    <Text style={styles.illustrationText}>Export your scan history for reporting or backup.</Text>
                </View>

                <View style={styles.options}>
                    <TouchableOpacity
                        style={styles.optionCard}
                        onPress={() => handleExport('PDF')}
                        disabled={processing}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                            <Ionicons name="document" size={24} color="#D32F2F" />
                        </View>
                        <View style={styles.optionText}>
                            <Text style={styles.optionTitle}>Export as PDF</Text>
                            <Text style={styles.optionSub}>Best for printing and sharing reports</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#D1D9E6" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.optionCard}
                        onPress={() => handleExport('CSV')}
                        disabled={processing}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                            <Ionicons name="grid" size={24} color="#1976D2" />
                        </View>
                        <View style={styles.optionText}>
                            <Text style={styles.optionTitle}>Export as CSV</Text>
                            <Text style={styles.optionSub}>Best for spreadsheet analysis</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#D1D9E6" />
                    </TouchableOpacity>
                </View>

                {processing && (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color="#FF8008" />
                        <Text style={styles.loaderText}>Generating file...</Text>
                    </View>
                )}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingTop: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A2A3A',
    },
    content: {
        flex: 1,
        padding: 24,
    },
    illustration: {
        alignItems: 'center',
        marginVertical: 40,
        paddingHorizontal: 40,
    },
    illustrationText: {
        textAlign: 'center',
        marginTop: 16,
        fontSize: 16,
        color: '#5B6B7C',
        lineHeight: 24,
    },
    options: {
        gap: 16,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E0E6ED',
        padding: 16,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionText: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A2A3A',
        marginBottom: 4,
    },
    optionSub: {
        fontSize: 12,
        color: '#9AA5B1',
    },
    loader: {
        marginTop: 40,
        alignItems: 'center',
    },
    loaderText: {
        marginTop: 10,
        color: '#FF8008',
        fontWeight: '600',
    },
    centerCard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A2A3A',
        marginTop: 20,
        marginBottom: 8,
    },
    successDesc: {
        fontSize: 16,
        color: '#5B6B7C',
        textAlign: 'center',
        marginBottom: 40,
    },
    primaryButton: {
        backgroundColor: '#FF8008',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        justifyContent: 'center',
        marginBottom: 16,
    },
    primaryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        paddingVertical: 16,
    },
    secondaryText: {
        color: '#5B6B7C',
        fontSize: 16,
        fontWeight: '600',
    },
});
