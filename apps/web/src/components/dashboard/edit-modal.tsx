'use client';

import { useState } from 'react';
import { Field, TextareaField, SelectField, SwitchInput, TagInput } from './fields';
import { DAYS, ALL_TAGS } from './types';
import type { EventData } from './types';
import { fileToDataUrl } from '@/lib/images';

const ARROW_ICON = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='ml-2 h-4 w-4 shrink-0'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M5 12h14' />
    <path d='M12 5l7 7-7 7' />
  </svg>
);

export function EditModal({
  event,
  onClose,
  onSave,
}: {
  event: EventData;
  onClose: () => void;
  onSave: (e: EventData) => void;
}) {
  const [tab, setTab] = useState<'details' | 'description'>('details');
  const [form, setForm] = useState<EventData>(event);

  function update<K extends keyof EventData>(key: K, value: EventData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleDay(index: number) {
    update(
      'selectedDays',
      form.selectedDays.includes(index)
        ? form.selectedDays.filter((d) => d !== index)
        : [...form.selectedDays, index],
    );
  }

  const isOneTime = form.helpFrequency === 'Egyszeri';

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'
      onClick={onClose}
    >
      <div
        className='bg-background flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl shadow-xl shadow-black/20'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='main-gradient px-6 py-5'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold tracking-wide'>
              {form.eventName || 'Esemény szerkesztése'}
            </h2>
            <button
              onClick={onClose}
              className='flex h-8 w-8 items-center justify-center rounded-full bg-white/30 text-sm font-bold transition-colors hover:bg-white/50'
            >
              ✕
            </button>
          </div>
        </div>

        <div className='flex shrink-0 border-b border-gray-200'>
          {(['details', 'description'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                tab === t
                  ? 'border-b-2 border-cyan-900 text-cyan-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'details' ? 'Esemény Adatai' : 'Esemény leírása'}
            </button>
          ))}
        </div>

        <div className='flex-1 overflow-y-auto px-6 py-5'>
          {tab === 'details' ? (
            <div className='flex flex-col gap-5'>
              <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                <Field
                  label='Esemény elnevezése'
                  value={form.eventName}
                  onChange={(v) => update('eventName', v)}
                  placeholder='pl.: Óvoda festés'
                />
                <Field
                  label='Esemény címe'
                  value={form.eventAddress}
                  onChange={(v) => update('eventAddress', v)}
                  placeholder='pl.: Budapest, Példa utca 12.'
                />
                <Field
                  label='Támogatott témák'
                  value={form.eventTheme}
                  onChange={(v) => update('eventTheme', v)}
                  placeholder='pl.: Állatvédelem'
                />
                <SelectField
                  label='Munka típusa'
                  value={form.eventType}
                  onChange={(v) => update('eventType', v)}
                  options={['fizikai', 'szociális', 'irodai']}
                />
              </div>

              <div className='flex flex-col gap-2'>
                <label className='text-sm'>Tagek</label>
                <TagInput
                  tags={ALL_TAGS}
                  value={form.eventTags}
                  onChange={(v) => update('eventTags', v)}
                />
              </div>

              <div className='flex flex-col gap-2'>
                <label className='text-sm'>Segítség Fajtája</label>
                <div className='flex flex-col gap-3 sm:flex-row'>
                  <SwitchInput
                    options={['Rendszeres', 'Egyszeri']}
                    value={form.helpFrequency}
                    onChange={(v) => {
                      update('helpFrequency', v);
                      update('selectedDays', []);
                    }}
                  />
                  <SwitchInput
                    options={['Online', 'Személyes', 'Hibrid']}
                    value={form.helpMode}
                    onChange={(v) => update('helpMode', v)}
                  />
                </div>
              </div>

              {isOneTime ? (
                <div className='grid grid-cols-2 gap-4'>
                  <Field
                    label='Kezdő dátum'
                    value={form.eventStartDate}
                    onChange={(v) => update('eventStartDate', v)}
                    placeholder='pl.: 2025.06.15.'
                  />
                  <div className='grid grid-cols-2 gap-2'>
                    <Field
                      label='Kezdés'
                      value={form.eventStartTime}
                      onChange={(v) => update('eventStartTime', v)}
                      placeholder='09:00'
                    />
                    <Field
                      label='Zárás'
                      value={form.eventEndTime}
                      onChange={(v) => update('eventEndTime', v)}
                      placeholder='17:00'
                    />
                  </div>
                  <Field
                    label='Záró dátum'
                    value={form.eventEndDate}
                    onChange={(v) => update('eventEndDate', v)}
                    placeholder='pl.: 2025.06.15.'
                  />
                  <Field
                    label='Zárás időpontja'
                    value={form.eventCloseTime}
                    onChange={(v) => update('eventCloseTime', v)}
                    placeholder='17:00'
                  />
                </div>
              ) : (
                <div className='flex flex-col gap-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <Field
                      label='Sorozat kezdete'
                      value={form.seriesStartDate}
                      onChange={(v) => update('seriesStartDate', v)}
                      placeholder='pl.: 2025.01.01.'
                    />
                    <Field
                      label='Sorozat vége'
                      value={form.seriesEndDate}
                      onChange={(v) => update('seriesEndDate', v)}
                      placeholder='pl.: 2025.12.31.'
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm'>Ismétlődési napok</label>
                    <div className='flex flex-wrap gap-2'>
                      {DAYS.map((day, index) => (
                        <button
                          key={day}
                          type='button'
                          onClick={() => toggleDay(index)}
                          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                            form.selectedDays.includes(index)
                              ? 'border-cyan-900 bg-cyan-900 text-white'
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <Field
                      label='Kezdés időpontja'
                      value={form.startTime}
                      onChange={(v) => update('startTime', v)}
                      placeholder='10:00'
                    />
                    <Field
                      label='Zárás időpontja'
                      value={form.endTime}
                      onChange={(v) => update('endTime', v)}
                      placeholder='14:00'
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className='flex flex-col gap-4'>
              <TextareaField
                label='Esemény leírása'
                value={form.desc}
                onChange={(v) => update('desc', v)}
                placeholder='Maximum 1000 karakterben írd meg mi lenne a feladat amiben segítséget kérsz...'
              />
              <span className='text-right text-xs text-gray-400'>{form.desc.length}/1000</span>

              <div className='flex flex-col gap-1'>
                <label className='pb-1 text-sm'>Képek</label>
                {form.eventImages.length === 0 ? (
                  <p className='text-sm text-red-500'>Legalább egy kép feltöltése kötelező.</p>
                ) : (
                  <div className='flex flex-wrap gap-2'>
                    {form.eventImages.map((img, i) => (
                      <div
                        key={i}
                        className='group relative h-20 w-20 overflow-hidden rounded-md border border-gray-200'
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`Kép ${i + 1}`}
                          className='h-full w-full object-cover'
                        />
                        <button
                          type='button'
                          onClick={() =>
                            update(
                              'eventImages',
                              form.eventImages.filter((_, idx) => idx !== i),
                            )
                          }
                          aria-label='Kép törlése'
                          className='absolute top-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100'
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className='mt-2 flex w-fit cursor-pointer items-center justify-between rounded-md bg-[#153C53] px-4 py-2 text-sm text-white'>
                  <span>Képek feltöltése</span>
                  {ARROW_ICON}
                  <input
                    type='file'
                    className='hidden'
                    multiple
                    accept='.png,.jpg,.jpeg'
                    onChange={async (e) => {
                      const selected = Array.from(e.target.files ?? []);
                      e.target.value = '';
                      if (selected.length === 0) return;
                      try {
                        const urls = await Promise.all(selected.map(fileToDataUrl));
                        update('eventImages', [...form.eventImages, ...urls].slice(0, 10));
                      } catch {
                        alert('A kép feldolgozása nem sikerült. Próbáld újra!');
                      }
                    }}
                  />
                </label>
                <span className='text-xs text-gray-400'>
                  Az első kép lesz a borítókép. Max 10 kép, PNG vagy JPG.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className='flex shrink-0 items-center justify-end gap-3 border-t border-gray-200 px-6 py-4'>
          <button
            onClick={onClose}
            className='rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
          >
            Mégse
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={form.eventImages.length === 0}
            className='rounded-full bg-cyan-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Mentés
          </button>
        </div>
      </div>
    </div>
  );
}
