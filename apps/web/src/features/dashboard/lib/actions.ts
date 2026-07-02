'use server';

import { auth } from '@/lib/auth';
import { db } from '@/database';
import { events } from '@/database/schema';
import { user } from '@/database/schema/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';
import type { EventData, OrgData } from '@/components/dashboard/types';
import { dbValuesFromEvent } from './mappers';
import { sanitizeHelpMode } from '@/features/events/lib/help-mode';

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

    await db
      .update(events)
      .set(dbValuesFromEvent({ ...event, helpMode: sanitizeHelpMode(event.helpMode) }))
      .where(eq(events.id, eventId));
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
    // Ownership is enforced inline; tags now derive from events.theme, so there is no event_tags row to clean up.
    await db
      .delete(events)
      .where(and(eq(events.id, eventId), eq(events.organizerId, currentUser.id)));
  } catch {
    return { error: 'Hiba történt az esemény törlése során. Próbáld újra!' };
  }

  revalidatePath('/dashboard');
  return null;
}
