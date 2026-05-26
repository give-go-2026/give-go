import { categoryTitleLookup } from '@/lib/constants';
import { type GroupingCategory } from '@/lib/definitions';
import Link from 'next/link';
import Card from './card';
import { placeHolderCards } from '@/lib/placeholder-data';

const getCardsByCategory = (category: GroupingCategory) => {
  switch (category) {
    case 'upcoming':
      return placeHolderCards.slice(0, 3);
    case 'permanent':
      return placeHolderCards.slice(3, 6);
    case 'popular':
      return placeHolderCards.slice(6, 9);
    default:
      return placeHolderCards;
  }
};

export default function Category({ category }: { category: GroupingCategory }) {
  const cards = getCardsByCategory(category);
  return (
    <article className='flex flex-col'>
      <h3 className='ml-5 text-2xl font-semibold md:text-3xl'>{categoryTitleLookup[category]}</h3>
      <div className='snap-x snap-mandatory overflow-auto'>
        <div className='grid min-h-fit min-w-fit grid-flow-col place-content-between gap-4 px-5 pt-5 pb-10'>
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
            />
          ))}
        </div>
      </div>
      <Link
        href={'/'}
        className='mt-5 cursor-default self-center text-center text-lg text-pretty text-blue-500 hover:underline md:text-xl xl:mt-0'
      >
        További lehetőségek
      </Link>
    </article>
  );
}
