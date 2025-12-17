import { Metadata } from 'next';
import { env } from './env';
import { Category, Tag } from './definitions';

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

export const categoryTitleLookup: Readonly<Record<Category, string>> = {
  upcoming: 'Hamarosan Közelgő Események',
  permanent: 'Állandó Segítségnyújtás',
  popular: 'Népszerű önkénteskedések',
} as const;

export const categories = ['upcoming', 'permanent', 'popular'] as const;

export const tags: ReadonlyArray<Tag> = [
  {
    name: 'Gyerekek',
    color: '#0DCAF0',
  },
  {
    name: 'Fizikai',
    color: '#6C757D',
  },
  {
    name: 'Egyszeri',
    color: '#198754',
  },
  {
    name: 'Rendszeres',
    color: '#DC3545',
  },
  {
    name: 'Adminisztratív',
    color: '#FFC107',
  },
  {
    name: 'Kutya',
    color: '#0D6EFD',
  },
];
