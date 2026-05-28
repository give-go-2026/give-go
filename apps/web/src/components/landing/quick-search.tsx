'use client';

import { ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState } from 'react';

export default function QuickSearchBar() {
  const [text, setText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSearch = () => {
    if (!text && !startDate && !endDate) return;
    redirect(
      `/events/search?${text ? `event=${encodeURIComponent(text)}&` : ''}${startDate ? `startDate=${encodeURIComponent(startDate)}&` : ''}${endDate ? `endDate=${encodeURIComponent(endDate)}` : ''}`,
    );
  };

  return (
    <div className='bg-background -mb-17.5 flex h-64 w-full flex-col items-center justify-between gap-4 rounded-3xl px-4 py-6 shadow-xl shadow-black/15 lg:-mb-11.5 lg:h-36 lg:flex-row'>
      <div className='flex max-h-fit w-full lg:hidden'>
        <input
          type='text'
          placeholder='Keresés...'
          className='w-full rounded-l-lg border border-gray-300 px-4 py-2 text-xl'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div
          className='bg-foreground hover:bg-foreground/90 cursor-pointer rounded-r-lg p-4'
          onClick={handleSearch}
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
        />
        <div
          className='bg-foreground hover:bg-foreground/90 cursor-pointer rounded-r-lg p-4 lg:p-3'
          onClick={handleSearch}
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
    </div>
  );
}
