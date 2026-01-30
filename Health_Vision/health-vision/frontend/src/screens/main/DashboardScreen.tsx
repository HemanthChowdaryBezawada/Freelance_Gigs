import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';
import { Users, AlertTriangle, Activity, CheckCircle, ArrowRight } from 'lucide-react-native';
// import { LineChart } from 'react-native-chart-kit'; // Will implement in Reports/Analytics to save bundle/time for this iteration
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { authService, UserProfile } from '../../services/AuthService';
import { patientService } from '../../services/PatientService';
import { alertsService } from '../../services/alerts/AlertsService';

const { width } = Dimensions.get('window');

const SummaryCard = ({ title, value, icon, color, subtext, onPress }: any) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ flex: 1 }}>
        <Card style={[styles.summaryCard, { borderLeftWidth: 4, borderLeftColor: color }] as any}>
            <View style={styles.summaryHeader}>
                <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
                    {icon}
                </View>
                <Text style={styles.summaryValue}>{value}</Text>
            </View>
            <Text style={styles.summaryTitle}>{title}</Text>
            {subtext && <Text style={styles.summarySubtext}>{subtext}</Text>}
        </Card>
    </TouchableOpacity>
);

const AlertRow = ({ message, time, severity }: any) => (
    <View style={styles.alertRow}>
        <View style={[styles.severityDot, { backgroundColor: severity === 'high' ? colors.error : colors.warning }]} />
        <View style={styles.alertContent}>
            <Text style={styles.alertMessage}>{message}</Text>
            <Text style={styles.alertTime}>{time}</Text>
        </View>
        <ArrowRight size={16} color={colors.text.tertiary} />
    </View>
);

// ... (moved to top)

import { useAlerts } from '../../context/AlertContext';

