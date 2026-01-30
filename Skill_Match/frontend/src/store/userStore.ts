
import { create } from 'zustand';

type Role = 'SEEKER' | 'EMPLOYER' | null;

interface UserStore {
    role: Role;
    userId: string | null;
    setRole: (role: Role) => void;
    setUserId: (id: string | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    role: null,
    userId: null,
    setRole: (role) => set({ role }),
    setUserId: (userId) => set({ userId }),
}));
