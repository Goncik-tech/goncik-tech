// ============================================
// GONCIK-TECH MAIN APP
// ============================================

// Data - loaded from data.js
let scripts, tutorials, news;

try {
    if (window.data) {
        scripts = window.data.scripts;
        tutorials = window.data.tutorials;
        news = window.data.news;
    } else {
        console.error('Data not loaded - data.js may have failed to load');
        // Fallback empty data
        scripts = [];
        tutorials = [];
        news = [];
    }
} catch (error) {
    console.error('Error loading data:', error);
    scripts = [];
    tutorials = [];
    news = [];
}

// ============================================
// UTILITY HOOKS
// ============================================

// Scroll Reveal Hook
function useScrollReveal() {
    const [isVisible, setIsVisible] = React.useState(false);
    const ref = React.useRef(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.disconnect();
            }
        };
    }, []);

    return [ref, isVisible];
}

// ============================================
// COMPONENTS
// ============================================

// Logo Component
const Logo = () => (
    <div className="flex items-center space-x-2 transition-all duration-500">
        <svg
            width="40"
            height="40"
            viewBox="0 0 100 100"
            className="neon-border rounded-lg"
        >
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00ff41" />
                    <stop offset="100%" stopColor="#00d4ff" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <rect
                x="10"
                y="10"
                width="80"
                height="80"
                rx="10"
                fill="url(#logoGradient)"
                filter="url(#glow)"
            />
            <text
                x="50"
                y="60"
                fontSize="24"
                fontWeight="bold"
                fill="#0a0a0a"
                textAnchor="middle"
                fontFamily="'JetBrains Mono', monospace"
            >G</text>
        </svg>
        <span className="font-mono font-bold text-xl neon-text text-neon-green">goncik-tech</span>
    </div>
);

// Navbar Component
const Navbar = ({ currentPage, setCurrentPage, isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Home', page: 'home' },
        { name: 'Skrypty', page: 'scripts' },
        { name: 'Bypassy', page: 'bypassy' },
        { name: 'Darmowe', page: 'free' },
        { name: 'Tutoriale', page: 'tutorials' },
        { name: 'News', page: 'news' },
        { name: 'Kontakt', page: 'contact' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled ? 'glass-effect py-4' : 'py-6'
        }`}>
            <div className="container mx-auto px-4 transition-all duration-500">
                <div className="flex items-center justify-between transition-all duration-500">
                    <button
                        onClick={() => setCurrentPage('home')}
                        className="hover:opacity-80 transition-opacity"
                    >
                        <Logo />
                    </button>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8 transition-all duration-500">
                        {navItems.map((item) => (
                            <button
                                onClick={() => setCurrentPage(item.page)}
                                className={`font-mono text-sm transition-all duration-200 relative group ${
                                    currentPage === item.page
                                        ? 'text-neon-green'
                                        : 'text-gray-300 hover:text-neon-green'
                                }`}
                            >
                                {item.name}
                                <span className={`absolute bottom-[-5px] left-0 w-full h-0.5 bg-neon-green transition-all duration-200 ${
                                    currentPage === item.page ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                }`} />
                            </button>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-neon-green hover:text-neon-blue transition-colors"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            {isMobileMenuOpen ? (
                                <path d="M18 6L6 18M6 6l12 12" />
                            ) : (
                                <>
                                    <path d="M3 12h18M3 6h18M3 18h18" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div
                        className="md:hidden mt-4 pb-4 transition-all duration-500"
                    >
                        <div className="flex flex-col space-y-3 transition-all duration-500">
                            {navItems.map((item) => (
                                <button
                                    onClick={() => {
                                        setCurrentPage(item.page);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`font-mono text-sm text-left py-2 px-4 rounded transition-all duration-200 ${
                                        currentPage === item.page
                                            ? 'text-neon-green bg-neon-green/10'
                                            : 'text-gray-300 hover:text-neon-green hover:bg-neon-green/5'
                                    }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

// Footer Component
const Footer = ({ isAdmin, isAdminPanelOpen, setIsAdminPanelOpen, logout }) => (
    <footer className="bg-kali-dark border-t border-kali-border py-12">
        <div className="container mx-auto px-4 transition-all duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 transition-all duration-500">
                <div>
                    <div className="mb-4 transition-all duration-500">
                        <Logo />
                    </div>
                    <p className="text-gray-400 text-sm">
                        Darmowe i płatne skrypty, bypassy do AI i inne narzędzia.
                    </p>
                </div>

                <div>
                    <h4 className="font-mono font-bold text-neon-green mb-4">Narzędzia</h4>
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setCurrentPage('scripts')}
                                className="text-gray-400 hover:text-neon-green text-sm transition-colors"
                            >
                                Wszystkie skrypty
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentPage('bypassy')}
                                className="text-gray-400 hover:text-neon-green text-sm transition-colors"
                            >
                                Bypassy AI
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentPage('free')}
                                className="text-gray-400 hover:text-neon-green text-sm transition-colors"
                            >
                                Darmowe
                            </button>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-mono font-bold text-neon-green mb-4">Zasoby</h4>
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setCurrentPage('tutorials')}
                                className="text-gray-400 hover:text-neon-green text-sm transition-colors"
                            >
                                Tutoriale
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentPage('news')}
                                className="text-gray-400 hover:text-neon-green text-sm transition-colors"
                            >
                                Aktualności
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentPage('contact')}
                                className="text-gray-400 hover:text-neon-green text-sm transition-colors"
                            >
                                Kontakt
                            </button>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-mono font-bold text-neon-green mb-4">Social</h4>
                    <div className="flex space-x-4 transition-all duration-500">
                        <a
                            href="https://github.com/goncik-tech"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-neon-green transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                            </svg>
                        </a>
                        <a
                            href="https://discord.gg/goncik-tech"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-neon-green transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                            </svg>
                        </a>
                        <a
                            href="https://twitter.com/goncik-tech"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-neon-green transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.953 4.57a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 0 0-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616v.06a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.936 4.936 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0 0 24 4.59z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-kali-border text-center transition-all duration-500">
                <p className="text-gray-500 text-sm mb-4">
                    © {new Date().getFullYear()} Goncik-tech. All rights reserved.
                </p>

                <div className="flex items-center justify-center gap-4">
                    {isAdmin ? (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsAdminPanelOpen(true)}
                                className="font-mono text-xs text-neon-green hover:text-neon-blue transition-colors"
                            >
                                Panel Admina
                            </button>
                            <span className="text-gray-600">|</span>
                            <button
                                onClick={logout}
                                className="font-mono text-xs text-red-500 hover:text-red-400 transition-colors"
                            >
                                Wyloguj
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAdminPanelOpen(true)}
                            className="font-mono text-xs text-gray-600 hover:text-neon-green transition-colors"
                        >
                            Admin
                        </button>
                    )}
                </div>
            </div>
        </div>
    </footer>
);

