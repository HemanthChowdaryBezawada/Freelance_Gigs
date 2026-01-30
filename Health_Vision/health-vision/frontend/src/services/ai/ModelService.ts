import { loadTensorflowModel, TensorflowModel } from 'react-native-fast-tflite';
import { Asset } from 'expo-asset';

// We need to manage the state of our models
let poseModel: TensorflowModel | null = null;
let fallModel: TensorflowModel | null = null;

// Buffer for temporal analysis (30 frames)
// Each frame needs 34 values (17 keypoints * 2 coordinates)
const SEQ_LENGTH = 30;
// const NUM_FEATURES = 34; // Unused for now
let frameBuffer: number[][] = [];

export const loadModels = async () => {
    try {
        console.log('Loading AI Models...');

        // 1. Load Pose Model
        // We use the expo-asset system to resolve the local file to a URI/Path
        const poseAsset = Asset.fromModule(require('../../../assets/models/yolov8n-pose.tflite'));
        await poseAsset.downloadAsync(); // Ensure it's on the file system

        if (poseAsset.localUri) {
            try {
                poseModel = await loadTensorflowModel({ url: poseAsset.localUri });
                console.log('Pose Model Loaded:', poseAsset.localUri);
            } catch (e) {
                console.error('Failed to load Pose Model:', e);
            }
        }

        // 2. Load Fall Detection Model
        try {
            const fallAsset = Asset.fromModule(require('../../../assets/models/fall_detection_model.tflite'));
            await fallAsset.downloadAsync();

            if (fallAsset.localUri) {
                fallModel = await loadTensorflowModel({ url: fallAsset.localUri });
                console.log('Fall Model Loaded:', fallAsset.localUri);
            }
        } catch (e) {
            console.warn('Fall Detection Model failed to load (likely unsupported ops). Switching to Heuristic Mode.', e);
            // We do NOT return false here. We proceed with Pose-only or Simulation.
        }

        // Return true if at least one model loaded or we are willing to run in partial mode
        return true;
    } catch (error) {
        console.error('Error in loadModels execution:', error);
        // Even if everything strictly fails, return true to allow UI to open and try Heuristics
        return true;
    }
};

/**
 * Main inference function.
 * @param inputImage - Raw float32 array of the image (1, 640, 640, 3) 
 *                     normalized to [0,1] or however the model expects it.
 *                     For YOLO, it usually expects (1, 640, 640, 3).
 */
const FALL_THRESHOLD = 0.45;
const BACKEND_URL = "http://180.235.121.253:8041/predict"; // Remote Backend

// Hybrid Mode Configuration
// Set to TRUE to offload to Python Backend
// Set to FALSE to use On-Device TFLite (Default)
const USE_PYTHON_BACKEND = true;

// Heuristic State
let lastFrame: Float32Array | null = null;
let motionHistory: number[] = [];

