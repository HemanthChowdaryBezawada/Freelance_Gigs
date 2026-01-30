-- Add missing columns to jobs table
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS company_name text,
ADD COLUMN IF NOT EXISTS skills text[],
ADD COLUMN IF NOT EXISTS benefits text[],
ADD COLUMN IF NOT EXISTS hours_per_week text,
ADD COLUMN IF NOT EXISTS shift_preference text,
ADD COLUMN IF NOT EXISTS start_date text,
ADD COLUMN IF NOT EXISTS is_flexible boolean DEFAULT false;
