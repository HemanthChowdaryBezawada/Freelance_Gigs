import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

export interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    role?: string;
}

export const authService = {

    async signIn(email: string, password: string): Promise<boolean> {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                Alert.alert('Login Failed', error.message);
                return false;
            }

            return !!data.session;
        } catch (e: any) {
            Alert.alert('Error', e.message);
            return false;
        }
    },

    async signOut(): Promise<void> {
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert('Error Signing Out', error.message);
        }
    },

    async getCurrentUser(): Promise<UserProfile | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email) {
            return {
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || 'Staff',
                role: user.user_metadata?.role || 'user',
            };
        }
        return null;
    },

    async updateProfile(updates: { full_name: string }): Promise<boolean> {
        const { error } = await supabase.auth.updateUser({
            data: { full_name: updates.full_name }
        });

        if (error) {
            console.error('Error updating profile:', error);
            return false;
        }
        return true;
    }
};
