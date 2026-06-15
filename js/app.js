/* =========================================================
   GONCIK-TECH — pełna aplikacja React (czysty, modularny)
   - Wygląd: cyberpunk / glassmorphism / neon
   - Dane: ładowane z window.data, zapisywane przez POST /api/save
   - Brak zewnętrznych zależności poza React + Babel
   ========================================================= */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* =========================================================
   1. Data layer + API
   ========================================================= */
const API = {
    async status() {
        try {
            const r = await fetch('/api/status');
            return await r.json();
        } catch (e) { return { status: 'offline', error: String(e) }; }
    },
    async save(payload) {
        const r = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        return r.json();
    },
    async reset() {
        const r = await fetch('/api/reset', { method: 'POST' });
        return r.json();
    },
};

const ADMIN_PASSWORD = 'goncik123';

const initialData = (() => {
    if (typeof window !== 'undefined' && window.data) {
        return {
            scripts: Array.isArray(window.data.scripts) ? window.data.scripts : [],
            tutorials: Array.isArray(window.data.tutorials) ? window.data.tutorials : [],
            news: Array.isArray(window.data.news) ? window.data.news : [],
        };
    }
    return { scripts: [], tutorials: [], news: [] };
})();

/* =========================================================
   2. Toast system
   ========================================================= */
const ToastContext = React.createContext({ push: () => {} });
function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const push = useCallback((text, type = 'success') => {
        const id = Date.now() + Math.random();
        setToasts((t) => [...t, { id, text, type }]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
    }, []);
    return (
        <ToastContext.Provider value={{ push }}>
            {children}
            <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`toast-enter glass-strong rounded-lg px-4 py-3 font-mono text-sm flex items-center gap-2 min-w-[220px] ${
                            t.type === 'error' ? 'border-red-500/50' : t.type === 'info' ? 'border-neon-blue/50' : 'border-neon-green/50'
                        }`}
                    >
                        <span className={`dot ${t.type === 'error' ? 'dot-red' : t.type === 'info' ? 'dot-yellow' : 'dot-green'}`}></span>
                        <span className="text-gray-100">{t.text}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
const useToast = () => React.useContext(ToastContext);

/* =========================================================
   3. Hooks
   ========================================================= */
function useScrollReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (!ref.current) return;
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
            },
            { threshold: 0.12 }
        );
        obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
}

function useServerStatus() {
    const [status, setStatus] = useState('checking');
    useEffect(() => {
        let alive = true;
        const check = async () => {
            const r = await API.status();
            if (alive) setStatus(r.status === 'ok' ? 'online' : 'offline');
        };
        check();
        const id = setInterval(check, 5000);
        return () => { alive = false; clearInterval(id); };
    }, []);
    return status;
}

function useAdminAuth() {
    const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('goncik_admin') === '1');

    const login = (pwd) => {
        if (pwd === ADMIN_PASSWORD) {
            localStorage.setItem('goncik_admin', '1');
            setIsAdmin(true);
            return true;
        }
        return false;
    };
    const logout = () => {
        localStorage.removeItem('goncik_admin');
        setIsAdmin(false);
    };
    return { isAdmin, login, logout };
}

function useMessages() {
    const [messages, setMessages] = useState(() => {
        try { return JSON.parse(localStorage.getItem('goncik_messages') || '[]'); }
        catch { return []; }
    });

    useEffect(() => { localStorage.setItem('goncik_messages', JSON.stringify(messages)); }, [messages]);

    const addMessage = (m) => {
        const item = { id: Date.now() + Math.random(), timestamp: new Date().toISOString(), status: 'unread', replies: [], ...m };
        setMessages((arr) => [item, ...arr]);
        return item;
    };
    const markRead = (id) => setMessages((arr) => arr.map((m) => m.id === id ? { ...m, status: 'read' } : m));
    const reply = (id, text) => {
        const replyItem = { id: Date.now() + Math.random(), text, timestamp: new Date().toISOString(), isAdmin: true };
        setMessages((arr) => arr.map((m) => m.id === id ? { ...m, replies: [...(m.replies || []), replyItem], status: 'replied' } : m));
    };
    const remove = (id) => setMessages((arr) => arr.filter((m) => m.id !== id));
    return { messages, addMessage, markRead, reply, remove };
}

/* =========================================================
   4. Matrix rain (canvas) - zachowany, lekko poprawiony
   ========================================================= */
function MatrixRain() {
    useEffect(() => {
        const canvas = document.getElementById('matrix-rain');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*';
        let drops = [];
        let w = 0, h = 0;

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            const fontSize = 16;
            const cols = Math.floor(w / fontSize);
            drops = new Array(cols).fill(0).map(() => Math.random() * h / fontSize);
            canvas.dataset.fontSize = fontSize;
        };
        resize();
        window.addEventListener('resize', resize);

        let raf;
        const draw = () => {
            ctx.fillStyle = 'rgba(7, 7, 8, 0.06)';
            ctx.fillRect(0, 0, w, h);
            const fontSize = parseInt(canvas.dataset.fontSize, 10);
            ctx.font = `${fontSize}px JetBrains Mono`;
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;
                // head brighter
                ctx.fillStyle = '#aaffaa';
                ctx.fillText(text, x, y);
                ctx.fillStyle = 'rgba(0, 255, 65, 0.6)';
                ctx.fillText(text, x, y);
                if (y > h && Math.random() > 0.975) drops[i] = 0;
                drops[i] += 0.9;
            }
            raf = requestAnimationFrame(draw);
        };
        raf = requestAnimationFrame(draw);

        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, []);
    return null;
}

/* =========================================================
   5. UI primitives
   ========================================================= */
function Logo({ onClick, size = 'md' }) {
    const dim = size === 'sm' ? 32 : 40;
    return (
        <button onClick={onClick} className="flex items-center gap-2 group">
            <div className="relative" style={{ width: dim, height: dim }}>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-neon-green via-neon-blue to-neon-purple opacity-90 group-hover:opacity-100 transition" />
                <div className="absolute inset-[2px] rounded-md bg-kali-black flex items-center justify-center">
                    <span className="font-mono font-bold text-neon-green" style={{ fontSize: dim * 0.5 }}>G</span>
                </div>
            </div>
            <div className="leading-tight text-left">
                <div className="font-mono font-bold text-base sm:text-lg text-white">goncik<span className="text-neon-green">-tech</span></div>
                <div className="font-mono text-[10px] text-gray-500 hidden sm:block">scripts • bypasses • tools</div>
            </div>
        </button>
    );
}

function StatusBadge({ status }) {
    const map = {
        online: { color: 'dot-green', text: 'API: online' },
        offline: { color: 'dot-red', text: 'API: offline' },
        checking: { color: 'dot-yellow', text: 'API: sprawdzanie…' },
    };
    const s = map[status] || map.checking;
    return (
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md glass text-[11px] font-mono text-gray-300">
            <span className={`dot ${s.color}`}></span>{s.text}
        </span>
    );
}

