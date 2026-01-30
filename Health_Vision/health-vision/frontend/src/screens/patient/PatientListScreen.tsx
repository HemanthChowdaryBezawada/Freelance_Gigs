import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';
import { Filter, ChevronRight, Activity, Plus } from 'lucide-react-native';
import { Input } from '../../components/Input';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { patientService, Patient } from '../../services/PatientService';

const PatientCard = ({ patient, onPress }: { patient: Patient, onPress: () => void }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'critical': return colors.error;
            case 'warning': return colors.warning;
            case 'stable': return colors.success;
            case 'active': return colors.success;
            default: return colors.text.tertiary;
        }
    };

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <Card style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{patient.full_name.charAt(0)}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.name}>{patient.full_name}</Text>
                        <Text style={styles.details}>Room {patient.room_number} • {patient.age} yrs • {patient.gender}</Text>
                        <Text style={[styles.details, { marginTop: 2 }]}>{patient.condition}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(patient.status) + '20' }]}>
                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(patient.status) }]} />
                        <Text style={[styles.statusText, { color: getStatusColor(patient.status) }]}>
                            {patient.status.toUpperCase()}
                        </Text>
                    </View>
                </View>

                {/* Removed Event divider for now as we don't have events in basic DB yet */}
            </Card>
        </TouchableOpacity>
    );
};

export const PatientListScreen = () => {
    const navigation = useNavigation<any>();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const data = await patientService.getPatients();
            setPatients(data);
            setFilteredPatients(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchPatients();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchPatients();
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (text) {
            const lower = text.toLowerCase();
            const filtered = patients.filter(p =>
                p.full_name.toLowerCase().includes(lower) ||
                p.room_number.toLowerCase().includes(lower) ||
                p.condition.toLowerCase().includes(lower)
            );
            setFilteredPatients(filtered);
        } else {
            setFilteredPatients(patients);
        }
    };

    const renderItem = ({ item }: { item: Patient }) => (
        <PatientCard
            patient={item}
            onPress={() => navigation.navigate('PatientDetail', { patientId: item.id })}
        />
    );

    return (
        <View style={styles.container}>
            <Header
                title="Patients"
                rightElement={
                    <TouchableOpacity onPress={() => navigation.navigate('AddPatient')}>
                        <Plus size={24} color={colors.primary} />
                    </TouchableOpacity>
                }
            />

            <View style={styles.searchContainer}>
                <Input
                    placeholder="Search name, room, condition..."
                    containerStyle={{ marginBottom: 0 }}
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            {loading && !refreshing ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredPatients}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                    }
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={{ color: colors.text.secondary }}>No patients found.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainer: {
        padding: spacing.m,
        paddingBottom: spacing.s,
    },
    searchInput: {
        backgroundColor: colors.surface,
        borderColor: colors.surfaceVariant,
    },
    listContent: {
        padding: spacing.m,
        paddingBottom: 100, // Space for Fab or Bottom Tab
    },
    card: {
        marginBottom: spacing.m,
        padding: spacing.m,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.m,
    },
    avatarText: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.sizes.h3,
        color: colors.primary,
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.sizes.body,
        color: colors.text.primary,
    },
    details: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.sizes.caption,
        color: colors.text.secondary,
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: spacing.s,
        paddingVertical: 4,
        borderRadius: layout.borderRadius.m,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 4,
    },
    statusText: {
        fontFamily: typography.fontFamily.bold,
        fontSize: 10,
    },
    divider: {
        height: 1,
        backgroundColor: colors.surfaceVariant,
        marginBottom: spacing.s,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lastEvent: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.sizes.caption,
        color: colors.text.tertiary,
    },
});
