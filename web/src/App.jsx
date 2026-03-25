import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Menu, X, Sun, Moon, Github, ChevronRight, BookOpen } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
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
    path: '/frontend',
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
    path: '/javascript',
    items: [
      { name: 'Javascript Guide', path: '/javascript/guide', file: './content/javascript-and-typescript/javascript-guide.md' },
      { name: 'Typescript Guide', path: '/javascript/typescript', file: './content/javascript-and-typescript/typescript-guide.md' },
      { name: 'Interview Prep', path: '/javascript/prep', file: './content/javascript-and-typescript/js_interview_prep.md' },
    ]
  },
  {
    name: 'Back End',
    path: '/backend',
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
    path: '/system-design',
    items: [
      { name: 'System Design Guide', path: '/system-design/guide', file: './content/system-design/system-design-guide.md' },
    ]
  }
];

const MarkdownPage = ({ filePath }) => {
  const content = contentFiles[filePath] || '# Not Found';
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none p-6 md:p-12">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default function App() {
  const { theme, toggleTheme } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isSidebarOpen) setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname, isSidebarOpen]);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-50 md:hidden">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2">
          <Menu size={24} />
        </button>
        <span className="font-bold text-lg">Interview Prep</span>
        <button onClick={toggleTheme} className="p-2">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-[70] transition-transform md:translate-x-0 overflow-y-auto",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <BookOpen className="text-blue-600 dark:text-blue-400" />
              <span>PrepHub</span>
            </Link>
            <button
              onClick={toggleTheme}
              className="hidden md:flex p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          <nav className="space-y-6">
            {menuStructure.map((section) => (
              <div key={section.name}>
                {section.items ? (
                  <>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
                      {section.name}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                            location.pathname === item.path
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          )}
                        >
                          <ChevronRight size={14} className={cn(
                            "transition-transform",
                            location.pathname === item.path && "rotate-90"
                          )} />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={section.path}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      location.pathname === section.path
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    <BookOpen size={16} />
                    {section.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200 dark:border-slate-800">
          <a
            href="https://github.com/sreen98/interview-prep"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <Github size={18} />
            <span>GitHub Repository</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:max-w-[calc(100%-18rem)] pt-16 md:pt-0">
        <div className="container mx-auto max-w-4xl py-8">
          <Routes>
            <Route path="/" element={<MarkdownPage filePath="./content/README.md" />} />
            {menuStructure.flatMap(section => section.items || []).map(item => (
              <Route
                key={item.path}
                path={item.path}
                element={<MarkdownPage filePath={item.file} />}
              />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
