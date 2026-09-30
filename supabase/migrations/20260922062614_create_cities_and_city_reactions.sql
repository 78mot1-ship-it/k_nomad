-- cities: public read-only reference data
create table public.cities (
  id text primary key,
  name text not null,
  region text not null,
  region_group text not null check (region_group in ('수도권','경상도','전라도','강원도','제주도','충청도')),
  monthly_cost_manwon integer not null check (monthly_cost_manwon > 0),
  budget text not null check (budget in ('100만원','100~200만원','200만원')),
  environment text[] not null check (
    cardinality(environment) between 1 and 2
    and environment <@ array['자연친화','도심선호','카페작업','코워킹 필수']::text[]
  ),
  best_season text not null check (best_season in ('봄','여름','가을','겨울')),
  emoji text not null,
  gradient text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.cities enable row level security;

create policy "cities are publicly readable"
  on public.cities for select
  to anon, authenticated
  using (true);

-- city_reactions: one like/dislike per user per city
create table public.city_reactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  city_id text not null references public.cities(id) on delete cascade,
  reaction_type text not null check (reaction_type in ('like','dislike')),
  created_at timestamptz not null default now(),
  unique (user_id, city_id)
);

alter table public.city_reactions enable row level security;

create policy "reactions are publicly readable"
  on public.city_reactions for select
  to anon, authenticated
  using (true);

create policy "users manage their own reaction"
  on public.city_reactions for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create index city_reactions_city_id_idx on public.city_reactions (city_id);

-- aggregate like/dislike counts, computed at read time (no denormalized counters/triggers)
create view public.city_reaction_counts
with (security_invoker = true) as
  select
    city_id,
    count(*) filter (where reaction_type = 'like') as like_count,
    count(*) filter (where reaction_type = 'dislike') as dislike_count
  from public.city_reactions
  group by city_id;
