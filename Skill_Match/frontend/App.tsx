
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

enableScreens();

import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import AddSkillsScreen from './src/screens/AddSkillsScreen';
import UploadResumeScreen from './src/screens/UploadResumeScreen';
import JobPreferencesScreen from './src/screens/JobPreferencesScreen';
import SearchScreen from './src/screens/SearchScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import JobAlertsScreen from './src/screens/JobAlertsScreen';
import JobDetailsScreen from './src/screens/JobDetailsScreen';
import MapScreen from './src/screens/MapScreen';
import AIRecommendationsScreen from './src/screens/AIRecommendationsScreen';
import RecentlyViewedScreen from './src/screens/RecentlyViewedScreen';
import ApplicationSubmittedScreen from './src/screens/ApplicationSubmittedScreen';
import AppliedJobsScreen from './src/screens/AppliedJobsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import SubscriptionScreen from './src/screens/SubscriptionScreen';

import EditBusinessInfoScreen from './src/screens/EditBusinessInfoScreen';
import EmployerOnboardingScreen from './src/screens/EmployerOnboardingScreen';
import EmployerDashboardScreen from './src/screens/EmployerDashboardScreen';
import PostJobScreen from './src/screens/PostJobScreen';
import PreviewJobScreen from './src/screens/PreviewJobScreen';
import ShortlistedCandidatesScreen from './src/screens/ShortlistedCandidatesScreen';
import CandidateProfileScreen from './src/screens/CandidateProfileScreen';
import ScheduleInterviewScreen from './src/screens/ScheduleInterviewScreen';
import ScheduleHoursScreen from './src/screens/ScheduleHoursScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HelpSupportScreen from './src/screens/HelpSupportScreen';
import ChatDetailScreen from './src/screens/ChatDetailScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import MainNavigator from './src/navigation/MainNavigator';
import EmployerNavigator from './src/navigation/EmployerNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { useUserStore } from './src/store/userStore';

const Stack = createStackNavigator();

import { GestureHandlerRootView } from 'react-native-gesture-handler';

// ... (existing imports)

export default function App() {
  const [initialRoute, setInitialRoute] = useState('Welcome');
  const [isLoading, setIsLoading] = useState(true);
  const setUserId = useUserStore((state) => state.setUserId);
  const setRole = useUserStore((state) => state.setRole);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userStr = await AsyncStorage.getItem('supabase_user');
        const token = await AsyncStorage.getItem('supabase_token');

        if (userStr && token) {
          const user = JSON.parse(userStr);
          setUserId(user.id);

          // Determine role
          const metaRole = user.user_metadata?.role;
          if (metaRole) {
            const appRole = metaRole.toUpperCase() === 'EMPLOYER' ? 'EMPLOYER' : 'SEEKER';
            setRole(appRole);
            setInitialRoute(appRole === 'EMPLOYER' ? 'EmployerMain' : 'Main');
          } else {
            // Default if role unknown, better to go to Main or handle fetch profile
            setRole('SEEKER');
            setInitialRoute('Main');
          }
        }
      } catch (e) {
        console.error("Session Check Error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Subscription" component={SubscriptionScreen} />
            <Stack.Screen name="EmployerOnboarding" component={EmployerOnboardingScreen} />
            <Stack.Screen name="EmployerDashboard" component={EmployerDashboardScreen} />
            <Stack.Screen name="PostJob" component={PostJobScreen} />
            <Stack.Screen name="ScheduleHours" component={ScheduleHoursScreen} />
            <Stack.Screen name="PreviewJob" component={PreviewJobScreen} />
            <Stack.Screen name="ShortlistedCandidates" component={ShortlistedCandidatesScreen} />
            <Stack.Screen name="CandidateProfile" component={CandidateProfileScreen} />
            <Stack.Screen name="ScheduleInterview" component={ScheduleInterviewScreen} />
            <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />

            <Stack.Screen name="AddSkills" component={AddSkillsScreen} />
            <Stack.Screen name="UploadResume" component={UploadResumeScreen} />
            <Stack.Screen name="JobPreferences" component={JobPreferencesScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="EditBusinessInfo" component={EditBusinessInfoScreen} />
            <Stack.Screen name="JobAlerts" component={JobAlertsScreen} />
            <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
            <Stack.Screen name="MapScreen" component={MapScreen} />
            <Stack.Screen name="AIRecommendations" component={AIRecommendationsScreen} />
            <Stack.Screen name="RecentlyViewed" component={RecentlyViewedScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
            <Stack.Screen name="ApplicationSubmitted" component={ApplicationSubmittedScreen} />
            <Stack.Screen name="AppliedJobs" component={AppliedJobsScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen name="EmployerMain" component={EmployerNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
