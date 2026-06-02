'use server';

import { auth } from '@/lib/auth';
import { db } from '@/database';
import { events, eventTags, tags } from '@/database/schema';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { inArray } from 'drizzle-orm';

type WorkType = 'fizikai' | 'szociális' | 'irodai';
type HelpMode = 'Online' | 'Személyes' | 'Hibrid';

export type CreateEventInput = {
  eventName: string;
  eventAddress: string;
  eventTheme: string;
  eventType: WorkType;
  eventTags: string[];
  helpFrequency: string;
  helpMode: HelpMode;
  desc: string;
  eventImages?: string[];
  eventStartDate?: string;
  eventStartTime?: string;
  eventEndDate?: string;
  eventEndTime?: string;
  seriesStartDate?: string;
  seriesEndDate?: string;
  selectedDays?: number[];
  startTime?: string;
  endTime?: string;
  perDayTimes?: Record<string, { start: string; end: string }>;
};

export async function createEventAction(input: CreateEventInput): Promise<{ error: string } | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== 'org') {
    return { error: 'Csak szervezetek hozhatnak létre eseményt.' };
  }

  const isRecurring = input.helpFrequency === 'Rendszeres';

  const startDate = isRecurring
    ? `${input.seriesStartDate ?? ''} ${input.startTime ?? ''}`.trim()
    : `${input.eventStartDate ?? ''} ${input.eventStartTime ?? ''}`.trim();

  const endDate = isRecurring
    ? `${input.seriesEndDate ?? ''} ${input.endTime ?? ''}`.trim()
    : `${input.eventEndDate ?? ''} ${input.eventEndTime ?? ''}`.trim();

  try {
    const [event] = await db
      .insert(events)
      .values({
        organizerId: session.user.id,
        title: input.eventName,
        address: input.eventAddress,
        theme: input.eventTheme,
        workType: input.eventType,
        description: input.desc,
        isRecurring,
        helpMode: input.helpMode,
        startDate: startDate || null,
        endDate: endDate || null,
        seriesStartDate: input.seriesStartDate ?? null,
        seriesEndDate: input.seriesEndDate ?? null,
        selectedDays: input.selectedDays ? JSON.stringify(input.selectedDays) : null,
        perDayTimes: input.perDayTimes ? JSON.stringify(input.perDayTimes) : null,
        imageUrl: input.eventImages?.[0] ?? null,
        galleryImages: JSON.stringify(input.eventImages ?? []),
      })
      .returning();

    if (input.eventTags.length > 0) {
      const matchedTags = await db
        .select({ id: tags.id })
        .from(tags)
        .where(inArray(tags.name, input.eventTags));

      if (matchedTags.length > 0) {
        await db.insert(eventTags).values(
          matchedTags.map((t) => ({ eventId: event!.id, tagId: t.id })),
        );
      }
    }
  } catch (error) {
    console.error('Esemény mentése sikertelen:', error);
    return { error: 'Hiba történt az esemény mentése során. Próbáld újra!' };
  }

  redirect('/create/success');
}
