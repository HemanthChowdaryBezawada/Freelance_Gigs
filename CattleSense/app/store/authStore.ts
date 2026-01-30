import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
    userMobile: string | null;
    isLoggedIn: boolean;
    login: (mobile: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            userMobile: null,
            isLoggedIn: false,
            login: (mobile) => set({ userMobile: mobile, isLoggedIn: true }),
            logout: () => set({ userMobile: null, isLoggedIn: false }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
