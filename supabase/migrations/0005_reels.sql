-- ============================================================
-- Instagram Reels showcased on the homepage. Embedded client-side
-- via Instagram's public embed.js widget (the same one behind every
-- post's "Embed" button) — no API token or Developer App needed.
-- ============================================================

create table if not exists reels (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reels_active_idx on reels (is_active, sort_order);

drop trigger if exists reels_set_updated_at on reels;
create trigger reels_set_updated_at
  before update on reels
  for each row execute function set_updated_at();

alter table reels enable row level security;

create policy "public can read active reels"
  on reels for select
  to anon
  using (is_active = true);

create policy "admins can read all reels"
  on reels for select
  to authenticated
  using (true);

create policy "admins can insert reels"
  on reels for insert
  to authenticated
  with check (true);

create policy "admins can update reels"
  on reels for update
  to authenticated
  using (true)
  with check (true);

create policy "admins can delete reels"
  on reels for delete
  to authenticated
  using (true);
