import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Camera, ChevronDown } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { ManualDataService } from '../services/ManualDataService';
import { useUserStore } from '../store/userStore';

const EditBusinessInfoScreen = ({ navigation }: any) => {
    const userId = useUserStore((state) => state.userId);

    // State for form fields
    const [companyName, setCompanyName] = useState('');
    const [tagline, setTagline] = useState('');
    const [website, setWebsite] = useState('');
    const [location, setLocation] = useState('');
    const [companySize, setCompanySize] = useState('');
    const [industry, setIndustry] = useState('');
    const [foundedYear, setFoundedYear] = useState('');
    const [description, setDescription] = useState('');
    const [benefits, setBenefits] = useState('');
    const [culture, setCulture] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        if (!userId) return;
        setLoading(true);
        const { data, error } = await ManualDataService.getProfile(userId);
        if (data) {
            setCompanyName(data.company_name || '');
            setTagline(data.tagline || '');
            setWebsite(data.website || '');
            setLocation(data.company_location || '');
            setCompanySize(data.company_size || '');
            setIndustry(data.industry || '');
            setFoundedYear(data.founded_year || '');
            setDescription(data.about_company || '');
            setBenefits(data.benefits ? data.benefits.join(', ') : '');
            setCulture(data.culture ? data.culture.join(', ') : '');
            setAvatarUrl(data.avatar_url || null);

        } else if (error) {
            Alert.alert("Error", "Failed to fetch business info");
        }
        setLoading(false);
    };

    const handlePickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                uploadAvatar(result.assets[0]);
            }
        } catch (error) {
            Alert.alert('Error', 'Error picking image');
        }
    };

    const uploadAvatar = async (imageAsset: any) => {
        if (!userId) return;
        try {
            setUploading(true);
            const { publicUrl, error } = await ManualDataService.uploadAvatar(userId, imageAsset.uri);

            if (error) throw error;

            if (publicUrl) {
                setAvatarUrl(publicUrl);
            }

        } catch (error: any) {
            Alert.alert('Upload Failed', error.message || 'Unknown error');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!userId) {
            Alert.alert("Error", "User not found");
            return;
        }

        if (!companyName) {
            Alert.alert("Validation Error", "Company name is required");
            return;
        }

        setSaving(true);
        const updates = {
            company_name: companyName,
            tagline: tagline,
            website: website,
            company_location: location,
            company_size: companySize,
            industry: industry,
            founded_year: foundedYear,
            about_company: description,
            benefits: benefits.split(',').map(s => s.trim()).filter(Boolean),
            culture: culture.split(',').map(s => s.trim()).filter(Boolean),
            avatar_url: avatarUrl,
        };

        const { error } = await ManualDataService.updateProfile(userId, updates);

        setSaving(false);

        if (error) {
            Alert.alert("Error", "Failed to update profile");
        } else {
            Alert.alert("Success", "Business info updated successfully", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#0066FF" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.canGoBack() && navigation.goBack()}
                    style={styles.backButton}
                >
                    <ChevronLeft color="#000" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Business Info</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Company Logo Section */}
                    <View style={styles.logoContainer}>
                        <View style={styles.logoSquare}>
                            {avatarUrl ? (
                                <Image source={{ uri: avatarUrl }} style={{ width: '100%', height: '100%', borderRadius: 12 }} />
                            ) : (
                                <Text style={styles.logoInitials}>
                                    {companyName ? companyName.substring(0, 2).toUpperCase() : 'CO'}
                                </Text>
                            )}
                            {uploading && (
                                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', borderRadius: 12 }]}>
                                    <ActivityIndicator color="white" />
                                </View>
                            )}
                        </View>
                        <TouchableOpacity style={styles.cameraButton} onPress={handlePickImage} disabled={uploading}>
                            <Camera size={16} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formContainer}>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Company Name <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                value={companyName}
                                onChangeText={setCompanyName}
                                placeholder="e.g. Acme Corp"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Tagline</Text>
                            <TextInput
                                style={styles.input}
                                value={tagline}
                                onChangeText={setTagline}
                                placeholder="e.g. Innovation for everyone"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Website</Text>
                            <TextInput
                                style={styles.input}
                                value={website}
                                onChangeText={setWebsite}
                                autoCapitalize="none"
                                placeholder="e.g. www.acme.com"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Location</Text>
                            <TextInput
                                style={styles.input}
                                value={location}
                                onChangeText={setLocation}
                                placeholder="e.g. San Francisco, CA"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Company Size</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={[styles.input, { paddingRight: 40 }]}
                                    value={companySize}
                                    onChangeText={setCompanySize}
                                    placeholder="e.g. 50-200 employees"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Industry</Text>
                            <TextInput
                                style={styles.input}
                                value={industry}
                                onChangeText={setIndustry}
                                placeholder="e.g. Technology"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Founded Year</Text>
                            <TextInput
                                style={styles.input}
                                value={foundedYear}
                                onChangeText={setFoundedYear}
                                keyboardType="numeric"
                                placeholder="e.g. 2015"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Company Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={description}
                                onChangeText={setDescription}
                                multiline={true}
                                numberOfLines={6}
                                textAlignVertical="top"
                                placeholder="Tell us about your company..."
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Benefits & Perks (comma separated)</Text>
                            <TextInput
                                style={styles.input}
                                value={benefits}
                                onChangeText={setBenefits}
                                placeholder="e.g. Health Insurance, Remote Work, 401k"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Company Culture (comma separated)</Text>
                            <TextInput
                                style={styles.input}
                                value={culture}
                                onChangeText={setCulture}
                                placeholder="e.g. Innovation, Work-Life Balance, Diverse"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                    </View>

                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
                        <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

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
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold', // Semibold/Bold
        color: '#111827',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 100,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 32,
        position: 'relative',
    },
    logoSquare: {
        width: 100,
        height: 100,
        borderRadius: 12, // Square with rounded corners as per image
        backgroundColor: '#0066FF',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    logoInitials: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
    },
    cameraButton: {
        position: 'absolute',
        bottom: -8,
        right: '34%', // Adjusted centering
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    formContainer: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        color: '#4B5563',
    },
    required: {
        color: '#EF4444',
    },
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB', // Lighter border
        borderRadius: 8, // Slightly more rounded
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: '#1F2937',
    },
    inputIcon: {
        position: 'absolute',
        right: 12,
    },
    textArea: {
        minHeight: 120,
        lineHeight: 22,
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: 'white',
    },
    saveButton: {
        backgroundColor: '#0066FF',
        height: 52,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EditBusinessInfoScreen;
