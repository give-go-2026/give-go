import Category from '@/components/landing/category';
import Description from '@/components/landing/description';
import Header from '@/components/landing/header';
import { CategorySkeleton } from '@/components/ui/skeletons';
import { Suspense } from 'react';

export default function EventsPage() {
  return (
    <div className='min-h-screen overflow-hidden'>
      <Header />
      <main className='mx-auto mt-22 max-w-416 px-3 md:mt-10 md:px-30 md:py-5'>
        <Description />
        <section className='flex flex-col gap-8 pt-5 md:mt-4'>
          <Suspense fallback={<CategorySkeleton category='upcoming' />}>
            <Category category='upcoming' />
          </Suspense>
          <Suspense fallback={<CategorySkeleton category='permanent' />}>
            <Category category='permanent' />
          </Suspense>
          <Suspense fallback={<CategorySkeleton category='popular' />}>
            <Category category='popular' />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
