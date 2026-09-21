-- ============================================================
-- Resin store MVP — initial schema
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- products
-- ------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  category text,
  stock integer not null default 0 check (stock >= 0),
  is_active boolean not null default true,
  images jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_is_active_idx on products (is_active);
create index if not exists products_category_idx on products (category);

-- ------------------------------------------------------------
-- orders
-- ------------------------------------------------------------
create sequence if not exists order_number_seq start with 1001;

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null default ('ORD-' || nextval('order_number_seq')::text),
  customer_name text not null,
  whatsapp_number text not null,
  address text not null,
  city text not null,
  state text,
  pincode text not null,
  instagram_username text,
  special_instructions text,
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  status text not null default 'new' check (
    status in ('new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_idx on orders (status);
create index if not exists orders_created_at_idx on orders (created_at desc);

-- ------------------------------------------------------------
-- order_items
-- Snapshots product_name/unit_price so historical orders are stable
-- even if the product is edited or deleted later.
-- ------------------------------------------------------------
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  subtotal numeric(10, 2) not null check (subtotal >= 0)
);

create index if not exists order_items_order_id_idx on order_items (order_id);

-- ------------------------------------------------------------
-- updated_at triggers
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

drop trigger if exists orders_set_updated_at on orders;
create trigger orders_set_updated_at
  before update on orders
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Products: anyone can read active products; only signed-in admins see all
-- (including inactive) and may write.
create policy "public can read active products"
  on products for select
  to anon
  using (is_active = true);

create policy "admins can read all products"
  on products for select
  to authenticated
  using (true);

create policy "admins can insert products"
  on products for insert
  to authenticated
  with check (true);

create policy "admins can update products"
  on products for update
  to authenticated
  using (true)
  with check (true);

create policy "admins can delete products"
  on products for delete
  to authenticated
  using (true);

-- Orders / order_items: no anonymous access at all. Order numbers are
-- sequential and therefore guessable, so customers must never be able to
-- read orders — even their own — directly from the database. Orders are
-- created exclusively through a server-side route using the service role
-- key, which bypasses RLS. Only signed-in admins can read/update orders.
create policy "admins can read orders"
  on orders for select
  to authenticated
  using (true);

create policy "admins can update orders"
  on orders for update
  to authenticated
  using (true)
  with check (true);

create policy "admins can read order items"
  on order_items for select
  to authenticated
  using (true);

-- ------------------------------------------------------------
-- Storage: public bucket for product images
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "public can view product images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy "admins can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "admins can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

create policy "admins can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
