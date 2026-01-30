import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, StatusBar, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useScanStore } from '@/store/scanStore';
import { useIsFocused } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Dimensions for the scanner frame
const FRAME_SIZE = width * 0.70; // Slightly smaller to match design better
const FRAME_TOP = (height - FRAME_SIZE) / 2 - 60; // Shifted up slightly
const FRAME_LEFT = (width - FRAME_SIZE) / 2;
const OVERLAY_COLOR = 'rgba(0,0,0,0.6)';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<'on' | 'off'>('off');
  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const setCapturedImage = useScanStore((state) => state.setCapturedImage);
  const isFocused = useIsFocused();

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.message}>Camera access needed for AI identification</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: true,
        });
        if (photo) {
          setCapturedImage(photo.uri);
          router.push('/(stack)/scan-preview' as any);
        }
      } catch (e) {
        console.error("Failed to take picture", e);
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
      router.push('/(stack)/scan-preview' as any);
    }
  };

  return (
    <View style={styles.container}>
      {/* Translucent status bar for full screen camera feel */}
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {isFocused && (
        <View style={styles.cameraContainer}>
          <CameraView
            style={StyleSheet.absoluteFill}
            ref={cameraRef}
            facing={facing}
            enableTorch={flash === 'on'}
          />

          {/* --- Overlay Masks --- */}
          <View style={styles.overlayTop} />
          <View style={styles.overlayBottom} />
          <View style={styles.overlayLeft} />
          <View style={styles.overlayRight} />

          {/* --- UI Elements Layer --- */}
          <View style={[styles.uiLayer, { paddingTop: insets.top, paddingBottom: insets.bottom + 10 }]}>

            {/* Top Bar */}
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.circleButton} onPress={() => router.back()}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>Scan Cattle</Text>

              <TouchableOpacity style={styles.circleButton} onPress={toggleFlash}>
                <Ionicons name={flash === 'on' ? "flash" : "flash-off"} size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Scan Frame (Absolute Positioned to match Hole) */}
            <View style={styles.scanFrame}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
              <Text style={styles.frameText}>Position cattle within frame</Text>
            </View>

            {/* Bottom Controls */}
            <View style={styles.controlsRegion}>

              <View style={styles.controlsRow}>
                <View style={styles.controlItem}>
                  <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
                    <Ionicons name="images" size={24} color="#FFF" />
                  </TouchableOpacity>
                  <Text style={styles.controlLabel}>Gallery</Text>
                </View>

                <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                  <View style={styles.captureInner} />
                </TouchableOpacity>

                <View style={styles.controlItem}>
                  <TouchableOpacity style={styles.secondaryButton} onPress={toggleCameraFacing}>
                    <Ionicons name="camera-reverse" size={24} color="#FFF" />
                  </TouchableOpacity>
                  <Text style={styles.controlLabel}>Flip</Text>
                </View>
              </View>

              {/* Tip Card */}
              <View style={styles.tipCard}>
                <Ionicons name="bulb" size={20} color="#FFD700" style={styles.bulbIcon} />
                <Text style={styles.tipText}>
                  Ensure good lighting and clear visibility of cattle features
                </Text>
              </View>

            </View>

          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
  },
  message: {
    color: '#FFF',
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF8008',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  // Overlay Masks - Creating the "Hole"
  overlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: FRAME_TOP,
    backgroundColor: OVERLAY_COLOR,
  },
  overlayBottom: {
    position: 'absolute',
    top: FRAME_TOP + FRAME_SIZE,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: OVERLAY_COLOR,
  },
  overlayLeft: {
    position: 'absolute',
    top: FRAME_TOP,
    left: 0,
    width: FRAME_LEFT,
    height: FRAME_SIZE,
    backgroundColor: OVERLAY_COLOR,
  },
  overlayRight: {
    position: 'absolute',
    top: FRAME_TOP,
    right: 0,
    // Calculate width as remaining space
    left: FRAME_LEFT + FRAME_SIZE,
    bottom: undefined, // height is defined by top/height logic or simpler anchor
    height: FRAME_SIZE,
    backgroundColor: OVERLAY_COLOR,
  },

  uiLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Scan Frame visual - Absolute Position Matches Hole
  scanFrame: {
    position: 'absolute',
    top: FRAME_TOP,
    left: FRAME_LEFT,
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    zIndex: 5,
  },
  // Corner styles
  cornerTL: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#FFF', borderTopLeftRadius: 16 },
  cornerTR: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#FFF', borderTopRightRadius: 16 },
  cornerBL: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#FFF', borderBottomLeftRadius: 16 },
  cornerBR: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#FFF', borderBottomRightRadius: 16 },

  frameText: {
    position: 'absolute',
    bottom: -40,
    width: '100%',
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  controlsRegion: {
    paddingHorizontal: 30,
    paddingBottom: 0,
    zIndex: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  controlItem: {
    alignItems: 'center',
  },
  secondaryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  controlLabel: {
    color: '#FFF',
    fontSize: 12,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF', // Outer ring
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  captureInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#1B4332', // Dark Green Center
    borderWidth: 2,
    borderColor: '#FFF',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  bulbIcon: {
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    color: '#FFF',
    fontSize: 13,
    lineHeight: 18,
  },

});
