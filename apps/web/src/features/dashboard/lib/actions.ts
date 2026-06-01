'use server';

import { auth } from '@/lib/auth';
import { db } from '@/database';
import { events, eventTags, tags } from '@/database/schema';
import { user } from '@/database/schema/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { and, eq, inArray } from 'drizzle-orm';
import type { EventData, OrgData } from '@/components/dashboard/types';
import { dbValuesFromEvent } from './mappers';

type ActionResult = { error: string } | null;

async function requireOrg() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== 'org') return null;
  return session.user;
}

export async function updateOrgAction(org: OrgData): Promise<ActionResult> {
  const currentUser = await requireOrg();
  if (!currentUser) return { error: 'Nincs jogosultság a művelethez.' };

  try {
    // Email is the Better-Auth login identity and is intentionally not updated here.
    await db
      .update(user)
      .set({
        name: org.orgName,
        contactName: org.userName || null,
        contactPhone: org.userPhone || null,
        website: org.orgWeb || null,
        registrationNumber: org.orgNum || null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, currentUser.id));
  } catch {
    return { error: 'Hiba történt a szervezet adatainak mentése során. Próbáld újra!' };
  }

  revalidatePath('/dashboard');
  return null;
}

export async function updateEventAction(event: EventData): Promise<ActionResult> {
  const currentUser = await requireOrg();
  if (!currentUser) return { error: 'Nincs jogosultság a művelethez.' };

  const eventId = Number(event.id);
  if (!Number.isInteger(eventId)) return { error: 'Érvénytelen esemény azonosító.' };

  try {
    const existing = await db
      .select({ organizerId: events.organizerId })
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (!existing[0] || existing[0].organizerId !== currentUser.id) {
      return { error: 'Ez az esemény nem szerkeszthető.' };
    }

    await db.update(events).set(dbValuesFromEvent(event)).where(eq(events.id, eventId));

    // Replace the event's tags to match the edited selection.
    await db.delete(eventTags).where(eq(eventTags.eventId, eventId));

    if (event.eventTags.length > 0) {
      const matchedTags = await db
        .select({ id: tags.id })
        .from(tags)
        .where(inArray(tags.name, event.eventTags));

      if (matchedTags.length > 0) {
        await db.insert(eventTags).values(matchedTags.map((t) => ({ eventId, tagId: t.id })));
      }
    }
  } catch {
    return { error: 'Hiba történt az esemény mentése során. Próbáld újra!' };
  }

  revalidatePath('/dashboard');
  return null;
}

export async function deleteEventAction(id: string): Promise<ActionResult> {
  const currentUser = await requireOrg();
  if (!currentUser) return { error: 'Nincs jogosultság a művelethez.' };

  const eventId = Number(id);
  if (!Number.isInteger(eventId)) return { error: 'Érvénytelen esemény azonosító.' };

  try {
    // Ownership check is enforced inline; cascade removes the event_tags rows.
    await db
      .delete(events)
      .where(and(eq(events.id, eventId), eq(events.organizerId, currentUser.id)));
  } catch {
    return { error: 'Hiba történt az esemény törlése során. Próbáld újra!' };
  }

  revalidatePath('/dashboard');
  return null;
}
