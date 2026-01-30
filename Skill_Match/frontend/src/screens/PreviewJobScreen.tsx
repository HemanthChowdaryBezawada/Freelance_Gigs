
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MapPin, DollarSign, Clock, Edit2, Briefcase } from 'lucide-react-native';

import { ManualDataService } from '../services/ManualDataService';
import { useUserStore } from '../store/userStore';
import { Alert, ActivityIndicator } from 'react-native';

const PreviewJobScreen = ({ navigation, route }: any) => {
    const userId = useUserStore((state) => state.userId);
    const [publishing, setPublishing] = React.useState(false);

    const jobData = route.params?.jobData || {
        // Fallback for previewing without data (dev only)
        title: 'Job Title',
        company: 'Company',
        location: 'Location',
        salary: 'Salary',
        type: 'Type',
        description: 'Description...',
        requirements: [],
        skills: [],
        benefits: []
    };

    const handlePublish = async () => {
        if (!userId) {
            Alert.alert("Error", "You must be logged in to post a job.");
            return;
        }

        setPublishing(true);
        const { error } = await ManualDataService.createJob(userId, jobData);
        setPublishing(false);

        if (error) {
            Alert.alert("Error", "Failed to publish job. Please try again.");
            console.error(error);
        } else {
            Alert.alert("Success", "Job published successfully!", [
                { text: "OK", onPress: () => navigation.navigate('EmployerMain') }
            ]);
        }
    };

    const handleEdit = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#111827" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Preview Job Post</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Info Note */}
                <View style={styles.infoNote}>
                    <Text style={styles.infoNoteText}>
                        Review your job posting before publishing. You can edit any section by clicking the edit button.
                    </Text>
                </View>

                <View style={styles.card}>
                    {/* Header Info */}
                    <View style={styles.jobHeader}>
                        <View style={styles.iconContainer}>
                            <Briefcase size={32} color="white" />
                        </View>
                        <View style={styles.jobHeaderText}>
                            <Text style={styles.jobTitle}>{jobData.title}</Text>
                            <Text style={styles.companyName}>{jobData.company}</Text>
                        </View>
                        <TouchableOpacity onPress={handleEdit} style={styles.editIcon}>
                            <Edit2 size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Meta Info */}
                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <MapPin size={16} color="#6B7280" />
                            <Text style={styles.metaText}>{jobData.location}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <DollarSign size={16} color="#6B7280" />
                            <Text style={styles.metaText}>{jobData.salary}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Clock size={16} color="#6B7280" />
                            <Text style={styles.metaText}>{jobData.type}</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.bodyText}>{jobData.description}</Text>
                    </View>

                    {/* Requirements */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Requirements</Text>
                        {jobData.requirements.map((req: string, index: number) => (
                            <View key={index} style={styles.bulletRow}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bodyText}>{req}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Required Skills */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Required Skills</Text>
                        <View style={styles.tagContainer}>
                            {jobData.skills.map((skill: string, index: number) => (
                                <View key={index} style={styles.skillTag}>
                                    <Text style={styles.skillText}>{skill}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Benefits */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Benefits</Text>
                        <View style={styles.tagContainer}>
                            {jobData.benefits.map((benefit: string, index: number) => (
                                <View key={index} style={styles.benefitTag}>
                                    <Text style={styles.benefitText}>{benefit}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                </View>

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.publishButton} onPress={handlePublish} disabled={publishing}>
                    {publishing ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.publishButtonText}>Publish Job Post</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButtonFooter} onPress={handleEdit}>
                    <Text style={styles.editButtonText}>Edit Job Post</Text>
                </TouchableOpacity>
            </View>

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
        padding: 24,
        paddingBottom: 40,
    },
    infoNote: {
        backgroundColor: '#EFF6FF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    infoNoteText: {
        fontSize: 14,
        color: '#1F2937',
        lineHeight: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
    },
    jobHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconContainer: {
        width: 56,
        height: 56,
        backgroundColor: '#0066FF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    jobHeaderText: {
        flex: 1,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    companyName: {
        fontSize: 14,
        color: '#6B7280',
    },
    editIcon: {
        padding: 8,
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 24,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 14,
        color: '#4B5563',
    },
    section: {
        marginBottom: 24,
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
    bulletRow: {
        flexDirection: 'row',
        marginBottom: 8,
        gap: 8,
    },
    bullet: {
        fontSize: 14,
        color: '#4B5563',
        marginTop: -3,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillTag: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    skillText: {
        fontSize: 13,
        color: '#4B5563',
        fontWeight: '500',
    },
    benefitTag: {
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    benefitText: {
        fontSize: 13,
        color: '#10B981',
        fontWeight: '500',
    },
    footer: {
        padding: 24,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        gap: 12,
    },
    publishButton: {
        backgroundColor: '#0066FF',
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    publishButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    editButtonFooter: {
        backgroundColor: '#fff',
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    editButtonText: {
        color: '#0066FF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PreviewJobScreen;
