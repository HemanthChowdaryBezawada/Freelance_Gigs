import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';
import { Calendar, Activity, AlertCircle, Video, Phone, MessageSquare, X } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { patientService, Patient } from '../../services/PatientService';

type ParamList = {
    Detail: { patientId: string };
};

export const PatientDetailScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<ParamList, 'Detail'>>();
    const { patientId } = route.params;

    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [savingNote, setSavingNote] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (patientId) {
                const data = await patientService.getPatientById(patientId);
                setPatient(data || null);
            }
            setLoading(false);
        };
        loadData();
    }, [patientId]);

    const handleSaveNote = async () => {
        if (!noteText.trim() || !patient) return;

        setSavingNote(true);
        try {
            const newNote = `${new Date().toLocaleString()}: ${noteText}\n\n${patient.notes || ''}`;
            const success = await patientService.updatePatient(patient.id, { notes: newNote });

            if (success) {
                setPatient({ ...patient, notes: newNote });
                setNoteText('');
                setModalVisible(false);
                Alert.alert('Success', 'Note added successfully');
            } else {
                Alert.alert('Error', 'Failed to save note');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to save note');
        } finally {
            setSavingNote(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!patient) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={{ color: colors.text.secondary }}>Patient not found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header title="Patient Details" showBack />

            <ScrollView contentContainerStyle={styles.content}>

                {/* Profile Header */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarLarge}>
                        <Text style={styles.avatarTextLarge}>{(patient.full_name || '?').charAt(0)}</Text>
                    </View>
                    <Text style={styles.name}>{patient.full_name || 'Unknown Patient'}</Text>
                    <Text style={styles.subtext}>Room {patient.room_number || 'N/A'} • {patient.age || '?'} years old</Text>

                    <View style={[styles.statusBadge, { backgroundColor: patient.status === 'critical' ? colors.error : colors.success }]}>
                        <Text style={styles.statusText}>{(patient.status || 'stable').toUpperCase()}</Text>
                    </View>
                </View>

                {/* Quick Actions - Notes Only */}
                <View style={styles.actionGrid}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('VideoAnalysis', { userId: patient.id })}
                    >
                        <View style={[styles.iconBox, { backgroundColor: colors.primary + '20' }]}>
                            <Video size={24} color={colors.primary} />
                        </View>
                        <Text style={styles.actionLabel}>Vision Analysis</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => Alert.alert('Coming Soon', 'Live Monitoring feature will be available in the next update!', [{ text: 'OK' }])}
                    >
                        <View style={[styles.iconBox, { backgroundColor: colors.info + '20' }]}>
                            <Activity size={24} color={colors.info} />
                        </View>
                        <Text style={styles.actionLabel}>Live Monitoring</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <View style={[styles.iconBox, { backgroundColor: colors.success + '20' }]}>
                            <MessageSquare size={24} color={colors.success} />
                        </View>
                        <Text style={styles.actionLabel}>Add Note</Text>
                    </TouchableOpacity>
                </View>

                {/* Info Cards */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Medical Information</Text>

                    <View style={styles.infoRow}>
                        <Calendar size={20} color={colors.text.tertiary} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Admitted</Text>
                            <Text style={styles.infoValue}>
                                {patient.admission_date ? new Date(patient.admission_date).toLocaleDateString() : 'N/A'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Activity size={20} color={colors.text.tertiary} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Condition</Text>
                            <Text style={styles.infoValue}>{patient.condition || 'N/A'}</Text>
                        </View>
                    </View>
                </View>

                {/* Notes Section */}
                {patient.notes && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Caregiver Notes</Text>
                        <Text style={styles.notesText}>{patient.notes}</Text>
                    </View>
                )}

            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalCenteredView}
                >
                    <View style={styles.modalView}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add Caregiver Note</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X size={24} color={colors.text.secondary} />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.noteInput}
                            multiline
                            numberOfLines={6}
                            placeholder="Type observation here..."
                            value={noteText}
                            onChangeText={setNoteText}
                            textAlignVertical="top"
                        />

                        <Button
                            title={savingNote ? "Saving..." : "Save Note"}
                            onPress={handleSaveNote}
                            disabled={savingNote}
                            style={{ marginTop: spacing.m }}
                        />
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: spacing.m,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    avatarLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.m,
    },
    avatarTextLarge: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.primary,
    },
    name: {
        fontSize: typography.sizes.h2,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: 4,
    },
    subtext: {
        fontSize: typography.sizes.body,
        color: colors.text.secondary,
        marginBottom: spacing.s,
    },
    statusBadge: {
        paddingHorizontal: spacing.m,
        paddingVertical: 6,
        borderRadius: layout.borderRadius.round,
    },
    statusText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    actionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.l,
    },
    actionButton: {
        alignItems: 'center',
        width: '30%',
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xs,
    },
    actionLabel: {
        fontSize: 12,
        color: colors.text.primary,
        fontWeight: '500',
    },
    section: {
        backgroundColor: colors.surface,
        borderRadius: layout.borderRadius.m,
        padding: spacing.m,
        marginBottom: spacing.m,
    },
    sectionTitle: {
        fontSize: typography.sizes.h3,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: spacing.m,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    infoContent: {
        marginLeft: spacing.m,
    },
    infoLabel: {
        fontSize: 12,
        color: colors.text.tertiary,
    },
    infoValue: {
        fontSize: 16,
        color: colors.text.primary,
        fontWeight: '500',
    },
    notesText: {
        fontSize: 14,
        color: colors.text.secondary,
        lineHeight: 20,
    },
    modalCenteredView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: layout.borderRadius.l,
        borderTopRightRadius: layout.borderRadius.l,
        padding: spacing.l,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        minHeight: '50%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    modalTitle: {
        fontSize: typography.sizes.h3,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    noteInput: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: layout.borderRadius.m,
        padding: spacing.m,
        fontSize: 16,
        color: colors.text.primary,
        height: 150,
        backgroundColor: colors.background,
    }
});
