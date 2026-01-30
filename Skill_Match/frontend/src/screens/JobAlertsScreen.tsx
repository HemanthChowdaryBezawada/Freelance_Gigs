
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Plus, X, Info } from 'lucide-react-native';

const JobAlertsScreen = ({ navigation }: any) => {
    const [alerts, setAlerts] = useState([
        {
            id: '1',
            title: 'UX Designer in New York',
            tags: ['UX Designer', 'New York'],
            frequency: 'Daily',
            enabled: true,
        },
        {
            id: '2',
            title: 'Remote Frontend Jobs',
            tags: ['Frontend', 'Remote'],
            frequency: 'Weekly',
            enabled: true,
        },
        {
            id: '3',
            title: 'Product Manager $100K+',
            tags: ['Product Manager', '$100K+'],
            frequency: 'Daily',
            enabled: false,
        },
    ]);

    const toggleAlert = (id: string) => {
        setAlerts(alerts.map(alert =>
            alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
        ));
    };

    const removeAlert = (id: string) => {
        setAlerts(alerts.filter(alert => alert.id !== id));
    };

    const handleCreateAlert = () => {
        console.log("Create New Alert");
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#1F2937" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Job Alerts</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <Info size={20} color="#3B82F6" style={styles.infoIcon} />
                    <Text style={styles.infoText}>
                        Get notified when new jobs match your criteria. You can set up multiple alerts for different job types.
                    </Text>
                </View>

                {/* Alerts List */}
                <View style={styles.alertsList}>
                    {alerts.map((alert) => (
                        <View key={alert.id} style={styles.alertCard}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.alertTitle}>{alert.title}</Text>
                                <View style={styles.cardActions}>
                                    <Switch
                                        trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                                        thumbColor={'#fff'}
                                        onValueChange={() => toggleAlert(alert.id)}
                                        value={alert.enabled}
                                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                    />
                                    <TouchableOpacity onPress={() => removeAlert(alert.id)}>
                                        <X size={20} color="#9CA3AF" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.tagsContainer}>
                                {alert.tags.map((tag, index) => (
                                    <View key={index} style={styles.tag}>
                                        <Text style={styles.tagText}>{tag}</Text>
                                    </View>
                                ))}
                            </View>

                            <Text style={styles.frequencyText}>Frequency:   <Text style={styles.freqValue}>{alert.frequency}</Text></Text>
                        </View>
                    ))}
                </View>

            </ScrollView>

            {/* Footer Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.createButton} onPress={handleCreateAlert}>
                    <Plus size={20} color="white" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Create New Alert</Text>
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
    infoCard: {
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    infoIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#4B5563',
        lineHeight: 20,
    },
    alertsList: {
        gap: 16,
    },
    alertCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    alertTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    tag: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 11,
        color: '#4B5563',
        fontWeight: '500',
    },
    frequencyText: {
        fontSize: 12,
        color: '#6B7280',
    },
    freqValue: {
        color: '#4B5563',
    },
    footer: {
        padding: 20,
        backgroundColor: '#F9FAFB',
    },
    createButton: {
        backgroundColor: '#0066FF',
        borderRadius: 12,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default JobAlertsScreen;
