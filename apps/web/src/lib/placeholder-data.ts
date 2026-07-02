import { tags } from './constants';
import { EventCard } from './definitions';

export const placeHolderEventCard = (id: number): EventCard => ({
  id,
  organizerId: '1',
  title: 'Óvoda festés Szigetszentmiklóson',
  address: '2300 Szigetszentmiklós, Karakas Bence 100.',
  start_date: '2025. 11. 10. 10:00',
  end_date: '2025. 11. 10. 17:00',
  organizer: {
    id: 1,
    name: 'MentaPRO Alapítvány a Cukorbetegséggel Élő Gyerekek Családjaiért',
    email: 'merenyi.miklos5@gmail.com',
    description:
      'A MáSzínház közösségének tagjai értelmileg fogyatékos és tipikus fejlődésű gyerekek és felnőttek, önkéntes segítők és színházi szakemberek. A közös munkánkban a bemutatóval egyenértékűen fontos az azt megelőző nevelési folyamat. Drámajátékaink az emberépítést célozzák, feladatuk a személyiségformálás, a kapcsolatfelvétel, a kapcsolattartás, a közlés megkönnyítése. A dráma szó jelentése: tenni, cselekedni. Jelentéséből következik, hogy aktív részvételt, cselekvést követel minden játékostól. A résztvevők passzív szemlélőből aktív, a történéseket maguk alakító, változtató játékossá válnak, akik egy saját önkifejezési móddal képessé válnak a társadalom felé is kommunikálni, amit érdemes, sőt fontos tudni róluk.',
  },
  description:
    'Óvodafestés a gyerekeknek. Gyere el festeni. Nagyon rossz állapotú az óvoda, milyen jó lenne, ha jó lenne. Képek a részletekben.',
  description_long:
    'Szeretnél tenni valami jót a közösségedért? Csatlakozz hozzánk egy közös óvodafestésre Szigetszentmiklóson! A célunk, hogy megszépítsük az óvoda falait, és vidám, tiszta környezetet teremtsünk a gyerekeknek. Nem kell hoznod semmit, minden eszközt és festéket mi biztosítunk. Ha szeretsz közösségben dolgozni, szívesen segítesz, és jó hangulatban festenél velünk, jelentkezz önkéntesnek!',
  tags: tags.slice(0, 3),
  image_url: '/card-placeholder-image.png',
  gallery_images: [
    '/gallery-image-1.png',
    '/gallery-image-2.png',
    '/gallery-image-3.png',
    '/gallery-image-4.png',
  ],
});

export const placeHolderCards = Array.from({ length: 9 }).map((_, index) =>
  placeHolderEventCard(index + 1),
);
