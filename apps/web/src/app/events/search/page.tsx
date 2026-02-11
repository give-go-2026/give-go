import Navbar from '@/components/landing/navbar';
import SearchMain from '@/components/search/main';

export default function DetailedSearchPage() {
  return (
    <div className='flex min-h-screen w-full flex-col items-center overflow-hidden'>
      <header className='main-gradient flex h-50 w-full items-start pt-6'>
        <div className='container mx-auto flex flex-col justify-center gap-6'>
          <Navbar />
          <h1 className='text-3xl font-bold'>Részletes keresés és szűrés</h1>
        </div>
      </header>
      <SearchMain />
    </div>
  );
}
