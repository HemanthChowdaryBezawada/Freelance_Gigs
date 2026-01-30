
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { ManualDataService } from '../services/ManualDataService';

const JobPreferencesScreen = ({ navigation }: any) => {
    const [minSalary, setMinSalary] = useState('50000');
    const [maxSalary, setMaxSalary] = useState('100000');
    const [distance, setDistance] = useState(25);

    // Selections
    const [jobType, setJobType] = useState('Full-time');
    const [shift, setShift] = useState('Day Shift');
    const [experience, setExperience] = useState('Mid Level');

    const handleSave = async () => {
        try {
            const user = await ManualDataService.getUser();
            if (!user) {
                Alert.alert('Session Expired', 'Please login again.', [
                    { text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) }
                ]);
                return;
            }

            console.log("Saving preferences for:", user.id);

            const updates = {
                min_salary: parseInt(minSalary.replace(/[^0-9]/g, '')),
                max_salary: parseInt(maxSalary.replace(/[^0-9]/g, '')),
                preferred_distance: Math.round(distance),
                preferred_job_type: jobType,
                preferred_shift: shift,
                experience_level: experience,
            };

            const { error } = await ManualDataService.updateProfile(user.id, updates);

            if (error) throw new Error(error.message || 'Failed to update preferences');

            // Navigate to Main (Home) after this final step
            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            });
        } catch (error: any) {
            console.error("Save Preferences Error:", error);
            Alert.alert("Error", "Failed to save preferences: " + error.message);
        }
    };

    const SelectableChip = ({ label, selected, onSelect, fullWidth = false }: any) => (
        <TouchableOpacity
            style={[
                styles.chip,
                selected && styles.chipSelected,
                fullWidth && { flex: 1 }
            ]}
            onPress={() => onSelect(label)}
        >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#000" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Job Preferences</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Salary Range */}
                <Text style={styles.sectionTitle}>Salary Range</Text>
                <View style={styles.salaryRow}>
                    <View style={styles.salaryInputContainer}>
                        <Text style={styles.label}>Minimum ($)</Text>
                        <TextInput
                            style={styles.salaryInput}
                            value={minSalary}
                            onChangeText={setMinSalary}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.salaryInputContainer}>
                        <Text style={styles.label}>Maximum ($)</Text>
                        <TextInput
                            style={styles.salaryInput}
                            value={maxSalary}
                            onChangeText={setMaxSalary}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                {/* Commute Distance */}
                <View style={styles.distanceHeader}>
                    <Text style={styles.sectionTitle}>Commute Distance</Text>
                    <Text style={styles.distanceValue}>{Math.round(distance)} miles</Text>
                </View>
                <View style={styles.sliderContainer}>
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={5}
                        maximumValue={100}
                        value={distance}
                        onValueChange={setDistance}
                        minimumTrackTintColor="#2563EB"
                        maximumTrackTintColor="#E5E7EB"
                        thumbTintColor="#2563EB"
                    />
                    <View style={styles.sliderLabels}>
                        <Text style={styles.sliderLabel}>5 miles</Text>
                        <Text style={styles.sliderLabel}>100 miles</Text>
                    </View>
                </View>

                {/* Job Type */}
                <Text style={styles.sectionTitle}>Job Type</Text>
                <View style={styles.chipsRow}>
                    {['Full-time', 'Part-time', 'Contract'].map(type => (
                        <SelectableChip key={type} label={type} selected={jobType === type} onSelect={setJobType} />
                    ))}
                </View>
                <View style={[styles.chipsRow, { marginTop: 10 }]}>
                    <SelectableChip label="Internship" selected={jobType === 'Internship'} onSelect={setJobType} />
                </View>

                {/* Shift Preference */}
                <Text style={styles.sectionTitle}>Shift Preference</Text>
                <View style={styles.chipsRow}>
                    {['Day Shift', 'Night Shift', 'Flexible'].map(s => (
                        <SelectableChip key={s} label={s} selected={shift === s} onSelect={setShift} />
                    ))}
                </View>

                {/* Experience Level */}
                <Text style={styles.sectionTitle}>Experience Level</Text>
                <View style={styles.chipsRow}>
                    {['Entry Level', 'Mid Level', 'Senior'].map(e => (
                        <SelectableChip key={e} label={e} selected={experience === e} onSelect={setExperience} fullWidth />
                    ))}
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Preferences</Text>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12,
        marginTop: 8,
    },
    salaryRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    salaryInputContainer: {
        flex: 1,
    },
    label: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 6,
    },
    salaryInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 16,
        height: 48,
        fontSize: 16,
        color: '#111827',
        textAlign: 'center',
    },
    distanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    distanceValue: {
        color: '#2563EB',
        fontWeight: 'bold',
    },
    sliderContainer: {
        marginBottom: 24,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -4,
    },
    sliderLabel: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    chipsRow: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    chip: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#F9FAFB', // grey-50
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipSelected: {
        backgroundColor: '#2563EB', // Blue-600
    },
    chipText: {
        color: '#4B5563',
        fontWeight: '500',
    },
    chipTextSelected: {
        color: 'white',
        fontWeight: 'bold',
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    saveButton: {
        backgroundColor: '#2563EB',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default JobPreferencesScreen;
