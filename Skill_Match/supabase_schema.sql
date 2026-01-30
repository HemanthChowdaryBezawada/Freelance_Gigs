-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE (Linked to auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  role text check (role in ('seeker', 'employer')),
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  
  -- Employer Specific
  company_name text,
  company_website text,
  company_size text,
  location text,
  industry text,
  about_company text,

  -- Seeker Specific
  headline text,
  bio text,
  resume_url text,
  skills text[],
  experience_years int
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone" 
  on profiles for select using (true);

create policy "Users can insert their own profile" 
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile" 
  on profiles for update using (auth.uid() = id);

-- JOBS TABLE
create table public.jobs (
  id uuid default uuid_generate_v4() primary key,
  employer_id uuid references public.profiles(id) not null,
  title text not null,
  description text not null,
  location text,
  salary_range text,
  job_type text, -- 'Full-time', 'Part-time', etc.
  requirements text[],
  status text default 'active', -- 'active', 'closed'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on jobs
alter table public.jobs enable row level security;

-- Policies for jobs
create policy "Jobs are viewable by everyone" 
  on jobs for select using (true);

create policy "Employers can insert/update their own jobs" 
  on jobs for all using (auth.uid() = employer_id);

-- APPLICATIONS TABLE
create table public.applications (
  id uuid default uuid_generate_v4() primary key,
  job_id uuid references public.jobs(id) not null,
  applicant_id uuid references public.profiles(id) not null,
  stuatus text default 'new', -- 'new', 'shortlisted', 'rejected', 'interviewing'
  cover_letter text,
  match_score int, -- AI calculated match score
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on applications
alter table public.applications enable row level security;

-- Policies for applications
create policy "Applicants can view their own applications" 
  on applications for select using (auth.uid() = applicant_id);

create policy "Applicants can insert their own applications" 
  on applications for insert with check (auth.uid() = applicant_id);

create policy "Employers can view applications for their jobs" 
  on applications for select using (
    exists (
      select 1 from public.jobs 
      where jobs.id = applications.job_id 
      and jobs.employer_id = auth.uid()
    )
  );

create policy "Employers can update applications for their jobs" 
  on applications for update using (
    exists (
      select 1 from public.jobs 
      where jobs.id = applications.job_id 
      and jobs.employer_id = auth.uid()
    )
  );

-- SAVED JOBS (Bookmarks)
create table public.saved_jobs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  job_id uuid references public.jobs(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, job_id)
);

-- Enable RLS on saved_jobs
alter table public.saved_jobs enable row level security;

-- Policies for saved_jobs
create policy "Users can view/manage their saved jobs" 
  on saved_jobs for all using (auth.uid() = user_id);

-- TRIGGER TO CREATE PROFILE ON SIGNUP
-- This function mimics the new user in public.profiles table
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'role');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