// Admin Auth Hook
function useAdminAuth() {
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [isAdminPanelOpen, setIsAdminPanelOpen] = React.useState(false);

    React.useEffect(() => {
        const storedAuth = localStorage.getItem('adminAuth');
        if (storedAuth === 'authenticated') {
            setIsAdmin(true);
        }
    }, []);

    const login = (password) => {
        const adminPassword = 'goncik123'; // Zmień na swoje hasło
        if (password === adminPassword) {
            localStorage.setItem('adminAuth', 'authenticated');
            setIsAdmin(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('adminAuth');
        setIsAdmin(false);
    };

    return { isAdmin, isAdminPanelOpen, setIsAdminPanelOpen, login, logout };
}

// Messages Hook - do zarządzania wiadomościami z kontaktu
function useMessages() {
    const [messages, setMessages] = React.useState([]);

    React.useEffect(() => {
        const storedMessages = localStorage.getItem('adminMessages');
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        }
    }, []);

    const addMessage = (message) => {
        const newMessage = {
            id: Date.now(),
            ...message,
            timestamp: new Date().toISOString(),
            status: 'unread',
            replies: []
        };
        const updatedMessages = [newMessage, ...messages];
        setMessages(updatedMessages);
        localStorage.setItem('adminMessages', JSON.stringify(updatedMessages));
        return newMessage;
    };

    const markAsRead = (messageId) => {
        const updatedMessages = messages.map(msg =>
            msg.id === messageId ? { ...msg, status: 'read' } : msg
        );
        setMessages(updatedMessages);
        localStorage.setItem('adminMessages', JSON.stringify(updatedMessages));
    };

    const addReply = (messageId, reply) => {
        const newReply = {
            id: Date.now(),
            text: reply,
            timestamp: new Date().toISOString(),
            isAdmin: true
        };

        const updatedMessages = messages.map(msg =>
            msg.id === messageId
                ? { ...msg, replies: [...msg.replies, newReply], status: 'replied' }
                : msg
        );

        setMessages(updatedMessages);
        localStorage.setItem('adminMessages', JSON.stringify(updatedMessages));
    };

    const deleteMessage = (messageId) => {
        const updatedMessages = messages.filter(msg => msg.id !== messageId);
        setMessages(updatedMessages);
        localStorage.setItem('adminMessages', JSON.stringify(updatedMessages));
    };

    return { messages, addMessage, markAsRead, addReply, deleteMessage };
}

// Admin Login Component
const AdminLogin = ({ isOpen, onClose, onLogin }) => {
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!password.trim()) {
            setError('Podaj hasło');
            return;
        }

        if (onLogin(password)) {
            setError('');
            setPassword('');
            onClose();
        } else {
            setError('Nieprawidłowe hasło');
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="glass-effect p-8 rounded-lg max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="font-mono text-2xl font-bold text-neon-green mb-6">
                    Panel Admina
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-mono text-gray-400 mb-2">
                            Hasło
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-kali-black border border-kali-border rounded px-4 py-3 text-white font-mono focus:outline-none focus:border-neon-green"
                            placeholder="Podaj hasło admina"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 font-mono text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 font-mono px-4 py-3 border border-neon-green text-neon-green rounded-lg hover:bg-neon-green hover:text-black transition-colors"
                        >
                            Anuluj
                        </button>
                        <button
                            type="submit"
                            className="flex-1 font-mono px-4 py-3 bg-neon-green text-black rounded-lg hover:bg-neon-blue transition-colors"
                        >
                            Zaloguj
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Admin Dashboard Component
const AdminDashboard = ({ isOpen, onClose, scripts, setScripts, tutorials, setTutorials, news, setNews }) => {
    const [activeTab, setActiveTab] = React.useState('dashboard');
    const [editedItem, setEditedItem] = React.useState(null);
    const [showAddForm, setShowAddForm] = React.useState(false);
    const [formData, setFormData] = React.useState({});
    const [selectedMessage, setSelectedMessage] = React.useState(null);
    const [replyText, setReplyText] = React.useState('');

    // Messages hook
    const { messages, markAsRead, addReply, deleteMessage } = useMessages();

    if (!isOpen) return null;

    const handleSave = (itemType, itemData) => {
        const setters = {
            scripts: setScripts,
            tutorials: setTutorials,
            news: setNews
        };

        const collections = {
            scripts: scripts,
            tutorials: tutorials,
            news: news
        };

        let updatedCollection;

        if (itemData.id) {
            // Edycja istniejącego
            updatedCollection = collections[itemType].map(item =>
                item.id === itemData.id ? { ...item, ...itemData } : item
            );
        } else {
            // Dodawanie nowego
            const newId = Math.max(...collections[itemType].map(item => item.id)) + 1;
            updatedCollection = [...collections[itemType], { id: newId, ...itemData }];
        }

        setters[itemType](updatedCollection);
        setEditedItem(null);
        setShowAddForm(false);
        setFormData({});
    };

    const handleDelete = (itemType, id) => {
        const setters = {
            scripts: setScripts,
            tutorials: setTutorials,
            news: setNews
        };

        const collections = {
            scripts: scripts,
            tutorials: tutorials,
            news: news
        };

        const updatedCollection = collections[itemType].filter(item => item.id !== id);
        setters[itemType](updatedCollection);
    };

    const handleReply = () => {
        if (!replyText.trim()) return;

        addReply(selectedMessage.id, replyText);
        setReplyText('');
        setSelectedMessage(null);
    };

    const unreadCount = messages.filter(m => m.status === 'unread').length;
            scripts: scripts,
            tutorials: tutorials,
            news: news
        };

        const updatedCollection = collections[itemType].filter(item => item.id !== id);
        setters[itemType](updatedCollection);
    };

    const renderDashboard = () => (
        <div className="space-y-6">
            <div className="glass-effect p-6 rounded-lg">
                <h3 className="font-mono text-2xl font-bold text-neon-green mb-4">
                    Statystyki
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="font-mono text-3xl font-bold text-neon-green">{scripts.length}</div>
                        <div className="text-gray-400 text-sm">Skrypty</div>
                    </div>
                    <div className="text-center">
                        <div className="font-mono text-3xl font-bold text-neon-blue">{tutorials.length}</div>
                        <div className="text-gray-400 text-sm">Tutoriale</div>
                    </div>
                    <div className="text-center">
                        <div className="font-mono text-3xl font-bold text-neon-purple">{news.length}</div>
                        <div className="text-gray-400 text-sm">Aktualności</div>
                    </div>
                    <div className="text-center">
                        <div className="font-mono text-3xl font-bold text-neon-pink">{scripts.reduce((acc, s) => acc + s.downloads, 0)}</div>
                        <div className="text-gray-400 text-sm">Pobrań</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderItemsList = (items, itemType) => (
        <div className="space-y-4">
            {showAddForm && editedItem === null ? (
                <div className="glass-effect p-6 rounded-lg">
                    <h3 className="font-mono text-xl font-bold text-neon-green mb-4">
                        Dodaj nowy
                    </h3>
                    {itemType === 'scripts' && (
                        <ScriptForm
                            formData={formData}
                            setFormData={setFormData}
                            onSave={(data) => handleSave(itemType, data)}
                            onCancel={() => setShowAddForm(false)}
                        />
                    )}
                    {itemType === 'tutorials' && (
                        <TutorialForm
                            formData={formData}
                            setFormData={setFormData}
                            onSave={(data) => handleSave(itemType, data)}
                            onCancel={() => setShowAddForm(false)}
                        />
                    )}
                    {itemType === 'news' && (
                        <NewsForm
                            formData={formData}
                            setFormData={setFormData}
                            onSave={(data) => handleSave(itemType, data)}
                            onCancel={() => setShowAddForm(false)}
                        />
                    )}
                </div>
            ) : null}

            {items.map(item => (
                <div key={item.id} className="glass-effect p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h4 className="font-mono font-bold text-white mb-2">
                                {item.name || item.title}
                            </h4>
                            <p className="text-gray-400 text-sm">
                                {item.description || item.excerpt}
                            </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                            <button
                                onClick={() => {
                                    setEditedItem(item);
                                    setFormData(item);
                                    setShowAddForm(true);
                                }}
                                className="p-2 text-neon-blue hover:text-neon-green transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleDelete(itemType, item.id)}
                                className="p-2 text-red-500 hover:text-red-400 transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="glass-effect rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-kali-border flex items-center justify-between">
                    <h3 className="font-mono text-2xl font-bold text-neon-green">
                        Panel Admina
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-4 h-[calc(90vh-80px)]">
                    {/* Sidebar */}
                    <div className="col-span-1 border-r border-kali-border p-4 space-y-2">
                        <button
                            onClick={() => {
                                setActiveTab('dashboard');
                                setShowAddForm(false);
                                setEditedItem(null);
                            }}
                            className={`w-full text-left px-4 py-3 rounded-lg font-mono text-sm transition-colors ${
                                activeTab === 'dashboard'
                                    ? 'bg-neon-green text-black'
                                    : 'text-gray-300 hover:bg-kali-border'
                            }`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('scripts');
                                setShowAddForm(false);
                                setEditedItem(null);
                            }}
                            className={`w-full text-left px-4 py-3 rounded-lg font-mono text-sm transition-colors ${
                                activeTab === 'scripts'
                                    ? 'bg-neon-green text-black'
                                    : 'text-gray-300 hover:bg-kali-border'
                            }`}
                        >
                            Skrypty
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('tutorials');
                                setShowAddForm(false);
                                setEditedItem(null);
                            }}
                            className={`w-full text-left px-4 py-3 rounded-lg font-mono text-sm transition-colors ${
                                activeTab === 'tutorials'
                                    ? 'bg-neon-green text-black'
                                    : 'text-gray-300 hover:bg-kali-border'
                            }`}
                        >
                            Tutoriale
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('news');
                                setShowAddForm(false);
                                setEditedItem(null);
                            }}
                            className={`w-full text-left px-4 py-3 rounded-lg font-mono text-sm transition-colors ${
                                activeTab === 'news'
                                    ? 'bg-neon-green text-black'
                                    : 'text-gray-300 hover:bg-kali-border'
                            }`}
                        >
                            Aktualności
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('messages');
                                setShowAddForm(false);
                                setEditedItem(null);
                            }}
                            className={`w-full text-left px-4 py-3 rounded-lg font-mono text-sm transition-colors relative ${
                                activeTab === 'messages'
                                    ? 'bg-neon-green text-black'
                                    : 'text-gray-300 hover:bg-kali-border'
                            }`}
                        >
                            Wiadomości
                            {unreadCount > 0 && (
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Content */}
                    <div className="col-span-3 p-6 overflow-y-auto">
                        {activeTab === 'dashboard' && renderDashboard()}
                        {activeTab === 'scripts' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-mono text-2xl font-bold text-neon-green">
                                        Skrypty
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setShowAddForm(true);
                                            setEditedItem(null);
                                            setFormData({});
                                        }}
                                        className="font-mono px-4 py-2 bg-neon-green text-black rounded-lg hover:bg-neon-blue transition-colors"
                                    >
                                        + Dodaj
                                    </button>
                                </div>
                                {renderItemsList(scripts, 'scripts')}
                            </div>
                        )}
                        {activeTab === 'tutorials' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-mono text-2xl font-bold text-neon-green">
                                        Tutoriale
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setShowAddForm(true);
                                            setEditedItem(null);
                                            setFormData({});
                                        }}
                                        className="font-mono px-4 py-2 bg-neon-green text-black rounded-lg hover:bg-neon-blue transition-colors"
                                    >
                                        + Dodaj
                                    </button>
                                </div>
                                {renderItemsList(tutorials, 'tutorials')}
                            </div>
                        )}
                         {activeTab === 'news' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-mono text-2xl font-bold text-neon-green">
                                        Aktualności
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setShowAddForm(true);
                                            setEditedItem(null);
                                            setFormData({});
                                        }}
                                        className="font-mono px-4 py-2 bg-neon-green text-black rounded-lg hover:bg-neon-blue transition-colors"
                                    >
                                        + Dodaj
                                    </button>
                                </div>
                                {renderItemsList(news, 'news')}
                            </div>
                        )}
                        {activeTab === 'messages' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-mono text-2xl font-bold text-neon-green">
                                        Wiadomości
                                    </h3>
                                    <div className="text-sm text-gray-400">
                                        {messages.filter(m => m.status === 'unread').length} nieprzeczytanych
                                    </div>
                                </div>

                                {messages.length === 0 ? (
                                    <div className="glass-effect p-12 rounded-lg text-center">
                                        <p className="text-gray-400 font-mono">
                                            Brak wiadomości
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`glass-effect p-4 rounded-lg cursor-pointer transition-all ${
                                                    message.status === 'unread' ? 'border-l-4 border-l-neon-green' : ''
                                                }`}
                                                onClick={() => {
                                                    if (message.status === 'unread') {
                                                        markAsRead(message.id);
                                                    }
                                                    setSelectedMessage(message);
                                                }}
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="font-mono font-bold text-white">
                                                                {message.name}
                                                            </span>
                                                            <span className="text-gray-500 text-sm">
                                                                {new Date(message.timestamp).toLocaleString('pl-PL')}
                                                            </span>
                                                            {message.status === 'unread' && (
                                                                <span className="px-2 py-1 text-xs bg-neon-green text-black rounded-full">
                                                                    Nowa
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-400 text-sm mb-2">
                                                            {message.email}
                                                        </p>
                                                        <p className="text-gray-300 font-mono text-sm mb-1">
                                                            {message.subject}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteMessage(message.id);
                                                        }}
                                                        className="text-red-500 hover:text-red-400 transition-colors"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                <p className="text-gray-400 text-sm line-clamp-2">
                                                    {message.message}
                                                </p>

                                                {message.replies && message.replies.length > 0 && (
                                                    <div className="mt-4 space-y-2">
                                                        {message.replies.map((reply) => (
                                                            <div
                                                                key={reply.id}
                                                                className="bg-kali-black p-3 rounded border-l-2 border-neon-blue"
                                                            >
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-neon-blue font-mono text-xs">
                                                                        Admin
                                                                    </span>
                                                                    <span className="text-gray-500 text-xs">
                                                                        {new Date(reply.timestamp).toLocaleString('pl-PL')}
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-300 text-sm">
                                                                    {reply.text}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Message Detail */}
                                {selectedMessage && (
                                    <div className="glass-effect p-6 rounded-lg mt-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-mono text-xl font-bold text-neon-green">
                                                Szczegóły wiadomości
                                            </h3>
                                            <button
                                                onClick={() => setSelectedMessage(null)}
                                                className="text-gray-400 hover:text-white transition-colors"
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M18 6L6 18M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <span className="text-gray-400 text-sm">Od:</span>
                                                <span className="text-white font-mono ml-2">{selectedMessage.name}</span>
                                                <span className="text-gray-500 text-sm ml-4">({selectedMessage.email})</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 text-sm">Temat:</span>
                                                <span className="text-white font-mono ml-2">{selectedMessage.subject}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 text-sm">Data:</span>
                                                <span className="text-gray-500 text-sm ml-2">
                                                    {new Date(selectedMessage.timestamp).toLocaleString('pl-PL')}
                                                </span>
                                            </div>
                                            <div className="bg-kali-black p-4 rounded">
                                                <span className="text-gray-400 text-sm">Wiadomość:</span>
                                                <p className="text-gray-300 mt-2">{selectedMessage.message}</p>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <h4 className="font-mono text-sm font-bold text-neon-green mb-3">
                                                Odpowiedz
                                            </h4>
                                            <div className="space-y-4">
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="Napisz odpowiedź..."
                                                    className="w-full bg-kali-black border border-kali-border rounded px-4 py-3 text-white font-mono focus:outline-none focus:border-neon-green"
                                                    rows="4"
                                                />
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={handleReply}
                                                        className="flex-1 font-mono px-4 py-3 bg-neon-green text-black rounded-lg hover:bg-neon-blue transition-colors"
                                                    >
                                                        Wyślij odpowiedź
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedMessage(null);
                                                            setReplyText('');
                                                        }}
                                                        className="flex-1 font-mono px-4 py-3 border border-neon-green text-neon-green rounded-lg hover:bg-neon-green hover:text-black transition-colors"
                                                    >
                                                        Anuluj
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Script Form Component
const ScriptForm = ({ formData, setFormData, onSave, onCancel }) => (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
        <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">Nazwa</label>
            <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-kali-black border border-kali-border rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-neon-green"
                required
            />
        </div>
        <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">Opis</label>
            <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-kali-black border border-kali-border rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-neon-green"
                rows="3"
                required
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">Kategoria</label>
                <select
                    value={formData.category || 'bypass'}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-kali-black border border-kali-border rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-neon-green"
                >
                    <option value="bypass">Bypass</option>
                    <option value="script">Script</option>
                    <option value="bot">Bot</option>
                    <option value="tool">Tool</option>
                    <option value="generator">Generator</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">Typ</label>
                <select
                    value={formData.isFree ? 'free' : 'premium'}
                    onChange={(e) => setFormData({...formData, isFree: e.target.value === 'free'})}
                    className="w-full bg-kali-black border border-kali-border rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-neon-green"
                >
                    <option value="free">Darmowy</option>
                    <option value="premium">Premium</option>
                </select>
            </div>
        </div>
        <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">URL do pobrania</label>
            <input
                type="text"
                value={formData.downloadUrl || ''}
                onChange={(e) => setFormData({...formData, downloadUrl: e.target.value})}
                className="w-full bg-kali-black border border-kali-border rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-neon-green"
                required
            />
        </div>
        <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">Tagi (przecinek)</label>
            <input
                type="text"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})}
                className="w-full bg-kali-black border border-kali-border rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-neon-green"
            />
        </div>
        <div className="flex gap-3">
            <button
                type="submit"
                className="flex-1 font-mono px-4 py-2 bg-neon-green text-black rounded-lg hover:bg-neon-blue transition-colors"
            >
                Zapisz
            </button>
            <button
                type="button"
                onClick={onCancel}
                className="flex-1 font-mono px-4 py-2 border border-neon-green text-neon-green rounded-lg hover:bg-neon-green hover:text-black transition-colors"
            >
                Anuluj
            </button>
        </div>
    </form>
);

// Tutorial Form Component
const TutorialForm = ({ formData, setFormData, onSave, onCancel }) => (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
        <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">Tytuł</label>
            <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-kali-black border border-kali-border rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-neon-green"
                required
            />
        </div>
        <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">Opis</label>
            <textarea
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                className="w-full bg-kali-black border border-kali-border rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-neon-green"
                rows="2"
                required
            />
        </div>
        <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">Treść (HTML)</label>
            <textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full bg-kali-black border border-kali-border rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-neon-green"
                rows="6"
                required
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">Kategoria</label>
                <select
                    value={formData.category || 'script'}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-kali-black border border-kali-border rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-neon-green"
                >
                    <option value="bypass">Bypass</option>
                    <option value="script">Script</option>
                    <option value="bot">Bot</option>
                    <option value="tool">Tool</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">Czy wyróżnić?</label>
                <select
                    value={formData.featured ? 'yes' : 'no'}
                    onChange={(e) => setFormData({...formData, featured: e.target.value === 'yes'})}
                    className="w-full bg-kali-black border border-kali-border rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-neon-green"
                >
                    <option value="no">Nie</option>
                    <option value="yes">Tak</option>
                </select>
            </div>
        </div>
        <div className="flex gap-3">
            <button
                type="submit"
                className="flex-1 font-mono px-4 py-2 bg-neon-green text-black rounded-lg hover:bg-neon-blue transition-colors"
            >
                Zapisz
            </button>
            <button
                type="button"
                onClick={onCancel}
                className="flex-1 font-mono px-4 py-2 border border-neon-green text-neon-green rounded-lg hover:bg-neon-green hover:text-black transition-colors"
            >
                Anuluj
            </button>
        </div>
    </form>
);

// News Form Component
const NewsForm = ({ formData, setFormData, onSave, onCancel }) => (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
        <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">Tytuł</label>
            <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-kali-black border border-kali-border rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-neon-green"
                required
            />
        </div>
        <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">Opis</label>
            <textarea
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                className="w-full bg-kali-black border border-kali-border rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-neon-green"
                rows="3"
                required
            />
        </div>
        <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">Treść</label>
            <textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full bg-kali-black border border-kali-border rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-neon-green"
                rows="4"
                required
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">Kategoria</label>
                <select
                    value={formData.category || 'update'}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-kali-black border border-kali-border rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-neon-green"
                >
                    <option value="update">Aktualizacja</option>
                    <option value="milestone">Kamień milowy</option>
                    <option value="feature">Funkcja</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">Czy wyróżnić?</label>
                <select
                    value={formData.featured ? 'yes' : 'no'}
                    onChange={(e) => setFormData({...formData, featured: e.target.value === 'yes'})}
                    className="w-full bg-kali-black border border-kali-border rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-neon-green"
                >
                    <option value="no">Nie</option>
                    <option value="yes">Tak</option>
                </select>
            </div>
        </div>
        <div className="flex gap-3">
            <button
                type="submit"
                className="flex-1 font-mono px-4 py-2 bg-neon-green text-black rounded-lg hover:bg-neon-blue transition-colors"
            >
                Zapisz
            </button>
            <button
                type="button"
                onClick={onCancel}
                className="flex-1 font-mono px-4 py-2 border border-neon-green text-neon-green rounded-lg hover:bg-neon-green hover:text-black transition-colors"
            >
                Anuluj
            </button>
        </div>
    </form>
);

// Matrix Rain Component
const MatrixRain = () => {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        const drawMatrix = () => {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff41';
            ctx.font = `${fontSize}px JetBrains Mono`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const intervalId = setInterval(drawMatrix, 50);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return <canvas ref={canvasRef} id="matrix-rain" />;
};

// Hero Component
const Hero = ({ setCurrentPage }) => {
    const [text, setText] = React.useState('');
    const fullText = 'skrypty, bypassy, narzędzia AI';
    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
        const typingInterval = setInterval(() => {
            if (index < fullText.length) {
                setText(fullText.substring(0, index + 1));
                setIndex(index + 1);
            } else {
                setIndex(0);
                setText('');
            }
        }, 150);

        return () => clearInterval(typingInterval);
    }, [index]);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <MatrixRain />

            <div className="relative z-10 container mx-auto px-4 text-center transition-all duration-500">
                <div
                >
                    <h1 className="font-mono text-4xl md:text-6xl lg:text-7xl font-bold mb-6 neon-text">
                        <span className="text-neon-green">Gonci</span>
                        <span className="text-white">k-tech</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-8 h-8">
                        <span className="text-neon-blue">{text}</span>
                        <span className="typing-cursor"></span>
                    </p>

                    <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
                        Darmowe i płatne skrypty, bypassy do AI i inne narzędzia.
                        Automatyzuj swoje workflow i zwiększ efektywność.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center transition-all duration-500">
                        <button
                            onClick={() => setCurrentPage('scripts')}
                            className="font-mono px-8 py-4 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-blue transition-colors neon-border"
                        >
                            Przeglądaj skrypty
                        </button>

                        <button
                            onClick={() => setCurrentPage('tutorials')}
                            className="font-mono px-8 py-4 border-2 border-neon-green text-neon-green font-bold rounded-lg hover:bg-neon-green hover:text-black transition-colors"
                        >
                            Zobacz tutoriale
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce transition-all duration-500">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00ff41"
                    strokeWidth="2"
                >
                    <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                </svg>
            </div>
        </section>
    );
};

// Stats Bar Component
const StatsBar = () => {
    const [isVisible, setIsVisible] = React.useState(false);
    const ref = React.useRef(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.disconnect();
            }
        };
    }, []);

    const stats = [
        { value: 15, label: 'Skryptów', suffix: '+' },
        { value: 5000, label: 'Pobrań', suffix: '+' },
        { value: 2000, label: 'Użytkowników', suffix: '+' },
        { value: 10, label: 'Tutoriale', suffix: '+' },
    ];

    return (
        <div ref={ref} className="glass-effect py-8 mb-20 transition-all duration-500">
            <div className="container mx-auto px-4 transition-all duration-500">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-500">
                    {stats.map((stat, index) => (
                        <div
                            className="text-center transition-all duration-500"
                        >
                            <div className="font-mono text-4xl md:text-5xl font-bold text-neon-green mb-2 transition-all duration-500">
                                {isVisible ? (
                                    <CountUp value={stat.value} suffix={stat.suffix} />
                                ) : (
                                    `0${stat.suffix}`
                                )}
                            </div>
                            <div className="text-gray-400 font-mono text-sm transition-all duration-500">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// CountUp Component
const CountUp = ({ value, suffix }) => {
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        let startTime;
        const duration = 2000;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * value));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value]);

    return <span>{count.toLocaleString()}{suffix}</span>;
};

