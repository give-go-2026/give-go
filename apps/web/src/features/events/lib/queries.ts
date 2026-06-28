import { db } from '@/database';
import { events } from '@/database/schema';
import { user } from '@/database/schema/auth';
import { eq, desc } from 'drizzle-orm';
import { type EventCard, type Tag } from '@/lib/definitions';

type DbEvent = typeof events.$inferSelect;
type DbUser = Pick<typeof user.$inferSelect, 'id' | 'name' | 'email' | 'description'>;

// Palette mirrors the seeded tag colors (database/seed.ts).
const THEME_TAG_COLORS = [
  '#6C757D',
  '#0DCAF0',
  '#198754',
  '#DC3545',
  '#FFC107',
  '#0D6EFD',
  '#20C997',
  '#FD7E14',
  '#E83E8C',
  '#6F42C1',
  '#17A2B8',
  '#28A745',
];

/** Splits a comma-separated theme string into trimmed, non-empty tag names. */
function splitTheme(theme: string): string[] {
  return theme
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Deterministically maps a tag name to a palette color, so the same tag is always the same color. */
function colorForTag(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return THEME_TAG_COLORS[Math.abs(hash) % THEME_TAG_COLORS.length]!;
}

/** Derives the displayed tags from an event's free-text theme field. */
function themeToTags(theme: string): Tag[] {
  return splitTheme(theme).map((name, index) => ({
    id: index,
    name,
    color: colorForTag(name),
  }));
}

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

function toEventCard(event: DbEvent, org: DbUser): EventCard {
  return {
    id: event.id,
    organizerId: event.organizerId,
    title: event.title,
    address: event.address,
    start_date: event.startDate ?? event.seriesStartDate ?? '',
    end_date: event.endDate ?? event.seriesEndDate ?? '',
    description: event.description,
    tags: themeToTags(event.theme),
    image_url: event.imageUrl ?? '/card-placeholder-image.png',
    organizer: {
      id: 1,
      name: org.name,
      email: org.email,
      description: org.description ?? '',
    },
    gallery_images: galleryFromJson(event.galleryImages),
  };
}

/** Distinct tag names already used across events — the source for tag autocomplete. */
export async function getUsedTags(): Promise<string[]> {
  const rows = await db.selectDistinct({ theme: events.theme }).from(events);

  const set = new Set<string>();
  for (const row of rows) {
    for (const name of splitTheme(row.theme)) set.add(name);
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'hu'));
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

  return validRows.map((r) => toEventCard(r.events, r.user!));
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

  return toEventCard(row.events, row.user);
}
