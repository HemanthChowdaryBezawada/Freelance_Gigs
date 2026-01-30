
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Upload, ShieldCheck, FileText } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { ManualDataService } from '../services/ManualDataService';

const UploadResumeScreen = ({ navigation }: any) => {

    const [file, setFile] = useState<any>(null);
    const [uploading, setUploading] = useState(false);

    const handleBrowse = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            setFile(result.assets[0]);
        } catch (err) {
            console.warn(err);
        }
    };

    const handleSave = async () => {
        if (!file) {
            Alert.alert("No File", "Please select a resume to upload.");
            return;
        }

        setUploading(true);
        try {
            const user = await ManualDataService.getUser();
            if (!user) {
                Alert.alert('Session Expired', 'Please login again.', [
                    { text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) }
                ]);
                return;
            }

            // 1. Upload Resume
            const { publicUrl, error: uploadError } = await ManualDataService.uploadResume(user.id, file);

            if (uploadError) throw new Error(uploadError.message || 'Upload failed');
            if (!publicUrl) throw new Error('Failed to get download URL');

            // 2. Update Profile with Resume URL
            const { error: dbError } = await ManualDataService.updateProfile(user.id, {
                resume_url: publicUrl
            });

            if (dbError) throw dbError;

            Alert.alert("Success", "Resume uploaded!");
            navigation.navigate('JobPreferences');

        } catch (e: any) {
            Alert.alert("Upload Failed", e.message);
            console.error(e);
        } finally {
            setUploading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#111" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Upload Resume & Portfolio</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>

                {/* Upload Box */}
                {/* Upload Box */}
                <View style={styles.uploadBox}>
                    {file ? (
                        <View style={styles.filePreview}>
                            <FileText size={48} color="#2563EB" />
                            <Text style={styles.fileName}>{file.name}</Text>
                            <Text style={styles.fileSize}>{(file.size / 1024 / 1024).toFixed(2)} MB</Text>
                            <TouchableOpacity style={styles.changeButton} onPress={handleBrowse}>
                                <Text style={styles.changeButtonText}>Change File</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.uploadBoxDashed}>
                            <Upload color="#9CA3AF" size={48} strokeWidth={1.5} />
                            <Text style={styles.uploadTitle}>Upload your resume or portfolio</Text>
                            <Text style={styles.uploadSubtitle}>PDF, DOC, DOCX up to 10MB</Text>

                            <TouchableOpacity style={styles.browseButton} onPress={handleBrowse}>
                                <Text style={styles.browseButtonText}>Browse Files</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Pro Tip */}
                <View style={styles.tipContainer}>
                    <View style={styles.tipHeader}>
                        <ShieldCheck color="#10B981" size={20} />
                        <Text style={styles.tipTitle}>Pro Tip</Text>
                    </View>
                    <Text style={styles.tipText}>
                        Upload multiple versions of your resume tailored for different job types to increase your match rate.
                    </Text>
                </View>

            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.saveButton, uploading && { opacity: 0.7 }]}
                    onPress={handleSave}
                    disabled={uploading}
                >
                    {uploading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Documents</Text>
                    )}
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    content: {
        flex: 1,
        padding: 24,
    },
    uploadBox: {
        marginBottom: 24,
    },
    uploadBoxDashed: {
        borderWidth: 1,
        borderColor: '#E5E7EB', // Dashed border is hard in plain RN without extra libs perfectly, dotted sometimes used.
        // Spec shows "dotted" or dashed light grey line. 
        borderStyle: 'dashed',
        borderRadius: 16,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB', // Very light grey/white
    },
    uploadTitle: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    uploadSubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
        marginBottom: 24,
    },
    browseButton: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    browseButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    tipContainer: {
        backgroundColor: '#ECFDF5', // Light green/mint
        borderRadius: 12,
        padding: 16,
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    tipTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
    },
    tipText: {
        fontSize: 13,
        color: '#4B5563',
        lineHeight: 20,
    },
    footer: {
        padding: 24,
    },
    saveButton: {
        backgroundColor: '#2563EB',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    filePreview: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#EFF6FF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    fileName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginTop: 12,
        textAlign: 'center',
    },
    fileSize: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
    },
    changeButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    changeButtonText: {
        color: '#2563EB',
        fontWeight: '600',
    },
});

export default UploadResumeScreen;
