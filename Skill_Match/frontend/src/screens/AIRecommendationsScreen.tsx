import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Bell, Building2, MapPin, Clock } from 'lucide-react-native';
import { ManualDataService } from '../services/ManualDataService';

const AIRecommendationsScreen = ({ navigation }: any) => {
    const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            const user = await ManualDataService.getUser();
            if (user) {
                const { data } = await ManualDataService.getAIRecommendations(user.id);
                setRecommendedJobs(data || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#1F2937" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>AI Recommendations</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 40 }} />
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Info Banner */}
                    <View style={styles.infoBanner}>
                        <Text style={styles.infoTitle}>How it works</Text>
                        <Text style={styles.infoText}>
                            Our AI analyzes your skills, experience, and preferences to find jobs that match your profile. The higher the match percentage, the better the job fits your qualifications.
                        </Text>
                    </View>

                    <Text style={styles.sectionTitle}>Top Matches for You</Text>

                    {/* Jobs List */}
                    <View style={styles.jobsList}>
                        {recommendedJobs.length > 0 ? (
                            recommendedJobs.map((job) => (
                                <View key={job.id} style={styles.jobCard}>
                                    <View style={styles.cardHeader}>
                                        <View style={styles.companyIcon}>
                                            <Building2 size={24} color="#6B7280" />
                                        </View>
                                        <View style={styles.headerText}>
                                            <Text style={styles.jobTitle}>{job.title}</Text>
                                            <Text style={styles.companyName}>{job.company_name || 'Unknown Company'}</Text>
                                        </View>
                                        <View style={[styles.matchBadge, { backgroundColor: parseInt(job.matchScore || 0) > 80 ? '#2563EB' : '#10B981' }]}>
                                            <Text style={styles.matchText}>{job.match} Match</Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailsRow}>
                                        <View style={styles.detailItem}>
                                            <MapPin size={14} color="#6B7280" />
                                            <Text style={styles.detailText}>{job.location || 'Remote'}</Text>
                                        </View>
                                        <View style={styles.detailItem}>
                                            <Text style={styles.salaryText}>{job.salary_range || 'Salary Competitive'}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.footerRow}>
                                        <View style={styles.detailItem}>
                                            <Clock size={14} color="#6B7280" />
                                            <Text style={styles.detailText}>{new Date(job.created_at).toLocaleDateString()}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => navigation.navigate('JobDetails', { job: job })}>
                                            <Text style={styles.viewDetailsText}>View Details</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 20 }}>
                                No high-quality matches found based on your current skills. Try adding more skills to your profile!
                            </Text>
                        )}
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
    infoBanner: {
        backgroundColor: '#EFF6FF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2563EB',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 22,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
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
    matchBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    matchText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
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
    }
});

export default AIRecommendationsScreen;
