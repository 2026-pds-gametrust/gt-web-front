import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/ui/button/button';
import { searchApi } from '@features/search/api/search-api';

type SearchBarProps = {
  initialQuery?: string;
  autoFocus?: boolean;
  size?: 'hero' | 'compact';
};

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
    <div className={`search-bar search-bar--${size}`}>
      <form className="search-bar__form" role="search" onSubmit={onSubmit}>
        <label className="visually-hidden" htmlFor={`${listId}-input`}>
          Buscar produtos e ofertas
        </label>
        <input
          id={`${listId}-input`}
          className="search-bar__input"
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
        <Button type="submit">Buscar</Button>
      </form>
      {open && suggestions.length > 0 ? (
        <ul id={listId} className="search-bar__suggestions" role="listbox">
          {suggestions.map((item, index) => (
            <li key={item} role="presentation">
              <button
                type="button"
                className="search-bar__suggestion"
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
