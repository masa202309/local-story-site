alter table public.stories
add column if not exists preview_count integer not null default 0;

create table if not exists public.story_preview_events (
  id bigint generated always as identity primary key,
  story_id uuid not null references public.stories(id) on delete cascade,
  session_id text not null,
  viewed_on date not null default (timezone('Asia/Tokyo', now())::date),
  created_at timestamptz not null default now(),
  constraint story_preview_events_story_session_day_key
    unique (story_id, session_id, viewed_on)
);

create index if not exists story_preview_events_story_id_idx
  on public.story_preview_events (story_id);

create index if not exists story_preview_events_viewed_on_idx
  on public.story_preview_events (viewed_on);

alter table public.story_preview_events enable row level security;

drop function if exists public.record_story_preview(uuid, text, date);
drop function if exists public.record_story_preview(uuid, text);

create or replace function public.record_story_preview(
  p_story_id uuid,
  p_session_id text
)
returns table (
  counted boolean,
  preview_count integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_rows integer := 0;
  next_preview_count integer := 0;
begin
  if p_session_id is null or length(trim(p_session_id)) = 0 then
    raise exception 'session_id is required';
  end if;

  if not exists (
    select 1
    from public.stories
    where id = p_story_id
      and published = true
  ) then
    return query
    select false, coalesce((
      select s.preview_count
      from public.stories s
      where s.id = p_story_id
    ), 0);
    return;
  end if;

  insert into public.story_preview_events (story_id, session_id, viewed_on)
  values (p_story_id, p_session_id, timezone('Asia/Tokyo', now())::date)
  on conflict (story_id, session_id, viewed_on) do nothing;

  get diagnostics inserted_rows = row_count;

  if inserted_rows > 0 then
    update public.stories
    set preview_count = public.stories.preview_count + 1
    where id = p_story_id
      and published = true
    returning public.stories.preview_count into next_preview_count;

    return query select true, next_preview_count;
    return;
  end if;

  select s.preview_count
  into next_preview_count
  from public.stories s
  where s.id = p_story_id;

  return query select false, coalesce(next_preview_count, 0);
end;
$$;

comment on function public.record_story_preview(uuid, text)
is '同一投稿・同一session_id・同一日での重複を防ぎつつ、preview_count を加算する';

grant execute on function public.record_story_preview(uuid, text)
to anon, authenticated;

notify pgrst, 'reload schema';
