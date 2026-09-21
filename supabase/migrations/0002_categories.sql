-- ============================================================
-- Proper categories: a product can be tagged with multiple
-- categories, and renaming a category updates it everywhere it's
-- tagged (it's a real row, not a copied string).
-- ============================================================

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_categories (
  product_id uuid not null references products (id) on delete cascade,
  category_id uuid not null references categories (id) on delete cascade,
  primary key (product_id, category_id)
);

create index if not exists product_categories_category_id_idx on product_categories (category_id);

-- Backfill from the old free-text products.category column, if present.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'products' and column_name = 'category'
  ) then
    insert into categories (name, slug)
    select distinct trim(category), lower(regexp_replace(trim(trim(category), '-'), '[^a-zA-Z0-9]+', '-', 'g'))
    from products
    where category is not null and trim(category) <> ''
    on conflict (name) do nothing;

    insert into product_categories (product_id, category_id)
    select p.id, c.id
    from products p
    join categories c on c.name = trim(p.category)
    where p.category is not null and trim(p.category) <> ''
    on conflict do nothing;

    alter table products drop column category;
  end if;
end $$;

drop trigger if exists categories_set_updated_at on categories;
create trigger categories_set_updated_at
  before update on categories
  for each row execute function set_updated_at();

alter table categories enable row level security;
alter table product_categories enable row level security;

create policy "public can read categories"
  on categories for select
  to anon, authenticated
  using (true);

create policy "admins can insert categories"
  on categories for insert
  to authenticated
  with check (true);

create policy "admins can update categories"
  on categories for update
  to authenticated
  using (true)
  with check (true);

create policy "admins can delete categories"
  on categories for delete
  to authenticated
  using (true);

create policy "public can read product_categories"
  on product_categories for select
  to anon, authenticated
  using (true);

create policy "admins can insert product_categories"
  on product_categories for insert
  to authenticated
  with check (true);

create policy "admins can delete product_categories"
  on product_categories for delete
  to authenticated
  using (true);
