
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Lock, Shield, Trash2, ChevronRight, LogOut, Moon, AlertCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = ({ navigation }: any) => {
    const { theme, toggleTheme, colors } = useTheme();

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        await AsyncStorage.clear();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }
                }
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => console.log("Delete Account") }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.headerBackground, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color={colors.text} size={24} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Appearance Section */}
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <Text style={styles.sectionTitle}>Appearance</Text>
                    <View style={[styles.row, { borderBottomWidth: 0, borderBottomColor: colors.border }]}>
                        <View style={styles.rowIcon}>
                            <Moon size={20} color={colors.textSecondary} />
                        </View>
                        <Text style={[styles.rowText, { color: colors.text }]}>Dark Mode</Text>
                        <Switch
                            value={theme === 'dark'}
                            onValueChange={toggleTheme}
                            trackColor={{ false: '#767577', true: colors.primary }}
                            thumbColor={theme === 'dark' ? '#f4f3f4' : '#f4f3f4'}
                        />
                    </View>
                </View>

                {/* Security Section */}
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <Text style={styles.sectionTitle}>Security</Text>
                    <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]} onPress={() => navigation.navigate('ChangePassword')}>
                        <View style={styles.rowIcon}>
                            <Lock size={20} color={colors.textSecondary} />
                        </View>
                        <Text style={[styles.rowText, { color: colors.text }]}>Change Password</Text>
                        <ChevronRight size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.row, { borderBottomWidth: 0 }]} onPress={() => navigation.navigate('PrivacyPolicy')}>
                        <View style={styles.rowIcon}>
                            <Shield size={20} color={colors.textSecondary} />
                        </View>
                        <Text style={[styles.rowText, { color: colors.text }]}>Privacy Policy</Text>
                        <ChevronRight size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Account Section */}
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]} onPress={handleLogout}>
                        <View style={styles.rowIcon}>
                            <LogOut size={20} color="#EF4444" />
                        </View>
                        <Text style={[styles.rowText, { color: '#EF4444' }]}>Logout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.row, { borderBottomWidth: 0 }]} onPress={handleDeleteAccount}>
                        <View style={styles.rowIcon}>
                            <Trash2 size={20} color="#EF4444" />
                        </View>
                        <Text style={[styles.rowText, { color: '#EF4444' }]}>Delete Account</Text>
                    </TouchableOpacity>
                </View>

                {/* Support Section */}
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <TouchableOpacity style={[styles.row, { borderBottomWidth: 0 }]} onPress={() => navigation.navigate('HelpSupport')}>
                        <View style={styles.rowIcon}>
                            <AlertCircle size={20} color={colors.textSecondary} />
                        </View>
                        <Text style={[styles.rowText, { color: colors.text }]}>Help & Support</Text>
                        <ChevronRight size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor handled dynamically
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        borderRadius: 16,
        marginBottom: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    rowIcon: {
        marginRight: 16,
    },
    rowText: {
        flex: 1,
        fontSize: 16,
    },
});

export default SettingsScreen;
