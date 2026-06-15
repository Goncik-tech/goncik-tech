/* =========================================================
   GONCIK-TECH 3.0 — LIQUID CLOUD EDITION
   - Supabase backend (cloud database)
   - Liquid Glass UI with animated gradients
   - Slow & elegant Matrix rain
   - Mobile-first admin panel
   ========================================================= */

const { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } = React;

/* =========================================================
   1. SUPABASE CLIENT & CONFIG
   ========================================================= */
const SUPABASE_URL = 'https://qnaftnpxtvifmmshmoze.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuYWZ0bnB4dHZpZm1tc2htb3plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NDE1MDQsImV4cCI6MjA5NzExNzUwNH0.dWJcyaj8j9fc0JbH0GBMjscnbQypeUdK4DGH3275fKo';

let supabase = null;
try {
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.warn('Supabase client not loaded');
    }
} catch (e) {
    console.error('Supabase init error:', e);
}

const ADMIN_PASSWORD = 'goncik123';

/* =========================================================
   2. TOAST SYSTEM
   ========================================================= */
const ToastContext = createContext({ push: () => {} });
function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const push = useCallback((text, type = 'success') => {
        const id = Date.now() + Math.random();
        setToasts((t) => [...t, { id, text, type }]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
    }, []);
    return (
        <ToastContext.Provider value={{ push }}>
            {children}
            <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`toast-anim glass-strong rounded-xl px-4 py-3 font-mono text-sm flex items-center gap-2.5 min-w-[220px] ${
                            t.type === 'error' ? 'border-red-500/40' : t.type === 'info' ? 'border-neon-blue/40' : 'border-neon-green/40'
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
const useToast = () => useContext(ToastContext);

/* =========================================================
   3. HOOKS
   ========================================================= */
function useScrollReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (!ref.current) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
        }, { threshold: 0.1 });
        obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
}

function useSupabaseStatus() {
    const [status, setStatus] = useState('checking');
    useEffect(() => {
        if (!supabase) { setStatus('offline'); return; }
        let alive = true;
        const check = async () => {
            try {
                const { error } = await supabase.from('scripts').select('id').limit(1);
                if (alive) setStatus(error ? 'offline' : 'online');
            } catch { if (alive) setStatus('offline'); }
        };
        check();
        const id = setInterval(check, 10000);
        return () => { alive = false; clearInterval(id); };
    }, []);
    return status;
}

function useAdminAuth() {
    const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('goncik_admin') === '1');
    const login = (pwd) => {
        if (pwd === ADMIN_PASSWORD) {
            sessionStorage.setItem('goncik_admin', '1');
            setIsAdmin(true);
            return true;
        }
        return false;
    };
    const logout = () => {
        sessionStorage.removeItem('goncik_admin');
        setIsAdmin(false);
    };
    return { isAdmin, login, logout };
}

/* =========================================================
   4. SLOW MATRIX RAIN
   ========================================================= */
function MatrixRain() {
    useEffect(() => {
        const canvas = document.getElementById('matrix-rain');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨ0123456789';
        let drops = [];
        let w = 0, h = 0;

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            const fontSize = 18;
            const cols = Math.floor(w / fontSize);
            drops = new Array(cols).fill(0).map(() => Math.random() * h / fontSize);
            canvas.dataset.fontSize = fontSize;
        };
        resize();
        window.addEventListener('resize', resize);

        let raf;
        let lastTime = 0;
        const fps = 24; // slow & elegant
        const interval = 1000 / fps;

        const draw = (t) => {
            raf = requestAnimationFrame(draw);
            if (t - lastTime < interval) return;
            lastTime = t;

            ctx.fillStyle = 'rgba(5, 5, 7, 0.08)';
            ctx.fillRect(0, 0, w, h);

            const fontSize = parseInt(canvas.dataset.fontSize, 10);
            ctx.font = `${fontSize}px JetBrains Mono`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                // head — bright
                ctx.fillStyle = 'rgba(0, 255, 136, 0.9)';
                ctx.shadowColor = 'rgba(0, 255, 136, 0.8)';
                ctx.shadowBlur = 8;
                ctx.fillText(text, x, y);
                ctx.shadowBlur = 0;

                if (y > h && Math.random() > 0.985) drops[i] = 0;
                // SLOW — speed reduced from 0.9 to 0.45
                drops[i] += 0.45;
            }
        };
        raf = requestAnimationFrame(draw);

        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, []);
    return null;
}

/* =========================================================
   5. UI PRIMITIVES
   ========================================================= */
function Logo({ onClick, size = 'md' }) {
    const dim = size === 'sm' ? 36 : 44;
    return (
        <button onClick={onClick} className="flex items-center gap-2.5 group">
            <div className="relative" style={{ width: dim, height: dim }}>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-green via-neon-blue to-neon-purple opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                <div className="absolute inset-[2px] rounded-[10px] bg-ink-900 flex items-center justify-center">
                    <span className="font-mono font-extrabold text-neon-green text-lg" style={{ textShadow: '0 0 12px rgba(0,255,136,0.6)' }}>G</span>
                </div>
            </div>
            <div className="leading-tight text-left">
                <div className="font-mono font-bold text-base sm:text-lg text-white">goncik<span className="gradient-text">-tech</span></div>
                <div className="font-mono text-[10px] text-gray-500 hidden sm:block tracking-widest uppercase">cloud • liquid • cyberpunk</div>
            </div>
        </button>
    );
}

function StatusBadge({ status }) {
    const map = {
        online: { color: 'dot-green', text: 'CLOUD ONLINE' },
        offline: { color: 'dot-red', text: 'CLOUD OFFLINE' },
        checking: { color: 'dot-yellow', text: 'CONNECTING…' },
    };
    const s = map[status] || map.checking;
    return (
        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md glass text-[10px] font-mono text-gray-300 tracking-wider">
            <span className={`dot ${s.color}`}></span>{s.text}
        </span>
    );
}

function Spinner({ className = '' }) {
    return <span className={`spinner ${className}`}></span>;
}

function Skeleton({ className = '' }) {
    return <div className={`skeleton ${className}`}></div>;
}

function Modal({ open, onClose, children, maxWidth = 'max-w-md' }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className={`glass-strong rounded-2xl w-full ${maxWidth} max-h-[92vh] overflow-hidden flex flex-col`} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

/* =========================================================
   6. NAVBAR + FOOTER
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
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
            <div className={`mx-auto px-3 sm:px-4 transition-all duration-500 ${scrolled ? 'max-w-6xl' : 'max-w-7xl'}`}>
                <div className="glass rounded-2xl px-4 sm:px-5 py-3 flex items-center justify-between">
                    <Logo onClick={() => setCurrentPage('home')} />
                    <nav className="hidden lg:flex items-center gap-1">
                        {NAV.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setCurrentPage(item.id)}
                                className={`relative px-3 py-1.5 rounded-lg font-mono text-sm transition ${
                                    currentPage === item.id
                                        ? 'text-neon-green bg-neon-green/10'
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
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs glass border border-neon-green/30 text-neon-green hover:bg-neon-green/10 transition"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 1l3 6 6 1-4.5 4.5L18 19l-6-3-6 3 1.5-6.5L3 8l6-1z" />
                            </svg>
                            {isAdmin ? 'Panel' : 'Admin'}
                        </button>
                        <button onClick={() => setOpen((v) => !v)} className="lg:hidden p-2 rounded-lg text-neon-green hover:bg-white/5" aria-label="Menu">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
                            </svg>
                        </button>
                    </div>
                </div>
                {open && (
                    <div className="lg:hidden mt-2 glass rounded-2xl p-2 animate-fade-in">
                        {NAV.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { setCurrentPage(item.id); setOpen(false); }}
                                className={`w-full text-left px-3 py-2.5 rounded-lg font-mono text-sm ${
                                    currentPage === item.id ? 'text-neon-green bg-neon-green/10' : 'text-gray-200 hover:bg-white/5'
                                }`}
                            >{item.label}</button>
                        ))}
                        <button
                            onClick={() => { onAdminClick(); setOpen(false); }}
                            className="w-full text-left px-3 py-2.5 rounded-lg font-mono text-sm text-neon-green hover:bg-neon-green/10 border-t border-white/5 mt-1 pt-3"
                        >{isAdmin ? '⚡ Panel admina' : '🔒 Logowanie admina'}</button>
                    </div>
                )}
            </div>
        </header>
    );
}

