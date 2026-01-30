
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Bell, Filter, Search, User } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ManualDataService } from '../services/ManualDataService';
import { useUserStore } from '../store/userStore';

const TABS = ['All', 'New', 'Shortlisted', 'Rejected'];

const ApplicantsScreen = ({ navigation, route }: any) => {
    const userId = useUserStore((state) => state.userId);
    const filterJobId = route.params?.jobId;

    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [applicants, setApplicants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            if (userId) {
                setLoading(true);
                ManualDataService.getApplicantsForEmployer(userId, filterJobId).then(({ data }) => {
                    if (data) {
                        // Map status for UI consistency
                        const mapped = data.map((item: any) => ({
                            ...item,
                            // Map DB status to UI status if different
                            uiStatus: item.status === 'pending' ? 'New' :
                                item.status.charAt(0).toUpperCase() + item.status.slice(1)
                        }));
                        setApplicants(mapped);
                    }
                    setLoading(false);
                });
            }
        }, [userId, filterJobId])
    );

    const handleShortlist = async (applicationId: string) => {
        // Find applicant to get details for message
        const applicant = applicants.find(a => a.id === applicationId);
        const jobTitle = applicant?.appliedFor || 'the position';

        // Optimistic update
        setApplicants(prev => prev.map(app =>
            app.id === applicationId ? { ...app, uiStatus: 'Shortlisted', status: 'shortlisted' } : app
        ));

        const { error } = await ManualDataService.updateApplicationStatus(applicationId, 'shortlisted');
        if (error) {
            console.error("Shortlist failed:", error);
        } else if (userId) {
            // Send automated message
            await ManualDataService.sendMessage(
                applicationId,
                userId,
                `Congratulations! Your application for ${jobTitle} has been shortlisted. We will be in touch shortly.`
            );
        }
    };

    const handleReject = async (applicationId: string) => {
        // Find applicant
        const applicant = applicants.find(a => a.id === applicationId);
        const jobTitle = applicant?.appliedFor || 'the position';

        // Optimistic update
        setApplicants(prev => prev.map(app =>
            app.id === applicationId ? { ...app, uiStatus: 'Rejected', status: 'rejected' } : app
        ));

        const { error } = await ManualDataService.updateApplicationStatus(applicationId, 'rejected');
        if (error) {
            console.error("Reject failed:", error);
        } else if (userId) {
            // Send automated message
            await ManualDataService.sendMessage(
                applicationId,
                userId,
                `Thank you for your interest in ${jobTitle}. Unfortunately, we have decided to move forward with other candidates at this time.`
            );
        }
    };

    const renderApplicantItem = ({ item }: any) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={[styles.avatar, { backgroundColor: item.avatarColor, overflow: 'hidden' }]}>
                    {item.avatarUrl ? (
                        <Image source={{ uri: item.avatarUrl }} style={{ width: '100%', height: '100%' }} />
                    ) : (
                        <User size={24} color="white" />
                    )}
                </View>
                <View style={styles.cardInfo}>
                    <View style={styles.nameRow}>
                        <Text style={styles.name}>{item.name}</Text>
                        <View style={[
                            styles.statusBadge,
                            item.uiStatus === 'New' && styles.statusNew,
                            item.uiStatus === 'Shortlisted' && styles.statusShortlisted,
                            item.uiStatus === 'Rejected' && styles.statusRejected,
                            item.uiStatus === 'Reviewing' && styles.statusNew,
                        ]}>
                            <Text style={[
                                styles.statusText,
                                item.uiStatus === 'New' && styles.textNew,
                                item.uiStatus === 'Shortlisted' && styles.textShortlisted,
                                item.uiStatus === 'Rejected' && styles.textRejected,
                                item.uiStatus === 'Reviewing' && styles.textNew,
                            ]}>{item.uiStatus}</Text>
                        </View>
                    </View>
                    <Text style={styles.roleTitle}>{item.title}</Text>

                    <View style={styles.matchBadge}>
                        <Text style={styles.matchText}>{item.match}</Text>
                    </View>

                    <View style={styles.detailsRow}>
                        <Text style={styles.detailText}>Applied for: {item.appliedFor}</Text>
                        <Text style={styles.dateText}>{item.date}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={styles.viewProfileButton}
                    onPress={() => navigation.navigate('CandidateProfile', {
                        applicantId: item.id,
                        seekerId: item.seekerId,
                        jobId: item.jobId
                    })}
                >
                    <Text style={styles.viewProfileText}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.messageButton}
                    onPress={() => navigation.navigate('EmployerChat', {
                        screen: 'ChatDetail',
                        params: {
                            name: item.name,
                            initials: item.name ? item.name.substring(0, 2).toUpperCase() : 'CA',
                            color: item.avatarColor,
                            applicationId: item.id
                        }
                    })}
                >
                    <Text style={styles.messageText}>Message</Text>
                </TouchableOpacity>
                {item.uiStatus !== 'Shortlisted' && item.uiStatus !== 'Rejected' && (
                    <>
                        <TouchableOpacity
                            style={styles.rejectButton}
                            onPress={() => handleReject(item.id)}
                        >
                            <Text style={styles.rejectText}>Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.shortlistButton}
                            onPress={() => handleShortlist(item.id)}
                        >
                            <Text style={styles.shortlistText}>Shortlist</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );

    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [sortBy, setSortBy] = useState<'match' | 'date'>('date');

    const handleSort = (type: 'match' | 'date') => {
        setSortBy(type);
        setFilterModalVisible(false);
    };

    const getProcessedApplicants = () => {
        let result = applicants.filter(item => {
            if (activeTab === 'All') return true;
            return item.uiStatus === activeTab;
        }).filter(item =>
            (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        if (sortBy === 'match') {
            result.sort((a, b) => {
                const scoreA = parseInt(a.match) || 0;
                const scoreB = parseInt(b.match) || 0;
                return scoreB - scoreA; // Descending
            });
        } else {
            // Default to date (assuming date string is comparable or we parse it)
            // For demo, we might not have real dates, so we'll leave as is or simple string compare
            result.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
        }
        return result;
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#111827" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {filterJobId ? 'Job Applicants' : 'All Applicants'}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Search & Filter */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Search size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
                    <TextInput
                        placeholder="Search applicants..."
                        placeholderTextColor="#9CA3AF"
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity
                    style={[styles.filterButton, sortBy === 'match' && styles.filterActive]}
                    onPress={() => setFilterModalVisible(true)}
                >
                    <Filter size={20} color={sortBy === 'match' ? "#2563EB" : "#374151"} />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                    {TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* List */}
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#2563EB" />
                </View>
            ) : (
                <FlatList
                    data={getProcessedApplicants()}
                    renderItem={renderApplicantItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={{ color: '#6B7280' }}>No applicants found.</Text>
                        </View>
                    }
                />
            )}

            {/* Filter Modal */}
            {filterModalVisible && (
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setFilterModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Sort Applicants</Text>

                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => handleSort('date')}
                        >
                            <Text style={[styles.modalOptionText, sortBy === 'date' && styles.modalOptionSelected]}>
                                Newest First
                            </Text>
                            {sortBy === 'date' && <View style={styles.checkIcon} />}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => handleSort('match')}
                        >
                            <Text style={[styles.modalOptionText, sortBy === 'match' && styles.modalOptionSelected]}>
                                Match Score (High to Low)
                            </Text>
                            {sortBy === 'match' && <View style={styles.checkIcon} />}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setFilterModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
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
        paddingVertical: 12,
        marginBottom: 8,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 20,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#111827',
    },
    filterButton: {
        width: 48,
        height: 48,
        backgroundColor: '#fff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    tabsContainer: {
        marginBottom: 16,
    },
    tabsContent: {
        paddingHorizontal: 20,
        gap: 12, // Space between tabs?
        paddingRight: 20, // Add explicit padding since we use gap
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 24, // Matches wide look in screenshot
        borderRadius: 8,
        backgroundColor: '#fff',
        marginRight: 8, // Using margin instead of gap for scrollView compatibility just in case
        minWidth: 60,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#2563EB',
    },
    tabText: {
        fontSize: 14,
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
        gap: 16,
    },
    card: {
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
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    roleTitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    statusNew: { backgroundColor: '#DBEAFE' },
    statusShortlisted: { backgroundColor: '#DCFCE7' },
    statusRejected: { backgroundColor: '#FEE2E2' },

    statusText: { fontSize: 10, fontWeight: '600' },
    textNew: { color: '#2563EB' },
    textShortlisted: { color: '#10B981' },
    textRejected: { color: '#EF4444' },

    matchBadge: {
        position: 'absolute',
        right: 0,
        top: 24, // Adjust based on layout
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    matchText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#2563EB',
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    detailText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    dateText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    viewProfileButton: {
        flex: 1,
        backgroundColor: '#EFF6FF',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    viewProfileText: {
        color: '#2563EB',
        fontWeight: '600',
        fontSize: 14,
    },
    messageButton: {
        flex: 1,
        backgroundColor: '#ECFDF5',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    messageText: {
        color: '#10B981',
        fontWeight: '600',
        fontSize: 14,
    },
    shortlistButton: {
        flex: 1,
        backgroundColor: '#EEF2FF', // Indigo 50
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    shortlistText: {
        color: '#6366F1', // Indigo 500
        fontWeight: '600',
        fontSize: 14,
    },
    rejectButton: {
        flex: 1,
        backgroundColor: '#FEF2F2', // Red 50
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    rejectText: {
        color: '#EF4444', // Red 500
        fontWeight: '600',
        fontSize: 14,
    },
    filterActive: {
        borderColor: '#2563EB',
        backgroundColor: '#EFF6FF',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1F2937',
    },
    modalOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalOptionText: {
        fontSize: 16,
        color: '#374151',
    },
    modalOptionSelected: {
        color: '#2563EB',
        fontWeight: '600',
    },
    checkIcon: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#2563EB',
    },
    closeButton: {
        marginTop: 20,
        alignItems: 'center',
        paddingVertical: 12,
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
});

export default ApplicantsScreen;
