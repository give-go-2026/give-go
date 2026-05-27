import { db } from '.';
import { tags } from './schema';

const seedTags = [
  { name: 'Idősek', color: '#6C757D' },
  { name: 'Gyerekek', color: '#0DCAF0' },
  { name: 'Fiatalok', color: '#198754' },
  { name: 'Hajléktalanok', color: '#DC3545' },
  { name: 'Fogyatékossággal élők', color: '#FFC107' },
  { name: 'Szegregátumok', color: '#0D6EFD' },
  { name: 'Iskolák', color: '#20C997' },
  { name: 'Kutyák', color: '#FD7E14' },
  { name: 'Macskák', color: '#E83E8C' },
  { name: 'Madarak', color: '#6F42C1' },
  { name: 'Kacsák', color: '#17A2B8' },
  { name: 'Fajtamentés', color: '#28A745' },
];

await db.insert(tags).values(seedTags).onConflictDoNothing();
console.log('Tags seeded.');
process.exit(0);
