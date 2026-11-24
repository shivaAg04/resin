-- Admin can mark any product "Out of stock". It stays visible (with an
-- "Out of stock" label) but can't be bought. No quantities are tracked.
alter table products add column if not exists out_of_stock boolean not null default false;
