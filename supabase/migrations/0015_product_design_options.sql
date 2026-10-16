-- ============================================================
-- Migration 0015: Design variants per product (e.g. "Design 1",
-- "Design 2") that the customer picks on the product page.
-- ============================================================

alter table products add column if not exists design_options text[] not null default '{}';
