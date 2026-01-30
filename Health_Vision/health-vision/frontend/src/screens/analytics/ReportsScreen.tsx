import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';
import { LineChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const CHART_CONFIG = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 109, 119, ${opacity})`, // Primary color
    labelColor: (opacity = 1) => colors.text.secondary,
    style: {
        borderRadius: 16,
    },
    propsForDots: {
        r: '5',
        strokeWidth: '2',
        stroke: colors.primary,
    },
};

const DATA_LINE = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            data: [2, 1, 3, 0, 4, 1, 2],
            color: (opacity = 1) => `rgba(186, 26, 26, ${opacity})`, // Error color for falls
            strokeWidth: 2,
        },
    ],
    legend: ['Fall Incidents'],
};

const DATA_PIE = [
    {
        name: 'High Risk',
        population: 5,
        color: colors.error,
        legendFontColor: colors.text.secondary,
        legendFontSize: 12,
    },
    {
        name: 'Medium Risk',
        population: 12,
        color: colors.warning,
        legendFontColor: colors.text.secondary,
        legendFontSize: 12,
    },
    {
        name: 'Low Risk',
        population: 25,
        color: colors.success,
        legendFontColor: colors.text.secondary,
        legendFontSize: 12,
    },
];

import { patientService } from '../../services/PatientService';
import { alertsService } from '../../services/alerts/AlertsService';
import { useFocusEffect } from '@react-navigation/native';

// ... (keep CHART_CONFIG)

export const ReportsScreen = () => {
    const [weeklyData, setWeeklyData] = React.useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
    const [riskData, setRiskData] = React.useState<any[]>([]);
    const [totalIncidents, setTotalIncidents] = React.useState(0);
    const [avgTime, setAvgTime] = React.useState('0m');

    useFocusEffect(
        React.useCallback(() => {
            const loadStats = async () => {
                // 1. Weekly Incidents (Last 7 days)
                const alerts = await alertsService.getAlerts();
                const last7Days = Array(7).fill(0);
                const today = new Date();

                alerts.forEach(alert => {
                    const alertDate = new Date(alert.timestamp);
                    const diffTime = Math.abs(today.getTime() - alertDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays <= 7 && alert.severity === 'critical') {
                        // Map to index (0 = today/Sunday, etc. - simplified for this demo to just reverse days)
                        // Actually better to map Mon-Sun. Let's simplfy: Just count per day bucket for the chart labels
                        // For now, let's just assume data matches the labels [Mon, Tue...] 
                        // To do it right: 
                        const dayIndex = alertDate.getDay(); // 0-6 (Sun-Sat)
                        // Adjust for Mon-Sun array: Mon(0)..Sun(6)
                        const chartIndex = dayIndex === 0 ? 6 : dayIndex - 1;
                        last7Days[chartIndex]++;
                    }
                });
                setWeeklyData(last7Days);
                setTotalIncidents(alerts.length);

                // 3. Average Response Time
                const resolvedAlerts = alerts.filter(a => a.status === 'resolved' && a.updatedAt);
                let avgResponseMinutes = 0;

                if (resolvedAlerts.length > 0) {
                    let totalDiff = 0;
                    let validCount = 0;

                    resolvedAlerts.forEach(a => {
                        const start = new Date(a.timestamp).getTime();
                        const end = new Date(a.updatedAt).getTime();
                        if (end > start) {
                            totalDiff += (end - start);
                            validCount++;
                        }
                    });

                    if (validCount > 0) {
                        avgResponseMinutes = Math.round((totalDiff / validCount) / 60000); // ms -> mins
                    }
                }

                setAvgTime(avgResponseMinutes > 0 ? `${avgResponseMinutes}m` : '0m');

                // 2. Patient Risk Distribution
                const highRiskPatients = new Set();
                const mediumRiskPatients = new Set();

                alerts.forEach(a => {
                    if (a.status !== 'resolved') {
                        if (a.severity === 'critical') highRiskPatients.add(a.patientId);
                        else if (a.severity === 'warning') mediumRiskPatients.add(a.patientId);
                    }
                });

                let high = 0, medium = 0, low = 0;
                const patients = await patientService.getPatients();

                // Debug: If no patients found, maybe show alerts count proxy?
                // The user complained about "1 Low Risk". 
                // This implies only 1 patient implies in the DB.

                patients.forEach(p => {
                    if (highRiskPatients.has(p.id)) {
                        high++;
                    } else if (mediumRiskPatients.has(p.id)) {
                        medium++;
                    } else {
                        low++;
                    }
                });

                setRiskData([
                    { name: 'High Risk', population: high, color: colors.error, legendFontColor: colors.text.secondary, legendFontSize: 12 },
                    { name: 'Medium Risk', population: medium, color: colors.warning, legendFontColor: colors.text.secondary, legendFontSize: 12 },
                    { name: 'Low Risk', population: low, color: colors.success, legendFontColor: colors.text.secondary, legendFontSize: 12 },
                ]);
            };
            loadStats();
        }, [])
    );

    const dataLine = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            data: weeklyData,
            color: (opacity = 1) => `rgba(186, 26, 26, ${opacity})`,
            strokeWidth: 2,
        }],
        legend: ['Critical Incidents'],
    };

    return (
        <View style={styles.container}>
            <Header title="Analytics" />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <Text style={styles.sectionTitle}>Weekly Incidents (Critical)</Text>
                <Card style={styles.chartCard}>
                    <LineChart
                        data={dataLine}
                        width={screenWidth - spacing.m * 4}
                        height={220}
                        chartConfig={CHART_CONFIG}
                        bezier
                        style={styles.chart}
                    />
                </Card>

                <Text style={styles.sectionTitle}>Patient Risk Distribution</Text>
                <Card style={styles.chartCard}>
                    {riskData.length > 0 ? (
                        <PieChart
                            data={riskData}
                            width={screenWidth - spacing.m * 4}
                            height={200}
                            chartConfig={CHART_CONFIG}
                            accessor={'population'}
                            backgroundColor={'transparent'}
                            paddingLeft={'15'}
                            center={[10, 0]}
                            absolute
                        />
                    ) : (
                        <Text style={{ padding: 20 }}>Loading...</Text>
                    )}
                </Card>

                <Text style={styles.sectionTitle}>Summary</Text>
                <View style={styles.summaryRow}>
                    <Card style={styles.statCard}>
                        <Text style={styles.statValue}>{totalIncidents}</Text>
                        <Text style={styles.statLabel}>Total Alerts</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Text style={styles.statValue}>{avgTime}</Text>
                        <Text style={styles.statLabel}>Avg Response Time</Text>
                    </Card>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.m,
        paddingBottom: spacing.xxl,
    },
    sectionTitle: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.sizes.h3,
        color: colors.text.primary,
        marginBottom: spacing.m,
    },
    chartCard: {
        alignItems: 'center',
        padding: spacing.s,
        marginBottom: spacing.l,
        overflow: 'hidden', // Contain chart
    },
    chart: {
        borderRadius: layout.borderRadius.m,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: spacing.s,
        padding: spacing.m,
    },
    statValue: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.sizes.h1,
        color: colors.primary,
    },
    statLabel: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.sizes.caption,
        color: colors.text.tertiary,
        marginTop: spacing.xs,
    },
});
