-- Add user_id column to applications table if it doesn't exist
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add other potentially missing columns based on usage
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS applied_at timestamptz DEFAULT now();

-- Ensure RLS is enabled
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own applications
DROP POLICY IF EXISTS "Users can view own applications" ON public.applications;
CREATE POLICY "Users can view own applications" 
ON public.applications FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own applications
DROP POLICY IF EXISTS "Users can apply to jobs" ON public.applications;
CREATE POLICY "Users can apply to jobs" 
ON public.applications FOR INSERT 
WITH CHECK (auth.uid() = user_id);
