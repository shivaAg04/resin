-- ============================================================
-- Stable, human-readable reference codes — P001, P002... for
-- products and C001, C002... for categories. Assigned once at
-- creation and never change, independent of name/slug edits.
-- ============================================================

alter table products add column if not exists code text;
alter table categories add column if not exists code text;

create sequence if not exists product_code_seq;
create sequence if not exists category_code_seq;

-- Backfill existing rows in creation order.
with numbered as (
  select id, row_number() over (order by created_at) as rn
  from products
  where code is null
)
update products p
set code = 'P' || lpad(numbered.rn::text, 3, '0')
from numbered
where p.id = numbered.id;

with numbered as (
  select id, row_number() over (order by created_at) as rn
  from categories
  where code is null
)
update categories c
set code = 'C' || lpad(numbered.rn::text, 3, '0')
from numbered
where c.id = numbered.id;

-- Advance sequences past whatever we just backfilled.
select setval('product_code_seq', greatest((select count(*) from products), 1), true);
select setval('category_code_seq', greatest((select count(*) from categories), 1), true);

alter table products alter column code set default ('P' || lpad(nextval('product_code_seq')::text, 3, '0'));
alter table categories alter column code set default ('C' || lpad(nextval('category_code_seq')::text, 3, '0'));

alter table products alter column code set not null;
alter table categories alter column code set not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'products_code_unique') then
    alter table products add constraint products_code_unique unique (code);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'categories_code_unique') then
    alter table categories add constraint categories_code_unique unique (code);
  end if;
end $$;
