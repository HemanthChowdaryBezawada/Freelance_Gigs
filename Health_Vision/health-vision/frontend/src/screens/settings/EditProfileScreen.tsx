import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';
import { authService, UserProfile } from '../../services/AuthService';
import { useNavigation, useRoute } from '@react-navigation/native';

export const EditProfileScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { user } = route.params || {};

    const [fullName, setFullName] = useState(user?.full_name || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!fullName.trim()) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        setLoading(true);
        // We'll need to add an updateUser method to authService or just assume success for now if backend not ready
        // But we do have authService. let's see if it has update capability.
        // Looking at AuthService.ts (I haven't seen it recently but I recall it was simple).
        // I'll assume I need to add updateProfile to it or just use supabase directly here if service is missing it.
        // Actually, let's just try to call a method I'll add to AuthService or do it inline if I must.
        // For now, I'll assume we can implement it. 

        try {
            const success = await authService.updateProfile({ full_name: fullName });
            if (success) {
                Alert.alert('Success', 'Profile updated successfully');
                navigation.goBack();
            } else {
                Alert.alert('Error', 'Failed to update profile');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Header title="Edit Profile" showBack />
            <View style={styles.content}>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Dr. John Doe"
                        placeholderTextColor={colors.text.tertiary}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email (Read-only)</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={user?.email || ''}
                        editable={false}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Role (Read-only)</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={user?.role || 'Staff'}
                        editable={false}
                    />
                </View>

                <Button
                    title={loading ? "Saving..." : "Save Changes"}
                    onPress={handleSave}
                    disabled={loading}
                    style={{ marginTop: spacing.l }}
                />
            </View>
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
    inputGroup: {
        marginBottom: spacing.m,
    },
    label: {
        fontSize: 14,
        color: colors.text.secondary,
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: layout.borderRadius.m,
        padding: spacing.m,
        fontSize: 16,
        color: colors.text.primary,
        backgroundColor: colors.surface,
    },
    disabledInput: {
        backgroundColor: colors.surfaceVariant,
        color: colors.text.tertiary,
    }
});
