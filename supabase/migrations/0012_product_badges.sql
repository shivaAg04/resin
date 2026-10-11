-- Product page redesign:
--  * badges: extra labels shown on product cards and the product page
--    ("gift_ready", "made_to_order", "bestseller"). "Customisable" stays
--    its own column (is_customisable) since it also changes the pricing label.
--  * whats_included: optional "What's included" text for the product page.
alter table products add column if not exists badges text[] not null default '{}';
alter table products add column if not exists whats_included text;
