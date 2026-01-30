import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Bell, MapPin, Clock, Building2, Bookmark, BookmarkMinus } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ManualDataService } from '../services/ManualDataService';

const SavedJobsScreen = ({ navigation }: any) => {
    const [savedJobs, setSavedJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            fetchSavedJobs();
        }, [])
    );

    const fetchSavedJobs = async () => {
        try {
            setLoading(true);
            const user = await ManualDataService.getUser();
            if (user) {
                const { data } = await ManualDataService.getSavedJobs(user.id);
                setSavedJobs(data || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnsave = async (jobId: string) => {
        try {
            const user = await ManualDataService.getUser();
            if (!user) return;

            // Optimistic Update
            setSavedJobs(prev => prev.filter(item => item.job.id !== jobId));

            const { error } = await ManualDataService.unsaveJob(jobId, user.id);
            if (error) {
                console.error("Failed to unsave:", error);
                fetchSavedJobs(); // Revert on failure
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#1F2937" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Saved Jobs</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0066FF" style={{ marginTop: 40 }} />
            ) : savedJobs.length === 0 ? (
                <View style={styles.emptyState}>
                    <View style={styles.emptyIconCircle}>
                        <Bookmark size={40} color="#9CA3AF" />
                    </View>
                    <Text style={styles.emptyTitle}>No Jobs Saved</Text>
                    <Text style={styles.emptyText}>
                        You haven't saved any jobs yet. Keep track of opportunities you like by saving them.
                    </Text>
                    <TouchableOpacity
                        style={styles.browseButton}
                        onPress={() => navigation.navigate('Map')}
                    >
                        <Text style={styles.browseButtonText}>Browse Jobs</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Text style={styles.countText}>You have <Text style={styles.countValue}>{savedJobs.length} saved jobs</Text></Text>

                    <View style={styles.jobsList}>
                        {savedJobs.map((item) => {
                            const job = item.job || {};
                            return (
                                <View key={item.id} style={styles.jobCard}>
                                    <View style={styles.cardHeader}>
                                        <View style={styles.companyIcon}>
                                            <Building2 size={24} color="#6B7280" />
                                        </View>
                                        <View style={styles.headerText}>
                                            <Text style={styles.jobTitle}>{job.title || 'Job Unavailable'}</Text>
                                            <Text style={styles.companyName}>{job.company_name || 'Unknown Company'}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => handleUnsave(job.id)}>
                                            <BookmarkMinus size={20} color="#2563EB" />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.detailsRow}>
                                        <View style={styles.detailItem}>
                                            <MapPin size={14} color="#6B7280" />
                                            <Text style={styles.detailText}>{job.location || 'N/A'}</Text>
                                        </View>
                                        <View style={styles.detailItem}>
                                            <Text style={styles.salaryText}>{job.salary_range || 'Salary N/A'}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.footerRow}>
                                        <View style={styles.detailItem}>
                                            <Clock size={14} color="#6B7280" />
                                            <Text style={styles.detailText}>Saved on {new Date(item.saved_at || item.created_at).toLocaleDateString()}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => navigation.navigate('JobDetails', { job: job })}>
                                            <Text style={styles.viewDetailsText}>View Details</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            )}
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
    countText: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
    },
    countValue: {
        color: '#1F2937',
        fontWeight: '500',
    },
    jobsList: {
        gap: 16,
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
    },
    cardHeader: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-start'
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
        justifyContent: 'space-between',
        marginTop: 4
    },
    viewDetailsText: {
        color: '#2563EB',
        fontSize: 14,
        fontWeight: '600'
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        marginTop: 60
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        backgroundColor: '#F3F4F6',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
        textAlign: 'center'
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32
    },
    browseButton: {
        backgroundColor: '#0066FF',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center'
    },
    browseButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default SavedJobsScreen;
