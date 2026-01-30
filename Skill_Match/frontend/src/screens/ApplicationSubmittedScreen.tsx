
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, CheckCircle } from 'lucide-react-native';

const ApplicationSubmittedScreen = ({ route, navigation }: any) => {
    const job = route.params?.job || {
        title: 'UX Designer',
        company: 'Tech Solutions Inc.'
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>

                {/* Success Icon */}
                <View style={styles.iconContainer}>
                    <View style={styles.successCircle}>
                        <Check size={40} color="white" strokeWidth={3} />
                    </View>
                </View>

                {/* Success Title */}
                <Text style={styles.title}>Application Submitted!</Text>

                {/* Subtitle Message */}
                <Text style={styles.subtitle}>
                    Your application for <Text style={styles.boldText}>{job.title}</Text> at <Text style={styles.boldText}>{job.company}</Text> has been successfully submitted.
                </Text>

                {/* Next Steps Card */}
                <View style={styles.stepsCard}>
                    <Text style={styles.cardTitle}>What happens next?</Text>

                    {/* Step 1 */}
                    <View style={styles.stepItem}>
                        <View style={styles.stepCircle}>
                            <Text style={styles.stepNumber}>1</Text>
                        </View>
                        <Text style={styles.stepText}>The employer will review your application</Text>
                    </View>

                    {/* Step 2 */}
                    <View style={styles.stepItem}>
                        <View style={styles.stepCircle}>
                            <Text style={styles.stepNumber}>2</Text>
                        </View>
                        <Text style={styles.stepText}>If your profile matches their requirements, they'll contact you</Text>
                    </View>

                    {/* Step 3 */}
                    <View style={styles.stepItem}>
                        <View style={styles.stepCircle}>
                            <Text style={styles.stepNumber}>3</Text>
                        </View>
                        <Text style={styles.stepText}>You can check your application status in "Applied Jobs"</Text>
                    </View>
                </View>

            </View>

            {/* Footer Buttons */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('AppliedJobs')}
                >
                    <Text style={styles.primaryButtonText}>View My Applications</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('Main', { screen: 'HomeTab' })}
                >
                    <Text style={styles.secondaryButtonText}>Browse More Jobs</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
        paddingTop: 60,
    },
    iconContainer: {
        marginBottom: 24,
    },
    successCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#00C48C', // Green
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#00C48C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    boldText: {
        fontWeight: 'bold',
        color: '#374151',
    },
    stepsCard: {
        width: '100%',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 24,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 20,
        textAlign: 'center',
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    stepCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    stepNumber: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },
    footer: {
        padding: 24,
        gap: 16,
    },
    primaryButton: {
        backgroundColor: '#0066FF',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        shadowColor: '#0066FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: '#EFF6FF',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    secondaryButtonText: {
        color: '#2563EB',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ApplicationSubmittedScreen;
