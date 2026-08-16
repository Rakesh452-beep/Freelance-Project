-- Dhananjaya Studio — initial schema

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_ref text unique not null,
  service text not null check (service in ('photography', 'cinematography', 'graphic-design')),
  client_name text not null,
  client_email text not null,
  client_phone text not null,
  event_type text not null,
  event_date date not null,
  event_time text not null,
  location text not null,
  notes text,
  amount integer not null default 0,
  advance_amount integer not null default 0,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  booking_status text not null default 'new' check (booking_status in ('new', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_booking_ref_idx on public.bookings (booking_ref);
create index if not exists bookings_status_idx on public.bookings (booking_status);
create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);

-- All writes/reads happen server-side with the service role key.
-- Client code never queries these tables directly, so no policies are granted.
alter table public.bookings enable row level security;
alter table public.inquiries enable row level security;
