import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://yqdzwruwcgsigxmofftt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxZHp3cnV3Y2dzaWd4bW9mZnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NzE2OTYsImV4cCI6MjA4NDI0NzY5Nn0.2U5GoONA3URwqmqeN3U9plWm6ajAtxmG4bKZxPK4NMI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
    global: {
        fetch: (url, options) => {
            console.log('--- SUPABASE INTERNAL FETCH ---');
            console.log('URL:', url);
            console.log('Method:', options?.method);
            // console.log('Headers:', JSON.stringify(options?.headers));
            return fetch(url, options);
        },
    },
});
