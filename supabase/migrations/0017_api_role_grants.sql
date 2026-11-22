-- Newer Supabase projects no longer grant table access to the API roles by
-- default. Grant the same privileges older projects had; row level security
-- policies (enabled on every table) still decide which rows each role sees.
grant select, insert, update, delete on all tables in schema public
  to anon, authenticated, service_role;
grant usage, select, update on all sequences in schema public
  to anon, authenticated, service_role;

alter default privileges in schema public
  grant select, insert, update, delete on tables to anon, authenticated, service_role;
alter default privileges in schema public
  grant usage, select, update on sequences to anon, authenticated, service_role;
