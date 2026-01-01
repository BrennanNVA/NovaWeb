create extension if not exists pgcrypto;

create table if not exists public.tickers (
  symbol text primary key,
  is_active boolean not null default true,
  priority integer not null default 0,
  last_article_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  status text not null default 'published',
  title text not null,
  excerpt text,
  body_markdown text not null,
  tickers text[] not null default '{}',
  tags text[] not null default '{}',
  is_breaking boolean not null default false,
  model text,
  prompt_version text,
  market_snapshot jsonb,
  source_news jsonb,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint articles_status_check check (status in ('draft', 'published'))
);

create index if not exists articles_published_at_idx on public.articles (published_at desc);
create index if not exists articles_tickers_idx on public.articles using gin (tickers);
create index if not exists articles_tags_idx on public.articles using gin (tags);

alter table public.tickers enable row level security;
alter table public.articles enable row level security;

drop policy if exists "Public can read tickers" on public.tickers;
create policy "Public can read tickers" on public.tickers
for select
using (true);

drop policy if exists "Public can read published articles" on public.articles;
create policy "Public can read published articles" on public.articles
for select
using (status = 'published');

insert into public.tickers (symbol) values
  ('NVDA'),
  ('AAPL'),
  ('MSFT'),
  ('AMZN'),
  ('GOOGL'),
  ('GOOG'),
  ('META'),
  ('AVGO'),
  ('TSLA'),
  ('BRK.B'),
  ('LLY'),
  ('WMT'),
  ('JPM'),
  ('V'),
  ('ORCL'),
  ('MA'),
  ('XOM'),
  ('JNJ'),
  ('PLTR'),
  ('ABBV'),
  ('BAC'),
  ('NFLX'),
  ('COST'),
  ('AMD'),
  ('HD'),
  ('PG'),
  ('GE'),
  ('MU'),
  ('CVX'),
  ('CSCO'),
  ('KO'),
  ('UNH'),
  ('WFC'),
  ('MS'),
  ('IBM'),
  ('CAT'),
  ('GS'),
  ('MRK'),
  ('AXP'),
  ('PM'),
  ('CRM'),
  ('RTX'),
  ('APP'),
  ('TMUS'),
  ('ABT'),
  ('MCD'),
  ('TMO'),
  ('LRCX'),
  ('C'),
  ('DIS')
on conflict (symbol) do nothing;
