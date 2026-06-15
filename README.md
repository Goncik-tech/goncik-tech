# goncik-tech 3.0 — Liquid Cloud Edition

Nowoczesna platforma cloud ze skryptami, bypassami AI i narzędziami dla developerów.
Zbudowana w React 18 + Supabase z designem **Liquid Glass** i animowanymi gradientami.

---

## Funkcje

*   **Cloud Native** — wszystkie dane w Supabase, dostępne globalnie 24/7.
*   **Mobile First** — dodawaj skrypty z telefonu, komputera, tabletu.
*   **Liquid Glass UI** — animowane gradienty, glassmorphism, blur 24px, neonowe akcenty.
*   **Slow Matrix Rain** — spowolniona animacja kodu w tle dla eleganckiego klimatu.
*   **Admin Panel** — pełne CRUD na skryptach, tutorialach, newsach + odpowiedzi na wiadomości.
*   **Real-time Updates** — zmiany widoczne natychmiast dla wszystkich użytkowników.
*   **Skeleton Loaders** — profesjonalne loading states.
*   **Toast Notifications** — informacja zwrotna po każdej akcji.

---

## Szybki Start

### 1. Konfiguracja Supabase (jednorazowo)

1.  Utwórz konto na [supabase.com](https://supabase.com/).
2.  Stwórz nowy projekt.
3.  W panelu Supabase przejdź do **SQL Editor** (ikona `>_` po lewej).
4.  Kliknij **"New query"**, wklej zawartość pliku [`supabase_setup.sql`](./supabase_setup.sql) i kliknij **RUN**.
5.  W pliku `js/app.js` upewnij się, że stałe `SUPABASE_URL` i `SUPABASE_ANON_KEY` wskazują na Twój projekt.

### 2. Uruchomienie lokalne

Strona nie wymaga już lokalnego serwera! Wystarczy:
*   Otwórz `index.html` w przeglądarce — **ale uwaga**: niektóre przeglądarki blokują moduły przy `file://`.
*   **Zalecane:** Użyj VS Code z rozszerzeniem "Live Server" lub uruchom prosty serwer:
    ```bash
    python -m http.server 8000
    ```
    Następnie otwórz `http://localhost:8000`.

### 3. Deploy na GitHub Pages

1.  Wgraj zmiany na GitHub.
2.  Settings → Pages → Source: `main` branch, `/ (root)`.
3.  Po 1-2 minutach strona będzie dostępna pod `https://<twoj-user>.github.io/goncik-tech/`.
4.  Panel admina działa z każdego urządzenia, które ma dostęp do internetu.

---

## Panel Admina

1.  Kliknij **"Admin"** w navbarze lub stopce.
2.  Wpisz hasło: **`goncik123`** (zmień w `js/app.js`).
3.  Zaloguj się — masz dostęp do:
    *   **Overview** — statystyki i opis
    *   **Skrypty / Tutoriale / Aktualności** — pełne CRUD
    *   **Wiadomości** — odczyt, odpowiedzi, usuwanie
4.  **Każda zmiana zapisuje się natychmiast** do bazy Supabase i jest widoczna dla wszystkich.

---

## Struktura Projektu

```
goncik-tech/
├── index.html              # Punkt wejścia (HTML + Tailwind + style)
├── supabase_setup.sql      # Skrypt SQL do setupu bazy (tabele + RLS + dane)
├── package.json            # Metadane projektu
├── README.md               # Ten plik
├── .gitignore              # Ignorowane pliki
└── js/
    └── app.js              # Cała aplikacja React (single-file)
```

---

## Architektura

### Frontend
*   **React 18** (UMD, bez bundlera)
*   **Babel Standalone** — kompilacja JSX w przeglądarce
*   **Tailwind CSS** (CDN) — utility classes
*   **@supabase/supabase-js** (CDN) — klient bazy danych

### Backend
*   **Supabase** — baza danych PostgreSQL w chmurze
*   **Row Level Security** — publiczny odczyt, zapis przez panel admina
*   **API Auto-generated** — RESTful API przez PostgREST

### Dlaczego Supabase zamiast własnego serwera?
*   **Zero konfiguracji** — nie trzeba uruchamiać żadnego serwera.
*   **Globalny dostęp** — dane są dostępne 24/7 z każdego urządzenia.
*   **Skalowalność** — Supabase automatycznie skaluje bazę danych.
*   **Real-time** — opcjonalnie można włączyć subskrypcje real-time.
*   **Bezpieczeństwo** — RLS chroni dane przed nieautoryzowanym dostępem.

---

## API Supabase

Frontend korzysta z tabel:
*   `scripts` — skrypty (id, name, description, category, tags, features, download_url, is_free, downloads, rating, last_updated, version, author, requirements, featured)
*   `tutorials` — tutoriale (id, title, excerpt, content, category, tags, author, date, read_time, featured)
*   `news` — aktualności (id, title, excerpt, content, category, author, date, featured)
*   `messages` — wiadomości z formularza kontaktowego (id, name, email, subject, message, status, replies, created_at)

---

## Customizacja

### Kolory Liquid Glass
Edytuj `tailwind.config` w `index.html`:
```js
colors: {
    neon: {
        green: '#00ff88',
        blue:  '#00d4ff',
        purple:'#a855f7',
        pink:  '#ff006e',
        yellow:'#f5d300',
    }
}
```

### Prędkość Matrix Rain
Edytuj w `js/app.js` (funkcja `MatrixRain`):
```js
const fps = 24; // Im mniej, tym wolniej (default 24)
drops[i] += 0.45; // Prędkość opadania (default 0.45)
```

### Hasło admina
Edytuj `js/app.js`:
```js
const ADMIN_PASSWORD = 'goncik123';
```

### Supabase URL i klucz
Edytuj `js/app.js`:
```js
const SUPABASE_URL = 'https://twoj-projekt.supabase.co';
const SUPABASE_ANON_KEY = 'twoj-anon-key';
```

---

## Bezpieczeństwo

⚠️ **Ważne dla produkcji:**

Aktualna konfiguracja RLS (w `supabase_setup.sql`) pozwala **każdemu** na dodawanie/modyfikację danych. To celowe na czas developmentu. W produkcji:

1.  Włącz **Supabase Auth** (email/hasło, OAuth, magic link).
2.  Dodaj kolumnę `user_id` w tabelach.
3.  Zmień polityki RLS, aby tylko zalogowani użytkownicy z odpowiednimi uprawnieniami mogli edytować.
4.  Przenieś logowanie admina do Supabase Auth (zamiast prostego hasła w kodzie).

---

## Licencja

MIT

---

**Enjoy!** — darmowe skrypty, bypassy AI i narzędzia, w chmurze.
