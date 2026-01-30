import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { loadModels, processFrame } from '../../services/ai/ModelService';
import { Header } from '../../components/Header';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';
import { AlertTriangle, Maximize2, X, Eye } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export const VideoMonitoringScreen = () => {
    const navigation = useNavigation<any>();
    const [alertVisible, setAlertVisible] = useState(false);
    const [isModelReady, setIsModelReady] = useState(false);
    const [stats, setStats] = useState({ confidence: 0, fps: 0 });

    useEffect(() => {
        // AI Integration paused for now as per user request
        // setIsModelReady(true); 
    }, []);

    useEffect(() => {
        if (!isModelReady) return;
        // Simulated AI Loop disabled
    }, [isModelReady]);

    return (
        <View style={styles.container}>
            {/* Overlay Header */}
            <View style={styles.headerOverlay}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <X color={colors.text.inverse} size={24} />
                </TouchableOpacity>
                <View style={styles.liveBadge}>
                    <View style={styles.recordingDot} />
                    <Text style={styles.liveText}>
                        {isModelReady ? 'AI ACTIVE' : 'LOADING AI...'}
                    </Text>
                </View>
                <TouchableOpacity style={styles.iconButton}>
                    <Maximize2 color={colors.text.inverse} size={24} />
                </TouchableOpacity>
            </View>

            {/* Simulated Video Feed (Placeholder for now, in real app use expo-video) */}
            <View style={styles.videoContainer}>
                {/* Fallback color or Image */}
                <View style={styles.videoPlaceholder} />

                {/* AI Overlay Layer */}
                <View style={styles.aiLayer}>
                    {/* Bounding Box for Patient */}
                    <View style={styles.boundingBox}>
                        <View style={styles.boxLabelContainer}>
                            <Text style={styles.boxLabel}>
                                Patient ({(stats.confidence * 100).toFixed(1)}%)
                            </Text>
                        </View>
                        {/* Pose skeleton lines (simplified) */}
                        <View style={styles.skeletonLine} />
                    </View>
                </View>
            </View>

            {/* Alert Banner */}
            {alertVisible && (
                <View style={styles.alertBanner}>
                    <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
                    <View style={styles.alertContent}>
                        <AlertTriangle size={32} color={colors.error} />
                        <View style={styles.alertTextContainer}>
                            <Text style={styles.alertTitle}>FALL DETECTED</Text>
                            <Text style={styles.alertSubtitle}>Patient detected on floor. Confirm status.</Text>
                        </View>
                        <TouchableOpacity style={styles.alertAction} onPress={() => setAlertVisible(false)}>
                            <Text style={styles.actionText}>DISMISS</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Bottom Controls */}
            <View style={styles.controls}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Status</Text>
                    <Text style={[styles.statValue, { color: alertVisible ? colors.error : colors.success }]}>
                        {alertVisible ? 'CRITICAL' : 'MONITORING'}
                    </Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Confidence</Text>
                    <Text style={styles.statValue}>{(stats.confidence * 100).toFixed(1)}%</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>FPS</Text>
                    <Text style={styles.statValue}>{stats.fps}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    headerOverlay: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.m,
    },
    iconButton: {
        padding: spacing.s,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: layout.borderRadius.round,
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 0, 0, 0.6)',
        paddingHorizontal: spacing.s,
        paddingVertical: 4,
        borderRadius: 4,
    },
    recordingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'white',
        marginRight: 6,
    },
    liveText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    videoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#2F3336', // Dark gray
    },
    aiLayer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    boundingBox: {
        width: 200,
        height: 350,
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 4,
        position: 'relative',
    },
    boxLabelContainer: {
        position: 'absolute',
        top: -20,
        left: -2,
        backgroundColor: colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    boxLabel: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    skeletonLine: {
        width: 2,
        height: '60%',
        backgroundColor: 'rgba(0, 255, 0, 0.5)',
        alignSelf: 'center',
        marginTop: 20,
    },
    alertBanner: {
        position: 'absolute',
        top: 100,
        left: spacing.m,
        right: spacing.m,
        borderRadius: layout.borderRadius.l,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 100, 100, 0.3)',
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
        color: colors.error,
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.sizes.h3,
    },
    alertSubtitle: {
        color: 'white',
        marginTop: 2,
        fontSize: typography.sizes.bodySmall,
    },
    alertAction: {
        padding: spacing.s,
    },
    actionText: {
        color: 'white',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
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
});
