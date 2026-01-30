-- Safely handle the schema fix for applications table
DO $$
BEGIN
    -- 1. Ensure 'status' column exists (it seems it does, but good to be safe)
    -- If it didn't exist, we would rename. Since it exists, we skip rename.
    
    -- 2. Migrate data from 'stuatus' to 'status' if 'stuatus' exists
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='applications' and column_name='stuatus') THEN
        -- Update status with value from stuatus if status is default/null and stuatus has interesting data
        UPDATE public.applications 
        SET status = stuatus 
        WHERE (status IS NULL OR status = 'new') AND stuatus IS NOT NULL;
        
        -- 3. Drop the typo column
        ALTER TABLE public.applications DROP COLUMN "stuatus";
    END IF;
END $$;