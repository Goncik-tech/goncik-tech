# Goncik-tech 🚀

**Nowoczesna strona do udostępniania skryptów, bypassów AI i narzędzi**

Projekt w stylu Kali Linux — ciemny motyw z neonowymi akcentami, Matrix rain w tle i płynnymi animacjami.

---

## 🎨 Design System

- **Tło:** Głęboka czerń `#0a0a0a` z subtelnymi gradientami
- **Kolor akcentowy:** Neon green `#00ff41` + Electric blue `#00d4ff`
- **Efekty:** Glassmorphism, neon glow, glitch hover, typing animation
- **Czcionki:** `JetBrains Mono` (monospace/hacker feel) + `Inter` (body)
- **Animacje:** Matrix rain canvas, typing animation, scroll-reveal, page transitions

---

## 📄 Struktura strony

```
/              → Hero + polecane skrypty
/scripts       → Wszystkie skrypty (z filtrowaniem)
/scripts/:id   → Szczegóły skryptu
/bypassy       → Filtrowane: kategoria bypassów AI
/free          → Tylko darmowe
/tutorials     → Blog / poradniki
/tutorials/:id → Pojedynczy tutorial
/news          → Aktualności
/contact       → Formularz kontaktowy
/*             → Stylowa strona 404
```

---

## 🚀 Jak uruchomić

### Metoda 1: Otwórz bezpośrednio (najprostsza)

Po prostu otwórz `index.html` w przeglądarce:

1. Kliknij dwukrotnie `index.html`
2. Lub przeciągnij `index.html` do okna przeglądarki

### Metoda 2: Użyj Live Server (VS Code)

Jeśli masz VS Code:

1. Zainstaluj rozszerzenie "Live Server"
2. Kliknij prawym przyciskiem na `index.html`
3. Wybierz "Open with Live Server"

### Metoda 3: Python SimpleHTTPServer

Jeśli masz Python:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Otwórz: `http://localhost:8000`

### Metoda 4: Node.js http-server

Jeśli masz Node.js:

```bash
npx http-server
```

Otwórz: `http://localhost:8080`

---

## 📝 Edytowanie danych

### Dodawanie skryptów

Edytuj `js/data.js` w sekcji `scripts`:

```javascript
{
    id: 7, // Unikalne ID
    name: "Twój Skrypt",
    description: "Opis skryptu...",
    category: "bypass", // bypass, script, bot, tool, generator
    tags: ["Tag1", "Tag2", "Tag3"],
    features: [
        "Funkcja 1",
        "Funkcja 2"
    ],
    downloadUrl: "https://github.com/twoj-repo",
    isFree: true, // true = FREE, false = PREMIUM
    downloads: 0,
    rating: 5.0,
    lastUpdated: "2024-06-14",
    version: "1.0.0",
    author: "Twoje Imię",
    requirements: ["Python 3.8+", "pip install"]
}
```

### Dodawanie tutoriale

Edytuj `js/data.js` w sekcji `tutorials`:

```javascript
{
    id: 5,
    title: "Twój Tutorial",
    excerpt: "Krótki opis...",
    content: `
        <h3>Tytuł sekcji</h3>
        <p>Treść...</p>
        <pre><code>Kod...</code></pre>
    `,
    category: "script", // bypass, script, bot, tool
    tags: ["Tag1", "Tag2"],
    author: "Autor",
    date: "2024-06-14",
    readTime: "10 min",
    featured: true // true = pokaż na stronie głównej
}
```

### Dodawanie aktualności

Edytuj `js/data.js` w sekcji `news`:

```javascript
{
    id: 5,
    title: "Nowa aktualizacja",
    excerpt: "Opis...",
    content: "Pełna treść...",
    category: "update", // update, milestone
    author: "Autor",
    date: "2024-06-14",
    featured: true // true = wyróżnione
}
```

---

## 🎨 Customizacja

### Zmiana kolorów

Edytuj `tailwind.config` w `index.html`:

```javascript
theme: {
    extend: {
        colors: {
            neon: {
                green: '#00ff41', // Twój zielony
                blue: '#00d4ff',   // Twój niebieski
                // dodaj więcej...
            },
        },
    },
}
```

### Zmiana czcionek

Edytuj linki Google Fonts w `index.html` i zmień `fontFamily` w `tailwind.config`:

```html
<link href="https://fonts.googleapis.com/css2?family=Twoja+Czcionka&display=swap" rel="stylesheet">
```

```javascript
theme: {
    extend: {
        fontFamily: {
            sans: ['Twoja Czcionka', 'sans-serif'],
            mono: ['Twoja Czcionka Mono', 'monospace'],
        },
    },
}
```

---

## 🌐 Deploy

### Netlify (najprostszy)

1. Prześlij folder projektu do GitHub
2. Zaloguj się na Netlify
3. "New site from Git"
4. Wybierz repozytorium
5. Deploy!

### Vercel

1. Prześlij folder projektu do GitHub
2. Zaloguj się na Vercel
3. "New Project"
4. Wybierz repozytorium
5. Deploy!

### GitHub Pages

1. Prześlij folder do GitHub
2. Idź do Settings → Pages
3. Wybierz branch (np. main)
4. Gotowe!

---

## 📧 Konfiguracja EmailJS (formularz kontaktowy)

1. Zarejestruj się na [EmailJS](https://www.emailjs.com/)
2. Stwórz template emaila
3. Skopiuj Service ID, Template ID i Public Key
4. Edytuj funkcję `handleSubmit` w `js/app.js`:

```javascript
emailjs.send(
    'TWÓJ_SERVICE_ID',
    'TWÓJ_TEMPLATE_ID',
    formData,
    'TWÓJ_PUBLIC_KEY'
)
```

---

## 🛠️ Wymagania przeglądarki

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 📄 Licencja

Ten projekt jest open-source i dostępny na licencji MIT.

---

## 👤 Autor

**Goncik**
- GitHub: [goncik-tech](https://github.com/goncik-tech)
- Discord: goncik-tech

---

## 🙏 Podziękowania

- React — za świetne narzędzie do budowy UI
- Tailwind CSS — za rapid styling
- Framer Motion — za piękne animacje
- Kali Linux — za inspirację designu

---

**Enjoy! 🚀**
*Darmowe skrypty, bypassy AI i narzędzia.*