'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { OrgSection } from './org-section';
import { EventCard } from './event-card';
import { EditModal } from './edit-modal';
import { DeleteModal } from './delete-modal';
import type { OrgData, EventData } from './types';
import { deleteEventAction, updateEventAction, updateOrgAction } from '@/features/dashboard/lib/actions';

export default function Dashboard({
  initialOrg,
  initialEvents,
}: {
  initialOrg: OrgData;
  initialEvents: EventData[];
}) {
  const [org, setOrg] = useState<OrgData>(initialOrg);
  const [events, setEvents] = useState<EventData[]>(initialEvents);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<EventData | null>(null);
  const [search, setSearch] = useState('');
  const [, startTransition] = useTransition();

  function eventDate(e: EventData): number {
    const raw = e.helpFrequency === 'Egyszeri' ? e.eventStartDate : e.seriesStartDate;
    const normalized = raw.replace(/\./g, '-').replace(/-$/, '');
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  }

  const filtered = events
    .filter(
      (e) =>
        e.eventName.toLowerCase().includes(search.toLowerCase()) ||
        e.eventAddress.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => eventDate(b) - eventDate(a));

  function handleSaveOrg(updated: OrgData) {
    const previous = org;
    setOrg(updated);
    startTransition(async () => {
      const result = await updateOrgAction(updated);
      if (result?.error) {
        setOrg(previous);
        alert(result.error);
      }
    });
  }

  function handleSaveEvent(updated: EventData) {
    const previous = events;
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setEditingEvent(null);
    startTransition(async () => {
      const result = await updateEventAction(updated);
      if (result?.error) {
        setEvents(previous);
        alert(result.error);
      }
    });
  }

  function handleDelete() {
    if (!deletingEvent) return;
    const target = deletingEvent;
    const previous = events;
    setEvents((prev) => prev.filter((e) => e.id !== target.id));
    setDeletingEvent(null);
    startTransition(async () => {
      const result = await deleteEventAction(target.id);
      if (result?.error) {
        setEvents(previous);
        alert(result.error);
      }
    });
  }

  return (
    <>
      <section className='mx-auto mb-30 flex w-full max-w-416 flex-col gap-4 px-3 py-4 md:gap-6 md:px-28 md:py-5'>
        <div className='bg-background -mt-34 flex w-full flex-col gap-8 rounded-3xl px-6 py-8 shadow-xl shadow-black/15'>
          <OrgSection
            org={org}
            onSave={handleSaveOrg}
          />

          <div className='h-px w-full bg-gray-200' />

          <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <h2 className='text-xl font-bold'>Eseményeim</h2>
              <Link
                href='/create'
                className='w-fit rounded-full bg-cyan-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-800'
              >
                + Esemény létrehozása
              </Link>
            </div>

            <input
              type='text'
              placeholder='Keresés...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full max-w-xs rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-900/30'
            />

            {filtered.length === 0 ? (
              <div className='rounded-2xl border border-dashed border-gray-300 py-12 text-center'>
                <p className='text-sm text-gray-400'>
                  {events.length === 0
                    ? 'Még nincs feltöltött esemény.'
                    : 'Nincs a keresésnek megfelelő esemény.'}
                </p>
                {events.length === 0 && (
                  <Link
                    href='/create'
                    className='mt-4 inline-block rounded-full bg-cyan-900 px-5 py-2 text-sm font-medium text-white hover:bg-cyan-800'
                  >
                    + Első esemény létrehozása
                  </Link>
                )}
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
                {filtered.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={() => setEditingEvent(event)}
                    onDelete={() => setDeletingEvent(event)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {editingEvent && (
        <EditModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleSaveEvent}
        />
      )}

      {deletingEvent && (
        <DeleteModal
          event={deletingEvent}
          onClose={() => setDeletingEvent(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
