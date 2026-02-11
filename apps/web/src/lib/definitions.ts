import { categories } from './constants';

export type GroupingCategory = (typeof categories)[number];
export type Profile = {
  id: number;
  title: string;
  name: string;
};

export type EventCard = {
  id: number;
  title: string;
  address: string;
  start_date: string;
  end_date: string;
  description: string;
  description_long?: string;
  tags: Tag[];
  image_url: string;
  organizer: Organizer;
  gallery_images: string[];
};

export type Organizer = {
  id: number;
  name: string;
  email: string;
  description: string;
};

export type Yes = 'Igen';
export type No = 'Nem';
export type YesNo = Yes | No;

// Table: organizations.json
export interface Organization {
  id: number;
  name: string;
  description: string;
}

// Table: categories.json
export interface Category {
  id: number;
  name: string;
}

// Table: tags.json
export type Tag = {
  id: number;
  name: string;
  color: string;
};

// Table: locations.json
export interface Location {
  id: number;
  city: string;
  district: string | null;
  county: string;
  address: string;
}

// Table: events.json
export type Event = {
  id: number;
  organization_id: number;
  category_id: number;
  location_id: number | null; // Some events might not have a location

  title: string;
  summary: string;
  description: string;
  time_range: string; // Format: "HH:MM-HH:MM"

  // Status flags
  is_recurring: YesNo;
  is_one_time: YesNo;
  is_in_person: YesNo;
  is_hybrid: YesNo;
  is_online: YesNo;
};

// Table: event_dates.json
// Relationship: One Event has Many Dates
export interface EventDate {
  id: number;
  event_id: number; // FK -> Event.id
  date: string; // Format: "YYYY.MM.DD"
}

// Table: event_tags.json
// Relationship: Many-to-Many Join Table between Events and Tags
export interface EventTag {
  event_id: number; // FK -> Event.id
  tag_id: number; // FK -> Tag.id
}
