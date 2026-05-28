import { categoryTitleLookup } from '@/lib/constants';
import { type GroupingCategory } from '@/lib/definitions';
import Link from 'next/link';
import Card from './card';
import { getEventsByCategory } from '@/features/events/lib/queries';

export default async function Category({ category }: { category: GroupingCategory }) {
  const cards = await getEventsByCategory(category);
  if (cards.length === 0) return null;
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
