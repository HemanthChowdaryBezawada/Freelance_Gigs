import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { Home, Briefcase, User, MapPin, MessageSquare } from 'lucide-react-native';
import HomeStack from './HomeStack';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SavedJobsScreen from '../screens/SavedJobsScreen';
import ChatStack from './ChatStack';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#E5E7EB',
                    paddingTop: 10,
                    paddingBottom: 20,
                    height: 80,
                },
                tabBarActiveTintColor: '#2563EB',
                tabBarInactiveTintColor: '#9CA3AF',
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{
                    tabBarIcon: ({ color }: { color: string }) => <Home color={color} size={24} />,
                    tabBarLabel: 'Home'
                }}
            />
            <Tab.Screen
                name="Map"
                component={MapScreen}
                options={{
                    tabBarIcon: ({ color }: { color: string }) => <MapPin color={color} size={24} />,
                    tabBarLabel: 'Map'
                }}
            />
            <Tab.Screen
                name="Jobs"
                component={SavedJobsScreen}
                options={{
                    tabBarIcon: ({ color }: { color: string }) => <Briefcase color={color} size={24} />,
                    tabBarLabel: 'Jobs'
                }}
            />
            <Tab.Screen
                name="Chat"
                component={ChatStack}
                options={{
                    tabBarIcon: ({ color }: { color: string }) => <MessageSquare color={color} size={24} />,
                    tabBarLabel: 'Chat'
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color }: { color: string }) => <User color={color} size={24} />,
                    tabBarLabel: 'Profile'
                }}
            />
        </Tab.Navigator>
    );
};

export default MainNavigator;