function Footer({ isAdmin, onAdminClick, onLogout, status }) {
    return (
        <footer className="relative mt-24 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="col-span-2">
                    <Logo size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
                    <p className="text-sm text-gray-400 mt-4 max-w-sm leading-relaxed">
                        Nowoczesna platforma cloud ze skryptami, bypassami AI i narzędziami dla developerów.
                    </p>
                    <div className="flex items-center gap-3 mt-5">
                        <a href="https://github.com/goncik-tech" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-300 hover:text-neon-green hover-glow transition" aria-label="GitHub">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/></svg>
                        </a>
                        <a href="https://discord.gg/goncik-tech" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-300 hover:text-neon-blue transition" aria-label="Discord">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 4.4a19.8 19.8 0 0 0-4.9-1.5l-.2.4a18 18 0 0 1 4.4 1.4 16 16 0 0 0-15.2 0 18 18 0 0 1 4.4-1.4l-.2-.4A19.8 19.8 0 0 0 3.7 4.4 20 20 0 0 0 .1 17.7a20 20 0 0 0 6 3l1.2-1.7a13 13 0 0 1-2-.9l.5-.4a14 14 0 0 0 12.4 0l.5.4a13 13 0 0 1-2 .9l1.2 1.7a20 20 0 0 0 6-3 20 20 0 0 0-3.6-13.3zM8.5 15.1c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-.9 2.4-2.2 2.4zm7 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4z"/></svg>
                        </a>
                    </div>
                </div>
                <div>
                    <h4 className="font-mono font-bold text-white mb-3 text-sm tracking-wider uppercase">Narzędzia</h4>
                    <ul className="space-y-2 text-sm">
                        {NAV.slice(1, 4).map((i) => (
                            <li key={i.id}><a onClick={() => window.dispatchEvent(new CustomEvent('nav', { detail: i.id }))} className="text-gray-400 hover:text-neon-green cursor-pointer transition">{i.label}</a></li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-mono font-bold text-white mb-3 text-sm tracking-wider uppercase">Zasoby</h4>
                    <ul className="space-y-2 text-sm">
                        {NAV.slice(4).map((i) => (
                            <li key={i.id}><a onClick={() => window.dispatchEvent(new CustomEvent('nav', { detail: i.id }))} className="text-gray-400 hover:text-neon-blue cursor-pointer transition">{i.label}</a></li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-gray-500">
                    <div>© {new Date().getFullYear()} goncik-tech — liquid cloud edition</div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={status} />
                        {isAdmin ? (
                            <>
                                <button onClick={onAdminClick} className="text-neon-green hover:text-neon-blue">Panel admina</button>
                                <span className="text-gray-700">|</span>
                                <button onClick={onLogout} className="text-red-400 hover:text-red-300">Wyloguj</button>
                            </>
                        ) : (
                            <button onClick={onAdminClick} className="text-gray-500 hover:text-neon-green">Logowanie</button>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}

/* =========================================================
   7. PAGE COMPONENTS
   ========================================================= */
function Hero({ setCurrentPage }) {
    const phrases = useMemo(() => [
        'skrypty w chmurze',
        'bypassy AI nowej generacji',
        'narzędzia dla developerów',
        'live. global. instant.',
    ], []);
    const [idx, setIdx] = useState(0);
    const [text, setText] = useState('');
    const [phase, setPhase] = useState('typing');

    useEffect(() => {
        const current = phrases[idx];
        let t;
        if (phase === 'typing') {
            if (text.length < current.length) t = setTimeout(() => setText(current.slice(0, text.length + 1)), 70);
            else t = setTimeout(() => setPhase('pause'), 1800);
        } else if (phase === 'pause') {
            t = setTimeout(() => setPhase('deleting'), 250);
        } else {
            if (text.length > 0) t = setTimeout(() => setText(text.slice(0, -1)), 30);
            else { setIdx((idx + 1) % phrases.length); setPhase('typing'); }
        }
        return () => clearTimeout(t);
    }, [text, phase, idx, phrases]);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass mb-7 text-xs font-mono text-gray-300 animate-fade-in">
                    <span className="dot dot-green"></span>
                    <span>v3.0 — Liquid Cloud Edition</span>
                </div>
                <h1 className="font-extrabold text-5xl sm:text-7xl md:text-8xl leading-[1.05] tracking-tight animate-slide-up">
                    <span className="block text-white/90">Witaj w</span>
                    <span className="gradient-text">goncik-tech</span>
                </h1>
                <p className="mt-7 text-lg sm:text-2xl text-gray-300 font-mono min-h-[2.5rem] animate-slide-up" style={{ animationDelay: '.15s' }}>
                    <span className="text-neon-green">{text}</span>
                    <span className="typing-cursor"></span>
                </p>
                <p className="mt-4 text-gray-400 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '.3s' }}>
                    Nowoczesna platforma cloud z bazą danych Supabase.
                    Dodawaj skrypty z telefonu, komputera, gdziekolwiek — zmiany widoczne natychmiast dla wszystkich.
                </p>
                <div className="mt-10 flex flex-wrap gap-3 justify-center animate-slide-up" style={{ animationDelay: '.45s' }}>
                    <button onClick={() => setCurrentPage('scripts')} className="btn-primary inline-flex items-center gap-2 group">
                        <span>Przeglądaj skrypty</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-0.5 transition"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                    <button onClick={() => setCurrentPage('tutorials')} className="btn-ghost">Zobacz tutoriale</button>
                </div>
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '.6s' }}>
                    {[
                        { v: '∞', l: 'Skrypty', color: 'text-neon-green' },
                        { v: '24/7', l: 'Online', color: 'text-neon-blue' },
                        { v: '5k+', l: 'Pobrań', color: 'text-neon-purple' },
                        { v: '∞', l: 'Tutoriali', color: 'text-neon-yellow' },
                    ].map((s) => (
                        <div key={s.l} className="glass-card rounded-2xl p-4">
                            <div className={`font-mono text-2xl font-bold ${s.color}`}>{s.v}</div>
                            <div className="text-xs text-gray-400 font-mono tracking-wider uppercase mt-1">{s.l}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-neon-green animate-bounce">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
            </div>
        </section>
    );
}

function ScriptCard({ script, onClick }) {
    return (
        <div onClick={onClick} className="glass-card rounded-2xl p-5 cursor-pointer group animate-slide-up">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center text-black flex-shrink-0 shadow-lg shadow-neon-green/20">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <div className="min-w-0">
                        <div className="font-mono font-bold text-white truncate group-hover:text-neon-green transition">{script.name}</div>
                        <div className="text-[11px] font-mono text-gray-500">v{script.version} • {script.last_updated}</div>
                    </div>
                </div>
                <span className={`px-2.5 py-0.5 text-[10px] font-mono rounded-full font-bold flex-shrink-0 ${script.is_free ? 'bg-neon-green text-black' : 'bg-neon-blue text-black'}`}>
                    {script.is_free ? 'FREE' : 'PREMIUM'}
                </span>
            </div>
            <p className="text-sm text-gray-400 line-clamp-2 mb-3 leading-relaxed">{script.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
                {(script.tags || []).slice(0, 3).map((t, i) => (
                    <span key={i} className="chip">{t}</span>
                ))}
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
                        {(script.downloads || 0).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-neon-yellow">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
                        {script.rating || '—'}
                    </span>
                </div>
                <span className="text-neon-green group-hover:translate-x-1 transition">Więcej →</span>
            </div>
        </div>
    );
}

function ScriptCardSkeleton() {
    return (
        <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
                <Skeleton className="w-11 h-11 rounded-xl" />
                <div className="flex-1"><Skeleton className="h-4 w-2/3 mb-2" /><Skeleton className="h-3 w-1/3" /></div>
            </div>
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-5/6 mb-4" />
            <div className="flex gap-2 mb-4"><Skeleton className="h-5 w-12" /><Skeleton className="h-5 w-16" /></div>
            <Skeleton className="h-3 w-1/2" />
        </div>
    );
}

function ScriptsPage({ scripts, loading, setCurrentPage, setSelected, filter = 'all' }) {
    const [category, setCategory] = useState('all');
    const [price, setPrice] = useState('all');
    const [q, setQ] = useState('');

    let base = scripts || [];
    if (filter === 'bypass') base = base.filter((s) => s.category === 'bypass');
    if (filter === 'free') base = base.filter((s) => s.is_free);

    const filtered = base.filter((s) => {
        if (category !== 'all' && s.category !== category) return false;
        if (price === 'free' && !s.is_free) return false;
        if (price === 'premium' && s.is_free) return false;
        if (q) {
            const Q = q.toLowerCase();
            const hay = `${s.name} ${s.description} ${(s.tags || []).join(' ')}`.toLowerCase();
            if (!hay.includes(Q)) return false;
        }
        return true;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 pt-28 pb-16 page-anim">
            <header className="mb-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold gradient-text">
                    {filter === 'bypass' ? 'Bypassy AI' : filter === 'free' ? 'Darmowe skrypty' : 'Wszystkie skrypty'}
                </h1>
                <p className="text-gray-400 mt-3">Przeglądaj całą kolekcję narzędzi — od skryptów po boty.</p>
            </header>
            <div className="glass rounded-2xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 tracking-wider uppercase">Kategoria</label>
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
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 tracking-wider uppercase">Cena</label>
                    <select className="field" value={price} onChange={(e) => setPrice(e.target.value)}>
                        <option value="all">Wszystkie</option>
                        <option value="free">Darmowe</option>
                        <option value="premium">Premium</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 tracking-wider uppercase">Szukaj</label>
                    <input className="field" placeholder="nazwa, opis, tag…" value={q} onChange={(e) => setQ(e.target.value)} />
                </div>
            </div>
            <div className="text-sm font-mono text-gray-400 mb-5">
                Znaleziono <span className="text-neon-green font-bold">{loading ? '…' : filtered.length}</span> skryptów
            </div>
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => <ScriptCardSkeleton key={i} />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center text-gray-400 font-mono">Brak wyników dla podanych filtrów.</div>
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
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-16 text-center page-anim">
            <p className="text-gray-400 font-mono">Nie znaleziono skryptu.</p>
            <button onClick={() => setCurrentPage('scripts')} className="mt-4 btn-ghost">Wróć do listy</button>
        </div>
    );
    return (
        <div className="max-w-6xl mx-auto px-4 pt-28 pb-16 page-anim">
            <button onClick={() => setCurrentPage('scripts')} className="mb-6 font-mono text-sm text-gray-400 hover:text-neon-green inline-flex items-center gap-1.5 transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Wróć
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass rounded-2xl p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="min-w-0">
                            <h1 className="font-mono text-2xl sm:text-3xl font-bold text-white break-words">{script.name}</h1>
                            <div className="text-sm text-gray-400 font-mono mt-1.5 flex flex-wrap gap-3">
                                <span>v{script.version}</span>
                                <span>{(script.downloads || 0).toLocaleString()} pobrań</span>
                                <span className="text-neon-yellow">★ {script.rating || '—'}</span>
                                <span>{script.last_updated}</span>
                            </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-mono rounded-full font-bold flex-shrink-0 ${script.is_free ? 'bg-neon-green text-black' : 'bg-neon-blue text-black'}`}>
                            {script.is_free ? 'FREE' : 'PREMIUM'}
                        </span>
                    </div>
                    <p className="text-gray-300 mb-6 leading-relaxed">{script.description}</p>
                    <Section title="Funkcje" items={script.features} icon="check" />
                    <Section title="Wymagania" items={script.requirements} icon="cube" />
                    {script.tags?.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-mono text-sm font-bold text-neon-green mb-3 tracking-wider uppercase">Tagi</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {script.tags.map((t, i) => <span key={i} className="chip">{t}</span>)}
                            </div>
                        </div>
                    )}
                </div>
                <aside>
                    <div className="glass rounded-2xl p-6 lg:sticky lg:top-24">
                        <h3 className="font-mono font-bold text-white mb-4 tracking-wider uppercase text-sm">Pobierz</h3>
                        <a href={script.download_url} target="_blank" rel="noreferrer" className="block w-full btn-primary text-center mb-3">
                            Pobierz {script.is_free ? 'za darmo' : ''}
                        </a>
                        <a href={script.download_url} target="_blank" rel="noreferrer" className="block w-full btn-ghost text-center text-sm">
                            Zobacz na GitHub
                        </a>
                        <hr className="border-white/5 my-5" />
                        <dl className="text-sm space-y-2 font-mono">
                            <div className="flex justify-between gap-2"><dt className="text-gray-400 flex-shrink-0">Autor</dt><dd className="text-white text-right truncate">{script.author}</dd></div>
                            <div className="flex justify-between gap-2"><dt className="text-gray-400 flex-shrink-0">Wersja</dt><dd className="text-white text-right">{script.version}</dd></div>
                            <div className="flex justify-between gap-2"><dt className="text-gray-400 flex-shrink-0">Aktualizacja</dt><dd className="text-white text-right">{script.last_updated}</dd></div>
                        </dl>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function Section({ title, items, icon }) {
    if (!items || items.length === 0) return null;
    const stroke = icon === 'check' ? '#00ff88' : '#00d4ff';
    return (
        <div className="mt-6">
            <h3 className="font-mono text-sm font-bold text-neon-green mb-3 tracking-wider uppercase">{title}</h3>
            <ul className="space-y-2">
                {items.map((it, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" className="mt-0.5 flex-shrink-0">
                            {icon === 'check' ? <path d="M20 6L9 17l-5-5"/> : <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>}
                        </svg>
                        <span>{it}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function TutorialsPage({ tutorials, loading, setCurrentPage, setSelectedTutorial }) {
    return (
        <div className="max-w-6xl mx-auto px-4 pt-28 pb-16 page-anim">
            <header className="mb-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold gradient-text">Tutoriale</h1>
                <p className="text-gray-400 mt-3">Poradniki, konfiguracje krok po kroku i best practices.</p>
            </header>
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => <ScriptCardSkeleton key={i} />)}
                </div>
            ) : tutorials.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center text-gray-400 font-mono">Brak tutoriali.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tutorials.map((t, i) => (
                        <div key={t.id} onClick={() => { setSelectedTutorial(t); setCurrentPage('tutorial-detail'); }}
                            className="glass-card rounded-2xl p-5 cursor-pointer group animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="chip-blue">{t.category}</span>
                                <span className="text-[11px] font-mono text-gray-500">{t.read_time}</span>
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
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-16 page-anim">
            <button onClick={() => setCurrentPage('tutorials')} className="mb-6 font-mono text-sm text-gray-400 hover:text-neon-green inline-flex items-center gap-1.5 transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Wróć
            </button>
            <article className="glass rounded-2xl p-6 sm:p-10">
                <div className="flex items-center gap-2 mb-3 text-xs font-mono flex-wrap">
                    <span className="chip-blue">{tutorial.category}</span>
                    <span className="text-gray-500">{tutorial.read_time}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">{tutorial.date}</span>
                </div>
                <h1 className="text-3xl font-extrabold text-white mb-3">{tutorial.title}</h1>
                <p className="text-gray-400 mb-6 leading-relaxed">{tutorial.excerpt}</p>
                <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: tutorial.content || '' }} />
            </article>
        </div>
    );
}

function NewsPage({ news, loading }) {
    return (
        <div className="max-w-5xl mx-auto px-4 pt-28 pb-16 page-anim">
            <header className="mb-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold gradient-text">Aktualności</h1>
                <p className="text-gray-400 mt-3">Najnowsze wydania, kamienie milowe i aktualizacje.</p>
            </header>
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32" />)}
                </div>
            ) : news.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center text-gray-400 font-mono">Brak aktualności.</div>
            ) : (
                <div className="space-y-4">
                    {news.map((n, i) => (
                        <div key={n.id} className="glass-card rounded-2xl p-5 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                            <div className="flex flex-wrap items-center gap-2 mb-2 text-xs font-mono">
                                <span className={`chip ${n.category === 'milestone' ? 'chip-yellow' : n.category === 'feature' ? 'chip-purple' : 'chip-blue'}`}>{n.category}</span>
                                {n.featured && <span className="chip">★ wyróżnione</span>}
                                <span className="text-gray-500">{n.date}</span>
                            </div>
                            <h2 className="font-mono font-bold text-xl text-white mb-1.5">{n.title}</h2>
                            <p className="text-sm text-gray-400 mb-2">{n.excerpt}</p>
                            <p className="text-sm text-gray-300 leading-relaxed">{n.content}</p>
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

    const onSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        const r = await addMessage(form);
        setSending(false);
        if (r && r.ok) {
            setSent(true);
            setForm({ name: '', email: '', subject: '', message: '' });
            toast.push('Wiadomość wysłana ✓', 'success');
            setTimeout(() => setSent(false), 3500);
        } else {
            toast.push('Błąd wysyłania: ' + (r?.error || 'unknown'), 'error');
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-16 page-anim">
            <header className="mb-8 text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold gradient-text">Kontakt</h1>
                <p className="text-gray-400 mt-3">Masz pytanie? Napisz do nas — odpowiemy najszybciej jak to możliwe.</p>
            </header>
            <form onSubmit={onSubmit} className="glass rounded-2xl p-6 sm:p-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-mono text-gray-400 mb-1.5 tracking-wider uppercase">Imię</label>
                        <input className="field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Twoje imię" />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-gray-400 mb-1.5 tracking-wider uppercase">Email</label>
                        <input type="email" className="field" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="twoj@email.com" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 tracking-wider uppercase">Temat</label>
                    <input className="field" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Temat wiadomości" />
                </div>
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 tracking-wider uppercase">Wiadomość</label>
                    <textarea rows={6} className="field resize-none" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Twoja wiadomość…" />
                </div>
                <button type="submit" className="btn-primary w-full inline-flex items-center justify-center gap-2" disabled={sending}>
                    {sending ? <><Spinner />Wysyłanie…</> : (sent ? '✓ Wysłano' : 'Wyślij wiadomość')}
                </button>
            </form>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                    { name: 'Discord', v: 'discord.gg/goncik-tech', c: 'green' },
                    { name: 'GitHub', v: 'github.com/goncik-tech', c: 'blue' },
                    { name: 'Email', v: 'contact@goncik.tech', c: 'purple' },
                ].map((c) => (
                    <div key={c.name} className="glass-card rounded-2xl p-4 text-center">
                        <div className={`text-xs font-mono mb-1 tracking-wider uppercase ${c.c === 'green' ? 'text-neon-green' : c.c === 'blue' ? 'text-neon-blue' : 'text-neon-purple'}`}>{c.name}</div>
                        <div className="text-sm text-gray-300 font-mono break-all">{c.v}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function NotFoundPage({ setCurrentPage }) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center px-4 page-anim">
                <div className="font-mono text-8xl sm:text-9xl font-extrabold gradient-text">404</div>
                <h2 className="font-mono text-2xl sm:text-3xl text-white mt-4 mb-2">Nie znaleziono strony</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">Wygląda na to, że ta strona nie istnieje lub została usunięta.</p>
                <button onClick={() => setCurrentPage('home')} className="btn-primary">Wróć na stronę główną</button>
            </div>
        </div>
    );
}

function FeaturedSection({ scripts, setCurrentPage, setSelected }) {
    const featured = scripts.filter((s) => s.featured).slice(0, 3);
    const [ref, visible] = useScrollReveal();
    return (
        <section ref={ref} className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex items-end justify-between mb-8" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s cubic-bezier(.2,.8,.2,1)' }}>
                <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Polecane skrypty</h2>
                    <p className="text-gray-400 text-sm mt-2">Najpopularniejsze narzędzia w naszej kolekcji.</p>
                </div>
                <button onClick={() => setCurrentPage('scripts')} className="text-sm text-neon-green hover:text-neon-blue font-mono transition">Wszystkie →</button>
            </div>
            {featured.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center text-gray-400 font-mono text-sm">Brak wyróżnionych skryptów.</div>
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
        { t: 'Cloud Native', d: 'Wszystkie dane w chmurze Supabase. Natychmiastowa synchronizacja.', c: 'green' },
        { t: 'Mobile First', d: 'Dodawaj skrypty z telefonu, komputera, tabletu. Zmiany widoczne natychmiast.', c: 'blue' },
        { t: 'Liquid Glass UI', d: 'Nowoczesny interfejs z animowanymi gradientami i glassmorphism.', c: 'purple' },
        { t: 'Open Source', d: 'Wszystkie skrypty są open-source i dostępne na GitHub.', c: 'pink' },
        { t: 'Real-time Updates', d: 'Wszyscy użytkownicy widzą zmiany natychmiast po opublikowaniu.', c: 'green' },
        { t: 'Bezpieczne', d: 'Row Level Security w bazie danych chroni integralność danych.', c: 'blue' },
    ];
    const colorMap = {
        green: { text: 'text-neon-green', border: 'border-neon-green/30' },
        blue: { text: 'text-neon-blue', border: 'border-neon-blue/30' },
        purple: { text: 'text-neon-purple', border: 'border-neon-purple/30' },
        pink: { text: 'text-neon-pink', border: 'border-neon-pink/30' },
    };
    return (
        <section ref={ref} className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-10" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s cubic-bezier(.2,.8,.2,1)' }}>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Dlaczego goncik-tech?</h2>
                <p className="text-gray-400 mt-2 text-sm">Nowa generacja platformy dla developerów.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((it, i) => {
                    const [r, v] = useScrollReveal();
                    const c = colorMap[it.c];
                    return (
                        <div key={i} ref={r} className="glass-card rounded-2xl p-5"
                            style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.6s cubic-bezier(.2,.8,.2,1)' }}>
                            <div className={`w-11 h-11 rounded-xl glass flex items-center justify-center mb-3 ${c.text}`}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                            </div>
                            <h3 className={`font-mono font-bold mb-1.5 ${c.text}`}>{it.t}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">{it.d}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

/* =========================================================
   8. ADMIN PANEL
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
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center text-black font-bold">⚡</div>
                    <h3 className="font-mono text-xl font-bold text-white">Panel admina</h3>
                </div>
                <p className="text-xs text-gray-400 mb-5 leading-relaxed">Zaloguj się, aby zarządzać skryptami, tutorialami i aktualnościami w chmurze.</p>
                <label className="block text-xs font-mono text-gray-400 mb-1.5 tracking-wider uppercase">Hasło</label>
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

function AdminDashboard({ open, onClose, data, setData, refresh, messages, onMarkRead, onReply, onDeleteMessage, serverStatus }) {
    const [tab, setTab] = useState('overview');
    const [editing, setEditing] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [saving, setSaving] = useState(false);
    const toast = useToast();

    if (!open) return null;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'scripts', label: 'Skrypty', count: data.scripts.length, icon: '⚡' },
        { id: 'tutorials', label: 'Tutoriale', count: data.tutorials.length, icon: '📚' },
        { id: 'news', label: 'Aktualności', count: data.news.length, icon: '📰' },
        { id: 'messages', label: 'Wiadomości', count: messages.length, highlight: messages.filter((m) => m.status === 'unread').length, icon: '✉️' },
    ];

    const handleSave = async (type, item) => {
        setSaving(true);
        try {
            const table = type;
            if (item.id) {
                const { error } = await supabase.from(table).update(item).eq('id', item.id);
                if (error) throw error;
            } else {
                const { data: inserted, error } = await supabase.from(table).insert([item]).select();
                if (error) throw error;
                item.id = inserted?.[0]?.id;
            }
            await refresh();
            setEditing(null);
            toast.push('Zapisano w chmurze ✓', 'success');
        } catch (e) {
            toast.push('Błąd: ' + e.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (type, id) => {
        if (!confirm('Na pewno usunąć?')) return;
        setSaving(true);
        try {
            const { error } = await supabase.from(type).delete().eq('id', id);
            if (error) throw error;
            await refresh();
            toast.push('Usunięto ✓', 'success');
        } catch (e) {
            toast.push('Błąd: ' + e.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in" onClick={onClose}>
            <div className="glass-strong rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center text-black font-bold flex-shrink-0">⚡</div>
                        <div className="min-w-0">
                            <div className="font-mono font-bold text-white">Panel admina</div>
                            <div className="text-[11px] font-mono text-gray-500">goncik-tech • liquid cloud</div>
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
                    <aside className="border-r border-white/5 p-3 space-y-1 hidden md:block overflow-y-auto">
                        {tabs.map((t) => (
                            <button key={t.id} onClick={() => { setTab(t.id); setEditing(null); setSelectedMessage(null); }}
                                className={`w-full text-left px-3 py-2.5 rounded-lg font-mono text-sm transition flex items-center justify-between ${
                                    tab === t.id ? 'bg-neon-green/10 text-neon-green border border-neon-green/30' : 'text-gray-300 hover:bg-white/5 border border-transparent'
                                }`}>
                                <span className="flex items-center gap-2"><span>{t.icon}</span>{t.label}</span>
                                <span className="flex items-center gap-1">
                                    {t.highlight > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                                    <span className="text-[10px] text-gray-500">{t.count ?? ''}</span>
                                </span>
                            </button>
                        ))}
                    </aside>
                    <div className="overflow-y-auto p-4 sm:p-6">
                        <div className="md:hidden flex gap-1 overflow-x-auto pb-3 mb-2 no-scrollbar">
                            {tabs.map((t) => (
                                <button key={t.id} onClick={() => { setTab(t.id); setEditing(null); setSelectedMessage(null); }}
                                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-mono text-xs ${
                                        tab === t.id ? 'bg-neon-green/10 text-neon-green' : 'text-gray-300 glass'
                                    }`}>
                                    {t.icon} {t.label} {t.count != null && <span className="text-gray-500">({t.count})</span>}
                                </button>
                            ))}
                        </div>

                        {tab === 'overview' && <OverviewTab data={data} messages={messages} />}
                        {tab === 'scripts' && <ItemsTab type="scripts" data={data} editing={editing} setEditing={setEditing} onSave={handleSave} onDelete={handleDelete} saving={saving} />}
                        {tab === 'tutorials' && <ItemsTab type="tutorials" data={data} editing={editing} setEditing={setEditing} onSave={handleSave} onDelete={handleDelete} saving={saving} />}
                        {tab === 'news' && <ItemsTab type="news" data={data} editing={editing} setEditing={setEditing} onSave={handleSave} onDelete={handleDelete} saving={saving} />}
                        {tab === 'messages' && <MessagesTab messages={messages} onMarkRead={onMarkRead} onDelete={onDeleteMessage} selected={selectedMessage} setSelected={setSelectedMessage} replyText={replyText} setReplyText={setReplyText} onReply={onReply} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

function OverviewTab({ data, messages }) {
    const totalDownloads = data.scripts.reduce((acc, s) => acc + (s.downloads || 0), 0);
    const freeCount = data.scripts.filter((s) => s.is_free).length;
    const unread = messages.filter((m) => m.status === 'unread').length;
    const stats = [
        { label: 'Skrypty', value: data.scripts.length, color: 'text-neon-green', icon: '⚡' },
        { label: 'Darmowe', value: freeCount, color: 'text-neon-blue', icon: '🆓' },
        { label: 'Tutoriale', value: data.tutorials.length, color: 'text-neon-purple', icon: '📚' },
        { label: 'Aktualności', value: data.news.length, color: 'text-neon-yellow', icon: '📰' },
        { label: 'Pobrań (łącznie)', value: totalDownloads.toLocaleString(), color: 'text-white', icon: '📥' },
        { label: 'Wiadomości (nieprzeczytane)', value: `${messages.length} (${unread})`, color: 'text-neon-pink', icon: '✉️' },
    ];
    return (
        <div className="space-y-6">
            <h2 className="font-mono text-2xl font-bold text-white">Statystyki</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {stats.map((s) => (
                    <div key={s.label} className="glass-card rounded-2xl p-4">
                        <div className="text-2xl mb-2">{s.icon}</div>
                        <div className={`font-mono text-2xl sm:text-3xl font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-xs text-gray-400 font-mono mt-1 tracking-wider uppercase">{s.label}</div>
                    </div>
                ))}
            </div>
            <div className="glass rounded-2xl p-5 text-sm text-gray-300 leading-relaxed">
                <h3 className="font-mono font-bold text-neon-green mb-3 flex items-center gap-2"><span>☁️</span>Liquid Cloud</h3>
                <p className="mb-2">Każda zmiana w panelu admina jest natychmiast zapisywana do bazy danych <strong className="text-neon-blue">Supabase</strong>.</p>
                <p>Wszystkie dane są dostępne globalnie i widoczne dla wszystkich użytkowników bez opóźnień. Możesz dodawać treści z telefonu, komputera, tabletu — w każdym miejscu i czasie.</p>
            </div>
        </div>
    );
}

function ItemsTab({ type, data, editing, setEditing, onSave, onDelete, saving }) {
    const list = data[type] || [];
    const titles = { scripts: 'Skrypty', tutorials: 'Tutoriale', news: 'Aktualności' };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="font-mono text-2xl font-bold text-white">{titles[type]}</h2>
                <button onClick={() => setEditing({ type, mode: 'add', item: defaultsFor(type) })} className="btn-primary text-sm">+ Dodaj</button>
            </div>

            {editing && editing.type === type && (
                <ItemForm type={type} item={editing.item} mode={editing.mode} onCancel={() => setEditing(null)} onSave={(it) => onSave(type, it)} saving={saving} />
            )}

            {list.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center text-gray-400 font-mono text-sm">Brak elementów. Dodaj pierwszy!</div>
            ) : (
                <div className="space-y-2">
                    {list.map((item) => (
                        <div key={item.id} className="glass-card rounded-xl p-4 flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="font-mono font-bold text-white truncate">{item.name || item.title}</div>
                                <div className="text-xs text-gray-400 truncate">{item.description || item.excerpt}</div>
                                <div className="flex flex-wrap gap-2 mt-1.5 text-[10px] font-mono text-gray-500">
                                    {item.category && <span className="chip">#{item.category}</span>}
                                    {item.is_free != null && <span className={item.is_free ? 'chip' : 'chip-blue'}>{item.is_free ? 'FREE' : 'PREMIUM'}</span>}
                                    {item.version && <span>v{item.version}</span>}
                                    {item.date && <span>{item.date}</span>}
                                </div>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                                <button onClick={() => setEditing({ type, mode: 'edit', item: { ...item } })} className="icon-btn" title="Edytuj">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button onClick={() => onDelete(type, item.id)} className="icon-btn hover:text-red-400 hover:border-red-500/30" title="Usuń">
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
    const today = new Date().toISOString().slice(0, 10);
    if (type === 'scripts') return {
        name: '', description: '', category: 'script', tags: [], features: [], download_url: '',
        is_free: true, downloads: 0, rating: 5.0, last_updated: today, version: '1.0.0',
        author: 'Goncik', requirements: [], featured: false,
    };
    if (type === 'tutorials') return {
        title: '', excerpt: '', content: '', category: 'script', tags: [],
        author: 'Goncik', date: today, read_time: '5 min', featured: false,
    };
    return {
        title: '', excerpt: '', content: '', category: 'update', author: 'Goncik', date: today, featured: false,
    };
}

function ItemForm({ type, item, mode, onSave, onCancel, saving }) {
    const [state, setState] = useState(() => ({ ...defaultsFor(type), ...item }));
    const set = (k, v) => setState((s) => ({ ...s, [k]: v }));

    const submit = (e) => { e.preventDefault(); onSave(state); };

    return (
        <form onSubmit={submit} className="glass rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="font-mono font-bold text-neon-green">{mode === 'add' ? 'Dodaj nowy' : 'Edytuj'}</h3>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{type}</span>
            </div>
            {type === 'scripts' && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Nazwa</label><input className="field" required value={state.name} onChange={(e) => set('name', e.target.value)} /></div>
                        <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Wersja</label><input className="field" value={state.version} onChange={(e) => set('version', e.target.value)} /></div>
                    </div>
                    <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Opis</label><textarea className="field" rows={2} required value={state.description} onChange={(e) => set('description', e.target.value)} /></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Kategoria</label>
                            <select className="field" value={state.category} onChange={(e) => set('category', e.target.value)}>
                                {['bypass','script','bot','tool','generator'].map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Typ</label>
                            <select className="field" value={state.is_free ? 'free' : 'premium'} onChange={(e) => set('is_free', e.target.value === 'free')}>
                                <option value="free">Darmowy</option><option value="premium">Premium</option>
                            </select>
                        </div>
                        <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Pobrań</label><input type="number" className="field" value={state.downloads || 0} onChange={(e) => set('downloads', +e.target.value)} /></div>
                        <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Ocena</label><input type="number" step="0.1" min="0" max="5" className="field" value={state.rating || 0} onChange={(e) => set('rating', +e.target.value)} /></div>
                    </div>
                    <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">URL do pobrania</label><input className="field" required value={state.download_url} onChange={(e) => set('download_url', e.target.value)} /></div>
                    <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Tagi (przecinek)</label><input className="field" value={(state.tags || []).join(', ')} onChange={(e) => set('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))} /></div>
                    <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Funkcje (jedna na linię)</label><textarea className="field" rows={3} value={(state.features || []).join('\n')} onChange={(e) => set('features', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))} /></div>
                    <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Wymagania (jedno na linię)</label><textarea className="field" rows={2} value={(state.requirements || []).join('\n')} onChange={(e) => set('requirements', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))} /></div>
                </>
            )}
            {type === 'tutorials' && (
                <>
                    <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Tytuł</label><input className="field" required value={state.title} onChange={(e) => set('title', e.target.value)} /></div>
                    <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Krótki opis</label><textarea className="field" rows={2} required value={state.excerpt} onChange={(e) => set('excerpt', e.target.value)} /></div>
                    <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Treść (HTML)</label><textarea className="field font-mono" rows={6} value={state.content} onChange={(e) => set('content', e.target.value)} placeholder="<h3>...</h3><p>...</p>" /></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Kategoria</label>
                            <select className="field" value={state.category} onChange={(e) => set('category', e.target.value)}>
                                {['bypass','script','bot','tool'].map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Czas</label><input className="field" value={state.read_time} onChange={(e) => set('read_time', e.target.value)} /></div>
                        <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Data</label><input type="date" className="field" value={state.date} onChange={(e) => set('date', e.target.value)} /></div>
                        <div className="flex items-end"><label className="flex items-center gap-2 text-xs font-mono text-gray-300"><input type="checkbox" className="check" checked={!!state.featured} onChange={(e) => set('featured', e.target.checked)} />Wyróżniony</label></div>
                    </div>
                    <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Tagi (przecinek)</label><input className="field" value={(state.tags || []).join(', ')} onChange={(e) => set('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))} /></div>
                </>
            )}
            {type === 'news' && (
                <>
                    <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Tytuł</label><input className="field" required value={state.title} onChange={(e) => set('title', e.target.value)} /></div>
                    <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Krótki opis</label><textarea className="field" rows={2} required value={state.excerpt} onChange={(e) => set('excerpt', e.target.value)} /></div>
                    <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Pełna treść</label><textarea className="field" rows={4} value={state.content} onChange={(e) => set('content', e.target.value)} /></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Kategoria</label>
                            <select className="field" value={state.category} onChange={(e) => set('category', e.target.value)}>
                                {['update','milestone','feature'].map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div><label className="text-xs text-gray-400 font-mono tracking-wider uppercase">Data</label><input type="date" className="field" value={state.date} onChange={(e) => set('date', e.target.value)} /></div>
                        <div className="flex items-end"><label className="flex items-center gap-2 text-xs font-mono text-gray-300"><input type="checkbox" className="check" checked={!!state.featured} onChange={(e) => set('featured', e.target.checked)} />Wyróżniony</label></div>
                    </div>
                </>
            )}
            <div className="flex gap-2 pt-2">
                <button type="button" onClick={onCancel} className="btn-ghost flex-1">Anuluj</button>
                <button type="submit" className="btn-primary flex-1 inline-flex items-center justify-center gap-2" disabled={saving}>
                    {saving ? <><Spinner />Zapisuję…</> : 'Zapisz w chmurze'}
                </button>
            </div>
        </form>
    );
}

function MessagesTab({ messages, onMarkRead, onDelete, selected, setSelected, replyText, setReplyText, onReply }) {
    if (selected) {
        const send = async () => {
            if (!replyText.trim()) return;
            await onReply(selected.id, replyText);
            setReplyText('');
        };
        return (
            <div className="space-y-3">
                <button onClick={() => setSelected(null)} className="text-sm text-gray-400 hover:text-neon-green font-mono">← Wróć do listy</button>
                <div className="glass rounded-2xl p-5">
                    <div className="text-xs font-mono text-gray-500 mb-1">Od: <span className="text-white">{selected.name}</span> ({selected.email})</div>
                    <div className="text-xs font-mono text-gray-500 mb-1">Temat: <span className="text-white">{selected.subject}</span></div>
                    <div className="text-xs font-mono text-gray-500 mb-3">Data: {new Date(selected.created_at).toLocaleString('pl-PL')}</div>
                    <div className="bg-ink-700/50 rounded-xl p-4 text-sm text-gray-200 whitespace-pre-wrap">{selected.message}</div>
                </div>
                <div className="glass rounded-2xl p-5">
                    <h3 className="font-mono font-bold text-neon-green mb-2 text-sm">Odpowiedź</h3>
                    <textarea className="field" rows={3} value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Napisz odpowiedź…" />
                    <button onClick={send} className="btn-primary mt-3">Wyślij</button>
                </div>
                {(selected.replies || []).length > 0 && (
                    <div className="space-y-2">
                        <h3 className="font-mono font-bold text-white text-sm">Historia</h3>
                        {(selected.replies || []).map((r) => (
                            <div key={r.id} className="glass rounded-xl p-3 border-l-2 border-neon-blue">
                                <div className="text-[11px] font-mono text-neon-blue mb-1">Admin • {new Date(r.timestamp).toLocaleString('pl-PL')}</div>
                                <div className="text-sm text-gray-200">{r.text}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
    if (messages.length === 0) return <div className="glass rounded-2xl p-12 text-center text-gray-400 font-mono">Brak wiadomości.</div>;
    return (
        <div className="space-y-2">
            {messages.map((m) => (
                <div key={m.id} onClick={() => { onMarkRead(m.id); setSelected(m); }}
                    className={`glass-card rounded-xl p-4 cursor-pointer ${m.status === 'unread' ? 'border-l-4 border-l-neon-green' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-mono font-bold text-white text-sm">{m.name}</span>
                                <span className="text-[10px] text-gray-500 font-mono">{new Date(m.created_at).toLocaleString('pl-PL')}</span>
                                {m.status === 'unread' && <span className="chip text-[10px]">Nowa</span>}
                                {m.status === 'replied' && <span className="chip-blue text-[10px]">Odpowiedziana</span>}
                            </div>
                            <div className="text-xs text-gray-500 font-mono">{m.email}</div>
                            <div className="text-sm text-gray-200 font-mono mt-1">{m.subject}</div>
                            <div className="text-xs text-gray-400 line-clamp-2 mt-1">{m.message}</div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); if (confirm('Usunąć?')) onDelete(m.id); }} className="icon-btn hover:text-red-400 hover:border-red-500/30">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* =========================================================
   9. GŁÓWNY APP
   ========================================================= */
function App() {
    const [page, setPage] = useState('home');
    const [data, setData] = useState({ scripts: [], tutorials: [], news: [] });
    const [loading, setLoading] = useState({ scripts: true, tutorials: true, news: true });
    const [selectedScript, setSelectedScript] = useState(null);
    const [selectedTutorial, setSelectedTutorial] = useState(null);
    const [adminOpen, setAdminOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const toast = useToast();
    const serverStatus = useSupabaseStatus();
    const { isAdmin, login, logout } = useAdminAuth();

    // Fetch all data from Supabase
    const refresh = useCallback(async () => {
        if (!supabase) return;
        try {
            const [scriptsRes, tutorialsRes, newsRes, messagesRes] = await Promise.all([
                supabase.from('scripts').select('*').order('id', { ascending: true }),
                supabase.from('tutorials').select('*').order('id', { ascending: true }),
                supabase.from('news').select('*').order('id', { ascending: true }),
                supabase.from('messages').select('*').order('created_at', { ascending: false }),
            ]);
            setData({
                scripts: scriptsRes.data || [],
                tutorials: tutorialsRes.data || [],
                news: newsRes.data || [],
            });
            setMessages(messagesRes.data || []);
            setLoading({ scripts: false, tutorials: false, news: false });
        } catch (e) {
            console.error('Refresh error:', e);
            setLoading({ scripts: false, tutorials: false, news: false });
        }
    }, []);

    useEffect(() => { refresh(); }, [refresh]);

    // Nav from footer
    useEffect(() => {
        const h = (e) => setPage(e.detail);
        window.addEventListener('nav', h);
        return () => window.removeEventListener('nav', h);
    }, []);

    // Scroll to top on page change
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [page]);

    const onAdminClick = () => { if (isAdmin) setAdminOpen(true); else setLoginOpen(true); };

    // Message handlers
    const addMessage = async (m) => {
        if (!supabase) return { ok: false, error: 'No supabase' };
        const { data: inserted, error } = await supabase.from('messages').insert([m]).select();
        if (error) return { ok: false, error: error.message };
        await refresh();
        return { ok: true, data: inserted };
    };
    const onMarkRead = async (id) => {
        await supabase.from('messages').update({ status: 'read' }).eq('id', id);
        await refresh();
    };
    const onReply = async (id, text) => {
        const m = messages.find((x) => x.id === id);
        const newReplies = [...(m.replies || []), { id: Date.now(), text, timestamp: new Date().toISOString(), isAdmin: true }];
        await supabase.from('messages').update({ replies: newReplies, status: 'replied' }).eq('id', id);
        await refresh();
    };
    const onDeleteMessage = async (id) => {
        await supabase.from('messages').delete().eq('id', id);
        await refresh();
    };

    const renderPage = () => {
        switch (page) {
            case 'home':
                return (
                    <>
                        <Hero setCurrentPage={setPage} />
                        <FeaturedSection scripts={data.scripts} setCurrentPage={setPage} setSelected={setSelectedScript} />
                        <WhySection />
                    </>
                );
            case 'scripts': return <ScriptsPage scripts={data.scripts} loading={loading.scripts} setCurrentPage={setPage} setSelected={setSelectedScript} />;
            case 'bypassy': return <ScriptsPage scripts={data.scripts} loading={loading.scripts} setCurrentPage={setPage} setSelected={setSelectedScript} filter="bypass" />;
            case 'free': return <ScriptsPage scripts={data.scripts} loading={loading.scripts} setCurrentPage={setPage} setSelected={setSelectedScript} filter="free" />;
            case 'script-detail': return <ScriptDetailPage script={selectedScript} setCurrentPage={setPage} />;
            case 'tutorials': return <TutorialsPage tutorials={data.tutorials} loading={loading.tutorials} setCurrentPage={setPage} setSelectedTutorial={setSelectedTutorial} />;
            case 'tutorial-detail': return <TutorialDetailPage tutorial={selectedTutorial} setCurrentPage={setPage} />;
            case 'news': return <NewsPage news={data.news} loading={loading.news} />;
            case 'contact': return <ContactPage addMessage={addMessage} />;
            default: return <NotFoundPage setCurrentPage={setPage} />;
        }
    };

    return (
        <ToastProvider>
            <MatrixRain />
            <div className="relative min-h-screen flex flex-col">
                <Navbar currentPage={page} setCurrentPage={setPage} status={serverStatus} onAdminClick={onAdminClick} isAdmin={isAdmin} />
                <main className="flex-1">{renderPage()}</main>
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
                        refresh={refresh}
                        messages={messages}
                        onMarkRead={onMarkRead}
                        onReply={onReply}
                        onDeleteMessage={onDeleteMessage}
                        serverStatus={serverStatus}
                    />
                )}
            </div>
        </ToastProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
