import { supabase } from '../lib/supabase';

export interface Patient {
    id: string;
    full_name: string;
    age: number;
    gender: string;
    room_number: string;
    condition: string;
    status: 'active' | 'discharged';
    notes?: string;
    admission_date?: string;
}

export const patientService = {
    async getPatients(): Promise<Patient[]> {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('status', 'active') // Only get active patients by default
            .order('admission_date', { ascending: false });

        if (error) {
            console.error('Error fetching patients:', error);
            return [];
        }
        return data as Patient[];
    },

    async getPatientById(id: string): Promise<Patient | null> {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching patient details:', error);
            return null;
        }
        return data as Patient;
    },

    async getPatientCount(): Promise<number> {
        const { count, error } = await supabase
            .from('patients')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active');

        if (error) {
            console.error('Error counting patients:', error);
            return 0;
        }
        return count || 0;
    },

    async addPatient(patient: Omit<Patient, 'id' | 'admission_date' | 'status'>): Promise<boolean> {
        const { error } = await supabase
            .from('patients')
            .insert([{
                ...patient,
                status: 'active'
            }]);

        if (error) {
            console.error('Error adding patient:', error);
            return false;
        }
        return true;
    },

    async updatePatient(id: string, updates: Partial<Patient>): Promise<boolean> {
        const { error } = await supabase
            .from('patients')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating patient:', error);
            return false;
        }
        return true;
    }
};
