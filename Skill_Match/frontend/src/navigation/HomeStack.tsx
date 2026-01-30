
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import JobDetailsScreen from '../screens/JobDetailsScreen';
import NearbyJobsScreen from '../screens/NearbyJobsScreen';

import ApplicationSubmittedScreen from '../screens/ApplicationSubmittedScreen';
import AppliedJobsScreen from '../screens/AppliedJobsScreen';

const Stack = createStackNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="JobFeed" component={HomeScreen} />
            <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
            <Stack.Screen name="NearbyJobs" component={NearbyJobsScreen} />
            <Stack.Screen name="ApplicationSubmitted" component={ApplicationSubmittedScreen} />
            <Stack.Screen name="AppliedJobs" component={AppliedJobsScreen} />
        </Stack.Navigator>
    );
};

export default HomeStack;
