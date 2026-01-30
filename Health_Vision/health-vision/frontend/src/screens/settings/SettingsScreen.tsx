import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Header } from '../../components/Header';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';
import { User, Bell, Shield, CircleHelp, LogOut, ChevronRight, Moon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../../services/AuthService';

const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
);

const SettingItem = ({
    icon,
    label,
    value,
    onToggle,
    onPress,
    subLabel
}: {
    icon: React.ReactNode,
    label: string,
    value?: boolean,
    onToggle?: (val: boolean) => void,
    onPress?: () => void,
    subLabel?: string
}) => (
    <TouchableOpacity
        style={styles.settingItem}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.7}
    >
        <View style={styles.iconContainer}>
            {icon}
        </View>
        <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>{label}</Text>
            {subLabel && <Text style={styles.settingSubLabel}>{subLabel}</Text>}
        </View>
        {onToggle !== undefined ? (
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: colors.surfaceVariant, true: colors.primaryLight }}
                thumbColor={value ? colors.primary : '#f4f3f4'}
            />
        ) : (
            <ChevronRight size={20} color={colors.text.tertiary} />
        )}
    </TouchableOpacity>
);

export const SettingsScreen = () => {
    const navigation = useNavigation<any>();
    const [user, setUser] = useState<any>(null);

    React.useEffect(() => {
        const loadUser = async () => {
            const data = await authService.getCurrentUser();
            setUser(data);
        };
        const unsubscribe = navigation.addListener('focus', loadUser);
        return unsubscribe;
    }, [navigation]);

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: async () => {
                        await authService.signOut();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }
                }
            ]
        );
    };

    const handleChangePassword = () => {
        Alert.alert(
            "Change Password",
            "For security reasons, please contact your System Administrator to reset your password."
        );
    };

    return (
        <View style={styles.container}>
            <Header title="Settings" />
            <ScrollView contentContainerStyle={styles.content}>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{(user?.full_name || 'U').charAt(0)}</Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{user?.full_name || 'Loading...'}</Text>
                        <Text style={styles.profileRole}>{user?.role || 'Staff'}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate('EditProfile', { user })}
                    >
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                </View>

                {/* Preferences Section REMOVED as requested */}

                {/* Premium Banner */}
                <TouchableOpacity
                    style={styles.premiumBanner}
                    onPress={() => navigation.navigate('Subscription')}
                >
                    <View style={styles.premiumContent}>
                        <Text style={styles.premiumTitle}>Upgrade to Premium ✨</Text>
                        <Text style={styles.premiumSubtitle}>Unlock exclusive AI features</Text>
                    </View>
                    <ChevronRight size={20} color="#FFD700" />
                </TouchableOpacity>

                <SectionHeader title="Account Security" />
                <SettingItem
                    icon={<User size={20} color={colors.text.primary} />}
                    label="Change Password"
                    onPress={handleChangePassword}
                />

                <SectionHeader title="Support" />
                <SettingItem
                    icon={<CircleHelp size={20} color={colors.text.primary} />}
                    label="Help & FAQ"
                    onPress={() => navigation.navigate('HelpSupport')}
                />

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <LogOut size={20} color={colors.error} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>v1.0.0 (Build 124)</Text>

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
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.m,
        borderRadius: layout.borderRadius.l,
        marginBottom: spacing.l,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.m,
    },
    avatarText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.sizes.bodyLarge,
        color: colors.text.primary,
    },
    profileRole: {
        color: colors.text.secondary,
        fontSize: typography.sizes.bodySmall,
    },
    editButton: {
        backgroundColor: colors.surfaceVariant,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    editText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text.tertiary,
        marginBottom: spacing.s,
        marginTop: spacing.s,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceVariant,
    },
    iconContainer: {
        width: 32,
        alignItems: 'center',
        marginRight: spacing.s,
    },
    settingContent: {
        flex: 1,
    },
    settingLabel: {
        fontSize: typography.sizes.body,
        color: colors.text.primary,
    },
    settingSubLabel: {
        fontSize: 12,
        color: colors.text.secondary,
        marginTop: 2,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.xl,
        padding: spacing.m,
    },
    logoutText: {
        color: colors.error,
        fontWeight: 'bold',
        marginLeft: spacing.s,
        fontSize: typography.sizes.body,
    },
    versionText: {
        textAlign: 'center',
        color: colors.text.tertiary,
        fontSize: 10,
        marginTop: spacing.xl,
    },
    premiumBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        padding: spacing.m,
        borderRadius: layout.borderRadius.l,
        marginBottom: spacing.l,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.3)',
    },
    premiumContent: {
        flex: 1,
    },
    premiumTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 2,
    },
    premiumSubtitle: {
        fontSize: 12,
        color: colors.text.secondary,
    },
});
