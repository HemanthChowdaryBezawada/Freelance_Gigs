import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Zap, Bookmark, ClipboardList, Clock, User, Filter, Sparkles } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ManualDataService } from '../services/ManualDataService';
import { useTheme } from '../context/ThemeContext';

const GRID_ITEMS = [
    { id: '1', title: 'Find Jobs', icon: MapPin, color: '#3B82F6', iconColor: '#fff', bg: '#EFF6FF' },
    { id: '2', title: 'AI Recommendations', icon: Zap, color: '#10B981', iconColor: '#fff', bg: '#ECFDF5' },
    { id: '3', title: 'Saved Jobs', icon: Bookmark, color: '#F59E0B', iconColor: '#fff', bg: '#FFFBEB' },
    { id: '4', title: 'Applied Jobs', icon: ClipboardList, color: '#8B5CF6', iconColor: '#fff', bg: '#F5F3FF' },
];

import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }: any) => {
    const { colors, theme } = useTheme();
    const [userName, setUserName] = useState('Alex');
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const fetchData = async () => {
        try {
            const user = await ManualDataService.getUser();
            if (user) {
                // Fetch Profile
                const { data: profile } = await ManualDataService.getProfile(user.id);
                if (profile) {
                    setUserName(profile.full_name || 'User');
                    setUserAvatar(profile.avatar_url);
                }

                // Fetch Recommendations
                const { data: jobs } = await ManualDataService.getAIRecommendations(user.id);
                // Take top 3
                setRecommendedJobs(jobs ? jobs.slice(0, 3) : []);

                // Fetch Recent Searches
                const stored = await AsyncStorage.getItem('recent_searches');
                if (stored) {
                    setRecentSearches(JSON.parse(stored));
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const clearRecentSearches = async () => {
        try {
            await AsyncStorage.removeItem('recent_searches');
            setRecentSearches([]);
        } catch (e) {
            console.error("Failed to clear recent searches");
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header Section (Blue Background) */}
            <View style={styles.headerContainer}>
                <SafeAreaView edges={['top', 'left', 'right']}>
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.headerGreeting}>Good Morning,</Text>
                            <Text style={styles.headerName}>{userName}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.profileButton}
                            onPress={() => navigation.navigate('EditProfile')}
                        >
                            {userAvatar ? (
                                <Image
                                    source={{ uri: userAvatar }}
                                    style={styles.profileImage}
                                />
                            ) : (
                                <User color="white" size={24} />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Search Bar - Navigate to SearchScreen */}
                    <TouchableOpacity
                        style={styles.searchBar}
                        onPress={() => navigation.navigate('Search')}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.searchPlaceholder}>Search jobs, companies...</Text>
                        <Search color="#9CA3AF" size={20} />
                    </TouchableOpacity>
                </SafeAreaView>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Grid Menu */}
                <View style={styles.gridContainer}>
                    <View style={styles.gridRow}>
                        <TouchableOpacity
                            style={styles.cardInfo}
                            onPress={() => navigation.navigate('Map')}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: '#DBEAFE' }]}>
                                <MapPin size={24} color="#2563EB" />
                            </View>
                            <Text style={styles.cardTitle}>Find Jobs</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cardInfo}
                            onPress={() => navigation.navigate('AppliedJobs')}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: '#F3E8FF' }]}>
                                <ClipboardList size={24} color="#7C3AED" />
                            </View>
                            <Text style={styles.cardTitle}>Applied{'\n'}Jobs</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.gridRow}>
                        <TouchableOpacity
                            style={styles.cardInfo}
                            onPress={() => navigation.navigate('Jobs')} // Saved Jobs Tab
                        >
                            <View style={[styles.iconCircle, { backgroundColor: '#FFFBEB' }]}>
                                <Bookmark size={24} color="#F59E0B" />
                            </View>
                            <Text style={styles.cardTitle}>Saved{'\n'}Jobs</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cardInfo}
                            onPress={() => navigation.navigate('AIRecommendations')}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: '#EEF2FF' }]}>
                                <Sparkles size={24} color="#4F46E5" />
                            </View>
                            <Text style={styles.cardTitle}>AI Matched{'\n'}Jobs</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Job Cards */}
                {recommendedJobs.length > 0 && (
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Matched For You</Text>
                    </View>
                )}
                {recommendedJobs.length > 0 ? (
                    recommendedJobs.map((job) => (
                        <TouchableOpacity key={job.id} style={[styles.jobCard, { backgroundColor: colors.card }]} onPress={() => navigation.navigate('JobDetails', { job })}>
                            <View style={styles.jobHeader}>
                                <View style={styles.logoPlaceholder}>
                                    <ClipboardList size={24} color="#6B7280" />
                                </View>
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={[styles.jobTitle, { color: colors.text }]}>{job.title}</Text>
                                    <Text style={styles.companyName}>{job.company_name || 'Unknown Company'}</Text>
                                </View>
                                <View style={[styles.matchBadge, { backgroundColor: parseInt(job.matchScore || 0) > 80 ? '#2563EB' : '#10B981' }]}>
                                    <Text style={styles.matchText}>{job.match}</Text>
                                </View>
                            </View>

                            <View style={styles.jobDetailsRow}>
                                <View style={styles.detailItem}>
                                    <MapPin size={14} color="#6B7280" />
                                    <Text style={styles.detailText}>{job.location || 'Remote'}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailText}>{job.salary_range || 'Competitive'}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Clock size={14} color="#6B7280" />
                                    <Text style={styles.detailText}>{new Date(job.created_at).toLocaleDateString()}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>No jobs matched with your skillset.{'\n'}Try updating your profile or skills.</Text>
                    </View>
                )}

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                    <View>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recent Searches</Text>
                            <TouchableOpacity onPress={clearRecentSearches}>
                                <Text style={styles.clearText}>Clear</Text>
                            </TouchableOpacity>
                        </View>

                        {recentSearches.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.recentItem}
                                onPress={() => navigation.navigate('Search', { initialQuery: item })}
                            >
                                <View style={styles.recentIconBox}>
                                    <Search size={20} color="#6B7280" />
                                </View>
                                <View>
                                    <Text style={styles.recentTitle}>{item}</Text>
                                    <Text style={styles.recentSubtitle}>Job Search</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    headerContainer: {
        backgroundColor: '#0066FF', // Bright Blue
        paddingBottom: 24,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    headerGreeting: {
        color: '#BFDBFE', // Light blue text
        fontSize: 14,
    },
    headerName: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 4,
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 20
    },
    searchBar: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
    },
    searchPlaceholder: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    scrollContent: {
        padding: 20,
    },
    gridContainer: {
        marginBottom: 24,
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    cardInfo: {
        backgroundColor: 'white',
        width: '48%',
        padding: 16,
        borderRadius: 16,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        alignItems: 'flex-start',
    },
    iconCircle: {
        padding: 10,
        borderRadius: 25, // Circle
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        lineHeight: 20,
    },
    jobCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    jobHeader: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    logoPlaceholder: {
        width: 40,
        height: 40,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    companyName: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    matchBadge: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    matchText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    jobDetailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        fontSize: 12,
        color: '#6B7280',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    clearText: {
        color: '#2563EB',
        fontSize: 12,
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    recentIconBox: {
        width: 36,
        height: 36,
        backgroundColor: '#F3F4F6',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    recentTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    recentSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
    },
});

export default HomeScreen;

