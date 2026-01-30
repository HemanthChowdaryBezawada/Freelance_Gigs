-- Create recently_viewed table
CREATE TABLE IF NOT EXISTS public.recently_viewed (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE,
    viewed_at timestamptz DEFAULT now(),
    UNIQUE(user_id, job_id)
);

-- Enable RLS
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view own history" ON public.recently_viewed;
CREATE POLICY "Users can view own history" 
ON public.recently_viewed FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own history" ON public.recently_viewed;
CREATE POLICY "Users can insert own history" 
ON public.recently_viewed FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own history" ON public.recently_viewed;
CREATE POLICY "Users can update own history" 
ON public.recently_viewed FOR UPDATE
USING (auth.uid() = user_id);

-- Create a function to upsert recent views (update timestamp if exists, insert if not)
-- Note: Supabase JS upsert handles this, but explicit unique constraint is needed (added above)
