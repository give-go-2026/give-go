import { placeHolderCards } from './placeholder-data';

export const formatDuration = (start: Date, end: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };
  if (start.getDate() === end.getDate()) {
    const startFormatted = new Intl.DateTimeFormat('hu-HU', options).format(start);
    const endFormatted = new Intl.DateTimeFormat('hu-HU', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(end);
    return `${startFormatted} - ${endFormatted}`;
  }
  const startFormatted = new Intl.DateTimeFormat('hu-HU', options).format(start);
  const endFormatted = new Intl.DateTimeFormat('hu-HU', options).format(end);
  return `${startFormatted} - ${endFormatted}`;
};

export const fetchCardById = async (id: number) => {
  const card = placeHolderCards.find((card) => card.id === id);
  return card || null;
};