function Modal({ open, onClose, children, maxWidth = 'max-w-md' }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className={`glass-strong rounded-xl w-full ${maxWidth} max-h-[92vh] overflow-hidden flex flex-col`} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

/* =========================================================
   6. Navbar + Footer
   ========================================================= */
const NAV = [
    { id: 'home', label: 'Home' },
    { id: 'scripts', label: 'Skrypty' },
    { id: 'bypassy', label: 'Bypassy' },
    { id: 'free', label: 'Darmowe' },
    { id: 'tutorials', label: 'Tutoriale' },
    { id: 'news', label: 'News' },
    { id: 'contact', label: 'Kontakt' },
];

function Navbar({ currentPage, setCurrentPage, status, onAdminClick, isAdmin }) {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
            <div className={`mx-auto px-4 transition-all ${scrolled ? 'max-w-6xl' : 'max-w-7xl'}`}>
                <div className={`glass rounded-2xl px-4 sm:px-5 py-3 flex items-center justify-between`}>
                    <Logo onClick={() => setCurrentPage('home')} />
                    <nav className="hidden lg:flex items-center gap-1">
                        {NAV.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setCurrentPage(item.id)}
                                className={`relative px-3 py-1.5 rounded-md font-mono text-sm transition ${
                                    currentPage === item.id
                                        ? 'text-neon-green bg-neon-green/5'
                                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {item.label}
                                {currentPage === item.id && (
                                    <span className="absolute left-3 right-3 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-neon-green to-transparent" />
                                )}
                            </button>
                        ))}
                    </nav>
                    <div className="flex items-center gap-2">
                        <div className="hidden md:block"><StatusBadge status={status} /></div>
                        <button
                            onClick={onAdminClick}
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs border border-neon-green/40 text-neon-green hover:bg-neon-green/10 transition"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 1l3 6 6 1-4.5 4.5L18 19l-6-3-6 3 1.5-6.5L3 8l6-1z" />
                            </svg>
                            {isAdmin ? 'Panel' : 'Admin'}
                        </button>
                        <button onClick={() => setOpen((v) => !v)} className="lg:hidden p-2 rounded-md text-neon-green hover:bg-white/5" aria-label="Menu">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
                            </svg>
                        </button>
                    </div>
                </div>
                {open && (
                    <div className="lg:hidden mt-2 glass rounded-2xl p-2 menu-anim">
                        {NAV.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { setCurrentPage(item.id); setOpen(false); }}
                                className={`w-full text-left px-3 py-2 rounded-md font-mono text-sm ${
                                    currentPage === item.id ? 'text-neon-green bg-neon-green/10' : 'text-gray-200 hover:bg-white/5'
                                }`}
                            >{item.label}</button>
                        ))}
                        <button
                            onClick={() => { onAdminClick(); setOpen(false); }}
                            className="w-full text-left px-3 py-2 rounded-md font-mono text-sm text-neon-green hover:bg-neon-green/10"
                        >{isAdmin ? 'Panel admina' : 'Logowanie admina'}</button>
                    </div>
                )}
            </div>
        </header>
    );
}

function Footer({ isAdmin, onAdminClick, onLogout, status }) {
    return (
        <footer className="relative mt-24 border-t border-kali-border bg-kali-dark/50">
            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="col-span-2">
                    <Logo size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
                    <p className="text-sm text-gray-400 mt-3 max-w-sm">
                        Darmowe i płatne skrypty, bypassy do AI i inne narzędzia.
                        Nowoczesne rozwiązania dla developerów.
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <a href="https://github.com/goncik-tech" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-gray-300 hover:text-neon-green hover-glow" aria-label="GitHub">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/></svg>
                        </a>
                        <a href="https://discord.gg/goncik-tech" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-gray-300 hover:text-neon-blue hover-glow" aria-label="Discord">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 4.4a19.8 19.8 0 0 0-4.9-1.5l-.2.4a18 18 0 0 1 4.4 1.4 16 16 0 0 0-15.2 0 18 18 0 0 1 4.4-1.4l-.2-.4A19.8 19.8 0 0 0 3.7 4.4 20 20 0 0 0 .1 17.7a20 20 0 0 0 6 3l1.2-1.7a13 13 0 0 1-2-.9l.5-.4a14 14 0 0 0 12.4 0l.5.4a13 13 0 0 1-2 .9l1.2 1.7a20 20 0 0 0 6-3 20 20 0 0 0-3.6-13.3zM8.5 15.1c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-.9 2.4-2.2 2.4zm7 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4z"/></svg>
                        </a>
                    </div>
                </div>
                <div>
                    <h4 className="font-mono font-bold text-white mb-3 text-sm">Narzędzia</h4>
                    <ul className="space-y-2 text-sm">
                        {NAV.slice(1, 4).map((i) => (
                            <li key={i.id}><a onClick={() => window.dispatchEvent(new CustomEvent('nav', { detail: i.id }))} className="text-gray-400 hover:text-neon-green cursor-pointer">{i.label}</a></li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-mono font-bold text-white mb-3 text-sm">Zasoby</h4>
                    <ul className="space-y-2 text-sm">
                        {NAV.slice(4).map((i) => (
                            <li key={i.id}><a onClick={() => window.dispatchEvent(new CustomEvent('nav', { detail: i.id }))} className="text-gray-400 hover:text-neon-blue cursor-pointer">{i.label}</a></li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="border-t border-kali-border">
                <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-gray-500">
                    <div>© {new Date().getFullYear()} Goncik-tech. All rights reserved.</div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={status} />
                        {isAdmin ? (
                            <>
                                <button onClick={onAdminClick} className="text-neon-green hover:text-neon-blue">Panel admina</button>
                                <span className="text-gray-700">|</span>
                                <button onClick={onLogout} className="text-red-400 hover:text-red-300">Wyloguj</button>
                            </>
                        ) : (
                            <button onClick={onAdminClick} className="text-gray-500 hover:text-neon-green">Logowanie admina</button>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}

/* =========================================================
   7. Pages
   ========================================================= */
function Hero({ setCurrentPage }) {
    const phrases = useMemo(() => [
        'skrypty, bypassy, narzędzia AI',
        'nowoczesne narzędzia dla devów',
        'bezpieczne. szybkie. open-source.',
    ], []);
    const [idx, setIdx] = useState(0);
    const [text, setText] = useState('');
    const [phase, setPhase] = useState('typing'); // typing | pause | deleting

    useEffect(() => {
        const current = phrases[idx];
        let t;
        if (phase === 'typing') {
            if (text.length < current.length) t = setTimeout(() => setText(current.slice(0, text.length + 1)), 55);
            else t = setTimeout(() => setPhase('pause'), 1400);
        } else if (phase === 'pause') {
            t = setTimeout(() => setPhase('deleting'), 200);
        } else {
            if (text.length > 0) t = setTimeout(() => setText(text.slice(0, -1)), 25);
            else { setIdx((idx + 1) % phrases.length); setPhase('typing'); }
        }
        return () => clearTimeout(t);
    }, [text, phase, idx, phrases]);

    return (
        <section className="relative min-h-screen flex items-center justify-center grid-bg overflow-hidden">
            <div className="absolute inset-0 hero-bg" />
            <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-6 text-xs font-mono text-gray-300">
                    <span className="dot dot-green"></span>
                    <span>v3.0 — Nowy panel admina z zapisem do bazy</span>
                </div>
                <h1 className="font-extrabold text-4xl sm:text-6xl md:text-7xl leading-tight tracking-tight">
                    <span className="block text-white">Witaj w</span>
                    <span className="gradient-text animate-gradient-x bg-[length:200%_200%]">goncik-tech</span>
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-gray-300 font-mono min-h-[2.5rem]">
                    <span className="text-neon-green">{text}</span>
                    <span className="typing-cursor"></span>
                </p>
                <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                    Darmowe i płatne skrypty, bypassy do AI i inne narzędzia.
                    Zautomatyzuj swój workflow i zwiększ efektywność.
                </p>
                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                    <button onClick={() => setCurrentPage('scripts')} className="btn-primary inline-flex items-center gap-2">
                        <span>Przeglądaj skrypty</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                    <button onClick={() => setCurrentPage('tutorials')} className="btn-ghost">Zobacz tutoriale</button>
                </div>
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                    {[
                        { v: '15+', l: 'Skryptów' },
                        { v: '5k+', l: 'Pobrań' },
                        { v: '2k+', l: 'Użytkowników' },
                        { v: '10+', l: 'Tutoriali' },
                    ].map((s) => (
                        <div key={s.l} className="glass rounded-xl p-4">
                            <div className="font-mono text-2xl font-bold text-neon-green">{s.v}</div>
                            <div className="text-xs text-gray-400 font-mono">{s.l}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-neon-green animate-bounce">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
            </div>
        </section>
    );
}

function ScriptCard({ script, onClick, compact = false }) {
    return (
        <div onClick={onClick} className={`glass rounded-xl p-5 cursor-pointer card-hover group ${compact ? '' : ''}`}>
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center text-black font-bold">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <div className="min-w-0">
                        <div className="font-mono font-bold text-white truncate group-hover:text-neon-green transition">{script.name}</div>
                        <div className="text-[11px] font-mono text-gray-500">v{script.version} • {script.lastUpdated}</div>
                    </div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full font-bold ${script.isFree ? 'bg-neon-green text-black' : 'bg-neon-blue text-black'}`}>
                    {script.isFree ? 'FREE' : 'PREMIUM'}
                </span>
            </div>
            <p className="text-sm text-gray-400 line-clamp-2 mb-3">{script.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
                {(script.tags || []).slice(0, 3).map((t, i) => (
                    <span key={i} className="chip">{t}</span>
                ))}
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>{(script.downloads || 0).toLocaleString()}</span>
                    <span className="flex items-center gap-1 text-neon-yellow"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>{script.rating || '—'}</span>
                </div>
                <span className="text-neon-green group-hover:translate-x-1 transition">Więcej →</span>
            </div>
        </div>
    );
}

function ScriptsPage({ scripts, setCurrentPage, setSelected, filter = 'all' }) {
    const [category, setCategory] = useState('all');
    const [price, setPrice] = useState('all');
    const [q, setQ] = useState('');

    let base = scripts;
    if (filter === 'bypass') base = base.filter((s) => s.category === 'bypass');
    if (filter === 'free') base = base.filter((s) => s.isFree);

    const filtered = base.filter((s) => {
        if (category !== 'all' && s.category !== category) return false;
        if (price === 'free' && !s.isFree) return false;
        if (price === 'premium' && s.isFree) return false;
        if (q) {
            const Q = q.toLowerCase();
            const hay = `${s.name} ${s.description} ${(s.tags || []).join(' ')}`.toLowerCase();
            if (!hay.includes(Q)) return false;
        }
        return true;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 pt-28 pb-16">
            <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
                    {filter === 'bypass' ? 'Bypassy AI' : filter === 'free' ? 'Darmowe skrypty' : 'Wszystkie skrypty'}
                </h1>
                <p className="text-gray-400 mt-2">Przeglądaj całą kolekcję narzędzi — od skryptów po boty.</p>
            </header>
            <div className="glass rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">Kategoria</label>
                    <select className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="all">Wszystkie</option>
                        <option value="bypass">bypass</option>
                        <option value="script">script</option>
                        <option value="bot">bot</option>
                        <option value="tool">tool</option>
                        <option value="generator">generator</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">Cena</label>
                    <select className="field" value={price} onChange={(e) => setPrice(e.target.value)}>
                        <option value="all">Wszystkie</option>
                        <option value="free">Darmowe</option>
                        <option value="premium">Premium</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">Szukaj</label>
                    <input className="field" placeholder="nazwa, opis, tag…" value={q} onChange={(e) => setQ(e.target.value)} />
                </div>
            </div>
            <div className="text-sm font-mono text-gray-400 mb-4">
                Znaleziono <span className="text-neon-green">{filtered.length}</span> skryptów
            </div>
            {filtered.length === 0 ? (
                <div className="glass rounded-xl p-12 text-center text-gray-400 font-mono">Brak wyników dla podanych filtrów.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((s) => (
                        <ScriptCard key={s.id} script={s} onClick={() => { setSelected(s); setCurrentPage('script-detail'); }} />
                    ))}
                </div>
            )}
        </div>
    );
}

function ScriptDetailPage({ script, setCurrentPage }) {
    if (!script) return (
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-16 text-center">
            <p className="text-gray-400 font-mono">Nie znaleziono skryptu.</p>
            <button onClick={() => setCurrentPage('scripts')} className="mt-4 btn-ghost">Wróć do listy</button>
        </div>
    );
    return (
        <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">
            <button onClick={() => setCurrentPage('scripts')} className="mb-6 font-mono text-sm text-gray-400 hover:text-neon-green inline-flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Wróć do skryptów
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass rounded-2xl p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                            <h1 className="font-mono text-2xl sm:text-3xl font-bold text-white">{script.name}</h1>
                            <div className="text-sm text-gray-400 font-mono mt-1 flex flex-wrap gap-3">
                                <span>v{script.version}</span>
                                <span>{(script.downloads || 0).toLocaleString()} pobrań</span>
                                <span>★ {script.rating || '—'}</span>
                                <span>{script.lastUpdated}</span>
                            </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-mono rounded-full font-bold ${script.isFree ? 'bg-neon-green text-black' : 'bg-neon-blue text-black'}`}>
                            {script.isFree ? 'FREE' : 'PREMIUM'}
                        </span>
                    </div>
                    <p className="text-gray-300 mb-6">{script.description}</p>
                    <Section title="Funkcje" items={script.features} icon="check" />
                    <Section title="Wymagania" items={script.requirements} icon="cube" />
                    {script.tags?.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-mono text-sm font-bold text-neon-green mb-2">Tagi</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {script.tags.map((t, i) => <span key={i} className="chip">{t}</span>)}
                            </div>
                        </div>
                    )}
                </div>
                <aside>
                    <div className="glass rounded-2xl p-6 sticky top-24">
                        <h3 className="font-mono font-bold text-white mb-4">Pobierz</h3>
                        <a href={script.downloadUrl} target="_blank" rel="noreferrer" className="block w-full btn-primary text-center mb-3">
                            Pobierz {script.isFree ? 'za darmo' : ''}
                        </a>
                        <a href={script.downloadUrl} target="_blank" rel="noreferrer" className="block w-full btn-ghost text-center text-sm">
                            Zobacz na GitHub
                        </a>
                        <hr className="border-kali-border my-4" />
                        <dl className="text-sm space-y-2 font-mono">
                            <div className="flex justify-between"><dt className="text-gray-400">Autor</dt><dd className="text-white">{script.author}</dd></div>
                            <div className="flex justify-between"><dt className="text-gray-400">Wersja</dt><dd className="text-white">{script.version}</dd></div>
                            <div className="flex justify-between"><dt className="text-gray-400">Aktualizacja</dt><dd className="text-white">{script.lastUpdated}</dd></div>
                        </dl>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function Section({ title, items, icon }) {
    if (!items || items.length === 0) return null;
    const stroke = icon === 'check' ? '#00ff41' : '#00d4ff';
    return (
        <div className="mt-6">
            <h3 className="font-mono text-sm font-bold text-neon-green mb-2">{title}</h3>
            <ul className="space-y-2">
                {items.map((it, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" className="mt-0.5 flex-shrink-0">
                            {icon === 'check' ? <path d="M20 6L9 17l-5-5"/> : <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>}
                        </svg>
                        <span>{it}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function TutorialsPage({ tutorials, setCurrentPage, setSelectedTutorial }) {
    const featured = tutorials.filter((t) => t.featured);
    return (
        <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">
            <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold gradient-text">Tutoriale</h1>
                <p className="text-gray-400 mt-2">Poradniki, konfiguracje krok po kroku i best practices.</p>
            </header>
            {tutorials.length === 0 ? (
                <div className="glass rounded-xl p-12 text-center text-gray-400 font-mono">Brak tutoriali. Dodaj je w panelu admina.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tutorials.map((t) => (
                        <div key={t.id} onClick={() => { setSelectedTutorial(t); setCurrentPage('tutorial-detail'); }} className="glass rounded-xl p-5 card-hover cursor-pointer group">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="chip-blue">{t.category}</span>
                                <span className="text-[11px] font-mono text-gray-500">{t.readTime}</span>
                            </div>
                            <h3 className="font-mono font-bold text-white mb-2 line-clamp-2 group-hover:text-neon-blue transition">{t.title}</h3>
                            <p className="text-sm text-gray-400 line-clamp-2 mb-3">{t.excerpt}</p>
                            <div className="text-[11px] font-mono text-gray-500 flex items-center justify-between">
                                <span>{t.date}</span>
                                <span className="text-neon-green group-hover:translate-x-1 transition">Czytaj →</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function TutorialDetailPage({ tutorial, setCurrentPage }) {
    if (!tutorial) return null;
    return (
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
            <button onClick={() => setCurrentPage('tutorials')} className="mb-6 font-mono text-sm text-gray-400 hover:text-neon-green inline-flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Wróć
            </button>
            <article className="glass rounded-2xl p-6 sm:p-10">
                <div className="flex items-center gap-2 mb-3 text-xs font-mono">
                    <span className="chip-blue">{tutorial.category}</span>
                    <span className="text-gray-500">{tutorial.readTime}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">{tutorial.date}</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">{tutorial.title}</h1>
                <p className="text-gray-400 mb-6">{tutorial.excerpt}</p>
                <div className="prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: tutorial.content || '' }} />
            </article>
        </div>
    );
}

function NewsPage({ news }) {
    return (
        <div className="max-w-5xl mx-auto px-4 pt-28 pb-16">
            <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold gradient-text">Aktualności</h1>
                <p className="text-gray-400 mt-2">Najnowsze wydania, kamienie milowe i aktualizacje.</p>
            </header>
            {news.length === 0 ? (
                <div className="glass rounded-xl p-12 text-center text-gray-400 font-mono">Brak aktualności.</div>
            ) : (
                <div className="space-y-4">
                    {news.map((n) => (
                        <div key={n.id} className="glass rounded-xl p-5 card-hover">
                            <div className="flex flex-wrap items-center gap-2 mb-2 text-xs font-mono">
                                <span className={`chip ${n.category === 'milestone' ? 'chip-yellow' : n.category === 'feature' ? 'chip-purple' : 'chip-blue'}`}>{n.category}</span>
                                {n.featured && <span className="chip">★ wyróżnione</span>}
                                <span className="text-gray-500">{n.date}</span>
                            </div>
                            <h2 className="font-mono font-bold text-xl text-white mb-1">{n.title}</h2>
                            <p className="text-sm text-gray-400 mb-2">{n.excerpt}</p>
                            <p className="text-sm text-gray-300">{n.content}</p>
                            <div className="text-[11px] text-gray-500 font-mono mt-3">— {n.author}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ContactPage({ addMessage }) {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const toast = useToast();

    const onSubmit = (e) => {
        e.preventDefault();
        setSending(true);
        setTimeout(() => {
            addMessage(form);
            setSending(false);
            setSent(true);
            setForm({ name: '', email: '', subject: '', message: '' });
            toast.push('Wiadomość wysłana ✓', 'success');
            setTimeout(() => setSent(false), 3000);
        }, 700);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
            <header className="mb-8 text-center">
                <h1 className="text-3xl sm:text-4xl font-bold gradient-text">Kontakt</h1>
                <p className="text-gray-400 mt-2">Masz pytanie? Napisz do nas — odpowiemy najszybciej jak to możliwe.</p>
            </header>
            <form onSubmit={onSubmit} className="glass rounded-2xl p-6 sm:p-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-mono text-gray-400 mb-1.5">Imię</label>
                        <input className="field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Twoje imię" />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-gray-400 mb-1.5">Email</label>
                        <input type="email" className="field" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="twoj@email.com" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">Temat</label>
                    <input className="field" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Temat wiadomości" />
                </div>
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">Wiadomość</label>
                    <textarea rows={6} className="field resize-none" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Twoja wiadomość…" />
                </div>
                <button type="submit" className="btn-primary w-full inline-flex items-center justify-center gap-2" disabled={sending}>
                    {sending ? <><span className="spinner"></span>Wysyłanie…</> : (sent ? 'Wysłano ✓' : 'Wyślij wiadomość')}
                </button>
            </form>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                    { name: 'Discord', v: 'discord.gg/goncik-tech', c: 'green' },
                    { name: 'GitHub', v: 'github.com/goncik-tech', c: 'blue' },
                    { name: 'Email', v: 'contact@goncik.tech', c: 'purple' },
                ].map((c) => (
                    <div key={c.name} className="glass rounded-xl p-4 text-center card-hover">
                        <div className={`text-xs font-mono mb-1 ${c.c === 'green' ? 'text-neon-green' : c.c === 'blue' ? 'text-neon-blue' : 'text-neon-purple'}`}>{c.name}</div>
                        <div className="text-sm text-gray-300 font-mono break-all">{c.v}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function NotFoundPage({ setCurrentPage }) {
    return (
        <div className="min-h-screen flex items-center justify-center grid-bg">
            <div className="text-center px-4">
                <div className="font-mono text-8xl sm:text-9xl font-bold gradient-text animate-pulse-slow">404</div>
                <h2 className="font-mono text-2xl sm:text-3xl text-white mt-4 mb-2">Nie znaleziono strony</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">Wygląda na to, że ta strona nie istnieje lub została usunięta.</p>
                <button onClick={() => setCurrentPage('home')} className="btn-primary">Wróć na stronę główną</button>
            </div>
        </div>
    );
}

/* =========================================================
   8. Admin panel (login + dashboard)
   ========================================================= */
function AdminLoginModal({ open, onClose, onLogin }) {
    const [pwd, setPwd] = useState('');
    const [err, setErr] = useState('');
    const submit = (e) => {
        e.preventDefault();
        if (onLogin(pwd)) { onClose(); setPwd(''); setErr(''); }
        else setErr('Nieprawidłowe hasło');
    };
    return (
        <Modal open={open} onClose={onClose} maxWidth="max-w-md">
            <form onSubmit={submit} className="p-6 sm:p-8">
                <h3 className="font-mono text-xl font-bold text-neon-green mb-1">Panel admina</h3>
                <p className="text-xs text-gray-400 mb-5">Zaloguj się, aby zarządzać skryptami, tutorialami i aktualnościami.</p>
                <label className="block text-xs font-mono text-gray-400 mb-1.5">Hasło</label>
                <input type="password" autoFocus className="field" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="••••••••" />
                {err && <div className="mt-2 text-xs font-mono text-red-400">{err}</div>}
                <div className="mt-5 flex gap-2">
                    <button type="button" onClick={onClose} className="btn-ghost flex-1">Anuluj</button>
                    <button type="submit" className="btn-primary flex-1">Zaloguj</button>
                </div>
            </form>
        </Modal>
    );
}

function AdminDashboard({ open, onClose, data, setData, onPersist, messages, onMarkRead, onReply, onDeleteMessage, onResetData, serverStatus }) {
    const [tab, setTab] = useState('overview');
    const [editing, setEditing] = useState(null); // { type, mode: 'add'|'edit', item }
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [saving, setSaving] = useState(false);

    if (!open) return null;

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'scripts', label: 'Skrypty', count: data.scripts.length },
        { id: 'tutorials', label: 'Tutoriale', count: data.tutorials.length },
        { id: 'news', label: 'Aktualności', count: data.news.length },
        { id: 'messages', label: 'Wiadomości', count: messages.length, highlight: messages.filter((m) => m.status === 'unread').length },
    ];

    const handleSaveItem = async (type, item) => {
        setSaving(true);
        const next = { ...data };
        const arr = next[type];
        if (item.id && arr.some((x) => x.id === item.id)) {
            next[type] = arr.map((x) => x.id === item.id ? { ...x, ...item } : x);
        } else {
            const newId = (arr.reduce((m, x) => Math.max(m, x.id || 0), 0) || 0) + 1;
            next[type] = [...arr, { ...item, id: newId }];
        }
        setData(next);
        const r = await onPersist(next);
        setSaving(false);
        if (r && r.ok) setEditing(null);
    };

    const handleDelete = async (type, id) => {
        if (!confirm('Na pewno usunąć?')) return;
        setSaving(true);
        const next = { ...data, [type]: data[type].filter((x) => x.id !== id) };
        setData(next);
        await onPersist(next);
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4" onClick={onClose}>
            <div className="glass-strong rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="px-5 py-4 border-b border-kali-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center text-black font-bold">G</div>
                        <div>
                            <div className="font-mono font-bold text-white">Panel admina</div>
                            <div className="text-[11px] font-mono text-gray-500">goncik-tech • control center</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <StatusBadge status={serverStatus} />
                        <button onClick={onClose} className="text-gray-400 hover:text-white p-1" aria-label="Zamknij">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-[200px_1fr] overflow-hidden">
                    <aside className="border-r border-kali-border p-3 space-y-1 hidden md:block">
                        {tabs.map((t) => (
                            <button key={t.id} onClick={() => { setTab(t.id); setEditing(null); setSelectedMessage(null); }}
                                className={`w-full text-left px-3 py-2 rounded-lg font-mono text-sm transition flex items-center justify-between ${
                                    tab === t.id ? 'bg-neon-green/10 text-neon-green border border-neon-green/30' : 'text-gray-300 hover:bg-white/5 border border-transparent'
                                }`}>
                                <span>{t.label}</span>
                                <span className="flex items-center gap-1">
                                    {t.highlight > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                                    <span className="text-[10px] text-gray-500">{t.count ?? ''}</span>
                                </span>
                            </button>
                        ))}
                        <div className="pt-3 mt-3 border-t border-kali-border">
                            <button onClick={async () => {
                                if (!confirm('Przywrócić domyślne dane z backupu?')) return;
                                const r = await onResetData();
                                if (r && r.ok) alert('Przywrócono dane z backupu. Odśwież stronę.');
                            }} className="w-full text-left px-3 py-2 rounded-lg font-mono text-xs text-red-400 hover:bg-red-500/10">
                                ↺ Przywróć backup
                            </button>
                        </div>
                    </aside>
                    <div className="overflow-y-auto p-4 sm:p-6">
                        {/* Mobile tabs */}
                        <div className="md:hidden flex gap-1 overflow-x-auto pb-3 mb-2">
                            {tabs.map((t) => (
                                <button key={t.id} onClick={() => { setTab(t.id); setEditing(null); setSelectedMessage(null); }}
                                    className={`whitespace-nowrap px-3 py-1.5 rounded-md font-mono text-xs ${
                                        tab === t.id ? 'bg-neon-green/10 text-neon-green' : 'text-gray-300 glass'
                                    }`}>
                                    {t.label} {t.count != null && <span className="text-gray-500">({t.count})</span>}
                                </button>
                            ))}
                        </div>

                        {tab === 'overview' && <OverviewTab data={data} messages={messages} />}
                        {tab === 'scripts' && <ItemsTab type="scripts" data={data} editing={editing} setEditing={setEditing} onSave={handleSaveItem} onDelete={handleDelete} saving={saving} />}
                        {tab === 'tutorials' && <ItemsTab type="tutorials" data={data} editing={editing} setEditing={setEditing} onSave={handleSaveItem} onDelete={handleDelete} saving={saving} />}
                        {tab === 'news' && <ItemsTab type="news" data={data} editing={editing} setEditing={setEditing} onSave={handleSaveItem} onDelete={handleDelete} saving={saving} />}
                        {tab === 'messages' && <MessagesTab messages={messages} onMarkRead={onMarkRead} onDelete={onDeleteMessage} selected={selectedMessage} setSelected={setSelectedMessage} replyText={replyText} setReplyText={setReplyText} onReply={onReply} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

function OverviewTab({ data, messages }) {
    const totalDownloads = data.scripts.reduce((acc, s) => acc + (s.downloads || 0), 0);
    const freeCount = data.scripts.filter((s) => s.isFree).length;
    const unread = messages.filter((m) => m.status === 'unread').length;
    const stats = [
        { label: 'Skrypty', value: data.scripts.length, color: 'text-neon-green' },
        { label: 'Darmowe', value: freeCount, color: 'text-neon-blue' },
        { label: 'Tutoriale', value: data.tutorials.length, color: 'text-neon-purple' },
        { label: 'Aktualności', value: data.news.length, color: 'text-neon-yellow' },
        { label: 'Pobrań', value: totalDownloads.toLocaleString(), color: 'text-white' },
        { label: 'Wiadomości (nieprzeczytane)', value: `${messages.length} (${unread})`, color: 'text-neon-pink' },
    ];
    return (
        <div className="space-y-6">
            <h2 className="font-mono text-xl font-bold text-white">Statystyki</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {stats.map((s) => (
                    <div key={s.label} className="glass rounded-xl p-4">
                        <div className={`font-mono text-2xl sm:text-3xl font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-xs text-gray-400 font-mono mt-1">{s.label}</div>
                    </div>
                ))}
            </div>
            <div className="glass rounded-xl p-5 text-sm text-gray-300 leading-relaxed">
                <h3 className="font-mono font-bold text-neon-green mb-2">Jak działa zapis?</h3>
                <p className="mb-2">Każda zmiana w panelu admina wysyła żądanie <code className="px-1.5 py-0.5 bg-kali-card rounded text-neon-blue text-xs">POST /api/save</code> do lokalnego serwera <code className="px-1.5 py-0.5 bg-kali-card rounded text-neon-blue text-xs">server_api.py</code>.</p>
                <p>Serwer automatycznie zapisuje zmiany do pliku <code className="px-1.5 py-0.5 bg-kali-card rounded text-neon-blue text-xs">js/data.js</code>. Po odświeżeniu strony zmiany są widoczne natychmiast.</p>
            </div>
        </div>
    );
}