export const DashboardScreen = () => {
    const navigation = useNavigation<any>();
    const [user, setUser] = React.useState<UserProfile | null>(null);
    const [patientCount, setPatientCount] = React.useState<number>(0);
    const { unreadCount, refreshAlerts } = useAlerts();
    const [recentAlerts, setRecentAlerts] = React.useState<any[]>([]);

    React.useEffect(() => {
        const loadData = async () => {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);

            // Fetch real patient count
            const count = await patientService.getPatientCount();
            setPatientCount(count);

            // Refresh global alerts
            refreshAlerts();

            // Fetch recent data list
            const alerts = await alertsService.getAlerts();
            setRecentAlerts(alerts.slice(0, 3));
        };
        loadData();
    }, []);

    // Also reload count when screen comes into focus (e.g. after adding a patient)
    useFocusEffect(
        React.useCallback(() => {
            const fetchCount = async () => {
                const count = await patientService.getPatientCount();
                setPatientCount(count);

                refreshAlerts();

                const alerts = await alertsService.getAlerts();
                setRecentAlerts(alerts.slice(0, 3));
            };
            fetchCount();
        }, [])
    );

    const getTimeAgo = (dateStr: string) => {
        try {
            const diff = Date.now() - new Date(dateStr).getTime();
            const mins = Math.floor(diff / 60000);
            if (mins < 1) return 'Just now';
            if (mins < 60) return `${mins} mins ago`;
            const hours = Math.floor(mins / 60);
            if (hours < 24) return `${hours} hrs ago`;
            return `${Math.floor(hours / 24)} days ago`;
        } catch (e) {
            return 'Unknown';
        }
    };

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <View style={styles.container}>
            <Header title="Dashboard" rightElement={<Activity size={24} color={colors.primary} />} />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.greetingSection}>
                    <Text style={styles.greeting}>Hello, {user?.full_name || 'Doctor'}</Text>
                    <Text style={styles.date}>{currentDate}</Text>
                </View>

                {/* Status Grid */}
                <View style={styles.grid}>
                    <View style={styles.row}>
                        <SummaryCard
                            title="Total Patients"
                            value={patientCount.toString()}
                            icon={<Users size={20} color={colors.info} />}
                            color={colors.info}
                            onPress={() => navigation.navigate('Patients')}
                        />
                        <View style={{ width: spacing.m }} />
                        <SummaryCard
                            title="Active Alerts"
                            value={unreadCount.toString()}
                            icon={<AlertTriangle size={20} color={colors.error} />}
                            color={colors.error}
                            subtext={unreadCount > 0 ? "Requires Attention" : "All Clear"}
                            onPress={() => navigation.navigate('Alerts')}
                        />
                    </View>
                </View>

                {/* Recent Alerts Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Critical Alerts</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Alerts')}>
                        <Text style={styles.linkText}>View All</Text>
                    </TouchableOpacity>
                </View>

                <Card style={styles.alertsCard}>
                    {recentAlerts.length > 0 ? (
                        recentAlerts.map((alert, index) => (
                            <View key={alert.id}>
                                <AlertRow
                                    message={`${alert.type} - ${alert.patientName}`}
                                    time={getTimeAgo(alert.timestamp)}
                                    severity={alert.severity}
                                />
                                {index < recentAlerts.length - 1 && <View style={styles.divider} />}
                            </View>
                        ))
                    ) : (
                        <View style={{ padding: spacing.m, alignItems: 'center' }}>
                            <Text style={{ color: colors.text.tertiary }}>No recent alerts</Text>
                        </View>
                    )}
                </Card>

                {/* Quick Actions */}
                <Text style={[styles.sectionTitle, { marginTop: spacing.l }]}>Quick Actions</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionsRow}>
                    <TouchableOpacity style={styles.actionChip} onPress={() => navigation.navigate('Patients')}>
                        <Text style={styles.actionText}>+ Add Patient</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionChip} onPress={() => navigation.navigate('Reports')}>
                        <Text style={styles.actionText}>Export Daily Report</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionChip} onPress={() => navigation.navigate('Settings')}>
                        <Text style={styles.actionText}>Config Cameras</Text>
                    </TouchableOpacity>
                </ScrollView>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: spacing.m,
        paddingBottom: spacing.xxl,
    },
    greetingSection: {
        marginBottom: spacing.l,
    },
    greeting: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.sizes.h2,
        color: colors.text.primary,
    },
    date: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.sizes.bodySmall,
        color: colors.text.secondary,
    },
    grid: {
        marginBottom: spacing.l,
    },
    row: {
        flexDirection: 'row',
    },
    summaryCard: {
        padding: spacing.m,
        alignItems: 'flex-start',
        backgroundColor: colors.surface,
        minHeight: 120, // Ensure consistent height
        justifyContent: 'space-between', // Distribute content
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.s,
        justifyContent: 'space-between',
        width: '100%',
    },
    iconBox: {
        padding: spacing.s,
        borderRadius: layout.borderRadius.m,
    },
    summaryValue: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.sizes.h2,
        color: colors.text.primary,
    },
    summaryTitle: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.sizes.bodySmall,
        color: colors.text.secondary,
    },
    summarySubtext: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.sizes.caption,
        color: colors.text.tertiary,
        marginTop: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.s,
    },
    sectionTitle: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.sizes.h3,
        color: colors.text.primary,
    },
    linkText: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.sizes.bodySmall,
        color: colors.primary,
    },
    alertsCard: {
        padding: 0,
        overflow: 'hidden',
    },
    alertRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.m,
    },
    alertContent: {
        flex: 1,
        marginLeft: spacing.m,
    },
    severityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    alertMessage: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.sizes.body,
        color: colors.text.primary,
    },
    alertTime: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.sizes.caption,
        color: colors.text.tertiary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.surfaceVariant,
    },
    actionsRow: {
        marginTop: spacing.s,
    },
    actionChip: {
        backgroundColor: colors.primary + '10', // 10% opacity
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.m,
        borderRadius: layout.borderRadius.round,
        marginRight: spacing.m,
        borderWidth: 1,
        borderColor: colors.primary + '30',
    },
    actionText: {
        color: colors.primary,
        fontFamily: typography.fontFamily.medium,
    }
});
