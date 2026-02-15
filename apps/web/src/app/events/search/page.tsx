import Navbar from '@/components/landing/navbar';
import SearchMain from '@/components/search/main';

export default function DetailedSearchPage() {
  return (
    <div className='flex min-h-screen w-full flex-col items-center overflow-hidden'>
      <header className='main-gradient flex h-60 w-full items-start px-3 pt-6 md:h-50 md:px-18'>
        <div className='container mx-auto flex flex-col justify-center gap-6'>
          <Navbar />
          <h1 className='text-2xl font-bold md:text-3xl'>Részletes keresés és szűrés</h1>
        </div>
      </header>
      <div className='mx-3 -mt-20 grow md:mx-18 md:-mt-15'>
        <SearchMain />
      </div>
    </div>
  );
}
