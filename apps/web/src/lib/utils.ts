import { getOrganizerWebsite } from '@/features/auth/lib/queries';
import { getEventById } from '@/features/events/lib/queries';

const removeSpacesAfterDots = (value: string): string => value.replace(/\.(?=\s.*\.)\s/g, '.');

export const formatDuration = (start: Date, end: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };
  if (start.getDate() === end.getDate()) {
    const startFormatted = removeSpacesAfterDots(
      new Intl.DateTimeFormat('hu-HU', options).format(start),
    );
    const endFormatted = new Intl.DateTimeFormat('hu-HU', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(end);
    return `${startFormatted} - ${endFormatted}`;
  }
  const startFormatted = removeSpacesAfterDots(
    new Intl.DateTimeFormat('hu-HU', options).format(start),
  );
  const endFormatted = removeSpacesAfterDots(new Intl.DateTimeFormat('hu-HU', options).format(end));
  return `${startFormatted} - ${endFormatted}`;
};

export const fetchCardById = async (id: number) => {
  return getEventById(id);
};

export const fetchWebsiteById = async (id: number) => {
  return getOrganizerWebsite(id)
}
