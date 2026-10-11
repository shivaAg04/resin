-- Homepage redesign:
--  * categories get a cover image + one-line description for the
--    "Shop by Category" cards.
--  * products get a "Customisable" flag (shows the badge and "onwards"
--    pricing) and a "Show in New at Spilled Colours" pick — picked
--    products lead that homepage section, the newest products fill the rest.
alter table categories add column if not exists image_url text;
alter table categories add column if not exists description text;

alter table products add column if not exists is_customisable boolean not null default false;
alter table products add column if not exists show_in_new boolean not null default false;
