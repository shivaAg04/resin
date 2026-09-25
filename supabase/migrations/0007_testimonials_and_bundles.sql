-- ============================================================
-- Homepage testimonials (site-wide, not tied to one product) and
-- product bundles (a product that's a curated combo of other
-- products — sold and checked out exactly like any normal product,
-- just with a "this bundle includes" list on its detail page).
-- ============================================================

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  rating smallint not null default 5 check (rating between 1 and 5),
  review_text text,
  image_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists testimonials_active_idx on testimonials (is_active, sort_order);

drop trigger if exists testimonials_set_updated_at on testimonials;
create trigger testimonials_set_updated_at
  before update on testimonials
  for each row execute function set_updated_at();

alter table testimonials enable row level security;

create policy "public can read active testimonials"
  on testimonials for select
  to anon
  using (is_active = true);

create policy "admins can read all testimonials"
  on testimonials for select
  to authenticated
  using (true);

create policy "admins can insert testimonials"
  on testimonials for insert
  to authenticated
  with check (true);

create policy "admins can update testimonials"
  on testimonials for update
  to authenticated
  using (true)
  with check (true);

create policy "admins can delete testimonials"
  on testimonials for delete
  to authenticated
  using (true);

-- ------------------------------------------------------------
-- Product bundles: a bundle is just a normal product row (own
-- name/price/images/checkout) that additionally lists which other
-- products it's made up of, purely for display on its detail page.
-- ------------------------------------------------------------
create table if not exists product_bundle_items (
  bundle_product_id uuid not null references products (id) on delete cascade,
  item_product_id uuid not null references products (id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  sort_order integer not null default 0,
  primary key (bundle_product_id, item_product_id),
  check (bundle_product_id <> item_product_id)
);

create index if not exists product_bundle_items_bundle_idx on product_bundle_items (bundle_product_id, sort_order);

alter table product_bundle_items enable row level security;

create policy "public can read bundle items"
  on product_bundle_items for select
  to anon, authenticated
  using (true);

create policy "admins can insert bundle items"
  on product_bundle_items for insert
  to authenticated
  with check (true);

create policy "admins can delete bundle items"
  on product_bundle_items for delete
  to authenticated
  using (true);
