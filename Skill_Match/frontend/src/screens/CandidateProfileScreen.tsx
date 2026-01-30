import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Mail, Phone, MapPin, User, FileText, Star } from 'lucide-react-native';
import { ManualDataService } from '../services/ManualDataService';

const CandidateProfileScreen = ({ navigation, route }: any) => {
    const { seekerId, applicantId, jobId } = route.params || {};
    const [candidate, setCandidate] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (!seekerId) {
            setLoading(false);
            return;
        }
        ManualDataService.getProfile(seekerId).then(({ data }) => {
            if (data) {
                setCandidate({
                    name: data.full_name || 'Candidate Name',
                    title: data.headline || 'Job Seeker',
                    location: data.location || 'Location Not Listed',
                    email: data.email || 'Email not provided',
                    phone: data.phone || 'Phone not provided',
                    match: 'Match Analysis', // We could fetch match score from applicant table if needed
                    summary: data.bio || 'No summary provided.',
                    skills: data.skills || [],
                    experience: data.experience || [],
                    education: data.education || [],
                    resume: data.resume_url ? { name: 'Resume.pdf', url: data.resume_url } : null
                });
            }
            setLoading(false);
        });
    }, [seekerId]);

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#2563EB" />
            </SafeAreaView>
        );
    }

    if (!candidate) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()} style={styles.backButton}>
                        <ChevronLeft color="#111827" size={24} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Candidate not found.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#111827" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Candidate Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Profile Header Card */}
                <View style={styles.card}>
                    <View style={styles.profileHeaderTop}>
                        <View style={styles.avatar}>
                            <User size={40} color="white" />
                        </View>
                        <View style={styles.headerInfo}>
                            <Text style={styles.name}>{candidate.name}</Text>
                            <Text style={styles.title}>{candidate.title}</Text>
                            <View style={styles.locationRow}>
                                <MapPin size={14} color="#6B7280" />
                                <Text style={styles.locationText}>{candidate.location}</Text>
                            </View>
                        </View>
                        <View style={styles.matchBadge}>
                            <Star size={12} color="#2563EB" fill="#2563EB" />
                            <Text style={styles.matchText}>{candidate.match}</Text>
                        </View>
                    </View>

                    <View style={styles.contactInfo}>
                        <View style={styles.contactItem}>
                            <Mail size={16} color="#6B7280" />
                            <Text style={styles.contactText}>{candidate.email}</Text>
                        </View>
                        <View style={styles.contactItem}>
                            <Phone size={16} color="#6B7280" />
                            <Text style={styles.contactText}>{candidate.phone}</Text>
                        </View>
                    </View>
                </View>

                {/* Professional Summary */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Professional Summary</Text>
                    <Text style={styles.bodyText}>{candidate.summary}</Text>
                </View>

                {/* Skills */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Skills</Text>
                    <View style={styles.skillsContainer}>
                        {candidate.skills.length > 0 ? (
                            candidate.skills.map((skill: string, index: number) => (
                                <View key={index} style={styles.skillTag}>
                                    <Text style={styles.skillText}>{skill}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={{ color: '#9CA3AF', fontStyle: 'italic' }}>No skills listed.</Text>
                        )}
                    </View>
                </View>

                {/* Experience */}
                {candidate.experience && candidate.experience.length > 0 && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Experience</Text>
                        <View style={styles.timelineList}>
                            {candidate.experience.map((item: any, index: number) => (
                                <View key={index} style={styles.timelineItem}>
                                    <Text style={styles.roleText}>{item.role || item.title}</Text>
                                    <Text style={styles.companyText}>{item.company}</Text>
                                    <Text style={styles.periodText}>{item.period || item.date}</Text>
                                    <Text style={styles.descriptionText}>{item.description}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Education */}
                {candidate.education && candidate.education.length > 0 && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Education</Text>
                        <View style={styles.timelineList}>
                            {candidate.education.map((item: any, index: number) => (
                                <View key={index} style={styles.timelineItem}>
                                    <Text style={styles.roleText}>{item.degree}</Text>
                                    <Text style={styles.companyText}>{item.school}</Text>
                                    <Text style={styles.periodText}>{item.year}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Resume Download */}
                {candidate.resume && (
                    <View style={styles.card}>
                        <View style={styles.resumeRow}>
                            <View style={styles.resumeIcon}>
                                <FileText size={24} color="#6B7280" />
                            </View>
                            <View style={styles.resumeInfo}>
                                <Text style={styles.resumeName}>Resume</Text>
                                <Text style={styles.resumeSize}>PDF/Doc</Text>
                            </View>
                            <TouchableOpacity onPress={() => Linking.openURL(candidate.resume.url)}>
                                <Text style={styles.downloadText}>View</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => navigation.navigate('ScheduleInterview', {
                            applicantId,
                            seekerId,
                            name: candidate.name,
                            role: candidate.title
                        })}
                    >
                        <Text style={styles.primaryButtonText}>Schedule Interview</Text>
                    </TouchableOpacity>
                    <View style={styles.secondaryButtonsRow}>
                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => navigation.navigate('ChatDetail', {
                                applicationId: applicantId,
                                name: candidate.name,
                                initials: candidate.name.substring(0, 2).toUpperCase(),
                                color: '#10B981'
                            })}
                        >
                            <Text style={styles.secondaryButtonText}>Message</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButton}>
                            <Text style={styles.secondaryButtonText}>Shortlist</Text>
                        </TouchableOpacity>
                    </View>
                </View>

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
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    profileHeaderTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    headerInfo: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        color: '#4B5563',
        marginBottom: 8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        fontSize: 14,
        color: '#6B7280',
    },
    matchBadge: {
        backgroundColor: '#DBEAFE', // Light blue
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    matchText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#2563EB',
    },
    contactInfo: {
        gap: 12,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    contactText: {
        fontSize: 14,
        color: '#2563EB', // Link color
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
    },
    bodyText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 22,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillTag: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    skillText: {
        fontSize: 12,
        color: '#2563EB',
        fontWeight: '500',
    },
    timelineList: {
        gap: 20,
    },
    timelineItem: {

    },
    roleText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    companyText: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 2,
    },
    periodText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },
    resumeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resumeIcon: {
        width: 48,
        height: 48,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    resumeInfo: {
        flex: 1,
    },
    resumeName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    resumeSize: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    downloadText: {
        fontSize: 14,
        color: '#2563EB',
        fontWeight: '600',
    },
    footer: {
        marginTop: 8,
        gap: 12,
    },
    primaryButton: {
        backgroundColor: '#0066FF',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButtonsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    secondaryButtonText: {
        color: '#0066FF', // Or standard text color
        fontSize: 14,
        fontWeight: '600',
    },
});

export default CandidateProfileScreen;
