do $$
begin
  if not exists (select 1 from pg_type where typname = 'customer_status') then
    create type public.customer_status as enum (
      'INTERESTED',
      'FOLLOW_UP',
      'PURCHASED',
      'NOT_PAID',
      'NOT_INTERESTED'
    );
  end if;
end
$$;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  social_link text,
  status public.customer_status not null default 'INTERESTED',
  interested_service text,
  paid_amount numeric(12, 2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_customers_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists customers_set_updated_at on public.customers;

create trigger customers_set_updated_at
before update on public.customers
for each row
execute function public.set_customers_updated_at();

alter table public.customers enable row level security;

grant select, insert, update, delete on table public.customers to anon, authenticated;

drop policy if exists "Allow public read customers" on public.customers;
create policy "Allow public read customers"
on public.customers
for select
to anon, authenticated
using (true);

drop policy if exists "Allow public insert customers" on public.customers;
create policy "Allow public insert customers"
on public.customers
for insert
to anon, authenticated
with check (true);

drop policy if exists "Allow public update customers" on public.customers;
create policy "Allow public update customers"
on public.customers
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Allow public delete customers" on public.customers;
create policy "Allow public delete customers"
on public.customers
for delete
to anon, authenticated
using (true);
