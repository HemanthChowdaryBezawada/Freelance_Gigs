import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { alertsService } from '../services/alerts/AlertsService';

interface AlertContextType {
    unreadCount: number;
    refreshAlerts: () => Promise<void>;
}

const AlertContext = createContext<AlertContextType>({
    unreadCount: 0,
    refreshAlerts: async () => { },
});

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);

    const refreshAlerts = useCallback(async () => {
        try {
            const count = await alertsService.getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error('Failed to update alert count:', error);
        }
    }, []);

    // Initial load
    useEffect(() => {
        refreshAlerts();

        // Optional: Poll every 30s to keep it fresh in background
        const interval = setInterval(refreshAlerts, 30000);
        return () => clearInterval(interval);
    }, [refreshAlerts]);

    return (
        <AlertContext.Provider value={{ unreadCount, refreshAlerts }}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlerts = () => useContext(AlertContext);
