import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { LaunchScreen } from '../screens/auth/LaunchScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { PatientDetailScreen } from '../screens/patient/PatientDetailScreen';
import { VideoMonitoringScreen } from '../screens/main/VideoMonitoringScreen';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
    return (
        <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                }}
                initialRouteName="Launch"
            >
                <Stack.Screen name="Launch" component={LaunchScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Main" component={BottomTabNavigator} />
                <Stack.Screen name="Admin" component={require('./AdminNavigator').AdminNavigator} />
                <Stack.Screen
                    name="PatientDetail"
                    component={PatientDetailScreen}
                    options={{ animation: 'slide_from_right' }}
                />
                <Stack.Screen
                    name="AddPatient"
                    component={require('../screens/patient/AddPatientScreen').AddPatientScreen}
                    options={{ animation: 'slide_from_right' }}
                />
                <Stack.Screen
                    name="VideoMonitoring"
                    component={VideoMonitoringScreen}
                    options={{ animation: 'fade' }}
                />
                <Stack.Screen
                    name="VideoAnalysis"
                    component={require('../screens/vision/VideoAnalysisScreen').VideoAnalysisScreen}
                    options={{ animation: 'slide_from_bottom' }}
                />
                <Stack.Screen
                    name="EditProfile"
                    component={require('../screens/settings/EditProfileScreen').EditProfileScreen}
                    options={{ animation: 'slide_from_right' }}
                />
                <Stack.Screen
                    name="HelpSupport"
                    component={require('../screens/settings/HelpSupportScreen').HelpSupportScreen}
                    options={{ animation: 'slide_from_right' }}
                />
                <Stack.Screen
                    name="Subscription"
                    component={require('../screens/subscription/SubscriptionScreen').SubscriptionScreen}
                    options={{ animation: 'slide_from_bottom' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
