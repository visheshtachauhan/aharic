-- Create a function to manage storage policies
create or replace function create_storage_policy(
  bucket_name text,
  policy_name text,
  policy_definition jsonb
)
returns void
language plpgsql
security definer
as $$
begin
  -- Create the policy if it doesn't exist
  if not exists (
    select 1
    from pg_policies
    where tablename = bucket_name
    and policyname = policy_name
  ) then
    execute format(
      'create policy %I on storage.objects for %s using (bucket_id = %L)',
      policy_name,
      policy_definition->>'operation',
      bucket_name
    );
  end if;
end;
$$;

-- Create the menu-images bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do update 
set public = true;

-- Create policies for the menu-images bucket
select create_storage_policy(
  'menu-images',
  'Public Access',
  '{"role": "anon", "operation": "SELECT"}'::jsonb
);

select create_storage_policy(
  'menu-images',
  'Authenticated Upload',
  '{"role": "authenticated", "operation": "INSERT"}'::jsonb
);

select create_storage_policy(
  'menu-images',
  'Authenticated Update',
  '{"role": "authenticated", "operation": "UPDATE"}'::jsonb
);

select create_storage_policy(
  'menu-images',
  'Authenticated Delete',
  '{"role": "authenticated", "operation": "DELETE"}'::jsonb
); 