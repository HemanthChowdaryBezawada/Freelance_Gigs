import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { PatientListScreen } from '../screens/patient/PatientListScreen';
import { AlertsScreen } from '../screens/main/AlertsScreen';
import { ReportsScreen } from '../screens/analytics/ReportsScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { colors } from '../theme/colors';
import { LayoutDashboard, Users, AlertTriangle, BarChart2, Settings } from 'lucide-react-native';

import { useAlerts } from '../context/AlertContext';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {
    const { unreadCount } = useAlerts();

    return (
        <Tab.Navigator
            screenOptions={{
                // ... (keep existing options)
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.text.tertiary,
                tabBarStyle: {
                    borderTopColor: colors.border,
                    backgroundColor: colors.surface,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    marginTop: -4,
                }
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Patients"
                component={PatientListScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Alerts"
                component={AlertsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <AlertTriangle color={color} size={size} />,
                    tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
                    tabBarBadgeStyle: { backgroundColor: colors.error, color: colors.text.inverse }
                }}
            />
            <Tab.Screen
                name="Reports"
                component={ReportsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <BarChart2 color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
                }}
            />
        </Tab.Navigator>
    );
};
