'use client';

import { redirect, RedirectType } from 'next/navigation';
import ApplyButton from '../ui/apply-button';
import DetailsButton from '../ui/details-buttton';

export function Apply({ id }: { id: number }) {
  return (
    <ApplyButton
      fill
      onClick={() => redirect(`/events/${id}/apply`, RedirectType.push)}
    />
  );
}

export function Details({ id }: { id: number }) {
  return (
    <DetailsButton
      fill
      onClick={() => redirect(`/events/${id}`, RedirectType.push)}
    />
  );
}
