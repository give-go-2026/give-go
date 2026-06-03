'use client';

import { DAYS } from './types';
import type { EventData } from './types';

export function EventCard({
  event,
  onEdit,
  onDelete,
}: {
  event: EventData;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isOneTime = event.helpFrequency === 'Egyszeri';

  const dateDisplay = isOneTime
    ? `${event.eventStartDate} ${event.eventStartTime} – ${event.eventEndDate} ${event.eventCloseTime}`.trim()
    : `${event.seriesStartDate} – ${event.seriesEndDate}`;

  const dayDisplay =
    !isOneTime && event.selectedDays.length > 0
      ? event.selectedDays.map((i) => DAYS[i]).join(', ')
      : null;

  const themeTags = event.eventTheme
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className='flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md'>
      <div className='flex flex-wrap gap-1.5'>
        <span className='rounded-full bg-cyan-900/10 px-3 py-1 text-xs font-medium text-cyan-900'>
          {event.eventType}
        </span>
        <span className='rounded-full bg-cyan-900/10 px-3 py-1 text-xs font-medium text-cyan-900'>
          {event.helpMode.join(', ')}
        </span>
        <span className='rounded-full bg-cyan-900/10 px-3 py-1 text-xs font-medium text-cyan-900'>
          {event.helpFrequency}
        </span>
      </div>

      <div>
        <h3 className='text-base font-bold'>{event.eventName}</h3>
        <p className='text-sm text-gray-500'>{event.eventAddress}</p>
      </div>

      <div className='text-sm text-gray-600'>
        <span>{dateDisplay}</span>
        {dayDisplay && <span className='mt-0.5 block text-xs text-gray-400'>{dayDisplay}</span>}
      </div>

      {themeTags.length > 0 && (
        <div className='flex flex-wrap gap-1'>
          {themeTags.map((tag) => (
            <span
              key={tag}
              className='rounded-full border border-gray-200 px-2.5 py-0.5 text-xs text-gray-600'
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className='flex gap-2 border-t border-gray-100 pt-3'>
        <button
          onClick={onEdit}
          className='flex-1 rounded-lg border border-cyan-900 px-3 py-1.5 text-sm font-medium text-cyan-900 transition-colors hover:bg-cyan-50'
        >
          Szerkesztés
        </button>
        <button
          onClick={onDelete}
          className='rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50'
        >
          Törlés
        </button>
      </div>
    </div>
  );
}
