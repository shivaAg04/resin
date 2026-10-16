-- ============================================================
-- Migration 0016: The product image shown for each design option.
-- Index-aligned with design_options ('' = no image for that design).
-- ============================================================

alter table products add column if not exists design_images text[] not null default '{}';
