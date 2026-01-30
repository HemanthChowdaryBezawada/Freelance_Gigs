
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Calendar as CalendarIcon, Video, Phone, User } from 'lucide-react-native';

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];
const DURATIONS = ['30 min', '45 min', '1 hour', '1.5 hours'];

const ScheduleInterviewScreen = ({ navigation, route }: any) => {
    const { applicantId, seekerId, name, role } = route.params || {};

    const [selectedDate, setSelectedDate] = useState('mm/dd/yyyy');
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
    const [interviewType, setInterviewType] = useState<'video' | 'phone'>('video');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDateModalVisible, setDateModalVisible] = useState(false);

    const getUpcomingDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 5; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            dates.push(d);
        }
        return dates;
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(formatDate(date));
        setDateModalVisible(false);
    };

    const handleSendInvitation = async () => {
        if (!applicantId) {
            alert("Error: No applicant selected");
            return;
        }
        setLoading(true);
        // Using ManualDataService (imported)
        // We need to import it first, assume it's available or use require if avoiding top-level import issues
        const { ManualDataService } = require('../services/ManualDataService');

        await ManualDataService.scheduleInterview(applicantId, {
            date: selectedDate,
            time: selectedTime,
            duration: selectedDuration,
            type: interviewType,
            notes
        });

        setLoading(false);
        // alert("Interview Invitation Sent!"); // Removed alert to jump straight to chat

        const inviteMessage = `Hi ${name || 'Candidate'}, I'd like to invite you for a ${interviewType} interview on ${selectedDate} at ${selectedTime} (${selectedDuration}). ${notes ? `\n\nNotes: ${notes}` : ''}`;

        // Save message to DB
        // We need 'current user' as sender. ScheduleInterviewScreen doesn't seem to have current user context passed directly.
        // We can fetch it or just use ManualDataService.sendMessage which returns error if not auth'd.
        const user = await ManualDataService.getUser();
        console.log("Persisting invite. ApplicantId:", applicantId, "Sender:", user?.id);

        if (user) {
            const { error } = await ManualDataService.sendMessage(applicantId, user.id, inviteMessage);
            if (error) {
                console.error("Failed to save invite message:", error);
                alert("Warning: Could not save interview invite to chat history. " + JSON.stringify(error));
            } else {
                console.log("Invite saved to chat history successfully.");
            }
        } else {
            console.error("No user found when scheduling interview.");
            alert("Error: Could not identify current user. Message not saved.");
        }

        navigation.navigate('ChatDetail', {
            name: name,
            initials: name ? name.substring(0, 2).toUpperCase() : 'CA',
            color: '#2563EB',
            initialMessage: inviteMessage,
            applicationId: applicantId
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#111827" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Schedule Interview</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Candidate Card */}
                <View style={styles.candidateCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {name ? name.substring(0, 2).toUpperCase() : 'CA'}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.candidateName}>{name || 'Candidate Name'}</Text>
                        <Text style={styles.candidateRole}>{role || 'Job Seeker'}</Text>
                    </View>
                </View>

                {/* Date Selection */}
                <View style={styles.section}>
                    <View style={styles.labelRow}>
                        <Text style={styles.label}>Interview Date</Text>
                        <Text style={styles.required}>*</Text>
                    </View>
                    <View style={styles.dateInput}>
                        <TextInput
                            style={{ flex: 1, fontSize: 16, color: '#111827' }}
                            placeholder="MM/DD/YYYY"
                            placeholderTextColor="#9CA3AF"
                            value={selectedDate === 'mm/dd/yyyy' ? '' : selectedDate}
                            onChangeText={setSelectedDate}
                        />
                        <TouchableOpacity onPress={() => setDateModalVisible(true)}>
                            <CalendarIcon size={20} color="#111827" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Time Selection */}
                <View style={styles.section}>
                    <View style={styles.labelRow}>
                        <Text style={styles.label}>Select Time</Text>
                        <Text style={styles.required}>*</Text>
                    </View>
                    <View style={styles.gridContainer}>
                        {TIME_SLOTS.map((time) => (
                            <TouchableOpacity
                                key={time}
                                style={[styles.timeSlot, selectedTime === time && styles.timeSlotActive]}
                                onPress={() => setSelectedTime(time)}
                            >
                                <Text style={[styles.timeText, selectedTime === time && styles.timeTextActive]}>{time}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Duration Selection */}
                <View style={styles.section}>
                    <Text style={styles.label}>Duration</Text>
                    <View style={styles.gridContainer}>
                        {DURATIONS.map((duration) => (
                            <TouchableOpacity
                                key={duration}
                                style={[styles.durationSlot, selectedDuration === duration && styles.timeSlotActive]}
                                onPress={() => setSelectedDuration(duration)}
                            >
                                <Text style={[styles.durationText, selectedDuration === duration && styles.timeTextActive]}>
                                    {duration.replace(' ', '\n')}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Interview Type */}
                <View style={styles.section}>
                    <Text style={styles.label}>Interview Type</Text>
                    <View style={styles.typeContainer}>
                        <TouchableOpacity
                            style={[styles.typeButton, interviewType === 'video' && styles.typeButtonActive]}
                            onPress={() => setInterviewType('video')}
                        >
                            <Video size={20} color={interviewType === 'video' ? '#2563EB' : '#111827'} />
                            <Text style={[styles.typeText, interviewType === 'video' && styles.typeTextActive]}>Video Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeButton, interviewType === 'phone' && styles.typeButtonActive]}
                            onPress={() => setInterviewType('phone')}
                        >
                            <Phone size={20} color={interviewType === 'phone' ? '#2563EB' : '#111827'} />
                            <Text style={[styles.typeText, interviewType === 'phone' && styles.typeTextActive]}>Phone Call</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Additional Notes */}
                <View style={styles.section}>
                    <Text style={styles.label}>Additional Notes (Optional)</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Add any special instructions or topics to discuss..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        textAlignVertical="top"
                        value={notes}
                        onChangeText={setNotes}
                    />
                </View>

            </ScrollView>

            {/* Footer Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={[styles.submitButton, loading && { opacity: 0.7 }]} onPress={handleSendInvitation} disabled={loading}>
                    <Text style={styles.submitButtonText}>{loading ? 'Sending...' : 'Send Interview Invitation'}</Text>
                </TouchableOpacity>
            </View>
            {/* Date Selection Modal */}
            {isDateModalVisible && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select Date</Text>
                        <ScrollView style={{ maxHeight: 250 }}>
                            {getUpcomingDates().map((date, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.dateOption}
                                    onPress={() => handleDateSelect(date)}
                                >
                                    <Text style={styles.dateOptionText}>
                                        {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </Text>
                                    <View style={styles.radioButton}>
                                        {selectedDate === formatDate(date) && <View style={styles.radioInner} />}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setDateModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    candidateCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#0066FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    candidateName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 2,
    },
    candidateRole: {
        fontSize: 14,
        color: '#6B7280',
    },
    section: {
        marginBottom: 24,
    },
    labelRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    required: {
        color: '#EF4444',
        marginLeft: 4,
    },
    dateInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
        color: '#111827',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    timeSlot: {
        width: '30%',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    durationSlot: {
        width: '22%',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeSlotActive: {
        borderColor: '#2563EB',
        backgroundColor: '#F0F9FF',
    },
    timeText: {
        fontSize: 14,
        color: '#374151',
    },
    durationText: {
        fontSize: 14,
        color: '#374151',
        textAlign: 'center',
    },
    timeTextActive: {
        color: '#2563EB',
        fontWeight: '600',
    },
    typeContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingVertical: 14,
        gap: 8,
    },
    typeButtonActive: {
        borderColor: '#2563EB',
        backgroundColor: '#F0F9FF',
    },
    typeText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    typeTextActive: {
        color: '#2563EB',
    },
    textArea: {
        backgroundColor: '#fff',
        // borderWidth: 1, // Optional: border for text area? Screenshot doesn't clearly show distinct box, maybe flat input
        // borderColor: '#E5E7EB', 
        borderRadius: 12,
        paddingHorizontal: 0, // Screenshot shows simple placeholder text
        paddingVertical: 0,
        height: 100,
        fontSize: 16,
        color: '#111827',
    },
    footer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    submitButton: {
        backgroundColor: '#0066FF',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContainer: {
        backgroundColor: 'white',
        width: '80%',
        borderRadius: 16,
        padding: 20,
        zIndex: 1001,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#111827',
        textAlign: 'center',
    },
    dateOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    dateOptionText: {
        fontSize: 16,
        color: '#374151',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#2563EB',
    },
    closeButton: {
        marginTop: 16,
        alignItems: 'center',
        paddingVertical: 10,
    },
    closeButtonText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ScheduleInterviewScreen;
