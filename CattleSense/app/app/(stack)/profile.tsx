import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../store/authStore';

import { getProfile, updateProfile, uploadProfilePicture, DEV_BACKEND_URL } from '../../services/api';

export default function ProfileScreen() {
    const router = useRouter();
    const { userMobile } = useAuthStore();
    // In a real app, retrieve this from a global Auth Context or AsyncStorage
    // For now, we simulate the logged-in user as the last one who logged in (or hardcoded for dev)
    const mobileNumber = userMobile || "1234567890"; // Use dynamic user mobile

    const [name, setName] = useState('');
    const [phone, setPhone] = useState(mobileNumber);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Veterinarian');
    const [location, setLocation] = useState('');
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getProfile(mobileNumber);
            setName(data.full_name);
            setPhone(data.mobile);
            setEmail(data.email);
            setLocation(data.location);
            setRole(data.role || 'Veterinarian');
            if (data.profile_picture) {
                // Ensure backend URL is prepended if relative
                const url = data.profile_picture.startsWith('/') ? `${DEV_BACKEND_URL}${data.profile_picture}` : data.profile_picture;
                setProfilePic(url);
            }
        } catch (error) {
            console.log("Profile load failed (likely first time user), keeping defaults");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await updateProfile(mobileNumber, {
                full_name: name,
                email: email,
                location: location,
                role: role
            });
            alert('Profile updated successfully! ✅');
        } catch (error) {
            alert('Failed to update profile ❌');
        }
    };

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setProfilePic(uri); // Optimistic update

            try {
                const response = await uploadProfilePicture(mobileNumber, uri);
                if (response.success && response.profile_picture) {
                    const fullUrl = `${DEV_BACKEND_URL}${response.profile_picture}`;
                    setProfilePic(fullUrl);
                    alert('Profile picture updated! 📸');
                }
            } catch (error) {
                alert('Failed to upload image. Please try again.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1A2A3A" />

            {/* Header with Avatar */}
            <View style={styles.header}>
                <SafeAreaView>
                    <View style={styles.headerTop}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>My Profile</Text>
                        <TouchableOpacity onPress={handleSave}>
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: profilePic || `https://ui-avatars.com/api/?name=${name || 'User'}&background=FF8008&color=fff&size=200` }}
                                style={styles.avatar}
                            />
                            <TouchableOpacity style={styles.editBadge} onPress={handlePickImage}>
                                <Ionicons name="camera" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.userName}>{name || "Cattle Officer"}</Text>
                        <Text style={styles.userRole}>{role}</Text>
                    </View>
                </SafeAreaView>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter full name" />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Mobile Number</Text>
                    <TextInput style={[styles.input, styles.disabledInput]} value={phone} editable={false} />
                    <Text style={styles.helperText}>Verified contact number cannot be changed easily.</Text>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter email" keyboardType="email-address" />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Role / Designation</Text>
                    <TextInput style={styles.input} value={role} onChangeText={setRole} placeholder="e.g. Veterinarian" />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Assigned Location</Text>
                    <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="e.g. Anand, Gujarat" />
                </View>

                <View style={styles.statsCard}>
                    <View style={styles.statItem}>
                        <Text style={styles.statVal}>0</Text>
                        <Text style={styles.statLabel}>Scans</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statVal}>0</Text>
                        <Text style={styles.statLabel}>Approved</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statVal}>0</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        backgroundColor: '#1A2A3A',
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    saveText: {
        color: '#FF8008',
        fontWeight: 'bold',
        fontSize: 16,
    },
    profileHeader: {
        alignItems: 'center',
        marginTop: 10,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FF8008',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#1A2A3A',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    userRole: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginTop: 4,
    },
    content: {
        padding: 24,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#5B6B7C',
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1A2A3A',
        borderWidth: 1,
        borderColor: '#E0E6ED',
    },
    disabledInput: {
        backgroundColor: '#F5F7FA',
        color: '#9AA5B1',
    },
    helperText: {
        fontSize: 12,
        color: '#9AA5B1',
        marginTop: 6,
    },
    statsCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginTop: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statVal: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A2A3A',
    },
    statLabel: {
        fontSize: 12,
        color: '#5B6B7C',
        marginTop: 4,
    },
    divider: {
        width: 1,
        backgroundColor: '#E0E6ED',
        marginVertical: 4,
    },
});
