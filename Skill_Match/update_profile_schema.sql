-- Add Phone Column to Profiles
alter table public.profiles 
add column if not exists phone text;

-- Create Storage Bucket for Avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Storage Policies for Avatars
create policy "Authenticated users can upload avatars"
on storage.objects for insert
with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

create policy "Users can update their own avatars"
on storage.objects for update
using ( bucket_id = 'avatars' and auth.uid() = owner );

create policy "Anyone can view public avatars"
on storage.objects for select
using ( bucket_id = 'avatars' );
