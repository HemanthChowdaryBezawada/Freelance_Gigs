import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
    language: 'en' | 'hi' | 'gu';
    offlineMode: boolean;
    autoSync: boolean;
    notifications: boolean;
    darkMode: boolean;

    setLanguage: (lang: 'en' | 'hi' | 'gu') => void;
    toggleOfflineMode: () => void;
    toggleAutoSync: () => void;
    toggleNotifications: () => void;
    toggleDarkMode: () => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            language: 'en',
            offlineMode: false,
            autoSync: true,
            notifications: true,
            darkMode: false,

            setLanguage: (lang) => set({ language: lang }),
            toggleOfflineMode: () => set((state) => ({ offlineMode: !state.offlineMode })),
            toggleAutoSync: () => set((state) => ({ autoSync: !state.autoSync })),
            toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
            toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
        }),
        {
            name: 'settings-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
