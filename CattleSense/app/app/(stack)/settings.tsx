import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, ScrollView, StatusBar, Alert, ActionSheetIOS, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';

export default function SettingsScreen() {
    const router = useRouter();
    const {
        language, setLanguage,
        offlineMode, toggleOfflineMode,
        autoSync, toggleAutoSync,
        notifications, toggleNotifications,
        darkMode, toggleDarkMode
    } = useSettingsStore();

    const { logout } = useAuthStore();

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: () => {
                        logout();
                        router.replace('/(auth)/login' as any);
                    }
                }
            ]
        );
    };

    const handleLanguageChange = () => {
        Alert.alert(
            "Select Language",
            "Choose your preferred language",
            [
                { text: "English", onPress: () => setLanguage('en') },
                { text: "Hindi", onPress: () => setLanguage('hi') },
                { text: "Gujarati", onPress: () => setLanguage('gu') },
                { text: "Cancel", style: "cancel" }
            ]
        );
    };

    const handleOfflineToggle = (val: boolean) => {
        toggleOfflineMode();
        if (val) {
            Alert.alert("Offline Mode", "App will now work without internet connection. Some features may be limited.");
        }
    };

    const renderItem = (icon: string, label: string, type: 'link' | 'toggle' | 'value', value?: any, onToggle?: (val: boolean) => void, onPress?: () => void) => (
        <TouchableOpacity
            style={styles.item}
            onPress={type !== 'toggle' ? onPress : undefined}
            activeOpacity={type === 'toggle' ? 1 : 0.7}
        >
            <View style={styles.itemLeft}>
                <View style={[styles.iconBox, { backgroundColor: darkMode ? '#333' : '#F5F7FA' }]}>
                    <Ionicons name={icon as any} size={20} color={darkMode ? '#FFF' : "#5B6B7C"} />
                </View>
                <Text style={[styles.itemLabel, darkMode && styles.darkText]}>{label}</Text>
            </View>

            {type === 'toggle' ? (
                <Switch
                    value={value}
                    onValueChange={onToggle}
                    trackColor={{ false: '#767577', true: '#FF8008' }}
                    thumbColor={value ? '#FFF' : '#f4f3f4'}
                />
            ) : type === 'value' ? (
                <View style={styles.valueContainer}>
                    <Text style={styles.valueText}>{value}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#D1D9E6" />
                </View>
            ) : (
                <Ionicons name="chevron-forward" size={20} color="#D1D9E6" />
            )}
        </TouchableOpacity>
    );

    const getLangLabel = () => {
        switch (language) {
            case 'hi': return 'Hindi';
            case 'gu': return 'Gujarati';
            default: return 'English';
        }
    };

    const containerStyle = [styles.container, darkMode && styles.darkContainer];
    const sectionStyle = [styles.section, darkMode && styles.darkSection];

    return (
        <View style={containerStyle}>
            <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
            <SafeAreaView style={styles.safeArea}>

                <View style={[styles.header, darkMode && styles.darkHeader]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={darkMode ? '#FFF' : "#1A2A3A"} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, darkMode && styles.darkText]}>Settings</Text>
                </View>

                <ScrollView contentContainerStyle={styles.content}>

                    <Text style={styles.sectionTitle}>General</Text>
                    <View style={sectionStyle}>
                        {renderItem('earth-outline', 'Language', 'value', getLangLabel(), undefined, handleLanguageChange)}
                        {renderItem('moon-outline', 'Dark Mode', 'toggle', darkMode, toggleDarkMode)}
                    </View>

                    <Text style={styles.sectionTitle}>Sync & Data</Text>
                    <View style={sectionStyle}>
                        {renderItem('cloud-offline-outline', 'Offline Mode', 'toggle', offlineMode, handleOfflineToggle)}
                        {renderItem('sync-outline', 'Auto-Sync Records', 'toggle', autoSync, toggleAutoSync)}
                        {renderItem('save-outline', 'Storage Management', 'link')}
                    </View>

                    <Text style={styles.sectionTitle}>Notifications</Text>
                    <View style={sectionStyle}>
                        {renderItem('notifications-outline', 'Push Notifications', 'toggle', notifications, toggleNotifications)}
                    </View>

                    <Text style={styles.sectionTitle}>Support</Text>
                    <View style={sectionStyle}>
                        {renderItem('information-circle-outline', 'About App', 'link', undefined, undefined, () => router.push('/(stack)/about' as any))}
                        {renderItem('help-circle-outline', 'Help & FAQ', 'link')}
                        {renderItem('warning-outline', 'Report an Issue', 'link')}
                    </View>

                    <TouchableOpacity style={[styles.logoutButton, darkMode && styles.darkSection]} onPress={handleLogout}>
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>

                    <View style={styles.footerInfo}>
                        <Text style={styles.versionText}>Cattle Sense v1.0.0 (Beta)</Text>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    darkContainer: {
        backgroundColor: '#111',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
    },
    darkHeader: {
        backgroundColor: '#1A2A3A',
        borderBottomColor: '#333',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A2A3A',
    },
    darkText: {
        color: '#FFF',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5B6B7C',
        marginBottom: 10,
        marginTop: 20,
        textTransform: 'uppercase',
    },
    section: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        overflow: 'hidden',
    },
    darkSection: {
        backgroundColor: '#1A2A3A',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemLabel: {
        fontSize: 16,
        color: '#1A2A3A',
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    valueText: {
        fontSize: 14,
        color: '#888',
        marginRight: 8,
    },
    logoutButton: {
        marginTop: 40,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 59, 48, 0.1)',
    },
    logoutText: {
        color: '#FF3B30',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footerInfo: {
        alignItems: 'center',
        marginTop: 20,
    },
    versionText: {
        color: '#9AA5B1',
        fontSize: 12,
    },
});
