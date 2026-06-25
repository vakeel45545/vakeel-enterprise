'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ArrowRight, FileText, BookOpen, HelpCircle, Globe, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
  type: 'service' | 'blog' | 'page' | 'faq';
  id: string;
  title: string;
  slug: string;
  description: string | null;
  icon: string | null;
  category: string | null;
}

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  service: { label: 'Service', icon: FileText, color: 'text-sage bg-sage/10' },
  blog: { label: 'Article', icon: BookOpen, color: 'text-amber bg-amber/10' },
  page: { label: 'Page', icon: Globe, color: 'text-blue-500 bg-blue-500/10' },
  faq: { label: 'FAQ', icon: HelpCircle, color: 'text-purple-500 bg-purple-500/10' },
};

export function NavbarSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut: Cmd+K or Ctrl+K to open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search with debounce
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`);
      const data = await res.json();
      setResults(data.results || []);
      setSelectedIndex(-1);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => performSearch(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, performSearch]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
      setIsOpen(false);
      setQuery('');
      window.location.href = results[selectedIndex].slug;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search trigger button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 transition-all group"
        aria-label="Search"
      >
        <Search className="w-4 h-4" />
        <span className="hidden lg:inline font-medium">Search</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-charcoal/5 text-[10px] font-mono text-charcoal/40 border border-charcoal/10">
          ⌘K
        </kbd>
      </button>

      {/* Search modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-charcoal/40 backdrop-blur-sm flex items-start justify-center pt-[15vh]">
          <div className="w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl border border-charcoal/10 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
            {/* Search input */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-charcoal/5">
              <Search className="w-5 h-5 text-charcoal/40 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search services, articles, pages..."
                className="flex-1 text-lg text-charcoal placeholder:text-charcoal/35 bg-transparent outline-none font-medium"
                autoComplete="off"
              />
              {isLoading && <Loader2 className="w-5 h-5 text-charcoal/30 animate-spin shrink-0" />}
              <button
                onClick={() => { setIsOpen(false); setQuery(''); setResults([]); }}
                className="p-1.5 rounded-lg hover:bg-charcoal/5 transition-colors"
              >
                <X className="w-4 h-4 text-charcoal/40" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[400px] overflow-y-auto">
              {query.length >= 2 && results.length === 0 && !isLoading && (
                <div className="px-6 py-12 text-center">
                  <p className="text-charcoal/40 font-medium">No results found for &ldquo;{query}&rdquo;</p>
                  <p className="text-charcoal/30 text-sm mt-1">Try different keywords</p>
                </div>
              )}

              {results.length > 0 && (
                <ul className="py-2">
                  {results.map((result, idx) => {
                    const config = TYPE_CONFIG[result.type];
                    const Icon = config.icon;
                    return (
                      <li key={`${result.type}-${result.id}`}>
                        <Link
                          href={result.slug}
                          onClick={() => { setIsOpen(false); setQuery(''); setResults([]); }}
                          className={`flex items-start gap-4 px-6 py-3.5 hover:bg-charcoal/[0.03] transition-colors group ${
                            idx === selectedIndex ? 'bg-charcoal/[0.04]' : ''
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${config.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-charcoal truncate text-[15px]">{result.title}</h4>
                              <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-charcoal/5 text-charcoal/40">
                                {config.label}
                              </span>
                            </div>
                            {result.description && (
                              <p className="text-charcoal/45 text-sm truncate mt-0.5 font-medium">
                                {result.description.slice(0, 100)}
                              </p>
                            )}
                          </div>
                          <ArrowRight className="w-4 h-4 text-charcoal/20 group-hover:text-charcoal/50 shrink-0 mt-2.5 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}

              {query.length < 2 && (
                <div className="px-6 py-8 text-center">
                  <p className="text-charcoal/30 text-sm font-medium">Type at least 2 characters to search</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-charcoal/5 flex items-center justify-between text-[11px] text-charcoal/30 font-medium bg-charcoal/[0.015]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-charcoal/5 border border-charcoal/10 font-mono">↑↓</kbd> Navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-charcoal/5 border border-charcoal/10 font-mono">↵</kbd> Open</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-charcoal/5 border border-charcoal/10 font-mono">esc</kbd> Close</span>
              </div>
              <span>Powered by Vakeel</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
