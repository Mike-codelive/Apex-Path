alter table storage.objects enable row level security;

drop policy if exists resumes_select_own on storage.objects;
create policy resumes_select_own on storage.objects
  for select to authenticated
  using (
    bucket = 'resumes'
    and split_part(key, '/', 1) = auth.uid()::text
  );

drop policy if exists resumes_insert_own on storage.objects;
create policy resumes_insert_own on storage.objects
  for insert to authenticated
  with check (
    bucket = 'resumes'
    and split_part(key, '/', 1) = auth.uid()::text
  );

drop policy if exists resumes_update_own on storage.objects;
create policy resumes_update_own on storage.objects
  for update to authenticated
  using (
    bucket = 'resumes'
    and split_part(key, '/', 1) = auth.uid()::text
  )
  with check (
    bucket = 'resumes'
    and split_part(key, '/', 1) = auth.uid()::text
  );

drop policy if exists resumes_delete_own on storage.objects;
create policy resumes_delete_own on storage.objects
  for delete to authenticated
  using (
    bucket = 'resumes'
    and split_part(key, '/', 1) = auth.uid()::text
  );
