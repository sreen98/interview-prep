import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark-dimmed.min.css';
import {
  Menu, X, Sun, Moon, ChevronDown, BookOpen,
  Monitor, Braces, Server, Layers, Search, Sparkles,
  Copy, Check, ArrowUp, ExternalLink
} from 'lucide-react';

const GithubIcon = ({ size = 16, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from './hooks/useDarkMode';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const contentFiles = import.meta.glob('./content/**/*.md', { query: '?raw', import: 'default', eager: true });

const menuStructure = [
  { name: 'Introduction', path: '/', file: './content/README.md' },
  {
    name: 'Front End',
    icon: Monitor,
    gradient: 'from-blue-500 to-cyan-400',
    lightBg: 'bg-blue-50',
    darkBg: 'dark:bg-blue-950/30',
    accent: 'text-blue-600 dark:text-blue-400',
    description: 'React, Redux, TanStack Query, Storybook & AWS',
    items: [
      { name: 'React Guide', path: '/frontend/react', file: './content/front-end/react-guide.md' },
      { name: 'Redux Toolkit', path: '/frontend/redux-toolkit', file: './content/front-end/redux-toolkit-guide.md' },
      { name: 'Redux Saga', path: '/frontend/redux-saga', file: './content/front-end/redux-saga-guide.md' },
      { name: 'TanStack Query', path: '/frontend/tanstack-query', file: './content/front-end/tanstack-query-guide.md' },
      { name: 'Storybook', path: '/frontend/storybook', file: './content/front-end/storybook-guide.md' },
      { name: 'AWS Deployment', path: '/frontend/aws-deployment', file: './content/front-end/aws-frontend-deployment-guide.md' },
    ]
  },
  {
    name: 'JS & TS',
    icon: Braces,
    gradient: 'from-amber-500 to-orange-400',
    lightBg: 'bg-amber-50',
    darkBg: 'dark:bg-amber-950/30',
    accent: 'text-amber-600 dark:text-amber-400',
    description: 'JavaScript, TypeScript & tricky interview problems',
    items: [
      { name: 'JavaScript Guide', path: '/javascript/guide', file: './content/javascript-and-typescript/javascript-guide.md' },
      { name: 'TypeScript Guide', path: '/javascript/typescript', file: './content/javascript-and-typescript/typescript-guide.md' },
      { name: 'Interview Prep', path: '/javascript/prep', file: './content/javascript-and-typescript/js_interview_prep.md' },
    ]
  },
  {
    name: 'Back End',
    icon: Server,
    gradient: 'from-emerald-500 to-teal-400',
    lightBg: 'bg-emerald-50',
    darkBg: 'dark:bg-emerald-950/30',
    accent: 'text-emerald-600 dark:text-emerald-400',
    description: 'Node.js, Express, MongoDB, API Design & Lambda',
    items: [
      { name: 'Node.js Guide', path: '/backend/nodejs', file: './content/back-end/nodejs-guide.md' },
      { name: 'Express.js Guide', path: '/backend/expressjs', file: './content/back-end/expressjs-guide.md' },
      { name: 'MongoDB Guide', path: '/backend/mongodb', file: './content/back-end/mongodb-guide.md' },
      { name: 'API Design', path: '/backend/api-design', file: './content/back-end/api-design-guide.md' },
      { name: 'Database Schema', path: '/backend/database-schema', file: './content/back-end/database-schema-guide.md' },
      { name: 'AWS Lambda', path: '/backend/aws-lambda', file: './content/back-end/aws-lambda-guide.md' },
    ]
  },
  {
    name: 'System Design',
    icon: Layers,
    gradient: 'from-violet-500 to-purple-400',
    lightBg: 'bg-violet-50',
    darkBg: 'dark:bg-violet-950/30',
    accent: 'text-violet-600 dark:text-violet-400',
    description: 'Scalability, distributed systems & architecture',
    items: [
      { name: 'System Design Guide', path: '/system-design/guide', file: './content/system-design/system-design-guide.md' },
    ]
  }
];

// ==================== Reading Progress ====================

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (progress < 1) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[100] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// ==================== Code Block ====================

const PreBlock = ({ children }) => {
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  let language = '';
  React.Children.forEach(children, child => {
    if (React.isValidElement(child)) {
      const match = /language-(\w+)/.exec(child.props?.className || '');
      if (match) language = match[1];
    }
  });

  const handleCopy = async () => {
    const text = ref.current?.textContent || '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard may not be available */ }
  };

  return (
    <div className="code-block group">
      <div className="code-block-header">
        <span className="code-lang">{language || 'code'}</span>
        <button onClick={handleCopy} className="copy-btn">
          {copied
            ? <><Check size={12} /><span>Copied!</span></>
            : <><Copy size={12} /><span>Copy</span></>
          }
        </button>
      </div>
      <pre ref={ref} className="code-block-body">
        {children}
      </pre>
    </div>
  );
};

// ==================== Search Modal ====================

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    const items = [];

    for (const section of menuStructure) {
      if (!section.items) continue;
      for (const item of section.items) {
        const nameMatch = item.name.toLowerCase().includes(q);
        const content = contentFiles[item.file] || '';
        const contentMatch = content.toLowerCase().includes(q);

        if (nameMatch || contentMatch) {
          let snippet = '';
          if (contentMatch) {
            const idx = content.toLowerCase().indexOf(q);
            const start = Math.max(0, idx - 60);
            const end = Math.min(content.length, idx + query.length + 60);
            snippet = (start > 0 ? '...' : '') + content.slice(start, end).replace(/\n/g, ' ').trim() + (end < content.length ? '...' : '');
          }
          items.push({ ...item, category: section.name, snippet, nameMatch });
        }
      }
    }
    return items.sort((a, b) => (b.nameMatch ? 1 : 0) - (a.nameMatch ? 1 : 0)).slice(0, 10);
  }, [query]);

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[201] px-4"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <Search size={18} className="text-slate-400 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') onClose();
                    if (e.key === 'Enter' && results.length > 0) handleSelect(results[0].path);
                  }}
                  placeholder="Search guides and content..."
                  className="flex-1 bg-transparent outline-none text-base placeholder:text-slate-400"
                />
                <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                  ESC
                </kbd>
              </div>

              {query.length >= 2 && (
                <div className="max-h-[50vh] overflow-y-auto p-2">
                  {results.length === 0 ? (
                    <div className="px-4 py-8 text-center text-slate-500">
                      No results found for &ldquo;{query}&rdquo;
                    </div>
                  ) : (
                    results.map((item, i) => (
                      <button
                        key={item.path}
                        onClick={() => handleSelect(item.path)}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-xl transition-colors",
                          "hover:bg-slate-100 dark:hover:bg-slate-800",
                          i === 0 && "bg-slate-50 dark:bg-slate-800/50"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{item.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                            {item.category}
                          </span>
                        </div>
                        {item.snippet && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.snippet}</p>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}

              {query.length < 2 && (
                <div className="px-5 py-6 text-sm text-slate-500 text-center">
                  Type to search across all {menuStructure.flatMap(s => s.items || []).length} guides...
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ==================== Home Page ====================

const HomePage = () => {
  const navigate = useNavigate();
  const categories = menuStructure.filter(s => s.items);
  const allGuides = menuStructure.flatMap(s => s.items || []);

  const handleRandomTopic = () => {
    const random = allGuides[Math.floor(Math.random() * allGuides.length)];
    navigate(random.path);
  };

  return (
    <div className="px-6 py-12 md:px-12 max-w-5xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-16 relative">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-pink-400/20 dark:from-indigo-400/10 dark:via-purple-400/10 dark:to-pink-400/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6 border border-indigo-100 dark:border-indigo-900/50">
            <Sparkles size={14} />
            <span>Your interview prep companion</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Master Your Next
            </span>
            <br />
            <span className="text-slate-900 dark:text-white">Interview</span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            {allGuides.length} comprehensive guides covering full-stack development.
            From React to System Design — everything you need to ace it.
          </p>

          <button
            onClick={handleRandomTopic}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles size={16} />
            Surprise me — random topic
          </button>
        </motion.div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
              className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`h-1 bg-gradient-to-r ${cat.gradient}`} />

              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={cn("p-3 rounded-xl shrink-0", cat.lightBg, cat.darkBg)}>
                    <Icon className={cat.accent} size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{cat.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{cat.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {cat.items.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="text-xs px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all font-medium border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center gap-12 md:gap-16 text-center pb-8"
      >
        {[
          { value: '16', label: 'Guides', gradient: 'from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400' },
          { value: '4', label: 'Categories', gradient: 'from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400' },
          { value: '22K+', label: 'Lines of Content', gradient: 'from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400' },
        ].map(stat => (
          <div key={stat.label}>
            <div className={`text-3xl md:text-4xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
              {stat.value}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// ==================== Content Page ====================

const ContentPage = ({ filePath }) => {
  const content = contentFiles[filePath] || '# Not Found\n\nThe requested content could not be found.';

  return (
    <motion.div
      key={filePath}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="prose-container px-6 py-8 md:px-12 md:py-12 max-w-4xl mx-auto"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre({ children }) {
            return <PreBlock>{children}</PreBlock>;
          },
          code({ className, children, node, ...props }) {
            if (className?.includes('language-') || className?.includes('hljs')) {
              return <code className={className} {...props}>{children}</code>;
            }
            return <code className="inline-code" {...props}>{children}</code>;
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <table>{children}</table>
              </div>
            );
          },
          a({ href, children, ...props }) {
            return <a href={href} className="content-link" {...props}>{children}</a>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  );
};

// ==================== Back to Top ====================

const BackToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:-translate-y-0.5 transition-all z-50"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// ==================== Main App ====================

export default function App() {
  const { theme, toggleTheme } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const location = useLocation();

  // Auto-expand section containing the active route
  useEffect(() => {
    const currentSection = menuStructure.find(s =>
      s.items?.some(i => i.path === location.pathname)
    );
    if (currentSection) {
      setExpandedSections(prev => ({ ...prev, [currentSection.name]: true }));
    }
  }, [location.pathname]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSection = (name) => {
    setExpandedSections(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0a0a0f] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <ReadingProgress />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <BackToTop />

      {/* ===== Mobile Header ===== */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between px-4 z-50 md:hidden">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu size={20} />
        </button>
        <Link to="/" className="flex items-center gap-2 font-bold">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <BookOpen size={14} className="text-white" />
          </div>
          <span className="text-base">PrepHub</span>
        </Link>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Search size={18} />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </header>

      {/* ===== Sidebar Overlay ===== */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ===== Sidebar ===== */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 h-screen w-72 bg-white/95 dark:bg-[#0c0c14]/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 z-[70] transition-transform duration-300 md:translate-x-0 flex flex-col",
        !isSidebarOpen && "-translate-x-full"
      )}>
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-lg group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                <BookOpen size={16} className="text-white" />
              </div>
              <span>PrepHub</span>
            </Link>
            <div className="flex items-center gap-1">
              <button
                onClick={toggleTheme}
                className="hidden md:flex p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="mt-4 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <Search size={14} />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="hidden sm:inline-flex text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 sidebar-scroll">
          {/* Home */}
          <Link
            to="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              location.pathname === '/'
                ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
            )}
          >
            <BookOpen size={16} />
            Home
          </Link>

          {/* Category Sections */}
          {menuStructure.filter(s => s.items).map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSections[section.name];
            const hasActiveChild = section.items.some(i => i.path === location.pathname);

            return (
              <div key={section.name} className="pt-2">
                <button
                  onClick={() => toggleSection(section.name)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                    hasActiveChild
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
                  )}
                >
                  <Icon size={16} className={cn(hasActiveChild && section.accent)} />
                  <span className="flex-1 text-left">{section.name}</span>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 pl-3 border-l-2 border-slate-100 dark:border-slate-800 space-y-0.5 py-1">
                        {section.items.map(item => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                              "flex items-center px-3 py-2 rounded-lg text-[13px] font-medium transition-all",
                              location.pathname === item.path
                                ? cn(section.lightBg, section.darkBg, section.accent, "shadow-sm")
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
                            )}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/50">
          <a
            href="https://github.com/sreen98/interview-prep"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
          >
            <GithubIcon size={16} />
            <span>View on GitHub</span>
          </a>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="flex-1 w-full min-w-0 pt-14 md:pt-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {menuStructure.flatMap(section => section.items || []).map(item => (
            <Route
              key={item.path}
              path={item.path}
              element={<ContentPage filePath={item.file} />}
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
