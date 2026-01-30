
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Bell, Building2, MapPin, Clock } from 'lucide-react-native';
import { ManualDataService } from '../services/ManualDataService';

const RecentlyViewedScreen = ({ navigation }: any) => {
    const [recentJobs, setRecentJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setLoading(true);
            const user = await ManualDataService.getUser();
            if (!user) return;

            const { data } = await ManualDataService.getRecentlyViewedJobs(user.id);
            setRecentJobs(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearAll = () => {
        // Optional: Implement clear history logic
        console.log("Clear All Clicked");
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#1F2937" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Recently Viewed</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <Text style={styles.statsText}>{recentJobs.length} jobs viewed recently</Text>
                    {/* <TouchableOpacity onPress={handleClearAll}>
                        <Text style={styles.clearLink}>Clear All</Text>
                    </TouchableOpacity> */}
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#2563EB" />
                ) : (
                    <View style={styles.jobsList}>
                        {recentJobs.length === 0 ? (
                            <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 20 }}>No recently viewed jobs.</Text>
                        ) : (
                            recentJobs.map((job, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => navigation.navigate('HomeTab', { screen: 'JobDetails', params: { job } })}
                                >
                                    <View>
                                        <Text style={styles.groupTitle}>Viewed {formatDate(job.viewedAt)}</Text>

                                        {/* Job Card */}
                                        <View style={styles.jobCard}>
                                            <View style={styles.cardHeader}>
                                                <View style={styles.companyIcon}>
                                                    <Building2 size={24} color="#6B7280" />
                                                </View>
                                                <View style={styles.headerText}>
                                                    <Text style={styles.jobTitle}>{job.title}</Text>
                                                    <Text style={styles.companyName}>{job.company_name || job.company}</Text>
                                                </View>
                                            </View>

                                            <View style={styles.detailsRow}>
                                                <View style={styles.detailItem}>
                                                    <MapPin size={14} color="#6B7280" />
                                                    <Text style={styles.detailText}>{job.location}</Text>
                                                </View>
                                                <View style={styles.detailItem}>
                                                    <Text style={styles.salaryText}>
                                                        {job.salary_min ? `$${job.salary_min / 1000}k - $${job.salary_max / 1000}k` : job.salary}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={styles.footerRow}>
                                                <View style={styles.detailItem}>
                                                    <Clock size={14} color="#6B7280" />
                                                    <Text style={styles.detailText}>{job.job_type}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                )}

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
        backgroundColor: '#F9FAFB',
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
        padding: 20,
        paddingBottom: 40,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    statsText: {
        fontSize: 14,
        color: '#6B7280',
    },
    clearLink: {
        fontSize: 14,
        color: '#2563EB',
        fontWeight: '600',
    },
    jobsList: {
        gap: 16,
    },
    groupTitle: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 8,
    },
    groupTime: {
        color: '#4B5563',
        fontWeight: '500',
    },
    jobCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-start',
    },
    companyIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerText: {
        flex: 1,
        justifyContent: 'center',
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    companyName: {
        fontSize: 14,
        color: '#6B7280',
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 13,
        color: '#6B7280',
    },
    salaryText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default RecentlyViewedScreen;
