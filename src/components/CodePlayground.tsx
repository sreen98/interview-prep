import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Link } from 'react-router-dom';
import { Play, Trash2, ArrowLeft, Loader2, X, Search, BookOpen, PanelLeftOpen, ChevronRight, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playgroundSolutions } from './playgroundSolutions';
import {
  Template,
  TemplateCategory,
  templateCategories,
  allTemplates,
} from './playgroundTemplates';
import { OutputPanel, OutputEntry } from './OutputPanel';

// ==================== Helpers ====================

function formatValue(val: any): string {
  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (typeof val === 'string') return val;
  if (typeof val === 'function') return `[Function: ${val.name || 'anonymous'}]`;
  if (val instanceof Error) return `${val.name}: ${val.message}`;
  try {
    return JSON.stringify(val, null, 2);
  } catch {
    return String(val);
  }
}

function detectJSX(code: string): boolean {
  // Explicit render call or capitalized component tag.
  if (/render\s*\(/.test(code)) return true;
  if (/<[A-Z][A-Za-z0-9]*/.test(code)) return true;
  // Function returning a JSX tag (lowercase HTML or uppercase component).
  if (/return\s*\(?\s*<[a-zA-Z]/.test(code)) return true;
  // React hook usage strongly implies a React component.
  if (/\b(useState|useEffect|useRef|useMemo|useCallback|useReducer|useContext|useLayoutEffect)\s*\(/.test(code)) return true;
  return false;
}

let babelModule: any = null;
async function transpileJSX(code: string): Promise<string> {
  if (!babelModule) {
    babelModule = await import('@babel/standalone');
  }
  const result = babelModule.transform(code, {
    presets: ['react'],
    filename: 'playground.jsx',
  });
  return result.code;
}

// ==================== Component ====================

export default function CodePlayground() {
  const initialCode: string = sessionStorage.getItem('playground-code') || allTemplates[0].code;

  const [code, setCode] = useState<string>(initialCode);
  const [output, setOutput] = useState<OutputEntry[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasPreview, setHasPreview] = useState<boolean>(false);
  const [selectedName, setSelectedName] = useState<string | null>(sessionStorage.getItem('playground-code') ? null : 'Hello World');
  const [showingSolution, setShowingSolution] = useState<boolean>(false);
  const [drawerSearch, setDrawerSearch] = useState<string>('');
  const [drawerFilter, setDrawerFilter] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const reactRootRef = useRef<any>(null);
  const drawerSearchRef = useRef<HTMLInputElement>(null);
  const logsRef = useRef<OutputEntry[]>([]);
  const flushTimerRef = useRef<number | null>(null);
  const isJSX: boolean = detectJSX(code);

  // Unique tags for filter pills
  const tagOptions: string[] = useMemo(() => {
    const tags = [...new Set(templateCategories.map(c => c.tag))];
    return ['all', ...tags.map(t => t.toLowerCase())];
  }, []);

  // Filtered templates
  const filteredCategories: TemplateCategory[] = useMemo(() => {
    return templateCategories
      .filter(cat => drawerFilter === 'all' || cat.tag.toLowerCase() === drawerFilter)
      .map(cat => ({
        ...cat,
        templates: cat.templates.filter(t =>
          t.name.toLowerCase().includes(drawerSearch.toLowerCase())
        )
      }))
      .filter(cat => cat.templates.length > 0);
  }, [drawerSearch, drawerFilter]);

  // Clear sessionStorage code after loading
  useEffect(() => {
    sessionStorage.removeItem('playground-code');
  }, []);

  // Patch console once on mount; restore on unmount. Logs are captured into a
  // ref so async output (from setInterval, effects, etc.) keeps flowing after
  // the initial run finishes. A flush interval reconciles the ref into state
  // while the React preview is mounted.
  useEffect(() => {
    const origLog = console.log;
    const origWarn = console.warn;
    const origError = console.error;

    const push = (entry: OutputEntry) => {
      logsRef.current = [...logsRef.current, entry];
    };
    console.log = (...args: any[]) => { push({ type: 'log', text: args.map(formatValue).join(' ') }); };
    console.warn = (...args: any[]) => { push({ type: 'warn', text: args.map(formatValue).join(' ') }); };
    console.error = (...args: any[]) => { push({ type: 'error', text: args.map(formatValue).join(' ') }); };

    return () => {
      console.log = origLog;
      console.warn = origWarn;
      console.error = origError;
      if (flushTimerRef.current !== null) {
        window.clearInterval(flushTimerRef.current);
        flushTimerRef.current = null;
      }
      if (reactRootRef.current) {
        try { reactRootRef.current.unmount(); } catch { /* ignore */ }
        reactRootRef.current = null;
      }
    };
  }, []);

  const runCode = useCallback(async () => {
    setIsRunning(true);
    logsRef.current = [];
    setOutput([]);

    // Unmount previous React render
    if (reactRootRef.current) {
      try { reactRootRef.current.unmount(); } catch { /* ignore */ }
      reactRootRef.current = null;
    }
    setHasPreview(false);

    // Stop any prior flush interval
    if (flushTimerRef.current !== null) {
      window.clearInterval(flushTimerRef.current);
      flushTimerRef.current = null;
    }

    let previewMounted = false;

    try {
      let execCode: string = code;
      const needsJSX: boolean = detectJSX(code);

      if (needsJSX) {
        execCode = await transpileJSX(code);
      }

      if (needsJSX) {
        // Inject React scope and render function
        const renderFn = (element: React.ReactElement) => {
          if (previewRef.current) {
            if (reactRootRef.current) {
              try { reactRootRef.current.unmount(); } catch { /* ignore */ }
            }
            reactRootRef.current = ReactDOM.createRoot(previewRef.current);
            reactRootRef.current.render(element);
            setHasPreview(true);
            previewMounted = true;
          }
        };

        const scope: Record<string, any> = {
          React,
          useState: React.useState,
          useEffect: React.useEffect,
          useRef: React.useRef,
          useMemo: React.useMemo,
          useCallback: React.useCallback,
          useReducer: React.useReducer,
          useContext: React.useContext,
          createContext: React.createContext,
          memo: React.memo,
          Fragment: React.Fragment,
          render: renderFn,
        };

        const scopeKeys: string[] = Object.keys(scope);
        const scopeValues: any[] = Object.values(scope);
        const fn = new Function(...scopeKeys, execCode);
        fn(...scopeValues);

        if (!previewMounted) {
          logsRef.current = [...logsRef.current, {
            type: 'error',
            text: 'No render() call detected. For React components, end your code with: render(<YourComponent />);',
          }];
        }
      } else {
        // Plain JS execution
        const result = new Function(execCode)();
        if (result !== undefined) {
          logsRef.current = [...logsRef.current, { type: 'result', text: `\u2192 ${formatValue(result)}` }];
        }
      }
    } catch (err: any) {
      logsRef.current = [...logsRef.current, { type: 'error', text: `${err.name}: ${err.message}` }];
    } finally {
      setIsRunning(false);
    }

    setOutput([...logsRef.current]);

    // Keep flushing while a React preview is live (captures async logs from
    // intervals, effects, event handlers). Short one-shot flush for plain JS
    // to catch promise resolutions.
    if (previewMounted) {
      flushTimerRef.current = window.setInterval(() => {
        setOutput((prev) => (prev.length !== logsRef.current.length ? [...logsRef.current] : prev));
      }, 250);
    } else {
      window.setTimeout(() => setOutput([...logsRef.current]), 600);
    }
  }, [code]);

  // Cmd+Enter to run, Escape to close drawer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
      }
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [runCode, isDrawerOpen]);

  const stopFlush = useCallback((): void => {
    if (flushTimerRef.current !== null) {
      window.clearInterval(flushTimerRef.current);
      flushTimerRef.current = null;
    }
  }, []);

  const handleTemplate = useCallback((template: Template): void => {
    stopFlush();
    if (reactRootRef.current) {
      try { reactRootRef.current.unmount(); } catch { /* ignore */ }
      reactRootRef.current = null;
    }
    logsRef.current = [];
    setCode(template.code);
    setOutput([]);
    setHasPreview(false);
    setSelectedName(template.name);
    setShowingSolution(false);
    setIsDrawerOpen(false);
    setDrawerSearch('');
  }, [stopFlush]);

  // Look up the original challenge code by template name
  const currentTemplate = useMemo(
    () => selectedName ? allTemplates.find(t => t.name === selectedName) ?? null : null,
    [selectedName],
  );
  const hasSolution: boolean = !!(selectedName && playgroundSolutions[selectedName]);

  const toggleSolution = useCallback((): void => {
    if (!currentTemplate || !hasSolution) return;
    if (showingSolution) {
      // Switch back to challenge stub
      setCode(currentTemplate.code);
      setShowingSolution(false);
    } else {
      // Confirm if user has typed code different from the challenge stub
      const userHasEdits = code !== currentTemplate.code;
      if (userHasEdits && !window.confirm('Show solution? Your current code will be replaced.')) return;
      setCode(playgroundSolutions[selectedName!]);
      setShowingSolution(true);
    }
  }, [currentTemplate, hasSolution, showingSolution, code, selectedName]);

  const handleClear = useCallback((): void => {
    stopFlush();
    if (reactRootRef.current) {
      try { reactRootRef.current.unmount(); } catch { /* ignore */ }
      reactRootRef.current = null;
    }
    logsRef.current = [];
    setOutput([]);
    setHasPreview(false);
  }, [stopFlush]);

  const openDrawer = useCallback((): void => {
    setIsDrawerOpen(true);
    setDrawerSearch('');
    setDrawerFilter('all');
    setActiveCategory('all');
    setTimeout(() => drawerSearchRef.current?.focus(), 200);
  }, []);

  const closeDrawer = useCallback((): void => {
    setIsDrawerOpen(false);
  }, []);

  // Handle tab key in textarea
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start: number = target.selectionStart;
      const end: number = target.selectionEnd;
      setCode(code.substring(0, start) + '  ' + code.substring(end));
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  }, [code]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-screen relative">
      {/* Templates Modal -- 2-pane layout: categories on the left, snippets on the right */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
              onClick={closeDrawer}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="fixed inset-0 m-auto w-[min(960px,94vw)] h-[min(620px,88vh)] bg-white dark:bg-[#0f0f1a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-40 flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <BookOpen size={16} className="text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base leading-tight">Templates</h2>
                    <span className="text-[11px] text-slate-400">{allTemplates.length} snippets across {templateCategories.length} categories</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 w-[260px]">
                    <Search size={13} className="text-slate-400 shrink-0" />
                    <input
                      ref={drawerSearchRef}
                      value={drawerSearch}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDrawerSearch(e.target.value)}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Escape' && closeDrawer()}
                      placeholder="Search templates..."
                      className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-400"
                    />
                    {drawerSearch && (
                      <button onClick={() => { setDrawerSearch(''); drawerSearchRef.current?.focus(); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <X size={13} />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={closeDrawer}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Body: category nav + template grid */}
              <div className="flex-1 flex min-h-0">
                {/* Category Nav */}
                <div className="w-[220px] shrink-0 border-r border-slate-100 dark:border-slate-800 py-3 overflow-y-auto sidebar-scroll bg-slate-50/60 dark:bg-slate-900/40">
                  {/* Tag pills at top of category list */}
                  <div className="px-3 pb-3 flex gap-1.5 flex-wrap">
                    {tagOptions.map((tag: string) => {
                      const count: number = tag === 'all' ? allTemplates.length : allTemplates.filter(t => t.tag.toLowerCase() === tag).length;
                      return (
                        <button
                          key={tag}
                          onClick={() => setDrawerFilter(tag)}
                          className={[
                            "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all capitalize flex items-center gap-1",
                            drawerFilter === tag
                              ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                              : "bg-white dark:bg-slate-800/70 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                          ].join(' ')}
                        >
                          {tag === 'all' ? 'All' : tag}
                          <span className="text-[9px] opacity-60">{count}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="px-2">
                    <button
                      onClick={() => setActiveCategory('all')}
                      className={[
                        "w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors flex items-center justify-between",
                        activeCategory === 'all'
                          ? "bg-indigo-100/70 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium"
                          : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800/60"
                      ].join(' ')}
                    >
                      <span>All categories</span>
                      <span className="text-[10px] text-slate-400">{filteredCategories.reduce((n, c) => n + c.templates.length, 0)}</span>
                    </button>
                    {filteredCategories.map((cat: TemplateCategory) => {
                      const isActive = activeCategory === cat.label;
                      return (
                        <button
                          key={cat.label}
                          onClick={() => setActiveCategory(cat.label)}
                          className={[
                            "w-full text-left px-3 py-2 mt-0.5 rounded-lg text-[13px] transition-colors flex items-center justify-between gap-2",
                            isActive
                              ? "bg-indigo-100/70 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium"
                              : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800/60"
                          ].join(' ')}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <span className={[
                              "text-[9px] px-1.5 py-0.5 rounded-full font-semibold shrink-0",
                              cat.tag === 'React' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                cat.tag === 'Polyfills' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                                  'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                            ].join(' ')}>
                              {cat.tag}
                            </span>
                            <span className="truncate">{cat.label}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">{cat.templates.length}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Templates Grid */}
                <div className="flex-1 overflow-y-auto sidebar-scroll p-4">
                  {/* Mobile-only search */}
                  <div className="sm:hidden mb-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <Search size={13} className="text-slate-400 shrink-0" />
                    <input
                      value={drawerSearch}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDrawerSearch(e.target.value)}
                      placeholder="Search templates..."
                      className="flex-1 bg-transparent outline-none text-sm"
                    />
                  </div>

                  {filteredCategories.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center py-12 text-slate-400">
                      <Search size={32} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">No templates found</p>
                      <p className="text-xs mt-1">Try a different search or filter</p>
                    </div>
                  ) : (
                    (activeCategory === 'all' ? filteredCategories : filteredCategories.filter(c => c.label === activeCategory)).map((cat: TemplateCategory) => (
                      <div key={cat.label} className="mb-5 last:mb-0">
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {cat.label}
                          </span>
                          <span className={[
                            "text-[9px] px-1.5 py-0.5 rounded-full font-semibold",
                            cat.tag === 'React' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                              cat.tag === 'Polyfills' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                                'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                          ].join(' ')}>
                            {cat.tag}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {cat.templates.map((t: Template) => {
                            const isActive: boolean = selectedName === t.name;
                            return (
                              <button
                                key={t.name}
                                onClick={() => handleTemplate(t)}
                                className={[
                                  "text-left px-3 py-2.5 rounded-xl text-[13px] transition-all flex items-center gap-2 group border",
                                  isActive
                                    ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-medium shadow-sm"
                                    : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-slate-700 dark:text-slate-300"
                                ].join(' ')}
                              >
                                <span className="flex-1 truncate">{t.name}</span>
                                {t.jsx && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 shrink-0">
                                    JSX
                                  </span>
                                )}
                                <ChevronRight size={12} className="text-slate-300 dark:text-slate-700 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors shrink-0" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-5 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                <p className="text-[11px] text-slate-400">
                  {filteredCategories.reduce((n, c) => n + c.templates.length, 0)} matching
                </p>
                <p className="text-[11px] text-slate-400">
                  Press <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-mono mx-0.5">Esc</kbd> to close
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header -- always dark like an IDE */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2d333b] bg-[#1c2028] shrink-0 text-slate-200">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => window.dispatchEvent(new Event('prephub:show-sidebar'))}
            className="text-slate-400 hover:text-white transition-colors shrink-0 hidden md:flex p-1.5 rounded-lg hover:bg-[#2d333b]"
            title="Show sidebar"
          >
            <PanelLeftOpen size={16} />
          </button>
          <Link to="/" className="text-slate-400 hover:text-white transition-colors shrink-0" title="Back to home">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-bold shrink-0 text-white">Playground</h1>
          {selectedName && (
            <span className="text-sm text-slate-500 font-normal truncate hidden sm:inline">
              — {selectedName}
            </span>
          )}
          {isJSX && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-400 font-semibold shrink-0">
              React
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={openDrawer}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm border border-[#3d444d] text-slate-300 hover:bg-[#2d333b] hover:text-white transition-colors"
          >
            <BookOpen size={14} /> Templates
          </button>

          {hasSolution && (
            <button
              onClick={toggleSolution}
              className={
                'flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-colors ' +
                (showingSolution
                  ? 'border-amber-500 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                  : 'border-[#3d444d] text-slate-300 hover:bg-[#2d333b] hover:text-white')
              }
              title={showingSolution ? 'Switch back to the challenge' : 'Reveal the solution'}
            >
              <Lightbulb size={14} />
              {showingSolution ? 'Hide Solution' : 'Show Solution'}
            </button>
          )}

          <button
            onClick={handleClear}
            className="p-2 rounded-xl border border-[#3d444d] text-slate-400 hover:text-white hover:bg-[#2d333b] transition-colors"
            title="Clear output"
          >
            <Trash2 size={16} />
          </button>

          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm"
          >
            {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      {/* Editor + Output -- always dark */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Editor Panel */}
        <div className="flex-1 flex flex-col min-h-0 border-b md:border-b-0 md:border-r border-[#2d333b]">
          <div className="px-4 py-2 text-xs font-medium text-slate-500 border-b border-[#2d333b] bg-[#22272e] shrink-0 flex items-center justify-between">
            <span>{isJSX ? 'React JSX' : 'JavaScript'}</span>
            <span className="text-slate-600">
              {code.split('\n').length} lines
            </span>
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-4 font-mono text-sm leading-relaxed bg-[#1e1e2e] text-[#cdd6f4] resize-none outline-none min-h-[200px]"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            placeholder="Write your JavaScript or React code here..."
          />
        </div>

        {/* Output Panel — extracted + memoized so editor keystrokes don't re-render it */}
        <OutputPanel output={output} hasPreview={hasPreview} previewRef={previewRef} />

      </div>
    </div>
  );
}
