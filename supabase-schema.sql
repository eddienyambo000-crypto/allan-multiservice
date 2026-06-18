-- ================================================================
-- ALLAN MULTISERVICE GROUP — Supabase Schema
-- Run in Supabase SQL Editor (supabase.com → SQL Editor).
-- Then create a Storage bucket named "listings" (public).
-- ================================================================

-- ── Listings (unified table for all 4 verticals) ──────────────
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
  status        text not null default 'available' check (status in ('available','sold','rented','reserved')),
  featured      boolean not null default false,
  created_at    timestamptz not null default now(),

  -- property / rental
  bedrooms      int,
  bathrooms     int,
  area_sqm      numeric,
  furnished     boolean,

  -- land
  zoning        text,
  title_status  text,

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
create index if not exists listings_status_idx on listings (status);
create index if not exists listings_price_idx on listings (price);
create index if not exists listings_created_idx on listings (created_at desc);

-- ── Buyer inquiries ───────────────────────────────────────────
create table if not exists inquiries (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  phone         text not null,
  email         text,
  message       text,
  listing_id    uuid references listings(id) on delete set null,
  listing_title text,
  handled       boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ── Seller leads (list-with-us) ───────────────────────────────
create table if not exists seller_leads (
  id          uuid primary key default gen_random_uuid(),
  vertical    text not null check (vertical in ('property','land','car','rental')),
  name        text not null,
  phone       text not null,
  asset_title text not null,
  details     text,
  handled     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ── Row Level Security ────────────────────────────────────────
alter table listings     enable row level security;
alter table inquiries    enable row level security;
alter table seller_leads enable row level security;

-- Public can read listings
drop policy if exists "public read listings" on listings;
create policy "public read listings" on listings for select using (true);

-- Authenticated owner can write listings
drop policy if exists "owner write listings" on listings;
create policy "owner write listings" on listings for all
  to authenticated using (true) with check (true);

-- Public can submit leads; only owner can read them
drop policy if exists "public insert inquiries" on inquiries;
create policy "public insert inquiries" on inquiries for insert with check (true);
drop policy if exists "owner read inquiries" on inquiries;
create policy "owner read inquiries" on inquiries for select to authenticated using (true);
drop policy if exists "owner update inquiries" on inquiries;
create policy "owner update inquiries" on inquiries for update to authenticated using (true);

drop policy if exists "public insert seller_leads" on seller_leads;
create policy "public insert seller_leads" on seller_leads for insert with check (true);
drop policy if exists "owner read seller_leads" on seller_leads;
create policy "owner read seller_leads" on seller_leads for select to authenticated using (true);
drop policy if exists "owner update seller_leads" on seller_leads;
create policy "owner update seller_leads" on seller_leads for update to authenticated using (true);

-- ── Storage bucket policies (run after creating "listings" bucket) ──
-- In Storage → create bucket "listings" → Public. Then:
--   Public read is automatic for public buckets.
--   Authenticated users can upload:
-- create policy "owner upload" on storage.objects for insert to authenticated
--   with check (bucket_id = 'listings');

-- ── Seed data — mirrors src/lib/seed.ts so live site looks full ──
insert into listings
  (slug, vertical, listing_type, title, price, price_label, currency, location, district, description, features, images, status, featured, bedrooms, bathrooms, area_sqm, furnished, zoning, title_status, make, model, year, mileage_km, transmission, fuel_type, condition, body_type)
values
  ('modern-4-bed-villa-kiyovu-kigali','property','sale','Modern 4-Bedroom Villa in Kiyovu',280000000,'RWF 280,000,000','RWF','Kiyovu','Nyarugenge','A contemporary villa in the heart of Kiyovu — floor-to-ceiling glass, a landscaped garden, rooftop terrace with city views, and a self-contained guest wing.',array['Swimming Pool','Rooftop Terrace','2-Car Garage','Garden','24/7 Security','Standby Generator'],array['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80','https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1200&q=80'],'available',true,4,3,340,false,null,null,null,null,null,null,null,null,null,null),
  ('600sqm-titled-plot-nyarutarama','land','sale','600sqm Titled Plot — Nyarutarama',85000000,'RWF 85,000,000','RWF','Nyarutarama','Gasabo','Flat, titled 600sqm plot in prestigious Nyarutarama. All utilities connected, tarmac access, and a clear title for fast transfer.',array['Titled','All Utilities Connected','Flat Terrain','Tarmac Road Access','Corner Plot'],array['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80'],'available',true,null,null,600,null,'Residential','Freehold Title',null,null,null,null,null,null,null,null),
  ('toyota-rav4-2019-kigali','car','sale','Toyota RAV4 2019 — Inspected',28500000,'RWF 28,500,000','RWF','Kigali','Gasabo','Clean, locally-inspected RAV4 with full service history. One owner, accident-free, new tyres.',array['Full Service History','Accident-Free','New Tyres','Reverse Camera','Alloy Wheels'],array['https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=1200&q=80'],'available',true,null,null,null,null,null,null,'Toyota','RAV4',2019,62000,'Automatic','Petrol','Used','SUV'),
  ('furnished-3-bed-apartment-kimihurura-rent','rental','rent','Furnished 3-Bed Apartment — Kimihurura',1200000,'RWF 1,200,000 / month','RWF','Kimihurura','Gasabo','Fully furnished executive apartment in Kimihurura''s most sought-after complex. Concierge, pool, gym, and dedicated parking.',array['Furnished','Concierge','Swimming Pool','Gym','Underground Parking','24/7 Security'],array['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80'],'available',true,3,2,180,true,null,null,null,null,null,null,null,null,null,null)
on conflict (slug) do nothing;
