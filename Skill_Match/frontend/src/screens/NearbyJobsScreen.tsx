import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Modal, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Bell, MapPin, Navigation, ArrowRight, X, Check, ChevronDown } from 'lucide-react-native';
import { ManualDataService } from '../services/ManualDataService';

const LOCATIONS_DATA: Record<string, string[]> = {
    'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'],
    'USA': ['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Austin', 'Seattle'],
    'Remote': ['Worldwide'],
    'Canada': ['Toronto', 'Vancouver', 'Montreal'],
    'UK': ['London', 'Manchester']
};

const NearbyJobsScreen = ({ navigation }: any) => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [displayLocation, setDisplayLocation] = useState('India');

    // Selection State
    const [selectedCountry, setSelectedCountry] = useState('India');
    const [selectedCity, setSelectedCity] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'country' | 'city'>('country');

    useEffect(() => {
        fetchJobs('India');
    }, []);

    const fetchJobs = async (locationQuery: string) => {
        try {
            setLoading(true);
            const { data } = await ManualDataService.getNearbyJobs(locationQuery);
            setJobs(data || []);
            setDisplayLocation(locationQuery);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = (jobTitle: string) => {
        console.log(`Apply clicked for ${jobTitle}`);
    };

    const handleSaveLocation = () => {
        setIsEditing(false);
        const query = selectedCity ? `${selectedCity}, ${selectedCountry}` : selectedCountry;
        fetchJobs(query);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        // Reset to currently displayed
        const parts = displayLocation.split(',').map(s => s.trim());
        if (LOCATIONS_DATA[parts[parts.length - 1]]) {
            setSelectedCountry(parts[parts.length - 1]);
            setSelectedCity(parts.length > 1 ? parts[0] : '');
        }
    };

    const openModal = (type: 'country' | 'city') => {
        if (type === 'city' && !selectedCountry) return;
        setModalType(type);
        setModalVisible(true);
    };

    const handleSelectOption = (option: string) => {
        if (modalType === 'country') {
            setSelectedCountry(option);
            setSelectedCity(''); // Reset city
        } else {
            setSelectedCity(option);
        }
        setModalVisible(false);
    };

    const getOptions = () => {
        if (modalType === 'country') {
            return Object.keys(LOCATIONS_DATA);
        }
        return LOCATIONS_DATA[selectedCountry] || [];
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#000" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Jobs in {displayLocation}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Location Banner with Dropdown UI */}
                <View style={[styles.locationBanner, isEditing && styles.locationBannerEditing]}>
                    <View style={styles.locationIconCircle}>
                        <MapPin color="#2563EB" size={20} />
                    </View>

                    <View style={styles.locationInfo}>
                        <Text style={styles.locationLabel}>Searching In</Text>

                        {isEditing ? (
                            <View style={styles.pickerContainer}>
                                {/* Country Picker Trigger */}
                                <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal('country')}>
                                    <Text style={styles.dropdownText}>{selectedCountry || 'Select Country'}</Text>
                                    <ChevronDown size={16} color="#4B5563" />
                                </TouchableOpacity>

                                {/* City Picker Trigger */}
                                <TouchableOpacity
                                    style={[styles.dropdownButton, !selectedCountry && styles.disabledButton]}
                                    onPress={() => openModal('city')}
                                    disabled={!selectedCountry}
                                >
                                    <Text style={[styles.dropdownText, !selectedCountry && styles.disabledText]}>
                                        {selectedCity || 'Select City (Optional)'}
                                    </Text>
                                    <ChevronDown size={16} color={!selectedCountry ? "#9CA3AF" : "#4B5563"} />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <Text style={styles.locationText}>{displayLocation}</Text>
                        )}
                    </View>

                    {isEditing ? (
                        <View style={styles.editActions}>
                            <TouchableOpacity onPress={handleSaveLocation} style={styles.actionButton}>
                                <View style={styles.iconBtnBg}>
                                    <Check size={18} color="#fff" />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCancelEdit} style={styles.actionButton}>
                                <X size={20} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={() => setIsEditing(true)}>
                            <Text style={styles.changeLink}>Change</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Section Header */}
                <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>{jobs.length} Jobs Found</Text>
                </View>

                {/* Content */}
                {loading ? (
                    <ActivityIndicator size="large" color="#0066FF" style={{ marginTop: 40 }} />
                ) : jobs.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>No Jobs Available</Text>
                        <Text style={styles.emptyText}>
                            We couldn't find any open positions in "{displayLocation}".
                            Try changing the location selection.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.jobsList}>
                        {jobs.map((job) => (
                            <View key={job.id} style={styles.jobCard}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.jobIconBox, { backgroundColor: '#E0F2FE' }]}>
                                        <Text style={{ fontSize: 20 }}>💼</Text>
                                    </View>
                                    <View style={styles.jobMainInfo}>
                                        <Text style={styles.jobTitle}>{job.title}</Text>
                                        <Text style={styles.companyName}>{job.company_name || 'Confidential'}</Text>
                                    </View>
                                    <View style={styles.matchBadge}>
                                        <Text style={styles.matchText}>{job.match_score ? `${job.match_score}%` : 'New'}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailsRow}>
                                    <View style={styles.locationRow}>
                                        <MapPin size={14} color="#6B7280" />
                                        <Text style={styles.detailText}>{job.location}</Text>
                                    </View>
                                    <View style={styles.distanceBadge}>
                                        <Text style={styles.distanceText}>{job.job_type || 'Full Time'}</Text>
                                    </View>
                                </View>

                                <Text style={styles.salaryText}>{job.salary_range || 'Salary not disclosed'}</Text>

                                <TouchableOpacity style={styles.applyButton} onPress={() => handleApply(job.title)}>
                                    <Text style={styles.applyButtonText}>Apply Now</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

            </ScrollView>

            {/* Selection Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select {modalType === 'country' ? 'Country' : 'City'}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={getOptions()}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.optionItem} onPress={() => handleSelectOption(item)}>
                                    <Text style={styles.optionText}>{item}</Text>
                                    {(modalType === 'country' ? selectedCountry : selectedCity) === item && (
                                        <Check size={20} color="#0066FF" />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
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
    locationBanner: {
        backgroundColor: '#EFF6FF',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center', // Aligns vertically center
        marginBottom: 24,
    },
    locationBannerEditing: {
        alignItems: 'flex-start', // Allow expanding for dropdowns
    },
    locationIconCircle: {
        width: 40,
        height: 40,
        backgroundColor: '#DBEAFE',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginTop: 4, // Slight offset for alignment
    },
    locationInfo: {
        flex: 1,
    },
    locationLabel: {
        fontSize: 12,
        color: '#1F2937',
        fontWeight: '600',
        marginBottom: 4,
    },
    locationText: {
        fontSize: 14,
        color: '#2563EB',
        fontWeight: '500',
    },
    pickerContainer: {
        marginTop: 4,
        gap: 8,
        width: '100%',
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#BFDBFE',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    disabledButton: {
        backgroundColor: '#F3F4F6',
        borderColor: '#E5E7EB',
    },
    dropdownText: {
        fontSize: 14,
        color: '#1F2937',
    },
    disabledText: {
        color: '#9CA3AF',
    },
    changeLink: {
        color: '#2563EB',
        fontSize: 13,
        fontWeight: '600',
    },
    editActions: {
        flexDirection: 'column', // Stack buttons
        justifyContent: 'center',
        marginLeft: 12,
        gap: 8,
    },
    actionButton: {
        padding: 4,
    },
    iconBtnBg: {
        backgroundColor: '#10B981',
        borderRadius: 20,
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    jobsList: {
        gap: 16,
        marginBottom: 24,
    },
    jobCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    jobIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    jobMainInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    companyName: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    matchBadge: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        height: 24,
        justifyContent: 'center',
    },
    matchText: {
        color: '#2563EB',
        fontSize: 11,
        fontWeight: 'bold',
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        color: '#6B7280',
        fontSize: 13,
    },
    distanceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    distanceText: {
        color: '#10B981',
        fontSize: 11,
        fontWeight: '600',
    },
    salaryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 16,
    },
    applyButton: {
        backgroundColor: '#0066FF',
        height: 44,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    applyButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        marginTop: 20
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 8
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '60%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    optionText: {
        fontSize: 16,
        color: '#374151',
    },
});

export default NearbyJobsScreen;
