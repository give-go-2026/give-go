'use client';

import { useEffect, useState } from 'react';
import { FormField, SwitchField } from './fields';

const DAYS = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];

export default function FormTwo({ errors }: { errors: Record<string, string> }) {
  const [frequencyIndex, setFrequencyIndex] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return localStorage.getItem('helpFrequency') === 'Egyszeri' ? 1 : 0;
  });
  const [selectedDays, setSelectedDays] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('selectedDays') ?? '[]');
    } catch {
      return [];
    }
  });
  const [differentTimes, setDifferentTimes] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('differentTimes') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('selectedDays', JSON.stringify(selectedDays));
  }, [selectedDays]);

  useEffect(() => {
    localStorage.setItem('differentTimes', String(differentTimes));
  }, [differentTimes]);

  function toggleDay(index: number) {
    setSelectedDays((prev) =>
      prev.includes(index) ? prev.filter((d) => d !== index) : [...prev, index],
    );
  }

  return (
    <section className='mx-auto mt-10 flex w-full flex-col gap-6 px-3 py-4'>
      <div className='flex flex-col gap-2'>
        <label>Segítség Fajtája</label>
        <div className='flex flex-row gap-4'>
          <SwitchField
            options={['Rendszeres', 'Egyszeri']}
            name='helpFrequency'
            onChange={(_, index) => {
              setFrequencyIndex(index);
              setSelectedDays([]);
              setDifferentTimes(false);
            }}
          />
          <SwitchField
            options={['Online/Irodai', 'Személyes']}
            name='helpMode'
            defaultIndex={1}
          />
        </div>
      </div>

      {frequencyIndex === 1 ? (
        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-4 gap-4'>
            <div className='col-span-2'>
              <FormField
                label='Esemény kezdő dátuma'
                placeholder='pl.: 2025.16.12.'
                type='string'
                name='eventStartDate'
                undertext={null}
                error={errors['eventStartDate']}
              />
            </div>
            <FormField
              label='Kezdés időpontja'
              placeholder='pl.: 10:00'
              type='string'
              name='eventStartTime'
              undertext={null}
              error={errors['eventStartTime']}
            />
            <FormField
              label='Záró időpontja'
              placeholder='pl.: 10:00'
              type='string'
              name='eventEndTime'
              undertext={null}
              error={errors['eventEndTime']}
            />
          </div>
          <div className='grid grid-cols-4 gap-4'>
            <div className='col-span-2'>
              <FormField
                label='Esemény záró dátuma'
                placeholder='pl.: 2025.16.12.'
                type='string'
                name='eventEndDate'
                undertext={null}
                error={errors['eventEndDate']}
              />
            </div>
            <FormField
              label='Zárás időpontja'
              placeholder='pl.: 17:00'
              type='string'
              name='eventCloseTime'
              undertext={null}
              error={errors['eventCloseTime']}
            />
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-2 gap-4'>
            <FormField
              label='Esemény sorozat kezdete'
              placeholder='pl.: 2025.16.12.'
              type='string'
              name='seriesStartDate'
              undertext={null}
              error={errors['seriesStartDate']}
            />
            <FormField
              label='Esemény sorozat záródátuma'
              placeholder='pl.: 2025.16.12.'
              type='string'
              name='seriesEndDate'
              undertext={null}
              error={errors['seriesEndDate']}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Melyik napokon ismétlődik?</label>
            <div className='flex flex-row flex-wrap gap-2'>
              {DAYS.map((day, index) => (
                <button
                  key={day}
                  type='button'
                  onClick={() => toggleDay(index)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    selectedDays.includes(index)
                      ? 'border-cyan-900 bg-cyan-900 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            {errors['selectedDays'] && (
              <p className='text-sm text-red-500'>{errors['selectedDays']}</p>
            )}
          </div>
          {differentTimes ? (
            <div className='flex flex-col gap-3'>
              {[...selectedDays].sort((a, b) => a - b).map((dayIndex) => (
                <div
                  key={dayIndex}
                  className='grid grid-cols-[auto_1fr_1fr] items-end gap-4'
                >
                  <span className='mb-0.5 whitespace-nowrap rounded-full bg-cyan-900 px-4 py-2 text-sm font-medium text-white'>
                    {DAYS[dayIndex]}
                  </span>
                  <FormField
                    label='Kezdés időpontja'
                    placeholder='pl.: 10:00'
                    type='string'
                    name={`startTime_${dayIndex}`}
                    undertext={null}
                  />
                  <FormField
                    label='Zárás időpontja'
                    placeholder='pl.: 17:00'
                    type='string'
                    name={`endTime_${dayIndex}`}
                    undertext={null}
                  />
                </div>
              ))}
              {errors['perDayTimes'] && (
                <p className='text-sm text-red-500'>{errors['perDayTimes']}</p>
              )}
            </div>
          ) : (
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                label='Kezdés időpontja'
                placeholder='pl.: 10:00'
                type='string'
                name='startTime'
                undertext={null}
                error={errors['startTime']}
              />
              <FormField
                label='Zárás időpontja'
                placeholder='pl.: 17:00'
                type='string'
                name='endTime'
                undertext={null}
                error={errors['endTime']}
              />
            </div>
          )}
          <button
            type='button'
            onClick={() => setDifferentTimes((prev) => !prev)}
            className='w-fit text-left text-sm text-cyan-700 underline'
          >
            {differentTimes
              ? 'Minden nap ugyan akkor kezdődik és zárul az esemény'
              : 'Eltérő naponként a kezdés és a zárás'}
          </button>
        </div>
      )}

      <div className='grid grid-cols-1 gap-10 md:grid-cols-2'>
        <FormField
          label='Esemény elnevezése'
          placeholder='pl.: Óvoda festés'
          type='string'
          name='eventName'
          undertext={null}
          error={errors['eventName']}
        />
        <FormField
          label='Esemény címe'
          placeholder='pl.: Arad, Pócsika utca 12.'
          type='string'
          name='eventAddress'
          undertext={null}
          error={errors['eventAddress']}
        />
      </div>
    </section>
  );
}
