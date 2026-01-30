import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, User, Edit2, FileText, Bookmark, ClipboardList, Settings, HelpCircle, LogOut, ChevronRight, Clock, MapPin } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ManualDataService } from '../services/ManualDataService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from '../store/userStore';

const ProfileScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const userRole = useUserStore((state) => state.role);

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [])
    );

    const fetchProfile = async () => {
        try {
            // Use ManualService to get User and Profile
            const user = await ManualDataService.getUser();
            if (!user) {
                console.log("No user found in storage");
                setLoading(false);
                return;
            }

            const { data, error } = await ManualDataService.getProfile(user.id);

            if (error) throw error;
            setProfile(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        // Clear storage manually
        await AsyncStorage.removeItem('supabase_token');
        await AsyncStorage.removeItem('supabase_user');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    const handleEditProfile = () => {
        if (userRole === 'EMPLOYER') {
            navigation.navigate('EditBusinessInfo');
        } else {
            navigation.navigate('EditProfile');
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
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        {profile?.avatar_url ? (
                            <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
                        ) : (
                            <View style={styles.avatar}>
                                <Text style={styles.avatarInitials}>
                                    {profile?.full_name ? profile.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                                </Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{profile?.full_name || 'User'}</Text>
                        <Text style={styles.profileTitle}>{profile?.headline || 'No Headline'}</Text>
                        {profile?.location && (
                            <View style={styles.locationRow}>
                                <MapPin size={12} color="#6B7280" />
                                <Text style={styles.locationText}>{profile.location}</Text>
                            </View>
                        )}
                        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                            <Text style={styles.editButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bio Section */}
                {profile?.bio && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>
                        <Text style={styles.bioText}>{profile.bio}</Text>
                    </View>
                )}

                {/* Skills */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('AddSkills')}>
                            <Text style={styles.addLink}>{profile?.skills?.length ? 'Edit' : 'Add'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.skillsContainer}>
                        {profile?.skills && profile.skills.length > 0 ? (
                            profile.skills.map((skill: string, index: number) => (
                                <View key={index} style={styles.skillChip}>
                                    <Text style={styles.skillText}>{skill}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.emptyText}>No skills added yet.</Text>
                        )}
                    </View>
                </View>

                {/* Resume */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Resume</Text>
                    {profile?.resume_url ? (
                        <View style={styles.resumeCard}>
                            <View style={styles.resumeIcon}>
                                <FileText size={24} color="#6B7280" />
                            </View>
                            <View style={styles.resumeInfo}>
                                <Text style={styles.resumeName}>Resume Uploaded</Text>
                                <TouchableOpacity onPress={() => Linking.openURL(profile.resume_url)}>
                                    <Text style={styles.viewLink}>View</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate('UploadResume')}>
                                <Text style={styles.updateLink}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.uploadResumeButton} onPress={() => navigation.navigate('UploadResume')}>
                            <Text style={styles.uploadResumeText}>Upload Resume</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('RecentlyViewed')}
                    >
                        <View style={styles.menuIconCircle}><Clock size={20} color="#8B5CF6" /></View>
                        <Text style={styles.menuText}>Recently Viewed</Text>
                        <ChevronRight size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Jobs')}
                    >
                        <View style={styles.menuIconCircle}><Bookmark size={20} color="#3B82F6" /></View>
                        <Text style={styles.menuText}>Saved Jobs</Text>
                        <ChevronRight size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('AppliedJobs')}
                    >
                        <View style={styles.menuIconCircle}><ClipboardList size={20} color="#10B981" /></View>
                        <Text style={styles.menuText}>Applied Jobs</Text>
                        <ChevronRight size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <View style={styles.menuIconCircle}><Settings size={20} color="#6B7280" /></View>
                        <Text style={styles.menuText}>Settings</Text>
                        <ChevronRight size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('HelpSupport')}
                    >
                        <View style={styles.menuIconCircle}><HelpCircle size={20} color="#8B5CF6" /></View>
                        <Text style={styles.menuText}>Help & Support</Text>
                        <ChevronRight size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                        <View style={[styles.menuIconCircle, { backgroundColor: '#FEE2E2' }]}><LogOut size={20} color="#EF4444" /></View>
                        <Text style={[styles.menuText, { color: '#EF4444' }]}>Logout</Text>
                        <ChevronRight size={20} color="#EF4444" />
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    avatarContainer: {
        marginRight: 16,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#0066FF', // Blue
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    profileTitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    locationText: {
        fontSize: 13,
        color: '#6B7280',
    },
    avatarImage: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    avatarInitials: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    editButton: {
    },
    editButtonText: {
        color: '#2563EB',
        fontSize: 14,
        fontWeight: '600',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillChip: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    skillText: {
        color: '#2563EB',
        fontSize: 12,
        fontWeight: '500',
    },
    addLink: {
        color: '#2563EB',
        fontSize: 13,
        fontWeight: '600',
    },
    bioText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },
    emptyText: {
        fontSize: 14,
        color: '#9CA3AF',
        fontStyle: 'italic',
    },
    experienceItem: {
        marginBottom: 16,
    },
    itemContent: {
        gap: 2,
    },
    itemTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    itemSubtitle: {
        fontSize: 13,
        color: '#6B7280',
    },
    itemDate: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    resumeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    resumeIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#E5E7EB',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    resumeInfo: {
        flex: 1,
    },
    resumeName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    resumeDate: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    updateLink: {
        color: '#2563EB',
        fontSize: 13,
        fontWeight: '600',
    },
    viewLink: {
        color: '#2563EB',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    uploadResumeButton: {
        backgroundColor: '#EFF6FF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#BFDBFE',
        borderStyle: 'dashed',
    },
    uploadResumeText: {
        color: '#2563EB',
        fontSize: 14,
        fontWeight: '600',
    },
    menuContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    menuIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: '#374151',
    },
});

export default ProfileScreen;