// Why Section Component
const WhySection = () => {
    const reasons = [
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00ff41" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
            ),
            title: 'Wysoka jakość',
            description: 'Każdy skrypt jest dokładnie testowany i udokumentowany.',
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
            ),
            title: 'Szybkość',
            description: 'Optymalizacja wydajności i minimalne opóźnienia.',
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#bf00ff" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            ),
            title: 'Bezpieczeństwo',
            description: 'Narzędzia są bezpieczne w użyciu i nie zawierają malware.',
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff00ff" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            ),
            title: 'Wsparcie',
            description: 'Szybka pomoc i odpowiedzi na pytania użytkowników.',
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00ff41" strokeWidth="2">
                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
            ),
            title: 'Aktualizacje',
            description: 'Regularne aktualizacje i nowe funkcje.',
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm16 7v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
            title: 'Społeczność',
            description: 'Aktywna społeczność użytkowników i współpraca.',
        },
    ];

    return (
        <section className="py-20">
            <div className="container mx-auto px-4 transition-all duration-500">
                <div
                    className="text-center mb-16 transition-all duration-500"
                >
                    <h2 className="font-mono text-3xl md:text-4xl font-bold mb-4 neon-text">
                        Dlaczego Goncik-tech?
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Odkryj zalety korzystania z naszych narzędzi i dołącz do społeczności.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500">
                    {reasons.map((reason, index) => {
                        const [ref, isVisible] = useScrollReveal();

                        return (
                            <div
                                ref={ref}
                                style={{
                                    opacity: isVisible ? 1 : 0,
                                    transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
                                    transition: 'all 0.6s ease-out'
                                }}
                                className="glass-effect p-6 rounded-lg hover:scale-105 transition-transform duration-300"
                            >
                                <div className="mb-4">{reason.icon}</div>
                                <h3 className="font-mono text-xl font-bold text-neon-green mb-2">
                                    {reason.title}
                                </h3>
                                <p className="text-gray-400">{reason.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

// Script Card Component
const ScriptCard = ({ script, onClick }) => (
    <div
        onClick={onClick}
        className="glass-effect rounded-lg p-6 cursor-pointer hover:neon-border transition-all duration-300 reveal transition-all duration-500"
    >
        <div className="flex items-start justify-between mb-4 transition-all duration-500">
            <div className="flex items-center space-x-3 transition-all duration-500">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center transition-all duration-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
                <div>
                    <h3 className="font-mono font-bold text-lg text-white">{script.name}</h3>
                    <span className="text-xs text-neon-green">{script.version}</span>
                </div>
            </div>

            {script.isFree ? (
                <span className="px-3 py-1 text-xs font-mono bg-neon-green text-black rounded-full font-bold">
                    FREE
                </span>
            ) : (
                <span className="px-3 py-1 text-xs font-mono bg-neon-blue text-black rounded-full font-bold">
                    PREMIUM
                </span>
            )}
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{script.description}</p>

        <div className="flex flex-wrap gap-2 mb-4 transition-all duration-500">
            {script.tags.slice(0, 3).map((tag, index) => (
                <span
                    className="px-2 py-1 text-xs font-mono bg-kali-border text-gray-300 rounded"
                >
                    {tag}
                </span>
            ))}
        </div>

        <div className="flex items-center justify-between text-sm transition-all duration-500">
            <div className="flex items-center space-x-4 text-gray-400 transition-all duration-500">
                <span className="flex items-center space-x-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
                    </svg>
                    <span>{script.downloads.toLocaleString()}</span>
                </span>
                <span className="flex items-center space-x-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>{script.rating}</span>
                </span>
            </div>

            <button className="text-neon-green hover:text-neon-blue transition-colors font-mono text-sm flex items-center space-x-1">
                <span>Więcej</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    </div>
);

// Featured Scripts Component
const FeaturedScripts = ({ setCurrentPage, setSelectedScript }) => {
    const featuredScripts = scripts.filter(script => script.featured).slice(0, 3);

    return (
        <section className="py-20">
            <div className="container mx-auto px-4 transition-all duration-500">
                <div
                    className="text-center mb-16 transition-all duration-500"
                >
                    <h2 className="font-mono text-3xl md:text-4xl font-bold mb-4 neon-text">
                        Polecane skrypty
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Sprawdź nasze najpopularniejsze i najczęściej używane narzędzia.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500">
                    {featuredScripts.map((script) => (
                        <ScriptCard
                            script={script}
                            onClick={() => {
                                setSelectedScript(script);
                                setCurrentPage('script-detail');
                            }}
                        />
                    ))}
                </div>

                <div className="text-center mt-12 transition-all duration-500">
                    <button
                        onClick={() => setCurrentPage('scripts')}
                        className="font-mono px-8 py-3 border-2 border-neon-green text-neon-green rounded-lg hover:bg-neon-green hover:text-black transition-colors"
                    >
                        Zobacz wszystkie skrypty
                    </button>
                </div>
            </div>
        </section>
    );
};

// Latest Tutorials Component
const LatestTutorials = ({ setCurrentPage, setSelectedTutorial }) => {
    const latestTutorials = tutorials.filter(t => t.featured).slice(0, 3);

    return (
        <section className="py-20 bg-kali-dark">
            <div className="container mx-auto px-4 transition-all duration-500">
                <div
                    className="text-center mb-16 transition-all duration-500"
                >
                    <h2 className="font-mono text-3xl md:text-4xl font-bold mb-4 neon-text">
                        Ostatnie na blogu
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Nowoczesne tutoriale i poradniki do naszych narzędzi.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500">
                    {latestTutorials.map((tutorial) => {
                        const [ref, isVisible] = useScrollReveal();

                        return (
                            <div
                                ref={ref}
                                style={{
                                    opacity: isVisible ? 1 : 0,
                                    transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
                                    transition: 'all 0.6s ease-out'
                                }}
                                className="glass-effect rounded-lg p-6 cursor-pointer hover:neon-border transition-all duration-300"
                                onClick={() => {
                                    setSelectedTutorial(tutorial);
                                    setCurrentPage('tutorial-detail');
                                }}
                            >
                                <div className="flex items-center space-x-2 mb-4">
                                    <span className="px-3 py-1 text-xs font-mono bg-neon-blue text-black rounded-full">
                                        {tutorial.category}
                                    </span>
                                    <span className="text-xs text-gray-500 font-mono">
                                        {tutorial.readTime}
                                    </span>
                                </div>

                                <h3 className="font-mono font-bold text-lg text-white mb-2 line-clamp-2">
                                    {tutorial.title}
                                </h3>

                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                    {tutorial.excerpt}
                                </p>

                                <div className="flex items-center justify-between text-sm transition-all duration-500">
                                    <span className="text-gray-500 font-mono">
                                        {tutorial.date}
                                    </span>
                                    <button className="text-neon-green hover:text-neon-blue transition-colors font-mono text-sm flex items-center space-x-1">
                                        <span>Czytaj</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center mt-12 transition-all duration-500">
                    <button
                        onClick={() => setCurrentPage('tutorials')}
                        className="font-mono px-8 py-3 border-2 border-neon-green text-neon-green rounded-lg hover:bg-neon-green hover:text-black transition-colors"
                    >
                        Zobacz wszystkie tutoriale
                    </button>
                </div>
            </div>
        </section>
    );
};

// ============================================
// PAGE COMPONENTS
// ============================================

// Home Page
const HomePage = ({ setCurrentPage, setSelectedScript, setSelectedTutorial }) => (
    <div
    >
        <Hero setCurrentPage={setCurrentPage} />
        <StatsBar />
        <FeaturedScripts setCurrentPage={setCurrentPage} setSelectedScript={setSelectedScript} />
        <WhySection />
        <LatestTutorials setCurrentPage={setCurrentPage} setSelectedTutorial={setSelectedTutorial} />
        <Footer />
    </div>
);

// Scripts Page
const ScriptsPage = ({ setCurrentPage, setSelectedScript, filteredScripts }) => {
    const [categoryFilter, setCategoryFilter] = React.useState('all');
    const [freeFilter, setFreeFilter] = React.useState('all');
    const [searchQuery, setSearchQuery] = React.useState('');

    const categories = ['all', 'bypass', 'script', 'bot', 'tool', 'generator'];

    const filtered = filteredScripts.filter(script => {
        const matchesCategory = categoryFilter === 'all' || script.category === categoryFilter;
        const matchesFree = freeFilter === 'all' ||
            (freeFilter === 'free' && script.isFree) ||
            (freeFilter === 'premium' && !script.isFree);
        const matchesSearch = searchQuery === '' ||
            script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            script.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            script.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesFree && matchesSearch;
    });

    return (
        <div
            className="min-h-screen pt-24 pb-12 transition-all duration-500"
        >
            <div className="container mx-auto px-4 transition-all duration-500">
                <div
                    className="text-center mb-12 transition-all duration-500"
                >
                    <h1 className="font-mono text-4xl md:text-5xl font-bold mb-4 neon-text">
                        Wszystkie skrypty
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Przeglądaj całą kolekcję narzędzi — od skryptów do botów.
                    </p>
                </div>

                {/* Filters */}
                <div
                    className="glass-effect p-6 rounded-lg mb-8 transition-all duration-500"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-500">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2">Kategoria</label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full bg-kali-black border border-kali-border rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-neon-green"
                            >
                                <option value="all">Wszystkie</option>
                                {categories.map(cat => (
                                    <option value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Free Filter */}
                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2">Cena</label>
                            <select
                                value={freeFilter}
                                onChange={(e) => setFreeFilter(e.target.value)}
                                className="w-full bg-kali-black border border-kali-border rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-neon-green"
                            >
                                <option value="all">Wszystkie</option>
                                <option value="free">Darmowe</option>
                                <option value="premium">Premium</option>
                            </select>
                        </div>

                        {/* Search */}
                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2">Szukaj</label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Nazwa, opis, tagi..."
                                className="w-full bg-kali-black border border-kali-border rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-neon-green"
                            />
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6 transition-all duration-500">
                    <p className="text-gray-400 font-mono">
                        Znaleziono <span className="text-neon-green">{filtered.length}</span> skryptów
                    </p>
                </div>

                {/* Scripts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500">
                    {filtered.map((script) => (
                        <ScriptCard
                            script={script}
                            onClick={() => {
                                setSelectedScript(script);
                                setCurrentPage('script-detail');
                            }}
                        />
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-12 transition-all duration-500">
                        <p className="text-gray-400 font-mono">
                            Brak wyników dla podanych filtrów.
                        </p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

// Bypassy Page
const BypassyPage = ({ setCurrentPage, setSelectedScript }) => (
    <ScriptsPage
        setCurrentPage={setCurrentPage}
        setSelectedScript={setSelectedScript}
        filteredScripts={scripts.filter(script => script.category === 'bypass')}
    />
);

// Free Scripts Page
const FreeScriptsPage = ({ setCurrentPage, setSelectedScript }) => (
    <ScriptsPage
        setCurrentPage={setCurrentPage}
        setSelectedScript={setSelectedScript}
        filteredScripts={scripts.filter(script => script.isFree)}
    />
);

// Script Detail Page
const ScriptDetailPage = ({ script, setCurrentPage }) => {
    if (!script) {
        return (
            <div
                className="min-h-screen pt-24 pb-12 transition-all duration-500"
            >
                <div className="container mx-auto px-4 text-center transition-all duration-500">
                    <p className="text-gray-400 font-mono">Nie znaleziono skryptu.</p>
                    <button
                        onClick={() => setCurrentPage('scripts')}
                        className="mt-4 font-mono text-neon-green hover:text-neon-blue"
                    >
                        Wróć do listy
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen pt-24 pb-12 transition-all duration-500"
        >
            <div className="container mx-auto px-4 transition-all duration-500">
                <button
                    onClick={() => setCurrentPage('scripts')}
                    className="mb-8 font-mono text-gray-400 hover:text-neon-green flex items-center space-x-2"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span>Wróć do skryptów</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-500">
                    <div className="lg:col-span-2 transition-all duration-500">
                        <div
                            className="glass-effect rounded-lg p-8 transition-all duration-500"
                        >
                            <div className="flex items-start justify-between mb-6 transition-all duration-500">
                                <div>
                                    <div className="flex items-center space-x-3 mb-2 transition-all duration-500">
                                        <h1 className="font-mono text-3xl md:text-4xl font-bold neon-text">
                                            {script.name}
                                        </h1>
                                        <span className="text-neon-green font-mono text-sm">
                                            v{script.version}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-400 transition-all duration-500">
                                        <span className="flex items-center space-x-1">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                            </svg>
                                            <span>{script.downloads.toLocaleString()} pobrań</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                            <span>{script.rating} / 5</span>
                                        </span>
                                        <span className="font-mono">{script.lastUpdated}</span>
                                    </div>
                                </div>

                                {script.isFree ? (
                                    <span className="px-4 py-2 text-sm font-mono bg-neon-green text-black rounded-full font-bold">
                                        FREE
                                    </span>
                                ) : (
                                    <span className="px-4 py-2 text-sm font-mono bg-neon-blue text-black rounded-full font-bold">
                                        PREMIUM
                                    </span>
                                )}
                            </div>

                            <p className="text-gray-300 mb-6">{script.description}</p>

                            <div className="mb-6 transition-all duration-500">
                                <h3 className="font-mono text-xl font-bold text-neon-green mb-3">
                                    Funkcje
                                </h3>
                                <ul className="space-y-2">
                                    {script.features.map((feature, index) => (
                                        <li className="flex items-center space-x-2 text-gray-300">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ff41" strokeWidth="2">
                                                <path d="M20 6L9 17l-5-5" />
                                            </svg>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mb-6 transition-all duration-500">
                                <h3 className="font-mono text-xl font-bold text-neon-green mb-3">
                                    Wymagania
                                </h3>
                                <ul className="space-y-2">
                                    {script.requirements.map((req, index) => (
                                        <li className="flex items-center space-x-2 text-gray-300">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2">
                                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                            </svg>
                                            <span className="font-mono text-sm">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-mono text-xl font-bold text-neon-green mb-3">
                                    Tagi
                                </h3>
                                <div className="flex flex-wrap gap-2 transition-all duration-500">
                                    {script.tags.map((tag, index) => (
                                        <span
                                            className="px-3 py-1 text-xs font-mono bg-kali-border text-gray-300 rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div
                            className="glass-effect rounded-lg p-6 sticky top-24 transition-all duration-500"
                        >
                            <h3 className="font-mono text-xl font-bold text-white mb-4">
                                Pobierz
                            </h3>

                            <a
                                href={script.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full font-mono px-6 py-4 bg-neon-green text-black text-center font-bold rounded-lg hover:bg-neon-blue transition-colors mb-3 neon-border"
                            >
                                Pobierz za darmo
                            </a>

                            <div className="border-t border-kali-border pt-4 mt-4 transition-all duration-500">
                                <p className="text-sm text-gray-400 mb-2">
                                    Autor: <span className="text-white font-mono">{script.author}</span>
                                </p>
                                <p className="text-sm text-gray-400 mb-2">
                                    Wersja: <span className="text-white font-mono">{script.version}</span>
                                </p>
                                <p className="text-sm text-gray-400">
                                    Aktualizacja: <span className="text-white font-mono">{script.lastUpdated}</span>
                                </p>
                            </div>

                            <div className="border-t border-kali-border pt-4 mt-4 transition-all duration-500">
                                <h4 className="font-mono text-sm font-bold text-white mb-3">
                                    Udostępnij
                                </h4>
                                <div className="flex space-x-2 transition-all duration-500">
                                    <button className="p-2 bg-kali-border rounded hover:bg-neon-green hover:text-black transition-colors">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                        </svg>
                                    </button>
                                    <button className="p-2 bg-kali-border rounded hover:bg-neon-green hover:text-black transition-colors">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                        </svg>
                                    </button>
                                    <button className="p-2 bg-kali-border rounded hover:bg-neon-green hover:text-black transition-colors">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

// Tutorials Page
const TutorialsPage = ({ setCurrentPage, setSelectedTutorial }) => {
    const [categoryFilter, setCategoryFilter] = React.useState('all');
    const [searchQuery, setSearchQuery] = React.useState('');

    const categories = ['all', 'bypass', 'script', 'bot', 'tool'];

    const filtered = tutorials.filter(tutorial => {
        const matchesCategory = categoryFilter === 'all' || tutorial.category === categoryFilter;
        const matchesSearch = searchQuery === '' ||
            tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tutorial.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tutorial.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesSearch;
    });

    return (
        <div
            className="min-h-screen pt-24 pb-12 transition-all duration-500"
        >
            <div className="container mx-auto px-4 transition-all duration-500">
                <div
                    className="text-center mb-12 transition-all duration-500"
                >
                    <h1 className="font-mono text-4xl md:text-5xl font-bold mb-4 neon-text">
                        Tutoriale i poradniki
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Przeglądaj szczegółowe tutoriale do wszystkich naszych narzędzi.
                    </p>
                </div>

                {/* Filters */}
                <div
                    className="glass-effect p-6 rounded-lg mb-8 transition-all duration-500"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-500">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2">Kategoria</label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full bg-kali-black border border-kali-border rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-neon-green"
                            >
                                <option value="all">Wszystkie</option>
                                {categories.map(cat => (
                                    <option value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Search */}
                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2">Szukaj</label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tytuł, opis, tagi..."
                                className="w-full bg-kali-black border border-kali-border rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-neon-green"
                            />
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6 transition-all duration-500">
                    <p className="text-gray-400 font-mono">
                        Znaleziono <span className="text-neon-green">{filtered.length}</span> tutoriale
                    </p>
                </div>

                {/* Tutorials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500">
                    {filtered.map((tutorial) => (
                        <div
                            className="glass-effect rounded-lg p-6 cursor-pointer hover:neon-border transition-all duration-300 transition-all duration-500"
                            onClick={() => {
                                setSelectedTutorial(tutorial);
                                setCurrentPage('tutorial-detail');
                            }}
                        >
                            <div className="flex items-center space-x-2 mb-4 transition-all duration-500">
                                <span className="px-3 py-1 text-xs font-mono bg-neon-blue text-black rounded-full">
                                    {tutorial.category}
                                </span>
                                <span className="text-xs text-gray-500 font-mono">
                                    {tutorial.readTime}
                                </span>
                            </div>

                            <h3 className="font-mono font-bold text-lg text-white mb-2 line-clamp-2">
                                {tutorial.title}
                            </h3>

                            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                {tutorial.excerpt}
                            </p>

                            <div className="flex items-center justify-between text-sm mb-4 transition-all duration-500">
                                <span className="text-gray-500 font-mono">
                                    {tutorial.date}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 transition-all duration-500">
                                {tutorial.tags.slice(0, 3).map((tag, index) => (
                                    <span
                                        className="px-2 py-1 text-xs font-mono bg-kali-border text-gray-300 rounded"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-12 transition-all duration-500">
                        <p className="text-gray-400 font-mono">
                            Brak wyników dla podanych filtrów.
                        </p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

// Tutorial Detail Page
const TutorialDetailPage = ({ tutorial, setCurrentPage }) => {
    if (!tutorial) {
        return (
            <div
                className="min-h-screen pt-24 pb-12 transition-all duration-500"
            >
                <div className="container mx-auto px-4 text-center transition-all duration-500">
                    <p className="text-gray-400 font-mono">Nie znaleziono tutoriala.</p>
                    <button
                        onClick={() => setCurrentPage('tutorials')}
                        className="mt-4 font-mono text-neon-green hover:text-neon-blue"
                    >
                        Wróć do listy
                    </button>
                </div>
            </div>
        );
    }

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div
            className="min-h-screen pt-24 pb-12 transition-all duration-500"
        >
            <div className="container mx-auto px-4 transition-all duration-500">
                <button
                    onClick={() => setCurrentPage('tutorials')}
                    className="mb-8 font-mono text-gray-400 hover:text-neon-green flex items-center space-x-2"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span>Wróć do tutoriale</span>
                </button>

                <motion.article
                    className="max-w-4xl mx-auto"
                >
                    <header className="mb-8">
                        <div className="flex items-center space-x-3 mb-4 transition-all duration-500">
                            <span className="px-3 py-1 text-sm font-mono bg-neon-blue text-black rounded-full">
                                {tutorial.category}
                            </span>
                            <span className="text-sm text-gray-500 font-mono">
                                {tutorial.readTime}
                            </span>
                            <span className="text-sm text-gray-500 font-mono">
                                {tutorial.date}
                            </span>
                        </div>

                        <h1 className="font-mono text-3xl md:text-4xl font-bold mb-4 neon-text">
                            {tutorial.title}
                        </h1>

                        <p className="text-gray-400 text-lg">
                            {tutorial.excerpt}
                        </p>

                        <div className="flex items-center space-x-2 mt-4 text-sm text-gray-500 font-mono transition-all duration-500">
                            <span>Autor:</span>
                            <span className="text-white">{tutorial.author}</span>
                        </div>
                    </header>

                    <div className="flex flex-wrap gap-2 mb-8 transition-all duration-500">
                        {tutorial.tags.map((tag, index) => (
                            <span
                                className="px-3 py-1 text-sm font-mono bg-kali-border text-gray-300 rounded"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <div
                        className="glass-effect rounded-lg p-8 transition-all duration-500"
                    >
                        <div
                            className="prose prose-invert max-w-none transition-all duration-500"
                            dangerouslySetInnerHTML={{ __html: tutorial.content }}
                        />
                    </div>
                </motion.article>
            </div>

            <Footer />
        </div>
    );
};

// News Page
const NewsPage = ({ setCurrentPage }) => {
    return (
        <div
            className="min-h-screen pt-24 pb-12 transition-all duration-500"
        >
            <div className="container mx-auto px-4 transition-all duration-500">
                <div
                    className="text-center mb-12 transition-all duration-500"
                >
                    <h1 className="font-mono text-4xl md:text-5xl font-bold mb-4 neon-text">
                        Aktualności
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Najnowsze informacje o Goncik-tech, aktualizacjach i nowych funkcjach.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500">
                    {news.map((item, index) => (
                        <div
                            className={`glass-effect rounded-lg p-6 ${item.featured ? 'neon-border' : ''}`}
                        >
                            {item.featured && (
                                <div className="absolute top-4 right-4 transition-all duration-500">
                                    <span className="px-2 py-1 text-xs font-mono bg-neon-green text-black rounded">
                                        Wyróżnione
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center space-x-2 mb-4 transition-all duration-500">
                                <span className="px-3 py-1 text-xs font-mono bg-neon-blue text-black rounded-full">
                                    {item.category}
                                </span>
                                <span className="text-xs text-gray-500 font-mono">
                                    {item.date}
                                </span>
                            </div>

                            <h3 className="font-mono font-bold text-lg text-white mb-2">
                                {item.title}
                            </h3>

                            <p className="text-gray-400 text-sm mb-4">
                                {item.excerpt}
                            </p>

                            <div className="text-sm text-gray-500 font-mono transition-all duration-500">
                                Autor: {item.author}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

// Contact Page
const ContactPage = ({ setCurrentPage, addMessage }) => {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitStatus, setSubmitStatus] = React.useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Próba wysłania wiadomości do localStorage (dla admina)
            const newMessage = addMessage(formData);

            // Symulacja wysyłania emaila (dla użytkownika)
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });

            setTimeout(() => {
                setSubmitStatus(null);
                setIsSubmitting(false);
            }, 3000);
        } catch (error) {
            setSubmitStatus('error');
            setIsSubmitting(false);
            setTimeout(() => {
                setSubmitStatus(null);
            }, 3000);
        }
    };

    return (
        <div
            className="min-h-screen pt-24 pb-12 transition-all duration-500"
        >
            <div className="container mx-auto px-4 transition-all duration-500">
                <div
                    className="text-center mb-12 transition-all duration-500"
                >
                    <h1 className="font-mono text-4xl md:text-5xl font-bold mb-4 neon-text">
                        Kontakt
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Masz pytania lub potrzebujesz pomocy? Skontaktuj się z nami.
                    </p>
                </div>

                <div className="max-w-2xl mx-auto transition-all duration-500">
                    <div
                        className="glass-effect rounded-lg p-8 transition-all duration-500"
                    >
                         {submitStatus === 'success' && (
                            <div
                                className="mb-6 p-4 bg-neon-green/10 border border-neon-green rounded text-neon-green font-mono text-sm transition-all duration-500"
                            >
                                Wiadomość została wysłana! Odpowiemy wkrótce.
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div
                                className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded text-red-500 font-mono text-sm transition-all duration-500"
                            >
                                Wystąpił błąd podczas wysyłania. Spróbuj ponownie.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-mono text-gray-400 mb-2">
                                    Imię
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-kali-black border border-kali-border rounded px-4 py-3 text-white font-mono focus:outline-none focus:border-neon-green transition-colors"
                                    placeholder="Twoje imię"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-mono text-gray-400 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-kali-black border border-kali-border rounded px-4 py-3 text-white font-mono focus:outline-none focus:border-neon-green transition-colors"
                                    placeholder="twoj@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-mono text-gray-400 mb-2">
                                    Temat
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    className="w-full bg-kali-black border border-kali-border rounded px-4 py-3 text-white font-mono focus:outline-none focus:border-neon-green transition-colors"
                                    placeholder="Temat wiadomości"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-mono text-gray-400 mb-2">
                                    Wiadomość
                                </label>
                                <textarea
                                    required
                                    rows="6"
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    className="w-full bg-kali-black border border-kali-border rounded px-4 py-3 text-white font-mono focus:outline-none focus:border-neon-green transition-colors resize-none"
                                    placeholder="Twoja wiadomość..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full font-mono px-8 py-4 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-blue transition-colors neon-border disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Wysyłanie...' : 'Wyślij wiadomość'}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div
                        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500"
                    >
                        <div className="glass-effect rounded-lg p-6 text-center transition-all duration-500">
                            <div className="flex justify-center mb-4 transition-all duration-500">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00ff41" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <h3 className="font-mono font-bold text-white mb-2">Discord</h3>
                            <a
                                href="https://discord.gg/goncik-tech"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-neon-green text-sm"
                            >
                                discord.gg/goncik-tech
                            </a>
                        </div>

                        <div className="glass-effect rounded-lg p-6 text-center transition-all duration-500">
                            <div className="flex justify-center mb-4 transition-all duration-500">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                </svg>
                            </div>
                            <h3 className="font-mono font-bold text-white mb-2">GitHub</h3>
                            <a
                                href="https://github.com/goncik-tech"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-neon-green text-sm"
                            >
                                github.com/goncik-tech
                            </a>
                        </div>

                        <div className="glass-effect rounded-lg p-6 text-center transition-all duration-500">
                            <div className="flex justify-center mb-4 transition-all duration-500">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#bf00ff" strokeWidth="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                            </div>
                            <h3 className="font-mono font-bold text-white mb-2">Email</h3>
                            <a
                                href="mailto:contact@goncik.tech"
                                className="text-gray-400 hover:text-neon-green text-sm"
                            >
                                contact@goncik.tech
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

// Not Found Page
const NotFoundPage = ({ setCurrentPage }) => {
    return (
        <div
            className="min-h-screen flex items-center justify-center transition-all duration-500"
        >
            <div className="text-center transition-all duration-500">
                <div
                    className="mb-8 transition-all duration-500"
                >
                    <h1 className="font-mono text-8xl md:text-9xl font-bold neon-text">
                        404
                    </h1>
                </div>

                <div
                    className="mb-8 transition-all duration-500"
                >
                    <h2 className="font-mono text-2xl md:text-3xl font-bold text-white mb-4">
                        Nie znaleziono strony
                    </h2>
                    <p className="text-gray-400 max-w-md mx-auto">
                        Wygląda na to, że ta strona nie istnieje lub została usunięta.
                    </p>
                </div>

                <div
                >
                    <button
                        onClick={() => setCurrentPage('home')}
                        className="font-mono px-8 py-4 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-blue transition-colors neon-border"
                    >
                        Wróć na stronę główną
                    </button>
                </div>
            </div>
        </div>
    );
};

// ============================================
// MAIN APP COMPONENT
// ============================================

const App = () => {
    const [currentPage, setCurrentPage] = React.useState('home');
    const [selectedScript, setSelectedScript] = React.useState(null);
    const [selectedTutorial, setSelectedTutorial] = React.useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    // Admin Auth
    const { isAdmin, isAdminPanelOpen, setIsAdminPanelOpen, login, logout } = useAdminAuth();

    // Messages hook
    const { addMessage } = useMessages();

    // Data state
    const [localScripts, setLocalScripts] = React.useState(scripts);
    const [localTutorials, setLocalTutorials] = React.useState(tutorials);
    const [localNews, setLocalNews] = React.useState(news);

    // Handle page routing
    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage setCurrentPage={setCurrentPage} setSelectedScript={setSelectedScript} setSelectedTutorial={setSelectedTutorial} />;
            case 'scripts':
                return <ScriptsPage setCurrentPage={setCurrentPage} setSelectedScript={setSelectedScript} filteredScripts={localScripts} />;
            case 'bypassy':
                return <BypassyPage setCurrentPage={setCurrentPage} setSelectedScript={setSelectedScript} />;
            case 'free':
                return <FreeScriptsPage setCurrentPage={setCurrentPage} setSelectedScript={setSelectedScript} />;
            case 'script-detail':
                return <ScriptDetailPage script={selectedScript} setCurrentPage={setCurrentPage} />;
            case 'tutorials':
                return <TutorialsPage setCurrentPage={setCurrentPage} setSelectedTutorial={setSelectedTutorial} />;
            case 'tutorial-detail':
                return <TutorialDetailPage tutorial={selectedTutorial} setCurrentPage={setCurrentPage} />;
            case 'news':
                return <NewsPage setCurrentPage={setCurrentPage} />;
            case 'contact':
                return <ContactPage setCurrentPage={setCurrentPage} addMessage={addMessage} />;
            default:
                return <NotFoundPage setCurrentPage={setCurrentPage} />;
        }
    };

    // Scroll to top on page change
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    return (
        <div className="min-h-screen font-sans transition-all duration-500">
            <Navbar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />

            <main
             className="page-enter">
                {renderPage()}
            </main>

            <Footer
                isAdmin={isAdmin}
                isAdminPanelOpen={isAdminPanelOpen}
                setIsAdminPanelOpen={setIsAdminPanelOpen}
                logout={logout}
            />

            {/* Admin Login */}
            <AdminLogin
                isOpen={isAdminPanelOpen && !isAdmin}
                onClose={() => setIsAdminPanelOpen(false)}
                onLogin={login}
            />

            {/* Admin Dashboard */}
            {isAdmin && (
                <AdminDashboard
                    isOpen={isAdminPanelOpen && isAdmin}
                    onClose={() => setIsAdminPanelOpen(false)}
                    scripts={localScripts}
                    setScripts={setLocalScripts}
                    tutorials={localTutorials}
                    setTutorials={setLocalTutorials}
                    news={localNews}
                    setNews={setLocalNews}
                />
            )}
        </div>
    );
};

    // Scroll to top on page change
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    return (
        <div className="min-h-screen font-sans transition-all duration-500">
            <Navbar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />

            <main
             className="page-enter">
                {renderPage()}
            </main>

            {currentPage !== 'home' && <Footer />}
        </div>
    );
};

// ============================================
// RENDER APP
// ============================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
