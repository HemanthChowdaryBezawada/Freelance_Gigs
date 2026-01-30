import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Modal, ScrollView, Animated } from 'react-native';
import { Header } from '../../components/Header';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';
import { AlertTriangle, Clock, ChevronRight, CheckCircle, Info, X, User, Activity } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { alertsService, AlertLog } from '../../services/alerts/AlertsService';
import { Button } from '../../components/Button';

const AlertItem = ({ alert, onPress }: { alert: AlertLog, onPress: () => void }) => {
    const getIcon = () => {
        switch (alert.severity) {
            case 'critical': return <AlertTriangle size={24} color={colors.error} />;
            case 'warning': return <AlertTriangle size={24} color={colors.warning} />;
            case 'info': return <Info size={24} color={colors.info} />;
        }
    };

    const getTimeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <TouchableOpacity style={styles.alertCard} onPress={onPress}>
            <View style={styles.iconContainer}>
                {getIcon()}
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{alert.type || 'Alert'}</Text>
                    {alert.status === 'new' && <View style={styles.newBadge} />}
                </View>
                <Text style={styles.subtitle}>{alert.patientName}</Text>
                <View style={styles.timeRow}>
                    <Clock size={12} color={colors.text.tertiary} />
                    <Text style={styles.timeText}>{getTimeAgo(alert.timestamp)}</Text>
                </View>
            </View>
            <ChevronRight size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
    );
};

export const AlertsScreen = () => {
    const navigation = useNavigation<any>();
    const [alerts, setAlerts] = useState<AlertLog[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<AlertLog | null>(null);

    const loadAlerts = async () => {
        const data = await alertsService.getAlerts();
        setAlerts(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadAlerts();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadAlerts();
    };

    const handleResolve = async () => {
        if (selectedAlert) {
            await alertsService.resolveAlert(selectedAlert.id);
            setSelectedAlert(null);
            loadAlerts();
        }
    };

    return (
        <View style={styles.container}>
            <Header title="Alerts" />
            <FlatList
                data={alerts}
                renderItem={({ item }) => <AlertItem alert={item} onPress={() => setSelectedAlert(item)} />}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <CheckCircle size={48} color={colors.success} style={{ opacity: 0.5 }} />
                        <Text style={styles.emptyText}>No recent alerts</Text>
                    </View>
                }
            />

            {/* Alert Details Modal */}
            <Modal
                visible={!!selectedAlert}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedAlert(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedAlert && (
                            <>
                                <View style={[styles.modalHeader, { backgroundColor: selectedAlert.severity === 'critical' ? colors.error + '20' : colors.surface }]}>
                                    <View style={styles.modalIcon}>
                                        {selectedAlert.severity === 'critical' ? <AlertTriangle size={32} color={colors.error} /> : <Info size={32} color={colors.info} />}
                                    </View>
                                    <Text style={styles.modalTitle}>{selectedAlert.type || 'Alert Details'}</Text>
                                    <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedAlert(null)}>
                                        <X size={24} color={colors.text.secondary} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.modalBody}>
                                    <View style={styles.detailRow}>
                                        <User size={18} color={colors.text.tertiary} />
                                        <Text style={styles.detailLabel}>Patient:</Text>
                                        <Text style={styles.detailValue}>{selectedAlert.patientName}</Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Clock size={18} color={colors.text.tertiary} />
                                        <Text style={styles.detailLabel}>Time:</Text>
                                        <Text style={styles.detailValue}>{new Date(selectedAlert.timestamp).toLocaleString()}</Text>
                                    </View>

                                    <View style={styles.divider} />

                                    <Text style={styles.descriptionLabel}>Description</Text>
                                    <Text style={styles.descriptionText}>
                                        {selectedAlert.description || "No validation details provided for this alert."}
                                    </Text>

                                    <View style={styles.statusBadge}>
                                        <Activity size={14} color={colors.text.secondary} />
                                        <Text style={styles.statusText}>Status: {selectedAlert.status.toUpperCase()}</Text>
                                    </View>

                                    {selectedAlert.status !== 'resolved' && (
                                        <Button
                                            title="Mark Resolved"
                                            onPress={handleResolve}
                                            style={{ marginTop: spacing.l }}
                                            variant="outline"
                                        />
                                    )}
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
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
        marginTop: 100,
    },
    listContent: {
        padding: spacing.m,
    },
    alertCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.m,
        backgroundColor: colors.surface,
        marginBottom: spacing.s,
        borderRadius: layout.borderRadius.m,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        elevation: 2,
    },
    iconContainer: {
        marginRight: spacing.m,
    },
    infoContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    title: {
        fontSize: typography.sizes.bodyLarge,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginRight: spacing.s,
    },
    newBadge: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.error,
    },
    subtitle: {
        fontSize: typography.sizes.body,
        color: colors.text.secondary,
        marginBottom: 4,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: typography.sizes.caption,
        color: colors.text.tertiary,
        marginLeft: 4,
    },
    emptyText: {
        marginTop: spacing.m,
        color: colors.text.secondary,
        fontSize: typography.sizes.body,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: spacing.m,
    },
    modalContent: {
        backgroundColor: colors.background,
        borderRadius: layout.borderRadius.l,
        overflow: 'hidden',
        maxHeight: '80%',
    },
    modalHeader: {
        padding: spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalIcon: {
        marginRight: spacing.m,
    },
    modalTitle: {
        flex: 1,
        fontSize: typography.sizes.h3,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    closeButton: {
        padding: spacing.s,
    },
    modalBody: {
        padding: spacing.l,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    detailLabel: {
        fontSize: typography.sizes.body,
        fontWeight: 'bold',
        color: colors.text.secondary,
        marginLeft: spacing.s,
        marginRight: spacing.s,
        width: 60,
    },
    detailValue: {
        flex: 1,
        fontSize: typography.sizes.body,
        color: colors.text.primary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.m,
    },
    descriptionLabel: {
        fontSize: typography.sizes.bodySmall,
        fontWeight: 'bold',
        color: colors.text.tertiary,
        marginBottom: spacing.s,
        textTransform: 'uppercase',
    },
    descriptionText: {
        fontSize: typography.sizes.body,
        color: colors.text.primary,
        lineHeight: 24,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.l,
        padding: spacing.s,
        backgroundColor: colors.surface,
        alignSelf: 'flex-start',
        borderRadius: layout.borderRadius.s,
    },
    statusText: {
        fontSize: typography.sizes.caption,
        color: colors.text.secondary,
        marginLeft: spacing.s,
        fontWeight: 'bold',
    }
});
