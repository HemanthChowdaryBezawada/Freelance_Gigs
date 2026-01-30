import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, StatusBar, Image, Dimensions } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getProfile, getStats, getScans, DEV_BACKEND_URL } from '../../services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();
    const [userName, setUserName] = useState("Cattle Officer");
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [stats, setStats] = useState({ totalScans: 0, thisMonth: 0 });
    const [recentScans, setRecentScans] = useState<any[]>([]);
    const mobileNumber = "1234567890"; // Mock mobile

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        try {
            // Load Profile
            const profileData = await getProfile(mobileNumber);
            if (profileData && profileData.full_name) {
                setUserName(profileData.full_name);
                if (profileData.profile_picture) {
                    const url = profileData.profile_picture.startsWith('/') ? `${DEV_BACKEND_URL}${profileData.profile_picture}` : profileData.profile_picture;
                    setProfilePic(url);
                }
            }

            // Load Stats
            const statsData = await getStats(mobileNumber);
            if (statsData) {
                setStats({
                    totalScans: statsData.total_scans,
                    thisMonth: statsData.this_month
                });
            }

            // Load Recent Scans
            const scansData = await getScans(mobileNumber);
            if (scansData) {
                setRecentScans(scansData.slice(0, 3)); // Top 3 most recent
            }
        } catch (error) {
            console.log("Failed to load home data");
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
            <SafeAreaView style={styles.safeArea}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Cattle Sense</Text>
                    <TouchableOpacity>
                        <Ionicons name="notifications" size={26} color="#1B4332" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Welcome Card */}
                    <View style={styles.welcomeCard}>
                        <View style={styles.profileSection}>
                            {/* User Avatar based on Name */}
                            <View style={styles.profileImageContainer}>
                                <Image
                                    source={{ uri: profilePic || `https://ui-avatars.com/api/?name=${userName}&background=FF8008&color=fff&size=200` }}
                                    style={styles.profileImage}
                                />
                            </View>
                            <View>
                                <Text style={styles.welcomeText}>Welcome back,</Text>
                                <Text style={styles.userName}>{userName}</Text>
                            </View>
                        </View>

                        <View style={styles.statsContainer}>
                            <View style={styles.statBox}>
                                <Text style={styles.statLabel}>Total Scans</Text>
                                <Text style={styles.statValue}>{stats.totalScans}</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statLabel}>This Month</Text>
                                <Text style={styles.statValue}>{stats.thisMonth}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Quick Actions Title */}
                    <Text style={styles.sectionTitle}>Quick Actions</Text>

                    {/* Quick Actions Grid */}
                    <View style={styles.gridContainer}>
                        {/* Scan Cattle */}
                        <TouchableOpacity style={styles.gridCard} onPress={() => router.push('/(tabs)')}>
                            {/* Note: /(tabs) index is likely the Scan screen based on layout */}
                            <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                                <Ionicons name="camera" size={28} color="#1B4332" />
                            </View>
                            <Text style={styles.gridTitle}>Scan Cattle</Text>
                            <Text style={styles.gridSubtitle}>Identify breed</Text>
                        </TouchableOpacity>

                        {/* My Records */}
                        <TouchableOpacity style={styles.gridCard} onPress={() => router.push('/(tabs)/records')}>
                            <View style={[styles.iconContainer, { backgroundColor: '#E0F7FA' }]}>
                                <Ionicons name="folder-open" size={28} color="#00695C" />
                            </View>
                            <Text style={styles.gridTitle}>My Records</Text>
                            <Text style={styles.gridSubtitle}>View saved data</Text>
                        </TouchableOpacity>

                        {/* Breed Library */}
                        <TouchableOpacity style={styles.gridCard} onPress={() => router.push('/(stack)/breed-library')}>
                            <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
                                <Ionicons name="book" size={28} color="#EF6C00" />
                            </View>
                            <Text style={styles.gridTitle}>Breed Library</Text>
                            <Text style={styles.gridSubtitle}>Browse breeds</Text>
                        </TouchableOpacity>

                        {/* BPA Sync */}
                        <TouchableOpacity style={styles.gridCard} onPress={() => router.push('/(stack)/bpa-coming-soon')}>
                            <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
                                <MaterialCommunityIcons name="link-variant" size={28} color="#7B1FA2" />
                            </View>
                            <Text style={styles.gridTitle}>BPA Sync</Text>
                            <Text style={styles.gridSubtitle}>Integration</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Recent Activity Title */}
                    <Text style={styles.sectionTitle}>Recent Activity</Text>

                    {/* Recent Activity List */}
                    <View style={styles.recentList}>
                        {recentScans.length === 0 ? (
                            <View style={styles.recentActivityPlaceholder}>
                                <Text style={{ color: '#AAA' }}>No recent activity</Text>
                            </View>
                        ) : (
                            recentScans.map((item) => {
                                let imageUrl = item.image;
                                if (imageUrl && imageUrl.startsWith('/')) {
                                    imageUrl = `${DEV_BACKEND_URL}${imageUrl}`;
                                }
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.recentCard}
                                        onPress={() => router.push({ pathname: '/(stack)/breed-detail' as any, params: { breed: item.breed } })}
                                    >
                                        <Image
                                            source={
                                                typeof imageUrl === 'string'
                                                    ? { uri: imageUrl }
                                                    : imageUrl // Handle local require() assets
                                            }
                                            style={styles.recentImage}
                                        />
                                        <View style={styles.recentInfo}>
                                            <Text style={styles.recentBreed}>{item.breed}</Text>
                                            <Text style={styles.recentDate}>{item.date}</Text>
                                            <View style={styles.recentBadge}>
                                                <Text style={styles.recentBadgeText}>
                                                    {(item.confidence * 100).toFixed(0)}% Confidence
                                                </Text>
                                            </View>
                                        </View>
                                        <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA', // Light page background
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#F5F7FA',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1B4332',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    welcomeCard: {
        backgroundColor: '#2D4F43', // Muted Dark Green matching screenshot
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImageContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#FFF',
        overflow: 'hidden',
        marginRight: 15,
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    welcomeText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginBottom: 2,
    },
    userName: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    statBox: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
        padding: 15,
    },
    statLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginBottom: 5,
    },
    statValue: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1B4332',
        marginBottom: 15,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    gridCard: {
        width: (width - 60) / 2, // 2 items per row with gap
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 15,
        marginBottom: 20,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    iconContainer: {
        width: 55,
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    gridTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A2A3A',
        marginBottom: 4,
    },
    gridSubtitle: {
        fontSize: 12,
        color: '#718096',
        textAlign: 'center',
    },
    recentActivityPlaceholder: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
    },
    recentList: {
        gap: 12,
    },
    recentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    recentImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#E2E8F0',
    },
    recentInfo: {
        flex: 1,
        marginLeft: 12,
    },
    recentBreed: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 2,
    },
    recentDate: {
        fontSize: 12,
        color: '#718096',
        marginBottom: 4,
    },
    recentBadge: {
        backgroundColor: '#F0FFF4',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#C6F6D5',
    },
    recentBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#276749',
    },
});
