import { categoryTitleLookup } from '@/lib/constants';
import { type GroupingCategory } from '@/lib/definitions';
import Link from 'next/link';

export function CardSkeleton() {
  return (
    <div className='h-max max-h-133.75 w-73.5 snap-center rounded-3xl shadow-xl md:w-100'>
      <div className='flex h-full flex-col overflow-clip rounded-3xl'>
        <div className='bg-foreground/50 h-35 w-full animate-pulse' />
        <div className='flex flex-1 flex-col gap-1 p-4'>
          <div className='flex gap-2'>
            <div className='bg-foreground/50 h-6 w-16 animate-pulse rounded-full' />
            <div className='bg-foreground/50 h-6 w-20 animate-pulse rounded-full' />
            <div className='bg-foreground/50 h-6 w-20 animate-pulse rounded-full' />
          </div>
          <div className='bg-foreground/50 mt-1 h-7 w-3/4 animate-pulse rounded' />
          <div className='bg-foreground/50 h-5 w-1/2 animate-pulse rounded' />
          <div className='bg-foreground/50 h-6 w-2/3 animate-pulse rounded' />
          <div className='bg-foreground/50 h-4 w-1/3 animate-pulse rounded' />
          <div className='bg-foreground/50 h-18.75 w-full animate-pulse rounded' />
          <div className='mt-2 flex justify-between gap-2'>
            <div className='bg-foreground/50 h-10 flex-1 animate-pulse rounded' />
            <div className='bg-foreground/50 h-10 flex-1 animate-pulse rounded' />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CategorySkeleton({ category }: { category: GroupingCategory }) {
  return (
    <article className='flex flex-col'>
      <h3 className='ml-5 text-2xl font-semibold md:text-3xl'>{categoryTitleLookup[category]}</h3>
      <div className='snap-x snap-mandatory overflow-auto'>
        <div className='grid min-h-fit min-w-fit grid-flow-col place-content-between gap-4 px-5 pt-5 pb-10'>
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
