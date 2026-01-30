import { Patient } from '../../types/Patient';

export const MOCK_PATIENTS: Patient[] = [
    {
        id: '1',
        name: 'Martha Evans',
        room: '304',
        age: 72,
        condition: 'Post-Surgery',
        status: 'critical',
        admissionDate: '2025-12-10',
        lastEvent: 'Fall detected 2m ago',
        notes: 'Patient tends to get out of bed without assistance.'
    },
    {
        id: '2',
        name: 'John Doe',
        room: '201',
        age: 65,
        condition: 'Observation',
        status: 'stable',
        admissionDate: '2026-01-05',
        lastEvent: 'Normal activity'
    },
    {
        id: '3',
        name: 'Alice Smith',
        room: '105',
        age: 81,
        condition: 'Dementia',
        status: 'warning',
        admissionDate: '2025-11-20',
        lastEvent: 'Agitation detected',
        notes: 'High fall risk. Requires constant monitoring.'
    },
    {
        id: '4',
        name: 'Robert Brown',
        room: '102',
        age: 55,
        condition: 'Cardiac Care',
        status: 'stable',
        admissionDate: '2026-01-12',
        lastEvent: 'Resting'
    },
    {
        id: '5',
        name: 'Emily White',
        room: '305',
        age: 68,
        condition: 'Recovery',
        status: 'stable',
        admissionDate: '2026-01-15',
        lastEvent: 'Walking'
    },
];
