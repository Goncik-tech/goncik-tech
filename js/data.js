// ============================================
// DATABASE - Scripts, Tutorials, News
// ============================================

const scripts = [
    {
        id: 1,
        name: "AI Chat Bypass Pro",
        description: "Zaawansowany bypass do OpenAI GPT-4, Claude, i Gemini. Automatyczne rotowanie user-agentów i proxy.",
        category: "bypass",
        tags: ["AI", "Bypass", "OpenAI", "Claude", "Gemini"],
        features: [
            "Wysoka skuteczność w ostatnich testach",
            "Automatyczne proxy rotation",
            "Obsługa wielu modeli jednocześnie",
            "API key management",
            "Logi szczegółowe"
        ],
        downloadUrl: "https://github.com/goncik-tech/ai-bypass-pro",
        isFree: true,
        downloads: 1567,
        rating: 4.9,
        lastUpdated: "2024-06-10",
        version: "3.2.1",
        author: "Goncik",
        requirements: ["Python 3.8+", "pip install requests"]
    },
    {
        id: 2,
        name: "Discord Token Generator",
        description: "Narzędzie do generowania i walidacji tokenów Discord. Opcjonalnie z automatycznym verify.",
        category: "script",
        tags: ["Discord", "Token", "Generator", "Automation"],
        features: [
            "Szybkie generowanie tokenów",
            "Walidacja w czasie rzeczywistym",
            "Export do CSV/JSON",
            "Proxy support",
            "Multi-threaded processing"
        ],
        downloadUrl: "https://github.com/goncik-tech/discord-token-gen",
        isFree: true,
        downloads: 2341,
        rating: 4.7,
        lastUpdated: "2024-06-08",
        version: "2.1.0",
        author: "Goncik",
        requirements: ["Node.js 16+", "npm install"]
    },
    {
        id: 3,
        name: "Account Checker Ultimate",
        description: "Sprawdzaj konta z różnych serwisów w jednym narzędziu. Netflix, Spotify, Steam i więcej.",
        category: "script",
        tags: ["Account", "Checker", "Netflix", "Spotify", "Steam"],
        features: [
            "Obsługa 50+ serwisów",
            "Proxy support",
            "Auto-captcha solving",
            "Wyniki w czasie rzeczywistym",
            "Statystyki i raporty"
        ],
        downloadUrl: "https://github.com/goncik-tech/account-checker",
        isFree: true,
        downloads: 3892,
        rating: 4.8,
        lastUpdated: "2024-06-05",
        version: "5.4.2",
        author: "Goncik",
        requirements: ["Python 3.9+", "pip install"]
    },
    {
        id: 4,
        name: "Spotify Premium Bot",
        description: "Automatyczne dodawanie kont premium Spotify. W pełni konfigurowalny i bezpieczny.",
        category: "bot",
        tags: ["Spotify", "Premium", "Bot", "Automation"],
        features: [
            "Auto-add premium accounts",
            "Proxy rotation",
            "Captcha bypass",
            "Logi szczegółowe",
            "Multi-account support"
        ],
        downloadUrl: "https://github.com/goncik-tech/spotify-bot",
        isFree: true,
        downloads: 1205,
        rating: 4.6,
        lastUpdated: "2024-06-12",
        version: "1.8.3",
        author: "Goncik",
        requirements: ["Node.js 18+", "npm install"]
    },
    {
        id: 5,
        name: "Email Bomber Pro",
        description: "Zaawansowane narzędzie do masowych emaili. W pełni konfigurowalny z różnymi szablonami.",
        category: "tool",
        tags: ["Email", "Spam", "Automation", "Templates"],
        features: [
            "Konfigurowalne szablony",
            "Proxy support",
            "Multi-threaded",
            "Statystyki",
            "Anti-spam bypass"
        ],
        downloadUrl: "https://github.com/goncik-tech/email-bomber",
        isFree: true,
        downloads: 876,
        rating: 4.5,
        lastUpdated: "2024-06-01",
        version: "4.2.0",
        author: "Goncik",
        requirements: ["Python 3.8+", "pip install"]
    },
    {
        id: 6,
        name: "Discord Nitro Generator",
        description: "Generator kodów Discord Nitro. Obsługuje różne typy kodów i walidację.",
        category: "generator",
        tags: ["Discord", "Nitro", "Generator", "Codes"],
        features: [
            "Generowanie Nitro codes",
            "Walidacja w czasie rzeczywistym",
            "Obsługa różnych typów",
            "Proxy support",
            "Export wyników"
        ],
        downloadUrl: "https://github.com/goncik-tech/nitro-gen",
        isFree: true,
        downloads: 4532,
        rating: 4.9,
        lastUpdated: "2024-06-14",
        version: "6.1.0",
        author: "Goncik",
        requirements: ["Node.js 16+", "npm install"]
    }
];

