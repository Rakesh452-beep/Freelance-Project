-- Dhananjaya Studio — RLS policies for public (anon) access
-- Lets the reviews/contact endpoints use the anon key instead of the
-- service-role key. bookings stays locked down (no anon policies) so the
-- server-computed pricing cannot be tampered with by direct API calls.

-- Reviews: anyone can read published reviews and submit one.
drop policy if exists "anon_read_reviews" on public.reviews;
create policy "anon_read_reviews"
  on public.reviews for select
  to anon
  using (true);

drop policy if exists "anon_insert_reviews" on public.reviews;
create policy "anon_insert_reviews"
  on public.reviews for insert
  to anon
  with check (
    rating between 1 and 5
    and length(name) between 1 and 100
    and length(message) between 1 and 2000
  );

-- Inquiries: anyone can send a contact message; only the service role can read them.
drop policy if exists "anon_insert_inquiries" on public.inquiries;
create policy "anon_insert_inquiries"
  on public.inquiries for insert
  to anon
  with check (
    length(name) between 1 and 100
    and length(email) between 3 and 254
    and length(message) between 1 and 5000
  );
