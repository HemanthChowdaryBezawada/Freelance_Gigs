import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RecordFilterScreen() {
    const router = useRouter();
    const [minConfidence, setMinConfidence] = useState(false);
    const [dateRange, setDateRange] = useState(false);
    const [selectedBreed, setSelectedBreed] = useState('All');

    const breeds = ['All', 'Murrah', 'Gir', 'Sahiwal', 'Jaffarabadi', 'Nili-Ravi'];

    const handleApply = () => {
        router.back();
    };

    const handleReset = () => {
        setMinConfidence(false);
        setDateRange(false);
        setSelectedBreed('All');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={24} color="#1A2A3A" />
                </TouchableOpacity>
                <Text style={styles.title}>Filter Records</Text>
                <TouchableOpacity onPress={handleReset}>
                    <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>

                <Text style={styles.sectionTitle}>Confidence Level</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Show High Confidence Only ({'>'}80%)</Text>
                    <Switch
                        value={minConfidence}
                        onValueChange={setMinConfidence}
                        trackColor={{ false: '#767577', true: '#FF8008' }}
                        thumbColor={minConfidence ? '#FFF' : '#f4f3f4'}
                    />
                </View>

                <Text style={styles.sectionTitle}>Date</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Filter by Date Range</Text>
                    <Switch
                        value={dateRange}
                        onValueChange={setDateRange}
                        trackColor={{ false: '#767577', true: '#FF8008' }}
                        thumbColor={dateRange ? '#FFF' : '#f4f3f4'}
                    />
                </View>
                {dateRange && (
                    <View style={styles.datePickerPlaceholder}>
                        <Text style={styles.dateText}>Last 30 Days Selected</Text>
                    </View>
                )}

                <Text style={styles.sectionTitle}>Breed</Text>
                <View style={styles.chipsContainer}>
                    {breeds.map((breed) => (
                        <TouchableOpacity
                            key={breed}
                            style={[styles.chip, selectedBreed === breed && styles.selectedChip]}
                            onPress={() => setSelectedBreed(breed)}
                        >
                            <Text style={[styles.chipText, selectedBreed === breed && styles.selectedChipText]}>
                                {breed}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                    <Text style={styles.applyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
        marginTop: 40,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A2A3A',
    },
    resetText: {
        color: '#FF8008',
        fontSize: 16,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#9AA5B1',
        marginBottom: 12,
        marginTop: 20,
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        color: '#1A2A3A',
    },
    datePickerPlaceholder: {
        backgroundColor: '#F5F7FA',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    dateText: {
        color: '#5B6B7C',
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F5F7FA',
        borderWidth: 1,
        borderColor: '#E0E6ED',
    },
    selectedChip: {
        backgroundColor: '#1A2A3A',
        borderColor: '#1A2A3A',
    },
    chipText: {
        color: '#5B6B7C',
    },
    selectedChipText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F2F5',
        paddingBottom: 40,
    },
    applyButton: {
        backgroundColor: '#FF8008',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    applyButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
