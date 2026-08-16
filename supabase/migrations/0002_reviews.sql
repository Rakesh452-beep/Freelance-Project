-- Dhananjaya Studio — real user reviews schema

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating integer not null check (rating between 1 and 5),
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists reviews_created_at_idx on public.reviews (created_at desc);

-- Writes/reads happen server-side with the service role key (same as bookings/inquiries).
alter table public.reviews enable row level security;
