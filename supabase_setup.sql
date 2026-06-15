-- =====================================================
-- GONCIK-TECH 3.0 — SUPABASE DATABASE SETUP
-- =====================================================
-- Uruchom ten skrypt w: Supabase Dashboard -> SQL Editor -> New query -> Run
-- To stworzy wszystkie tabele, zabezpieczenia i dane startowe.

-- =========================
-- 1. TWORZENIE TABEL
-- =========================

create table if not exists scripts (
  id bigint primary key generated always as identity,
  name text not null,
  description text,
  category text default 'script',
  tags text[] default '{}',
  features text[] default '{}',
  download_url text,
  is_free boolean default true,
  downloads bigint default 0,
  rating numeric(3,2) default 5.0,
  last_updated date default current_date,
  version text default '1.0.0',
  author text default 'Goncik',
  requirements text[] default '{}',
  featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists tutorials (
  id bigint primary key generated always as identity,
  title text not null,
  excerpt text,
  content text,
  category text default 'script',
  tags text[] default '{}',
  author text default 'Goncik',
  date date default current_date,
  read_time text default '5 min',
  featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists news (
  id bigint primary key generated always as identity,
  title text not null,
  excerpt text,
  content text,
  category text default 'update',
  author text default 'Goncik',
  date date default current_date,
  featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists messages (
  id bigint primary key generated always as identity,
  name text,
  email text,
  subject text,
  message text,
  status text default 'unread',
  replies jsonb default '[]',
  created_at timestamptz default now()
);

-- =========================
-- 2. ROW LEVEL SECURITY
-- =========================
-- Publiczny odczyt dla wszystkich
alter table scripts enable row level security;
alter table tutorials enable row level security;
alter table news enable row level security;
alter table messages enable row level security;

-- Polityka: każdy może czytać
drop policy if exists "Public read scripts" on scripts;
create policy "Public read scripts" on scripts for select using (true);

drop policy if exists "Public read tutorials" on tutorials;
create policy "Public read tutorials" on tutorials for select using (true);

drop policy if exists "Public read news" on news;
create policy "Public read news" on news for select using (true);

-- Polityka: każdy może wysłać wiadomość
drop policy if exists "Public insert messages" on messages;
create policy "Public insert messages" on messages for insert with check (true);

drop policy if exists "Public read messages" on messages;
create policy "Public read messages" on messages for select using (true);

-- UWAGA: Na czas testów dajemy pełne uprawnienia (insert/update/delete) wszystkim.
-- W produkcji powinieneś dodać autentykację admina i ograniczyć te polityki.
drop policy if exists "Public write scripts" on scripts;
create policy "Public write scripts" on scripts for all using (true) with check (true);

drop policy if exists "Public write tutorials" on tutorials;
create policy "Public write tutorials" on tutorials for all using (true) with check (true);

drop policy if exists "Public write news" on news;
create policy "Public write news" on news for all using (true) with check (true);

drop policy if exists "Public update messages" on messages;
create policy "Public update messages" on messages for all using (true) with check (true);

-- =========================
-- 3. DANE STARTOWE
-- =========================

insert into scripts (name, description, category, tags, features, download_url, is_free, downloads, rating, last_updated, version, author, requirements, featured) values
('AI Chat Bypass Pro', 'Zaawansowany bypass do OpenAI GPT-4, Claude i Gemini. Automatyczne rotowanie user-agentów i proxy.', 'bypass', ARRAY['AI','Bypass','OpenAI','Claude','Gemini'], ARRAY['Wysoka skuteczność w testach','Automatyczne proxy rotation','Obsługa wielu modeli jednocześnie','API key management','Logi szczegółowe'], 'https://github.com/goncik-tech/ai-bypass-pro', true, 1567, 4.9, '2024-06-10', '3.2.1', 'Goncik', ARRAY['Python 3.8+','pip install requests'], true),

('Discord Token Generator', 'Narzędzie do generowania i walidacji tokenów Discord. Opcjonalnie z automatycznym verify.', 'script', ARRAY['Discord','Token','Generator','Automation'], ARRAY['Szybkie generowanie tokenów','Walidacja w czasie rzeczywistym','Export do CSV/JSON','Proxy support','Multi-threaded processing'], 'https://github.com/goncik-tech/discord-token-gen', true, 2341, 4.7, '2024-06-08', '2.1.0', 'Goncik', ARRAY['Node.js 16+','npm install'], false),

('Account Checker Ultimate', 'Sprawdzaj konta z różnych serwisów w jednym narzędziu. Netflix, Spotify, Steam i więcej.', 'script', ARRAY['Account','Checker','Netflix','Spotify','Steam'], ARRAY['Obsługa 50+ serwisów','Proxy support','Auto-captcha solving','Wyniki w czasie rzeczywistym','Statystyki i raporty'], 'https://github.com/goncik-tech/account-checker', true, 3892, 4.8, '2024-06-05', '5.4.2', 'Goncik', ARRAY['Python 3.9+','pip install'], true),

('Spotify Premium Bot', 'Automatyczne dodawanie kont premium Spotify. W pełni konfigurowalny i bezpieczny.', 'bot', ARRAY['Spotify','Premium','Bot','Automation'], ARRAY['Auto-add premium accounts','Proxy rotation','Captcha bypass','Logi szczegółowe','Multi-account support'], 'https://github.com/goncik-tech/spotify-bot', true, 1205, 4.6, '2024-06-12', '1.8.3', 'Goncik', ARRAY['Node.js 18+','npm install'], false),

('Email Bomber Pro', 'Zaawansowane narzędzie do masowych emaili. W pełni konfigurowalny z różnymi szablonami.', 'tool', ARRAY['Email','Automation','Templates'], ARRAY['Konfigurowalne szablony','Proxy support','Multi-threaded','Statystyki','Anti-spam bypass'], 'https://github.com/goncik-tech/email-bomber', true, 876, 4.5, '2024-06-01', '4.2.0', 'Goncik', ARRAY['Python 3.8+','pip install'], false),

('Discord Nitro Generator', 'Generator kodów Discord Nitro. Obsługuje różne typy kodów i walidację.', 'generator', ARRAY['Discord','Nitro','Generator','Codes'], ARRAY['Generowanie Nitro codes','Walidacja w czasie rzeczywistym','Obsługa różnych typów','Proxy support','Export wyników'], 'https://github.com/goncik-tech/nitro-gen', true, 4532, 4.9, '2024-06-14', '6.1.0', 'Goncik', ARRAY['Node.js 16+','npm install'], true);

insert into tutorials (title, excerpt, content, category, tags, author, date, read_time, featured) values
('Jak używać AI Chat Bypass Pro?', 'Szczegółowy tutorial jak skonfigurować i używać AI Chat Bypass Pro do omijania zabezpieczeń GPT-4 i Claude.', '<h3>Wstęp</h3><p>AI Chat Bypass Pro to zaawansowane narzędzie do omijania zabezpieczeń OpenAI GPT-4, Claude i Gemini.</p><h3>Krok 1: Instalacja</h3><pre><code>git clone https://github.com/goncik-tech/ai-bypass-pro
cd ai-bypass-pro
pip install -r requirements.txt</code></pre><h3>Krok 2: Konfiguracja</h3><p>Edytuj <code>config.json</code> i dodaj API key oraz proxy.</p><h3>Krok 3: Uruchomienie</h3><pre><code>python bypass_pro.py</code></pre>', 'bypass', ARRAY['AI','Bypass','GPT-4'], 'Goncik', '2024-06-10', '10 min', true),

('Discord Token Generator — konfiguracja krok po kroku', 'Dowiedz się jak poprawnie skonfigurować Discord Token Generator w trybie multi-threaded.', '<h3>Wymagania</h3><p>Node.js 16+ oraz dostęp do proxy.</p><h3>Konfiguracja</h3><pre><code>npm install
node generator.js --threads 8</code></pre>', 'script', ARRAY['Discord','Tutorial'], 'Goncik', '2024-06-08', '6 min', true);

insert into news (title, excerpt, content, category, author, date, featured) values
('AI Chat Bypass Pro 3.2.1 - Nowa wersja!', 'Wydano nową wersję AI Chat Bypass Pro z poprawkami dla GPT-4o.', 'Nowa wersja AI Chat Bypass Pro zawiera istotne poprawki dla najnowszych zabezpieczeń GPT-4o, ulepszone proxy rotation i szybsze działanie.', 'update', 'Goncik', '2024-06-10', true),

('Discord Token Generator 2.1.0 - Nowe funkcje', 'Aktualizacja wprowadza nowe funkcje walidacji i lepszą obsługę proxy.', 'Wersja 2.1.0 dodaje zaawansowaną walidację tokenów, ulepszony system proxy i nowe opcje exportu.', 'update', 'Goncik', '2024-06-08', false),

('Account Checker Ultimate - 5000+ pobrań!', 'Account Checker Ultimate osiągnął 5000 pobrań! Dziękujemy za wsparcie.', 'Jesteśmy dumni z osiągnięcia 5000 pobrań. Kontynuujemy rozwój i dodawanie nowych funkcji.', 'milestone', 'Goncik', '2024-06-05', false),

('Spotify Premium Bot - Nowa integracja API', 'Spotify Premium Bot obsługuje najnowsze API Spotify.', 'Integracja z najnowszym API Spotify przynosi lepszą wydajność i stabilność działania bota.', 'update', 'Goncik', '2024-06-12', true);
