'use client';

import { useEffect, useRef, useState } from 'react';

const MAX_SUGGESTIONS = 8;

export function TagAutocomplete({
  value,
  onChange,
  suggestions,
  placeholder,
  error,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  suggestions: string[];
  placeholder?: string;
  error?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const trimmed = query.trim();
  const matches = trimmed
    ? suggestions
        .filter(
          (s) =>
            s.toLocaleLowerCase('hu').startsWith(trimmed.toLocaleLowerCase('hu')) &&
            !value.includes(s),
        )
        .slice(0, MAX_SUGGESTIONS)
    : [];

  function addTag(tag: string) {
    const t = tag.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setQuery('');
    setIsOpen(false);
  }

  function removeTag(tag: string) {
    onChange(value.filter((v) => v !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === 'Enter' || e.key === ',') && trimmed) {
      e.preventDefault();
      addTag(query);
    } else if (e.key === 'Backspace' && !query && value.length > 0) {
      removeTag(value[value.length - 1]!);
    }
  }

  return (
    <div
      className='relative flex flex-col'
      ref={containerRef}
    >
      <div
        className={`flex flex-wrap items-center gap-2 rounded-md border px-3 py-2 ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className='flex items-center gap-1.5 rounded-full bg-cyan-900 px-3 py-1 text-sm font-medium text-white'
          >
            {tag}
            <button
              type='button'
              onClick={() => removeTag(tag)}
              className='leading-none text-white/80 hover:text-white'
              aria-label={`${tag} törlése`}
            >
              ✕
            </button>
          </span>
        ))}
        <input
          className='min-w-32 flex-1 border-0 bg-transparent py-0.5 outline-none'
          type='text'
          value={query}
          placeholder={value.length === 0 ? placeholder : undefined}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {isOpen && matches.length > 0 && (
        <ul className='absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-xl'>
          {matches.map((match) => (
            <li key={match}>
              <button
                type='button'
                onClick={() => addTag(match)}
                className='block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-cyan-50'
              >
                {match}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