function ItemsTab({ type, data, editing, setEditing, onSave, onDelete, saving }) {
    const list = data[type];
    const titles = { scripts: 'Skrypty', tutorials: 'Tutoriale', news: 'Aktualności' };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="font-mono text-xl font-bold text-white">{titles[type]}</h2>
                <button onClick={() => setEditing({ type, mode: 'add', item: defaultsFor(type) })}
                    className="btn-primary text-sm">+ Dodaj</button>
            </div>

            {editing && editing.type === type && (
                <ItemForm
                    type={type}
                    item={editing.item}
                    mode={editing.mode}
                    onCancel={() => setEditing(null)}
                    onSave={(it) => onSave(type, it)}
                    saving={saving}
                />
            )}

            {list.length === 0 ? (
                <div className="glass rounded-xl p-8 text-center text-gray-400 font-mono text-sm">Brak elementów. Dodaj pierwszy!</div>
            ) : (
                <div className="space-y-2">
                    {list.map((item) => (
                        <div key={item.id} className="glass rounded-xl p-4 flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="font-mono font-bold text-white truncate">{item.name || item.title}</div>
                                <div className="text-xs text-gray-400 truncate">{item.description || item.excerpt}</div>
                                <div className="flex flex-wrap gap-2 mt-1.5 text-[10px] font-mono text-gray-500">
                                    {item.category && <span className="chip">#{item.category}</span>}
                                    {item.isFree != null && <span className={item.isFree ? 'chip' : 'chip-blue'}>{item.isFree ? 'FREE' : 'PREMIUM'}</span>}
                                    {item.version && <span>v{item.version}</span>}
                                    {item.date && <span>{item.date}</span>}
                                </div>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                                <button onClick={() => setEditing({ type, mode: 'edit', item })}
                                    className="p-2 rounded-md text-neon-blue hover:bg-neon-blue/10" title="Edytuj">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button onClick={() => onDelete(type, item.id)} className="p-2 rounded-md text-red-400 hover:bg-red-500/10" title="Usuń">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function defaultsFor(type) {
    if (type === 'scripts') return {
        name: '', description: '', category: 'script', tags: [],
        features: [], downloadUrl: '', isFree: true, downloads: 0,
        rating: 5.0, lastUpdated: new Date().toISOString().slice(0, 10),
        version: '1.0.0', author: 'Goncik', requirements: [],
    };
    if (type === 'tutorials') return {
        title: '', excerpt: '', content: '', category: 'script',
        tags: [], author: 'Goncik', date: new Date().toISOString().slice(0, 10),
        readTime: '5 min', featured: false,
    };
    return {
        title: '', excerpt: '', content: '', category: 'update',
        author: 'Goncik', date: new Date().toISOString().slice(0, 10), featured: false,
    };
}

function ItemForm({ type, item, mode, onSave, onCancel, saving }) {
    const [state, setState] = useState(() => ({ ...defaultsFor(type), ...item }));
    const set = (k, v) => setState((s) => ({ ...s, [k]: v }));

    const submit = (e) => { e.preventDefault(); onSave(state); };

    return (
        <form onSubmit={submit} className="glass rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="font-mono font-bold text-neon-green">{mode === 'add' ? 'Dodaj nowy' : 'Edytuj'}</h3>
                <span className="text-[10px] font-mono text-gray-500 uppercase">{type}</span>
            </div>
            {type === 'scripts' && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><label className="text-xs text-gray-400 font-mono">Nazwa</label><input className="field" required value={state.name} onChange={(e) => set('name', e.target.value)} /></div>
                        <div><label className="text-xs text-gray-400 font-mono">Wersja</label><input className="field" value={state.version} onChange={(e) => set('version', e.target.value)} /></div>
                    </div>
                    <div><label className="text-xs text-gray-400 font-mono">Opis</label><textarea className="field" rows={2} required value={state.description} onChange={(e) => set('description', e.target.value)} /></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div><label className="text-xs text-gray-400 font-mono">Kategoria</label>
                            <select className="field" value={state.category} onChange={(e) => set('category', e.target.value)}>
                                {['bypass','script','bot','tool','generator'].map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div><label className="text-xs text-gray-400 font-mono">Typ</label>
                            <select className="field" value={state.isFree ? 'free' : 'premium'} onChange={(e) => set('isFree', e.target.value === 'free')}>
                                <option value="free">Darmowy</option><option value="premium">Premium</option>
                            </select>
                        </div>
                        <div><label className="text-xs text-gray-400 font-mono">Pobrań</label><input type="number" className="field" value={state.downloads} onChange={(e) => set('downloads', +e.target.value)} /></div>
                        <div><label className="text-xs text-gray-400 font-mono">Ocena</label><input type="number" step="0.1" min="0" max="5" className="field" value={state.rating} onChange={(e) => set('rating', +e.target.value)} /></div>
                    </div>
                    <div><label className="text-xs text-gray-400 font-mono">URL do pobrania</label><input className="field" required value={state.downloadUrl} onChange={(e) => set('downloadUrl', e.target.value)} /></div>
                    <div><label className="text-xs text-gray-400 font-mono">Tagi (przecinek)</label><input className="field" value={(state.tags || []).join(', ')} onChange={(e) => set('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))} /></div>
                    <div><label className="text-xs text-gray-400 font-mono">Funkcje (jedna na linię)</label><textarea className="field" rows={3} value={(state.features || []).join('\n')} onChange={(e) => set('features', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))} /></div>
                    <div><label className="text-xs text-gray-400 font-mono">Wymagania (jedno na linię)</label><textarea className="field" rows={2} value={(state.requirements || []).join('\n')} onChange={(e) => set('requirements', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))} /></div>
                </>
            )}
            {type === 'tutorials' && (
                <>
                    <div><label className="text-xs text-gray-400 font-mono">Tytuł</label><input className="field" required value={state.title} onChange={(e) => set('title', e.target.value)} /></div>
                    <div><label className="text-xs text-gray-400 font-mono">Krótki opis (excerpt)</label><textarea className="field" rows={2} required value={state.excerpt} onChange={(e) => set('excerpt', e.target.value)} /></div>
                    <div><label className="text-xs text-gray-400 font-mono">Treść (HTML)</label><textarea className="field font-mono" rows={6} value={state.content} onChange={(e) => set('content', e.target.value)} placeholder="<h3>...</h3><p>...</p>" /></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div><label className="text-xs text-gray-400 font-mono">Kategoria</label>
                            <select className="field" value={state.category} onChange={(e) => set('category', e.target.value)}>
                                {['bypass','script','bot','tool'].map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div><label className="text-xs text-gray-400 font-mono">Czas czytania</label><input className="field" value={state.readTime} onChange={(e) => set('readTime', e.target.value)} /></div>
                        <div><label className="text-xs text-gray-400 font-mono">Data</label><input type="date" className="field" value={state.date} onChange={(e) => set('date', e.target.value)} /></div>
                        <div className="flex items-end"><label className="flex items-center gap-2 text-xs font-mono text-gray-300"><input type="checkbox" className="check" checked={!!state.featured} onChange={(e) => set('featured', e.target.checked)} />Wyróżniony</label></div>
                    </div>
                    <div><label className="text-xs text-gray-400 font-mono">Tagi (przecinek)</label><input className="field" value={(state.tags || []).join(', ')} onChange={(e) => set('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))} /></div>
                </>
            )}
            {type === 'news' && (
                <>
                    <div><label className="text-xs text-gray-400 font-mono">Tytuł</label><input className="field" required value={state.title} onChange={(e) => set('title', e.target.value)} /></div>
                    <div><label className="text-xs text-gray-400 font-mono">Krótki opis (excerpt)</label><textarea className="field" rows={2} required value={state.excerpt} onChange={(e) => set('excerpt', e.target.value)} /></div>
                    <div><label className="text-xs text-gray-400 font-mono">Pełna treść</label><textarea className="field" rows={4} value={state.content} onChange={(e) => set('content', e.target.value)} /></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div><label className="text-xs text-gray-400 font-mono">Kategoria</label>
                            <select className="field" value={state.category} onChange={(e) => set('category', e.target.value)}>
                                {['update','milestone','feature'].map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div><label className="text-xs text-gray-400 font-mono">Data</label><input type="date" className="field" value={state.date} onChange={(e) => set('date', e.target.value)} /></div>
                        <div className="flex items-end"><label className="flex items-center gap-2 text-xs font-mono text-gray-300"><input type="checkbox" className="check" checked={!!state.featured} onChange={(e) => set('featured', e.target.checked)} />Wyróżniony</label></div>
                    </div>
                </>
            )}
            <div className="flex gap-2 pt-2">
                <button type="button" onClick={onCancel} className="btn-ghost flex-1">Anuluj</button>
                <button type="submit" className="btn-primary flex-1 inline-flex items-center justify-center gap-2" disabled={saving}>
                    {saving ? <><span className="spinner"></span>Zapisuję…</> : 'Zapisz'}
                </button>
            </div>
        </form>
    );
}

function MessagesTab({ messages, onMarkRead, onDelete, selected, setSelected, replyText, setReplyText, onReply }) {
    if (selected) {
        const send = () => {
            if (!replyText.trim()) return;
            onReply(selected.id, replyText);
            setReplyText('');
        };
        return (
            <div className="space-y-3">
                <button onClick={() => setSelected(null)} className="text-sm text-gray-400 hover:text-neon-green font-mono">← Wróć do listy</button>
                <div className="glass rounded-xl p-5">
                    <div className="text-xs font-mono text-gray-500 mb-1">Od: <span className="text-white">{selected.name}</span> ({selected.email})</div>
                    <div className="text-xs font-mono text-gray-500 mb-1">Temat: <span className="text-white">{selected.subject}</span></div>
                    <div className="text-xs font-mono text-gray-500 mb-3">Data: {new Date(selected.timestamp).toLocaleString('pl-PL')}</div>
                    <div className="bg-kali-card rounded-lg p-4 text-sm text-gray-200 whitespace-pre-wrap">{selected.message}</div>
                </div>
                <div className="glass rounded-xl p-5">
                    <h3 className="font-mono font-bold text-neon-green mb-2 text-sm">Odpowiedź</h3>
                    <textarea className="field" rows={3} value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Napisz odpowiedź…" />
                    <button onClick={send} className="btn-primary mt-3">Wyślij</button>
                </div>
                {(selected.replies || []).length > 0 && (
                    <div className="space-y-2">
                        <h3 className="font-mono font-bold text-white text-sm">Historia odpowiedzi</h3>
                        {(selected.replies || []).map((r) => (
                            <div key={r.id} className="glass rounded-lg p-3 border-l-2 border-neon-blue">
                                <div className="text-[11px] font-mono text-neon-blue mb-1">Admin • {new Date(r.timestamp).toLocaleString('pl-PL')}</div>
                                <div className="text-sm text-gray-200">{r.text}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
    if (messages.length === 0) return <div className="glass rounded-xl p-12 text-center text-gray-400 font-mono">Brak wiadomości.</div>;
    return (
        <div className="space-y-2">
            {messages.map((m) => (
                <div key={m.id} onClick={() => onMarkRead(m.id) || setSelected(m)}
                    className={`glass rounded-xl p-4 cursor-pointer card-hover ${m.status === 'unread' ? 'border-l-4 border-l-neon-green' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-mono font-bold text-white text-sm">{m.name}</span>
                                <span className="text-[10px] text-gray-500 font-mono">{new Date(m.timestamp).toLocaleString('pl-PL')}</span>
                                {m.status === 'unread' && <span className="chip text-[10px]">Nowa</span>}
                                {m.status === 'replied' && <span className="chip-blue text-[10px]">Odpowiedziana</span>}
                            </div>
                            <div className="text-xs text-gray-500 font-mono">{m.email}</div>
                            <div className="text-sm text-gray-200 font-mono mt-1">{m.subject}</div>
                            <div className="text-xs text-gray-400 line-clamp-2 mt-1">{m.message}</div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); if (confirm('Usunąć wiadomość?')) onDelete(m.id); }} className="text-red-400 hover:text-red-300 p-1">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* =========================================================
   9. Główny App
   ========================================================= */
function App() {
    const [page, setPage] = useState('home');
    const [data, setData] = useState(initialData);
    const [selectedScript, setSelectedScript] = useState(null);
    const [selectedTutorial, setSelectedTutorial] = useState(null);
    const [adminOpen, setAdminOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [hydrated, setHydrated] = useState(false);
    const toast = useToast();
    const serverStatus = useServerStatus();
    const { isAdmin, login, logout } = useAdminAuth();
    const { messages, addMessage, markRead: onMarkRead, reply: onReply, remove: onDeleteMessage } = useMessages();

    // Hydration: po załadowaniu pobierz świeże dane z serwera (zastępują window.data)
    useEffect(() => {
        fetch('/js/data.js', { cache: 'no-store' })
            .then((r) => r.text())
            .then((text) => {
                try {
                    // Wyciągamy const scripts = [ ... ]; itd. za pomocą eval w bezpiecznym kontekście
                    const sandbox = { window: {} };
                    const fn = new Function('window', text + '\nreturn window.data || { scripts, tutorials, news };');
                    const fresh = fn(sandbox.window);
                    if (fresh && Array.isArray(fresh.scripts)) {
                        setData({
                            scripts: fresh.scripts,
                            tutorials: fresh.tutorials || [],
                            news: fresh.news || [],
                        });
                    }
                } catch (e) {
                    console.warn('Hydration failed, using inline data', e);
                } finally {
                    setHydrated(true);
                }
            })
            .catch(() => setHydrated(true));
    }, []);

    // Nawigacja z footera (event)
    useEffect(() => {
        const h = (e) => setPage(e.detail);
        window.addEventListener('nav', h);
        return () => window.removeEventListener('nav', h);
    }, []);

    // Scroll to top on page change
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [page]);

    const onAdminClick = () => {
        if (isAdmin) setAdminOpen(true);
        else setLoginOpen(true);
    };

    const handlePersist = async (next) => {
        if (serverStatus !== 'online') {
            toast.push('Serwer API offline — zmiany zapisane tylko lokalnie', 'error');
            return { ok: false, local: true };
        }
        try {
            const r = await API.save(next);
            if (r.ok) toast.push('Zapisano do bazy ✓', 'success');
            else toast.push('Błąd zapisu: ' + (r.error || 'unknown'), 'error');
            return r;
        } catch (e) {
            toast.push('Brak połączenia z API', 'error');
            return { ok: false, error: String(e) };
        }
    };

    const renderPage = () => {
        switch (page) {
            case 'home':
                return (
                    <>
                        <Hero setCurrentPage={setPage} />
                        <FeaturedSection data={data} setCurrentPage={setPage} setSelected={setSelectedScript} setSelectedTutorial={setSelectedTutorial} />
                        <WhySection />
                    </>
                );
            case 'scripts': return <ScriptsPage scripts={data.scripts} setCurrentPage={setPage} setSelected={setSelectedScript} />;
            case 'bypassy': return <ScriptsPage scripts={data.scripts} setCurrentPage={setPage} setSelected={setSelectedScript} filter="bypass" />;
            case 'free': return <ScriptsPage scripts={data.scripts} setCurrentPage={setPage} setSelected={setSelectedScript} filter="free" />;
            case 'script-detail': return <ScriptDetailPage script={selectedScript} setCurrentPage={setPage} />;
            case 'tutorials': return <TutorialsPage tutorials={data.tutorials} setCurrentPage={setPage} setSelectedTutorial={setSelectedTutorial} />;
            case 'tutorial-detail': return <TutorialDetailPage tutorial={selectedTutorial} setCurrentPage={setPage} />;
            case 'news': return <NewsPage news={data.news} />;
            case 'contact': return <ContactPage addMessage={addMessage} />;
            default: return <NotFoundPage setCurrentPage={setPage} />;
        }
    };

    return (
        <ToastProvider>
            <MatrixRain />
            <div className="relative min-h-screen flex flex-col">
                <Navbar currentPage={page} setCurrentPage={setPage} status={serverStatus} onAdminClick={onAdminClick} isAdmin={isAdmin} />
                <main className="page-enter flex-1">{renderPage()}</main>
                <Footer isAdmin={isAdmin} onAdminClick={onAdminClick} onLogout={logout} status={serverStatus} />

                <AdminLoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onLogin={(pwd) => {
                    const ok = login(pwd);
                    if (ok) { setLoginOpen(false); setAdminOpen(true); toast.push('Zalogowano ✓', 'success'); }
                    return ok;
                }} />

                {isAdmin && (
                    <AdminDashboard
                        open={adminOpen}
                        onClose={() => setAdminOpen(false)}
                        data={data}
                        setData={setData}
                        onPersist={handlePersist}
                        messages={messages}
                        onMarkRead={onMarkRead}
                        onReply={onReply}
                        onDeleteMessage={onDeleteMessage}
                        onResetData={API.reset}
                        serverStatus={serverStatus}
                    />
                )}
            </div>
        </ToastProvider>
    );
}

function FeaturedSection({ data, setCurrentPage, setSelected, setSelectedTutorial }) {
    const featured = data.scripts.filter((s) => s.featured).slice(0, 3);
    const [ref, visible] = useScrollReveal();
    return (
        <section ref={ref} className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex items-end justify-between mb-8" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out' }}>
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">Polecane skrypty</h2>
                    <p className="text-gray-400 text-sm mt-1">Najpopularniejsze narzędzia w naszej kolekcji.</p>
                </div>
                <button onClick={() => setCurrentPage('scripts')} className="text-sm text-neon-green hover:text-neon-blue font-mono">Wszystkie →</button>
            </div>
            {featured.length === 0 ? (
                <div className="glass rounded-xl p-8 text-center text-gray-400 font-mono text-sm">Brak wyróżnionych skryptów.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featured.map((s) => <ScriptCard key={s.id} script={s} onClick={() => { setSelected(s); setCurrentPage('script-detail'); }} />)}
                </div>
            )}
        </section>
    );
}

function WhySection() {
    const [ref, visible] = useScrollReveal();
    const items = [
        { t: 'Wysoka jakość', d: 'Każdy skrypt jest dokładnie testowany i udokumentowany.', c: 'green' },
        { t: 'Szybkość', d: 'Optymalizacja wydajności i minimalne opóźnienia.', c: 'blue' },
        { t: 'Bezpieczeństwo', d: 'Narzędzia są bezpieczne w użyciu i nie zawierają malware.', c: 'purple' },
        { t: 'Wsparcie', d: 'Szybka pomoc i odpowiedzi na pytania użytkowników.', c: 'pink' },
        { t: 'Aktualizacje', d: 'Regularne aktualizacje i nowe funkcje.', c: 'green' },
        { t: 'Społeczność', d: 'Aktywna społeczność użytkowników i współpraca.', c: 'blue' },
    ];
    return (
        <section ref={ref} className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-10" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out' }}>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Dlaczego goncik-tech?</h2>
                <p className="text-gray-400 mt-1 text-sm">Odkryj zalety korzystania z naszych narzędzi.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((it, i) => {
                    const [r, v] = useScrollReveal();
                    const colorClass = it.c === 'green' ? 'text-neon-green' : it.c === 'blue' ? 'text-neon-blue' : it.c === 'purple' ? 'text-neon-purple' : 'text-neon-pink';
                    return (
                        <div key={i} ref={r} className="glass rounded-xl p-5 card-hover" style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.5s ease-out' }}>
                            <div className={`w-10 h-10 rounded-lg glass flex items-center justify-center mb-3 ${colorClass}`}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                            </div>
                            <h3 className={`font-mono font-bold mb-1 ${colorClass}`}>{it.t}</h3>
                            <p className="text-sm text-gray-400">{it.d}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

// Render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
