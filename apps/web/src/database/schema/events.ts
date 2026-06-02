import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { user } from './auth';

export const workTypeEnum = pgEnum('work_type', [
  'fizikai',
  'szociális',
  'irodai',
  'Adminisztráció, Asszisztens, Irodai munka',
  'Projekt Menedzsment',
  'Egészségügy',
  'Építőipar, Ingatlan',
  'Értékesítés, Kereskedelem',
  'Fizikai, Segéd, Betanított munka',
  'Gyártás, Termelés',
  'HR, Munkaügy',
  'IT programozás, Fejlesztés',
  'IT üzemeltetés, Telekommunikáció',
  'Jog, Jogi tanácsadás',
  'Marketing, Média, PR',
  'Mérnök',
  'Mezőgazdaság, Környezet',
  'Oktatás, Tudomány, Sport',
  'Pénzügy, Könyvelés',
  'Szállítás, Beszerzés, Logisztika',
  'Ügyfélszolgálat, Vevőszolgálat',
  'Vendéglátás, Idegenforgalom',
]);
export const helpModeEnum = pgEnum('help_mode', ['Online', 'Személyes', 'Hibrid']);

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  color: text('color').notNull(),
});

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  organizerId: text('organizer_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  address: text('address').notNull(),
  theme: text('theme').notNull(),
  workType: workTypeEnum('work_type').notNull(),
  description: text('description').notNull(),
  isRecurring: boolean('is_recurring').notNull().default(false),
  helpMode: helpModeEnum('help_mode').notNull().default('Személyes'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  seriesStartDate: text('series_start_date'),
  seriesEndDate: text('series_end_date'),
  selectedDays: text('selected_days'),
  perDayTimes: text('per_day_times'),
  imageUrl: text('image_url'),
  galleryImages: text('gallery_images').notNull().default('[]'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const eventTags = pgTable(
  'event_tags',
  {
    eventId: integer('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.eventId, t.tagId] })],
);
