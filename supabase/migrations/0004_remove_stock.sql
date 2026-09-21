-- Stock tracking removed: availability is controlled solely by the
-- existing is_active toggle (many handmade/made-to-order pieces don't have
-- a meaningful stock count).
alter table products drop column if exists stock;
