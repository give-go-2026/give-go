'use cache';

import Navbar from './navbar';
import QuickSearchBar from './quick-search';

export default async function Header() {
  return (
    <header className='main-gradient w-full'>
      <section className='mx-auto flex w-full max-w-416 flex-col gap-4 px-3 py-4 md:gap-6 md:px-28 md:py-5'>
        <Navbar />
        <h1 className='w-[90%] text-3xl font-bold tracking-wider md:text-4xl'>
          Segíteni könnyebb, mint gondolnád!
        </h1>
        <div className='hidden w-fit rounded-md bg-sky-300 px-3 text-lg select-none md:block'>
          Béta
        </div>
        <QuickSearchBar />
      </section>
    </header>
  );
}
