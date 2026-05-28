import { db } from '@/database';
import { events, eventTags, tags } from '@/database/schema';
import { user } from '@/database/schema/auth';
import { eq, desc, inArray } from 'drizzle-orm';
import { type EventCard, type Tag } from '@/lib/definitions';

type DbEvent = typeof events.$inferSelect;
type DbUser = Pick<typeof user.$inferSelect, 'id' | 'name' | 'email'>;
type DbTag = typeof tags.$inferSelect;

function galleryFromJson(raw: string): string[] {
  try {
    const imgs: string[] = JSON.parse(raw);
    return imgs.length > 0
      ? imgs
      : ['/gallery-image-1.png', '/gallery-image-2.png', '/gallery-image-3.png', '/gallery-image-4.png'];
  } catch {
    return ['/gallery-image-1.png', '/gallery-image-2.png', '/gallery-image-3.png', '/gallery-image-4.png'];
  }
}

function toEventCard(event: DbEvent, org: DbUser, eventTagList: DbTag[]): EventCard {
  const mappedTags: Tag[] = eventTagList.map((t) => ({
    id: t.id,
    name: t.name,
    color: t.color,
  }));

  return {
    id: event.id,
    title: event.title,
    address: event.address,
    start_date: event.startDate ?? event.seriesStartDate ?? '',
    end_date: event.endDate ?? event.seriesEndDate ?? '',
    description: event.description,
    tags: mappedTags,
    image_url: event.imageUrl ?? '/card-placeholder-image.png',
    organizer: {
      id: 1,
      name: org.name,
      email: org.email,
      description: '',
    },
    gallery_images: galleryFromJson(event.galleryImages),
  };
}

async function attachTags(eventIds: number[]): Promise<Map<number, DbTag[]>> {
  if (eventIds.length === 0) return new Map();

  const rows = await db
    .select({ eventId: eventTags.eventId, tag: tags })
    .from(eventTags)
    .innerJoin(tags, eq(eventTags.tagId, tags.id))
    .where(inArray(eventTags.eventId, eventIds));

  const map = new Map<number, DbTag[]>();
  for (const row of rows) {
    const existing = map.get(row.eventId) ?? [];
    existing.push(row.tag);
    map.set(row.eventId, existing);
  }
  return map;
}

export async function getEventsByCategory(category: 'upcoming' | 'permanent' | 'popular'): Promise<EventCard[]> {
  const rows = await db
    .select()
    .from(events)
    .leftJoin(user, eq(events.organizerId, user.id))
    .where(
      category === 'upcoming'
        ? eq(events.isRecurring, false)
        : category === 'permanent'
          ? eq(events.isRecurring, true)
          : undefined,
    )
    .orderBy(desc(events.createdAt))
    .limit(3);

  const validRows = rows.filter((r) => r.user !== null);
  if (validRows.length === 0) return [];

  const tagMap = await attachTags(validRows.map((r) => r.events.id));

  return validRows.map((r) =>
    toEventCard(r.events, r.user!, tagMap.get(r.events.id) ?? []),
  );
}

export async function getEventById(id: number): Promise<EventCard | null> {
  const rows = await db
    .select()
    .from(events)
    .leftJoin(user, eq(events.organizerId, user.id))
    .where(eq(events.id, id))
    .limit(1);

  const row = rows[0];
  if (!row || !row.user) return null;

  const tagMap = await attachTags([id]);

  return toEventCard(row.events, row.user, tagMap.get(id) ?? []);
}
