'use client';

import { ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function QuickSearchBar() {
  const [text, setText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className='bg-background -mb-17.5 flex h-64 w-full flex-col items-center justify-between gap-4 rounded-3xl px-4 py-6 shadow-xl shadow-black/15 md:-mb-11.5 md:h-36 md:flex-row'>
      <div className='flex max-h-fit w-full md:hidden'>
        <input
          type='text'
          placeholder='Keresés...'
          className='w-full rounded-l-lg border border-gray-300 px-4 py-2 text-xl'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className='bg-foreground rounded-r-lg p-4'>
          <MagnifyingGlassIcon className='h-5 w-5 text-white' />
        </div>
      </div>
      <div className='flex max-h-fit w-full flex-col gap-2 md:mb-4 md:w-[32%]'>
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
      <div className='mt-3 hidden max-h-fit w-[31%] md:flex'>
        <input
          type='text'
          placeholder='Keresés...'
          className='w-full rounded-l-lg border border-gray-300 px-4 py-2 text-xl md:rounded-l-md'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className='bg-foreground rounded-r-lg p-4 md:p-3'>
          <MagnifyingGlassIcon className='h-5 w-5 text-white' />
        </div>
      </div>
      <button className='bg-foreground flex max-h-fit w-full flex-9 items-center justify-between gap-6 rounded-lg px-4 py-2 text-xl font-light text-white md:mt-3'>
        <span>Részletes Kereső és Szűrő</span>
        <ArrowRightIcon className='h-5 w-6' />
      </button>
    </div>
  );
}
