import { categoryTitleLookup } from '@/lib/constants';
import { type Category } from '@/lib/definitions';
import Link from 'next/link';
import Card from './card';
import { placeHolderCards } from '@/lib/placeholder-data';

const getCardsByCategory = (category: Category) => {
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

export default function Category({ category }: { category: Category }) {
  const cards = getCardsByCategory(category);
  return (
    <article className='flex flex-col gap-y-3'>
      <h3 className='text-2xl font-semibold md:text-3xl'>
        {categoryTitleLookup[category]}
      </h3>
      <div className='snap-x snap-mandatory overflow-auto md:overflow-visible'>
        <div className='grid min-h-fit min-w-fit grid-flow-col place-content-between gap-4 pb-2'>
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
        className='mt-1 cursor-default self-center text-center text-lg text-pretty text-blue-500 hover:underline md:text-xl'
      >
        További lehetőségek
      </Link>
    </article>
  );
}
