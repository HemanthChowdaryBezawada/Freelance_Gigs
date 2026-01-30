import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Dimensions, Switch, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Upload, Camera, Play, AlertTriangle, CheckCircle, RefreshCw, Cpu } from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';
import { alertsService } from '../../services/alerts/AlertsService';
import { useAlerts } from '../../context/AlertContext';
import { loadModels, processFrame } from '../../services/ai/ModelService';
import Svg, { Line, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

export const VideoAnalysisScreen = () => {
    const route = useRoute<any>();
    const { userId } = route.params || {};
    const { refreshAlerts } = useAlerts();

    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<{ status: 'normal' | 'fall'; confidence: number; keypoints?: number[]; isFall?: boolean } | null>(null);
    const [modelsReady, setModelsReady] = useState(false);
    const videoRef = useRef<Video>(null);
    const [forceSimulation, setForceSimulation] = useState(false);
    const [debugInfo, setDebugInfo] = useState<string>("");

    useEffect(() => {
        const initModels = async () => {
            const success = await loadModels();
            setModelsReady(success);
        };
        initModels();
    }, []);

    const pickVideo = async () => {
        // Request permissions first
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'We need access to your gallery to upload videos.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setVideoUri(result.assets[0].uri);
            setResult(null); // Reset previous result
            setDebugInfo(""); // Reset debug info
        }
    };

    const recordVideo = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'We need access to your camera to scan patients.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
            videoMaxDuration: 10,
        });

        if (!result.canceled) {
            setVideoUri(result.assets[0].uri);
            setResult(null);
            setDebugInfo(""); // Reset debug info
        }
    };

    // Helper: Decode JPEG Base64 to Raw RGB Float32 Tensor
    // We use 'jpeg-js' (pure JS decoder) to get actual pixel values.
    // This allows the TFLite model to "see" the image content.
    const jpeg = require('jpeg-js');
    const { Buffer } = require('buffer');

    const decodeToFloat32 = (base64: string, width: number, height: number): Float32Array | null => {
        try {
            const rawData = Buffer.from(base64, 'base64');
            const { data } = jpeg.decode(rawData, { useTArray: true }); // Returns Uint8Array (RGBA)

            // Convert RGBA (0-255) to RGB (0-1) Float32
            // TFLite usually expects RGB.
            const frameSize = width * height * 3;
            const float32 = new Float32Array(frameSize);

            let j = 0;
            for (let i = 0; i < data.length; i += 4) {
                // R, G, B, A
                float32[j++] = data[i] / 255.0;     // R
                float32[j++] = data[i + 1] / 255.0; // G
                float32[j++] = data[i + 2] / 255.0; // B
                // Skip Alpha
            }
            return float32;
        } catch (e) {
            console.log("JPEG Decode Error:", e);
            return null;
        }
    };

    const analyzeVideo = async () => {
        if (!videoUri) return;

        setIsAnalyzing(true);
        setResult(null);
        setDebugInfo("Deep Vision Analysis...");

        setTimeout(async () => {
            try {
                let getThumbnailAsync: any;
                let ImageManipulator: any;
                try {
                    getThumbnailAsync = require("expo-video-thumbnails").getThumbnailAsync;
                    ImageManipulator = require("expo-image-manipulator");
                } catch (e) { console.log("Native modules missing"); }

                let finalResult = { isFall: false, confidence: 0, keypoints: [] as number[] };

                // Analyze frames
                // We do this less frequently (every 1.5s) because JS decoding 640x640 is CPU heavy
                const duration = 5000;
                const interval = 1500;

                for (let time = 0; time < duration; time += interval) {
                    try {
                        if (getThumbnailAsync && ImageManipulator) {
                            // 1. Extract
                            const { uri } = await getThumbnailAsync(videoUri, { time, quality: 0.8 });

                            // 2. Resize to 640x640 (Model Native Size)
                            // Crucial: YOLOv8 was trained on 640x640. Using smaller input destroys features.
                            const result = await ImageManipulator.manipulateAsync(
                                uri,
                                [{ resize: { width: 640, height: 640 } }],
                                { base64: true, format: ImageManipulator.SaveFormat.JPEG }
                            );

                            // 3. Decode & Tensorize
                            // This matches the model's expected input tensor exactly.
                            const inputTensor = decodeToFloat32(result.base64, 640, 640);

                            if (inputTensor) {
                                // 4. Run AI Inference (HD Mode)
                                setDebugInfo(`Running Neural Engine (640px)...`);
                                await new Promise(r => setTimeout(r, 10)); // Yield for UI update

                                const aiResult = await processFrame(inputTensor, result.base64);

                                console.log(`[VideoAnalysis] Frame ${time}ms - Confidence: ${(aiResult.confidence * 100).toFixed(1)}%, isFall: ${aiResult.isFall}`);

                                // LIVE UPDATE of Skeleton - Always update to show latest frame
                                setResult({
                                    status: aiResult.isFall ? 'fall' : 'normal',
                                    confidence: aiResult.confidence,
                                    keypoints: aiResult.keypoints || [],
                                    isFall: aiResult.isFall
                                });

                                setDebugInfo(`Scan ${(time / 1000).toFixed(0)}s: ${(aiResult.confidence * 100).toFixed(0)}% ${aiResult.isFall ? 'FALL!' : 'Normal'}`);

                                // Accumulate highest confidence
                                if (aiResult.confidence > finalResult.confidence) {
                                    finalResult = {
                                        ...aiResult,
                                        keypoints: aiResult.keypoints || []
                                    };
                                }
                            }
                        }
                    } catch (e) {
                        console.log("frame error", e);
                    }
                    await new Promise(r => setTimeout(r, 50));
                }

                setIsAnalyzing(false);

                // Check result - using lower threshold to be more sensitive to falls
                const isFall = finalResult.confidence > 0.45;

                setResult({
                    status: isFall ? 'fall' : 'normal',
                    confidence: finalResult.confidence
                });

                // Debug final
                setDebugInfo(`Result: ${isFall ? 'FALL' : 'NORMAL'} (${(finalResult.confidence * 100).toFixed(0)}%)`);

                if (isFall && userId) {
                    await alertsService.createAlert({
                        patient_id: userId,
                        type: 'Fall Detected',
                        severity: 'critical',
                        description: `Fall Detected (Conf: ${(finalResult.confidence * 100).toFixed(0)}%)`
                    });
                    await refreshAlerts();
                    Alert.alert('Critical Alert', 'Fall Detected! Alert sent.');
                }
            } catch (error) {
                console.error("Analysis Failed", error);
                setIsAnalyzing(false);
                Alert.alert("Error", "Analysis failed.");
            }
        }, 500);
    };

    return (
        <View style={styles.container}>
            <Header title="AI Vision Analysis" showBack />

            <View style={styles.content}>

                {/* Status Indicator */}
                <View style={[styles.statusBanner, { backgroundColor: modelsReady ? colors.success + '20' : colors.warning + '20' }]}>
                    <Cpu size={16} color={modelsReady ? colors.success : colors.warning} />
                    <Text style={[styles.statusText, { color: modelsReady ? colors.text.primary : colors.text.secondary }]}>
                        {modelsReady ? " AI Models Loaded & Ready" : " Initializing AI Models..."}
                    </Text>
                </View>

                {/* Debug / Simulation Toggle */}
                <View style={styles.debugContainer}>
                    <Text style={styles.debugLabel}>Force Fall Simulation</Text>
                    <Switch
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor={forceSimulation ? colors.background : colors.background}
                        ios_backgroundColor={colors.border}
                        onValueChange={setForceSimulation}
                        value={forceSimulation}
                        disabled={isAnalyzing}
                    />
                </View>
                {debugInfo && <Text style={styles.debugText}>{debugInfo}</Text>}

                {/* Video Area */}
                <View style={styles.videoContainer}>
                    {videoUri ? (
                        <>
                            <Video
                                ref={videoRef}
                                style={styles.video}
                                source={{ uri: videoUri }}
                                useNativeControls={true}
                                resizeMode={ResizeMode.CONTAIN}
                                isLooping
                                shouldPlay={!isAnalyzing}
                            />

                            {/* Dynamic AI Overlay */}
                            <View style={styles.aiLayer}>
                                {result && result.keypoints && (
                                    <Svg height="100%" width="100%" viewBox={`0 0 640 640`} style={StyleSheet.absoluteFill}>
                                        {/* 1. Draw Skeleton Connections */}
                                        {[
                                            [5, 6], [5, 7], [7, 9], [6, 8], [8, 10], // Upper Body
                                            [5, 11], [6, 12], [11, 12],            // Torso
                                            [11, 13], [13, 15], [12, 14], [14, 16]  // Legs
                                        ].map(([i, j], idx) => {
                                            const k = result.keypoints!;
                                            // Safety check for array length
                                            if (!k || k.length < 50) return null;

                                            const kp1 = { x: k[i * 3], y: k[i * 3 + 1], c: k[i * 3 + 2] };
                                            const kp2 = { x: k[j * 3], y: k[j * 3 + 1], c: k[j * 3 + 2] };

                                            if (kp1.c > 0.3 && kp2.c > 0.3) {
                                                return (
                                                    <Line
                                                        key={`bond-${idx}`}
                                                        x1={kp1.x}
                                                        y1={kp1.y}
                                                        x2={kp2.x}
                                                        y2={kp2.y}
                                                        stroke={result.isFall ? "#FF0000" : "#00FF00"}
                                                        strokeWidth="4"
                                                    />
                                                );
                                            }
                                            return null;
                                        })}

                                        {/* 2. Draw Keypoints */}
                                        {Array.from({ length: 17 }).map((_, k) => {
                                            const kp = result.keypoints!;
                                            if (!kp || kp.length < 50) return null;

                                            const x = kp[k * 3];
                                            const y = kp[k * 3 + 1];
                                            const c = kp[k * 3 + 2];

                                            if (c > 0.3) {
                                                return (
                                                    <Circle
                                                        key={`kp-${k}`}
                                                        cx={x}
                                                        cy={y}
                                                        r="6"
                                                        fill={result.isFall ? "#FF0000" : "#00FF00"}
                                                        stroke="white"
                                                        strokeWidth="2"
                                                    />
                                                );
                                            }
                                            return null;
                                        })}
                                    </Svg>
                                )}

                                {/* AI Metrics HUD */}
                                <View style={styles.metricsHud}>
                                    <Text style={styles.metricsTitle}>AI DIAGNOSTICS</Text>
                                    {result ? (
                                        <>
                                            <Text style={styles.metricText}>
                                                MODEL: YOLOv8-Pose (640px)
                                            </Text>
                                            <Text style={[styles.metricText, { color: result.isFall ? colors.error : colors.success, fontWeight: 'bold' }]}>
                                                POSTURE: {result.isFall ? 'CRITICAL (LYING)' : 'NORMAL (UPRIGHT)'}
                                            </Text>
                                            <Text style={styles.metricText}>
                                                CONFIDENCE: {(result.confidence * 100).toFixed(0)}%
                                            </Text>
                                        </>
                                    ) : (
                                        <Text style={styles.metricText}>Status: Idle</Text>
                                    )}
                                </View>
                            </View>
                        </>
                    ) : (
                        <View style={styles.placeholder}>
                            <View style={styles.placeholderIcon}>
                                <Camera size={40} color={colors.text.tertiary} />
                            </View>
                            <Text style={styles.placeholderText}>No video selected</Text>
                            <Text style={styles.placeholderSubtext}>Upload a clip or scan live to analyze</Text>
                        </View>
                    )}
                </View>

                {/* Controls */}
                <View style={styles.controls}>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={pickVideo}>
                            <Upload size={20} color={colors.primary} />
                            <Text style={[styles.buttonText, { color: colors.primary }]}>Upload</Text>
                        </TouchableOpacity>

                        <View style={{ width: spacing.m }} />

                        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={recordVideo}>
                            <Camera size={20} color={colors.primary} />
                            <Text style={[styles.buttonText, { color: colors.primary }]}>Live Scan</Text>
                        </TouchableOpacity>
                    </View>

                    {videoUri && !result && !isAnalyzing && (
                        <Button
                            title="Start AI Analysis"
                            onPress={analyzeVideo}
                            style={{ marginTop: spacing.l }}
                            leftIcon={<Play size={20} color="white" />}
                            disabled={!modelsReady}
                        />
                    )}

                    {isAnalyzing && (
                        <View style={styles.analyzingContainer}>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text style={styles.analyzingText}>Processing video frames...</Text>
                            <Text style={styles.analyzingSubtext}>Running YOLOv8-Pose + LSTM...</Text>
                        </View>
                    )}

                    {/* Results */}
                    {result && (
                        <View style={[styles.resultCard, result.status === 'fall' ? styles.resultError : styles.resultSuccess]}>
                            <View style={styles.resultHeader}>
                                {result.status === 'fall' ? (
                                    <AlertTriangle size={32} color={colors.error} />
                                ) : (
                                    <CheckCircle size={32} color={colors.success} />
                                )}
                                <Text style={[styles.resultTitle, { color: result.status === 'fall' ? colors.error : colors.success }]}>
                                    {result.status === 'fall' ? 'FALL DETECTED' : 'Activity Normal'}
                                </Text>
                            </View>

                            <Text style={styles.confidence}>AI Confidence: {(result.confidence * 100).toFixed(1)}%</Text>

                            <Button
                                title="Run Another Scan"
                                onPress={() => { setVideoUri(null); setResult(null); }}
                                variant="outline"
                                style={{ marginTop: spacing.m, borderColor: 'rgba(0,0,0,0.2)' }}
                            />
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        padding: spacing.m,
    },
    videoContainer: {
        width: '100%',
        height: 300,
        backgroundColor: colors.surface,
        borderRadius: layout.borderRadius.m,
        overflow: 'hidden',
        marginBottom: spacing.l,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        alignItems: 'center',
    },
    placeholderIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.m,
    },
    placeholderText: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.sizes.h3,
        color: colors.text.primary,
    },
    placeholderSubtext: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.sizes.body,
        color: colors.text.tertiary,
        marginTop: 4,
    },
    aiLayer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    metricsHud: {
        position: 'absolute',
        top: 100,
        right: 10,
        backgroundColor: 'rgba(0, 20, 0, 0.8)',
        padding: 10,
        borderRadius: 8,
        borderLeftWidth: 2,
        borderLeftColor: '#00FF00',
        width: 200,
    },
    metricsTitle: {
        color: '#00FF00',
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 4,
        letterSpacing: 1,
    },
    metricText: {
        color: '#ccffcc',
        fontSize: 12,
        fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
        marginBottom: 2,
    },
    alertBanner: {
        position: 'absolute',
        bottom: 120, // Moved up to verify visibility
        left: spacing.m,
        right: spacing.m,
        borderRadius: layout.borderRadius.l,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 100, 100, 0.3)',
        backgroundColor: 'rgba(255, 0, 0, 0.9)',
    },
    alertContent: {
        padding: spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
    },
    alertTextContainer: {
        flex: 1,
        marginLeft: spacing.m,
    },
    alertTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    alertSubtitle: {
        color: 'white',
        marginTop: 2,
        fontSize: 12,
    },
    alertAction: {
        padding: spacing.s,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 8,
    },
    actionText: {
        color: 'white',
        fontWeight: 'bold',
    },
    controls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        backgroundColor: 'rgba(0,0,0,0.8)',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: spacing.l,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        color: colors.text.tertiary,
        fontSize: 10,
        textTransform: 'uppercase',
    },
    statValue: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 4,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.m,
        borderRadius: layout.borderRadius.m,
        borderWidth: 1,
    },
    secondaryButton: {
        backgroundColor: colors.surface,
        borderColor: colors.border,
    },
    buttonText: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.sizes.body,
        marginLeft: spacing.s,
    },
    analyzingContainer: {
        marginTop: spacing.xl,
        alignItems: 'center',
    },
    analyzingText: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.sizes.h3,
        color: colors.text.primary,
        marginTop: spacing.m,
    },
    analyzingSubtext: {
        fontFamily: typography.fontFamily.regular,
        color: colors.text.tertiary,
        marginTop: 4,
    },
    resultCard: {
        marginTop: spacing.l,
        padding: spacing.l,
        borderRadius: layout.borderRadius.m,
        borderWidth: 1,
        alignItems: 'center',
    },
    resultSuccess: {
        backgroundColor: colors.success + '10',
        borderColor: colors.success,
    },
    resultError: {
        backgroundColor: colors.error + '10',
        borderColor: colors.error,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.s,
    },
    resultTitle: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.sizes.h2,
        marginLeft: spacing.m,
    },
    confidence: {
        fontFamily: typography.fontFamily.medium,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
    },
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.s,
        borderRadius: layout.borderRadius.s,
        marginBottom: spacing.m,
    },
    statusText: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.sizes.caption,
        marginLeft: spacing.s,
    },
    debugContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.m,
        backgroundColor: colors.surface,
        borderRadius: layout.borderRadius.m,
        marginBottom: spacing.m,
        borderWidth: 1,
        borderColor: colors.border,
    },
    debugLabel: {
        fontFamily: typography.fontFamily.medium,
        color: colors.text.primary,
        fontSize: typography.sizes.body,
    },
    debugText: {
        fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
        fontSize: 10,
        color: colors.text.tertiary,
        marginBottom: spacing.m,
        textAlign: 'center',
    }
});
