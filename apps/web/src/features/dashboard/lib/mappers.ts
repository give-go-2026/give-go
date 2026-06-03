import type { events } from '@/database/schema';
import type { user } from '@/database/schema/auth';
import type { EventData, OrgData } from '@/components/dashboard/types';

type DbEvent = typeof events.$inferSelect;
type DbUser = typeof user.$inferSelect;

/** Splits a stored `"YYYY.MM.DD HH:MM"` value into its date and time halves. */
function splitDateTime(raw: string | null): { date: string; time: string } {
  if (!raw) return { date: '', time: '' };
  const trimmed = raw.trim();
  const lastSpace = trimmed.lastIndexOf(' ');
  if (lastSpace === -1) return { date: trimmed, time: '' };
  return { date: trimmed.slice(0, lastSpace), time: trimmed.slice(lastSpace + 1) };
}

function parseJsonArray<T>(raw: string | null): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function toOrgData(u: DbUser): OrgData {
  return {
    orgName: u.name,
    userName: u.contactName ?? '',
    userEmail: u.email,
    userPhone: u.contactPhone ?? '',
    orgWeb: u.website ?? '',
    orgNum: u.registrationNumber ?? '',
  };
}

export function toEventData(event: DbEvent, tagNames: string[]): EventData {
  const start = splitDateTime(event.startDate);
  const end = splitDateTime(event.endDate);

  return {
    id: String(event.id),
    eventName: event.title,
    eventAddress: event.address,
    eventTheme: event.theme,
    eventType: event.workType,
    eventTags: tagNames,
    helpFrequency: event.isRecurring ? 'Rendszeres' : 'Egyszeri',
    helpMode: event.helpMode,
    // One-time fields
    eventStartDate: event.isRecurring ? '' : start.date,
    eventStartTime: event.isRecurring ? '' : start.time,
    eventEndDate: event.isRecurring ? '' : end.date,
    eventCloseTime: event.isRecurring ? '' : end.time,
    // Recurring fields
    seriesStartDate: event.seriesStartDate ?? '',
    seriesEndDate: event.seriesEndDate ?? '',
    selectedDays: parseJsonArray<number>(event.selectedDays),
    startTime: event.isRecurring ? start.time : '',
    endTime: event.isRecurring ? end.time : '',
    desc: event.description,
    eventImages: parseJsonArray<string>(event.galleryImages),
  };
}

type EventInsertValues = typeof events.$inferInsert;

/** Maps the editable EventData back to `events` table columns (mirrors createEventAction). */
export function dbValuesFromEvent(
  event: EventData,
): Omit<EventInsertValues, 'organizerId' | 'id' | 'createdAt'> {
  const isRecurring = event.helpFrequency === 'Rendszeres';

  const startDate = isRecurring
    ? `${event.seriesStartDate} ${event.startTime}`.trim()
    : `${event.eventStartDate} ${event.eventStartTime}`.trim();

  const endDate = isRecurring
    ? `${event.seriesEndDate} ${event.endTime}`.trim()
    : `${event.eventEndDate} ${event.eventCloseTime}`.trim();

  return {
    title: event.eventName,
    address: event.eventAddress,
    theme: event.eventTheme,
    workType: event.eventType as EventInsertValues['workType'],
    description: event.desc,
    isRecurring,
    helpMode: event.helpMode as EventInsertValues['helpMode'],
    startDate: startDate || null,
    endDate: endDate || null,
    seriesStartDate: isRecurring ? (event.seriesStartDate || null) : null,
    seriesEndDate: isRecurring ? (event.seriesEndDate || null) : null,
    selectedDays: isRecurring && event.selectedDays.length > 0 ? JSON.stringify(event.selectedDays) : null,
    imageUrl: event.eventImages[0] ?? null,
    galleryImages: JSON.stringify(event.eventImages),
    updatedAt: new Date(),
  };
}