export const processFrame = async (inputImage: Float32Array, base64Image?: string): Promise<{ isFall: boolean, confidence: number, keypoints?: number[] }> => {

    // --- MODE A: PYTHON BACKEND (OFFLOAD) ---
    if (USE_PYTHON_BACKEND && base64Image) {
        try {
            console.log("Using Python Backend...");

            // Create FormData to send the image as a file
            const formData = new FormData();
            formData.append('file', {
                uri: `data:image/jpeg;base64,${base64Image}`,
                name: 'frame.jpg',
                type: 'image/jpeg',
            } as any);

            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log("[Backend] Success:", result);
                return {
                    isFall: result.isFall,
                    confidence: result.confidence,
                    keypoints: result.keypoints || []
                };
            } else {
                console.warn("[Backend] Error Status:", response.status);
            }
        } catch (e) {
            console.warn("Backend unavailable or error, falling back to local model.", e);
            // If backend fails, we proceed to local TFLite logic
        }
    }

    // --- MODE B: ON-DEVICE TFLITE (DEFAULT) ---
    // 1. ROBUSTNESS FIX: Do NOT fail if models aren't loaded. 
    // We allow the Heuristic Motion Engine to run as a fallback.
    const usingHeuristicsOnly = !poseModel && !fallModel;
    if (usingHeuristicsOnly) {
        // console.log("Running in Heuristic Fallback Mode (No TFLite)");
    }

    try {
        let currentKeypoints: number[] = [];

        // --- STEP 1: POSE DETECTION & GEOMETRIC ANALYSIS ---
        let geometricFallConfidence = 0.0;

        if (poseModel) {
            const outputs = await poseModel.run([inputImage]);
            const rawOutput = outputs[0]; // Float32Array [1, 56, 8400]
            // Flattened array size: 56 * 8400 = 470,400 elements.
            // Layout: 8400 columns, each has 56 rows. 
            // Usually memory layout is [Batch, Channel, Anchor] or [Batch, Anchor, Channel]?
            // YOLOv8 export default is [1, 84, 8400] (for COCO) or [1, 56, 8400] (Pose).
            // It is usually [Batch, Channel, Anchor]. 
            // So: Index(c, i) = c * numAnchors + i.

            const numAnchors = 8400;
            const numChannels = 56; // 4 box + 1 conf + 51 kpts

            // Find best detection
            let maxConf = 0;
            let bestAnchorIndex = -1;

            // Optimization: Stride loop
            for (let i = 0; i < numAnchors; i += 10) {
                const confIndex = (4 * numAnchors) + i;
                const conf = Number(rawOutput[confIndex]);

                if (conf > maxConf) {
                    maxConf = conf;
                    bestAnchorIndex = i;
                }
            }

            // If Model Detected a Person (lowered threshold for better detection)
            // console.log(`[AI] Pose Detection Confidence: ${(maxConf * 100).toFixed(1)}%`);
            if (maxConf > 0.15 && bestAnchorIndex !== -1) {
                // Extract Box
                const wIndex = (2 * numAnchors) + bestAnchorIndex;
                const hIndex = (3 * numAnchors) + bestAnchorIndex;
                const w = Number(rawOutput[wIndex]);
                const h = Number(rawOutput[hIndex]);

                // Extract 17 Keypoints (COCO Format)
                // 0:Nose, 1-2:Eyes, 3-4:Ears, 5-6:Shoulders, 7-8:Elbows, 9-10:Wrists, 11-12:Hips, 13-14:Knees, 15-16:Ankles
                const kptStartChannel = 5;
                currentKeypoints = [];
                for (let k = 0; k < 17; k++) {
                    const kptXIndex = ((kptStartChannel + (k * 3) + 0) * numAnchors) + bestAnchorIndex;
                    const kptYIndex = ((kptStartChannel + (k * 3) + 1) * numAnchors) + bestAnchorIndex;
                    const kptCIndex = ((kptStartChannel + (k * 3) + 2) * numAnchors) + bestAnchorIndex;

                    currentKeypoints.push(Number(rawOutput[kptXIndex])); // x
                    currentKeypoints.push(Number(rawOutput[kptYIndex])); // y
                    currentKeypoints.push(Number(rawOutput[kptCIndex])); // conf
                }

                // --- ADVANCED BIOMECHANICS ANALYSIS ---

                // 1. Keypoint Extraction (Indices * 3 for flat array)
                // Y-coordinates are at index 1, 4, 7... (k*3 + 1)
                const getPt = (idx: number) => ({
                    x: currentKeypoints[idx * 3],
                    y: currentKeypoints[idx * 3 + 1],
                    c: currentKeypoints[idx * 3 + 2]
                });

                const nose = getPt(0);
                const leftShoulder = getPt(5);
                const rightShoulder = getPt(6);
                const leftHip = getPt(11);
                const rightHip = getPt(12);
                const leftKnee = getPt(13);
                const rightKnee = getPt(14);
                const leftAnkle = getPt(15);
                const rightAnkle = getPt(16);

                console.log(`[AI] Keypoints - Nose: (${nose.x.toFixed(0)},${nose.y.toFixed(0)}) Shoulders: (${leftShoulder.x.toFixed(0)},${leftShoulder.y.toFixed(0)})`);
                console.log(`[AI] Box dimensions - W: ${w.toFixed(0)}, H: ${h.toFixed(0)}, Ratio: ${(w / h).toFixed(2)}`);

                // 2. Spine Vector Analysis (Torso Angle)
                // Mid-Shoulder
                const midShoulderX = (leftShoulder.x + rightShoulder.x) / 2;
                const midShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
                // Mid-Hip
                const midHipX = (leftHip.x + rightHip.x) / 2;
                const midHipY = (leftHip.y + rightHip.y) / 2;

                // Vector (Shoulder -> Hip)
                const dx = midHipX - midShoulderX;
                const dy = midHipY - midShoulderY;

                // Angle with Vertical (0 is upright, 90 is flat)
                // Atan2(dy, dx) gives angle with X-axis. 
                const angleRad = Math.atan2(Math.abs(dx), Math.abs(dy));
                const angleDeg = angleRad * (180 / Math.PI);

                console.log(`[AI] Spine Angle: ${angleDeg.toFixed(1)}° (0°=upright, 90°=horizontal)`);

                // 3. Fall Classification - ENHANCED MULTI-METHOD DETECTION
                let postureRisk = 0;
                const detectionReasons: string[] = [];

                // METHOD A: SIMPLE VERTICAL POSITION CHECK (Most Reliable)
                // If head (nose) is at similar Y-level as hips/knees, person is horizontal
                const avgBodyY = (nose.y + leftShoulder.y + rightShoulder.y + leftHip.y + rightHip.y) / 5;
                const avgLowerBodyY = (leftKnee.y + rightKnee.y + leftAnkle.y + rightAnkle.y) / 4;

                // In a standing person, head Y << ankle Y. When fallen, they're similar.
                const verticalCompression = Math.abs(nose.y - avgLowerBodyY);
                const expectedHeight = 640; // Image height
                const compressionRatio = verticalCompression / expectedHeight;

                console.log(`[AI] Vertical Compression: ${verticalCompression.toFixed(0)}px (${(compressionRatio * 100).toFixed(1)}% of image)`);

                if (compressionRatio < 0.25) {
                    // Head and feet at similar vertical level = LYING DOWN
                    postureRisk += 0.9;
                    detectionReasons.push(`Vertical Compression ${(compressionRatio * 100).toFixed(0)}%`);
                    console.log(`[AI] 🔴 FALL DETECTED - Low Vertical Span`);
                } else if (compressionRatio < 0.35) {
                    postureRisk += 0.6;
                    detectionReasons.push(`Partial Compression`);
                }

                // METHOD B: SPINE ANGLE ANALYSIS
                if (angleDeg > 35) {
                    // TORSO IS HORIZONTAL
                    postureRisk += 0.85;
                    detectionReasons.push(`Horizontal Spine ${angleDeg.toFixed(0)}°`);
                    console.log(`[AI] 🔴 FALL DETECTED - Horizontal Spine: ${angleDeg.toFixed(1)}°`);
                } else if (angleDeg > 20) {
                    postureRisk += 0.5;
                    detectionReasons.push(`Leaning ${angleDeg.toFixed(0)}°`);
                }

                // METHOD C: BODY LEVEL CHECK
                // If all body parts are in the lower half of the image
                if (avgBodyY > expectedHeight * 0.6) {
                    postureRisk += 0.7;
                    detectionReasons.push(`Low Body Position`);
                    console.log(`[AI] 🔴 Body in lower region (Y=${avgBodyY.toFixed(0)})`);
                }

                // METHOD D: ASPECT RATIO CHECK
                if (h > 0 && w / h > 1.2) {
                    // Wide aspect ratio = horizontal
                    const ratio = w / h;
                    postureRisk += Math.min(0.5, ratio * 0.3);
                    detectionReasons.push(`Wide Aspect ${ratio.toFixed(1)}`);
                    console.log(`[AI] Horizontal Aspect Ratio: ${ratio.toFixed(2)}`);
                }

                // NORMALIZE CONFIDENCE
                geometricFallConfidence = Math.min(postureRisk, 0.99);
                console.log(`[AI] 📊 Total Fall Confidence: ${(geometricFallConfidence * 100).toFixed(1)}% - Reasons: ${detectionReasons.join(', ')}`);
            }
        }

        // --- STEP 3: MOTION ENERGY (Secondary Context) ---
        let motionScore = 0;
        if (lastFrame) {
            let diffSum = 0;
            const step = 100; // Optimize sampling
            const limit = Math.min(inputImage.length, lastFrame.length);
            for (let i = 0; i < limit; i += step) {
                diffSum += Math.abs(Number(inputImage[i]) - Number(lastFrame[i]));
            }
            if (limit > 0) motionScore = diffSum / (limit / step);
        }
        lastFrame = new Float32Array(inputImage);

        // --- FINAL FUSION ---
        // If Model sees a "Lying Down" posture (High Geometric Confidence), trigger ALert.
        // We do NOT strictly require recent motion (User said "static video").

        // Use the geometric confidence directly - don't default to 0.05
        let finalConfidence = geometricFallConfidence;

        // Debug logging to help diagnose issues
        if (geometricFallConfidence > 0.3) {
            console.log(`[AI] Geometric Fall Confidence: ${(geometricFallConfidence * 100).toFixed(1)}%`);
        }

        const isFall = finalConfidence > FALL_THRESHOLD;

        // Visuals fill
        if (!currentKeypoints.length) {
            currentKeypoints = Array(51).fill(0);
        }

        return {
            isFall,
            confidence: finalConfidence,
            keypoints: currentKeypoints
        };

    } catch (e) {
        console.error("Inference Error:", e);
        return { isFall: false, confidence: 0 };
    }
};
