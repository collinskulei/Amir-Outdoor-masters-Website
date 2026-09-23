-- Amir Outdoor Masters — Push notification subscriptions
-- Run this once in the Supabase SQL editor.

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

alter table push_subscriptions enable row level security;

-- Only signed-in admins can register/manage devices for push notifications.
create policy "admin all push_subscriptions" on push_subscriptions for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
