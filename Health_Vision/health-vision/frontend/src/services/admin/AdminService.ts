import { supabase, supabaseAdmin } from '../../lib/supabase';

export interface StaffMember {
    id: string; // This will now match the Auth User ID
    email: string;
    full_name: string;
    role: 'doctor' | 'nurse' | 'caregiver' | 'admin';
    created_at?: string;
}

export const adminService = {
    async getStaffList(): Promise<StaffMember[]> {
        const { data, error } = await supabase
            .from('staff_directory')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching staff:', error);
            return [];
        }
        return data as StaffMember[];
    },

    async addStaffMember(staff: Omit<StaffMember, 'id' | 'created_at'> & { password?: string }): Promise<boolean> {
        try {
            // 1. Create User in Supabase Auth
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: staff.email,
                password: staff.password || 'TempPass123!', // Default if not provided
                email_confirm: true,
                user_metadata: { full_name: staff.full_name }
            });

            if (authError || !authData.user) {
                console.error('Auth Create Error:', authError);
                return false;
            }

            const userId = authData.user.id;

            // 2. Add to Staff Directory (using Auth ID as primary key)
            const { error: dbError } = await supabase
                .from('staff_directory')
                .insert([{
                    id: userId,
                    email: staff.email,
                    full_name: staff.full_name,
                    role: staff.role
                }]);

            if (dbError) {
                console.error('DB Insert Error:', dbError);
                // Rollback: Delete the auth user if DB insert fails
                await supabaseAdmin.auth.admin.deleteUser(userId);
                return false;
            }

            // 3. Add to Profiles Table (For role checking on login)
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{
                    id: userId,
                    email: staff.email,
                    full_name: staff.full_name,
                    role: staff.role
                }]);

            if (profileError) {
                console.error('Profile Insert Error:', profileError);
                // Non-critical, but good to know
            }

            return true;
        } catch (e) {
            console.error('Unexpected Error:', e);
            return false;
        }
    },

    async updateStaffMember(id: string, updates: Partial<StaffMember> & { password?: string }): Promise<boolean> {
        try {
            // 1. Update Auth (Password) if provided
            if (updates.password) {
                const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
                    id,
                    { password: updates.password }
                );
                if (authError) {
                    console.error('Auth Update Error:', authError);
                    return false;
                }
            }

            // 2. Update Database
            const { password, ...dbUpdates } = updates;
            const { error: dbError } = await supabase
                .from('staff_directory')
                .update(dbUpdates)
                .eq('id', id);

            // 3. Sync Profile
            if (dbUpdates.role || dbUpdates.full_name) {
                await supabase
                    .from('profiles')
                    .update(dbUpdates)
                    .eq('id', id);
            }

            if (dbError) {
                console.error('DB Update Error:', dbError);
                return false;
            }

            return true;
        } catch (e) {
            console.error('Unexpected Error:', e);
            return false;
        }
    },

    async removeStaffMember(id: string): Promise<boolean> {
        try {
            // 1. Delete from Auth (Cascading might need manual cleanup depending on DB constraints)
            const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

            if (authError) {
                // Ignore "User not found" error (might happen for legacy test data)
                // We still want to remove them from the directory
                if (!authError.message.includes('User not found') && !authError.message.includes('resource not found')) {
                    console.error('Auth Delete Error:', authError);
                    return false;
                }
            }

            // 2. Delete from Staff Directory
            const { error: dbError } = await supabase
                .from('staff_directory')
                .delete()
                .eq('id', id);

            if (dbError) {
                console.error('DB Delete Error:', dbError);
                return false;
            }

            // 3. Delete from Profiles 
            await supabase.from('profiles').delete().eq('id', id);

            return true;
        } catch (e) {
            console.error('Unexpected Error:', e);
            return false;
        }
    }
};
