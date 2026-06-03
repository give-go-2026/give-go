'use client';

import { useEffect, useRef, useState } from 'react';
import {
  FormField,
  AddressField,
  SwitchField,
  ListField,
  TagField,
  DatePickerField,
  TimePickerField,
} from './fields';

const DAYS = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];

export default function FormTwo({ errors }: { errors: Record<string, string> }) {
  const [frequencyIndex, setFrequencyIndex] = useState(0);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [differentTimes, setDifferentTimes] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [seriesStartDate, setSeriesStartDate] = useState('');
  const [globalStartTime, setGlobalStartTime] = useState('');
  const [dayStartTimes, setDayStartTimes] = useState<Record<number, string>>({});

  const selectedDaysFirstRun = useRef(true);
  const differentTimesFirstRun = useRef(true);

  useEffect(() => {
    setFrequencyIndex(sessionStorage.getItem('helpFrequency') === 'Egyszeri' ? 1 : 0);
    try {
      const days: number[] = JSON.parse(sessionStorage.getItem('selectedDays') ?? '[]');
      if (days.length > 0) setSelectedDays(days);
    } catch {
      // ignore malformed JSON
    }
    setDifferentTimes(sessionStorage.getItem('differentTimes') === 'true');
    setStartDate(sessionStorage.getItem('eventStartDate') ?? '');
    setStartTime(sessionStorage.getItem('eventStartTime') ?? '');
    setEndDate(sessionStorage.getItem('eventEndDate') ?? '');
    setSeriesStartDate(sessionStorage.getItem('seriesStartDate') ?? '');
    setGlobalStartTime(sessionStorage.getItem('startTime') ?? '');
  }, []);

  useEffect(() => {
    if (selectedDaysFirstRun.current) {
      selectedDaysFirstRun.current = false;
      return;
    }
    sessionStorage.setItem('selectedDays', JSON.stringify(selectedDays));
  }, [selectedDays]);

  useEffect(() => {
    if (differentTimesFirstRun.current) {
      differentTimesFirstRun.current = false;
      return;
    }
    sessionStorage.setItem('differentTimes', String(differentTimes));
  }, [differentTimes]);

  function toggleDay(index: number) {
    setSelectedDays((prev) =>
      prev.includes(index) ? prev.filter((d) => d !== index) : [...prev, index],
    );
  }

  return (
    <section className='mx-auto mt-10 flex w-full flex-col gap-6 px-3 py-4'>
      <div className='grid grid-cols-1 gap-10 md:grid-cols-2'>
        <FormField
          label='Esemény elnevezése'
          placeholder='pl.: Óvoda festés'
          type='string'
          name='eventName'
          undertext={null}
          error={errors['eventName']}
        />
        <AddressField
          label='Esemény címe'
          name='eventAddress'
          error={errors['eventAddress']}
        />

        <FormField
          label='Esemény által támogatott témák'
          placeholder='pl.: Állatvédelem'
          type='string'
          name='eventTheme'
          undertext={'Válaszd kiknek, milyen témában nyújt támogatást az esemény'}
          error={errors['eventTheme']}
        />
        <ListField
          label='Munka típusa'
          values={[
            'Adminisztráció, Asszisztens, Irodai munka',
            'Projekt Menedzsment',
            'Egészségügy',
            'Építőipar, Ingatlan',
            'Értékesítés, Kereskedelem',
            'Fizikai, Segéd, Betanított munka',
            'Gyártás, Termelés',
            'HR, Munkaügy',
            'IT programozás, Fejlesztés',
            'IT üzemeltetés, Telekommunikáció',
            'Jog, Jogi tanácsadás',
            'Marketing, Média, PR',
            'Mérnök',
            'Mezőgazdaság, Környezet',
            'Oktatás, Tudomány, Sport',
            'Pénzügy, Könyvelés',
            'Szállítás, Beszerzés, Logisztika',
            'Ügyfélszolgálat, Vevőszolgálat',
            'Vendéglátás, Idegenforgalom',
          ]}
          name='eventType'
          undertext={null}
          error={errors['eventType']}
        />

        <div className='col-span-full h-auto'>
          <TagField
            label='Tagek'
            tags={[
              'Idősek',
              'Gyerekek',
              'Fiatalok',
              'Hajléktalanok',
              'Fogyatékossággal élők',
              'Szegregátumok',
              'Iskolák',
              'Kutyák',
              'Macskák',
              'Madarak',
              'Kacsák',
              'Fajtamentés',
            ]}
            name='eventTags'
            undertext={null}
            error={errors['eventTags']}
          />
        </div>
      </div>

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
            options={['Online', 'Személyes', 'Hibrid']}
            name='helpMode'
            defaultIndex={1}
          />
        </div>
      </div>

      {frequencyIndex === 1 ? (
        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-2 gap-4'>
            <DatePickerField
              label='Esemény kezdő dátuma'
              name='eventStartDate'
              undertext={null}
              error={errors['eventStartDate']}
              onValueChange={setStartDate}
            />
            <TimePickerField
              label='Kezdés időpontja'
              name='eventStartTime'
              undertext={null}
              error={errors['eventStartTime']}
              onValueChange={setStartTime}
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <DatePickerField
              label='Esemény záró dátuma'
              name='eventEndDate'
              undertext={null}
              error={errors['eventEndDate']}
              minDate={startDate || undefined}
              onValueChange={setEndDate}
            />
            <TimePickerField
              label='Zárás időpontja'
              name='eventCloseTime'
              undertext={null}
              error={errors['eventCloseTime']}
              minTime={endDate === startDate && startDate ? startTime || undefined : undefined}
            />
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-2 gap-4'>
            <DatePickerField
              label='Esemény sorozat kezdete'
              name='seriesStartDate'
              undertext={null}
              error={errors['seriesStartDate']}
              onValueChange={setSeriesStartDate}
            />
            <DatePickerField
              label='Esemény sorozat záródátuma'
              name='seriesEndDate'
              undertext={null}
              error={errors['seriesEndDate']}
              minDate={seriesStartDate || undefined}
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
              {[...selectedDays]
                .sort((a, b) => a - b)
                .map((dayIndex) => (
                  <div
                    key={dayIndex}
                    className='grid grid-cols-[auto_1fr_1fr] items-end gap-4'
                  >
                    <span className='mb-0.5 rounded-full bg-cyan-900 px-4 py-2 text-sm font-medium whitespace-nowrap text-white'>
                      {DAYS[dayIndex]}
                    </span>
                    <TimePickerField
                      label='Kezdés időpontja'
                      name={`startTime_${dayIndex}`}
                      undertext={null}
                      onValueChange={(val) =>
                        setDayStartTimes((prev) => ({ ...prev, [dayIndex]: val }))
                      }
                    />
                    <TimePickerField
                      label='Zárás időpontja'
                      name={`endTime_${dayIndex}`}
                      undertext={null}
                      minTime={dayStartTimes[dayIndex] || undefined}
                    />
                  </div>
                ))}
              {errors['perDayTimes'] && (
                <p className='text-sm text-red-500'>{errors['perDayTimes']}</p>
              )}
            </div>
          ) : (
            <div className='grid grid-cols-2 gap-4'>
              <TimePickerField
                label='Kezdés időpontja'
                name='startTime'
                undertext={null}
                error={errors['startTime']}
                onValueChange={setGlobalStartTime}
              />
              <TimePickerField
                label='Zárás időpontja'
                name='endTime'
                undertext={null}
                error={errors['endTime']}
                minTime={globalStartTime || undefined}
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
    </section>
  );
}
