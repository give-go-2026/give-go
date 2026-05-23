'use client';

import type { EventData } from './types';

export function DeleteModal({
  event,
  onClose,
  onConfirm,
}: {
  event: EventData;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'
      onClick={onClose}
    >
      <div
        className='bg-background w-full max-w-md rounded-3xl p-6 shadow-xl shadow-black/20'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='mb-2 text-lg font-bold'>Esemény törlése</h2>
        <p className='mb-6 text-sm text-gray-600'>
          Biztosan törölni szeretnéd a{' '}
          <span className='font-medium text-foreground'>"{event.eventName}"</span> eseményt? Ez a
          művelet nem vonható vissza.
        </p>
        <div className='flex justify-end gap-3'>
          <button
            onClick={onClose}
            className='rounded-full border border-gray-300 px-5 py-2 text-sm font-medium transition-colors hover:bg-gray-50'
          >
            Mégse
          </button>
          <button
            onClick={onConfirm}
            className='rounded-full bg-red-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600'
          >
            Törlés
          </button>
        </div>
      </div>
    </div>
  );
}
