import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';
import { adminService } from '../../services/admin/AdminService';
import { useNavigation } from '@react-navigation/native';

export const AddStaffScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<'doctor' | 'nurse' | 'caregiver'>('doctor');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        if (name.trim().length < 2) {
            Alert.alert('Error', 'Name must be at least 2 characters');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        const success = await adminService.addStaffMember({
            full_name: name,
            email: email.toLowerCase().trim(),
            role,
            password: password
        });

        setLoading(false);
        if (success) {
            Alert.alert('Success', 'Staff member added. They can now sign up/login.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert('Error', 'Failed to add staff member');
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
            <Header title="Add Staff Member" showBack />
            <ScrollView contentContainerStyle={styles.content}>
                <Input
                    label="Full Name"
                    placeholder="e.g. Dr. Sarah Smith"
                    value={name}
                    onChangeText={setName}
                />
                <Input
                    label="Email Address"
                    placeholder="sarah@hospital.com"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <Input
                    label="Assign Password"
                    placeholder="Min 6 characters"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <Input
                    label="Confirm Password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                <Text style={styles.label}>Role</Text>
                <View style={styles.roleContainer}>
                    <RoleButton value="doctor" label="Doctor" />
                    <RoleButton value="nurse" label="Nurse" />
                    <RoleButton value="caregiver" label="Caregiver" />
                </View>

                <Button
                    title={loading ? "Saving..." : "Add to Directory"}
                    onPress={handleSave}
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
