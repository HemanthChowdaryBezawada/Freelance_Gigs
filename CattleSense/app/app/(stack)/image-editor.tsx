import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, StatusBar, ActivityIndicator } from 'react-native';
import { useScanStore } from '@/store/scanStore';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';

export default function ImageEditorScreen() {
    const router = useRouter();
    const { capturedImage, setCapturedImage } = useScanStore();
    const [currentImage, setCurrentImage] = useState(capturedImage);
    const [processing, setProcessing] = useState(false);
    const [rotation, setRotation] = useState(0);

    if (!capturedImage) {
        router.back();
        return null;
    }

    const handleRotate = async () => {
        setProcessing(true);
        try {
            // In a real app we might just update valid rotation state to save processing
            // For now, let's actually manipulate it so we get a specific result
            const result = await ImageManipulator.manipulateAsync(
                currentImage!,
                [{ rotate: 90 }],
                { format: ImageManipulator.SaveFormat.JPEG }
            );
            setCurrentImage(result.uri);
            setRotation((prev) => (prev + 90) % 360);
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    };

    const handleSave = () => {
        if (currentImage) {
            setCapturedImage(currentImage);
            router.back();
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <SafeAreaView style={styles.safeArea}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Photo</Text>
                    <TouchableOpacity onPress={handleSave}>
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.imageContainer}>
                    {processing ? (
                        <ActivityIndicator size="large" color="#FF8008" />
                    ) : (
                        <Image
                            source={{ uri: currentImage! }}
                            style={styles.previewImage}
                        />
                    )}
                </View>

                <View style={styles.toolbar}>
                    <TouchableOpacity style={styles.toolButton} onPress={handleRotate}>
                        <Ionicons name="refresh" size={24} color="#FFF" />
                        <Text style={styles.toolLabel}>Rotate</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.toolButton}>
                        <Ionicons name="crop" size={24} color="#666" />
                        <Text style={[styles.toolLabel, { color: '#666' }]}>Crop</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.toolButton}>
                        <Ionicons name="contrast" size={24} color="#666" />
                        <Text style={[styles.toolLabel, { color: '#666' }]}>Adjust</Text>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelText: {
        color: '#FFF',
        fontSize: 16,
    },
    saveText: {
        color: '#FF8008',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    toolbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#111',
    },
    toolButton: {
        alignItems: 'center',
        gap: 4,
    },
    toolLabel: {
        color: '#FFF',
        fontSize: 12,
    }
});
