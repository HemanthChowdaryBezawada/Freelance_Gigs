import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBackendUrl = () => {
    try {
        // Automatically detect the host IP from Expo Go / Dev Client
        if (Constants.expoConfig?.hostUri) {
            const host = Constants.expoConfig.hostUri.split(':')[0];
            return `http://${host}:8000`; // Assumes backend runs on port 8000
        }
    } catch (error) {
        console.warn("Failed to get dynamic backend URL, falling back to hardcoded.");
    }
    // Fallback for Android Emulator (10.0.2.2) or hardcoded default
    return Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://10.130.5.151:8000';
};

export const DEV_BACKEND_URL = getBackendUrl();
console.log("Using Backend URL:", DEV_BACKEND_URL);

const api = axios.create({
    baseURL: DEV_BACKEND_URL,
    // headers: { 'Content-Type': 'multipart/form-data' }, // DO NOT SET THIS MANUALLY! It breaks boundary generation.
    timeout: 15000,
});

export interface Prediction {
    breed: string;
    confidence: number;
}

export const getScans = async (mobile: string): Promise<any[]> => {
    try {
        const response = await api.get(`/scans/${mobile}`);
        return response.data;
    } catch (error) {
        console.error('Get Scans Error:', error);
        throw error;
    }
};

import { uploadAsync, FileSystemUploadType } from 'expo-file-system/legacy';

// ... (existing imports)

export const classifyBreed = async (imageUri: string, mobile: string = "1234567890"): Promise<Prediction[]> => {
    try {
        console.log(`Uploading image (v3 legacy) to ${DEV_BACKEND_URL}/predict defined via FileSystem...`);
        const response = await uploadAsync(`${DEV_BACKEND_URL}/predict`, imageUri, {
            fieldName: 'file',
            httpMethod: 'POST',
            uploadType: FileSystemUploadType.MULTIPART,
            parameters: {
                'mobile': mobile
            }
        });

        console.log("Upload status:", response.status);

        if (response.status !== 200) {
            throw new Error(`HTTP Error: ${response.status} - ${response.body}`);
        }

        const data = JSON.parse(response.body);
        return data.predictions;
    } catch (error) {
        console.error('API Error (FileSystem):', error);
        throw error;
    }
};

export const getStats = async (mobile: string): Promise<any> => {
    try {
        const response = await api.get(`/stats/${mobile}`);
        return response.data;
    } catch (error) {
        console.error('Get Stats Error:', error);
        throw error;
    }
};
// --- Auth API ---

export const sendOtp = async (mobile: string): Promise<any> => {
    try {
        const response = await api.post('/auth/login', { mobile }, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error('Send OTP Error:', error);
        throw error;
    }
};

export const verifyOtp = async (mobile: string, otp: string): Promise<any> => {
    try {
        const response = await api.post('/auth/verify', { mobile, otp }, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error('Verify OTP Error:', error);
        throw error;
    }
};

// --- Profile API ---

export const getProfile = async (mobile: string): Promise<any> => {
    try {
        const response = await api.get(`/profile/${mobile}`);
        return response.data;
    } catch (error) {
        console.error('Get Profile Error:', error);
        throw error;
    }
};

export const updateProfile = async (mobile: string, data: any): Promise<any> => {
    try {
        const response = await api.put(`/profile/${mobile}`, data, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error('Update Profile Error:', error);
        throw error;
    }
};

export const uploadProfilePicture = async (mobile: string, imageUri: string): Promise<any> => {
    try {
        console.log("Uploading profile picture...");
        const response = await uploadAsync(`${DEV_BACKEND_URL}/profile/upload`, imageUri, {
            fieldName: 'file',
            httpMethod: 'POST',
            uploadType: FileSystemUploadType.MULTIPART,
            parameters: {
                'mobile': mobile
            }
        });

        if (response.status !== 200) {
            throw new Error(`HTTP Error: ${response.status} - ${response.body}`);
        }

        return JSON.parse(response.body);
    } catch (error) {
        console.error('Profile Upload Error:', error);
        throw error;
    }
};
