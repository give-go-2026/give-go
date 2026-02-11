import { Metadata } from 'next';
import { env } from './env';
import { GroupingCategory, Profile, Tag } from './definitions';

export const productName: Readonly<string> = env.NEXT_PUBLIC_PRODUCT_NAME;

export const metadataDescription: Metadata['description'] =
  'A platform to connect volunteers with projects in need of assistance.' as const;
export const metadataKeywords: Metadata['keywords'] = [
  'volunteer',
  'community service',
  'non-profit',
  'charity',
  'social impact',
  'helping others',
  'önkéntesség',
  'közösségi szolgálat',
  'nonprofit',
  'jótékonyság',
  'társadalmi hatás',
  'segítségnyújtás',
] as const;

export const categoryTitleLookup: Readonly<Record<GroupingCategory, string>> = {
  upcoming: 'Hamarosan Közelgő Események',
  permanent: 'Állandó Segítségnyújtás',
  popular: 'Népszerű önkénteskedések',
} as const;

export const categories = ['upcoming', 'permanent', 'popular'] as const;

export const tags: ReadonlyArray<Tag> = [
  {
    id: 1,
    name: 'Gyerekek',
    color: '#0DCAF0',
  },
  {
    id: 2,
    name: 'Fizikai',
    color: '#6C757D',
  },
  {
    id: 3,
    name: 'Egyszeri',
    color: '#198754',
  },
  {
    id: 4,
    name: 'Rendszeres',
    color: '#DC3545',
  },
  {
    id: 5,
    name: 'Adminisztratív',
    color: '#FFC107',
  },
  {
    id: 6,
    name: 'Kutya',
    color: '#0D6EFD',
  },
];

export const searchProfiles: ReadonlyArray<Profile> = [
  { id: 1, title: 'Segíteni szeretnék', name: 'helping' },
  { id: 2, title: 'Szakmai képességeimet fejlesztem', name: 'professional' },
  { id: 3, title: 'Közösséghez szeretnék tartozni', name: 'community' },
  { id: 4, title: 'Kötelező közösségi szolgálatot teljesítek', name: 'mandatory' },
];
