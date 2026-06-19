-- ================================================================
-- ALLAN MULTISERVICE GROUP — Supabase Schema (V2)
-- Paste into Supabase SQL Editor (supabase.com → SQL Editor → Run).
-- Then: Storage → create TWO public buckets: "listings" and "branding".
-- Then: Authentication → add one owner user (email + password) for /admin.
-- ================================================================

-- ── Listings (all 4 verticals in one table) ───────────────────
create table if not exists listings (
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
  -- property / rental
  bedrooms      int,
  bathrooms     int,
  area_sqm      numeric,
  furnished     boolean,
  -- land / property
  zoning        text,
  title_status  text,
  tenure        text,            -- 'Freehold' | 'Leasehold (99yr)'
  -- car
  make          text,
  model         text,
  year          int,
  mileage_km    numeric,
  transmission  text,
  fuel_type     text,
  condition     text,
  body_type     text
);

create index if not exists listings_vertical_idx on listings (vertical);
create index if not exists listings_status_idx   on listings (status);
create index if not exists listings_price_idx     on listings (price);
create index if not exists listings_created_idx   on listings (created_at desc);

-- Add new columns if upgrading an existing V1 table
alter table listings add column if not exists video_url text;
alter table listings add column if not exists tenure text;

-- ── Inquiries (buyer inquiries, video-tour requests, concierge) ─
create table if not exists inquiries (
  id            uuid primary key default gen_random_uuid(),
  kind          text not null default 'inquiry' check (kind in ('inquiry','video_tour','concierge')),
  name          text not null,
  phone         text not null,
  email         text,
  message       text,
  listing_id    uuid references listings(id) on delete set null,
  listing_title text,
  handled       boolean not null default false,
  created_at    timestamptz not null default now()
);
alter table inquiries add column if not exists kind text not null default 'inquiry';

-- ── New-listing alerts (buyer lead magnet) ────────────────────
create table if not exists alerts (
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
create table if not exists site_settings (
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
insert into site_settings (id) values (1) on conflict (id) do nothing;

-- Clean up V1 (seller funnel removed)
drop table if exists seller_leads;

-- ── Row Level Security ────────────────────────────────────────
alter table listings      enable row level security;
alter table inquiries     enable row level security;
alter table alerts        enable row level security;
alter table site_settings enable row level security;

drop policy if exists "public read listings" on listings;
create policy "public read listings" on listings for select using (true);
drop policy if exists "owner write listings" on listings;
create policy "owner write listings" on listings for all to authenticated using (true) with check (true);

drop policy if exists "public read settings" on site_settings;
create policy "public read settings" on site_settings for select using (true);
drop policy if exists "owner write settings" on site_settings;
create policy "owner write settings" on site_settings for all to authenticated using (true) with check (true);

drop policy if exists "public insert inquiries" on inquiries;
create policy "public insert inquiries" on inquiries for insert with check (true);
drop policy if exists "owner read inquiries" on inquiries;
create policy "owner read inquiries" on inquiries for select to authenticated using (true);
drop policy if exists "owner update inquiries" on inquiries;
create policy "owner update inquiries" on inquiries for update to authenticated using (true);

drop policy if exists "public insert alerts" on alerts;
create policy "public insert alerts" on alerts for insert with check (true);
drop policy if exists "owner read alerts" on alerts;
create policy "owner read alerts" on alerts for select to authenticated using (true);
drop policy if exists "owner update alerts" on alerts;
create policy "owner update alerts" on alerts for update to authenticated using (true);

-- ── Storage policies (run AFTER creating public buckets) ──────
-- Buckets "listings" and "branding" must be created as PUBLIC in the dashboard.
-- Public read is automatic. Allow authenticated owner to upload/replace:
drop policy if exists "owner upload media" on storage.objects;
create policy "owner upload media" on storage.objects for insert to authenticated
  with check (bucket_id in ('listings','branding'));
drop policy if exists "owner update media" on storage.objects;
create policy "owner update media" on storage.objects for update to authenticated
  using (bucket_id in ('listings','branding'));
drop policy if exists "owner delete media" on storage.objects;
create policy "owner delete media" on storage.objects for delete to authenticated
  using (bucket_id in ('listings','branding'));

-- ── Seed listings (mirrors src/lib/seed.ts so the live site looks full) ──
insert into listings
  (slug, vertical, listing_type, title, price, price_label, currency, location, district, description, features, images, status, featured, bedrooms, bathrooms, area_sqm, furnished, zoning, title_status, tenure, make, model, year, mileage_km, transmission, fuel_type, condition, body_type)
values
  ('modern-4-bed-villa-kiyovu-kigali','property','sale','Modern 4-Bedroom Villa in Kiyovu',280000000,'RWF 280,000,000','RWF','Kiyovu','Nyarugenge','A contemporary villa in the heart of Kiyovu — floor-to-ceiling glass, a landscaped garden, rooftop terrace with city views, and a self-contained guest wing.',array['Swimming Pool','Rooftop Terrace','2-Car Garage','Garden','24/7 Security','Standby Generator'],array['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80','https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1200&q=80'],'available',true,4,3,340,false,null,null,'Leasehold (99yr)',null,null,null,null,null,null,null,null),
  ('600sqm-titled-plot-nyarutarama','land','sale','600sqm Titled Plot — Nyarutarama',85000000,'RWF 85,000,000','RWF','Nyarutarama','Gasabo','Flat, titled 600sqm plot in prestigious Nyarutarama. All utilities connected, tarmac access, and a clear title for fast transfer.',array['Titled','All Utilities Connected','Flat Terrain','Tarmac Road Access','Corner Plot'],array['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80'],'available',true,null,null,600,null,'Residential','Freehold Title','Freehold',null,null,null,null,null,null,null,null),
  ('toyota-rav4-2019-kigali','car','sale','Toyota RAV4 2019 — Inspected',28500000,'RWF 28,500,000','RWF','Kigali','Gasabo','Clean, locally-inspected RAV4 with full service history. One owner, accident-free, new tyres.',array['Full Service History','Accident-Free','New Tyres','Reverse Camera','Alloy Wheels'],array['https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=1200&q=80'],'available',true,null,null,null,null,null,null,null,'Toyota','RAV4',2019,62000,'Automatic','Petrol','Used','SUV'),
  ('furnished-3-bed-apartment-kimihurura-rent','rental','rent','Furnished 3-Bed Apartment — Kimihurura',1200000,'RWF 1,200,000 / month','RWF','Kimihurura','Gasabo','Fully furnished executive apartment in Kimihurura''s most sought-after complex. Concierge, pool, gym, and dedicated parking.',array['Furnished','Concierge','Swimming Pool','Gym','Underground Parking','24/7 Security'],array['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80'],'available',true,3,2,180,true,null,null,null,null,null,null,null,null,null,null,null)
on conflict (slug) do nothing;
