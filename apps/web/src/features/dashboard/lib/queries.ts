import { db } from '@/database';
import { events, eventTags, tags } from '@/database/schema';
import { user } from '@/database/schema/auth';
import { eq, desc, inArray } from 'drizzle-orm';
import type { EventData, OrgData } from '@/components/dashboard/types';
import { toEventData, toOrgData } from './mappers';

/** Maps each event id to its tag names. */
async function tagNamesByEvent(eventIds: number[]): Promise<Map<number, string[]>> {
  if (eventIds.length === 0) return new Map();

  const rows = await db
    .select({ eventId: eventTags.eventId, name: tags.name })
    .from(eventTags)
    .innerJoin(tags, eq(eventTags.tagId, tags.id))
    .where(inArray(eventTags.eventId, eventIds));

  const map = new Map<number, string[]>();
  for (const row of rows) {
    const existing = map.get(row.eventId) ?? [];
    existing.push(row.name);
    map.set(row.eventId, existing);
  }
  return map;
}

export async function getOrgProfile(userId: string): Promise<OrgData | null> {
  const rows = await db.select().from(user).where(eq(user.id, userId)).limit(1);
  const row = rows[0];
  return row ? toOrgData(row) : null;
}

export async function getEventsByOrganizer(userId: string): Promise<EventData[]> {
  const rows = await db
    .select()
    .from(events)
    .where(eq(events.organizerId, userId))
    .orderBy(desc(events.createdAt));

  if (rows.length === 0) return [];

  const tagMap = await tagNamesByEvent(rows.map((r) => r.id));

  return rows.map((event) => toEventData(event, tagMap.get(event.id) ?? []));
}
