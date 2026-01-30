import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { AddStaffScreen } from '../screens/admin/AddStaffScreen';

const Stack = createNativeStackNavigator();

export const AdminNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Stack.Screen name="AddStaff" component={AddStaffScreen} />
            <Stack.Screen name="EditStaff" component={require('../screens/admin/EditStaffScreen').EditStaffScreen} />
        </Stack.Navigator>
    );
};
