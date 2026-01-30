export type PatientStatus = 'stable' | 'warning' | 'critical' | 'normal';

export interface Patient {
    id: string;
    name: string;
    age: number;
    room: string;
    condition: string;
    status: PatientStatus;
    admissionDate: string;
    lastEvent?: string;
    notes?: string;
    imageUrl?: string;
}
