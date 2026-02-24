create extension if not exists "uuid-ossp";

create table courses (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  title        text not null,
  slug         text not null,
  description  text,
  outline_json jsonb default '[]',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create table lessons (
  id           uuid primary key default uuid_generate_v4(),
  course_id    uuid references courses(id) on delete cascade not null,
  order_index  integer not null,
  title        text not null,
  content_md   text default '',
  is_generated boolean default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create table chat_messages (
  id         uuid primary key default uuid_generate_v4(),
  course_id  uuid references courses(id) on delete cascade,
  user_id    uuid references auth.users(id) on delete cascade not null,
  role       text check (role in ('user', 'assistant')) not null,
  content    text not null,
  created_at timestamptz default now()
);

alter table courses       enable row level security;
alter table lessons       enable row level security;
alter table chat_messages enable row level security;

create policy "Users own their courses"
  on courses for all using (auth.uid() = user_id);

create policy "Users access their course lessons"
  on lessons for all using (
    exists (
      select 1 from courses
      where courses.id = lessons.course_id
      and courses.user_id = auth.uid()
    )
  );

create policy "Users access their chat messages"
  on chat_messages for all using (auth.uid() = user_id);

create index on courses (user_id);
create index on lessons (course_id, order_index);
create index on chat_messages (course_id, created_at);