const tutorials = [
    {
        id: 1,
        title: "Jak używać AI Chat Bypass Pro?",
        excerpt: "Szczegółowy tutorial jak skonfigurować i używać AI Chat Bypass Pro do omijania zabezpieczeń GPT-4 i Claude.",
        content: `
            <h3>Wstęp</h3>
            <p>AI Chat Bypass Pro to zaawansowane narzędzie do omijania zabezpieczeń OpenAI GPT-4, Claude i Gemini.</p>

            <h3>Krok 1: Instalacja</h3>
            <p>Zacznij od sklonowania repozytorium i instalacji zależności:</p>
            <pre><code>git clone https://github.com/goncik-tech/ai-bypass-pro
cd ai-bypass-pro
pip install -r requirements.txt</code></pre>

            <h3>Krok 2: Konfiguracja</h3>
            <p>Edytuj plik config.json i dodaj swoje API key i proxy:</p>
            <pre><code>{
    "api_key": "twój_klucz_api",
    "proxy_list": [
        "proxy1:port",
        "proxy2:port"
    ]
}</code></pre>

            <h3>Krok 3: Uruchomienie</h3>
            <p>Uruchom narzędzie za pomocą:</p>
            <pre><code>python bypass_pro.py</code></pre>

            <h3>Dodatkowe wskazówki</h3>
            <ul>
                <li>Używaj rotacji proxy, aby uniknąć banów</li>
                <li>Regularnie aktualizuj narzędzie</li>
                <li>Przestrzegaj regulaminów używanych serwisów</li>
            </ul>
        `,
        category: "bypass",
        tags: ["AI", "Bypass", "Tutorial", "GPT-4"],
        author: "Goncik",
        date: "2024-06-10",
        readTime: "10 min",
        featured: true
    },
    {
        id: 2,
        title: "Discord Token Generator — konfiguracja krok po kroku",
        excerpt: "Dowiedz się jak poprawnie skonfigurować Discord Token Generator i uruchomić go w trybie multi-threaded.",
        content: `
            <h3>Wymagania</h3>
            <p>Node.js 16+ oraz dostęp do proxy (HTTP/SOCKS5).</p>
            <h3>Konfiguracja</h3>
            <pre><code>npm install
node generator.js --threads 8</code></pre>
        `,
        category: "script",
        tags: ["Discord", "Tutorial"],
        author: "Goncik",
        date: "2024-06-08",
        readTime: "6 min",
        featured: true
    }
];

const news = [
    {
        id: 1,
        title: "AI Chat Bypass Pro 3.2.1 - Nowa wersja!",
        excerpt: "Wydano nową wersję AI Chat Bypass Pro z poprawkami i ulepszeniami dla GPT-4o.",
        content: "Nowa wersja AI Chat Bypass Pro zawiera istotne poprawki dla najnowszych zabezpieczeń GPT-4o, ulepszone proxy rotation i szybsze działanie.",
        category: "update",
        author: "Goncik",
        date: "2024-06-10",
        featured: true
    },
    {
        id: 2,
        title: "Discord Token Generator 2.1.0 - Nowe funkcje",
        excerpt: "Aktualizacja Discord Token Generator wprowadza nowe funkcje walidacji i lepszą obsługę proxy.",
        content: "Wersja 2.1.0 dodaje zaawansowaną walidację tokenów, ulepszony system proxy i nowe opcje exportu.",
        category: "update",
        author: "Goncik",
        date: "2024-06-08",
        featured: false
    },
    {
        id: 3,
        title: "Account Checker Ultimate - 5000+ pobrań!",
        excerpt: "Account Checker Ultimate osiągnął 5000 pobrań! Dziękujemy za wsparcie.",
        content: "Jesteśmy dumni z osiągnięcia 5000 pobrań. Kontynuujemy rozwój i dodawanie nowych funkcji.",
        category: "milestone",
        author: "Goncik",
        date: "2024-06-05",
        featured: false
    },
    {
        id: 4,
        title: "Spotify Premium Bot - Nowa integracja API",
        excerpt: "Spotify Premium Bot teraz obsługuje najnowsze API Spotify z ulepszonym wydajnością.",
        content: "Integracja z najnowszym API Spotify przynosi lepszą wydajność i stabilność działania bota.",
        category: "update",
        author: "Goncik",
        date: "2024-06-12",
        featured: true
    }
];

// Expose globally so app.js can read it without imports
window.data = { scripts: scripts, tutorials: tutorials, news: news };
