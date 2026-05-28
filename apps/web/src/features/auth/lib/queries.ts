import { db } from '@/database';
import { events } from '@/database/schema/events';
import { user } from '@/database/schema/auth';
import { eq } from 'drizzle-orm';

export async function getOrganizerWebsite(id: number): Promise<string | null> {
  const rows = await db
    .select({ website: user.website })
    .from(events)
    .innerJoin(user, eq(user.id, events.organizerId))
    .where(eq(events.id, id))
    .limit(1);

  const row = rows[0];
  if (!row || !row.website) return null;

  return row.website;
}
