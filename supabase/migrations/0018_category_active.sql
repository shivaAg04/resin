-- Categories can be switched off from the admin, like products. An inactive
-- category is hidden from visitors everywhere (filters, homepage rows,
-- product pages, category links) by RLS; signed-in admins still see it.
alter table categories add column if not exists is_active boolean not null default true;

drop policy if exists "public can read categories" on categories;

create policy "public can read active categories"
  on categories for select
  to anon
  using (is_active);

create policy "admins can read all categories"
  on categories for select
  to authenticated
  using (true);
