-- ================================================================
-- ALLAN MULTISERVICE GROUP — Supabase Schema (V2, NAMESPACED)
-- Safe to run inside a SHARED Supabase project that already hosts
-- other sites. Every table is prefixed `allan_` and buckets are
-- uniquely named, so nothing here touches your other projects' data.
--
-- Run: Supabase → SQL Editor → New query → paste all → Run.
-- Then Storage → create TWO public buckets: "allan-listings" + "allan-branding".
-- Then Authentication → add one owner user (email + password) for /admin.
-- ================================================================

-- ── Listings (all 4 verticals in one table) ───────────────────
create table if not exists allan_listings (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  vertical      text not null check (vertical in ('property','land','car','rental')),
  listing_type  text not null check (listing_type in ('sale','rent')),
  title         text not null,
  price         numeric not null default 0,
  price_label   text not null,
  currency      text not null default 'RWF',
  location      text not null,
  district      text not null default 'Kigali',
  description   text not null default '',
  features      text[] not null default '{}',
  images        text[] not null default '{}',
  video_url     text,
  status        text not null default 'available' check (status in ('available','sold','rented','reserved')),
  featured      boolean not null default false,
  created_at    timestamptz not null default now(),
  bedrooms      int,
  bathrooms     int,
  area_sqm      numeric,
  furnished     boolean,
  zoning        text,
  title_status  text,
  tenure        text,
  make          text,
  model         text,
  year          int,
  mileage_km    numeric,
  transmission  text,
  fuel_type     text,
  condition     text,
  body_type     text
);

create index if not exists allan_listings_vertical_idx on allan_listings (vertical);
create index if not exists allan_listings_status_idx   on allan_listings (status);
create index if not exists allan_listings_price_idx     on allan_listings (price);
create index if not exists allan_listings_created_idx   on allan_listings (created_at desc);

