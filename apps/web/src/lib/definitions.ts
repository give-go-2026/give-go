import { categories } from './constants';

export type Category = (typeof categories)[number];
export type Tag = {
  name: string;
  color: string;
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
