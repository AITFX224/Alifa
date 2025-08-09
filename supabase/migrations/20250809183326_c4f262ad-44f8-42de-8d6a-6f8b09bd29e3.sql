-- 1) Enum pour les rôles
create type if not exists public.app_role as enum ('user', 'artisan', 'admin');

-- 2) Table user_roles
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

-- 3) Activer RLS
alter table public.user_roles enable row level security;

-- 4) Fonction pour vérifier les rôles (SECURITY DEFINER)
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

-- S'assurer des permissions d'exécution
revoke all on function public.has_role(uuid, public.app_role) from public;
grant execute on function public.has_role(uuid, public.app_role) to anon, authenticated;

-- 5) Politiques RLS
-- Lire ses propres rôles
create policy if not exists "Users can read their own roles"
  on public.user_roles
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Insérer un rôle pour soi-même (sauf admin)
create policy if not exists "Users can insert their own non-admin roles"
  on public.user_roles
  for insert
  to authenticated
  with check (
    auth.uid() = user_id and role <> 'admin'::public.app_role
  );

-- Supprimer ses propres rôles (sauf admin)
create policy if not exists "Users can delete their own non-admin roles"
  on public.user_roles
  for delete
  to authenticated
  using (
    auth.uid() = user_id and role <> 'admin'::public.app_role
  );

-- (Optionnel) Empêcher toute mise à jour de role, on force à supprimer puis réinsérer
create policy if not exists "No updates on user_roles"
  on public.user_roles
  for update
  to authenticated
  using (false)
  with check (false);
