
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Bell, Bookmark, MapPin, IndianRupee, Clock, Share2, Building2 } from 'lucide-react-native';
import { ManualDataService } from '../services/ManualDataService';
import { useUserStore } from '../store/userStore';

const JobDetailsScreen = ({ route, navigation }: any) => {
    const userId = useUserStore((state) => state.userId);
    const [isApplying, setIsApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    const job = route.params?.job || {
        title: 'UX Designer',
        company: 'Tech Solutions Inc.',
        location: 'New York, NY',
        salary: '₹8L - ₹12L',
        posted: '2 days ago',
        match: '95 % Match',
        id: 'mock-id' // Safety fallback
    };

    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            if (job.id && userId) {
                const [applied, saved] = await Promise.all([
                    ManualDataService.hasApplied(job.id, userId),
                    ManualDataService.isJobSaved(job.id, userId)
                ]);
                setHasApplied(applied);
                setIsSaved(saved);
            }
        };
        checkStatus();
    }, [job.id, userId]);

    const handleApply = async () => {
        if (!userId) {
            Alert.alert("Login Required", "Please login to apply for jobs.");
            return;
        }
        if (!job.id) {
            Alert.alert("Error", "Invalid job details.");
            return;
        }

        setIsApplying(true);
        const { data, error } = await ManualDataService.applyForJob(job.id, userId);
        setIsApplying(false);

        if (error) {
            Alert.alert("Application Failed", typeof error === 'string' ? error : "Could not submit application.");
        } else {
            // Success
            navigation.navigate('ApplicationSubmitted', { job });
        }
    };

    const handleToggleSave = async () => {
        if (!userId) {
            Alert.alert("Login Required", "Please login to save jobs.");
            return;
        }
        if (!job.id) return;

        // Optimistic Update
        const previousState = isSaved;
        setIsSaved(!isSaved);

        let result;
        if (previousState) {
            result = await ManualDataService.unsaveJob(job.id, userId);
        } else {
            result = await ManualDataService.saveJob(job.id, userId);
        }

        if (result.error) {
            setIsSaved(previousState); // Revert
            console.error("Toggle Save Error:", result.error);
            const errorMessage = typeof result.error === 'object' && result.error.message ? result.error.message : JSON.stringify(result.error);
            Alert.alert("Error", `Failed to update saved status: ${errorMessage}`);
        }
    };

    useEffect(() => {
        const recordView = async () => {
            if (job.id) {
                const user = await ManualDataService.getUser();
                if (user) {
                    await ManualDataService.recordJobView(job.id, user.id);
                }
            }
        };
        recordView();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#1F2937" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Job Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Main Card */}
                <View style={styles.mainCard}>
                    {/* Job Header Info */}
                    <View style={styles.jobHeader}>
                        <View style={styles.logoContainer}>
                            <Building2 size={32} color="#6B7280" />
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.jobTitle}>{job.title}</Text>
                            <Text style={styles.companyName}>{job.company}</Text>
                            <View style={styles.matchBadge}>
                                <Text style={styles.matchText}>{job.match || '95% Match'}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.bookmarkButton} onPress={handleToggleSave}>
                            <Bookmark size={24} color={isSaved ? "#2563EB" : "#6B7280"} fill={isSaved ? "#2563EB" : "none"} />
                        </TouchableOpacity>
                    </View>

                    {/* Meta Info */}
                    <View style={styles.metaInfo}>
                        <View style={styles.metaItem}>
                            <MapPin size={16} color="#6B7280" />
                            <Text style={styles.metaText}>{job.location}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <IndianRupee size={16} color="#6B7280" />
                            <Text style={styles.metaText}>{job.salary_range || job.salary || 'Not disclosed'}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Clock size={16} color="#6B7280" />
                            <Text style={styles.metaText}>Posted {job.posted}</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.descriptionText}>
                            We are looking for a talented UX Designer to create amazing user experiences. The ideal candidate should have a keen eye for design, understanding of user-centered design principles, and a portfolio of work demonstrating their skills.
                        </Text>
                    </View>

                    {/* Requirements */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Requirements</Text>
                        <View style={styles.bulletList}>
                            <View style={styles.bulletItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.bulletText}>3+ years of experience in UX/UI design</Text>
                            </View>
                            <View style={styles.bulletItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.bulletText}>Proficient with design tools such as Figma, Sketch, and Adobe XD</Text>
                            </View>
                            <View style={styles.bulletItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.bulletText}>Portfolio demonstrating strong visual design and UX skills</Text>
                            </View>
                            <View style={styles.bulletItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.bulletText}>Experience conducting user research and usability testing</Text>
                            </View>
                            <View style={styles.bulletItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.bulletText}>Excellent communication and collaboration skills</Text>
                            </View>
                        </View>
                    </View>

                    {/* Skills */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        <View style={styles.skillsContainer}>
                            {['UI Design', 'UX Research', 'Wireframing', 'Prototyping', 'User Testing'].map((skill, index) => (
                                <View key={index} style={styles.skillChip}>
                                    <Text style={styles.skillText}>{skill}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Benefits */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Benefits</Text>
                        <View style={styles.bulletList}>
                            <View style={styles.bulletItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.bulletText}>Competitive salary and benefits package</Text>
                            </View>
                            <View style={styles.bulletItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.bulletText}>Flexible work hours and remote options</Text>
                            </View>
                            <View style={styles.bulletItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.bulletText}>Professional development opportunities</Text>
                            </View>
                            <View style={styles.bulletItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.bulletText}>Collaborative and innovative work environment</Text>
                            </View>
                            <View style={styles.bulletItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.bulletText}>Health and wellness programs</Text>
                            </View>
                        </View>
                    </View>

                    {/* Footer Links */}
                    <View style={styles.cardFooter}>
                        <TouchableOpacity style={styles.footerLink}>
                            <Share2 size={18} color="#6B7280" />
                            <Text style={styles.footerLinkText}>Share</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            if (job.employer_id) {
                                navigation.navigate('CompanyProfile', { employerId: job.employer_id });
                            } else {
                                Alert.alert("Profile Unavailable", "This job listing is missing employer details.");
                            }
                        }}>
                            <Text style={styles.companyProfileLink}>View Company Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>


            <View style={styles.bottomAction}>
                <TouchableOpacity
                    style={[styles.applyButton, (isApplying || hasApplied) && { opacity: 0.7, backgroundColor: hasApplied ? '#10B981' : '#0066FF' }]}
                    onPress={handleApply}
                    disabled={isApplying || hasApplied}
                >
                    {isApplying ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.applyButtonText}>{hasApplied ? 'Applied' : 'Apply Now'}</Text>
                    )}
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
        paddingBottom: 100,
    },
    mainCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    jobHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    logoContainer: {
        width: 64,
        height: 64,
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    titleContainer: {
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
        marginBottom: 8,
    },
    matchBadge: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    matchText: {
        color: '#2563EB',
        fontSize: 12,
        fontWeight: '600',
    },
    bookmarkButton: {
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        padding: 8,
    },
    metaInfo: {
        marginBottom: 24,
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    metaText: {
        fontSize: 14,
        color: '#6B7280',
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
    descriptionText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 22,
    },
    bulletList: {
        gap: 12,
    },
    bulletItem: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },
    bulletPoint: {
        fontSize: 14,
        color: '#4B5563',
        marginTop: -2,
    },
    bulletText: {
        flex: 1,
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillChip: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    skillText: {
        fontSize: 12,
        color: '#4B5563',
        fontWeight: '500',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    footerLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    footerLinkText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    companyProfileLink: {
        fontSize: 14,
        color: '#2563EB',
        fontWeight: '600',
    },
    bottomAction: {
        padding: 20,
        backgroundColor: '#F9FAFB',
    },
    applyButton: {
        backgroundColor: '#0066FF',
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0066FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    applyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default JobDetailsScreen;
