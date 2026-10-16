-- ============================================================
-- Migration 0014: Keywords search, second video/reel, customer
-- customization options & review submissions.
-- ============================================================

-- 1. Keywords / search tags for products
alter table products add column if not exists keywords text[] not null default '{}';

-- 2. Optional second video/reel URL per product
alter table products add column if not exists reel_url_2 text;

-- 3. Customisable products: allow customer photo upload (e.g. for photo frames)
alter table products add column if not exists allow_customer_image boolean not null default false;

-- 4. Store customer customization notes & uploaded photo URL in order_items
alter table order_items add column if not exists customer_customization text;
alter table order_items add column if not exists customer_image_url text;

-- 5. Customer review submissions: allow anon insert
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'product_reviews' and policyname = 'public can insert reviews'
  ) then
    create policy "public can insert reviews"
      on product_reviews for insert
      to anon
      with check (true);
  end if;
end $$;
