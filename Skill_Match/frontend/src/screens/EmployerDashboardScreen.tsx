import React, { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Users, BarChart2, Briefcase, Bell } from 'lucide-react-native';
import { ManualDataService } from '../services/ManualDataService';
import { useUserStore } from '../store/userStore';

const JOB_POSTINGS = [
    // ... (keep generic items)
    {
        id: '1',
        title: 'Frontend Developer',
        daysLeft: '10 days left',
        applicants: 24,
        newApplicants: 7,
        icon: Briefcase
    },
    {
        id: '2',
        title: 'UX Designer',
        daysLeft: '5 days left',
        applicants: 45,
        newApplicants: 12,
        icon: Briefcase
    },
];

const EmployerDashboardScreen = () => {
    const navigation = useNavigation<any>();
    const userId = useUserStore((state) => state.userId);
    const [companyName, setCompanyName] = useState('Your Company');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    // Real-time Stats State
    const [stats, setStats] = useState({
        activeJobs: 0,
        totalApplicants: 0,
        newToday: 0
    });
    const [jobs, setJobs] = useState<any[]>([]);

    useFocusEffect(
        useCallback(() => {
            if (userId) {
                // Fetch Profile
                ManualDataService.getProfile(userId).then(({ data }) => {
                    if (data) {
                        if (data.company_name) setCompanyName(data.company_name);
                        if (data.avatar_url) setAvatarUrl(data.avatar_url);
                    }
                });

                // Fetch Dashboard Stats
                ManualDataService.getEmployerDashboardStats(userId).then(({ data }) => {
                    if (data) {
                        setStats(data.stats);
                        setJobs(data.jobs);
                    }
                });
            }
        }, [userId])
    );

    const renderJobItem = ({ item }: any) => (
        <View style={styles.jobCard}>
            <View style={styles.jobHeaderRow}>
                <View style={styles.jobIconContainer}>
                    <Briefcase size={24} color="#2563EB" />
                </View>
                <View style={styles.jobTitleContainer}>
                    <Text style={styles.jobTitle}>{item.title}</Text>
                    <View style={styles.applicantRow}>
                        <Users size={14} color="#6B7280" />
                        <Text style={styles.applicantText}>{item.applicants} applicants</Text>
                        {item.newApplicants > 0 && (
                            <View style={styles.newBadge}>
                                <Text style={styles.newBadgeText}>+{item.newApplicants} new</Text>
                            </View>
                        )}
                    </View>
                </View>
                <View style={[styles.daysLeftBadge, item.status !== 'active' && { backgroundColor: '#F3F4F6' }]}>
                    <Text style={[styles.daysLeftText, item.status !== 'active' && { color: '#6B7280' }]}>
                        {item.status === 'active' ? item.daysLeft : 'Closed'}
                    </Text>
                </View>
            </View>

            <View style={styles.jobActionRow}>
                <TouchableOpacity onPress={() => navigation.navigate('Applicants', { jobId: item.id })} style={styles.viewApplicantsButton}>
                    <Text style={styles.viewApplicantsText}>View Applicants</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Blue Header Section */}
            <View style={styles.headerContainer}>
                <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.welcomeLabel}>Welcome,</Text>
                            <Text style={styles.companyName}>{companyName}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <TouchableOpacity style={[styles.profileIcon, { overflow: 'hidden' }]} onPress={() => navigation.navigate('EmployerProfile')}>
                                {avatarUrl ? (
                                    <Image source={{ uri: avatarUrl }} style={{ width: '100%', height: '100%' }} />
                                ) : (
                                    <Users size={20} color="#2563EB" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.postButton}
                        onPress={() => navigation.navigate('PostJob')}
                    >
                        <Plus size={20} color="white" />
                        <Text style={styles.postButtonText}>Post New Job</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{stats.activeJobs}</Text>
                        <Text style={styles.statLabel}>Active{"\n"}Jobs</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{stats.totalApplicants}</Text>
                        <Text style={styles.statLabel}>Total{"\n"}Applicants</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{stats.newToday}</Text>
                        <Text style={styles.statLabel}>New{"\n"}Today</Text>
                    </View>
                </View>

                {/* Big Action Buttons */}
                <View style={styles.bigButtonsRow}>
                    <TouchableOpacity
                        style={styles.bigButton}
                        onPress={() => navigation.navigate('Applicants')}
                    >
                        <View style={[styles.bigButtonIcon, { backgroundColor: '#DBEAFE' }]}>
                            <Users size={28} color="#2563EB" />
                        </View>
                        <Text style={styles.bigButtonText}>Applicants</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.bigButton}
                        onPress={() => {
                            navigation.navigate('ShortlistedCandidates');
                        }}
                    >
                        <View style={[styles.bigButtonIcon, { backgroundColor: '#DCFCE7' }]}>
                            <BarChart2 size={28} color="#10B981" />
                        </View>
                        <Text style={styles.bigButtonText}>Shortlisted</Text>
                    </TouchableOpacity>
                </View>

                {/* Active Job Listings */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Active Job Listings</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Applicants', { jobId: null })}>
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.jobList}>
                    {jobs.length > 0 ? (
                        jobs.map(item => (
                            <View key={item.id}>
                                {renderJobItem({ item })}
                            </View>
                        ))
                    ) : (
                        <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 20 }}>No active jobs found.</Text>
                    )}
                </View>

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
        backgroundColor: '#0066FF',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    safeAreaHeader: {
        // Safe area handles top padding
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    welcomeLabel: {
        color: '#BFDBFE', // Light blue text
        fontSize: 14,
        marginBottom: 4,
    },
    companyName: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    postButton: {
        backgroundColor: '#10B981', // Green button
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    postButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        paddingVertical: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2563EB',
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 16,
    },
    bigButtonsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    bigButton: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        paddingVertical: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    bigButtonIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    bigButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
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
    },
    seeAllText: {
        color: '#2563EB',
        fontSize: 14,
        fontWeight: '500',
    },
    jobList: {
        gap: 16,
    },
    jobCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    jobHeaderRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    jobIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    jobTitleContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    jobTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    applicantRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    applicantText: {
        fontSize: 13,
        color: '#6B7280',
    },
    newBadge: {
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    newBadgeText: {
        fontSize: 10,
        color: '#EF4444',
        fontWeight: 'bold',
    },
    daysLeftBadge: {
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    daysLeftText: {
        fontSize: 11,
        color: '#15803D',
        fontWeight: '500',
    },
    jobActionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end', // Align actions to right or space-between? Screenshot shows explicit text buttons
        gap: 16,
        borderTopWidth: 1,
        borderTopColor: '#F9FAFB',
        paddingTop: 12,
    },
    viewApplicantsButton: {
    },
    viewApplicantsText: {
        color: '#2563EB',
        fontSize: 14,
        fontWeight: '600',
    },
    editJobButton: {
    },
    editJobText: {
        color: '#6B7280',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default EmployerDashboardScreen;
