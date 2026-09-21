-- Sample resin products for local development / demo.
-- Images are left empty; upload real photos from the admin panel —
-- the product card/detail UI falls back to a placeholder graphic.
-- Run after all migrations (0001_init.sql .. 0004_remove_stock.sql).

insert into categories (name, slug)
values
  ('Rodcuts', 'rodcuts'),
  ('Custom', 'custom'),
  ('Premium', 'premium')
on conflict (name) do nothing;

insert into products (name, slug, description, price, is_active, images)
values
  (
    'Resin Rodcut Classic',
    'resin-rodcut-classic',
    'A timeless handmade resin rodcut piece with a smooth glass-like finish. Each one is individually cast and polished by hand.',
    299,
    true,
    '[]'::jsonb
  ),
  (
    'Ocean Blue Resin Rodcut',
    'ocean-blue-resin-rodcut',
    'Inspired by ocean waves, this rodcut swirls deep blues and whites for a calming, beach-glass look.',
    399,
    true,
    '[]'::jsonb
  ),
  (
    'Floral Resin Rodcut',
    'floral-resin-rodcut',
    'Real dried flowers suspended in crystal-clear resin — a delicate, nature-inspired keepsake.',
    449,
    true,
    '[]'::jsonb
  ),
  (
    'Custom Name Resin Rodcut',
    'custom-name-resin-rodcut',
    'Personalize this rodcut with any name or short text, hand-finished in resin. Perfect as a gift.',
    599,
    true,
    '[]'::jsonb
  ),
  (
    'Premium Resin Rodcut',
    'premium-resin-rodcut',
    'Our most detailed piece, layered with metallic pigments and gold foil accents for a premium finish.',
    699,
    true,
    '[]'::jsonb
  )
on conflict (slug) do nothing;

insert into product_categories (product_id, category_id)
select p.id, c.id
from products p
join categories c on (
  (p.slug in ('resin-rodcut-classic', 'ocean-blue-resin-rodcut', 'floral-resin-rodcut', 'premium-resin-rodcut') and c.slug = 'rodcuts')
  or (p.slug = 'custom-name-resin-rodcut' and c.slug = 'custom')
  or (p.slug = 'premium-resin-rodcut' and c.slug = 'premium')
)
on conflict do nothing;
