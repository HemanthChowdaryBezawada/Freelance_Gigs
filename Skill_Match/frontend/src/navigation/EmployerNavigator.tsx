
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, PlusSquare, Users, MessageSquare, User } from 'lucide-react-native';

// Screens
import EmployerDashboardScreen from '../screens/EmployerDashboardScreen';
import PostJobScreen from '../screens/PostJobScreen';
import ChatScreen from '../screens/ChatScreen';
import ChatStack from './ChatStack';
import ApplicantsScreen from '../screens/ApplicantsScreen';
import CompanyProfileScreen from '../screens/CompanyProfileScreen';

const Tab = createBottomTabNavigator();

const EmployerNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#2563EB',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#F3F4F6',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                }
            }}
        >
            <Tab.Screen
                name="EmployerHome"
                component={EmployerDashboardScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => <Home color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="EmployerPostJob"
                component={PostJobScreen}
                options={{
                    tabBarLabel: 'Post Job',
                    tabBarIcon: ({ color }) => <PlusSquare color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="Applicants"
                component={ApplicantsScreen}
                options={{
                    tabBarLabel: 'Applicants',
                    tabBarIcon: ({ color }) => <Users color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="EmployerChat"
                component={ChatStack}
                options={{
                    tabBarLabel: 'Chat',
                    tabBarIcon: ({ color }) => <MessageSquare color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="EmployerProfile"
                component={CompanyProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => <User color={color} size={24} />,
                }}
            />
        </Tab.Navigator>
    );
};

export default EmployerNavigator;
