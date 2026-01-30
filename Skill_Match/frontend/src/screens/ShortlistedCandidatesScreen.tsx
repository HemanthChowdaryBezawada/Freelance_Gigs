import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Bell, Star, User } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useUserStore } from '../store/userStore';
import { ManualDataService } from '../services/ManualDataService';

const ShortlistedCandidatesScreen = ({ navigation }: any) => {
    const userId = useUserStore((state) => state.userId);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCandidates = useCallback(() => {
        if (userId) {
            setLoading(true);
            ManualDataService.getApplicantsForEmployer(userId).then(({ data }) => {
                if (data) {
                    // Filter for shortlisted only
                    const shortlisted = data.filter((item: any) =>
                        item.status.toLowerCase() === 'shortlisted'
                    );
                    setCandidates(shortlisted);
                }
                setLoading(false);
            });
        }
    }, [userId]);

    useFocusEffect(
        useCallback(() => {
            fetchCandidates();
        }, [fetchCandidates])
    );

    const handleReject = async (applicationId: string) => {
        // Find candidate for message
        const candidate = candidates.find(c => c.id === applicationId);
        const jobTitle = candidate?.appliedFor || 'the position';

        // Optimistic update: Remove from list
        setCandidates(prev => prev.filter(c => c.id !== applicationId));

        const { error } = await ManualDataService.updateApplicationStatus(applicationId, 'rejected');
        if (error) {
            console.error("Reject failed:", error);
            fetchCandidates(); // Revert
        } else if (userId) {
            // Send automated message
            await ManualDataService.sendMessage(
                applicationId,
                userId,
                `Thank you for your interest in ${jobTitle}. Unfortunately, we have decided to move forward with other candidates at this time.`
            );
        }
    };

    const toggleShortlist = async (candidate: any) => {
        // Logic to remove from shortlist if needed, but 'Reject' is clearer for "removing"
        handleReject(candidate.id);
    }

    const renderCandidate = ({ item }: any) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={[styles.avatar, { backgroundColor: item.avatarColor, overflow: 'hidden' }]}>
                    {item.avatarUrl ? (
                        <Image source={{ uri: item.avatarUrl }} style={{ width: '100%', height: '100%' }} />
                    ) : (
                        <User size={28} color="white" />
                    )}
                </View>
                <View style={styles.headerInfo}>
                    <View style={styles.nameRow}>
                        <Text style={styles.name}>{item.name}</Text>
                        <View style={styles.matchBadge}>
                            <Text style={styles.matchText}>{item.match}</Text>
                        </View>
                    </View>
                    <Text style={styles.role}>{item.title}</Text>

                    <View style={styles.skillsRow}>
                        {item.skills && item.skills.length > 0 ? (
                            item.skills.map((skill: string, index: number) => (
                                <View key={index} style={styles.skillTag}>
                                    <Text style={styles.skillText}>{skill}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={{ fontSize: 12, color: '#9CA3AF' }}>No skills listed</Text>
                        )}
                    </View>

                    <View style={styles.metaRow}>
                        <Text style={styles.metaText}>Applied for: {item.appliedFor}</Text>
                        <Text style={styles.metaText}>{item.date}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate('CandidateProfile', {
                        applicantId: item.id,
                        seekerId: item.seekerId,
                        jobId: item.jobId
                    })}
                >
                    <Text style={styles.profileButtonText}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleReject(item.id)}
                >
                    <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.scheduleButton}
                    onPress={() => navigation.navigate('ScheduleInterview', {
                        candidateName: item.name,
                        candidateId: item.id
                    })}
                >
                    <Text style={styles.scheduleButtonText}>Schedule</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#111827" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Shortlisted Candidates</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#2563EB" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Banner */}
                    <View style={styles.banner}>
                        <View style={styles.bannerIcon}>
                            <Star size={20} color="#10B981" fill="#10B981" />
                        </View>
                        <View style={styles.bannerContent}>
                            <Text style={styles.bannerTitle}>{candidates.length} Top Candidates</Text>
                            <Text style={styles.bannerSubtitle}>These candidates have been shortlisted for further review</Text>
                        </View>
                    </View>

                    {/* List */}
                    <View style={styles.list}>
                        {candidates.length > 0 ? (
                            candidates.map(item => (
                                <View key={item.id}>
                                    {renderCandidate({ item })}
                                </View>
                            ))
                        ) : (
                            <View style={{ padding: 20, alignItems: 'center' }}>
                                <Text style={{ color: '#6B7280' }}>No shortlisted candidates yet.</Text>
                            </View>
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
        paddingVertical: 12,
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
    banner: {
        backgroundColor: '#ECFDF5',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        marginBottom: 24,
        gap: 12,
    },
    bannerIcon: {
        marginTop: 2,
    },
    bannerContent: {
        flex: 1,
    },
    bannerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#064E3B',
        marginBottom: 4,
    },
    bannerSubtitle: {
        fontSize: 12,
        color: '#065F46',
        lineHeight: 18,
    },
    list: {
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
        marginBottom: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    headerInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    matchBadge: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    matchText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2563EB',
    },
    role: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    skillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    skillTag: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    skillText: {
        fontSize: 11,
        color: '#4B5563',
        fontWeight: '500',
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    profileButton: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 12, // Taller button
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    profileButtonText: {
        color: '#2563EB',
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'center',
    },
    scheduleButton: {
        flex: 1.2,
        backgroundColor: '#0066FF',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scheduleButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'center',
    },
    rejectButton: {
        flex: 1,
        backgroundColor: '#FEF2F2',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    rejectButtonText: {
        color: '#EF4444',
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'center',
    },
});

export default ShortlistedCandidatesScreen;
