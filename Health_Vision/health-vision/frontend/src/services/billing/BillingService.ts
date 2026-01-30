import AsyncStorage from '@react-native-async-storage/async-storage';

const PREMIUM_KEY = 'is_premium_user';

export const BillingService = {
    // Check if user is premium
    isPremium: async (): Promise<boolean> => {
        try {
            const value = await AsyncStorage.getItem(PREMIUM_KEY);
            return value === 'true';
        } catch (e) {
            console.error('Failed to check premium status', e);
            return false;
        }
    },

    // Purchase Premium (Mock)
    purchasePremium: async (): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(async () => {
                try {
                    await AsyncStorage.setItem(PREMIUM_KEY, 'true');
                    resolve(true); // Success
                } catch (e) {
                    resolve(false);
                }
            }, 2000); // Fake delay
        });
    },

    // Reset Purchase (For debugging)
    resetPurchase: async () => {
        await AsyncStorage.removeItem(PREMIUM_KEY);
    }
};
