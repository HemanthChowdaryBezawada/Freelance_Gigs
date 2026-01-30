import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Plus, User, Trash2, LogOut, Pen } from 'lucide-react-native';
import { adminService, StaffMember } from '../../services/admin/AdminService';
import { authService } from '../../services/AuthService';

export const AdminDashboardScreen = () => {
    const navigation = useNavigation<any>();
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadStaff = async () => {
        const data = await adminService.getStaffList();
        setStaff(data);
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadStaff();
        }, [])
    );

    const handleLogout = () => {
        Alert.alert('Log Out', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log Out',
                style: 'destructive',
                onPress: async () => {
                    await authService.signOut();
                    navigation.replace('Login');
                }
            }
        ]);
    };

    const handleDelete = (id: string, name: string) => {
        Alert.alert('Remove Staff', `Remove ${name}?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Remove',
                style: 'destructive',
                onPress: async () => {
                    const success = await adminService.removeStaffMember(id);
                    if (success) loadStaff();
                    else Alert.alert('Error', 'Failed to remove user');
                }
            }
        ]);
    };

    const renderItem = ({ item }: { item: StaffMember }) => (
        <View style={styles.card}>
            <View style={styles.iconBox}>
                <User size={24} color={colors.primary} />
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{item.full_name}</Text>
                <Text style={styles.email}>{item.email}</Text>
                <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>{item.role.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity onPress={() => navigation.navigate('EditStaff', { staff: item })} style={styles.actionBtn}>
                    <Pen size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id, item.full_name)} style={styles.actionBtn}>
                    <Trash2 size={20} color={colors.error} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Admin Dashboard</Text>
                    <Text style={styles.subtitle}>Manage Organization Staff</Text>
                </View>
                <TouchableOpacity onPress={handleLogout}>
                    <LogOut size={24} color={colors.error} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={staff}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadStaff(); }} />}
                ListEmptyComponent={<Text style={styles.empty}>No staff members found. Add one!</Text>}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddStaff')}
            >
                <Plus size={32} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: spacing.m,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceVariant,
    },
    title: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.sizes.h3,
        color: colors.text.primary,
    },
    subtitle: {
        color: colors.text.secondary,
        fontSize: typography.sizes.bodySmall,
    },
    list: {
        padding: spacing.m,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.m,
        borderRadius: layout.borderRadius.m,
        marginBottom: spacing.m,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.m,
    },
    info: {
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionBtn: {
        marginLeft: spacing.m,
        padding: 4,
    },
    name: {
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        fontSize: 16,
    },
    email: {
        color: colors.text.secondary,
        fontSize: 14,
        marginBottom: 4,
    },
    roleBadge: {
        backgroundColor: colors.surfaceVariant,
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    roleText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.primaryDark,
    },
    empty: {
        textAlign: 'center',
        marginTop: 50,
        color: colors.text.tertiary,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    }
});
