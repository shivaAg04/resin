-- ============================================================
-- Customer reviews (admin-curated, with an optional photo) and an
-- optional single Instagram Reel link per product, shown on its
-- product detail page.
-- ============================================================

alter table products add column if not exists reel_url text;

create table if not exists product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  customer_name text not null,
  rating smallint not null default 5 check (rating between 1 and 5),
  review_text text,
  image_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists product_reviews_product_id_idx on product_reviews (product_id, sort_order);

drop trigger if exists product_reviews_set_updated_at on product_reviews;
create trigger product_reviews_set_updated_at
  before update on product_reviews
  for each row execute function set_updated_at();

alter table product_reviews enable row level security;

create policy "public can read active reviews"
  on product_reviews for select
  to anon
  using (is_active = true);

create policy "admins can read all reviews"
  on product_reviews for select
  to authenticated
  using (true);

create policy "admins can insert reviews"
  on product_reviews for insert
  to authenticated
  with check (true);

create policy "admins can update reviews"
  on product_reviews for update
  to authenticated
  using (true)
  with check (true);

create policy "admins can delete reviews"
  on product_reviews for delete
  to authenticated
  using (true);
