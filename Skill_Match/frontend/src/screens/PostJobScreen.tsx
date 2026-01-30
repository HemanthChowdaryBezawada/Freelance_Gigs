
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MapPin, Briefcase } from 'lucide-react-native';
import { ManualDataService } from '../services/ManualDataService';
import { useUserStore } from '../store/userStore';

const PostJobScreen = ({ navigation }: any) => {
    const userId = useUserStore((state) => state.userId);
    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [salaryRange, setSalaryRange] = useState('');
    const [jobType, setJobType] = useState('Full-time');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');
    const [skills, setSkills] = useState('');
    const [benefits, setBenefits] = useState('');

    useEffect(() => {
        if (userId) {
            ManualDataService.getProfile(userId).then(({ data }) => {
                if (data && data.company_name) {
                    setCompany(data.company_name);
                }
            });
        }
    }, [userId]);

    const handlePost = () => {
        // Mock post
        console.log("Posting Job:", { jobTitle, location, salaryRange, jobType });
        navigation.goBack();
    };

    const handleContinue = () => {
        if (!jobTitle.trim() || !location.trim() || !description.trim() || !requirements.trim()) {
            Alert.alert("Missing Details", "Please fill in all required fields (marked with *).");
            return;
        }

        const jobData = {
            title: jobTitle,
            company,
            location,
            salary: salaryRange,
            type: jobType,
            description,
            requirements: requirements.split('\n').flatMap(s => s.split(',')).map(s => s.trim()).filter(Boolean),
            skills: skills.split(',').map(s => s.trim()).filter(Boolean),
            benefits: benefits.split(',').map(s => s.trim()).filter(Boolean)
        };
        navigation.navigate('ScheduleHours', { jobData });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#000" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Post a Job</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Job Title <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Senior Product Designer"
                                value={jobTitle}
                                onChangeText={setJobTitle}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Location <Text style={styles.required}>*</Text></Text>
                            <View style={styles.inputIconWrapper}>
                                <MapPin size={20} color="#9CA3AF" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { paddingLeft: 44 }]}
                                    placeholder="e.g. San Francisco, CA (or Remote)"
                                    value={location}
                                    onChangeText={setLocation}
                                />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Salary Range</Text>
                                <View style={styles.inputIconWrapper}>
                                    <Text style={[styles.inputIcon, { fontSize: 18, color: '#9CA3AF', top: 12 }]}>₹</Text>
                                    <TextInput
                                        style={[styles.input, { paddingLeft: 44 }]}
                                        placeholder="e.g. 5L-12L"
                                        value={salaryRange}
                                        onChangeText={setSalaryRange}
                                    />
                                </View>
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Job Type</Text>
                                <View style={styles.inputIconWrapper}>
                                    <Briefcase size={20} color="#9CA3AF" style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.input, { paddingLeft: 44 }]}
                                        placeholder="Full-time"
                                        value={jobType}
                                        onChangeText={setJobType}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Description <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Describe the role, responsibilities, and requirements..."
                                value={description}
                                onChangeText={setDescription}
                                multiline={true}
                                numberOfLines={8}
                                textAlignVertical="top"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Requirements <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="• Experience with React Native&#10;• Understanding of Redux"
                                value={requirements}
                                onChangeText={setRequirements}
                                multiline={true}
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                            <Text style={styles.helperText}>Separate items with new lines or commas</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Required Skills (comma separated)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="React, TypeScript, Node.js"
                                value={skills}
                                onChangeText={setSkills}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Benefits (comma separated)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Health Insurance, Remote Work, 401k"
                                value={benefits}
                                onChangeText={setBenefits}
                            />
                        </View>
                    </View>

                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.postButton}
                        onPress={handleContinue}
                    >
                        <Text style={styles.postButtonText}>Continue to Schedule</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
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
    formContainer: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    required: {
        color: '#EF4444',
    },
    helperText: {
        fontSize: 12,
        color: '#6B7280',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1F2937',
        height: 50,
    },
    inputIconWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    inputIcon: {
        position: 'absolute',
        left: 12,
        zIndex: 1,
    },
    textArea: {
        minHeight: 120,
        height: 'auto',
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    postButton: {
        backgroundColor: '#0066FF',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PostJobScreen;
