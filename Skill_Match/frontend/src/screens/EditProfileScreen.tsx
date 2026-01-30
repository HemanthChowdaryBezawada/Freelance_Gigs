import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { ManualDataService } from '../services/ManualDataService';

const EditProfileScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form Fields
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [jobTitle, setJobTitle] = useState(''); // Maps to headline
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [email, setEmail] = useState(''); // Read-only usually

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const user = await ManualDataService.getUser();
            if (!user) {
                console.log("No user found");
                return;
            }

            setEmail(user.email || '');

            const { data, error } = await ManualDataService.getProfile(user.id);

            if (error) {
                console.error('Error fetching profile:', error);
                return;
            }

            if (data) {
                setFullName(data.full_name || '');
                setPhone(data.phone || user.user_metadata?.phone || '');
                setJobTitle(data.headline || '');
                setLocation(data.location || '');
                setBio(data.bio || '');
                setSkills(data.skills ? data.skills.join(', ') : '');
                setAvatarUrl(data.avatar_url);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
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
        try {
            setUploading(true);
            const user = await ManualDataService.getUser();
            if (!user) return;

            const { publicUrl, error } = await ManualDataService.uploadAvatar(user.id, imageAsset.uri);

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
        try {
            setLoading(true);
            const user = await ManualDataService.getUser();
            if (!user) {
                Alert.alert('Session Expired', 'Please login again.', [
                    { text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) }
                ]);
                return;
            }

            const updates = {
                id: user.id,
                full_name: fullName,
                phone,
                headline: jobTitle,
                location,
                bio,
                skills: skills.split(',').map(s => s.trim()).filter(Boolean),
                avatar_url: avatarUrl,
                updated_at: new Date(),
            };

            const { error } = await ManualDataService.updateProfile(user.id, updates);

            if (error) throw new Error(error.message || 'Update failed');

            Alert.alert('Success', 'Profile updated!');
            navigation.goBack();

        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !fullName) {
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
                <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#000" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Profile Picture */}
                    <View style={styles.profilePicContainer}>
                        <View style={styles.avatarCircle}>
                            {avatarUrl ? (
                                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                            ) : (
                                <Text style={styles.avatarInitials}>
                                    {fullName ? fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                                </Text>
                            )}
                            {uploading && (
                                <View style={styles.uploadingOverlay}>
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
                            <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: '#F3F4F6' }]}
                                value={email}
                                editable={false}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone</Text>
                            <TextInput
                                style={styles.input}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Job Title / Headline</Text>
                            <TextInput
                                style={styles.input}
                                value={jobTitle}
                                onChangeText={setJobTitle}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Location</Text>
                            <TextInput
                                style={styles.input}
                                value={location}
                                onChangeText={setLocation}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Bio</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={bio}
                                onChangeText={setBio}
                                multiline={true}
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Skills (comma separated)</Text>
                            <TextInput
                                style={styles.input}
                                value={skills}
                                onChangeText={setSkills}
                                placeholder="React, TypeScript, UI Design"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                    </View>

                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        )}
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
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 100,
    },
    profilePicContainer: {
        alignItems: 'center',
        marginBottom: 32,
        position: 'relative',
    },
    avatarCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#0066FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    uploadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: '36%', // Approximate centering relative to circle
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
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    required: {
        color: '#EF4444',
    },
    input: {

        borderWidth: 1,
        borderColor: '#F3F4F6', // Very light border 
        // Image shows inputs looking very clean, maybe shadow?
        // Let's assume standard input style
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1F2937',
        // Shadow for "floaty" look if needed, but flat is safer
        backgroundColor: '#FAFAFA', // Slight off-white to contrast
    },
    textArea: {
        minHeight: 100,
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    saveButton: {
        backgroundColor: '#0066FF',
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
});

export default EditProfileScreen;
