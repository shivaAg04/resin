-- ============================================================
-- Product display order + admin-controlled homepage category rows.
-- ============================================================

alter table products add column if not exists sort_order integer not null default 0;
create index if not exists products_sort_order_idx on products (sort_order);

alter table categories add column if not exists show_on_home boolean not null default false;
alter table categories add column if not exists home_position integer not null default 0;
create index if not exists categories_home_idx on categories (show_on_home, home_position);
