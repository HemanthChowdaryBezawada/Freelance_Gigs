import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// REPLACE THESE WITH YOUR ACTUAL SUPABASE CREDENTIALS
// You can find them in your Supabase Dashboard -> Project Settings -> API
const SUPABASE_URL = 'https://tckrpeubmnxmlrmdnypo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRja3JwZXVibW54bWxybWRueXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjg3MTUsImV4cCI6MjA4NDg0NDcxNX0.ns-Wo1O7kQARBk_Xjs7R7LvT6kRNgwbJJcRdjiJdEuw';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRja3JwZXVibW54bWxybWRueXBvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI2ODcxNSwiZXhwIjoyMDg0ODQ0NzE1fQ.jIirYFXNWTz1ogo4nN1omGq2CVMfa8cUm7qewkPxIIU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