-- ── Inquiries (buyer inquiries, video-tour requests, concierge) ─
create table if not exists allan_inquiries (
  id            uuid primary key default gen_random_uuid(),
  kind          text not null default 'inquiry' check (kind in ('inquiry','video_tour','concierge')),
  name          text not null,
  phone         text not null,
  email         text,
  message       text,
  listing_id    uuid references allan_listings(id) on delete set null,
  listing_title text,
  handled       boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ── New-listing alerts (buyer lead magnet) ────────────────────
create table if not exists allan_alerts (
  id         uuid primary key default gen_random_uuid(),
  channel    text not null default 'whatsapp' check (channel in ('whatsapp','email')),
  contact    text not null,
  vertical   text check (vertical in ('property','land','car','rental')),
  location   text,
  max_price  numeric,
  handled    boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── Site settings (admin-managed branding + hero + USD rate) ──
create table if not exists allan_settings (
  id              int primary key default 1,
  logo_url        text,
  hero_media_type text not null default 'gradient' check (hero_media_type in ('gradient','image','video')),
  hero_media_url  text,
  hero_poster_url text,
  hero_headline   text,
  hero_subtext    text,
  about_image_url text,
  phone           text,
  whatsapp        text,
  email           text,
  usd_rate        numeric default 1330,
  rdb_line        text,
  updated_at      timestamptz not null default now()
);
insert into allan_settings (id) values (1) on conflict (id) do nothing;

-- ── Row Level Security ────────────────────────────────────────
alter table allan_listings  enable row level security;
alter table allan_inquiries enable row level security;
alter table allan_alerts    enable row level security;
alter table allan_settings  enable row level security;

drop policy if exists "allan public read listings" on allan_listings;
create policy "allan public read listings" on allan_listings for select using (true);
drop policy if exists "allan owner write listings" on allan_listings;
create policy "allan owner write listings" on allan_listings for all to authenticated using (true) with check (true);

drop policy if exists "allan public read settings" on allan_settings;
create policy "allan public read settings" on allan_settings for select using (true);
drop policy if exists "allan owner write settings" on allan_settings;
create policy "allan owner write settings" on allan_settings for all to authenticated using (true) with check (true);

drop policy if exists "allan public insert inquiries" on allan_inquiries;
create policy "allan public insert inquiries" on allan_inquiries for insert with check (true);
drop policy if exists "allan owner read inquiries" on allan_inquiries;
create policy "allan owner read inquiries" on allan_inquiries for select to authenticated using (true);
drop policy if exists "allan owner update inquiries" on allan_inquiries;
create policy "allan owner update inquiries" on allan_inquiries for update to authenticated using (true);

drop policy if exists "allan public insert alerts" on allan_alerts;
create policy "allan public insert alerts" on allan_alerts for insert with check (true);
drop policy if exists "allan owner read alerts" on allan_alerts;
create policy "allan owner read alerts" on allan_alerts for select to authenticated using (true);
drop policy if exists "allan owner update alerts" on allan_alerts;
create policy "allan owner update alerts" on allan_alerts for update to authenticated using (true);

-- ── Storage policies (run AFTER creating the two public buckets) ──
-- Buckets "allan-listings" and "allan-branding" must be created as PUBLIC.
drop policy if exists "allan owner upload media" on storage.objects;
create policy "allan owner upload media" on storage.objects for insert to authenticated
  with check (bucket_id in ('allan-listings','allan-branding'));
drop policy if exists "allan owner update media" on storage.objects;
create policy "allan owner update media" on storage.objects for update to authenticated
  using (bucket_id in ('allan-listings','allan-branding'));
drop policy if exists "allan owner delete media" on storage.objects;
create policy "allan owner delete media" on storage.objects for delete to authenticated
  using (bucket_id in ('allan-listings','allan-branding'));

-- ── Seed listings (so the live site looks full on day one) ────
insert into allan_listings
  (slug, vertical, listing_type, title, price, price_label, currency, location, district, description, features, images, status, featured, bedrooms, bathrooms, area_sqm, furnished, zoning, title_status, tenure, make, model, year, mileage_km, transmission, fuel_type, condition, body_type)
values
  ('modern-4-bed-villa-kiyovu-kigali','property','sale','Modern 4-Bedroom Villa in Kiyovu',280000000,'RWF 280,000,000','RWF','Kiyovu','Nyarugenge','A contemporary villa in the heart of Kiyovu — floor-to-ceiling glass, a landscaped garden, rooftop terrace with city views, and a self-contained guest wing.',array['Swimming Pool','Rooftop Terrace','2-Car Garage','Garden','24/7 Security','Standby Generator'],array['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80','https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1200&q=80'],'available',true,4,3,340,false,null,null,'Leasehold (99yr)',null,null,null,null,null,null,null,null),
  ('600sqm-titled-plot-nyarutarama','land','sale','600sqm Titled Plot — Nyarutarama',85000000,'RWF 85,000,000','RWF','Nyarutarama','Gasabo','Flat, titled 600sqm plot in prestigious Nyarutarama. All utilities connected, tarmac access, and a clear title for fast transfer.',array['Titled','All Utilities Connected','Flat Terrain','Tarmac Road Access','Corner Plot'],array['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80'],'available',true,null,null,600,null,'Residential','Freehold Title','Freehold',null,null,null,null,null,null,null,null),
  ('toyota-rav4-2019-kigali','car','sale','Toyota RAV4 2019 — Inspected',28500000,'RWF 28,500,000','RWF','Kigali','Gasabo','Clean, locally-inspected RAV4 with full service history. One owner, accident-free, new tyres.',array['Full Service History','Accident-Free','New Tyres','Reverse Camera','Alloy Wheels'],array['https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=1200&q=80'],'available',true,null,null,null,null,null,null,null,'Toyota','RAV4',2019,62000,'Automatic','Petrol','Used','SUV'),
  ('furnished-3-bed-apartment-kimihurura-rent','rental','rent','Furnished 3-Bed Apartment — Kimihurura',1200000,'RWF 1,200,000 / month','RWF','Kimihurura','Gasabo','Fully furnished executive apartment in Kimihurura''s most sought-after complex. Concierge, pool, gym, and dedicated parking.',array['Furnished','Concierge','Swimming Pool','Gym','Underground Parking','24/7 Security'],array['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80'],'available',true,3,2,180,true,null,null,null,null,null,null,null,null,null,null,null)
on conflict (slug) do nothing;
