-- ============================================================
-- Custom order requests from the /custom-orders form.
-- Customers never read or write this table directly: requests are
-- inserted by a server action using the service role (like orders), and
-- only signed-in admins can read and update them.
-- ============================================================

create sequence if not exists custom_request_number_seq start with 1001;

create table if not exists custom_requests (
  id uuid primary key default gen_random_uuid(),
  request_number text unique not null default ('CR-' || nextval('custom_request_number_seq')::text),
  customer_name text not null,
  whatsapp_number text not null,
  looking_for text not null,
  occasion text not null,
  budget text not null,
  quantity text not null,
  required_date date,
  preferred_colours text not null,
  details text,
  -- Paths inside the private 'custom-references' storage bucket.
  reference_images text[] not null default '{}',
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'confirmed', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists custom_requests_created_at_idx on custom_requests (created_at desc);

drop trigger if exists custom_requests_set_updated_at on custom_requests;
create trigger custom_requests_set_updated_at
  before update on custom_requests
  for each row execute function set_updated_at();

alter table custom_requests enable row level security;

create policy "admins can read custom requests"
  on custom_requests for select
  to authenticated
  using (true);

create policy "admins can update custom requests"
  on custom_requests for update
  to authenticated
  using (true)
  with check (true);

create policy "admins can delete custom requests"
  on custom_requests for delete
  to authenticated
  using (true);

-- ------------------------------------------------------------
-- Storage: PRIVATE bucket for customers' reference photos.
-- Customers upload through one-time signed upload URLs issued by the
-- server, so no anonymous storage policy is needed. Admins view the
-- photos through short-lived signed URLs.
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'custom-references',
  'custom-references',
  false,
  10485760, -- 10 MB per photo
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do nothing;

create policy "admins can view custom references"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'custom-references');

create policy "admins can delete custom references"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'custom-references');
