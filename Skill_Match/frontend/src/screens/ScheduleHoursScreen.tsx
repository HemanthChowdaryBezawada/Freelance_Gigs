
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const SHIFT_PREFERENCES = ['Day Shift', 'Night Shift', 'Rotating', 'Flexible'];

const ScheduleHoursScreen = ({ navigation, route }: any) => {
    const jobData = route.params?.jobData || {}; // Get passed data

    const [employmentType, setEmploymentType] = useState('Full-time');
    const [hoursPerWeek, setHoursPerWeek] = useState('40');
    const [shiftPreference, setShiftPreference] = useState('Day Shift');
    const [startDate, setStartDate] = useState(new Date());
    const [isFlexible, setIsFlexible] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || startDate;
        setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS if simple picker
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        setStartDate(currentDate);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#111827" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Schedule & Hours</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Progress Bar - Step 3 of 4 */}


                {/* Employment Type */}
                <View style={styles.section}>
                    <Text style={styles.label}>Employment Type</Text>
                    <View style={styles.gridContainer}>
                        {EMPLOYMENT_TYPES.map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[styles.optionButton, employmentType === type && styles.optionButtonActive]}
                                onPress={() => setEmploymentType(type)}
                            >
                                <Text style={[styles.optionText, employmentType === type && styles.optionTextActive]}>{type}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Hours per Week */}
                <View style={styles.section}>
                    <Text style={styles.label}>Hours per Week</Text>
                    <TextInput
                        style={styles.input}
                        value={hoursPerWeek}
                        onChangeText={setHoursPerWeek}
                        keyboardType="numeric"
                    />
                </View>

                {/* Shift Preference */}
                <View style={styles.section}>
                    <Text style={styles.label}>Shift Preference</Text>
                    <View style={styles.gridContainer}>
                        {SHIFT_PREFERENCES.map((shift) => (
                            <TouchableOpacity
                                key={shift}
                                style={[styles.optionButton, shiftPreference === shift && styles.optionButtonActive]}
                                onPress={() => setShiftPreference(shift)}
                            >
                                <Text style={[styles.optionText, shiftPreference === shift && styles.optionTextActive]}>{shift}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Start Date */}
                <View style={styles.section}>
                    <Text style={styles.label}>Start Date</Text>
                    <TouchableOpacity
                        style={styles.dateInput}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={styles.datePlaceholder}>{formatDate(startDate)}</Text>
                        <Calendar size={20} color="#111827" />
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={startDate}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onDateChange}
                        />
                    )}
                </View>

                {/* Flexible Schedule Checkbox */}
                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setIsFlexible(!isFlexible)}
                >
                    <View style={[styles.checkbox, isFlexible && styles.checkboxChecked]}>
                        {isFlexible && <View style={styles.checkboxInner} />}
                    </View>
                    <View style={styles.checkboxLabelContainer}>
                        <Text style={styles.checkboxTitle}>Flexible Schedule</Text>
                        <Text style={styles.checkboxSubtitle}>This position offers flexible working hours</Text>
                    </View>
                </TouchableOpacity>

            </ScrollView>

            {/* Footer Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => {
                        const fullJobData = {
                            ...jobData,
                            schedule: {
                                employmentType,
                                hoursPerWeek,
                                shiftPreference,
                                startDate: formatDate(startDate),
                                isFlexible
                            }
                        };
                        navigation.navigate('PreviewJob', { jobData: fullJobData });
                    }}
                >
                    <Text style={styles.continueButtonText}>Continue to Preview</Text>
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

    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 12,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    optionButton: {
        width: '48%',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    optionButtonActive: {
        borderColor: '#2563EB',
        backgroundColor: '#EFF6FF',
    },
    optionText: {
        fontSize: 14,
        color: '#374151',
    },
    optionTextActive: {
        color: '#2563EB',
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#fff',
        // borderWidth: 1, // Screenshot looks flat/white, maybe simpler
        // borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#111827',
        // Shadow/Elevation if needed to match white look in grey bg
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    dateInput: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    datePlaceholder: {
        fontSize: 16,
        color: '#111827',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#9CA3AF',
        borderRadius: 4,
        marginRight: 12,
        marginTop: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        borderColor: '#2563EB',
    },
    checkboxInner: {
        width: 10,
        height: 10,
        backgroundColor: '#2563EB',
        borderRadius: 2,
    },
    checkboxLabelContainer: {
        flex: 1,
    },
    checkboxTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    checkboxSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    footer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    continueButton: {
        backgroundColor: '#0066FF',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    continueButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ScheduleHoursScreen;
