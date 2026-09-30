drop policy "users manage their own reaction" on public.city_reactions;

create policy "users insert their own reaction"
  on public.city_reactions for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "users update their own reaction"
  on public.city_reactions for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "users delete their own reaction"
  on public.city_reactions for delete
  to authenticated
  using ((select auth.uid()) = user_id);
