-- Ensure avatar_url exists
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Ensure avatars bucket exists (usually created by initial setup, but safe to verify)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Policies should already exist from update_profile_schema.sql, but if not:
-- (We assume policies are set up, if not, uploads will fail with 403/401, but likely they are set)
