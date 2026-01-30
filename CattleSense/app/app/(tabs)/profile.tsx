import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getProfile, DEV_BACKEND_URL } from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';

export default function ProfileTab() {
    const router = useRouter();
    const { userMobile, logout } = useAuthStore();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const mobileNumber = userMobile || "1234567890"; // Use stored mobile or fallback

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getProfile(mobileNumber);
            setProfile(data);
        } catch (error) {
            console.log("Failed to load profile tab");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#FF8008" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1A2A3A" />

            <View style={styles.header}>
                <SafeAreaView>
                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>Profile</Text>
                        <TouchableOpacity onPress={loadData}>
                            <Ionicons name="reload" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileSummary}>
                        <Image
                            source={{
                                uri: profile?.profile_picture
                                    ? (profile.profile_picture.startsWith('/')
                                        ? `${DEV_BACKEND_URL}${profile.profile_picture}`
                                        : profile.profile_picture)
                                    : `https://ui-avatars.com/api/?name=${profile?.full_name || 'User'}&background=FF8008&color=fff&size=200`
                            }}
                            style={styles.avatar}
                        />
                        <Text style={styles.userName}>{profile?.full_name || "Cattle Officer"}</Text>
                        <Text style={styles.userRole}>{profile?.role || "Veterinarian"}</Text>
                        <Text style={styles.userLocation}>
                            <Ionicons name="location" size={12} color="#AAA" /> {profile?.location || "Unknown Location"}
                        </Text>
                    </View>
                </SafeAreaView>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => router.push('/(stack)/profile')}
                >
                    <View style={styles.iconBox}>
                        <Ionicons name="person-circle" size={24} color="#FF8008" />
                    </View>
                    <View style={styles.actionText}>
                        <Text style={styles.actionTitle}>Edit Profile</Text>
                        <Text style={styles.actionSub}>Update personal details</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(stack)/settings')}>
                    <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                        <Ionicons name="settings" size={24} color="#2196F3" />
                    </View>
                    <View style={styles.actionText}>
                        <Text style={styles.actionTitle}>Settings</Text>
                        <Text style={styles.actionSub}>App preferences & notifications</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(stack)/help')}>
                    <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                        <Ionicons name="help-circle" size={24} color="#4CAF50" />
                    </View>
                    <View style={styles.actionText}>
                        <Text style={styles.actionTitle}>Help & Support</Text>
                        <Text style={styles.actionSub}>FAQs and contact support</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionCard, { marginTop: 20 }]}
                    onPress={() => {
                        logout();
                        router.replace('/(auth)/login');
                    }}
                >
                    <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                        <Ionicons name="log-out" size={24} color="#F44336" />
                    </View>
                    <View style={styles.actionText}>
                        <Text style={[styles.actionTitle, { color: '#F44336' }]}>Logout</Text>
                    </View>
                </TouchableOpacity>

            </ScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#1A2A3A',
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    profileSummary: {
        alignItems: 'center',
        marginTop: 10,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#FF8008',
        marginBottom: 10,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
    },
    userRole: {
        color: '#BBB',
        fontSize: 14,
        marginTop: 2,
    },
    userLocation: {
        color: '#AAA',
        fontSize: 12,
        marginTop: 5,
    },
    content: {
        padding: 20,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        elevation: 2,
    },
    iconBox: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: '#FFF3E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    actionText: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A2A3A',
    },
    actionSub: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
});
