
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://yqdzwruwcgsigxmofftt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxZHp3cnV3Y2dzaWd4bW9mZnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NzE2OTYsImV4cCI6MjA4NDI0NzY5Nn0.2U5GoONA3URwqmqeN3U9plWm6ajAtxmG4bKZxPK4NMI';

export const ManualSupabase = {
    async signUp(email: string, password: string, data: any) {
        try {
            console.log('Manual Signup Request:', email);
            const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    data
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.msg || responseData.error_description || responseData.message || 'Signup failed');
            }

            // Save session if available
            if (responseData.access_token) {
                await AsyncStorage.setItem('supabase_token', responseData.access_token);
                await AsyncStorage.setItem('supabase_user', JSON.stringify(responseData.user));
            }

            return { data: { user: responseData }, error: null };
        } catch (error: any) {
            console.error('Manual Signup Error:', error);
            return { data: null, error };
        }
    },

    async signIn(email: string, password: string) {
        try {
            const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error_description || responseData.msg || 'Login failed');
            }

            if (responseData.access_token) {
                await AsyncStorage.setItem('supabase_token', responseData.access_token);
                await AsyncStorage.setItem('supabase_user', JSON.stringify(responseData.user));
            }

            return { data: { user: responseData.user, session: responseData }, error: null };
        } catch (error: any) {
            return { data: null, error };
        }
    },

    async updatePassword(password: string) {
        try {
            const token = await AsyncStorage.getItem('supabase_token');

            const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
                method: 'PUT',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.msg || responseData.error_description || 'Update failed');
            }

            return { data: responseData, error: null };
        } catch (error: any) {
            return { data: null, error };
        }
    },

    async resetPasswordForEmail(email: string) {
        try {
            const response = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.msg || responseData.error_description || 'Reset failed');
            }

            return { data: responseData, error: null };
        } catch (error: any) {
            return { data: null, error };
        }
    }
};
