grant update, delete on table public.customers to anon, authenticated;

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
