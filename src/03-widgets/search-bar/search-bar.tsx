import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchApi } from '@features/search/api/search-api';
import { cn } from '@shared/lib/cn';
import { Button } from '@shared/ui/button/button';

type SearchBarProps = {
  initialQuery?: string;
  autoFocus?: boolean;
  size?: 'hero' | 'compact';
};

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20 16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SearchBar({
  initialQuery = '',
  autoFocus = false,
  size = 'hero',
}: SearchBarProps) {
  const navigate = useNavigate();
  const listId = useId();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const blurTimer = useRef<number | null>(null);
  const compact = size === 'compact';

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    void searchApi.getSuggestions(query).then((items) => {
      if (!cancelled) {
        setSuggestions(items);
        setActiveIndex(-1);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [query]);

  function goToSearch(value: string) {
    const q = value.trim();
    setOpen(false);
    navigate(q ? `/buscar?q=${encodeURIComponent(q)}` : '/buscar');
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    goToSearch(query);
  }

  return (
    <div className="relative w-full animate-fade-up">
      <form
        className={cn(
          'flex items-stretch gap-2',
          compact && 'gap-0 overflow-hidden rounded bg-white shadow-gt',
        )}
        role="search"
        onSubmit={onSubmit}
      >
        <label className="visually-hidden" htmlFor={`${listId}-input`}>
          Buscar produtos e ofertas
        </label>
        <input
          id={`${listId}-input`}
          className={cn(
            'flex-1 rounded border border-border-strong bg-surface text-[1.05rem] focus-ring',
            compact
              ? 'min-h-11 rounded-none border-0 px-[0.85rem] py-2 shadow-none'
              : 'min-h-[52px] px-4 shadow-gt',
          )}
          type="search"
          value={query}
          autoFocus={autoFocus}
          autoComplete="off"
          placeholder="Buscar RTX 4060, notebooks, monitores…"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={open && suggestions.length > 0}
          role="combobox"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (blurTimer.current) window.clearTimeout(blurTimer.current);
            setOpen(true);
          }}
          onBlur={() => {
            blurTimer.current = window.setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={(e) => {
            if (!open || suggestions.length === 0) return;
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === 'Enter' && activeIndex >= 0) {
              e.preventDefault();
              goToSearch(suggestions[activeIndex]);
            } else if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
        />
        <Button
          type="submit"
          className={cn(
            compact &&
              'inline-flex min-w-12 items-center justify-center rounded-none p-0 tracking-normal',
          )}
        >
          {compact ? (
            <>
              <SearchIcon />
              <span className="visually-hidden">Buscar</span>
            </>
          ) : (
            'Buscar'
          )}
        </Button>
      </form>
      {open && suggestions.length > 0 ? (
        <ul
          id={listId}
          className="absolute top-[calc(100%+4px)] right-0 left-0 z-10 m-0 list-none rounded border border-border bg-surface p-2 shadow-[0_8px_24px_rgba(24,24,24,0.12)]"
          role="listbox"
        >
          {suggestions.map((item, index) => (
            <li key={item} role="presentation">
              <button
                type="button"
                className="block min-h-11 w-full cursor-pointer rounded-sm border-0 bg-transparent px-3 py-2 text-left focus-ring hover:bg-accent-soft aria-selected:bg-accent-soft"
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => goToSearch(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
