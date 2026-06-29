import { db } from '@/database';
import { events, tags as tagsTable } from '@/database/schema';
import { user } from '@/database/schema/auth';
import { and, desc, eq, ilike, inArray, or, sql, type SQL } from 'drizzle-orm';
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

/**
 * Extracts the city from a free-text address.
 * The create flow stores addresses comma-separated as "Irányítószám, Település, Utca, Házszám",
 * so the second token is the city. Falls back to the whole trimmed address otherwise.
 */
function cityFromAddress(address: string): string {
  const parts = address.split(',').map((s) => s.trim());
  return (parts[1] || parts[0] || '').trim();
}

export type EventSearchFilters = {
  query?: string;
  organizations?: string[];
  groups?: string[];
  locations?: string[];
  workTypes?: string[];
  helpModes?: string[];
  recurring?: boolean;
};

export type SearchFilterOptions = {
  organizations: string[];
  groups: string[];
  locations: string[];
  workTypes: string[];
};

/** Options that populate the detailed-search filter inputs (organizations, groups, locations, work types). */
export async function getSearchFilterOptions(): Promise<SearchFilterOptions> {
  const [organizerRows, groupRows, addressRows, workTypeRows] = await Promise.all([
    db
      .selectDistinct({ name: user.name })
      .from(events)
      .innerJoin(user, eq(events.organizerId, user.id)),
    db.select({ name: tagsTable.name }).from(tagsTable),
    db.selectDistinct({ address: events.address }).from(events),
    db.selectDistinct({ workType: events.workType }).from(events),
  ]);

  const organizations = organizerRows
    .map((r) => r.name)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, 'hu'));

  const groups = groupRows.map((r) => r.name).sort((a, b) => a.localeCompare(b, 'hu'));

  const locations = [...new Set(addressRows.map((r) => cityFromAddress(r.address)).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, 'hu'),
  );

  // Sourced from events actually present, so only work types supported by the live DB enum appear.
  const workTypes = workTypeRows
    .map((r) => r.workType)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, 'hu'));

  return { organizations, groups, locations, workTypes };
}

/** Filters events by the detailed-search criteria and returns them as display cards. */
export async function searchEvents(filters: EventSearchFilters): Promise<EventCard[]> {
  const conditions: SQL[] = [];

  // Free-text quick search: match the keyword across the main displayed fields.
  const q = filters.query?.trim();
  if (q) {
    const keywordOr = or(
      ilike(events.title, `%${q}%`),
      ilike(events.description, `%${q}%`),
      ilike(events.theme, `%${q}%`),
      ilike(events.address, `%${q}%`),
    );
    if (keywordOr) conditions.push(keywordOr);
  }

  const orgOr = orIlike(user.name, filters.organizations);
  if (orgOr) conditions.push(orgOr);

  const groupOr = orIlike(events.theme, filters.groups);
  if (groupOr) conditions.push(groupOr);

  const locationOr = orIlike(events.address, filters.locations);
  if (locationOr) conditions.push(locationOr);

  // help_mode is an enum column in the DB, so cast to text before ILIKE.
  const helpModeOr = orIlike(sql`${events.helpMode}::text`, filters.helpModes);
  if (helpModeOr) conditions.push(helpModeOr);

  // Compare as text so work-type labels not present in the DB enum simply don't match
  // (an enum-typed `in (...)` would make Postgres reject unknown labels and fail the query).
  const workTypes = (filters.workTypes ?? []).map((v) => v.trim()).filter(Boolean);
  if (workTypes.length > 0) {
    conditions.push(inArray(sql`${events.workType}::text`, workTypes));
  }

  if (typeof filters.recurring === 'boolean') {
    conditions.push(eq(events.isRecurring, filters.recurring));
  }

  const rows = await db
    .select()
    .from(events)
    .leftJoin(user, eq(events.organizerId, user.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(events.createdAt));

  return rows.filter((r) => r.user !== null).map((r) => toEventCard(r.events, r.user!));
}

/** Builds an OR of case-insensitive substring matches for the given column, or undefined when no values. */
function orIlike(column: Parameters<typeof ilike>[0], values?: string[]): SQL | undefined {
  const cleaned = (values ?? []).map((v) => v.trim()).filter(Boolean);
  if (cleaned.length === 0) return undefined;
  return or(...cleaned.map((v) => ilike(column, `%${v}%`)));
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
