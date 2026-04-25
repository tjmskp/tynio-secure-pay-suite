
-- updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- user_keys: stores per-user PBKDF2 salt
create table public.user_keys (
  user_id uuid primary key references auth.users(id) on delete cascade,
  salt text not null,
  created_at timestamptz not null default now()
);

alter table public.user_keys enable row level security;

create policy "Users can view their own salt"
  on public.user_keys for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own salt"
  on public.user_keys for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own salt"
  on public.user_keys for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own salt"
  on public.user_keys for delete
  to authenticated
  using (auth.uid() = user_id);

-- vault_entries: encrypted password records
create table public.vault_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  username text,
  url text,
  notes text,
  password_ciphertext text not null,
  password_iv text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index vault_entries_user_id_idx on public.vault_entries(user_id);

alter table public.vault_entries enable row level security;

create policy "Users can view their own entries"
  on public.vault_entries for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own entries"
  on public.vault_entries for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own entries"
  on public.vault_entries for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own entries"
  on public.vault_entries for delete
  to authenticated
  using (auth.uid() = user_id);

create trigger vault_entries_set_updated_at
  before update on public.vault_entries
  for each row execute function public.set_updated_at();
