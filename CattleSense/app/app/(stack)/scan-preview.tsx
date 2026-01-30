import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useScanStore } from '@/store/scanStore';
import { classifyBreed } from '../../services/api';

export default function ScanPreviewScreen() {
    const router = useRouter();
    const capturedImage = useScanStore((state) => state.capturedImage);
    const setPredictions = useScanStore((state) => state.setPredictions);
    const [loading, setLoading] = useState(false);

    // Ensure we have an image, otherwise go back
    React.useEffect(() => {
        if (!capturedImage) {
            router.back();
        }
    }, [capturedImage, router]);

    if (!capturedImage) {
        return null;
    }

    const handleRetake = () => {
        router.back(); // Go back to camera
    };

    const handleUsePhoto = async () => {
        if (!capturedImage) return;

        setLoading(true);
        try {
            console.log("Sending image for analysis:", capturedImage);
            const results = await classifyBreed(capturedImage);
            console.log("Analysis results:", results);

            setPredictions(results);

            if (results && results.length > 0) {
                const topConf = results[0].confidence;
                if (topConf > 0.7) {
                    router.push('/(stack)/result-high');
                } else {
                    router.push('/(stack)/result-low');
                }
            } else {
                // Fallback if empty array returned
                router.push('/(stack)/result-low');
            }

        } catch (error) {
            console.error("Analysis failed:", error);
            Alert.alert("Error", "Failed to analyze image. Please check your internet connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <SafeAreaView style={styles.safeArea}>

                {/* Image Preview Area */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: capturedImage }}
                        style={styles.previewImage}
                        resizeMode="contain"
                    />
                    {loading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#FFF" />
                            <Text style={styles.loadingText}>Analyzing...</Text>
                        </View>
                    )}
                </View>

                {/* Bottom Controls */}
                <View style={[styles.controlsContainer, { opacity: loading ? 0.5 : 1 }]}>
                    <TouchableOpacity style={styles.retakeButton} onPress={handleRetake} disabled={loading}>
                        <Ionicons name="refresh" size={20} color="#FFF" style={styles.btnIcon} />
                        <Text style={styles.retakeText}>Retake</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.useButton} onPress={handleUsePhoto} disabled={loading}>
                        <Ionicons name="checkmark" size={20} color="#FFF" style={styles.btnIcon} />
                        <Text style={styles.useText}>Use Photo</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    safeArea: {
        flex: 1,
        justifyContent: 'space-between',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#000',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    loadingText: {
        color: '#FFF',
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 24,
        paddingTop: 24,
        backgroundColor: '#000',
    },
    retakeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333', // Dark Grey
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        flex: 0.47,
    },
    retakeText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    useButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1B4332', // Dark Green
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        flex: 0.47,
    },
    useText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    btnIcon: {
        marginRight: 8,
    }
});
