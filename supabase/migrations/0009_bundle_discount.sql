-- Optional flat discount on a bundle product. The product's stored price
-- is computed server-side as sum(bundle item prices) - discount_amount
-- whenever it has bundle items, so it can't drift out of sync with a
-- manually-typed price.
alter table products add column if not exists discount_amount numeric(10, 2) not null default 0 check (discount_amount >= 0);
