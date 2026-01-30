import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
// import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env'; // Or use string constants if not using dotenv yet

// TODO: User needs to provide these keys. For now, we will use placeholders.
// Once keys are provided, we will update these constants or switch to .env
const SUPABASE_URL = 'https://xyz.supabase.co';
const SUPABASE_ANON_KEY = 'public-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: {
            // Custom storage implementation for React Native (AsyncStorage) would go here
            // For partial implementation we can leave default or use null for now and add AsyncStorage later
            getItem: (key) => null,
            setItem: (key, value) => { },
            removeItem: (key) => { },
        },
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
