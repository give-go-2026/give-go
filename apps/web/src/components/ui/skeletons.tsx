import { categoryTitleLookup } from '@/lib/constants';
import { type Category } from '@/lib/definitions';
import Link from 'next/link';

export function CardSkeleton() {
  return (
    <div className='bg-foreground/50 h-133.75 w-75 animate-pulse snap-center rounded-3xl shadow-xl md:w-83.75'></div>
  );
}

export function CategorySkeleton({ category }: { category: Category }) {
  return (
    <article className='flex flex-col gap-3'>
      <h3 className='text-2xl font-semibold md:text-3xl'>{categoryTitleLookup[category]}</h3>
      <div className='snap-x snap-mandatory overflow-auto md:overflow-visible'>
        <div className='grid min-h-fit min-w-fit grid-flow-col gap-4 pb-2'>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
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
