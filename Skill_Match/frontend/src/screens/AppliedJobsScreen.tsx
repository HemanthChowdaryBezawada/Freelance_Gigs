import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Bell, Briefcase, MapPin, Calendar, Clock, ClipboardList } from 'lucide-react-native';
import { ManualDataService } from '../services/ManualDataService';
import { useFocusEffect } from '@react-navigation/native';

const AppliedJobsScreen = ({ navigation }: any) => {
    const [activeTab, setActiveTab] = useState('All');
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const tabs = ['All', 'Interviews', 'Pending', 'Accepted', 'Rejected'];

    useFocusEffect(
        React.useCallback(() => {
            fetchAppliedJobs();
        }, [])
    );

    const fetchAppliedJobs = async () => {
        try {
            setLoading(true);
            const user = await ManualDataService.getUser();
            if (user) {
                const { data } = await ManualDataService.getAppliedJobs(user.id);
                setApplications(data || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredApplications = () => {
        let filtered = applications;
        if (activeTab === 'Interviews') filtered = applications.filter(app => app.status === 'interview');
        if (activeTab === 'Pending') filtered = applications.filter(app => app.status === 'pending');
        if (activeTab === 'Accepted') filtered = applications.filter(app => app.status === 'accepted');
        if (activeTab === 'Rejected') filtered = applications.filter(app => app.status === 'rejected');
        return filtered;
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending': return { bg: '#FEF08A', text: '#854D0E' };
            case 'accepted': return { bg: '#BBF7D0', text: '#166534' };
            case 'interview': return { bg: '#DBEAFE', text: '#1E40AF' }; // Blue for Interview
            case 'rejected': return { bg: '#FECACA', text: '#991B1B' };
            default: return { bg: '#E5E7EB', text: '#374151' };
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const job = item.job || {}; // Handle if join failed or simple fields
        const statusColors = getStatusColor(item.status);

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                        <Briefcase size={24} color="#6B7280" />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.jobTitle}>{job.title || 'Job Unavailable'}</Text>
                        <Text style={styles.companyName}>{job.company_name || 'Unknown Company'}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                        <Text style={[styles.statusText, { color: statusColors.text }]}>
                            {item.status === 'interview' ? 'Interview Scheduled' :
                                (item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Unknown')}
                        </Text>
                    </View>
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <MapPin size={16} color="#6B7280" />
                        <Text style={styles.detailText}>{job.location || 'Location N/A'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Calendar size={16} color="#6B7280" />
                        <Text style={styles.detailText}>
                            Applied on {new Date(item.applied_at || item.created_at).toLocaleDateString()}
                        </Text>
                    </View>
                </View>

                {item.status === 'interview' && (
                    <View style={styles.statusDetailsBox}>
                        <Text style={[styles.statusDetailText, { color: '#1E40AF' }]}>
                            Check your messages for interview details!
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.viewDetailsButton}
                    onPress={() => navigation.navigate('JobDetails', { job: job })}
                >
                    <Text style={styles.viewDetailsText}>View Job Details</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#1F2937" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Applied Jobs</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content */}
            {loading ? (
                <ActivityIndicator size="large" color="#0066FF" style={{ marginTop: 40 }} />
            ) : getFilteredApplications().length === 0 ? (
                <View style={styles.emptyState}>
                    <View style={styles.emptyIconCircle}>
                        <ClipboardList size={40} color="#9CA3AF" />
                    </View>
                    <Text style={styles.emptyTitle}>No Jobs Applied Yet</Text>
                    <Text style={styles.emptyText}>
                        You haven't applied to any jobs yet. Browse "Nearby Jobs" to find and apply for your first role!
                    </Text>
                    <TouchableOpacity
                        style={styles.browseButton}
                        onPress={() => navigation.navigate('Map')}
                    >
                        <Text style={styles.browseButtonText}>Browse Jobs</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={getFilteredApplications()}
                    renderItem={renderItem}
                    keyExtractor={item => item.id?.toString() || Math.random().toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
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
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#2563EB',
    },
    tabText: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    activeTabText: {
        color: 'white',
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
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
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    detailsContainer: {
        marginBottom: 16,
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 13,
        color: '#6B7280',
    },
    statusDetailsBox: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    statusDetailText: {
        fontSize: 13,
        fontWeight: '500',
    },
    viewDetailsButton: {
        alignItems: 'center',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        marginTop: 8
    },
    viewDetailsText: {
        color: '#2563EB',
        fontSize: 14,
        fontWeight: '600',
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

export default AppliedJobsScreen;
