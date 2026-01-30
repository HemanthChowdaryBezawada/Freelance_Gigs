-- Add Preference Columns to Profiles
alter table public.profiles 
add column if not exists min_salary int,
add column if not exists max_salary int,
add column if not exists preferred_distance int,
add column if not exists preferred_job_type text,
add column if not exists preferred_shift text,
add column if not exists experience_level text;

-- Create Storage Bucket for Resumes
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do nothing;

-- Storage Policies (Allow authenticated users to upload)
create policy "Authenticated users can upload resumes"
on storage.objects for insert
with check ( bucket_id = 'resumes' and auth.role() = 'authenticated' );

create policy "Users can view their own resumes"
on storage.objects for select
using ( bucket_id = 'resumes' and auth.uid() = owner );

create policy "Anyone can view public resumes"
on storage.objects for select
using ( bucket_id = 'resumes' );
