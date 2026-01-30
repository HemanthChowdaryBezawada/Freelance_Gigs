import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';
import { adminService, StaffMember } from '../../services/admin/AdminService';
import { useNavigation, useRoute } from '@react-navigation/native';

export const EditStaffScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { staff } = route.params as { staff: StaffMember };

    const [name, setName] = useState(staff.full_name);
    // Email is usually not editable easily because it's linked to Auth. 
    // For MVP, we effectively just update display name and role.
    const [role, setRole] = useState(staff.role);
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (!name) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        if (newPassword && newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        const success = await adminService.updateStaffMember(staff.id, {
            full_name: name,
            role,
            password: newPassword || undefined
        });

        setLoading(false);
        if (success) {
            Alert.alert('Success', 'Staff member updated', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert('Error', 'Failed to update staff member');
        }
    };

    const RoleButton = ({ value, label }: { value: string, label: string }) => (
        <TouchableOpacity
            style={[styles.roleBtn, role === value && styles.roleBtnActive]}
            onPress={() => setRole(value as any)}
        >
            <Text style={[styles.roleText, role === value && styles.roleTextActive]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Header title="Edit Staff Member" showBack />
            <ScrollView contentContainerStyle={styles.content}>
                <Input
                    label="Email Address"
                    value={staff.email}
                    editable={false}
                    selectTextOnFocus={false}
                    style={{ opacity: 0.6, backgroundColor: colors.surfaceVariant }}
                />

                <Input
                    label="Full Name"
                    value={name}
                    onChangeText={setName}
                />

                <Input
                    label="Reset Password (Optional)"
                    placeholder="Enter new password to reset"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                />

                <Text style={styles.label}>Role</Text>
                <View style={styles.roleContainer}>
                    <RoleButton value="doctor" label="Doctor" />
                    <RoleButton value="nurse" label="Nurse" />
                    <RoleButton value="caregiver" label="Caregiver" />
                </View>

                <Button
                    title={loading ? "Updating..." : "Update Profile"}
                    onPress={handleUpdate}
                    disabled={loading}
                    style={{ marginTop: spacing.l }}
                />
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
    label: {
        fontSize: 14,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
        fontWeight: '500',
    },
    roleContainer: {
        flexDirection: 'row',
        gap: spacing.s,
        marginBottom: spacing.m,
    },
    roleBtn: {
        flex: 1,
        padding: spacing.m,
        borderRadius: layout.borderRadius.m,
        borderWidth: 1,
        borderColor: colors.surfaceVariant,
        alignItems: 'center',
    },
    roleBtnActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '10',
    },
    roleText: {
        color: colors.text.secondary,
        fontWeight: '600',
    },
    roleTextActive: {
        color: colors.primary,
    }
});
