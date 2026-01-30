-- Rename the misspelled column 'stuatus' to 'status'
DO $$
BEGIN
  IF EXISTS(SELECT *
    FROM information_schema.columns
    WHERE table_name='applications' and column_name='stuatus')
  THEN
      ALTER TABLE public.applications RENAME COLUMN "stuatus" TO "status";
  END IF;
END $$;
