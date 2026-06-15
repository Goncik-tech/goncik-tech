# Goncik-tech

Nowoczesna strona w stylu cyberpunk do udostępniania skryptów, bypassów AI i narzędzi.
React 18 + Tailwind CSS + lekki serwer Python z zapisem danych.

---

## Funkcje

- **Hero** z animacją Matrix rain w tle
- **Skrypty, Bypassy, Darmowe** — z filtrami (kategoria, cena, wyszukiwarka)
- **Tutoriale** — pełne artykuły z HTML-em
- **Aktualności** — lista newsów z kategoriami
- **Kontakt** — formularz z lokalnym zapisem wiadomości
- **Panel admina** — pełne CRUD na skryptach, tutorialach, newsach + odpowiedzi na wiadomości
- **Zapis do bazy** — każda zmiana w panelu admina automatycznie zapisuje się do pliku `js/data.js`
- **Status API** — wskaźnik online/offline widoczny w navbarze i stopce
- **Toast notifications** — informacje zwrotne po każdej akcji

---

## Uruchomienie

### Wymagania
- Python 3.8+
- Przeglądarka (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)

### Sposób 1 — PowerShell (zalecany)
```powershell
cd "C:\Users\Ignacy\Documents\OPEN_CODE_CTO_AI"
.\StartGoncikTech.ps1
```
Wybierz `S` (start) lub `O` (otwórz w przeglądarce).

### Sposób 2 — Skrypt .bat
```cmd
cd C:\Users\Ignacy\Documents\OPEN_CODE_CTO_AI
START.bat
```

### Sposób 3 — Ręcznie
```powershell
cd "C:\Users\Ignacy\Documents\OPEN_CODE_CTO_AI"
python server_api.py
```

Strona działa pod adresem **http://localhost:8000**.

---

## Panel admina

1. Otwórz stronę i kliknij **"Admin"** (navbar / stopka).
2. Wpisz hasło: **`goncik123`**
3. Zaloguj się — masz dostęp do pełnego panelu z zakładkami:
   - **Overview** — statystyki i opis
   - **Skrypty / Tutoriale / Aktualności** — lista + przyciski `+ Dodaj`, edycja, usuwanie
   - **Wiadomości** — odczyt, odpowiedzi, usuwanie
4. **Każda zmiana zapisuje się automatycznie** do pliku `js/data.js` przez endpoint `POST /api/save`.

> Zmiana hasła: edytuj stałą `ADMIN_PASSWORD` w `js/app.js` (linia ~31).

---

## Struktura projektu

```
OPEN_CODE_CTO_AI/
├── server_api.py          # Serwer Python (HTTP + API zapisu)
├── index.html             # Punkt wejścia (HTML + Tailwind config + style)
├── package.json           # Metadane projektu
├── README.md              # Ten plik
├── START.bat              # Launcher CMD (start + przeglądarka)
├── StartGoncikTech.ps1    # Launcher PowerShell (menu)
├── quick_start.ps1        # Launcher PowerShell (auto-open)
├── start_server.bat       # Prosty launcher CMD
├── 404.html               # Strona błędu 404
└── js/
    ├── app.js             # Cała aplikacja React
    ├── data.js            # Baza danych (skrypty/tutoriale/newsy) — zapisywana przez API
    └── data.backup.js     # Kopia zapasowa (tworzona automatycznie)
```

---

## Architektura

### Frontend (`js/app.js`)
- React 18 (UMD, bez bundlera)
- Babel Standalone — kompilacja JSX w locie
- Tailwind CSS (CDN) — utility classes
- Wszystko w jednym pliku, podzielone na sekcje:
  1. Data layer + API client
  2. Toast system
  3. Hooks (`useScrollReveal`, `useServerStatus`, `useAdminAuth`, `useMessages`)
  4. Matrix rain canvas
  5. UI primitives
  6. Navbar + Footer
  7. Pages (Home, Scripts, Tutorials, News, Contact, 404)
  8. Admin panel (login + dashboard)
  9. Główny `App`

### Backend (`server_api.py`)
- Wbudowany `http.server` Pythona — zero zależności
- Serwuje pliki statyczne
- Endpoint `POST /api/save` — przyjmuje JSON `{scripts, tutorials, news}`, waliduje i zapisuje do `js/data.js`
- Endpoint `POST /api/reset` — przywraca dane z `data.backup.js`
- Endpoint `GET /api/status` — zwraca status serwera

### Dlaczego własny serwer?
Standardowy `python -m http.server` potrafi tylko serwować pliki — nie zapisuje zmian.
`server_api.py` dodaje brakujący kawałek: endpoint, który przyjmuje dane z frontendu
i nadpisuje plik `js/data.js`. Dzięki temu zmiany w panelu admina **przetrwają odświeżenie strony**.

---

## API

### `POST /api/save`
Zapisuje dane do `js/data.js`.

**Body:**
```json
{
  "scripts":   [...],
  "tutorials": [...],
  "news":      [...]
}
```

**Odpowiedź:**
```json
{ "ok": true, "saved": { "scripts": 6, "tutorials": 2, "news": 4 }, "path": "..." }
```

### `GET /api/status`
Zwraca informacje o serwerze.

### `POST /api/reset`
Przywraca dane z `data.backup.js`.

---

## Deploy

### Netlify / Vercel / GitHub Pages
Strona jest w pełni statyczna — po zdeployowaniu **panel admina działa w trybie localStorage**
(pojedynczy użytkownik, brak zapisu na serwer). Aby uzyskać pełny zapis, deploy musi
wspierać Python (np. Railway, Render, Fly.io) — wtedy trzeba dostosować URL API w `js/app.js`.

### Lokalnie (dev)
Użyj `server_api.py` — pełna funkcjonalność z zapisem.

---

## Customizacja

### Kolory neon
Edytuj `tailwind.config` w `index.html`:
```js
colors: {
    neon: {
        green: '#00ff41',
        blue:  '#00d4ff',
        purple:'#bf00ff',
        pink:  '#ff00ff',
        yellow:'#f5d300',
    }
}
```

### Hasło admina
Edytuj `js/app.js`:
```js
const ADMIN_PASSWORD = 'goncik123';
```

### Port serwera
Edytuj `server_api.py` (stała `PORT = 8000`) i `StartGoncikTech.ps1` (zmienna `$port`).

---

## Licencja

MIT

---

**Enjoy!** — darmowe skrypty, bypassy AI i narzędzia.
