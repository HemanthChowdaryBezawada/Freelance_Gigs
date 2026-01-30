import { supabase } from '../../lib/supabase';

export interface AlertLog {
    id: string;
    patientId: string;
    patientName: string;
    type: string;
    severity: 'critical' | 'warning' | 'info';
    timestamp: string;
    updatedAt: string; // Tracks resolution time
    status: 'new' | 'acknowledged' | 'resolved';
    description?: string;
    snapshotUrl?: string; // URL to image/video frame
}

export const alertsService = {
    async getAlerts(): Promise<AlertLog[]> {
        const { data, error } = await supabase
            .from('alerts')
            .select(`
                *,
                patients (
                    full_name
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching alerts:', error);
            return [];
        }

        return data.map((alert: any) => ({
            id: alert.id,
            patientId: alert.patient_id,
            patientName: alert.patients?.full_name || 'Unknown',
            type: alert.type,
            severity: alert.severity,
            timestamp: alert.created_at,
            updatedAt: alert.updated_at, // Real DB timestamp
            status: alert.status,
            description: alert.description
        }));
    },

    async getUnreadCount(): Promise<number> {
        const { count, error } = await supabase
            .from('alerts')
            .select('*', { count: 'exact', head: true })
            .neq('status', 'resolved');

        if (error) {
            console.error('Error counting alerts:', error);
            return 0;
        }
        return count || 0;
    },

    async createAlert(alert: { patient_id: string, type: string, severity: string, description?: string }): Promise<boolean> {
        const { error } = await supabase
            .from('alerts')
            .insert([{
                ...alert,
                status: 'new'
            }]);

        if (error) {
            console.error('Error creating alert:', error);
            return false;
        }
        return true;
    },

    async resolveAlert(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('alerts')
            .update({
                status: 'resolved',
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) return false;
        return true;
    }
};
