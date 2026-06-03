import { db } from '@/database';
import { events } from '@/database/schema';
import { user } from '@/database/schema/auth';
import { eq, desc } from 'drizzle-orm';
import type { EventData, OrgData } from '@/components/dashboard/types';
import { toEventData, toOrgData } from './mappers';

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

  return rows.map((event) => toEventData(event));
}
