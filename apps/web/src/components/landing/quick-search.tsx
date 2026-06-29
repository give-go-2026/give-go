'use client';

import { searchEventsAction } from '@/features/events/lib/actions';
import type { EventCard } from '@/lib/definitions';
import { ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Card from './card';

export default function QuickSearchBar() {
  const [text, setText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [results, setResults] = useState<EventCard[]>([]);
  const [loading, setLoading] = useState(false);
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

  const handleSearch = async () => {
    const query = text.trim();
    if (!query && !startDate && !endDate) return;
    setLoading(true);
    setIsOpen(true);
    try {
      const found = await searchEventsAction({
        query: query || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setResults(found);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className='bg-background relative -mb-17.5 flex h-64 w-full flex-col items-center justify-between gap-4 rounded-3xl px-4 py-6 shadow-xl shadow-black/15 lg:-mb-11.5 lg:h-36 lg:flex-row'
    >
      <div className='flex max-h-fit w-full lg:hidden'>
        <input
          type='text'
          placeholder='Keresés...'
          className='w-full rounded-l-lg border border-gray-300 px-4 py-2 text-xl'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void handleSearch();
          }}
        />
        <div
          className='bg-foreground hover:bg-foreground/90 cursor-pointer rounded-r-lg p-4'
          onClick={() => void handleSearch()}
        >
          <MagnifyingGlassIcon className='h-5 w-5 text-white' />
        </div>
      </div>
      <div className='flex max-h-fit w-full flex-col gap-2 lg:mb-4 lg:w-[32%]'>
        <span>Időpont választó</span>
        <div className='flex max-w-fit items-center gap-2'>
          <input
            type='date'
            className='w-[calc(100%/2.2)] rounded-lg border border-gray-300 px-2 py-2 text-lg'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <ArrowRightIcon className='h-4 w-4' />
          <input
            type='date'
            className='w-[calc(100%/2.2)] rounded-lg border border-gray-300 px-2 py-2 text-lg'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div className='mt-3 hidden max-h-fit w-[31%] lg:flex'>
        <input
          type='text'
          placeholder='Keresés...'
          className='w-full rounded-l-lg border border-gray-300 px-4 py-2 text-lg lg:rounded-l-xl'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void handleSearch();
          }}
        />
        <div
          className='bg-foreground hover:bg-foreground/90 cursor-pointer rounded-r-lg p-4 lg:p-3'
          onClick={() => void handleSearch()}
        >
          <MagnifyingGlassIcon className='h-5 w-5 text-white' />
        </div>
      </div>
      <Link
        href='/events/search'
        className='bg-foreground hover:bg-foreground/90 flex max-h-fit w-full flex-9 items-center justify-between gap-6 rounded-lg px-4 py-2 text-lg font-light text-white lg:mt-3'
      >
        <span>Részletes Kereső és Szűrő</span>
        <ArrowRightIcon className='h-5 w-6' />
      </Link>

      {isOpen && (
        <div className='absolute top-full left-0 z-50 mt-2 max-h-144 w-full overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl'>
          {loading ? (
            <p className='px-2 py-6 text-center text-lg text-gray-500'>Keresés…</p>
          ) : results.length === 0 ? (
            <p className='px-2 py-6 text-center text-lg text-gray-500'>
              Nincs a keresésnek megfelelő találat.
            </p>
          ) : (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
              {results.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
