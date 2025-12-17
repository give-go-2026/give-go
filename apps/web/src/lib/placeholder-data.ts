import { tags } from './constants';
import { EventCard } from './definitions';

export const placeHolderEventCard = (id: number): EventCard => ({
  id,
  title: 'Óvoda festés Szigetszentmiklóson',
  address: '2300 Szigetszentmiklós, Karakas Bence 100.',
  start_date: '2025. 11. 10. 10:00',
  end_date: '2025. 11. 10. 17:00',
  organizer: 'MentaPRO Alapítvány a Cukorbetegséggel Élő Gyerekek Családjaiért',
  organizer_email: 'merenyi.miklos5@gmail.com',
  description:
    'Óvodafestés a gyerekeknek. Gyere el festeni. Nagyon rossz állapotú az óvoda, milyen jó lenne, ha jó lenne. Képek a részletekben.',
  tags: tags.slice(0, 3),
  image_url: '/card-placeholder-image.png',
});

export const placeHolderCards = [
  placeHolderEventCard(1),
  placeHolderEventCard(2),
  placeHolderEventCard(3),
  placeHolderEventCard(4),
  placeHolderEventCard(5),
  placeHolderEventCard(6),
  placeHolderEventCard(7),
  placeHolderEventCard(8),
  placeHolderEventCard(9),
];
